import { Link } from "react-router-dom";
import MarketingHeader from "@/components/MarketingHeader";
import SiteFooter from "@/components/SiteFooter";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

type Kind = "photographers" | "print-shops" | "excel";

const CONTENT: Record<Kind, { path: string; title: string; desc: string; h1: string; intro: string; points: string[] }> = {
  photographers: {
    path: "/id-card-maker-for-photographers",
    title: "ID Card Maker for Photographers — Bulk School Cards",
    desc: "Make hundreds of school and office ID cards from Excel and photos in minutes. Print-ready PDF for photographers.",
    h1: "ID card maker for photographers",
    intro: "Got a school order with 500 students? Upload the Excel sheet and photos, pick a design and download a print-ready PDF in minutes.",
    points: ["Photos matched to students automatically by file name", "A4 PDF sheets ready for PVC or paper printing", "Edit any student's details before export", "₹899/year — unlimited cards"],
  },
  "print-shops": {
    path: "/id-card-software-for-print-shops",
    title: "ID Card Software for Print Shops — Excel to PDF",
    desc: "Print shop ID card software: turn customer Excel lists into print-ready ID card sheets. No design skills needed.",
    h1: "ID card software for print shops",
    intro: "Take bulk ID card orders from schools, offices and events without spending hours in CorelDRAW or Photoshop.",
    points: ["Ready-made templates for schools, offices and events", "Bulk export: high-resolution PDF and PNG", "Works in the browser — no installation", "₹899/year — unlimited cards"],
  },
  excel: {
    path: "/bulk-id-card-maker-from-excel",
    title: "Bulk ID Card Maker from Excel — Free Trial",
    desc: "Create bulk ID cards from an Excel or CSV file. Map columns, add photos and export print-ready PDF.",
    h1: "Bulk ID card maker from Excel",
    intro: "Upload your Excel or CSV file, map columns like Name, Class and Roll No., add photos and get every card at once.",
    points: ["Supports .xlsx, .xls and .csv", "Column mapping in a few clicks", "Bulk photo upload with auto-matching", "3 free downloads to try it"],
  },
};

export default function SolutionPage({ kind }: { kind: Kind }) {
  const c = CONTENT[kind];
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo title={c.title} description={c.desc} path={c.path} />
      <MarketingHeader />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-4xl font-bold tracking-tight">{c.h1}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{c.intro}</p>
        <ul className="mt-8 space-y-3">
          {c.points.map((p) => (
            <li key={p} className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />{p}</li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg"><Link to="/app">Start free trial</Link></Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
