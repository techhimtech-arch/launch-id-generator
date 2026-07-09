import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Gift,
  ImageIcon,
  LayoutTemplate,
  MessageCircle,
  Printer,
  QrCode,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import MarketingHeader from "@/components/MarketingHeader";
import SiteFooter from "@/components/SiteFooter";
import Seo from "@/components/Seo";
import { LeadMagnetModal } from "@/components/LeadMagnetModal";

const features = [
  { icon: FileSpreadsheet, title: "Excel / CSV upload", desc: "Drop any list — students, staff, members, event attendees. We auto-detect Name, ID, Class and more." },
  { icon: ImageIcon, title: "Bulk photo matching", desc: "Upload all photos at once. Auto-match by file name, crop and remove background in one click." },
  { icon: LayoutTemplate, title: "5+ ready templates", desc: "Vertical, horizontal, classic, modern — or design fully custom with drag-and-drop." },
  { icon: Printer, title: "Print-ready sheets", desc: "A4 / Letter / A3 layouts with crop marks. 8–12 cards per page, no setup needed." },
  { icon: QrCode, title: "QR codes built-in", desc: "Encode roll no, employee ID, membership no or any field. Scan for attendance or verification." },
  { icon: ShieldCheck, title: "Privacy-first", desc: "Your data never leaves your browser. Works fully offline once loaded." },
];

const audiences = [
  { title: "Photographers", desc: "Deliver finished ID cards to schools and offices in hours, not days. Bill per card, keep the margin." },
  { title: "Print shops", desc: "Take walk-in orders — pass a CSV in, hand a print-ready PDF to your printer. No design back-and-forth." },
  { title: "Schools & colleges", desc: "Class teachers and admin staff can make a full batch of student cards without calling a designer." },
  { title: "Offices & events", desc: "Staff cards, visitor passes, conference badges, gym memberships — same workflow, any use case." },
];

const steps = [
  { n: "1", title: "Upload Excel + photos", desc: "Drag in your list and a folder of photos. Done in 30 seconds." },
  { n: "2", title: "Map columns & design", desc: "Pick a template, add logo and brand colors, choose what fields to show." },
  { n: "3", title: "Download & print", desc: "Get a single print-ready PDF with cards laid out per page. Take it to any printer." },
];

const faqs = [
  { q: "Kya yeh free hai?", a: "Haan — aap 3 downloads har mahine free kar sakte hain (chhota watermark rahega). Unlimited aur bina watermark ke liye Pro (₹899/year) best hai." },
  { q: "Kitni cards ek baar mein bana sakte hain?", a: "Koi limit nahi hai! Humne 1000+ cards ek saath test kiye hain, system smooth chalta hai." },
  { q: "Main photographer / print shop hu, kya main ise clients ke liye use kar sakta hu?", a: "Bilkul! Aap ek hi Pro account se unlimited schools aur clients ke ID cards bana sakte hain. Koi per-card extra charge nahi hai." },
  { q: "Kya internet zaroori hai?", a: "Sirf pehli baar load karne ke liye. Uske baad aap 100 din tak bina internet ke (Offline) bhi cards bana sakte hain. Aapka data browser mein hi safe rehta hai." },
  { q: "Mujhe GST bill milega?", a: "Haan, payment ke baad aap support par contact karke GST invoice maang sakte hain." },
];

