"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { ClientCharacter, ClientDashboardPayload, ClientGeneration, ClientUserProfile } from "@/lib/client-sanitize";
import {
  MAX_GENERATIONS_PER_USER,
  MAX_EDITS_PER_USER,
  MAX_UPLOAD_PHOTOS,
  TESTING_BYPASS_PAYMENT,
} from "@/lib/constants";

type DashboardData = ClientDashboardPayload;

const emptyState: DashboardData = {
  user: {
    uid: "",
    email: "",
    plan: "free",
    generationsUsed: 0,
    generationsLimit: 0,
    editsUsed: 0,
    editsLimit: 0,
    modelStatus: "draft",
    createdAt: "",
    updatedAt: "",
  },
  characters: [],
  photos: [],
  generations: [],
  limits: {
    maxPhotos: MAX_UPLOAD_PHOTOS,
    maxGenerations: MAX_GENERATIONS_PER_USER,
    generationsRemaining: 0,
    maxEdits: MAX_EDITS_PER_USER,
    editsRemaining: 0,
  },
};

function buildLimits(user: ClientUserProfile) {
  return {
    maxPhotos: MAX_UPLOAD_PHOTOS,
    maxGenerations: TESTING_BYPASS_PAYMENT ? MAX_GENERATIONS_PER_USER : user.generationsLimit,
    generationsRemaining: TESTING_BYPASS_PAYMENT
      ? Math.max(0, MAX_GENERATIONS_PER_USER - (user.generationsUsed || 0))
      : Math.max(0, user.generationsLimit - user.generationsUsed),
    maxEdits: TESTING_BYPASS_PAYMENT
      ? MAX_EDITS_PER_USER
      : Math.min(user.editsLimit || 0, MAX_EDITS_PER_USER),
    editsRemaining: TESTING_BYPASS_PAYMENT
      ? Math.max(0, MAX_EDITS_PER_USER - (user.editsUsed || 0))
      : Math.max(
          0,
          Math.min(user.editsLimit || 0, MAX_EDITS_PER_USER) - (user.editsUsed || 0)
        ),
  };
}

function mergeCharacters(
  current: ClientCharacter[],
  updates: ClientCharacter[] | undefined
): ClientCharacter[] {
  if (!updates?.length) return current;

  const byId = new Map(current.map((character) => [character.id, character]));
  for (const update of updates) {
    const existing = byId.get(update.id);
    byId.set(update.id, existing ? { ...existing, ...update } : update);
  }

  return Array.from(byId.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function mergeGenerations(
  current: ClientGeneration[],
  updates: ClientGeneration[] | undefined
): ClientGeneration[] {
  if (!updates?.length) return current;

  const byId = new Map(current.map((generation) => [generation.id, generation]));
  for (const update of updates) {
    byId.set(update.id, { ...(byId.get(update.id) || update), ...update });
  }

  return Array.from(byId.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function useDashboard(
  token: string | null,
  refreshToken?: () => Promise<string | null>
) {
  const [data, setData] = useState<DashboardData>(emptyState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tokenRef = useRef(token);
  tokenRef.current = token;

  const authorizedFetch = useCallback(
    async (path: string) => {
      let authToken = tokenRef.current;
      if (!authToken) {
        throw new Error("Not authenticated");
      }

      const load = async (bearer: string) => {
        const res = await fetch(path, {
          headers: { Authorization: `Bearer ${bearer}` },
        });
        const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
        return { res, json };
      };

      let { res, json } = await load(authToken);

      if (res.status === 401 && refreshToken) {
        const fresh = await refreshToken();
        if (fresh) {
          tokenRef.current = fresh;
          ({ res, json } = await load(fresh));
        }
      }

      return { res, json };
    },
    [refreshToken]
  );

  const fetchDashboard = useCallback(async () => {
    if (!tokenRef.current) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { res, json } = await authorizedFetch("/api/dashboard");

      if (!res.ok) {
        throw new Error(
          typeof json.error === "string" ? json.error : "Failed to load dashboard"
        );
      }

      setData(json as unknown as DashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading dashboard");
    } finally {
      setLoading(false);
    }
  }, [authorizedFetch]);

  const syncDashboard = useCallback(async (): Promise<boolean> => {
    if (!tokenRef.current) return false;

    try {
      const { res, json } = await authorizedFetch("/api/dashboard/sync");
      if (!res.ok) {
        throw new Error(typeof json.error === "string" ? json.error : "Sync failed");
      }

      const payload = json as {
        changed: boolean;
        user?: Partial<ClientUserProfile>;
        characters?: ClientCharacter[];
        generations?: ClientGeneration[];
      };

      if (!payload.changed) return false;

      setData((prev) => {
        const nextUser = payload.user ? { ...prev.user, ...payload.user } : prev.user;
        return {
          ...prev,
          user: nextUser,
          characters: mergeCharacters(prev.characters, payload.characters),
          generations: mergeGenerations(prev.generations, payload.generations),
          limits: payload.user ? buildLimits(nextUser) : prev.limits,
        };
      });

      return true;
    } catch (err) {
      console.log("[useDashboard] sync error", err instanceof Error ? err.message : err);
      return false;
    }
  }, [authorizedFetch]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard, token]);

  return { data, loading, error, refresh: fetchDashboard, syncDashboard };
}
