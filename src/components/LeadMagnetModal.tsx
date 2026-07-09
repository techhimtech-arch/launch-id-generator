import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Gift, MessageCircle, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";

const OWNER_WA = "919816531995";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{6,20}$/, "Enter a valid WhatsApp number"),
  use_case: z.string().trim().max(200).optional(),
  city: z.string().trim().max(80).optional(),
});

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  source?: string;
};

export function LeadMagnetModal({ open, onOpenChange, source = "landing_hero" }: Props) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [useCase, setUseCase] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const reset = () => {
    setName(""); setWhatsapp(""); setUseCase(""); setCity("");
    setDone(false); setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, whatsapp, use_case: useCase, city });
    if (!parsed.success) {
      toast({
        title: "Please check your details",
        description: parsed.error.issues[0]?.message ?? "Invalid input",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      whatsapp: parsed.data.whatsapp,
      use_case: parsed.data.use_case || null,
      city: parsed.data.city || null,
      source,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Kuch problem hui", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
    // Auto-open WhatsApp with pre-filled message to the owner
    const msg =
      `Hi! Mujhe ID Card Studio ka free sample chahiye.%0A` +
      `Name: ${encodeURIComponent(parsed.data.name)}%0A` +
      (parsed.data.city ? `City: ${encodeURIComponent(parsed.data.city)}%0A` : "") +
      (parsed.data.use_case ? `Use case: ${encodeURIComponent(parsed.data.use_case)}%0A` : "");
    window.open(`https://wa.me/${OWNER_WA}?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setTimeout(reset, 200);
      }}
    >
      <DialogContent className="sm:max-w-md">
        {!done ? (
          <>
            <DialogHeader>
              <div className="mx-auto h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Gift className="h-5 w-5" />
              </div>
              <DialogTitle className="text-center text-xl">
                Free sample ID cards + Excel template
              </DialogTitle>
              <DialogDescription className="text-center">
                Apna WhatsApp number do — hum turant sample PDF aur ready-to-use Excel format bhej denge.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="lm-name">Your name *</Label>
                <Input id="lm-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Raman Sharma" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lm-wa">WhatsApp number *</Label>
                <Input id="lm-wa" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="98165 31995" inputMode="tel" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="lm-city">City</Label>
                  <Input id="lm-city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Delhi" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lm-uc">I am a</Label>
                  <select
                    id="lm-uc"
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Select</option>
                    <option>Photographer</option>
                    <option>Print shop</option>
                    <option>School / College</option>
                    <option>Office / HR</option>
                    <option>Event organiser</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full h-11 text-base gap-2" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                Send me the free sample
              </Button>
              <p className="text-[11px] text-muted-foreground text-center">
                Hum aapka number sirf sample bhejne ke liye use karenge. No spam.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto h-14 w-14 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Ho gaya! 🎉</h3>
              <p className="text-sm text-muted-foreground mt-1">
                WhatsApp khul gaya hoga — bas send karo. Hum 10 min mein sample bhej denge.
              </p>
            </div>
            <div className="grid gap-2">
              <Button asChild className="w-full h-11 gap-2">
                <Link to="/app" onClick={() => onOpenChange(false)}>
                  Ya abhi khud try karo — free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <a
                href={`https://wa.me/${OWNER_WA}?text=${encodeURIComponent("Hi! Sample PDF ke liye contact kar raha hun.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                WhatsApp phir se kholein
              </a>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
