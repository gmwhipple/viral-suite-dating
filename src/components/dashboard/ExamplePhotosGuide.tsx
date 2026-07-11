"use client";

import { EXAMPLE_GOOD_PHOTOS, EXAMPLE_BAD_PHOTOS, MIN_SOUL_TRAINING_PHOTOS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

export function ExamplePhotosGuide({ embedded = false }: { embedded?: boolean }) {
  return (
    <div className={embedded ? "border-b border-gray-100 px-6 py-6" : "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"}>
      <h3 className="text-base font-semibold text-gray-900">Photo upload guide</h3>
      <p className="mt-1 text-sm text-gray-500">
        Mix angles, lighting, and outfits. Minimum {MIN_SOUL_TRAINING_PHOTOS} photos to start training.
      </p>

      <div className="mt-6">
        <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
          <Check className="h-4 w-4" />
          Good examples
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {EXAMPLE_GOOD_PHOTOS.map((photo) => (
            <ExampleCard key={photo.id} photo={photo} good />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <p className="flex items-center gap-2 text-sm font-medium text-red-700">
          <X className="h-4 w-4" />
          Avoid these
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {EXAMPLE_BAD_PHOTOS.map((photo) => (
            <ExampleCard key={photo.id} photo={photo} good={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ExampleCard({
  photo,
  good,
}: {
  photo: { id: string; title: string; description: string; imageUrl: string };
  good: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="relative aspect-[4/5] bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.imageUrl} alt={photo.title} className="h-full w-full object-cover" />
        <span
          className={cn(
            "absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-sm",
            good ? "bg-emerald-600" : "bg-red-500"
          )}
        >
          {good ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
        </span>
      </div>
      <div className="px-2.5 py-2">
        <p className="text-xs font-medium text-gray-900">{photo.title}</p>
        <p className="mt-0.5 text-[11px] leading-snug text-gray-500">{photo.description}</p>
      </div>
    </div>
  );
}
