import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UpgradeModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const nav = useNavigate();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Crown className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">Upgrade to Pro</DialogTitle>
          <DialogDescription className="text-center">
            Free preview is unlimited. To download or print ID cards, subscribe to Pro.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border p-4 space-y-2 my-2">
          <div className="flex items-baseline justify-between">
            <span className="font-semibold">Pro — Yearly</span>
            <span className="text-2xl font-bold">₹1,499<span className="text-sm font-normal text-muted-foreground">/year</span></span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1.5 mt-3">
            {["Unlimited PDF & PNG exports", "All design templates", "Bulk print sheet layouts", "Project backup & restore", "Priority email support"].map((f) => (
              <li key={f} className="flex gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button className="w-full" onClick={() => { onOpenChange(false); nav("/pricing"); }}>
          Subscribe Now
        </Button>
      </DialogContent>
    </Dialog>
  );
}
