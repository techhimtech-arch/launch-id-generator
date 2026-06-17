import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Copy, Check, Smartphone } from "lucide-react";
import { z } from "zod";
import { UPI_CONFIG, buildUpiQrUrl, buildUpiUri } from "@/lib/upi-config";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  upi_ref: z.string().trim().min(6, "Enter the 12-digit UPI transaction / UTR ID").max(50),
  payer_name: z.string().trim().max(100).optional(),
  payer_phone: z.string().trim().max(20).optional(),
  note: z.string().trim().max(500).optional(),
});

export function UpiPayModal({
  open,
  onOpenChange,
  onSubmitted,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmitted?: () => void;
}) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ upi_ref: "", payer_name: "", payer_phone: "", note: "" });

  const copy = async () => {
    await navigator.clipboard.writeText(UPI_CONFIG.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const submit = async () => {
    if (!user) return;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Check the form", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("payment_requests").insert({
      user_id: user.id,
      user_email: user.email,
      amount: UPI_CONFIG.amount,
      upi_ref: parsed.data.upi_ref,
      payer_name: parsed.data.payer_name || null,
      payer_phone: parsed.data.payer_phone || null,
      note: parsed.data.note || null,
      status: "pending",
    });
    setBusy(false);
    if (error) {
      toast({ title: "Could not submit", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Submitted for review ✅",
      description: "We'll verify your UPI payment and activate Pro within a few hours.",
    });
    setForm({ upi_ref: "", payer_name: "", payer_phone: "", note: "" });
    onOpenChange(false);
    onSubmitted?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pay ₹{UPI_CONFIG.amount} via UPI</DialogTitle>
          <DialogDescription>
            Scan the QR or send via any UPI app, then paste the transaction ID below. Pro will be activated after manual verification (usually within a few hours).
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col items-center text-center rounded-lg border p-4 bg-muted/30">
            <img
              src={buildUpiQrUrl(220)}
              alt="UPI QR code"
              width={220}
              height={220}
              className="rounded-md bg-white p-2"
            />
            <p className="text-xs text-muted-foreground mt-2">Scan with any UPI app</p>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <div className="text-muted-foreground text-xs">UPI ID</div>
              <div className="flex items-center gap-2">
                <code className="font-mono text-sm break-all">{UPI_CONFIG.upiId}</code>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={copy}>
                  {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Payee</div>
              <div>{UPI_CONFIG.payeeName}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Amount</div>
              <div className="font-semibold">₹{UPI_CONFIG.amount}.00</div>
            </div>
            <a href={buildUpiUri()} className="inline-flex">
              <Button variant="outline" size="sm" className="gap-2">
                <Smartphone className="h-3.5 w-3.5" /> Open UPI app
              </Button>
            </a>
          </div>
        </div>

        <div className="space-y-3 mt-4 border-t pt-4">
          <div className="space-y-1.5">
            <Label htmlFor="upi_ref">UPI Transaction ID / UTR *</Label>
            <Input
              id="upi_ref"
              placeholder="e.g. 412345678901"
              value={form.upi_ref}
              onChange={(e) => setForm({ ...form, upi_ref: e.target.value })}
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">Find it in your UPI app under the successful payment receipt.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="payer_name">Your name</Label>
              <Input
                id="payer_name"
                placeholder="Optional"
                value={form.payer_name}
                onChange={(e) => setForm({ ...form, payer_name: e.target.value })}
                maxLength={100}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="payer_phone">Phone</Label>
              <Input
                id="payer_phone"
                placeholder="Optional"
                value={form.payer_phone}
                onChange={(e) => setForm({ ...form, payer_phone: e.target.value })}
                maxLength={20}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              placeholder="Optional message for our team"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              maxLength={500}
              rows={2}
            />
          </div>

          <Button className="w-full" onClick={submit} disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Submit for verification
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
