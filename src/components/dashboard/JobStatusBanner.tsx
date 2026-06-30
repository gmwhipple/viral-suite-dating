"use client";

import type { UserProfile } from "@/lib/firebase/types";
import { MIN_SOUL_TRAINING_PHOTOS, MAX_GENERATIONS_PER_USER, TESTING_BYPASS_PAYMENT } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface JobStatusBannerProps {
  user: UserProfile;
  photoCount: number;
  onStartTraining: () => Promise<void>;
  onCheckout: () => Promise<void>;
  training: boolean;
  checkingOut: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; description: string }> = {
  draft: {
    label: "Getting started",
    color: "bg-gray-100 text-gray-800",
    description: "Upload your photos to begin",
  },
  uploading: {
    label: "Uploading",
    color: "bg-blue-100 text-blue-800",
    description: "Saving your photos...",
  },
  pending_training: {
    label: "Queued for training",
    color: "bg-amber-100 text-amber-800",
    description: "Your photos were sent to Higgsfield. Training will start shortly.",
  },
  training: {
    label: "Training in progress",
    color: "bg-amber-100 text-amber-800",
    description: "Higgsfield Soul 2.0 is learning your face. This usually takes 1–2 hours.",
  },
  ready: {
    label: "Ready to generate",
    color: "bg-green-100 text-green-800",
    description: "Pick a style reference and generate your dating photos!",
  },
  generating: {
    label: "Generating photos",
    color: "bg-blue-100 text-blue-800",
    description: "Your photos are being created...",
  },
  completed: {
    label: "Complete",
    color: "bg-green-100 text-green-800",
    description: "Your photos are ready for download and editing.",
  },
  failed: {
    label: "Something went wrong",
    color: "bg-red-100 text-red-800",
    description: "Please contact support or try again.",
  },
};

export function JobStatusBanner({
  user,
  photoCount,
  onStartTraining,
  onCheckout,
  training,
  checkingOut,
}: JobStatusBannerProps) {
  const config = STATUS_CONFIG[user.soulJobStatus] || STATUS_CONFIG.draft;
  const isTraining =
    user.soulJobStatus === "training" || user.soulJobStatus === "pending_training";
  const canTrain =
    photoCount >= MIN_SOUL_TRAINING_PHOTOS &&
    ["draft", "failed"].includes(user.soulJobStatus) &&
    photoCount > 0;
  const needsPayment = !TESTING_BYPASS_PAYMENT && user.plan !== "paid";

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-6 shadow-sm",
        isTraining ? "border-amber-300 ring-2 ring-amber-100" : "border-gray-200"
      )}
    >
      {isTraining && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="mt-0.5 h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
          <div>
            <p className="font-semibold text-amber-900">AI training in progress</p>
            <p className="mt-1 text-sm text-amber-800">
              {photoCount} training photo{photoCount === 1 ? "" : "s"} submitted. You can leave
              this page — we&apos;ll update automatically when your character is ready.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className={cn("inline-block rounded-full px-3 py-1 text-xs font-semibold", config.color)}>
            {config.label}
          </span>
          <p className="mt-2 text-sm text-gray-600">{config.description}</p>
          {(user.plan === "paid" || TESTING_BYPASS_PAYMENT) && (
            <p className="mt-1 text-xs text-gray-500">
              Generations used: {user.generationsUsed} /{" "}
              {TESTING_BYPASS_PAYMENT ? MAX_GENERATIONS_PER_USER : user.generationsLimit}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {needsPayment && (
            <button
              onClick={onCheckout}
              disabled={checkingOut}
              className="rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {checkingOut ? "Loading..." : "Unlock — $49"}
            </button>
          )}
          {canTrain && (
            <button
              onClick={onStartTraining}
              disabled={training}
              className="rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {training ? "Starting..." : "Start AI training"}
            </button>
          )}
        </div>
      </div>

      {isTraining && (
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-amber-100">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-amber-500" />
          </div>
          <p className="mt-2 text-xs text-amber-700">
            Checking training status every 10 seconds…
          </p>
        </div>
      )}
    </div>
  );
}
