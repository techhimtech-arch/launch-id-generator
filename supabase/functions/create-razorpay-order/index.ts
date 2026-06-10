import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const AMOUNT_PAISE = 149900; // ₹1499

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const user = userData.user;

    const keyId = Deno.env.get("RAZORPAY_KEY_ID")!;
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;
    if (!keyId || !keySecret) {
      return new Response(JSON.stringify({ error: "Razorpay not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const basic = btoa(`${keyId}:${keySecret}`);
    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Basic ${basic}` },
      body: JSON.stringify({
        amount: AMOUNT_PAISE,
        currency: "INR",
        receipt: `sub_${user.id.slice(0, 8)}_${Date.now()}`,
        notes: { user_id: user.id, email: user.email ?? "", plan: "pro_yearly" },
      }),
    });
    if (!orderRes.ok) {
      const text = await orderRes.text();
      console.error("Razorpay order error", orderRes.status, text);
      return new Response(JSON.stringify({ error: "Order create failed", detail: text }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const order = await orderRes.json();
    return new Response(
      JSON.stringify({ orderId: order.id, amount: order.amount, currency: order.currency, keyId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
