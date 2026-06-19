import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import AdminNav from "@/components/AdminNav";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldAlert, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { toast } from "@/hooks/use-toast";

type Row = {
  id: string; name: string; email: string; phone: string | null;
  message: string; status: string; created_at: string; user_id: string | null;
};

export default function AdminContacts() {
  const { isAdmin, authLoading } = useAdminGuard();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions").select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    setRows((data ?? []) as Row[]);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
    if (error) { toast({ title: "Failed", description: error.message, variant: "destructive" }); return; }
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  };

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
      <Seo title="Admin — Contact Submissions" description="Review contact form submissions." path="/admin/contacts" />
      <AppHeader />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <AdminNav />
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Contact Submissions ({rows.length})</h1>
          <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
        </div>

        {loading ? (
          <div className="py-12 grid place-items-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No submissions yet.</p>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => (
              <div key={r.id} className="rounded-lg border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{r.name}</span>
                      <Badge variant={r.status === "new" ? "default" : "secondary"}>{r.status}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-3">
                      <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1 hover:underline">
                        <Mail className="h-3 w-3" /> {r.email}
                      </a>
                      {r.phone && (
                        <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1 hover:underline">
                          <Phone className="h-3 w-3" /> {r.phone}
                        </a>
                      )}
                      <span>{new Date(r.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {r.status !== "read" && (
                      <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "read")}>Mark read</Button>
                    )}
                    {r.status !== "resolved" && (
                      <Button size="sm" onClick={() => setStatus(r.id, "resolved")}>Resolve</Button>
                    )}
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap bg-muted/40 rounded p-3">{r.message}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
