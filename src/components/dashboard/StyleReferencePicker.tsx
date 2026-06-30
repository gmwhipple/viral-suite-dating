"use client";

import { useState } from "react";
import type { StyleReference } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";

interface StyleReferencePickerProps {
  references: StyleReference[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onGenerate: (referenceId: string) => Promise<void>;
  generationsRemaining: number;
  disabled?: boolean;
}

export function StyleReferencePicker({
  references,
  selectedId,
  onSelect,
  onGenerate,
  generationsRemaining,
  disabled,
}: StyleReferencePickerProps) {
  const [category, setCategory] = useState<string>("All");
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState("");

  const categories = ["All", ...Array.from(new Set(references.map((r) => r.category)))];

  const filtered = references.filter((r) => {
    const matchCat = category === "All" || r.category === category;
    const matchSearch =
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleGenerate = async () => {
    if (!selectedId || generating) return;
    setGenerating(true);
    try {
      await onGenerate(selectedId);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Choose a style reference</h2>
          <p className="text-sm text-gray-600">
            Pick from 100 curated dating photo styles · {generationsRemaining} generations left
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={!selectedId || disabled || generating || generationsRemaining <= 0}
          className="rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50 hover:bg-rose-700"
        >
          {generating ? "Generating..." : "Generate photo"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          type="search"
          placeholder="Search styles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition",
              category === cat ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-4 grid max-h-96 grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4 md:grid-cols-5">
        {filtered.map((ref) => (
          <button
            key={ref.id}
            onClick={() => onSelect(ref.id)}
            className={cn(
              "overflow-hidden rounded-xl border-2 text-left transition",
              selectedId === ref.id ? "border-rose-500 ring-2 ring-rose-200" : "border-transparent hover:border-gray-200"
            )}
          >
            <div className="aspect-[4/5] bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ref.thumbnailUrl} alt={ref.name} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="p-2">
              <p className="truncate text-xs font-semibold text-gray-900">{ref.name}</p>
              <p className="truncate text-xs text-gray-500">{ref.category}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
