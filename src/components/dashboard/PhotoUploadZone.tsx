"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UserPhoto, SoulJobStatus } from "@/lib/firebase/types";
import { MIN_SOUL_TRAINING_PHOTOS } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
  soulJobStatus?: SoulJobStatus;
  training?: boolean;
}

export function PhotoUploadZone({
  photos,
  maxPhotos,
  token,
  onRefresh,
  onStartTraining,
  disabled,
  soulJobStatus,
  training = false,
}: PhotoUploadZoneProps) {
  const [pendingFiles, setPendingFiles] = useState<PendingPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingRef = useRef(pendingFiles);
  pendingRef.current = pendingFiles;

  const totalCount = photos.length + pendingFiles.length;
  const remaining = maxPhotos - totalCount;
  const hasEnoughPhotos = totalCount >= MIN_SOUL_TRAINING_PHOTOS;

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

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) addFiles(e.dataTransfer.files);
  };

  const hasPending = pendingFiles.length > 0;
  const showTrainOnly = !hasPending && photos.length >= MIN_SOUL_TRAINING_PHOTOS;
  const isTraining =
    soulJobStatus === "training" || soulJobStatus === "pending_training";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
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
              <img src={photo.publicUrl} alt={photo.fileName} className="h-full w-full object-cover" />
              {!disabled && !uploading && (
                <button
                  type="button"
                  onClick={() => deleteSavedPhoto(photo.id)}
                  disabled={deletingId === photo.id}
                  className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-100"
                  aria-label={`Remove ${photo.fileName}`}
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
              <img src={pending.previewUrl} alt={pending.file.name} className="h-full w-full object-cover" />
              {!disabled && !uploading && (
                <button
                  type="button"
                  onClick={() => removePending(pending.id)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
                  aria-label={`Remove ${pending.file.name}`}
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
              onClick={uploadPendingAndTrain}
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
              onClick={startTrainingOnly}
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
    </div>
  );
}
