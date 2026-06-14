import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import MarketingHeader from "@/components/MarketingHeader";
import Seo from "@/components/Seo";

interface Tmpl {
  slug: string;
  name: string;
  category: string;
  orientation: "vertical" | "horizontal";
  accent: string;
  bg: string;
  description: string;
}

const TEMPLATES: Tmpl[] = [
  { slug: "cbse-vertical-blue", name: "CBSE Classic Blue", category: "School", orientation: "vertical", accent: "#1d4ed8", bg: "#eff6ff", description: "Traditional vertical CBSE-style card with crest-style logo placement, perfect for K-12 schools." },
  { slug: "icse-vertical-maroon", name: "ICSE Maroon Crest", category: "School", orientation: "vertical", accent: "#9f1239", bg: "#fff1f2", description: "Maroon and gold scheme favored by ICSE and convent schools." },
  { slug: "preschool-vertical-pink", name: "Preschool Pink", category: "Preschool", orientation: "vertical", accent: "#ec4899", bg: "#fdf2f8", description: "Cheerful pink design with rounded corners — great for play schools and pre-primary." },
  { slug: "preschool-vertical-green", name: "Kindergarten Green", category: "Preschool", orientation: "vertical", accent: "#16a34a", bg: "#f0fdf4", description: "Friendly green theme with playful typography for kindergarten students." },
  { slug: "college-horizontal-navy", name: "College Horizontal Navy", category: "College", orientation: "horizontal", accent: "#1e3a8a", bg: "#eff6ff", description: "Professional landscape format with QR space — ideal for universities and colleges." },
  { slug: "college-horizontal-charcoal", name: "Tech Institute Charcoal", category: "College", orientation: "horizontal", accent: "#374151", bg: "#f9fafb", description: "Minimal monochrome look favored by engineering and tech institutes." },
  { slug: "staff-vertical-emerald", name: "Staff Emerald", category: "Staff", orientation: "vertical", accent: "#047857", bg: "#ecfdf5", description: "Distinct staff/teacher ID with designation field, separate from student cards." },
  { slug: "staff-horizontal-amber", name: "Faculty Amber", category: "Staff", orientation: "horizontal", accent: "#b45309", bg: "#fffbeb", description: "Warm amber faculty badge with department tag." },
  { slug: "modern-vertical-violet", name: "Modern Violet", category: "Modern", orientation: "vertical", accent: "#7c3aed", bg: "#f5f3ff", description: "Contemporary gradient-friendly card for design-forward institutions." },
  { slug: "modern-horizontal-coral", name: "Modern Coral", category: "Modern", orientation: "horizontal", accent: "#e11d48", bg: "#fff1f2", description: "Bold coral landscape card with a magazine-style layout." },
  { slug: "minimal-vertical-mono", name: "Minimal Monochrome", category: "Minimal", orientation: "vertical", accent: "#111827", bg: "#ffffff", description: "Pure black and white minimal card — works for any school or org." },
  { slug: "visitor-horizontal-orange", name: "Visitor Pass Orange", category: "Visitor", orientation: "horizontal", accent: "#ea580c", bg: "#fff7ed", description: "Temporary visitor / gate pass with prominent date and time area." },
];

function MiniCard({ t }: { t: Tmpl }) {
  const isV = t.orientation === "vertical";
  return (
    <div
      className="mx-auto rounded-lg border shadow-sm p-2.5 flex flex-col"
      style={{
        width: isV ? 120 : 180,
        height: isV ? 190 : 120,
        background: t.bg,
        borderTopWidth: 4,
        borderTopColor: t.accent,
      }}
    >
      <div className="text-[7px] font-bold uppercase tracking-wider truncate" style={{ color: t.accent }}>
        Greenwood School
      </div>
      <div className="text-[5px] text-muted-foreground mb-1.5">Student Identity Card</div>
      <div className={isV ? "flex-1 flex flex-col items-center gap-1" : "flex-1 flex gap-2 items-center"}>
        <div
          className={isV ? "w-12 h-14 rounded" : "w-10 h-12 rounded"}
          style={{ background: `${t.accent}33`, borderColor: t.accent, borderWidth: 1 }}
        />
        <div className={isV ? "w-full space-y-0.5 mt-1" : "flex-1 space-y-0.5"}>
          <div className="h-1 w-3/4 bg-foreground/70 rounded" />
          <div className="h-1 w-1/2 bg-muted-foreground/40 rounded" />
          <div className="h-1 w-2/3 bg-muted-foreground/40 rounded" />
          <div className="h-1 w-1/2 bg-muted-foreground/40 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function Templates() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ID Card Templates",
    description: "Browse 12+ school, college and staff ID card templates.",
    hasPart: TEMPLATES.map((t) => ({
      "@type": "CreativeWork",
      name: t.name,
      description: t.description,
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Free School ID Card Templates — CBSE, ICSE, College & Staff"
        description="Browse 12+ ready-to-use ID card designs for schools, colleges and staff. Vertical and horizontal layouts. Customize and download in minutes."
        path="/templates"
        jsonLd={jsonLd}
      />
      <MarketingHeader />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">ID Card Templates</h1>
          <p className="mt-4 text-muted-foreground text-lg">
            12 professionally designed templates for schools, colleges, staff and visitors.
            Customize school name, colors, logo and fields — all in your browser.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Free to use</span>
            <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Fully editable</span>
            <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Print-ready</span>
          </div>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((t) => (
            <article key={t.slug} className="rounded-xl border bg-card p-5 hover:shadow-lg transition-shadow flex flex-col">
              <div className="bg-muted/30 rounded-lg py-6 mb-4 min-h-[210px] flex items-center justify-center">
                <MiniCard t={t} />
              </div>
              <div className="text-xs font-medium text-primary mb-1">{t.category}</div>
              <h2 className="font-semibold">{t.name}</h2>
              <p className="text-sm text-muted-foreground mt-1.5 flex-1">{t.description}</p>
              <Button asChild className="mt-4" variant="outline">
                <Link to="/app">Use this template <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold">Don't see what you need?</h2>
          <p className="mt-2 text-muted-foreground">
            Use the custom designer to build your own card from scratch — drag, drop, position any field.
          </p>
          <Button asChild className="mt-6" size="lg">
            <Link to="/app">Open the custom designer <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
