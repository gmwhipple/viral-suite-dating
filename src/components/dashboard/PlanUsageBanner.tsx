"use client";

import { MAX_GENERATIONS_PER_USER, TESTING_BYPASS_PAYMENT } from "@/lib/constants";

interface PlanUsageBannerProps {
  generationsUsed: number;
  generationsRemaining: number;
  maxGenerations: number;
  plan: "free" | "paid" | "expired";
  checkoutPriceLabel?: string;
  checkoutBlocked?: boolean;
  onCheckout?: () => Promise<void>;
  checkingOut?: boolean;
}

export function PlanUsageBanner({
  generationsUsed,
  generationsRemaining,
  maxGenerations,
  plan,
  checkoutPriceLabel = "$199",
  checkoutBlocked = false,
  onCheckout,
  checkingOut,
}: PlanUsageBannerProps) {
  const hasAccess = TESTING_BYPASS_PAYMENT || plan === "paid";
  const limit = TESTING_BYPASS_PAYMENT ? MAX_GENERATIONS_PER_USER : maxGenerations;
  const used = generationsUsed;
  const remaining = generationsRemaining;
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <div className="rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 via-white to-orange-50 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
            Photo generations
          </p>
          <p className="mt-1 text-3xl font-extrabold text-gray-900">
            {hasAccess ? remaining : 0}
            <span className="ml-2 text-lg font-semibold text-gray-600">
              of {limit} left
            </span>
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {hasAccess
              ? `${used} used · ${remaining} remaining`
              : "Unlock your plan to start generating photos"}
          </p>
        </div>

        {!hasAccess && onCheckout && (
          <button
            onClick={onCheckout}
            disabled={checkingOut || checkoutBlocked}
            className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {checkoutBlocked
              ? "Not available in your region"
              : checkingOut
                ? "Loading..."
                : `Unlock — ${checkoutPriceLabel}`}
          </button>
        )}
      </div>

      {hasAccess && (
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-rose-100">
            <div
              className="h-full rounded-full bg-rose-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
