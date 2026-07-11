"use client";

import { ExamplePhotosGuide } from "@/components/dashboard/ExamplePhotosGuide";
import { PhotoUploadZone } from "@/components/dashboard/PhotoUploadZone";
import type { SoulJobStatus, UserPhoto } from "@/lib/firebase/types";

interface CharacterTrainingPanelProps {
  photos: UserPhoto[];
  maxPhotos: number;
  token: string;
  onRefresh: () => Promise<void>;
  onStartTraining: () => Promise<void>;
  onClose: () => void;
  disabled?: boolean;
  modelStatus?: SoulJobStatus;
  training?: boolean;
}

export function CharacterTrainingPanel({
  photos,
  maxPhotos,
  token,
  onRefresh,
  onStartTraining,
  onClose,
  disabled,
  modelStatus,
  training,
}: CharacterTrainingPanelProps) {
  return (
    <section
      id="new-character-training"
      className="scroll-mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Train a new character</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Review the guide, upload photos, then start training when you&apos;re ready
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
        >
          Close
        </button>
      </div>

      <div className="space-y-0">
        <ExamplePhotosGuide embedded />
        <PhotoUploadZone
          embedded
          photos={photos}
          maxPhotos={maxPhotos}
          token={token}
          onRefresh={onRefresh}
          onStartTraining={onStartTraining}
          disabled={disabled}
          modelStatus={modelStatus}
          training={training}
        />
      </div>
    </section>
  );
}
