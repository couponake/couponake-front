"use client";
import { useEffect, useState } from "react";

/**
 * The visitor's current time, available only after hydration.
 *
 * Store pages are cached at the edge (ISR), so anything computed from
 * `new Date()` during render freezes at the moment the page was generated —
 * a page cached yesterday would say "last updated: yesterday (today)".
 * Returning null on the server and on the first client render keeps the
 * server and client markup identical (no hydration mismatch); the effect
 * then fills in the real date from the visitor's clock.
 */
export function useClientNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);
  return now;
}
