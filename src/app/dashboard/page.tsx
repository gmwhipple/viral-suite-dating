"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { CharacterTrainingPanel } from "@/components/dashboard/CharacterTrainingPanel";
import { MetaPurchaseTracker } from "@/components/analytics/MetaPurchaseTracker";
import { RedditPurchaseTracker } from "@/components/analytics/RedditPurchaseTracker";
import {
  createCheckoutClickEventId,
  getMetaCheckoutAttribution,
  trackInitiateCheckout,
} from "@/lib/meta-browser";
import {
  getRedditCheckoutAttribution,
  trackAddToCart,
} from "@/lib/reddit-browser";
import { ImageReferencePicker, type GenerateReferencePayload } from "@/components/dashboard/ImageReferencePicker";
import { GenerationGallery } from "@/components/dashboard/GenerationGallery";
import { PlanUsageBanner } from "@/components/dashboard/PlanUsageBanner";
import { DashboardHelpButton, DashboardHelpModal } from "@/components/dashboard/DashboardHelpModal";
import { APP_NAME, SUPPORT_EMAIL, TESTING_BYPASS_PAYMENT, DASHBOARD_ACTIVE_POLL_MS } from "@/lib/constants";
import { useLocalizedPricing } from "@/hooks/useLocalizedPricing";
import { useDashboardHelp } from "@/hooks/useDashboardHelp";
import { detectClientLocale } from "@/lib/i18n/locale-detection";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-600 border-t-transparent" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wantsCheckout = searchParams.get("checkout") === "1";
  const { user, loading: authLoading, token, logout, refreshToken } = useAuth();
  const { data, loading, error, refresh, syncDashboard } = useDashboard(token, refreshToken);
  const dataRef = useRef(data);
  dataRef.current = data;

  const shouldPoll = useMemo(() => {
    const status = data.user.modelStatus;
    const hasTrainingJob =
      status === "training" ||
      data.characters.some((c) => c.status === "training");
    const hasRemotePendingGenerations = data.generations.some(
      (g) => g.status === "queued" || g.status === "processing"
    );
    const hasLocalPendingGenerations = data.generations.some(
      (g) => g.status === "watermark_removal"
    );

    return hasTrainingJob || hasRemotePendingGenerations || hasLocalPendingGenerations;
  }, [data.user.modelStatus, data.characters, data.generations]);
  const [training, setTraining] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [generateNotice, setGenerateNotice] = useState<string | null>(null);
  const [selectingCharacter, setSelectingCharacter] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const trainingDefaultSetRef = useRef(false);
  const [checkoutBlocked, setCheckoutBlocked] = useState(false);
  const [locale, setLocale] = useState("en");
  const checkoutStartedRef = useRef(false);
  const { prices, blocked: pricingBlocked, country: pricingCountry } = useLocalizedPricing(locale);
  const checkoutPriceLabel = prices.productLabel;
  const { open: helpOpen, openHelp, closeHelp } = useDashboardHelp(user?.uid);

  useEffect(() => {
    setLocale(detectClientLocale());
  }, []);

  useEffect(() => {
    setCheckoutBlocked(pricingBlocked);
  }, [pricingBlocked]);

  useEffect(() => {
    if (!data.user.uid) return;

    const hasReady = data.characters.some((c) => c.status === "ready");
    if (hasReady) {
      setShowTraining(false);
      return;
    }

    if (!trainingDefaultSetRef.current) {
      trainingDefaultSetRef.current = true;
      setShowTraining(true);
    }
  }, [data.user.uid, data.characters]);

  useEffect(() => {
    if (!authLoading && !user) {
      const loginPath = wantsCheckout ? "/login?mode=signup&checkout=1" : "/login";
      router.push(loginPath);
    }
  }, [authLoading, user, router, wantsCheckout]);

  useEffect(() => {
    if (!token || !shouldPoll) return;

    const pollStatus = async () => {
      const changed = await syncDashboard();
      if (changed) return;

      const snapshot = dataRef.current;
      const hasLocalPendingGenerations = snapshot.generations.some(
        (g) => g.status === "watermark_removal"
      );
      if (hasLocalPendingGenerations) {
        await refresh();
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, DASHBOARD_ACTIVE_POLL_MS);
    return () => clearInterval(interval);
  }, [token, shouldPoll, syncDashboard, refresh]);

  const startTraining = async () => {
    if (!token) return;
    setTraining(true);
    try {
      const res = await fetch("/api/characters/train", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error);
      setShowTraining(false);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Training failed");
    } finally {
      setTraining(false);
    }
  };

  const checkout = async () => {
    if (!token) return;
    setCheckingOut(true);
    try {
      const checkoutEventId = createCheckoutClickEventId();
      const attribution = getMetaCheckoutAttribution(checkoutEventId);
      const redditAttribution = getRedditCheckoutAttribution(checkoutEventId, {
        email: user?.email ?? undefined,
        externalId: user?.uid,
      });
      const checkoutValue = Number(checkoutPriceLabel.replace(/[^\d.]/g, "")) || 199;

      trackInitiateCheckout({
        value: checkoutValue,
        currency: prices.currency.toUpperCase(),
        eventId: checkoutEventId,
      });

      trackAddToCart({
        value: checkoutValue,
        currency: prices.currency.toUpperCase(),
        eventId: checkoutEventId,
        email: user?.email ?? undefined,
        externalId: user?.uid,
      });

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale,
          country: pricingCountry ?? undefined,
          fbc: attribution.fbc,
          fbp: attribution.fbp,
          sourceUrl: attribution.sourceUrl,
          checkoutEventId: attribution.eventId,
          rdtCid: redditAttribution.rdtCid,
          rdtUuid: redditAttribution.rdtUuid,
          screenWidth: redditAttribution.screenWidth,
          screenHeight: redditAttribution.screenHeight,
        }),
      });
      const json = (await res.json()) as { error?: string; url?: string };
      if (!res.ok) throw new Error(json.error);
      if (json.url) window.location.href = json.url;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  useEffect(() => {
    if (!wantsCheckout || checkoutStartedRef.current) return;
    if (authLoading || loading || !token || !user || !data.user.uid) return;

    const hasAccess = TESTING_BYPASS_PAYMENT || data.user.plan === "paid";
    if (hasAccess) {
      router.replace("/dashboard");
      return;
    }
    if (checkoutBlocked) return;

    checkoutStartedRef.current = true;
    router.replace("/dashboard");
    checkout();
  }, [
    wantsCheckout,
    authLoading,
    loading,
    token,
    user,
    data.user.uid,
    data.user.plan,
    checkoutBlocked,
    router,
  ]);

  const generatePhoto = async (payload: GenerateReferencePayload) => {
    if (!token) return;
    const characterId =
      payload.characterId ||
      data.user.activeCharacterId ||
      data.characters.find((c) => c.status === "ready")?.id;
    if (!characterId) {
      throw new Error("Select a ready character first");
    }

    const selectedCharacter = data.characters.find((c) => c.id === characterId);
    if (!selectedCharacter || selectedCharacter.status !== "ready") {
      throw new Error("Selected character is not ready yet");
    }

    const run = async (bearer: string) => {
      const res = await fetch("/api/photos/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearer}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storageKey: payload.storageKey,
          imageReferenceUrl: payload.publicUrl,
          referenceName: payload.name,
          prompt: payload.prompt,
          enhancePrompt: payload.enhancePrompt,
          characterId,
        }),
      });
      const json = (await res.json()) as { error?: string };
      return { res, json };
    };

    let { res, json } = await run(token);
    if (res.status === 401 && refreshToken) {
      const fresh = await refreshToken();
      if (fresh) {
        ({ res, json } = await run(fresh));
      }
    }

    if (!res.ok) {
      throw new Error(
        res.status === 401
          ? "Session expired — refresh the page and try again."
          : typeof json.error === "string"
            ? json.error
            : "Generation failed"
      );
    }
    await refresh();
    setGenerateNotice(
      "Photo submitted successfully! It usually takes a few minutes — you'll see it processing in your gallery below."
    );
    window.setTimeout(() => setGenerateNotice(null), 10000);
    document.getElementById("generated-photos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-600 border-t-transparent" />
      </div>
    );
  }

  if (loading && !data.user.uid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-600 border-t-transparent" />
      </div>
    );
  }

  if (error && !data.user.uid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="font-semibold text-gray-900">Could not load dashboard</p>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            onClick={() => refresh()}
            className="mt-4 rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const activeCharacterId =
    data.user.activeCharacterId || data.characters[0]?.id || null;

  const selectCharacter = async (characterId: string) => {
    if (!token || characterId === activeCharacterId) return;
    setSelectingCharacter(true);
    try {
      const run = async (bearer: string) => {
        const res = await fetch("/api/characters", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${bearer}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ characterId }),
        });
        const json = (await res.json()) as { error?: string };
        return { res, json };
      };

      let { res, json } = await run(token);
      if (res.status === 401 && refreshToken) {
        const fresh = await refreshToken();
        if (fresh) {
          ({ res, json } = await run(fresh));
        }
      }

      if (!res.ok) {
        throw new Error(
          res.status === 401
            ? "Session expired — refresh the page and try again."
            : json.error || "Could not select character"
        );
      }
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not select character");
    } finally {
      setSelectingCharacter(false);
    }
  };

  const hasReadyCharacter = data.characters.some((c) => c.status === "ready");
  const canUpload = !["training", "pending_training"].includes(data.user.modelStatus);
  const canGenerate =
    hasReadyCharacter ||
    data.user.modelStatus === "ready" ||
    data.user.modelStatus === "completed" ||
    data.user.modelStatus === "generating";
  const reopenTraining = () => {
    setShowTraining(true);
    window.setTimeout(() => {
      document
        .getElementById("new-character-training")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaPurchaseTracker />
      <RedditPurchaseTracker />
      <DashboardHelpModal open={helpOpen} onClose={closeHelp} />

      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold text-rose-600">
            {APP_NAME}
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-gray-600 sm:inline">{user.email}</span>
            <DashboardHelpButton onClick={openHelp} />
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-sm text-gray-500 hover:text-rose-600">
              Support
            </a>
            <button onClick={() => logout()} className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        <PlanUsageBanner
          generationsUsed={data.user.generationsUsed || 0}
          generationsRemaining={data.limits.generationsRemaining}
          maxGenerations={data.limits.maxGenerations}
          editsUsed={data.user.editsUsed || 0}
          editsRemaining={data.limits.editsRemaining}
          maxEdits={data.limits.maxEdits}
          plan={data.user.plan}
          checkoutPriceLabel={checkoutPriceLabel}
          checkoutBlocked={checkoutBlocked}
          onCheckout={checkout}
          checkingOut={checkingOut}
        />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Dashboard refresh failed: {error}
          </div>
        )}

        {showTraining && (
          <CharacterTrainingPanel
            photos={data.photos}
            maxPhotos={data.limits.maxPhotos}
            token={token!}
            onRefresh={refresh}
            onStartTraining={startTraining}
            onClose={() => setShowTraining(false)}
            disabled={!canUpload}
            modelStatus={data.user.modelStatus}
            training={training}
          />
        )}

        {!showTraining && !hasReadyCharacter && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4">
            <p className="text-sm text-rose-900">
              Train your AI character with photos to start generating dating profile shots.
            </p>
            <button
              type="button"
              onClick={reopenTraining}
              className="shrink-0 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Open training
            </button>
          </div>
        )}

        <ImageReferencePicker
          token={token!}
          initialGender={data.user.referenceGender === "women" ? "women" : "men"}
          activeCharacterId={activeCharacterId}
          characters={data.characters}
          onSelectCharacter={selectCharacter}
          onAddTraining={reopenTraining}
          selectingCharacter={selectingCharacter}
          onGenerate={generatePhoto}
          generationsRemaining={data.limits.generationsRemaining}
          successMessage={generateNotice}
          disabled={!TESTING_BYPASS_PAYMENT && data.user.plan !== "paid"}
          hasPaidAccess={data.user.plan === "paid"}
          onUnlockReferences={checkout}
        />

        {canGenerate && (
          <div id="generated-photos" className="scroll-mt-8">
            <h2 className="text-lg font-bold text-gray-900">Your generated photos</h2>
            <p className="text-sm text-gray-500">Use Smile, Edit, or Save below each finished photo.</p>
            <GenerationGallery
              generations={data.generations}
              photos={data.photos}
              token={token!}
              refreshToken={refreshToken}
              editsRemaining={data.limits.editsRemaining}
              onEditComplete={refresh}
            />
          </div>
        )}
      </main>
    </div>
  );
}
