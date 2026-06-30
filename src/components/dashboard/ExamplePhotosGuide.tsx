"use client";

import { EXAMPLE_GOOD_PHOTOS, EXAMPLE_BAD_PHOTOS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ExamplePhotosGuide() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">Photo upload guide</h2>
      <p className="mt-1 text-sm text-gray-600">
        Upload up to 100 photos. Mix of angles, lighting, and outfits works best. Minimum 10 required to start training.
      </p>

      <div className="mt-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-green-700">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs">✓</span>
          Good examples — upload photos like these
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {EXAMPLE_GOOD_PHOTOS.map((photo) => (
            <ExampleCard key={photo.id} photo={photo} good />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-red-700">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs">✗</span>
          Avoid these — don&apos;t upload photos like these
        </h3>
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
    <div className={cn("overflow-hidden rounded-xl border-2", good ? "border-green-200" : "border-red-200")}>
      <div className="relative aspect-[4/5] bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.imageUrl} alt={photo.title} className="h-full w-full object-cover" />
        <span
          className={cn(
            "absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white",
            good ? "bg-green-500" : "bg-red-500"
          )}
        >
          {good ? "✓" : "✗"}
        </span>
      </div>
      <div className="p-2">
        <p className="text-xs font-semibold text-gray-900">{photo.title}</p>
        <p className="text-xs text-gray-500">{photo.description}</p>
      </div>
    </div>
  );
}
