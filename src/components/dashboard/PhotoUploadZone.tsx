"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UserPhoto, SoulJobStatus } from "@/lib/firebase/types";
import {
  MIN_SOUL_TRAINING_PHOTOS,
  TRAINING_QUALITY_EXCELLENT_MIN,
  TRAINING_QUALITY_GOOD_MIN,
  TRAINING_LOW_PHOTO_WARNING_THRESHOLD,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

type TrainingQuality = "bad" | "good" | "excellent";

function getTrainingQuality(count: number): TrainingQuality {
  if (count >= TRAINING_QUALITY_EXCELLENT_MIN) return "excellent";
  if (count >= TRAINING_QUALITY_GOOD_MIN) return "good";
  return "bad";
}

function getTrainingMeterFill(count: number): number {
  if (count <= 0) return 0;
  if (count < TRAINING_QUALITY_GOOD_MIN) {
    return Math.min(33, Math.round((count / TRAINING_QUALITY_GOOD_MIN) * 33));
  }
  if (count < TRAINING_QUALITY_EXCELLENT_MIN) {
    const progress = (count - TRAINING_QUALITY_GOOD_MIN) / (TRAINING_QUALITY_EXCELLENT_MIN - TRAINING_QUALITY_GOOD_MIN);
    return Math.round(33 + progress * 34);
  }
  return Math.min(100, Math.round(67 + ((count - TRAINING_QUALITY_EXCELLENT_MIN) / TRAINING_QUALITY_EXCELLENT_MIN) * 33));
}

const QUALITY_STYLES: Record<
  TrainingQuality,
  { label: string; bar: string; text: string; hint: string }
> = {
  bad: {
    label: "Bad",
    bar: "bg-red-500",
    text: "text-red-700",
    hint: "Add more angles — front, sides, and different lighting help the AI learn your face.",
  },
  good: {
    label: "Good",
    bar: "bg-amber-500",
    text: "text-amber-700",
    hint: "Solid start. More variety (expressions, distances, backgrounds) improves results.",
  },
  excellent: {
    label: "Excellent",
    bar: "bg-emerald-500",
    text: "text-emerald-700",
    hint: "Great variety for training — you're set for strong character likeness.",
  },
};

interface PendingPhoto {
  id: string;
  file: File;
  previewUrl: string;
}

interface PhotoUploadZoneProps {
  photos: UserPhoto[];
  maxPhotos: number;
  token: string;
  onRefresh: () => Promise<void>;
  onStartTraining: () => Promise<void>;
  disabled?: boolean;
  modelStatus?: SoulJobStatus;
  training?: boolean;
  embedded?: boolean;
}

export function PhotoUploadZone({
  photos,
  maxPhotos,
  token,
  onRefresh,
  onStartTraining,
  disabled,
  modelStatus,
  training = false,
  embedded = false,
}: PhotoUploadZoneProps) {
  const [pendingFiles, setPendingFiles] = useState<PendingPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTrainingConfirm, setShowTrainingConfirm] = useState(false);
  const [pendingTrainAction, setPendingTrainAction] = useState<"upload" | "only" | null>(null);
  const pendingRef = useRef(pendingFiles);
  pendingRef.current = pendingFiles;

  const totalCount = photos.length + pendingFiles.length;
  const remaining = maxPhotos - totalCount;
  const hasEnoughPhotos = totalCount >= MIN_SOUL_TRAINING_PHOTOS;
  const trainingQuality = getTrainingQuality(totalCount);
  const qualityStyle = QUALITY_STYLES[trainingQuality];
  const meterFill = getTrainingMeterFill(totalCount);

  useEffect(() => {
    return () => {
      pendingRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, []);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));

      if (fileArray.length === 0) {
        setError("Please select image files only");
        return;
      }

      if (fileArray.length > remaining) {
        setError(`Only ${remaining} slots remaining (${totalCount}/${maxPhotos})`);
        return;
      }

      setError(null);
      setPendingFiles((prev) => [
        ...prev,
        ...fileArray.map((file) => ({
          id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
          file,
          previewUrl: URL.createObjectURL(file),
        })),
      ]);
    },
    [remaining, totalCount, maxPhotos]
  );

  const removePending = useCallback((id: string) => {
    setPendingFiles((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const deleteSavedPhoto = async (photoId: string) => {
    if (disabled || uploading) return;

    setDeletingId(photoId);
    setError(null);

    try {
      const res = await fetch(`/api/upload?photoId=${encodeURIComponent(photoId)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed");
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const uploadPendingAndTrain = async () => {
    if (!hasEnoughPhotos) {
      setError(`Add at least ${MIN_SOUL_TRAINING_PHOTOS} photos to start training.`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      for (const pending of pendingFiles) {
        const formData = new FormData();
        formData.append("file", pending.file);

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.error || "Upload failed");
        }
      }

      pendingFiles.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      setPendingFiles([]);
      await onRefresh();
      await onStartTraining();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const startTrainingOnly = async () => {
    if (!hasEnoughPhotos) return;

    setUploading(true);
    setError(null);

    try {
      await onStartTraining();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Training failed");
    } finally {
      setUploading(false);
    }
  };

  const runTrainAction = async (action: "upload" | "only") => {
    if (action === "upload") {
      await uploadPendingAndTrain();
    } else {
      await startTrainingOnly();
    }
  };

  const requestTraining = (action: "upload" | "only") => {
    if (!hasEnoughPhotos) {
      setError(`Add at least ${MIN_SOUL_TRAINING_PHOTOS} photos to start training.`);
      return;
    }

    setPendingTrainAction(action);
    setShowTrainingConfirm(true);
  };

  const confirmTraining = () => {
    setShowTrainingConfirm(false);
    const action = pendingTrainAction;
    setPendingTrainAction(null);
    if (action) void runTrainAction(action);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) addFiles(e.dataTransfer.files);
  };

  const hasPending = pendingFiles.length > 0;
  const showTrainOnly = !hasPending && photos.length >= MIN_SOUL_TRAINING_PHOTOS;
  const isTraining =
    modelStatus === "training" || modelStatus === "pending_training";

  return (
    <div className={embedded ? "px-6 pb-6 pt-2" : "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Your training photos</h2>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
          {totalCount} / {maxPhotos}
        </span>
      </div>

      <p className="mt-1 text-sm text-gray-500">
        {photos.length > 0
          ? `${photos.length} photo${photos.length === 1 ? "" : "s"} saved to your account (any device). `
          : ""}
        New picks stay on this device until you upload. Minimum {MIN_SOUL_TRAINING_PHOTOS} to train.
      </p>

      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-gray-900">Training quality</p>
          <span className={cn("text-sm font-semibold", qualityStyle.text)}>{qualityStyle.label}</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-200">
          <div
            className={cn("h-full rounded-full transition-all duration-300", qualityStyle.bar)}
            style={{ width: `${meterFill}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-600">{qualityStyle.hint}</p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500">
          <span>Under {TRAINING_QUALITY_GOOD_MIN}: Bad</span>
          <span>{TRAINING_QUALITY_GOOD_MIN}–{TRAINING_QUALITY_EXCELLENT_MIN - 1}: Good</span>
          <span>{TRAINING_QUALITY_EXCELLENT_MIN}+: Excellent</span>
        </div>
      </div>

      {isTraining && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Training is running — uploads are locked until your AI character is ready.
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition",
          dragOver ? "border-rose-400 bg-rose-50" : "border-gray-200 bg-gray-50",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <p className="text-4xl">📸</p>
        <p className="mt-2 font-medium text-gray-900">Drag & drop photos here</p>
        <p className="text-sm text-gray-500">or click to browse · JPG, PNG, WEBP · max 15MB each</p>
        <label className="mt-4 cursor-pointer rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">
          Choose files
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            disabled={disabled || uploading || remaining <= 0}
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {totalCount > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-8">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.publicUrl} alt="Training photo" className="h-full w-full object-cover" />
              {!disabled && !uploading && (
                <button
                  type="button"
                  onClick={() => deleteSavedPhoto(photo.id)}
                  disabled={deletingId === photo.id}
                  className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-100"
                  aria-label="Remove photo"
                >
                  {deletingId === photo.id ? "…" : "✕"}
                </button>
              )}
              <span className="absolute bottom-1 left-1 rounded bg-gray-800/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                Saved
              </span>
            </div>
          ))}
          {pendingFiles.map((pending) => (
            <div key={pending.id} className="group relative aspect-square overflow-hidden rounded-lg ring-2 ring-rose-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pending.previewUrl} alt="New training photo" className="h-full w-full object-cover" />
              {!disabled && !uploading && (
                <button
                  type="button"
                  onClick={() => removePending(pending.id)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
                  aria-label="Remove photo"
                >
                  ✕
                </button>
              )}
              <span className="absolute bottom-1 left-1 rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                New
              </span>
            </div>
          ))}
        </div>
      )}

      {!disabled && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {hasPending ? (
            <button
              type="button"
              onClick={() => requestTraining("upload")}
              disabled={uploading || training || !hasEnoughPhotos}
              className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading || training
                ? "Uploading & starting..."
                : `Upload ${pendingFiles.length} photo${pendingFiles.length === 1 ? "" : "s"} & start AI training`}
            </button>
          ) : showTrainOnly ? (
            <button
              type="button"
              onClick={() => requestTraining("only")}
              disabled={uploading || training || !hasEnoughPhotos}
              className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading || training ? "Starting..." : "Start AI training"}
            </button>
          ) : (
            <p className="text-sm text-gray-500">
              {totalCount < MIN_SOUL_TRAINING_PHOTOS
                ? `Add ${MIN_SOUL_TRAINING_PHOTOS - totalCount} more photo${MIN_SOUL_TRAINING_PHOTOS - totalCount === 1 ? "" : "s"} to enable training.`
                : "Choose photos above, then start training."}
            </p>
          )}
        </div>
      )}
      {showTrainingConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="training-confirm-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h3 id="training-confirm-title" className="text-lg font-bold text-gray-900">
              Start AI training?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {pendingTrainAction === "upload" ? (
                <>
                  This will upload {pendingFiles.length} new photo
                  {pendingFiles.length === 1 ? "" : "s"} and train your character with {totalCount}{" "}
                  photo{totalCount === 1 ? "" : "s"} total.
                </>
              ) : (
                <>
                  You&apos;re about to train your character with {totalCount} photo
                  {totalCount === 1 ? "" : "s"}.
                </>
              )}
            </p>

            <div className="mt-4 space-y-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-700">Upload slots left on your account</span>
                <span className="font-semibold text-gray-900">
                  {remaining} / {maxPhotos}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-700">Estimated training quality</span>
                <span className={cn("font-semibold", qualityStyle.text)}>{qualityStyle.label}</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-600">{qualityStyle.hint}</p>
            </div>

            {totalCount < TRAINING_LOW_PHOTO_WARNING_THRESHOLD && (
              <p className="mt-4 text-sm leading-relaxed text-amber-800">
                You have fewer than {TRAINING_LOW_PHOTO_WARNING_THRESHOLD} photos. More angles and
                expressions usually improve likeness — consider adding more before training.
              </p>
            )}

            <p className="mt-4 text-sm text-gray-500">
              Training usually takes 20–45 minutes. Uploads lock until your character is ready.
            </p>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowTrainingConfirm(false);
                  setPendingTrainAction(null);
                }}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmTraining}
                className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Confirm & start training
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
