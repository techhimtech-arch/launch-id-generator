import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Check, Crown, Loader2, QrCode } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { UpiPayModal } from "@/components/UpiPayModal";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const features = [
  "Unlimited PDF & PNG exports",
  "All design templates",
  "Custom card editor (logo, signature, colors)",
  "Bulk print sheet layouts (A4, A3, Letter)",
  "CSV / Excel import & column mapping",
  "Project backup & restore (.json)",
  "Priority email support",
];

export default function Pricing() {
  const { user } = useAuth();
  const { isSubscribed, expiresAt, refresh } = useSubscription();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [upiOpen, setUpiOpen] = useState(false);

  const subscribe = async () => {
    if (!user) {
      nav("/auth?mode=signup");
      return;
    }
    setBusy(true);
    try {
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Failed to load Razorpay");

      const { data, error } = await supabase.functions.invoke("create-razorpay-order");
      if (error || !data?.orderId) throw new Error(error?.message ?? "Order creation failed");

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "ID Card Studio",
        description: "Pro Yearly Subscription",
        order_id: data.orderId,
        prefill: { email: user.email ?? "" },
        theme: { color: "#6366f1" },
        handler: async (resp: any) => {
          try {
            const { data: vData, error: vErr } = await supabase.functions.invoke("verify-razorpay-payment", {
              body: {
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              },
            });
            if (vErr || !vData?.ok) throw new Error(vErr?.message ?? "Verification failed");
            toast({ title: "Payment successful 🎉", description: "Welcome to Pro!" });
            await refresh();
            nav("/account");
          } catch (e: any) {
            toast({ title: "Verification failed", description: e.message, variant: "destructive" });
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.open();
    } catch (e: any) {
      toast({ title: "Payment error", description: e.message ?? String(e), variant: "destructive" });
      setBusy(false);
    }
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "ID Card Studio Pro",
    description: "Unlimited watermark-free ID card exports for schools.",
    offers: { "@type": "Offer", price: "899", priceCurrency: "INR", availability: "https://schema.org/InStock" },
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Pricing — ID Card Studio Pro at ₹899/year"
        description="One simple yearly plan. Unlimited watermark-free PDF & PNG exports, all templates, priority support. Secure Razorpay checkout."
        path="/pricing"
        jsonLd={productJsonLd}
      />
      <AppHeader />
      <main className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Simple, one-price plan</h1>
          <p className="text-muted-foreground">Free to try. Pay once a year to unlock exports.</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border bg-card p-6">
            <div className="text-sm font-medium text-muted-foreground">Free</div>
            <div className="mt-2 text-3xl font-bold">₹0</div>
            <p className="text-xs text-muted-foreground mt-1">Forever</p>
            <ul className="mt-5 space-y-2 text-sm">
              <li className="flex gap-2"><Check className="h-4 w-4 text-muted-foreground mt-0.5" /> Upload CSV / Excel</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-muted-foreground mt-0.5" /> Column mapping & photos</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-muted-foreground mt-0.5" /> Live design preview</li>
              <li className="flex gap-2 text-muted-foreground"><span className="ml-6">—</span> Export disabled</li>
            </ul>
          </div>

          <div className="rounded-xl border-2 border-primary bg-card p-6 relative">
            <div className="absolute -top-3 left-6 px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded">
              MOST POPULAR
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Crown className="h-4 w-4" /> Pro
            </div>
            <div className="mt-2 text-3xl font-bold">₹899<span className="text-base font-normal text-muted-foreground">/year</span></div>
            <p className="text-xs text-muted-foreground mt-1">~₹125/month</p>
            <ul className="mt-5 space-y-2 text-sm">
              {features.map((f) => (
                <li key={f} className="flex gap-2"><Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {f}</li>
              ))}
            </ul>
            {isSubscribed ? (
              <div className="mt-6 rounded-md bg-primary/10 text-primary text-sm font-medium p-3 text-center">
                ✓ Active — expires {expiresAt ? new Date(expiresAt).toLocaleDateString() : ""}
              </div>
            ) : (
              <div className="mt-6 space-y-2">
                <Button className="w-full" onClick={subscribe} disabled={busy}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {user ? "Pay ₹899 with Razorpay" : "Sign up & Subscribe"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => (user ? setUpiOpen(true) : nav("/auth?mode=signup"))}
                >
                  <QrCode className="h-4 w-4" /> Pay ₹899 via UPI / QR
                </Button>
                <p className="text-[11px] text-muted-foreground text-center pt-1">
                  UPI payments are activated manually within a few hours.
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Secure payments by Razorpay or direct UPI. Cards, UPI, NetBanking & wallets supported. GST invoice available on request.
        </p>
      </main>
      <UpiPayModal open={upiOpen} onOpenChange={setUpiOpen} onSubmitted={refresh} />
    </div>
  );
}
