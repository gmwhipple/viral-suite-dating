"use client";

import { useState } from "react";
import type { GenerationJob } from "@/lib/firebase/types";
import { SMILE_OPTIONS } from "@/lib/constants";
import { formatDate, cn } from "@/lib/utils";
import { Smile, Laugh, SmilePlus } from "lucide-react";

interface GenerationGalleryProps {
  generations: GenerationJob[];
  token: string;
  onEditComplete: () => void;
}

const SMILE_ICONS = [SmilePlus, Laugh, Smile] as const;

export function GenerationGallery({ generations, token, onEditComplete }: GenerationGalleryProps) {
  const [previewGen, setPreviewGen] = useState<GenerationJob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [smileLoading, setSmileLoading] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [textEditLoading, setTextEditLoading] = useState(false);

  const sorted = [...generations].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const openPreview = (gen: GenerationJob) => {
    if (gen.status !== "completed" || !gen.finalImageUrl) return;
    setPreviewGen(gen);
    setPreviewUrl(gen.finalImageUrl);
    setPrompt("");
    setAttachment(null);
  };

  const applySmile = async (serviceChoice: number) => {
    if (!previewGen?.finalImageUrl) return;
    setSmileLoading(serviceChoice);
    try {
      const res = await fetch("/api/ailab/smile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceImageUrl: previewUrl || previewGen.finalImageUrl,
          serviceChoice,
          generationId: previewGen.id,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Smile edit failed");
      setPreviewUrl(json.imageUrl);
      onEditComplete();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Smile edit failed");
    } finally {
      setSmileLoading(null);
    }
  };

  const submitTextEdit = async () => {
    if (!previewGen || !prompt.trim() || !previewUrl) return;
    setTextEditLoading(true);
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("sourceImageUrl", previewUrl);
      if (attachment) formData.append("attachment", attachment);

      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Edit failed");

      setPreviewGen(null);
      setPreviewUrl(null);
      setPrompt("");
      setAttachment(null);
      onEditComplete();
    } catch (err) {
      alert(err instanceof Error ? err.message : "AI editing is not available yet.");
    } finally {
      setTextEditLoading(false);
    }
  };

  if (generations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
        <p className="text-gray-500">No generated photos yet. Pick a style reference above to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {sorted.map((gen) => (
          <GenerationTile key={gen.id} gen={gen} onOpen={() => openPreview(gen)} />
        ))}
      </div>

      {previewGen && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Edit photo</h3>
                <p className="mt-1 text-sm text-gray-600">Adjust your smile or describe other changes.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPreviewGen(null);
                  setPreviewUrl(null);
                }}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Generated photo preview" className="aspect-[3/4] w-full object-cover" />
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Smile styles</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {SMILE_OPTIONS.map((option, index) => {
                  const Icon = SMILE_ICONS[index] || Smile;
                  const loading = smileLoading === option.serviceChoice;
                  return (
                    <button
                      key={option.serviceChoice}
                      type="button"
                      disabled={smileLoading !== null}
                      onClick={() => applySmile(option.serviceChoice)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center transition",
                        loading
                          ? "border-violet-400 bg-violet-50"
                          : "border-gray-200 bg-gray-50 hover:border-violet-300 hover:bg-violet-50"
                      )}
                    >
                      <Icon className={cn("h-6 w-6", loading ? "text-violet-600" : "text-gray-700")} />
                      <span className="text-xs font-semibold text-gray-900">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 border-t border-gray-100 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Other AI edits</p>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='e.g. "Change my shirt to blue"'
                className="mt-2 w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
                rows={2}
              />
              <label className="mt-2 block text-sm text-gray-600">
                Reference image (optional)
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full text-sm"
                  onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                />
              </label>
              <button
                type="button"
                onClick={submitTextEdit}
                disabled={textEditLoading || !prompt.trim()}
                className="mt-3 w-full rounded-full bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {textEditLoading ? "Applying…" : "Apply text edit"}
              </button>
            </div>

            <a
              href={previewUrl}
              download
              className="mt-4 block w-full rounded-full border border-gray-200 py-2.5 text-center text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Download current version
            </a>
          </div>
        </div>
      )}
    </>
  );
}

function GenerationTile({ gen, onOpen }: { gen: GenerationJob; onOpen: () => void }) {
  const isPending = gen.status !== "completed" && gen.status !== "failed";
  const isFailed = gen.status === "failed";
  const previewUrl = gen.finalImageUrl || gen.imageReferenceUrl;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md",
        isFailed && "border-red-200",
        isPending && "border-amber-200",
        !isPending && !isFailed && "border-gray-200"
      )}
    >
      <div className="relative aspect-[3/4] bg-gray-100">
        {previewUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={previewUrl}
            alt="Generated photo"
            className={cn(
              "h-full w-full object-cover",
              isPending && "scale-105 blur-[2px] brightness-90"
            )}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">No preview</div>
        )}

        {isPending && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 px-3 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <p className="mt-3 text-xs font-semibold text-white">Creating your photo…</p>
          </div>
        )}

        {isFailed && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-950/50 p-3 text-center">
            <p className="text-xs font-semibold text-white">Generation failed</p>
          </div>
        )}

        {gen.status === "completed" && gen.finalImageUrl && (
          <>
            <button
              type="button"
              onClick={onOpen}
              className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 opacity-0 transition group-hover:opacity-100"
            >
              <div className="flex items-end justify-between gap-2">
                <p className="text-[10px] text-white/90">{formatDate(gen.createdAt)}</p>
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-violet-700">
                  Edit
                </span>
              </div>
            </button>
            <button
              type="button"
              onClick={onOpen}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white shadow-md"
              aria-label="Edit photo"
            >
              <SmilePlus className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
