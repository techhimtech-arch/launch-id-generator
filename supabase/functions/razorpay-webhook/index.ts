import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function hmacSha256Hex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const raw = await req.text();
    const signature = req.headers.get("x-razorpay-signature") ?? "";
    const secret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET") ?? "";
    if (!secret) return new Response("Webhook secret not configured", { status: 500 });
    const expected = await hmacSha256Hex(secret, raw);
    if (expected !== signature) return new Response("Invalid signature", { status: 401 });

    const payload = JSON.parse(raw);
    const event = payload?.event;
    const payment = payload?.payload?.payment?.entity;
    if (event === "payment.captured" && payment) {
      const userId = payment?.notes?.user_id;
      const orderId = payment?.order_id;
      const paymentId = payment?.id;
      if (userId && orderId && paymentId) {
        const admin = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );
        // Check if subscription already inserted by verify endpoint
        const { data: existing } = await admin
          .from("subscriptions")
          .select("id")
          .eq("razorpay_payment_id", paymentId)
          .maybeSingle();
        if (!existing) {
          const now = new Date();
          const expires = new Date(now);
          expires.setFullYear(expires.getFullYear() + 1);
          await admin.from("subscriptions").insert({
            user_id: userId,
            status: "active",
            plan: "pro_yearly",
            amount: payment.amount ?? 149900,
            currency: payment.currency ?? "INR",
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentId,
            started_at: now.toISOString(),
            expires_at: expires.toISOString(),
          });
        }
      }
    }
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
