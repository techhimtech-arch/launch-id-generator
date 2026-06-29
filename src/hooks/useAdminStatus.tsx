import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useAdminStatus() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (authLoading) return;
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    setIsAdmin(!error && data?.role === "admin");
    setLoading(false);
  }, [authLoading, user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { isAdmin, loading, refresh, user, authLoading };
}