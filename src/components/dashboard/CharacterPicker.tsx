"use client";

import type { UserCharacter } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";

interface CharacterPickerProps {
  characters: UserCharacter[];
  activeCharacterId: string | null;
  onSelect: (characterId: string) => Promise<void>;
  selecting?: boolean;
}

const STATUS_LABELS: Record<UserCharacter["status"], string> = {
  pending_training: "Queued",
  training: "Training…",
  ready: "Ready",
  failed: "Failed",
};

export function CharacterPicker({
  characters,
  activeCharacterId,
  onSelect,
  selecting = false,
}: CharacterPickerProps) {
  if (characters.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
        Train your first AI character below to unlock photo generation.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Choose your character</h3>
          <p className="text-xs text-gray-500">
            Pick which trained look to use for the next photo
          </p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {characters.map((character) => {
          const isActive = character.id === activeCharacterId;
          const isTraining =
            character.status === "training" || character.status === "pending_training";
          const isReady = character.status === "ready";

          return (
            <button
              key={character.id}
              type="button"
              disabled={selecting}
              onClick={() => onSelect(character.id)}
              className={cn(
                "min-w-[160px] shrink-0 rounded-xl border-2 px-4 py-3 text-left transition",
                isActive
                  ? "border-rose-500 bg-rose-50 ring-2 ring-rose-100"
                  : "border-gray-200 bg-white hover:border-gray-300",
                selecting && "opacity-70"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-gray-900">
                  {character.label}
                </span>
                {isTraining && (
                  <span className="h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                )}
              </div>
              <p className="mt-1 text-xs text-gray-600">
                {character.photoCount} training photo{character.photoCount === 1 ? "" : "s"}
              </p>
              <span
                className={cn(
                  "mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  isReady && "bg-green-100 text-green-800",
                  isTraining && "bg-amber-100 text-amber-800",
                  character.status === "failed" && "bg-red-100 text-red-800",
                  character.status === "pending_training" && "bg-blue-100 text-blue-800"
                )}
              >
                {STATUS_LABELS[character.status]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
