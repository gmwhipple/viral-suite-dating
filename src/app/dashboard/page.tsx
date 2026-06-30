"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { ExamplePhotosGuide } from "@/components/dashboard/ExamplePhotosGuide";
import { PhotoUploadZone } from "@/components/dashboard/PhotoUploadZone";
import { JobStatusBanner } from "@/components/dashboard/JobStatusBanner";
import { ImageReferencePicker, type GenerateReferencePayload } from "@/components/dashboard/ImageReferencePicker";
import { GenerationGallery } from "@/components/dashboard/GenerationGallery";
import { ActivityDebugPanel } from "@/components/dashboard/ActivityDebugPanel";
import { APP_NAME, SUPPORT_EMAIL, TESTING_BYPASS_PAYMENT } from "@/lib/constants";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, token, logout } = useAuth();
  const { data, loading, error, refresh } = useDashboard(token);
  const [training, setTraining] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!token) return;
    const status = data.user.soulJobStatus;
    if (status !== "training" && status !== "pending_training") return;

    const pollTrainingStatus = async () => {
      try {
        await fetch("/api/soul/train", {
          headers: { Authorization: `Bearer ${token}` },
        });
        await refresh();
      } catch {
        // ignore poll errors
      }
    };

    pollTrainingStatus();
    const interval = setInterval(pollTrainingStatus, 10000);
    return () => clearInterval(interval);
  }, [token, data.user.soulJobStatus, refresh]);

  const startTraining = async () => {
    if (!token) return;
    setTraining(true);
    try {
      const res = await fetch("/api/soul/train", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
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
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      if (json.url) window.location.href = json.url;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  const generatePhoto = async (payload: GenerateReferencePayload) => {
    if (!token) return;
    const res = await fetch("/api/soul/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        storageKey: payload.storageKey,
        imageReferenceUrl: payload.publicUrl,
        referenceName: payload.name,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    await refresh();
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

  const canUpload = !["training", "pending_training"].includes(data.user.soulJobStatus);
  const canGenerate = data.user.soulJobStatus === "ready" || data.user.soulJobStatus === "completed" || data.user.soulJobStatus === "generating";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold text-rose-600">
            {APP_NAME}
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-gray-600 sm:inline">{user.email}</span>
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
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Dashboard refresh failed: {error}
          </div>
        )}

        <JobStatusBanner
          user={data.user}
          photoCount={data.photos.length}
          onStartTraining={startTraining}
          onCheckout={checkout}
          training={training}
          checkingOut={checkingOut}
        />

        <ExamplePhotosGuide />

        <PhotoUploadZone
          photos={data.photos}
          maxPhotos={data.limits.maxPhotos}
          token={token!}
          onRefresh={refresh}
          onStartTraining={startTraining}
          disabled={!canUpload}
          soulJobStatus={data.user.soulJobStatus}
        />

        {canGenerate && (
          <>
            <ImageReferencePicker
              token={token!}
              initialGender={data.user.referenceGender === "women" ? "women" : "men"}
              onGenerate={generatePhoto}
              generationsRemaining={data.limits.generationsRemaining}
              disabled={!TESTING_BYPASS_PAYMENT && data.user.plan !== "paid"}
            />

            <div>
              <h2 className="mb-4 text-lg font-bold text-gray-900">Your generated photos</h2>
              <GenerationGallery
                generations={data.generations}
                token={token!}
                onEditComplete={refresh}
              />
            </div>
          </>
        )}

        <ActivityDebugPanel activity={data.recentActivity} />
      </main>
    </div>
  );
}
