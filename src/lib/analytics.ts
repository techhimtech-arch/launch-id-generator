import { supabase } from "@/integrations/supabase/client";

export type AnalyticsEvent = "try_free_click" | "app_started" | "google_sign_in" | "free_export" | "lead_opened" | "lead_submitted" | "payment_opened" | "payment_submitted";

function getSessionId() {
  const key = "ics_analytics_session";
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;
  const value = crypto.randomUUID();
  sessionStorage.setItem(key, value);
  return value;
}

export async function trackEvent(event_name: AnalyticsEvent, source?: string, metadata: Record<string, string | number | boolean> = {}) {
  try {
    const { data } = await supabase.auth.getUser();
    await supabase.from("analytics_events").insert({
      event_name,
      session_id: getSessionId(),
      user_id: data.user?.id ?? null,
      source: source ?? null,
      path: window.location.pathname,
      metadata,
    });
  } catch {
    // Analytics must never interrupt the customer workflow.
  }
}
