"use client";

import type { UserPhoto } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";

interface UserPhotoPickerProps {
  photos: UserPhoto[];
  open: boolean;
  onClose: () => void;
  onSelect: (photo: UserPhoto) => void;
  selectedPhotoId?: string | null;
}

export function UserPhotoPicker({
  photos,
  open,
  onClose,
  onSelect,
  selectedPhotoId,
}: UserPhotoPickerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Pick from your uploads</h3>
            <p className="text-sm text-gray-600">Choose a training photo as a reference for this edit.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {photos.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No uploaded photos yet. Add training photos above first.
          </div>
        ) : (
          <div className="grid max-h-[60vh] grid-cols-3 gap-3 overflow-y-auto p-5 sm:grid-cols-4">
            {photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => {
                  onSelect(photo);
                  onClose();
                }}
                className={cn(
                  "overflow-hidden rounded-xl border-2 transition",
                  selectedPhotoId === photo.id
                    ? "border-violet-500 ring-2 ring-violet-200"
                    : "border-transparent hover:border-gray-200"
                )}
              >
                <div className="relative aspect-[3/4] bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.publicUrl}
                    alt={photo.fileName}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
