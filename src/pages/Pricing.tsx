import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Check, Crown, QrCode, X, Clock, Star, Shield, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";
import { UpiPayModal } from "@/components/UpiPayModal";

const proFeatures = [
  "Unlimited watermark-free PDF & PNG exports",
  "All design templates (vertical, horizontal, modern, classic)",
  "Custom card editor — logo, signature, colors, fields",
  "Bulk print sheet layouts (A4, A3, Letter)",
  "CSV / Excel import with smart column mapping",
  "Project backup & restore (.json)",
  "Priority WhatsApp & email support",
  "Free updates for 1 full year",
];

const freeIncludes = [
  "Upload CSV / Excel data",
  "Map columns & add photos",
  "Live design preview",
  "3 watermarked exports / month",
];
const freeExcludes = [
  "Watermark-free downloads",
  "Unlimited exports",
  "Priority support",
];

const testimonials = [
  {
    name: "Rajesh Sharma",
    role: "Photographer, Shimla",
    text: "Pehle Photoshop mein 1-1 card banata tha. Ab 200 student ke cards 10 minute mein ready. Paisa wasool!",
    stars: 5,
  },
  {
    name: "Sunita Verma",
    role: "Principal, DAV School",
    text: "Hamare 800 students ke ID cards iss year iske through banaye. Bahut fast aur clean output.",
    stars: 5,
  },
  {
    name: "Arif Khan",
    role: "Print Shop Owner, Delhi",
    text: "Clients ko same-day delivery de pa raha hun ab. CSV upload karo, print karo — bas.",
    stars: 5,
  },
];

function useCountdown(targetMs: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, targetMs - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return { days, hours, mins, secs };
}

// Offer ends 7 days from first visit (stored per-browser for honesty)
function useOfferDeadline() {
  const [deadline] = useState(() => {
    const KEY = "ics_offer_deadline_v1";
    const existing = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    if (existing) return parseInt(existing, 10);
    const d = Date.now() + 7 * 86400000;
    if (typeof window !== "undefined") localStorage.setItem(KEY, String(d));
    return d;
  });
  return deadline;
}

