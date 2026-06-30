"use client";

import { useCallback, useState } from "react";
import type { UserPhoto } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";

interface PhotoUploadZoneProps {
  photos: UserPhoto[];
  maxPhotos: number;
  token: string;
  onUploadComplete: () => void;
  disabled?: boolean;
}

export function PhotoUploadZone({
  photos,
  maxPhotos,
  token,
  onUploadComplete,
  disabled,
}: PhotoUploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
      const remaining = maxPhotos - photos.length;

      if (fileArray.length === 0) {
        setError("Please select image files only");
        return;
      }

      if (fileArray.length > remaining) {
        setError(`Only ${remaining} slots remaining (${photos.length}/${maxPhotos})`);
        return;
      }

      setUploading(true);
      setError(null);

      try {
        for (const file of fileArray) {
          const formData = new FormData();
          formData.append("file", file);

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
        onUploadComplete();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [photos.length, maxPhotos, token, onUploadComplete]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) uploadFiles(e.dataTransfer.files);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Your training photos</h2>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
          {photos.length} / {maxPhotos}
        </span>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
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
          {uploading ? "Uploading..." : "Choose files"}
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            disabled={disabled || uploading}
            onChange={(e) => e.target.files && uploadFiles(e.target.files)}
          />
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {photos.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-8">
          {photos.map((photo) => (
            <div key={photo.id} className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.publicUrl} alt={photo.fileName} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
