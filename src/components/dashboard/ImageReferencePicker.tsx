"use client";

import { useCallback, useEffect, useState } from "react";
import type { ImageReference, ReferenceGender, UserCharacter } from "@/lib/firebase/types";
import { CharacterPicker } from "@/components/dashboard/CharacterPicker";
import { cn } from "@/lib/utils";

export interface GenerateReferencePayload {
  storageKey: string;
  publicUrl: string;
  name: string;
  source: ImageReference["source"];
}

interface ImageReferencePickerProps {
  token: string;
  initialGender?: ReferenceGender;
  characters: UserCharacter[];
  activeCharacterId: string | null;
  onSelectCharacter: (characterId: string) => Promise<void>;
  selectingCharacter?: boolean;
  onGenerate: (payload: GenerateReferencePayload) => Promise<void>;
  generationsRemaining: number;
  disabled?: boolean;
  successMessage?: string | null;
}

export function ImageReferencePicker({
  token,
  initialGender = "men",
  characters,
  activeCharacterId,
  onSelectCharacter,
  selectingCharacter = false,
  onGenerate,
  generationsRemaining,
  disabled,
  successMessage,
}: ImageReferencePickerProps) {
  const [gender, setGender] = useState<ReferenceGender>(initialGender);
  const [catalogReferences, setCatalogReferences] = useState<ImageReference[]>([]);
  const [customReferences, setCustomReferences] = useState<ImageReference[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const loadReferences = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/references?gender=${gender}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load references");
      setCatalogReferences(json.catalogReferences || []);
      setCustomReferences(json.customReferences || []);
    } catch (err) {
      console.log("[ImageReferencePicker] load error", err);
      setCatalogReferences([]);
      setCustomReferences([]);
    } finally {
      setLoading(false);
    }
  }, [gender, token]);

  useEffect(() => {
    loadReferences();
  }, [loadReferences]);

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
      setSelectedKey(json.reference.storageKey);
      await loadReferences();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const allReferences = [...customReferences, ...catalogReferences];
  const selected = allReferences.find((r) => r.storageKey === selectedKey) || null;
  const activeCharacter = characters.find((c) => c.id === activeCharacterId) || null;
  const characterReady =
    activeCharacter?.status === "ready" && Boolean(activeCharacter.soulReferenceId);

  const handleGenerate = async () => {
    if (!selected || generating) return;
    setGenerating(true);
    try {
      await onGenerate({
        storageKey: selected.storageKey,
        publicUrl: selected.publicUrl,
        name: selected.name,
        source: selected.source,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Pick a style reference image</h2>
          <p className="text-sm text-gray-600">
            Choose from {gender === "men" ? "men's" : "women's"} catalog or upload your own
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={
            !selected || !characterReady || disabled || generating || generationsRemaining <= 0
          }
          className="rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50 hover:bg-rose-700"
        >
          {generating ? "Submitting…" : "Generate photo"}
        </button>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-6">
        <CharacterPicker
          characters={characters}
          activeCharacterId={activeCharacterId}
          onSelect={onSelectCharacter}
          selecting={selectingCharacter}
        />
        {activeCharacter && !characterReady && (
          <p className="mt-3 text-sm text-amber-700">
            {activeCharacter.status === "training" || activeCharacter.status === "pending_training"
              ? `This character is still training (${activeCharacter.photoCount} photos submitted).`
              : "This character is not ready — select a ready character or train a new one."}
          </p>
        )}
      </div>

      {successMessage && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          ✓ {successMessage}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {(["men", "women"] as const).map((g) => (
          <button
            key={g}
            onClick={() => saveGender(g)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium capitalize transition",
              gender === g ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
        <label className="flex cursor-pointer flex-col items-center gap-2 text-center">
          <span className="text-sm font-semibold text-gray-900">Upload your own reference</span>
          <span className="text-xs text-gray-500">JPG, PNG, or WEBP · max 15MB</span>
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
          <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-rose-600 ring-1 ring-rose-200">
            {uploading ? "Uploading..." : "Choose file"}
          </span>
        </label>
      </div>

      {loading ? (
        <div className="mt-6 flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-600 border-t-transparent" />
        </div>
      ) : allReferences.length === 0 ? (
        <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          No reference images yet. Upload your own above, or add files in{" "}
          <strong>Firebase Console → Storage</strong> under{" "}
          <code className="rounded bg-amber-100 px-1">references/{gender}/</code>.
        </div>
      ) : (
        <div className="mt-4 space-y-6">
          {customReferences.length > 0 && (
            <section>
              <h3 className="mb-2 text-sm font-semibold text-gray-900">Your uploads</h3>
              <ReferenceGrid
                references={customReferences}
                selectedKey={selectedKey}
                onSelect={setSelectedKey}
              />
            </section>
          )}
          <section>
            <h3 className="mb-2 text-sm font-semibold text-gray-900">
              {gender === "men" ? "Men's" : "Women's"} catalog
            </h3>
            <ReferenceGrid
              references={catalogReferences}
              selectedKey={selectedKey}
              onSelect={setSelectedKey}
            />
          </section>
        </div>
      )}
    </div>
  );
}

function ReferenceGrid({
  references,
  selectedKey,
  onSelect,
}: {
  references: ImageReference[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
}) {
  if (references.length === 0) {
    return <p className="text-sm text-gray-500">No images in this section yet.</p>;
  }

  return (
    <div className="grid max-h-96 grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4 md:grid-cols-5">
      {references.map((ref, index) => (
        <button
          key={ref.storageKey}
          onClick={() => onSelect(ref.storageKey)}
          className={cn(
            "overflow-hidden rounded-xl border-2 transition",
            selectedKey === ref.storageKey
              ? "border-rose-500 ring-2 ring-rose-200"
              : "border-transparent hover:border-gray-200"
          )}
        >
          <div className="relative aspect-[4/5] bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ref.publicUrl}
              alt={`Style reference ${index + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {selectedKey === ref.storageKey && (
              <span className="absolute bottom-2 right-2 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                Selected
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
