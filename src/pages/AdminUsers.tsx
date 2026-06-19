import { useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/AppHeader";
import AdminNav from "@/components/AdminNav";
import Seo from "@/components/Seo";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldAlert, Crown, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminGuard } from "@/hooks/useAdminGuard";

type Profile = { id: string; email: string | null; full_name: string | null; created_at: string };
type Sub = { user_id: string; status: string; expires_at: string };
type Role = { user_id: string; role: string };

export default function AdminUsers() {
  const { isAdmin, authLoading } = useAdminGuard();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [subs, setSubs] = useState<Sub[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    const [p, s, r] = await Promise.all([
      supabase.from("profiles").select("id,email,full_name,created_at").order("created_at", { ascending: false }),
      supabase.from("subscriptions").select("user_id,status,expires_at"),
      supabase.from("user_roles").select("user_id,role"),
    ]);
    setProfiles((p.data ?? []) as Profile[]);
    setSubs((s.data ?? []) as Sub[]);
    setRoles((r.data ?? []) as Role[]);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const subMap = useMemo(() => {
    const m = new Map<string, Sub>();
    subs.forEach((s) => {
      const active = s.status === "active" && new Date(s.expires_at) > new Date();
      const prev = m.get(s.user_id);
      if (active && (!prev || new Date(s.expires_at) > new Date(prev.expires_at))) m.set(s.user_id, s);
    });
    return m;
  }, [subs]);

  const roleMap = useMemo(() => {
    const m = new Map<string, string[]>();
    roles.forEach((r) => {
      const arr = m.get(r.user_id) ?? [];
      arr.push(r.role);
      m.set(r.user_id, arr);
    });
    return m;
  }, [roles]);

  const filtered = profiles.filter((p) => {
    const s = q.toLowerCase().trim();
    if (!s) return true;
    return (p.email ?? "").toLowerCase().includes(s) || (p.full_name ?? "").toLowerCase().includes(s);
  });

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
      <Seo title="Admin — Users" description="All registered users." path="/admin/users" />
      <AppHeader />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AdminNav />
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h1 className="text-2xl font-bold">Users ({profiles.length})</h1>
          <Input
            placeholder="Search by email or name…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {loading ? (
          <div className="py-12 grid place-items-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Joined</th>
                  <th className="px-3 py-2 font-medium">Plan</th>
                  <th className="px-3 py-2 font-medium">Roles</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const sub = subMap.get(p.id);
                  const userRoles = roleMap.get(p.id) ?? [];
                  return (
                    <tr key={p.id} className="border-t">
                      <td className="px-3 py-2">{p.email ?? "—"}</td>
                      <td className="px-3 py-2">{p.full_name ?? "—"}</td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2">
                        {sub ? (
                          <Badge className="gap-1"><Crown className="h-3 w-3" /> Pro</Badge>
                        ) : (
                          <Badge variant="secondary">Free</Badge>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-1 flex-wrap">
                          {userRoles.length === 0 && <span className="text-muted-foreground text-xs">user</span>}
                          {userRoles.map((r) => (
                            <Badge key={r} variant={r === "admin" ? "default" : "outline"} className="gap-1">
                              {r === "admin" && <Shield className="h-3 w-3" />} {r}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No users match.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
