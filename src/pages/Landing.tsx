import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  ImageIcon,
  LayoutTemplate,
  Printer,
  QrCode,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import MarketingHeader from "@/components/MarketingHeader";
import Seo from "@/components/Seo";

const features = [
  { icon: FileSpreadsheet, title: "Excel / CSV upload", desc: "Drop your student list, we'll auto-detect Name, Roll No, Class — everything." },
  { icon: ImageIcon, title: "Bulk photo matching", desc: "Upload all photos at once. Auto-match by file name, crop and remove background." },
  { icon: LayoutTemplate, title: "5+ ready templates", desc: "Vertical, horizontal, classic, modern — or design fully custom with drag-and-drop." },
  { icon: Printer, title: "Print-ready sheets", desc: "A4 / Letter / A3 layouts with crop marks. 8–12 cards per page, no setup needed." },
  { icon: QrCode, title: "QR codes built-in", desc: "Encode roll no, admission no or any field. Scan for attendance or verification." },
  { icon: ShieldCheck, title: "Privacy-first", desc: "Your data never leaves your browser. Works fully offline once loaded." },
];

const steps = [
  { n: "1", title: "Upload Excel + photos", desc: "Drag in your student list and a folder of photos. Done in 30 seconds." },
  { n: "2", title: "Map columns & design", desc: "Pick a template, set school name and logo, choose what fields to show." },
  { n: "3", title: "Download & print", desc: "Get a single print-ready PDF with cards laid out per page. Take it to any printer." },
];

const faqs = [
  { q: "Kya yeh free hai?", a: "Haan — 3 free downloads per month with a small watermark. Upgrade to Pro (₹899/year) for unlimited watermark-free downloads." },
  { q: "Kitni cards ek baar mein bana sakte hain?", a: "Unlimited. We've tested with 1000+ student batches in a single PDF." },
  { q: "Kya internet zaroori hai?", a: "Sirf pehli baar app load karne ke liye. Phir aap offline bhi pura kaam kar sakte hain — data aapke browser mein hi rehta hai." },
  { q: "Photo background remove kar sakte hain?", a: "Haan, built-in background eraser tool hai jo ek click mein clean white background bana deta hai." },
  { q: "Schools ke liye bulk discount?", a: "Haan, contact karein. School plan jald hi launch ho raha hai with multi-teacher accounts." },
];

export default function Landing() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "ID Card Studio",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "899", priceCurrency: "INR" },
      description: "Bulk school ID card maker from Excel. Print-ready PDFs in minutes.",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="ID Card Studio — Bulk School ID Card Maker from Excel"
        description="Create 1000+ student ID cards from an Excel sheet in minutes. 5 templates, QR codes, bulk photo upload, print-ready PDFs. Free to try."
        path="/"
        jsonLd={jsonLd}
      />
      <MarketingHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Trusted by schools across India
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight max-w-4xl mx-auto">
            Bulk school ID cards from Excel, <span className="text-primary">in minutes.</span>
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your student list, match photos, pick a template, and download a print-ready PDF.
            No design skills, no installation, no per-card pricing.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="text-base h-12 px-6">
              <Link to="/app">
                Start free — no signup <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base h-12 px-6">
              <Link to="/templates">Browse templates</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            3 free downloads / month · ₹899/year for unlimited
          </p>

          {/* Hero preview mock */}
          <div className="mt-12 sm:mt-16 max-w-4xl mx-auto rounded-2xl border bg-card shadow-2xl overflow-hidden">
            <div className="bg-muted/40 border-b px-4 py-2 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-muted-foreground">idcardstudio.app/app</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-br from-muted/30 to-background">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[54/86] rounded-lg bg-white border-2 border-primary/20 shadow-md flex flex-col p-2.5 sm:p-3 text-left"
                >
                  <div className="h-3 w-16 bg-primary rounded mb-1.5" />
                  <div className="h-2 w-10 bg-muted rounded mb-2" />
                  <div className="flex-1 bg-muted rounded mb-2" />
                  <div className="h-2 w-full bg-muted/70 rounded mb-1" />
                  <div className="h-2 w-3/4 bg-muted/70 rounded mb-1" />
                  <div className="h-2 w-1/2 bg-muted/70 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything a school needs</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Designed with school admins and class teachers in mind. Fast, forgiving, and built to handle messy real-world data.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/30 border-y">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">3 steps. 5 minutes.</h2>
            <p className="mt-3 text-muted-foreground">From Excel sheet to printed ID cards.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="rounded-xl bg-card border p-6">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mb-4">
                  {s.n}
                </div>
                <h3 className="font-semibold mb-1.5">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Simple, honest pricing</h2>
        <p className="mt-3 text-muted-foreground">No per-card fees. No setup costs. One yearly subscription.</p>
        <div className="mt-10 grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          <div className="rounded-xl border bg-card p-6 text-left">
            <div className="text-sm font-medium text-muted-foreground">Free</div>
            <div className="mt-2 text-3xl font-bold">₹0</div>
            <ul className="mt-5 space-y-2 text-sm">
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> 3 downloads / month</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> All templates</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Subtle watermark</li>
            </ul>
          </div>
          <div className="rounded-xl border-2 border-primary bg-card p-6 text-left relative">
            <span className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
              Most popular
            </span>
            <div className="text-sm font-medium text-primary flex items-center gap-1.5">
              <WandSparkles className="h-4 w-4" /> Pro
            </div>
            <div className="mt-2 text-3xl font-bold">
              ₹899<span className="text-sm font-normal text-muted-foreground">/year</span>
            </div>
            <ul className="mt-5 space-y-2 text-sm">
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Unlimited downloads</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Watermark-free</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Priority support</li>
            </ul>
          </div>
        </div>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link to="/pricing">See full pricing <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 border-t">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-10">
            Frequently asked
          </h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-lg border bg-card p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between font-medium">
                  {f.q}
                  <span className="text-muted-foreground transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Ready to skip the Word doc nightmare?</h2>
        <p className="mt-3 text-muted-foreground">Free to try. No signup. Your first cards are 5 minutes away.</p>
        <Button asChild size="lg" className="mt-8 h-12 px-8 text-base">
          <Link to="/app">Start making cards <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">ID Card Studio</span>
            <span>· Made in India</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/templates" className="hover:text-foreground">Templates</Link>
            <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
            <Link to="/app" className="hover:text-foreground">Open app</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
