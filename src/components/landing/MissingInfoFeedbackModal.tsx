"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import {
  getOrCreateVisitorFingerprint,
  hasSeenFeedbackPromptLocally,
  markFeedbackPromptSeenLocally,
} from "@/lib/visitor-id";
import { cn } from "@/lib/utils";

const PROMPT_DELAY_MS = 2 * 60 * 1000;

const CTA_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-rose-600 disabled:opacity-60";

interface MissingInfoFeedbackModalProps {
  t: Dictionary;
  locale: string;
}

export function MissingInfoFeedbackModal({ t, locale }: MissingInfoFeedbackModalProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeAndMarkSeen = useCallback(async (action: "submit" | "dismiss") => {
    markFeedbackPromptSeenLocally();

    const fingerprint = getOrCreateVisitorFingerprint();
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          message: action === "submit" ? message : "",
          fingerprint,
          locale,
          pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });
    } catch {
      // User already closed — best-effort sync
    }

    setOpen(false);
  }, [locale, message]);

  const handleClose = useCallback(() => {
    void closeAndMarkSeen("dismiss");
  }, [closeAndMarkSeen]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await closeAndMarkSeen("submit");
    } finally {
      setSubmitting(false);
    }
  }, [closeAndMarkSeen, submitting]);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    if (hasSeenFeedbackPromptLocally()) return;

    const fingerprint = getOrCreateVisitorFingerprint();

    timerRef.current = setTimeout(() => {
      void (async () => {
        if (hasSeenFeedbackPromptLocally()) return;

        try {
          const params = new URLSearchParams({ fingerprint });
          const res = await fetch(`/api/feedback?${params.toString()}`);
          if (!res.ok) return;
          const data = (await res.json()) as { eligible?: boolean };
          if (data.eligible) setOpen(true);
        } catch {
          // Skip popup if eligibility check fails
        }
      })();
    }, PROMPT_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="missing-info-feedback-title"
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label={t.feedbackPrompt.closeLabel}
          className="absolute right-4 top-4 rounded-full p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <h2
          id="missing-info-feedback-title"
          className="pr-10 font-display text-lg font-semibold leading-snug text-white"
        >
          {t.feedbackPrompt.question}
        </h2>

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={t.feedbackPrompt.placeholder}
          rows={4}
          className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-rose-500/40 focus:outline-none focus:ring-1 focus:ring-rose-500/30"
        />

        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={submitting}
          className={cn(CTA_PRIMARY, "mt-5 w-full")}
        >
          {submitting ? "..." : t.feedbackPrompt.submit}
        </button>
      </div>
    </div>,
    document.body
  );
}
