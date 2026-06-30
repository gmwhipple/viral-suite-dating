"use client";

import { useEffect, useState, useCallback } from "react";
import type { DashboardState } from "@/lib/firebase/types";
import { MAX_GENERATIONS_PER_USER, MAX_UPLOAD_PHOTOS } from "@/lib/constants";

const emptyState: DashboardState & {
  limits: { maxPhotos: number; maxGenerations: number; generationsRemaining: number };
} = {
  user: {
    uid: "",
    email: "",
    plan: "free",
    generationsUsed: 0,
    generationsLimit: 0,
    soulJobStatus: "draft",
    createdAt: "",
    updatedAt: "",
  },
  photos: [],
  generations: [],
  edits: [],
  recentActivity: [],
  catalogReferences: [],
  customReferences: [],
  limits: {
    maxPhotos: MAX_UPLOAD_PHOTOS,
    maxGenerations: MAX_GENERATIONS_PER_USER,
    generationsRemaining: 0,
  },
};

export function useDashboard(token: string | null) {
  const [data, setData] = useState(emptyState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const res = await fetch("/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof json.error === "string" ? json.error : "Failed to load dashboard"
        );
      }

      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading dashboard");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 15000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  return { data, loading, error, refresh: fetchDashboard };
}
