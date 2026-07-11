"use client";

import { MAX_EDITS_PER_USER, MAX_GENERATIONS_PER_USER, SUPPORT_EMAIL } from "@/lib/constants";

export type CreditsLimitType = "generations" | "edits";

interface CreditsLimitModalProps {
  open: boolean;
  onClose: () => void;
  type: CreditsLimitType;
}

export function CreditsLimitModal({ open, onClose, type }: CreditsLimitModalProps) {
  if (!open) return null;

  const limit = type === "generations" ? MAX_GENERATIONS_PER_USER : MAX_EDITS_PER_USER;
  const label = type === "generations" ? "photo generations" : "AI edits";

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="credits-limit-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h3 id="credits-limit-title" className="text-lg font-bold text-gray-900">
          {type === "generations" ? "Generation limit reached" : "Edit limit reached"}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          You&apos;ve used all {limit} {label} included with your plan.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Purchasing additional credits isn&apos;t configured yet. Email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-rose-600 hover:text-rose-700">
            {SUPPORT_EMAIL}
          </a>{" "}
          to ask for this feature.
        </p>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
