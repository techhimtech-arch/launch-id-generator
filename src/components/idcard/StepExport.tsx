import { useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import { useIdStore } from "@/lib/idcard-store";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Download, Loader2, FileJson, Upload, Sparkles, Eye } from "lucide-react";
import CardPreview from "./CardPreview";
import { drawCard, drawCropMarks, drawCutGridLines, withRotatedCard, prewarmImageCache } from "@/lib/cardDraw";
import { exportProject, importProject } from "@/lib/persistence";
import { toast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { UpgradeModal } from "@/components/UpgradeModal";
import { getExportUsage, incrementExportUsage, FREE_LIMIT } from "@/lib/export-trial";

type PageSizeKey = "a4" | "a4-landscape" | "letter" | "a3";
type CutStyle = "none" | "corners" | "grid";

const PAGE_DIMS: Record<PageSizeKey, { w: number; h: number; format: string; orientation: "portrait" | "landscape" }> = {
  a4: { w: 210, h: 297, format: "a4", orientation: "portrait" },
  "a4-landscape": { w: 297, h: 210, format: "a4", orientation: "landscape" },
  letter: { w: 216, h: 279, format: "letter", orientation: "portrait" },
  a3: { w: 297, h: 420, format: "a3", orientation: "portrait" },
};

function computeFit(pageW: number, pageH: number, cardW: number, cardH: number, margin: number, gap: number) {
  const usableW = pageW - 2 * margin;
  const usableH = pageH - 2 * margin;
  const cols = Math.max(0, Math.floor((usableW + gap) / (cardW + gap)));
  const rows = Math.max(0, Math.floor((usableH + gap) / (cardH + gap)));
  return { cols, rows, total: cols * rows };
}

export default function StepExport() {
  const { students, photos, mapping, design, setStep, headers, rows, step, hydrate, displayLabels } = useIdStore();
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { isSubscribed, isOfflineLeaseValid } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [usage, setUsage] = useState(getExportUsage());

  const [pageSize, setPageSize] = useState<PageSizeKey>("a4");
  const [margin, setMargin] = useState(5);
  const [gap, setGap] = useState(2);
  const [autoRotate, setAutoRotate] = useState(false);
  const [cutStyle, setCutStyle] = useState<CutStyle>("corners");
  const [duplicateN, setDuplicateN] = useState(1);

  const photoMap = useMemo(() => Object.fromEntries(photos.map((p) => [p.id, p])), [photos]);
  const cardW = design.customWidth;
  const cardH = design.customHeight;
  const page = PAGE_DIMS[pageSize];

  const layout = useMemo(() => {
    const a = computeFit(page.w, page.h, cardW, cardH, margin, gap);
    const b = computeFit(page.w, page.h, cardH, cardW, margin, gap);
    if (autoRotate && b.total > a.total) {
      return { ...b, rotated: true, drawW: cardH, drawH: cardW };
    }
    return { ...a, rotated: false, drawW: cardW, drawH: cardH };
  }, [page, cardW, cardH, margin, gap, autoRotate]);

  const totalCards = students.length * Math.max(1, duplicateN);
  const totalPages = layout.total > 0 ? Math.ceil(totalCards / layout.total) : 0;

  const generatePdf = async (previewOnly = false) => {
    if (layout.total === 0) return;
    
    if (!isOfflineLeaseValid && !previewOnly) {
      toast({
        title: "Connection required",
        description: "Please connect to the internet once to verify your subscription.",
        variant: "destructive"
      });
      return;
    }

    const showWatermark = !isSubscribed;
    if (!previewOnly && showWatermark) {
      const u = getExportUsage();
      if (u.remaining <= 0) {
        setShowUpgrade(true);
        return;
      }
    }
    setBusy(true);
    try {
      await prewarmImageCache([
        design.logoDataUrl,
        design.signatureDataUrl,
        design.customBgDataUrl,
        ...photos.map((p) => p.dataUrl),
      ]);
      const doc = new jsPDF({ unit: "mm", format: page.format, orientation: page.orientation });
      const { cols, rows, drawW, drawH, rotated } = layout;
      const usableW = page.w - 2 * margin;
      const usableH = page.h - 2 * margin;
      const offsetX = margin + (usableW - (cols * drawW + (cols - 1) * gap)) / 2;
      const offsetY = margin + (usableH - (rows * drawH + (rows - 1) * gap)) / 2;
      const perPage = cols * rows;

      const queue: typeof students = [];
      const limit = previewOnly ? Math.min(perPage, students.length) : students.length;
      for (let i = 0; i < limit; i++) {
        for (let k = 0; k < Math.max(1, duplicateN); k++) {
          queue.push(students[i]);
          if (previewOnly && queue.length >= perPage) break;
        }
        if (previewOnly && queue.length >= perPage) break;
      }

      const stampWatermark = (cx: number, cy: number, cw: number, ch: number) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(4);
        doc.setTextColor(140, 140, 140);
        doc.text("Made with IDCardStudio.app", cx + cw / 2, cy + ch - 0.6, { align: "center" });
        doc.setTextColor(0, 0, 0);
      };

      for (let i = 0; i < queue.length; i++) {
        if (i > 0 && i % perPage === 0) {
          if (previewOnly) break;
          doc.addPage(page.format, page.orientation);
          if (cutStyle === "grid") {
            drawCutGridLines(doc, offsetX, offsetY, gap, cols, rows, drawW, drawH, page.w, page.h);
          }
        } else if (i === 0 && cutStyle === "grid") {
          drawCutGridLines(doc, offsetX, offsetY, gap, cols, rows, drawW, drawH, page.w, page.h);
        }

        const idxOnPage = i % perPage;
        const col = idxOnPage % cols;
        const row = Math.floor(idxOnPage / cols);
        const x = offsetX + col * (drawW + gap);
        const y = offsetY + row * (drawH + gap);

        const s = queue[i];
        const photo = s.photoId ? photoMap[s.photoId] : null;

        if (rotated) {
          withRotatedCard(doc, x, y, drawW, drawH, (nx, ny) => {
            drawCard({ doc, x: nx, y: ny, student: s, photo, mapping, design });
          });
        } else {
          drawCard({ doc, x, y, student: s, photo, mapping, design });
        }
        if (showWatermark) stampWatermark(x, y, drawW, drawH);
        if (cutStyle === "corners") drawCropMarks(doc, x, y, drawW, drawH);
      }

      if (previewOnly) {
        const out = doc.output("bloburl");
        setPreviewUrl(String(out));
      } else {
        doc.save(`id-cards-${Date.now()}.pdf`);
        if (showWatermark) {
          const next = incrementExportUsage();
          setUsage(next);
          toast({
            title: `Free download used (${next.used}/${FREE_LIMIT})`,
            description: next.remaining > 0
              ? `${next.remaining} free downloads left this month. Upgrade to Pro to remove the watermark.`
              : "You've used all free downloads this month. Upgrade to Pro for unlimited, watermark-free exports.",
          });
        }
      }
    } finally {
      setBusy(false);
    }
  };

  const sample = students.slice(0, Math.min(6, students.length));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Preview & download</h2>
        <p className="text-muted-foreground mt-1">
          {students.length} cards · {cardW}×{cardH}mm · {layout.cols}×{layout.rows} ={" "}
          <span className="font-medium text-foreground">{layout.total} per page</span> · {totalPages} page
          {totalPages !== 1 ? "s" : ""}
          {layout.rotated && <span className="ml-1 text-primary">(rotated 90°)</span>}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Settings panel */}
        <div className="space-y-5 rounded-lg border bg-card p-5">
          <h3 className="font-medium">Sheet layout</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Page size</label>
              <Select value={pageSize} onValueChange={(v) => setPageSize(v as PageSizeKey)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4 Portrait (210×297)</SelectItem>
                  <SelectItem value="a4-landscape">A4 Landscape (297×210)</SelectItem>
                  <SelectItem value="letter">Letter (216×279)</SelectItem>
                  <SelectItem value="a3">A3 (297×420)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cut guides</label>
              <Select value={cutStyle} onValueChange={(v) => setCutStyle(v as CutStyle)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="corners">Corner crop marks</SelectItem>
                  <SelectItem value="grid">Full cut lines (grid)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Page margin</label>
              <span className="text-xs text-muted-foreground">{margin} mm</span>
            </div>
            <Slider min={3} max={15} step={1} value={[margin]} onValueChange={(v) => setMargin(v[0])} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Gap between cards</label>
              <span className="text-xs text-muted-foreground">{gap} mm</span>
            </div>
            <Slider min={0} max={6} step={1} value={[gap]} onValueChange={(v) => setGap(v[0])} />
          </div>

          <label className="flex items-center justify-between gap-2 text-sm cursor-pointer">
            <div>
              <div className="font-medium">Auto-rotate cards</div>
              <div className="text-xs text-muted-foreground">Rotate 90° if it fits more per page</div>
            </div>
            <Switch checked={autoRotate} onCheckedChange={setAutoRotate} />
          </label>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Copies per student</label>
              <span className="text-xs text-muted-foreground">×{duplicateN}</span>
            </div>
            <Slider min={1} max={10} step={1} value={[duplicateN]} onValueChange={(v) => setDuplicateN(v[0])} />
          </div>
        </div>

        {/* Live mini-preview */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Sheet preview</div>
          <div
            className="relative mx-auto rounded-md border bg-background shadow-sm"
            style={{
              width: "100%",
              maxWidth: 260,
              aspectRatio: `${page.w} / ${page.h}`,
            }}
          >
            {Array.from({ length: layout.rows }).flatMap((_, r) =>
              Array.from({ length: layout.cols }).map((__, c) => {
                const usableW = page.w - 2 * margin;
                const usableH = page.h - 2 * margin;
                const offsetX = margin + (usableW - (layout.cols * layout.drawW + (layout.cols - 1) * gap)) / 2;
                const offsetY = margin + (usableH - (layout.rows * layout.drawH + (layout.rows - 1) * gap)) / 2;
                const x = offsetX + c * (layout.drawW + gap);
                const y = offsetY + r * (layout.drawH + gap);
                return (
                  <div
                    key={`${r}-${c}`}
                    className="absolute rounded-sm bg-primary/15 border border-primary/40"
                    style={{
                      left: `${(x / page.w) * 100}%`,
                      top: `${(y / page.h) * 100}%`,
                      width: `${(layout.drawW / page.w) * 100}%`,
                      height: `${(layout.drawH / page.h) * 100}%`,
                    }}
                  />
                );
              }),
            )}
            {layout.total === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-destructive p-3 text-center">
                Card too large — reduce margin or change page size.
              </div>
            )}
          </div>
            <p className="text-center text-xs text-muted-foreground">
            {layout.total} cards/page · {totalPages} pages · {totalCards} total
          </p>
          <Dialog onOpenChange={(open) => !open && setPreviewUrl(null)}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full gap-2 mt-2" onClick={() => generatePdf(true)}>
                <Eye className="h-4 w-4" /> Preview Full Page
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>PDF Page Preview</DialogTitle>
              </DialogHeader>
              <div className="flex-1 bg-muted rounded-md overflow-hidden relative">
                {previewUrl ? (
                  <iframe src={previewUrl} className="w-full h-full border-none" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-muted/40 rounded-lg p-6 border">
        <div className="text-sm font-medium mb-4">Card preview</div>
        <div className="flex flex-wrap gap-5 justify-center">
          {sample.map((s) => (
            <CardPreview
              key={s.id}
              student={s}
              photo={s.photoId ? photoMap[s.photoId] : null}
              mapping={mapping}
              design={design}
            />
          ))}
        </div>
        {students.length > sample.length && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            Showing first {sample.length} of {students.length} cards.
          </p>
        )}
      </div>

      <div className="rounded-lg border bg-card p-5 space-y-3">
        <div>
          <div className="font-medium text-sm">Project backup</div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Save the entire project (data + photos + design) as a .json file. Import it on any device to continue.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportProject({ step, headers, rows, mapping, displayLabels, photos, students, design })
            }
          >
            <FileJson className="h-4 w-4" /> Export project (.json)
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                const s = await importProject(f);
                hydrate(s);
                toast({ title: "Project imported", description: `${s.rows.length} students loaded.` });
              } catch {
                toast({ title: "Invalid file", description: "Could not read the project file." });
              }
              e.target.value = "";
            }}
          />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> Import project
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <Button variant="outline" onClick={() => setStep(3)}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex items-center gap-3">
          {!isSubscribed && (
            <div className="text-xs text-muted-foreground text-right">
              {usage.remaining > 0 ? (
                <>
                  <span className="font-medium text-foreground">{usage.remaining}</span> of{" "}
                  {FREE_LIMIT} free downloads left · watermarked
                  <br />
                  <button
                    onClick={() => setShowUpgrade(true)}
                    className="text-primary hover:underline font-medium"
                  >
                    Upgrade to remove watermark
                  </button>
                </>
              ) : (
                <>
                  Free downloads used up for this month
                  <br />
                  <button
                    onClick={() => setShowUpgrade(true)}
                    className="text-primary hover:underline font-medium"
                  >
                    Upgrade to Pro for unlimited
                  </button>
                </>
              )}
            </div>
          )}
          <Button onClick={() => generatePdf()} disabled={busy || layout.total === 0}>
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSubscribed ? (
              <Download className="h-4 w-4" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isSubscribed
              ? "Download PDF"
              : usage.remaining > 0
              ? "Download free (with watermark)"
              : "Upgrade to Download"}
          </Button>
        </div>
      </div>
      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
    </div>
  );
}
