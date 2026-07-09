import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import AdminNav from "@/components/AdminNav";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { MessageCircle, CheckCircle2, Loader2 } from "lucide-react";

type Lead = {
  id: string;
  name: string;
  whatsapp: string;
  use_case: string | null;
  city: string | null;
  source: string | null;
  contacted: boolean;
  notes: string | null;
  created_at: string;
};

export default function AdminLeads() {
  const { authLoading, isAdmin } = useAdminGuard();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    else setLeads((data ?? []) as Lead[]);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const toggleContacted = async (l: Lead) => {
    const { error } = await supabase.from("leads").update({ contacted: !l.contacted }).eq("id", l.id);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    setLeads((xs) => xs.map((x) => (x.id === l.id ? { ...x, contacted: !x.contacted } : x)));
  };

  const waLink = (n: string, name: string) =>
    `https://wa.me/${n.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
      `Hi ${name}, ID Card Studio se — aapne sample maanga tha. Yeh raha link: https://idcardstudio.zinglabs.in/app`,
    )}`;

  if (authLoading || isAdmin === null) return <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Leads</h1>
        <AdminNav />
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
          </div>
        ) : leads.length === 0 ? (
          <div className="rounded-lg border bg-card p-10 text-center text-muted-foreground">
            No leads yet.
          </div>
        ) : (
          <div className="rounded-lg border bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3">When</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">WhatsApp</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">City</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-t">
                    <td className="p-3 text-muted-foreground whitespace-nowrap">
                      {new Date(l.created_at).toLocaleString()}
                    </td>
                    <td className="p-3 font-medium">{l.name}</td>
                    <td className="p-3 font-mono">{l.whatsapp}</td>
                    <td className="p-3">{l.use_case ?? "—"}</td>
                    <td className="p-3">{l.city ?? "—"}</td>
                    <td className="p-3 text-xs text-muted-foreground">{l.source ?? "—"}</td>
                    <td className="p-3">
                      {l.contacted ? (
                        <Badge variant="secondary" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Contacted
                        </Badge>
                      ) : (
                        <Badge>New</Badge>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline" className="gap-1.5">
                          <a href={waLink(l.whatsapp, l.name)} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                          </a>
                        </Button>
                        <Button size="sm" variant={l.contacted ? "ghost" : "default"} onClick={() => toggleContacted(l)}>
                          {l.contacted ? "Mark new" : "Mark contacted"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
