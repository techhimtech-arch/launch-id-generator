import { useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import AdminNav from "@/components/AdminNav";
import Seo from "@/components/Seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminGuard } from "@/hooks/useAdminGuard";

type Sub = {
  id: string; user_id: string; plan: string; status: string;
  amount: number; currency: string; started_at: string; expires_at: string;
  razorpay_payment_id: string | null; created_at: string;
};
type Profile = { id: string; email: string | null; full_name: string | null };

export default function AdminSubscriptions() {
  const { isAdmin, authLoading } = useAdminGuard();
  const [subs, setSubs] = useState<Sub[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [s, p] = await Promise.all([
      supabase.from("subscriptions").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id,email,full_name"),
    ]);
    setSubs((s.data ?? []) as Sub[]);
    setProfiles((p.data ?? []) as Profile[]);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const emailMap = useMemo(() => {
    const m = new Map<string, Profile>();
    profiles.forEach((p) => m.set(p.id, p));
    return m;
  }, [profiles]);

  const stats = useMemo(() => {
    const now = new Date();
    const active = subs.filter((s) => s.status === "active" && new Date(s.expires_at) > now);
    const revenue = subs
      .filter((s) => s.status === "active")
      .reduce((sum, s) => sum + (s.amount ?? 0) / 100, 0);
    return { total: subs.length, active: active.length, revenue };
  }, [subs]);

  if (authLoading || isAdmin === null) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <ShieldAlert className="h-10 w-10 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-semibold mt-3">Admins only</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Admin — Subscriptions" description="All paid subscriptions." path="/admin/subscriptions" />
      <AppHeader />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AdminNav />
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Subscriptions</h1>
          <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs text-muted-foreground">Total subscriptions</div>
            <div className="text-2xl font-bold mt-1">{stats.total}</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs text-muted-foreground">Active right now</div>
            <div className="text-2xl font-bold mt-1">{stats.active}</div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs text-muted-foreground">Total revenue</div>
            <div className="text-2xl font-bold mt-1">₹{stats.revenue.toLocaleString()}</div>
          </div>
        </div>

        {loading ? (
          <div className="py-12 grid place-items-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : subs.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No subscriptions yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">User</th>
                  <th className="px-3 py-2 font-medium">Plan</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Started</th>
                  <th className="px-3 py-2 font-medium">Expires</th>
                  <th className="px-3 py-2 font-medium">Payment ID</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => {
                  const p = emailMap.get(s.user_id);
                  const active = s.status === "active" && new Date(s.expires_at) > new Date();
                  return (
                    <tr key={s.id} className="border-t">
                      <td className="px-3 py-2">{p?.email ?? <span className="text-xs text-muted-foreground">{s.user_id.slice(0, 8)}…</span>}</td>
                      <td className="px-3 py-2">{s.plan}</td>
                      <td className="px-3 py-2">
                        <Badge variant={active ? "default" : "secondary"}>{active ? "active" : s.status}</Badge>
                      </td>
                      <td className="px-3 py-2">₹{((s.amount ?? 0) / 100).toLocaleString()}</td>
                      <td className="px-3 py-2 text-muted-foreground">{new Date(s.started_at).toLocaleDateString()}</td>
                      <td className="px-3 py-2 text-muted-foreground">{new Date(s.expires_at).toLocaleDateString()}</td>
                      <td className="px-3 py-2 font-mono text-xs">{s.razorpay_payment_id ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
