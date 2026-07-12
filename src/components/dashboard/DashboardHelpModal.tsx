"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Download,
  HelpCircle,
  ImageIcon,
  Pencil,
  Smile,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SMILE_OPTIONS } from "@/lib/constants";

interface DashboardHelpModalProps {
  open: boolean;
  onClose: () => void;
}

const SLIDES = [
  {
    id: "training",
    kicker: "Step 1",
    title: "Upload as many photos as you can",
    icon: Upload,
    accent: "bg-rose-100 text-rose-700",
  },
  {
    id: "generate",
    kicker: "Step 2",
    title: "Generate your dating photos",
    icon: Sparkles,
    accent: "bg-violet-100 text-violet-700",
  },
  {
    id: "edit",
    kicker: "Step 3",
    title: "Fine-tune every photo",
    icon: Pencil,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    id: "validate",
    kicker: "Step 4",
    title: "Get unbiased feedback",
    icon: Camera,
    accent: "bg-emerald-100 text-emerald-700",
  },
] as const;

export function DashboardHelpModal({ open, onClose }: DashboardHelpModalProps) {
  const [slide, setSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setSlide(0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const current = SLIDES[slide];
  const isFirst = slide === 0;
  const isLast = slide === SLIDES.length - 1;
  const Icon = current.icon;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashboard-help-title"
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", current.accent)}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                {current.kicker} · Getting started
              </p>
              <h2 id="dashboard-help-title" className="text-lg font-bold text-gray-900">
                {current.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close help guide"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {slide === 0 && <TrainingSlide />}
          {slide === 1 && <GenerateSlide />}
          {slide === 2 && <EditSlide />}
          {slide === 3 && <ValidateSlide />}
        </div>

        <div className="border-t border-gray-100 px-6 py-4">
          <div className="mb-4 flex items-center justify-center gap-2">
            {SLIDES.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSlide(index)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  index === slide ? "w-6 bg-rose-500" : "w-2 bg-gray-200 hover:bg-gray-300"
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === slide ? "step" : undefined}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-gray-500 transition hover:text-gray-800"
            >
              Skip for now
            </button>

            <div className="flex items-center gap-2">
              {!isFirst && (
                <button
                  type="button"
                  onClick={() => setSlide((value) => value - 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
              )}
              {isLast ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  Got it
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSlide((value) => value + 1)}
                  className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function TrainingSlide() {
  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-gray-600">
        Your AI character is only as good as the photos you upload. The more high-quality training
        photos you provide, the more accurately the AI learns your face, hair, and body — and the
        better your generated dating photos will look.
      </p>

      <ul className="space-y-3 text-sm text-gray-700">
        <HelpBullet
          title="Upload as many photos as possible"
          body="More photos means better likeness. Aim for variety: close-ups, medium shots, and full-body angles from different days and lighting."
        />
        <HelpBullet
          title="Use your best hair and facial hair"
          body="Pick the hairstyle and facial hair you actually want to show on your profile — and keep it consistent across uploads. The AI will reproduce whatever hair look appears most often in your training set."
        />
        <HelpBullet
          title="Include full-body shots"
          body="Headshots alone are not enough. Full-body photos help the AI understand your proportions so generated images look natural, not cropped or distorted."
        />
        <HelpBullet
          title="Bathing suit or swim photos are fine"
          body="If you plan to show off beach, pool, or fitness vibes on dating apps, upload bathing suit or swimwear photos now so the AI can accurately represent that look."
        />
      </ul>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-sm font-semibold text-amber-900">Why photo count matters</p>
        <p className="mt-1 text-sm leading-relaxed text-amber-800">
          Too few training photos is the #1 cause of unnatural results — including glossy, plastic-looking
          skin in some generations. Upload generously before you start training to avoid this.
        </p>
      </div>
    </div>
  );
}

function GenerateSlide() {
  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-gray-600">
        Once your character is trained, you can create new dating photos in two ways — write your own
        detailed scene or tap one of our optimized reference photos that are already proven to perform
        well on dating apps.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Pencil className="h-4 w-4 text-violet-600" />
            Custom prompts
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Describe exactly what you want — outfit, location, vibe, time of day. Be specific:{" "}
            <span className="italic text-gray-500">
              &quot;candid coffee shop photo, navy sweater, warm window light&quot;
            </span>
            .
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <ImageIcon className="h-4 w-4 text-violet-600" />
            Reference photos
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Browse our library of pre-tested reference images — poses, settings, and compositions
            that already do well on Tinder, Hinge, Bumble, and similar apps.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 p-4">
        <p className="text-sm font-semibold text-gray-900">Keep generating until it clicks</p>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Not every generation will nail the perfect angle or expression on the first try — that is
          normal. Each run explores slightly different framing and lighting. Keep going until you get
          shots that feel like your best self.
        </p>
      </div>
    </div>
  );
}

function EditSlide() {
  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-gray-600">
        Every finished photo in your gallery has action buttons underneath. Use them to polish results
        without starting over from scratch.
      </p>

      <PhotoActionsMockup />

      <ul className="space-y-3 text-sm text-gray-700">
        <HelpBullet
          title="Smile"
          body={`Adjust your expression with one tap. Choose from ${SMILE_OPTIONS.map((option) => option.label).join(", ")} — great when the pose is right but the face needs a small tweak.`}
        />
        <HelpBullet
          title="Edit"
          body='Open the edit panel to describe changes in plain English — e.g. "change my shirt to blue" or "remove the person in the background." You can also toggle Re-texture skin to fix glossy or overly smooth skin.'
        />
        <HelpBullet
          title="Reference attachments"
          body="Inside Edit, you can attach a reference photo from your uploads or upload a new file to guide specific changes."
        />
        <HelpBullet
          title="Save"
          body="Download your favorite finished photos to your device, then upload the winners to your dating profiles."
        />
      </ul>
    </div>
  );
}

function ValidateSlide() {
  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-gray-600">
        Before you commit photos to your dating apps, get an honest second opinion from the audience
        you are actually trying to attract.
      </p>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-sm font-semibold text-emerald-900">Test on PhotoFeeler</p>
        <p className="mt-2 text-sm leading-relaxed text-emerald-800">
          Upload your best-looking generated photos — the ones where you look like your most attractive,
          authentic self — to{" "}
          <a
            href="https://www.photofeeler.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2"
          >
            photofeeler.com
          </a>
          . Real people rate your photos so you get unbiased feedback from your target demographic
          before you put them live on Tinder, Hinge, or Bumble.
        </p>
      </div>

      <ul className="space-y-3 text-sm text-gray-700">
        <HelpBullet
          title="Pick your strongest 3–5 photos"
          body="Choose shots with great angles, natural skin texture, and expressions that feel confident — not forced."
        />
        <HelpBullet
          title="Let the data decide"
          body="Your friends may be kind; strangers voting on PhotoFeeler tell you what actually stops the scroll for your target audience."
        />
        <HelpBullet
          title="Iterate and improve"
          body="Use low-scoring feedback as a signal to regenerate or edit. High scorers go straight to your profile."
        />
      </ul>
    </div>
  );
}

function HelpBullet({ title, body }: { title: string; body: string }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="mt-0.5 leading-relaxed text-gray-600">{body}</p>
      </div>
    </li>
  );
}

function PhotoActionsMockup() {
  return (
    <div className="mx-auto max-w-xs overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="grid grid-cols-3 border-gray-100">
        <div className="flex flex-col items-center gap-1 border-r border-gray-100 py-3 text-gray-600">
          <Smile className="h-4 w-4" />
          <span className="text-[10px] font-medium">Smile</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-r border-gray-100 py-3 text-gray-600">
          <Pencil className="h-4 w-4" />
          <span className="text-[10px] font-medium">Edit</span>
        </div>
        <div className="flex flex-col items-center gap-1 py-3 text-gray-600">
          <Download className="h-4 w-4" />
          <span className="text-[10px] font-medium">Save</span>
        </div>
      </div>
      <p className="border-t border-gray-100 px-3 py-2 text-center text-[11px] text-gray-500">
        These buttons appear under every completed photo in your gallery
      </p>
    </div>
  );
}

export function DashboardHelpButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
      aria-label="Open help guide"
    >
      <HelpCircle className="h-4 w-4" />
      <span className="hidden sm:inline">Help</span>
    </button>
  );
}
