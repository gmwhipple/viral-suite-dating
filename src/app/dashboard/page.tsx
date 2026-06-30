"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { ExamplePhotosGuide } from "@/components/dashboard/ExamplePhotosGuide";
import { PhotoUploadZone } from "@/components/dashboard/PhotoUploadZone";
import { JobStatusBanner } from "@/components/dashboard/JobStatusBanner";
import { StyleReferencePicker } from "@/components/dashboard/StyleReferencePicker";
import { GenerationGallery } from "@/components/dashboard/GenerationGallery";
import { ActivityDebugPanel } from "@/components/dashboard/ActivityDebugPanel";
import { APP_NAME, SUPPORT_EMAIL } from "@/lib/constants";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, token, logout } = useAuth();
  const { data, loading, refresh } = useDashboard(token);
  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const [training, setTraining] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

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

  const generatePhoto = async (referenceId: string) => {
    if (!token) return;
    const res = await fetch("/api/soul/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ referenceId }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error);
    await refresh();
  };

  if (authLoading || loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-600 border-t-transparent" />
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
          onUploadComplete={refresh}
          disabled={!canUpload}
        />

        {canGenerate && (
          <>
            <StyleReferencePicker
              references={data.styleReferences}
              selectedId={selectedRef}
              onSelect={setSelectedRef}
              onGenerate={generatePhoto}
              generationsRemaining={data.limits.generationsRemaining}
              disabled={data.user.plan !== "paid"}
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
