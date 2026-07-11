"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_PREFIX = "vs_dashboard_help_seen_";

export function hasSeenDashboardHelp(userId: string | undefined): boolean {
  if (!userId || typeof window === "undefined") return false;
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${userId}`) === "1";
  } catch {
    return false;
  }
}

export function markDashboardHelpSeen(userId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userId}`, "1");
  } catch {
    // private browsing / quota — ignore
  }
}

export function useDashboardHelp(userId: string | undefined) {
  const [open, setOpen] = useState(false);
  const [autoChecked, setAutoChecked] = useState(false);

  const openHelp = useCallback(() => setOpen(true), []);
  const closeHelp = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!userId || autoChecked) return;
    setAutoChecked(true);
    if (!hasSeenDashboardHelp(userId)) {
      setOpen(true);
      markDashboardHelpSeen(userId);
    }
  }, [userId, autoChecked]);

  return { open, openHelp, closeHelp };
}