export default function Landing() {
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadSource, setLeadSource] = useState("landing_hero");
  const openLead = (source: string) => { setLeadSource(source); setLeadOpen(true); };
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
        title="ID Card Studio — Bulk ID Card Maker from Excel"
        description="Create 100s of ID cards from an Excel sheet in minutes. For photographers, print shops, schools and offices. Print-ready PDFs, free to try."
        path="/"
        jsonLd={jsonLd}
      />
      <MarketingHeader />

      <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            For photographers, print shops, schools & offices
          </div>
          <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1]">
            Create 500+ ID Cards in <span className="text-primary">15 Minutes.</span>
          </h1>
          <p className="mt-6 text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stop wasting weeks on manual design. Upload your Excel, match photos automatically, 
            and download print-ready PDFs. <strong>Zero design skills required.</strong>
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="text-base h-12 px-6 shadow-lg hover:shadow-xl transition-shadow gap-2" onClick={() => openLead("landing_hero")}>
              <Gift className="h-4 w-4" /> Get free sample on WhatsApp
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base h-12 px-6">
              <Link to="/app">
                Try live now — no signup <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 px-4 py-1.5 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4" />
            3 free downloads / month · Upgrade to Pro ₹899/year for unlimited
          </div>

          {/* Hero preview mock */}
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto rounded-2xl border bg-card shadow-2xl overflow-hidden relative">
            <div className="absolute top-4 right-4 z-10">
               <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-bounce">
                 SAVES 20+ HOURS PER BATCH
               </div>
            </div>
            <div className="bg-muted/40 border-b px-4 py-2 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-muted-foreground font-mono">idcardstudio.app/generator</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 p-4 sm:p-8 bg-gradient-to-br from-muted/50 to-background">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[54/86] rounded-lg bg-white border-2 border-primary/10 shadow-xl flex flex-col p-2.5 sm:p-3 text-left transform hover:scale-105 transition-transform"
                >
                  <div className="h-3 w-16 bg-primary/80 rounded mb-1.5" />
                  <div className="h-2 w-10 bg-muted rounded mb-2" />
                  <div className="flex-1 bg-muted/30 rounded-md mb-2 flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground/20" />
                  </div>
                  <div className="h-1.5 w-full bg-muted/70 rounded mb-1" />
                  <div className="h-1.5 w-3/4 bg-muted/70 rounded mb-1" />
                  <div className="h-1.5 w-1/2 bg-muted/70 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="border-y bg-muted/20 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6">Trusted by 500+ Schools & Photographers across India</p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 opacity-50 grayscale">
             <span className="text-xl font-bold italic">DAV Schools</span>
             <span className="text-xl font-bold italic">KV Schools</span>
             <span className="text-xl font-bold italic">Delhi Public School</span>
             <span className="text-xl font-bold italic">Little Flowers</span>
          </div>
        </div>
      </div>

      {/* Audiences */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Built for anyone who prints ID cards</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            One tool, many use cases. If you have a list and photos, you're ready.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {audiences.map((a) => (
            <div key={a.title} className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold mb-1.5">{a.title}</h3>
              <p className="text-sm text-muted-foreground">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything you need to ship cards fast</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Fast, forgiving, and built to handle messy real-world data — typos, missing photos, weird column names.
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

      </main>

      {/* Sticky mobile CTA bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t px-4 py-3 flex items-center gap-2">
        <Button asChild size="sm" className="flex-1 h-10 text-sm">
          <Link to="/app">Start free trial <ArrowRight className="h-3.5 w-3.5" /></Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="flex-1 h-10 text-sm gap-1.5">
          <a href="https://wa.me/919816531995" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
        </Button>
      </div>

      {/* WhatsApp floating button (desktop) */}
      <a
        href="https://wa.me/919816531995"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex fixed bottom-6 right-6 z-50 h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Ready to skip the Word doc nightmare?</h2>
        <p className="mt-3 text-muted-foreground">Free to try. No signup. Your first cards are 5 minutes away.</p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" className="h-12 px-8 text-base shadow-lg hover:shadow-xl transition-shadow gap-2" onClick={() => openLead("landing_bottom")}>
            <Gift className="h-4 w-4" /> Get free sample on WhatsApp
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base gap-2">
            <Link to="/app"><ArrowRight className="h-4 w-4" /> Try live now</Link>
          </Button>
        </div>
      </section>

      <LeadMagnetModal open={leadOpen} onOpenChange={setLeadOpen} source={leadSource} />

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
