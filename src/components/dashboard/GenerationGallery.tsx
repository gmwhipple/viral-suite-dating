"use client";

import { useState } from "react";
import type { GenerationJob } from "@/lib/firebase/types";
import { formatDate } from "@/lib/utils";

interface GenerationGalleryProps {
  generations: GenerationJob[];
  token: string;
  onEditComplete: () => void;
}

export function GenerationGallery({ generations, token, onEditComplete }: GenerationGalleryProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const completed = generations.filter((g) => g.status === "completed" && g.finalImageUrl);
  const pending = generations.filter((g) => g.status !== "completed" && g.status !== "failed");

  const submitEdit = async (gen: GenerationJob) => {
    if (!prompt.trim() || !gen.finalImageUrl) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("sourceImageUrl", gen.finalImageUrl);
      if (attachment) formData.append("attachment", attachment);

      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Edit failed");
      }

      setEditingId(null);
      setPrompt("");
      setAttachment(null);
      onEditComplete();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Edit failed");
    } finally {
      setLoading(false);
    }
  };

  if (generations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
        <p className="text-gray-500">No generated photos yet. Pick a style reference above to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-semibold text-amber-800">
            {pending.length} photo{pending.length === 1 ? "" : "s"} processing
          </p>
          <ul className="mt-3 space-y-3">
            {pending.map((g) => (
              <li key={g.id} className="flex items-center gap-3">
                {g.imageReferenceUrl ? (
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-amber-200 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={g.imageReferenceUrl}
                      alt="Selected style reference"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-white text-xs text-amber-700">
                    Ref
                  </div>
                )}
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Using selected style reference</p>
                  <StatusBadge status={g.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {completed.map((gen) => (
          <div key={gen.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="aspect-[3/4] bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gen.finalImageUrl!} alt="Generated photo" className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500">{formatDate(gen.createdAt)}</p>
              <div className="mt-3 flex gap-2">
                <a
                  href={gen.finalImageUrl!}
                  download
                  className="flex-1 rounded-lg bg-gray-900 py-2 text-center text-sm font-medium text-white hover:bg-gray-800"
                >
                  Download
                </a>
                <button
                  onClick={() => setEditingId(editingId === gen.id ? null : gen.id)}
                  className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  AI Edit
                </button>
              </div>

              {editingId === gen.id && (
                <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder='e.g. "Change my shirt to match the attached image" or "Remove the person in the background"'
                    className="w-full rounded-lg border border-gray-200 p-3 text-sm"
                    rows={3}
                  />
                  <label className="block text-sm text-gray-600">
                    Attach reference image (optional, for outfit swaps)
                    <input
                      type="file"
                      accept="image/*"
                      className="mt-1 block w-full text-sm"
                      onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                    />
                  </label>
                  <button
                    onClick={() => submitEdit(gen)}
                    disabled={loading || !prompt.trim()}
                    className="w-full rounded-lg bg-violet-600 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {loading ? "Editing..." : "Apply AI Edit"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    queued: "text-gray-600",
    processing: "text-blue-600",
    watermark_removal: "text-purple-600",
    failed: "text-red-600",
  };
  return <span className={colors[status] || "text-gray-600"}>{status.replace(/_/g, " ")}</span>;
}
