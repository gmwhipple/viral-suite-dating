"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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

export function useDashboard(
  token: string | null,
  refreshToken?: () => Promise<string | null>
) {
  const [data, setData] = useState(emptyState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tokenRef = useRef(token);
  tokenRef.current = token;

  const fetchDashboard = useCallback(async () => {
    let authToken = tokenRef.current;
    if (!authToken) {
      setLoading(false);
      return;
    }

    const load = async (bearer: string) => {
      const res = await fetch("/api/dashboard", {
        headers: { Authorization: `Bearer ${bearer}` },
      });
      const json = await res.json().catch(() => ({}));
      return { res, json };
    };

    try {
      setError(null);
      let { res, json } = await load(authToken);

      if (res.status === 401 && refreshToken) {
        const fresh = await refreshToken();
        if (fresh) {
          tokenRef.current = fresh;
          ({ res, json } = await load(fresh));
        }
      }

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
  }, [refreshToken]);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboard, token]);

  return { data, loading, error, refresh: fetchDashboard };
}
