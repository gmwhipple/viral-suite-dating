"use client";

import { useEffect, useRef, useState } from "react";
import type { ImageReference, ReferenceGender } from "@/lib/firebase/types";
import { GENERATION_PROMPT_PLACEHOLDER } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CharacterPicker, type CharacterWithThumbnail } from "@/components/dashboard/CharacterPicker";
import { CreditsLimitModal } from "@/components/dashboard/CreditsLimitModal";
import { ImageIcon, Lock, Upload, X } from "lucide-react";

export interface GenerateReferencePayload {
  storageKey?: string;
  publicUrl?: string;
  name?: string;
  source?: ImageReference["source"];
  prompt: string;
  enhancePrompt: boolean;
  characterId: string;
}

interface ImageReferencePickerProps {
  token: string;
  initialGender?: ReferenceGender;
  characters: CharacterWithThumbnail[];
  activeCharacterId: string | null;
  onSelectCharacter: (characterId: string) => Promise<void>;
  onAddTraining?: () => void;
  selectingCharacter?: boolean;
  onGenerate: (payload: GenerateReferencePayload) => Promise<void>;
  generationsRemaining: number;
  disabled?: boolean;
  generationEnabled?: boolean;
  hasPaidAccess?: boolean;
  onUnlockReferences?: () => void;
  successMessage?: string | null;
}

type GenderReferenceCache = Partial<
  Record<
    ReferenceGender,
    {
      catalogReferences: ImageReference[];
      customReferences: ImageReference[];
      catalogLockedCount: number;
    }
  >
>;

