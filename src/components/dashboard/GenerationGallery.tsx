"use client";

import { useState } from "react";
import type { GenerationJob } from "@/lib/firebase/types";
import { formatDate, cn } from "@/lib/utils";

interface GenerationGalleryProps {
  generations: GenerationJob[];
  token: string;
  onEditComplete: () => void;
}

export function GenerationGallery({ generations, token, onEditComplete }: GenerationGalleryProps) {
  const [editingGen, setEditingGen] = useState<GenerationJob | null>(null);
  const [prompt, setPrompt] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const sorted = [...generations].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const submitEdit = async () => {
    if (!editingGen || !prompt.trim() || !editingGen.finalImageUrl) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("sourceImageUrl", editingGen.finalImageUrl);
      if (attachment) formData.append("attachment", attachment);

      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Edit failed");
      }

      setEditingGen(null);
      setPrompt("");
      setAttachment(null);
      onEditComplete();
    } catch (err) {
      alert(err instanceof Error ? err.message : "AI editing is not available yet.");
    } finally {
      setLoading(false);
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {sorted.map((gen) => (
          <GenerationTile
            key={gen.id}
            gen={gen}
            onEdit={() => {
              if (gen.status === "completed" && gen.finalImageUrl) {
                setEditingGen(gen);
                setPrompt("");
                setAttachment(null);
              }
            }}
          />
        ))}
      </div>

      {editingGen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">AI Edit</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Describe how you want to change this photo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingGen(null)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>

            {editingGen.finalImageUrl && (
              <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editingGen.finalImageUrl}
                  alt="Photo to edit"
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
            )}

            <div className="mt-4 space-y-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='e.g. "Change my shirt to blue" or "Remove background clutter"'
                className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
                rows={3}
              />
              <label className="block text-sm text-gray-600">
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
                onClick={submitEdit}
                disabled={loading || !prompt.trim()}
                className="w-full rounded-full bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {loading ? "Sending to AI editor…" : "Apply AI Edit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GenerationTile({
  gen,
  onEdit,
}: {
  gen: GenerationJob;
  onEdit: () => void;
}) {
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
            <p className="mt-1 text-[10px] text-white/80 capitalize">
              {gen.status.replace(/_/g, " ")}
            </p>
          </div>
        )}

        {isFailed && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-950/50 p-3 text-center">
            <p className="text-xs font-semibold text-white">Generation failed</p>
          </div>
        )}

        {gen.status === "completed" && gen.finalImageUrl && (
          <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-black/40 p-3 opacity-0 transition group-hover:opacity-100">
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onEdit}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-violet-600 shadow-lg backdrop-blur hover:bg-white"
                aria-label="AI edit"
                title="AI edit"
              >
                <SparkleEditIcon />
              </button>
            </div>
            <div className="flex items-end justify-between gap-2">
              <p className="text-[10px] text-white/90">{formatDate(gen.createdAt)}</p>
              <a
                href={gen.finalImageUrl}
                download
                className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-lg hover:bg-gray-100"
              >
                Download
              </a>
            </div>
          </div>
        )}

        {gen.status === "completed" && gen.finalImageUrl && (
          <button
            type="button"
            onClick={onEdit}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white shadow-md sm:hidden"
            aria-label="AI edit"
          >
            <SparkleEditIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function SparkleEditIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 4l1.2 3.6L20 9l-3.8 1.4L15 14l-1.2-3.6L10 9l3.8-1.4L15 4zM5 14l.8 2.4L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.6L5 14z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
