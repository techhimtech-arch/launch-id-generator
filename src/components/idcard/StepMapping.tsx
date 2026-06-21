import { useEffect, useMemo } from "react";
import { useIdStore } from "@/lib/idcard-store";
import { FIELD_LABELS, type FieldKey } from "@/types/idcard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Settings2 } from "lucide-react";

const NONE = "__none__";

function guessMapping(headers: string[]): Partial<Record<FieldKey, string>> {
  const lc = headers.map((h) => h.toLowerCase());
  const find = (...keys: string[]) => {
    for (const k of keys) {
      const i = lc.findIndex((h) => h.includes(k));
      if (i >= 0) return headers[i];
    }
    return undefined;
  };
  return {
    name: find("name", "student"),
    rollNo: find("roll", "id"),
    admissionNo: find("admission", "adm "),
    class: find("class", "grade", "std"),
    section: find("section", "div"),
    dob: find("dob", "birth"),
    bloodGroup: find("blood"),
    fatherName: find("father", "guardian"),
    motherName: find("mother"),
    address: find("address", "addr"),
    mobile: find("mobile", "phone", "contact"),
    aadharNo: find("aadhar", "aadhaar", "uid"),
  };
}

export default function StepMapping() {
  const { headers, mapping, setMapping, displayLabels, setDisplayLabel, setStep } = useIdStore();

  useEffect(() => {
    if (Object.keys(mapping).length === 0 && headers.length) {
      setMapping(guessMapping(headers));
    }
  }, [headers, mapping, setMapping]);

  const fields = Object.keys(FIELD_LABELS) as FieldKey[];
  const canProceed = useMemo(() => Boolean(mapping.name), [mapping]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Map columns</h2>
        <p className="text-muted-foreground mt-1">Tell us which Excel column holds each piece of info. Only Name is required.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl">
        {fields.map((f) => (
          <div key={f} className="space-y-3 p-4 rounded-lg border bg-card/50">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">
                {FIELD_LABELS[f]} {f === "name" && <span className="text-destructive">*</span>}
              </Label>
              <Settings2 className="h-4 w-4 text-muted-foreground/50" />
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Source Column</span>
                <Select
                  value={mapping[f] ?? NONE}
                  onValueChange={(v) => setMapping({ ...mapping, [f]: v === NONE ? undefined : v })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Choose a column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>— None —</SelectItem>
                    {headers.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {f !== "name" && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Print Label As</span>
                  <Input
                    className="h-9"
                    placeholder={FIELD_LABELS[f]}
                    value={displayLabels[f] ?? ""}
                    onChange={(e) => setDisplayLabel(f, e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(0)}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button disabled={!canProceed} onClick={() => setStep(2)}>
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
