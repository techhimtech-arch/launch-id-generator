import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import Seo from "@/components/Seo";
import AdminNav from "@/components/AdminNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

type Req = {
  id: string; user_id: string; user_email: string | null;
  amount: number; currency: string; upi_ref: string;
  payer_name: string | null; payer_phone: string | null; note: string | null;
  status: string; admin_note: string | null; created_at: string;
};

export default function AdminPayments() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Req[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { nav("/auth"); return; }
    (async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!error && data?.role === "admin");
    })();
  }, [user, authLoading, nav]);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("payment_requests").select("*")
      .order("created_at", { ascending: false });
    setRows((data ?? []) as Req[]);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const review = async (id: string, action: "approve" | "reject") => {
    setBusyId(id);
    const { data, error } = await supabase.functions.invoke("review-payment-request", {
      body: { request_id: id, action },
    });
    setBusyId(null);
    if (error || (data as any)?.error) {
      toast({ title: "Failed", description: error?.message ?? (data as any)?.error, variant: "destructive" });
      return;
    }
    toast({ title: action === "approve" ? "Approved ✅" : "Rejected" });
    load();
  };

  if (authLoading || isAdmin === null) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <ShieldAlert className="h-10 w-10 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-semibold mt-3">Admins only</h1>
          <p className="text-muted-foreground mt-1">You do not have access to this page.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Admin — Payment Requests" description="Review and approve UPI payment requests." path="/admin/payments" />
      <AppHeader />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <AdminNav />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">UPI Payment Requests</h1>
          <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
        </div>

        {loading ? (
          <div className="py-12 grid place-items-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No payment requests yet.</p>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => (
              <div key={r.id} className="rounded-lg border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{r.user_email ?? r.user_id}</span>
                      <Badge variant={r.status === "pending" ? "secondary" : r.status === "approved" ? "default" : "destructive"}>
                        {r.status}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {new Date(r.created_at).toLocaleString()} · ₹{r.amount} {r.currency}
                    </div>
                    <div className="font-mono text-xs">UTR: {r.upi_ref}</div>
                    {(r.payer_name || r.payer_phone) && (
                      <div className="text-xs text-muted-foreground">
                        {r.payer_name} {r.payer_phone && `· ${r.payer_phone}`}
                      </div>
                    )}
                    {r.note && <div className="text-xs">Note: {r.note}</div>}
                    {r.admin_note && <div className="text-xs text-muted-foreground">Admin: {r.admin_note}</div>}
                  </div>
                  {r.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" disabled={busyId === r.id} onClick={() => review(r.id, "reject")}>
                        Reject
                      </Button>
                      <Button size="sm" disabled={busyId === r.id} onClick={() => review(r.id, "approve")}>
                        {busyId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve & activate Pro"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
