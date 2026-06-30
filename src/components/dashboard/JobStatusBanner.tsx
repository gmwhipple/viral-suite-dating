"use client";

import type { ActivityLogEntry, UserProfile } from "@/lib/firebase/types";
import { MAX_GENERATIONS_PER_USER, TESTING_BYPASS_PAYMENT } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface JobStatusBannerProps {
  user: UserProfile;
  photoCount: number;
  recentActivity: ActivityLogEntry[];
  onCheckout: () => Promise<void>;
  checkingOut: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; description: string }> = {
  draft: {
    label: "Getting started",
    color: "bg-gray-100 text-gray-800",
    description: "Add training photos below, then start AI training.",
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
    description: "Your AI character is trained. Pick a style reference and generate photos.",
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
    label: "Training failed",
    color: "bg-red-100 text-red-800",
    description: "The last training attempt did not complete. You can retry below.",
  },
};

const ACTION_LABELS: Record<string, string> = {
  soul_training_started: "Training started",
  soul_training_failed: "Training failed",
  photo_uploaded: "Photo uploaded",
  photo_deleted: "Photo removed",
  generation_started: "Generation started",
};

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function JobStatusBanner({
  user,
  photoCount,
  recentActivity,
  onCheckout,
  checkingOut,
}: JobStatusBannerProps) {
  const config = STATUS_CONFIG[user.soulJobStatus] || STATUS_CONFIG.draft;
  const isTraining =
    user.soulJobStatus === "training" || user.soulJobStatus === "pending_training";
  const isFailed = user.soulJobStatus === "failed";
  const needsPayment = !TESTING_BYPASS_PAYMENT && user.plan !== "paid";

  const trainingTimeline = recentActivity.filter((entry) =>
    ["soul_training_started", "soul_training_failed", "photo_uploaded", "photo_deleted"].includes(
      entry.action
    )
  );

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-6 shadow-sm",
        isTraining && "border-amber-300 ring-2 ring-amber-100",
        isFailed && "border-red-200 ring-1 ring-red-100"
      )}
    >
      {isTraining && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="mt-0.5 h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
          <div>
            <p className="font-semibold text-amber-900">AI training in progress</p>
            <p className="mt-1 text-sm text-amber-800">
              {photoCount} training photo{photoCount === 1 ? "" : "s"} submitted. This page
              checks Higgsfield every 10 seconds and will update when ready.
            </p>
          </div>
        </div>
      )}

      {isFailed && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold text-red-900">Previous training did not finish</p>
          {user.lastTrainingError && (
            <p className="mt-2 font-mono text-xs text-red-900">{user.lastTrainingError}</p>
          )}
          <p className="mt-2">
            Your {photoCount} saved photo{photoCount === 1 ? "" : "s"} are still on your account.
            Retry training below — image links now use direct Firebase URLs Higgsfield can fetch.
          </p>
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

        {needsPayment && (
          <button
            onClick={onCheckout}
            disabled={checkingOut}
            className="rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {checkingOut ? "Loading..." : "Unlock — $49"}
          </button>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Training session
        </p>
        <dl className="mt-2 space-y-1 text-sm text-gray-700">
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium text-gray-900">Status:</dt>
            <dd>{config.label}</dd>
          </div>
          {user.higgsfieldRequestId && (
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-medium text-gray-900">Higgsfield job:</dt>
              <dd className="font-mono text-xs">{user.higgsfieldRequestId}</dd>
            </div>
          )}
          {user.soulReferenceId && (
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-medium text-gray-900">Character ID:</dt>
              <dd className="font-mono text-xs">{user.soulReferenceId}</dd>
            </div>
          )}
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-medium text-gray-900">Saved training photos:</dt>
            <dd>{photoCount}</dd>
          </div>
          {user.updatedAt && (
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-medium text-gray-900">Last updated:</dt>
              <dd>{formatWhen(user.updatedAt)}</dd>
            </div>
          )}
        </dl>

        {trainingTimeline.length > 0 && (
          <div className="mt-3 border-t border-gray-200 pt-3">
            <p className="text-xs font-semibold text-gray-500">Recent activity</p>
            <ul className="mt-2 space-y-1.5">
              {trainingTimeline.slice(0, 6).map((entry) => (
                <li key={entry.id} className="flex flex-wrap items-baseline gap-x-2 text-xs text-gray-600">
                  <span className="font-medium text-gray-800">
                    {ACTION_LABELS[entry.action] || entry.action}
                  </span>
                  <span>{formatWhen(entry.createdAt)}</span>
                  {entry.action === "soul_training_started" &&
                    entry.metadata &&
                    typeof entry.metadata.photoCount === "number" && (
                      <span>({String(entry.metadata.photoCount)} photos)</span>
                    )}
                  {entry.action === "soul_training_failed" &&
                    entry.metadata &&
                    typeof entry.metadata.error === "string" && (
                      <span className="text-red-700">— {entry.metadata.error}</span>
                    )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isTraining && (
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-amber-100">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-amber-500" />
          </div>
          <p className="mt-2 text-xs text-amber-700">Polling Higgsfield for completion…</p>
        </div>
      )}
    </div>
  );
}
