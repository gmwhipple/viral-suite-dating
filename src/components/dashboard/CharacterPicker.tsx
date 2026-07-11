"use client";

import type { UserCharacter } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";
import { Images, Loader2, Plus } from "lucide-react";

export type CharacterWithThumbnail = UserCharacter & { thumbnailUrl?: string };

interface CharacterPickerProps {
  characters: CharacterWithThumbnail[];
  activeCharacterId: string | null;
  onSelect: (characterId: string) => Promise<void>;
  onAddTraining?: () => void;
  selecting?: boolean;
}

const STATUS_STYLES: Record<
  UserCharacter["status"],
  { label: string; className: string }
> = {
  ready: { label: "Ready", className: "bg-emerald-600/95 text-white" },
  training: { label: "Training", className: "bg-amber-500/95 text-white" },
  pending_training: { label: "Queued", className: "bg-gray-700/90 text-white" },
  failed: { label: "Failed", className: "bg-red-600/95 text-white" },
};

export function CharacterPicker({
  characters,
  activeCharacterId,
  onSelect,
  onAddTraining,
  selecting = false,
}: CharacterPickerProps) {
  const hasPendingTraining = characters.some(
    (c) => c.status === "training" || c.status === "pending_training"
  );

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-gray-900">Your characters</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Select a trained look for the next photo
          </p>
        </div>
        {hasPendingTraining && (
          <p className="max-w-xs text-right text-xs text-amber-700">
            Training in progress — usually 20–45 minutes
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {characters.map((character) => {
          const isActive = character.id === activeCharacterId;
          const isTraining =
            character.status === "training" || character.status === "pending_training";
          const status = STATUS_STYLES[character.status];

          return (
            <button
              key={character.id}
              type="button"
              disabled={selecting}
              onClick={() => onSelect(character.id)}
              className={cn(
                "group relative w-[124px] shrink-0 overflow-hidden rounded-2xl border bg-white text-left transition",
                isActive
                  ? "border-gray-900 shadow-md ring-2 ring-gray-900 ring-offset-2"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm",
                selecting && "opacity-70"
              )}
            >
              <div className="relative aspect-[3/4] w-full bg-gray-100">
                {character.thumbnailUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={character.thumbnailUrl}
                    alt={character.label}
                    className={cn("h-full w-full object-cover", isTraining && "opacity-85")}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">
                    No preview
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/25" />

                {isTraining && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/35">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-800" />
                  </div>
                )}

                <span
                  className={cn(
                    "absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm",
                    status.className
                  )}
                >
                  {status.label}
                </span>

                <p className="absolute bottom-8 left-2 right-2 truncate text-[11px] font-medium text-white drop-shadow">
                  {character.label}
                </p>

                <div className="absolute bottom-2 right-2 flex items-center gap-0.5 rounded-full bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  <Images className="h-3 w-3" />
                  {character.photoCount}
                </div>
              </div>
            </button>
          );
        })}

        {onAddTraining && (
          <button
            type="button"
            onClick={onAddTraining}
            className="flex w-[124px] shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/80 text-gray-600 transition hover:border-rose-300 hover:bg-rose-50/50 hover:text-rose-700"
            style={{ aspectRatio: "3/4" }}
            aria-label="Train new character"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
              <Plus className="h-5 w-5" />
            </span>
            <span className="mt-3 text-xs font-semibold">New character</span>
          </button>
        )}
      </div>
    </div>
  );
}
