// Tracks free-tier export usage in localStorage (month-scoped).
// Note: client-side only — pragmatic v1. Server-truth via edge function planned next.

const KEY = "idcard:export-usage";
export const FREE_LIMIT = 3;

function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

type Usage = { month: string; count: number };

function read(): Usage {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const u = JSON.parse(raw) as Usage;
      if (u.month === monthKey()) return u;
    }
  } catch {
    /* noop */
  }
  return { month: monthKey(), count: 0 };
}

export function getExportUsage() {
  const u = read();
  return { used: u.count, limit: FREE_LIMIT, remaining: Math.max(0, FREE_LIMIT - u.count) };
}

export function incrementExportUsage() {
  const u = read();
  const next: Usage = { month: u.month, count: u.count + 1 };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* noop */
  }
  return { used: next.count, limit: FREE_LIMIT, remaining: Math.max(0, FREE_LIMIT - next.count) };
}
