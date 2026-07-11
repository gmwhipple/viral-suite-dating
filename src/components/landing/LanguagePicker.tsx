"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { LOCALE_OPTIONS } from "@/lib/i18n/locale-labels";
import { cn } from "@/lib/utils";

interface LanguagePickerProps {
  locale: string;
  onLocaleChange: (locale: string) => void;
  className?: string;
}

export function LanguagePicker({ locale, onLocaleChange, className }: LanguagePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const active =
    LOCALE_OPTIONS.find((option) => option.value === locale) ?? LOCALE_OPTIONS[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${active.label}`}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-400 transition hover:border-white/30 hover:text-white"
      >
        <Globe className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
        <span className="hidden sm:inline max-w-[7rem] truncate normal-case tracking-normal">
          {active.label}
        </span>
        <span className="sm:hidden">{active.value.toUpperCase()}</span>
        <ChevronDown
          className={cn("h-3 w-3 shrink-0 transition-transform", open && "rotate-180")}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[60] w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/95 shadow-2xl backdrop-blur-2xl sm:w-56"
        >
          <ul className="max-h-64 overflow-y-auto py-1.5">
            {LOCALE_OPTIONS.map((option) => {
              const selected = option.value === locale;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onLocaleChange(option.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm transition",
                      selected
                        ? "bg-white/10 text-white"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {selected && <Check className="h-4 w-4 shrink-0 text-rose-500" strokeWidth={2} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
