import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import AdminNav from "@/components/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { buildPaymentQrUrl, buildPaymentUri, usePaymentSettings } from "@/hooks/usePaymentSettings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { z } from "zod";

const schema = z.object({ upi_id: z.string().trim().min(5).max(100), payee_name: z.string().trim().min(2).max(100), amount: z.coerce.number().int().min(1).max(1000000), payment_note: z.string().trim().min(2).max(140), payments_enabled: z.boolean() });

export default function AdminPaymentSettings() {
  const { authLoading, isAdmin, user } = useAdminGuard();
  const { settings, loading } = usePaymentSettings();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  useEffect(() => setForm(settings), [settings]);

  const save = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success || !user) return toast({ title: "Check payment details", description: parsed.success ? "Please sign in again." : parsed.error.issues[0]?.message, variant: "destructive" });
    setSaving(true);
    const { error } = await supabase.from("payment_settings").upsert({ id: true, ...parsed.data, currency: "INR", updated_by: user.id }, { onConflict: "id" });
    setSaving(false);
    toast(error ? { title: "Could not save", description: error.message, variant: "destructive" } : { title: "Payment settings saved" });
  };

  if (authLoading || isAdmin === null || loading) return <div className="min-h-screen grid place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!isAdmin) return null;
  return <div className="min-h-screen bg-background"><AppHeader /><main className="max-w-5xl mx-auto px-4 py-8"><h1 className="text-2xl font-bold mb-4">Payment settings</h1><AdminNav /><div className="grid md:grid-cols-[1fr_320px] gap-6"><section className="rounded-lg border bg-card p-6 space-y-5"><div className="flex items-center justify-between gap-4"><div><Label htmlFor="payments-enabled">Accept UPI payments</Label><p className="text-xs text-muted-foreground mt-1">Turn this off to temporarily hide payment instructions.</p></div><Switch id="payments-enabled" checked={form.payments_enabled} onCheckedChange={(payments_enabled) => setForm({ ...form, payments_enabled })} /></div><div className="space-y-2"><Label htmlFor="upi-id">UPI ID</Label><Input id="upi-id" value={form.upi_id} onChange={(e) => setForm({ ...form, upi_id: e.target.value })} /></div><div className="space-y-2"><Label htmlFor="payee-name">Payee name</Label><Input id="payee-name" value={form.payee_name} onChange={(e) => setForm({ ...form, payee_name: e.target.value })} /></div><div className="space-y-2"><Label htmlFor="amount">Yearly price (₹)</Label><Input id="amount" type="number" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} /></div><div className="space-y-2"><Label htmlFor="payment-note">Payment note</Label><Input id="payment-note" value={form.payment_note} onChange={(e) => setForm({ ...form, payment_note: e.target.value })} /></div><Button onClick={save} disabled={saving} className="gap-2">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save settings</Button></section><aside className="rounded-lg border bg-card p-5 self-start text-center"><h2 className="font-semibold">Live customer preview</h2><img src={buildPaymentQrUrl(form, 240)} alt="Preview of the configured UPI payment QR code" className="w-60 h-60 max-w-full mx-auto mt-4 rounded-md border bg-background p-2" /><p className="font-medium mt-3">₹{form.amount}/year</p><p className="text-sm text-muted-foreground break-all mt-1">{form.upi_id}</p><Button asChild variant="outline" size="sm" className="mt-4"><a href={buildPaymentUri(form)}>Test UPI link</a></Button></aside></div></main></div>;
}
