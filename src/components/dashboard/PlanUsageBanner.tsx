"use client";

import { MAX_EDITS_PER_USER, MAX_GENERATIONS_PER_USER, TESTING_BYPASS_PAYMENT } from "@/lib/constants";

interface PlanUsageBannerProps {
  generationsUsed: number;
  generationsRemaining: number;
  maxGenerations: number;
  editsUsed: number;
  editsRemaining: number;
  maxEdits: number;
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
  editsUsed,
  editsRemaining,
  maxEdits,
  plan,
  checkoutPriceLabel = "$199",
  checkoutBlocked = false,
  onCheckout,
  checkingOut,
}: PlanUsageBannerProps) {
  const hasAccess = TESTING_BYPASS_PAYMENT || plan === "paid";
  const genLimit = TESTING_BYPASS_PAYMENT ? MAX_GENERATIONS_PER_USER : maxGenerations;
  const editLimit = TESTING_BYPASS_PAYMENT ? MAX_EDITS_PER_USER : Math.min(maxEdits || MAX_EDITS_PER_USER, MAX_EDITS_PER_USER);
  const genPct = genLimit > 0 ? Math.min(100, Math.round((generationsUsed / genLimit) * 100)) : 0;
  const editPct = editLimit > 0 ? Math.min(100, Math.round((editsUsed / editLimit) * 100)) : 0;
  const displayEditsRemaining = hasAccess ? editsRemaining : 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="grid flex-1 gap-4 sm:grid-cols-2">
          <UsageCard
            title="Photo generations"
            remaining={hasAccess ? generationsRemaining : 0}
            total={genLimit}
            used={generationsUsed}
            pct={genPct}
            locked={!hasAccess}
          />
          <UsageCard
            title="AI edits"
            remaining={hasAccess ? Math.max(0, displayEditsRemaining) : 0}
            total={editLimit}
            used={editsUsed}
            pct={editPct}
            locked={!hasAccess}
          />
        </div>

        {!hasAccess && onCheckout && (
          <button
            onClick={onCheckout}
            disabled={checkingOut || checkoutBlocked}
            className="shrink-0 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {checkoutBlocked
              ? "Not available in your region"
              : checkingOut
                ? "Loading..."
                : `Unlock — ${checkoutPriceLabel}`}
          </button>
        )}
      </div>

      {!hasAccess && (
        <p className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-500">
          Purchase a plan to start generating photos and applying edits.
        </p>
      )}
    </div>
  );
}

function UsageCard({
  title,
  remaining,
  total,
  used,
  pct,
  locked,
}: {
  title: string;
  remaining: number;
  total: number;
  used: number;
  pct: number;
  locked: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3.5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-gray-700">{title}</p>
        {!locked && (
          <p className="text-xs text-gray-500">
            {used} used
          </p>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
        {locked ? "—" : remaining}
        <span className="ml-1.5 text-sm font-normal text-gray-500">of {total}</span>
      </p>
      {locked ? (
        <p className="mt-1 text-xs text-gray-500">Locked until purchase</p>
      ) : (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gray-900 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}