export function ImageReferencePicker({
  token,
  initialGender = "men",
  characters,
  activeCharacterId,
  onSelectCharacter,
  onAddTraining,
  selectingCharacter,
  onGenerate,
  generationsRemaining,
  disabled,
  generationEnabled = true,
  hasPaidAccess = true,
  onUnlockReferences,
  successMessage,
}: ImageReferencePickerProps) {
  const [gender, setGender] = useState<ReferenceGender>(initialGender);
  const [referenceCache, setReferenceCache] = useState<GenderReferenceCache>({});
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [enhancePrompt, setEnhancePrompt] = useState(true);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [creditsLimitOpen, setCreditsLimitOpen] = useState(false);
  const cacheRef = useRef(referenceCache);
  cacheRef.current = referenceCache;

  useEffect(() => {
    let cancelled = false;

    if (cacheRef.current[gender]) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/references?gender=${gender}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json().then((json) => ({ res, json })))
      .then(({ res, json }) => {
        if (cancelled) return;
        if (!res.ok) throw new Error(json.error || "Failed to load references");
        setReferenceCache((prev) => ({
          ...prev,
          [gender]: {
            catalogReferences: (json.catalogReferences || []) as ImageReference[],
            customReferences: (json.customReferences || []) as ImageReference[],
            catalogLockedCount: Number(json.catalogLockedCount) || 0,
          },
        }));
      })
      .catch((err) => {
        if (cancelled) return;
        console.log("[ImageReferencePicker] load error", err);
        setReferenceCache((prev) => ({
          ...prev,
          [gender]: { catalogReferences: [], customReferences: [], catalogLockedCount: 0 },
        }));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [gender, token]);

  const cached = referenceCache[gender];
  const catalogReferences = cached?.catalogReferences ?? [];
  const catalogLockedCount = cached?.catalogLockedCount ?? 0;
  const customReferences = cached?.customReferences ?? [];
  const allReferences = [...customReferences, ...catalogReferences];
  const selected = allReferences.find((r) => r.storageKey === selectedKey) || null;
  const activeCharacter = characters.find((c) => c.id === activeCharacterId) || null;
  const characterReady = activeCharacter?.status === "ready";
  const hasPrompt = Boolean(prompt.trim());
  const hasReference = Boolean(selected);
  const atGenerationLimit = generationsRemaining <= 0;

  const saveGender = async (next: ReferenceGender) => {
    setGender(next);
    setSelectedKey(null);
    await fetch("/api/references", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gender: next }),
    });
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("gender", gender);
      const res = await fetch("/api/references", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      const uploaded = json.reference as ImageReference;
      setReferenceCache((prev) => {
        const current = prev[gender] || {
          catalogReferences: [],
          customReferences: [],
          catalogLockedCount: 0,
        };
        return {
          ...prev,
          [gender]: {
            ...current,
            customReferences: [uploaded, ...current.customReferences.filter((r) => r.storageKey !== uploaded.storageKey)],
          },
        };
      });
      setSelectedKey(uploaded.storageKey);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const selectReference = (key: string) => {
    setSelectedKey((current) => (current === key ? null : key));
  };

  const handleGenerate = async () => {
    if (!activeCharacterId) return;

    if (atGenerationLimit) {
      setCreditsLimitOpen(true);
      return;
    }

    if (!hasPrompt && !hasReference) return;
    if (!characterReady || disabled || generating) return;

    setGenerating(true);
    try {
      await onGenerate({
        ...(selected
          ? {
              storageKey: selected.storageKey,
              publicUrl: selected.publicUrl,
              name: selected.name,
              source: selected.source,
            }
          : {}),
        prompt: prompt.trim(),
        enhancePrompt: hasPrompt && !hasReference ? enhancePrompt : false,
        characterId: activeCharacterId,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateClick = () => {
    if (atGenerationLimit) {
      setCreditsLimitOpen(true);
      return;
    }
    void handleGenerate();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <CreditsLimitModal
        open={creditsLimitOpen}
        onClose={() => setCreditsLimitOpen(false)}
        type="generations"
      />

      <CharacterPicker
        characters={characters}
        activeCharacterId={activeCharacterId}
        onSelect={onSelectCharacter}
        onAddTraining={onAddTraining}
        selecting={selectingCharacter}
      />

      {!generationEnabled ? null : (
        <>
      <div className="mt-8 border-t border-gray-100 pt-8">
        <h2 className="text-base font-semibold tracking-tight text-gray-900">Create your photo</h2>
        <p className="mt-0.5 text-sm text-gray-500">
          Pick an optional style reference, describe changes, or both
        </p>
      </div>

      {activeCharacter && !characterReady && (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {activeCharacter.status === "training" || activeCharacter.status === "pending_training"
            ? `${activeCharacter.label} is still training (${activeCharacter.photoCount} photos). Pick another character or wait until it's ready.`
            : "Selected character isn't ready yet — choose a ready character above."}
        </p>
      )}

      {successMessage && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          ✓ {successMessage}
        </div>
      )}

      <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className="mx-auto w-[85%] max-w-[20.4rem] lg:max-w-none">
          <p className="mb-3 text-sm font-medium text-gray-900">Reference image</p>
          <div
            className={cn(
              "relative aspect-[3/4] overflow-hidden rounded-2xl border bg-gray-50",
              selected ? "border-gray-900 shadow-md" : "border-dashed border-gray-300"
            )}
          >
            {selected ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.publicUrl}
                  alt="Selected style reference"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setSelectedKey(null)}
                  className="absolute right-3 top-3 rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black/80"
                  aria-label="Clear reference"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-8">
                  <p className="text-xs text-white/90">Tap a different style below to change</p>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200">
                  <ImageIcon className="h-7 w-7 text-gray-400" />
                </div>
                <p className="mt-4 text-sm font-medium text-gray-700">No reference selected</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  Optional — choose a style below, or generate from your prompt only
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col lg:mt-0">
          <label htmlFor="generation-prompt" className="text-sm font-medium text-gray-900">
            Generation prompt
          </label>
          <p className="mt-0.5 text-xs text-gray-500">
            {hasReference
              ? "Optional when a reference is selected, describe tweaks like outfit or pose"
              : "Required when no reference is selected"}
          </p>
          <textarea
            id="generation-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            placeholder={GENERATION_PROMPT_PLACEHOLDER}
            className="mt-2 w-full flex-1 rounded-xl border border-gray-200 bg-white p-3 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
          />

          {!hasReference && (
            <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={enhancePrompt}
                onChange={(e) => setEnhancePrompt(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400"
              />
              Enhance prompt
            </label>
          )}

          <button
            type="button"
            onClick={handleGenerateClick}
            disabled={
              !characterReady ||
              disabled ||
              generating ||
              (!hasPrompt && !hasReference)
            }
            className={cn(
              "w-full rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50",
              hasReference ? "mt-5" : "mt-4"
            )}
          >
            {generating ? "Submitting…" : "Generate photo"}
          </button>

          {atGenerationLimit && (
            <button
              type="button"
              onClick={() => setCreditsLimitOpen(true)}
              className="mt-2 text-center text-xs text-gray-500 underline hover:text-gray-700"
            >
              Need more generations?
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 border-t border-gray-100 pt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Browse style references</p>
            <p className="mt-0.5 text-xs text-gray-500">Tap a photo to use it as your reference</p>
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading…" : "Upload your own"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={uploading || disabled}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex border-b border-gray-200 bg-gray-50">
            {(["men", "women"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => saveGender(g)}
                className={cn(
                  "relative flex-1 px-4 py-3 text-sm font-medium transition",
                  gender === g
                    ? "bg-white text-gray-900"
                    : "text-gray-500 hover:bg-white/60 hover:text-gray-700"
                )}
              >
                {g === "men" ? "Men" : "Women"}
                {gender === g && (
                  <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-gray-900" />
                )}
              </button>
            ))}
          </div>

          <div className="p-4">
            {loading && !cached ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
              </div>
            ) : allReferences.length === 0 ? (
              <div className="rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-600">
                No reference images in this folder yet. Upload your own above.
              </div>
            ) : (
              <div className="space-y-5">
                {customReferences.length > 0 && (
                  <section>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Your uploads
                    </h3>
                    <ReferenceGrid
                      references={customReferences}
                      selectedKey={selectedKey}
                      onSelect={selectReference}
                    />
                  </section>
                )}
                <section>
                  {customReferences.length > 0 && (
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Catalog
                    </h3>
                  )}
                  <ReferenceGrid
                    references={catalogReferences}
                    selectedKey={selectedKey}
                    onSelect={selectReference}
                    lockedCount={!hasPaidAccess ? catalogLockedCount : 0}
                    onUnlock={onUnlockReferences}
                  />
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}

function ReferenceGrid({
  references,
  selectedKey,
  onSelect,
  lockedCount = 0,
  onUnlock,
}: {
  references: ImageReference[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  lockedCount?: number;
  onUnlock?: () => void;
}) {
  if (references.length === 0 && lockedCount === 0) {
    return <p className="text-sm text-gray-500">No images in this section yet.</p>;
  }

  return (
    <div className="grid max-h-[28rem] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      {references.map((ref, index) => {
        const isSelected = selectedKey === ref.storageKey;
        return (
          <button
            key={ref.storageKey}
            type="button"
            onClick={() => onSelect(ref.storageKey)}
            className={cn(
              "group overflow-hidden rounded-xl border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2",
              isSelected
                ? "border-gray-900 shadow-md"
                : "border-transparent ring-1 ring-gray-200 hover:ring-gray-400"
            )}
          >
            <div className="relative aspect-[3/4] bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ref.publicUrl}
                alt={`Style reference ${index + 1}`}
                className="h-full w-full object-cover transition group-hover:scale-[1.02]"
              />
              {isSelected && (
                <span className="absolute left-2 top-2 rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                  Selected
                </span>
              )}
            </div>
          </button>
        );
      })}

      {lockedCount > 0 && (
        <button
          type="button"
          onClick={onUnlock}
          className="overflow-hidden rounded-xl border-2 border-dashed border-rose-200 bg-gradient-to-br from-rose-50 to-gray-100 ring-1 ring-rose-100 transition hover:border-rose-300 hover:from-rose-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          aria-label={`${lockedCount} more style references locked — upgrade to unlock`}
        >
          <div className="relative flex aspect-[3/4] flex-col items-center justify-center px-2 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-rose-200">
              <Lock className="h-4 w-4 text-rose-600" />
            </span>
            <p className="mt-3 text-xs font-semibold text-gray-900">+{lockedCount} hidden</p>
            <p className="mt-1 text-[10px] leading-snug text-gray-500">
              Upgrade to unlock the full catalog
            </p>
          </div>
        </button>
      )}
    </div>
  );
}