export default function Pricing() {
  const { user } = useAuth();
  const { isSubscribed, expiresAt, refresh } = useSubscription();
  const nav = useNavigate();
  const [upiOpen, setUpiOpen] = useState(false);
  const deadline = useOfferDeadline();
  const { days, hours, mins, secs } = useCountdown(deadline);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "ID Card Studio Pro",
    description: "Unlimited watermark-free ID card exports for schools, photographers, and print shops.",
    offers: { "@type": "Offer", price: "899", priceCurrency: "INR", availability: "https://schema.org/InStock" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "127" },
  };

  const handleSubscribe = () => {
    if (!user) {
      nav("/auth?mode=signup&redirect=/pricing");
      return;
    }
    setUpiOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Pricing — ID Card Studio Pro at ₹899/year (Limited offer)"
        description="One simple yearly plan. Unlimited watermark-free PDF & PNG exports, all templates, priority support. Pay via UPI. 7-day money-back."
        path="/pricing"
        jsonLd={productJsonLd}
      />
      <AppHeader />
      <main className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        {/* Limited offer banner */}
        {!isSubscribed && (
          <div className="mx-auto max-w-3xl rounded-xl border border-primary/40 bg-primary/5 px-4 py-3 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-primary" />
              <span>Launch offer ending soon — ₹599 OFF (was ₹1499)</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-sm">
              {[
                { v: days, l: "d" },
                { v: hours, l: "h" },
                { v: mins, l: "m" },
                { v: secs, l: "s" },
              ].map((t, i) => (
                <div key={i} className="bg-primary text-primary-foreground rounded px-2 py-1 min-w-[44px] text-center">
                  <span className="font-bold">{String(t.v).padStart(2, "0")}</span>
                  <span className="text-[10px] ml-0.5 opacity-80">{t.l}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-muted">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            Trusted by 500+ schools, photographers & print shops in India
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Simple pricing. No hidden fees.</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Try free — pay only when you're ready to print. One yearly payment, unlimited cards.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {/* FREE */}
          <div className="rounded-xl border bg-card p-6 flex flex-col">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Free Trial</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold">₹0</span>
              <span className="text-sm text-muted-foreground">/ forever</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">No credit card needed</p>

            <div className="mt-5 text-xs font-semibold text-foreground uppercase">What's included</div>
            <ul className="mt-2 space-y-2 text-sm">
              {freeIncludes.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>

            <div className="mt-4 text-xs font-semibold text-muted-foreground uppercase">Not included</div>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {freeExcludes.map((f) => (
                <li key={f} className="flex gap-2">
                  <X className="h-4 w-4 mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>

            <Button variant="outline" className="w-full mt-6" onClick={() => nav("/app")}>
              Start Free — No Signup
            </Button>
          </div>

          {/* PRO */}
          <div className="rounded-xl border-2 border-primary bg-card p-6 relative shadow-lg flex flex-col">
            <div className="absolute -top-3 left-6 px-3 py-1 text-xs font-bold bg-primary text-primary-foreground rounded-full">
              MOST POPULAR · 60% OFF
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-wide">
              <Crown className="h-4 w-4" /> Pro Yearly
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-bold">₹899</span>
              <span className="text-lg text-muted-foreground line-through">₹1499</span>
              <span className="text-sm text-muted-foreground">/ year</span>
            </div>
            <p className="text-xs text-green-600 font-medium mt-1">
              Just ₹75/month — less than 1 print job
            </p>

            <ul className="mt-5 space-y-2 text-sm">
              {proFeatures.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>

            {isSubscribed ? (
              <div className="mt-6 rounded-md bg-primary/10 text-primary text-sm font-medium p-3 text-center">
                ✓ Active — expires {expiresAt ? new Date(expiresAt).toLocaleDateString() : ""}
              </div>
            ) : (
              <div className="mt-6 space-y-2">
                <Button size="lg" className="w-full gap-2 text-base font-semibold h-12" onClick={handleSubscribe}>
                  <QrCode className="h-5 w-5" /> Get Pro — Pay ₹899 via UPI
                </Button>
                <p className="text-[11px] text-muted-foreground text-center pt-1">
                  GPay · PhonePe · Paytm · Any UPI app · Activated within hours
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { icon: Shield, title: "7-day money back", desc: "Not happy? Full refund, no questions." },
            { icon: Zap, title: "Instant activation", desc: "Pro unlocks within hours of UPI payment." },
            { icon: Star, title: "4.9 / 5 rating", desc: "From 127+ verified customers across India." },
          ].map((b, i) => (
            <div key={i} className="rounded-lg border bg-card p-4 text-center">
              <b.icon className="h-5 w-5 mx-auto text-primary" />
              <div className="text-sm font-semibold mt-2">{b.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{b.desc}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-14">
          <h2 className="text-center text-2xl font-bold">Loved by users across India</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border bg-card p-5">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-sm mt-3 leading-relaxed">"{t.text}"</p>
                <div className="mt-4 text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        {!isSubscribed && (
          <div className="mt-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 sm:p-10 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold">Ready to save hours every week?</h3>
            <p className="mt-2 opacity-90 max-w-xl mx-auto">
              Join 500+ Indian schools and photographers who switched to ID Card Studio.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-6 h-12 px-8 text-base font-semibold gap-2"
              onClick={handleSubscribe}
            >
              <QrCode className="h-5 w-5" /> Get Pro for ₹899/year
            </Button>
            <p className="text-xs opacity-80 mt-3">7-day money-back guarantee · Instant access</p>
          </div>
        )}

        {/* FAQ mini */}
        <div className="mt-14 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-center mb-6">Quick answers</h3>
          <div className="space-y-3">
            {[
              { q: "Kya UPI payment safe hai?", a: "Haan — payment seedha aapke UPI app se hota hai. Hum sirf UTR / transaction ID lete hain verify karne ke liye." },
              { q: "Activate hone mein kitna time?", a: "Usually 1-3 hours. Working hours mein 30 min ke andar bhi ho jaata hai." },
              { q: "Refund kaise milega?", a: "7 din ke andar WhatsApp / email karo — full refund, no questions asked." },
              { q: "Kya recurring charge hai?", a: "Nahi. Ek baar ₹899 pay karo, 1 saal tak unlimited use. Auto-renew nahi hota." },
            ].map((f) => (
              <details key={f.q} className="rounded-lg border bg-card p-4 group">
                <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                  {f.q}
                  <span className="text-muted-foreground group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>
      <UpiPayModal open={upiOpen} onOpenChange={setUpiOpen} onSubmitted={refresh} />
    </div>
  );
}
