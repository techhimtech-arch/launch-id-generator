import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const BodySchema = z.object({
  request_id: z.string().uuid(),
  action: z.enum(["approve", "reject"]),
  admin_note: z.string().max(500).optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Identify caller
    const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: userRes, error: uErr } = await userClient.auth.getUser();
    if (uErr || !userRes?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const caller = userRes.user;

    // Service-role client for privileged ops
    const admin = createClient(url, serviceKey);

    // Check admin
    const { data: roleRow } = await admin
      .from("user_roles").select("role").eq("user_id", caller.id).eq("role", "admin").maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { request_id, action, admin_note } = parsed.data;

    const { data: pr, error: prErr } = await admin
      .from("payment_requests").select("*").eq("id", request_id).maybeSingle();
    if (prErr || !pr) {
      return new Response(JSON.stringify({ error: "Request not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (pr.status !== "pending") {
      return new Response(JSON.stringify({ error: `Already ${pr.status}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "approve") {
      const startedAt = new Date();
      const expiresAt = new Date(startedAt);
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const { error: subErr } = await admin.from("subscriptions").insert({
        user_id: pr.user_id,
        amount: (pr.amount ?? 899) * 100,
        currency: pr.currency ?? "INR",
        plan: "pro_yearly",
        status: "active",
        started_at: startedAt.toISOString(),
        expires_at: expiresAt.toISOString(),
        razorpay_payment_id: `upi_${pr.upi_ref}`,
      });
      if (subErr) {
        return new Response(JSON.stringify({ error: subErr.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    await admin.from("payment_requests").update({
      status: action === "approve" ? "approved" : "rejected",
      admin_note: admin_note ?? null,
      reviewed_by: caller.id,
      reviewed_at: new Date().toISOString(),
    }).eq("id", request_id);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
