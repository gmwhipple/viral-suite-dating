"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ClientGeneration } from "@/lib/client-sanitize";
import type { UserPhoto } from "@/lib/firebase/types";
import { SMILE_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { UserPhotoPicker } from "@/components/dashboard/UserPhotoPicker";
import { CreditsLimitModal } from "@/components/dashboard/CreditsLimitModal";
import { Download, Loader2, Pencil, Smile, X, ImagePlus } from "lucide-react";

interface GenerationGalleryProps {
  generations: ClientGeneration[];
  photos: UserPhoto[];
  token: string;
  refreshToken?: () => Promise<string | null>;
  editsRemaining: number;
  onEditComplete: () => void;
}

export function GenerationGallery({
  generations,
  photos,
  token,
  refreshToken,
  editsRemaining,
  onEditComplete,
}: GenerationGalleryProps) {
  const [previewGen, setPreviewGen] = useState<ClientGeneration | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [smileLoadingId, setSmileLoadingId] = useState<string | null>(null);
  const [smileError, setSmileError] = useState<string | null>(null);
  const [smilePopoverId, setSmilePopoverId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPhoto, setAttachmentPhoto] = useState<UserPhoto | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [textEditError, setTextEditError] = useState<string | null>(null);
  const [pendingEdits, setPendingEdits] = useState<ClientGeneration[]>([]);
  const [editError, setEditError] = useState<string | null>(null);
  const [retextureSkin, setRetextureSkin] = useState(false);
  const [creditsLimitOpen, setCreditsLimitOpen] = useState(false);
  const tokenRef = useRef(token);
  tokenRef.current = token;

  const authorizedFetch = async (
    path: string,
    init: RequestInit
  ): Promise<{ res: Response; json: Record<string, unknown> }> => {
    let authToken = tokenRef.current;
    const run = async (bearer: string) => {
      const headers = new Headers(init.headers);
      headers.set("Authorization", `Bearer ${bearer}`);
      const res = await fetch(path, { ...init, headers });
      const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      return { res, json };
    };

    let result = await run(authToken);
    if (result.res.status === 401 && refreshToken) {
      const fresh = await refreshToken();
      if (fresh) {
        tokenRef.current = fresh;
        result = await run(fresh);
      }
    }
    return result;
  };

  const sorted = [...pendingEdits, ...generations].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
  const editsDisabled = editsRemaining <= 0;

  const guardEdits = (): boolean => {
    if (editsDisabled) {
      setCreditsLimitOpen(true);
      return false;
    }
    return true;
  };

  const getDisplayUrl = (gen: ClientGeneration) =>
    gen.finalImageUrl || gen.imageReferenceUrl || "";

  const imageUrlToBase64 = async (url: string): Promise<string> => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Could not load image for smile edit (${res.status})`);
    }
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        if (typeof dataUrl !== "string" || !dataUrl.includes(",")) {
          reject(new Error("Could not encode image for smile edit"));
          return;
        }
        resolve(dataUrl.split(",")[1] || "");
      };
      reader.onerror = () => reject(new Error("Could not read image for smile edit"));
      reader.readAsDataURL(blob);
    });
  };

  const openEdit = (gen: ClientGeneration) => {
    if (!guardEdits()) return;
    if (gen.status !== "completed" || !getDisplayUrl(gen)) return;
    setPreviewGen(gen);
    setPreviewUrl(getDisplayUrl(gen));
    setPrompt("");
    setRetextureSkin(false);
    setAttachment(null);
    setAttachmentPhoto(null);
    setSmilePopoverId(null);
    setSmileError(null);
    setEditError(null);
  };

  const applySmile = async (gen: ClientGeneration, serviceChoice: number) => {
    if (!guardEdits()) return;
    setSmileLoadingId(gen.id);
    setSmilePopoverId(null);
    setSmileError(null);
    try {
      const displayUrl = getDisplayUrl(gen);
      const imageBase64 = await imageUrlToBase64(displayUrl);
      console.log("[GenerationGallery] smile payload bytes", imageBase64.length);

      const { res, json } = await authorizedFetch("/api/photos/smile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          serviceChoice,
          generationId: gen.id,
          storageKey: gen.storageKey,
        }),
      });
      if (!res.ok) {
        const errMsg = (json.error as string) || "Smile edit failed";
        throw new Error(
          res.status === 401 ? "Session expired — refresh the page and try again." : errMsg
        );
      }

      await onEditComplete();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Smile edit failed";
      setSmileError(message);
      console.log("[GenerationGallery] smile error", message);
    } finally {
      setSmileLoadingId(null);
    }
  };

  const fileToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        if (typeof dataUrl !== "string" || !dataUrl.includes(",")) {
          reject(new Error("Could not read attachment file"));
          return;
        }
        resolve(dataUrl.split(",")[1] || "");
      };
      reader.onerror = () => reject(new Error("Could not read attachment file"));
      reader.readAsDataURL(file);
    });
  };

  const submitTextEdit = () => {
    if (!guardEdits()) return;
    const userPrompt = prompt.trim();
    const canSubmit = Boolean(userPrompt || retextureSkin);
    if (!previewGen || !canSubmit || !previewUrl) return;

    const sourceGen = previewGen;
    const sourceUrl = previewUrl;
    const capturedRetexture = retextureSkin;
    const capturedAttachment = attachment;
    const capturedAttachmentPhoto = attachmentPhoto;
    const pendingId = `pending-edit-${Date.now()}`;

    setPendingEdits((prev) => [
      {
        id: pendingId,
        userId: sourceGen.userId,
        characterId: sourceGen.characterId,
        referenceId: "edit",
        referenceName: `${sourceGen.referenceName} · Edit`,
        prompt: userPrompt || (capturedRetexture ? "Re-texture skin" : "Edit"),
        imageReferenceUrl: sourceUrl,
        sourceGenerationId: sourceGen.id,
        status: "processing",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    setPreviewGen(null);
    setPreviewUrl(null);
    setPrompt("");
    setRetextureSkin(false);
    setAttachment(null);
    setAttachmentPhoto(null);
    setEditError(null);
    setTextEditError(null);

    void (async () => {
      try {
        const sourceImageBase64 = await imageUrlToBase64(sourceUrl);
        let attachmentBase64: string | undefined;
        if (capturedAttachment) {
          attachmentBase64 = await fileToBase64(capturedAttachment);
        } else if (capturedAttachmentPhoto?.publicUrl) {
          attachmentBase64 = await imageUrlToBase64(capturedAttachmentPhoto.publicUrl);
        }

        const { res, json } = await authorizedFetch("/api/photos/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: userPrompt,
            retextureSkin: capturedRetexture,
            sourceImageBase64,
            generationId: sourceGen.id,
            storageKey: sourceGen.storageKey,
            attachmentBase64,
          }),
        });

        if (!res.ok) {
          const errMsg = (json.error as string) || "Edit failed";
          throw new Error(
            res.status === 401 ? "Session expired — refresh the page and try again." : errMsg
          );
        }

        setPendingEdits((prev) => prev.filter((item) => item.id !== pendingId));
        await onEditComplete();
      } catch (err) {
        setPendingEdits((prev) => prev.filter((item) => item.id !== pendingId));
        const message = err instanceof Error ? err.message : "AI editing is not available yet.";
        setTextEditError(message);
        console.log("[GenerationGallery] edit error", message);
      }
    })();
  };

  if (generations.length === 0 && pendingEdits.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
        <p className="text-gray-500">No generated photos yet. Pick a style reference above to get started.</p>
      </div>
    );
  }

  return (
    <>
      <CreditsLimitModal
        open={creditsLimitOpen}
        onClose={() => setCreditsLimitOpen(false)}
        type="edits"
      />

      {textEditError && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Edit failed: {textEditError}
          <button
            type="button"
            className="ml-2 text-xs underline"
            onClick={() => setTextEditError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {smileError && (
        <div className="mt-3 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700">
          Smile edit failed: {smileError}
          <button
            type="button"
            className="ml-2 text-xs underline"
            onClick={() => setSmileError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 overflow-visible sm:grid-cols-3 lg:grid-cols-4">
        {sorted.map((gen) => (
          <GenerationTile
            key={gen.id}
            gen={gen}
            displayUrl={getDisplayUrl(gen)}
            editsDisabled={editsDisabled}
            smileLoading={smileLoadingId === gen.id}
            smileOpen={smilePopoverId === gen.id}
            onToggleSmile={() => {
              if (!guardEdits()) return;
              setSmileError(null);
              setSmilePopoverId((current) => (current === gen.id ? null : gen.id));
            }}
            onCloseSmile={() => setSmilePopoverId(null)}
            onEdit={() => openEdit(gen)}
            onApplySmile={(choice) => applySmile(gen, choice)}
          />
        ))}
      </div>

      {previewGen && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Edit photo</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {editsDisabled ? (
                    <>
                      You have used all AI edits on your plan.{" "}
                      <button
                        type="button"
                        className="font-medium text-rose-600 underline hover:text-rose-700"
                        onClick={() => setCreditsLimitOpen(true)}
                      >
                        Get more credits
                      </button>
                    </>
                  ) : (
                    `${editsRemaining} edits remaining`
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPreviewGen(null);
                  setPreviewUrl(null);
                }}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Generated photo preview" className="aspect-[3/4] w-full object-cover" />
            </div>

            <div className="mt-3">
              <label
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  retextureSkin
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100",
                  editsDisabled && "cursor-not-allowed opacity-50"
                )}
              >
                <input
                  type="checkbox"
                  checked={retextureSkin}
                  disabled={editsDisabled}
                  onChange={(e) => setRetextureSkin(e.target.checked)}
                  className="sr-only"
                />
                Re-texture skin
              </label>
            </div>

            <div className="mt-5">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='e.g. "Change my shirt to blue"'
                disabled={editsDisabled}
                className="w-full rounded-lg border border-gray-200 p-3 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 disabled:bg-gray-50"
                rows={3}
              />

              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium text-gray-700">Reference photo (optional)</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={editsDisabled}
                    onClick={() => setPickerOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ImagePlus className="h-4 w-4" />
                    Pick from uploads
                  </button>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Upload file
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={editsDisabled}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setAttachment(file);
                        if (file) setAttachmentPhoto(null);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>

                {attachmentPhoto && (
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-2">
                    <div className="h-14 w-11 overflow-hidden rounded bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={attachmentPhoto.publicUrl}
                        alt={attachmentPhoto.fileName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-gray-900">From your uploads</p>
                      <p className="truncate text-xs text-gray-500">{attachmentPhoto.fileName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachmentPhoto(null)}
                      className="rounded p-1 text-gray-500 hover:bg-gray-100"
                      aria-label="Remove reference photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {attachment && !attachmentPhoto && (
                  <p className="text-xs text-gray-500">Attached file: {attachment.name}</p>
                )}
              </div>

              <button
                type="button"
                onClick={submitTextEdit}
                disabled={!prompt.trim() && !retextureSkin}
                className="mt-4 w-full rounded-lg border border-gray-900 bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
              >
                Apply edit
              </button>

              {editError && (
                <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {editError}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <UserPhotoPicker
        photos={photos}
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(photo) => {
          setAttachmentPhoto(photo);
          setAttachment(null);
        }}
        selectedPhotoId={attachmentPhoto?.id}
      />
    </>
  );
}

function SmilePopover({
  open,
  anchorRef,
  onClose,
  onSelect,
  loading,
}: {
  open: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onSelect: (serviceChoice: number) => void;
  loading: boolean;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !anchorRef.current) return;

    const updatePosition = () => {
      const rect = anchorRef.current!.getBoundingClientRect();
      setPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (anchorRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose, anchorRef]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={popoverRef}
      className="fixed z-[9999] w-44 -translate-x-1/2 -translate-y-full rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
      style={{ top: position.top, left: position.left }}
    >
      <p className="mb-2 px-1 text-[10px] font-medium uppercase tracking-wide text-gray-400">
        Choose style
      </p>
      <div className="space-y-1">
        {SMILE_OPTIONS.map((option) => (
          <button
            key={option.serviceChoice}
            type="button"
            disabled={loading}
            onClick={() => onSelect(option.serviceChoice)}
            className="w-full rounded-md px-2 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}

function GenerationTile({
  gen,
  displayUrl,
  editsDisabled,
  smileLoading,
  smileOpen,
  onToggleSmile,
  onCloseSmile,
  onEdit,
  onApplySmile,
}: {
  gen: ClientGeneration;
  displayUrl: string;
  editsDisabled: boolean;
  smileLoading: boolean;
  smileOpen: boolean;
  onToggleSmile: () => void;
  onCloseSmile: () => void;
  onEdit: () => void;
  onApplySmile: (serviceChoice: number) => void;
}) {
  const smileButtonRef = useRef<HTMLButtonElement>(null);
  const isPending = gen.status !== "completed" && gen.status !== "failed";
  const isFailed = gen.status === "failed";
  const isCompleted = gen.status === "completed" && Boolean(displayUrl);

  return (
    <div
      className={cn(
        "overflow-visible rounded-xl border bg-white",
        isFailed && "border-red-200",
        isPending && "border-gray-200",
        isCompleted && "border-gray-200"
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl bg-gray-100">
        {displayUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={displayUrl}
            alt="Generated photo"
            className={cn(
              "h-full w-full object-cover",
              isPending && "scale-105 blur-[2px] brightness-90",
              smileLoading && "opacity-60"
            )}
          />
        ) : null}

        {isPending && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 px-3 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            <p className="mt-2 text-xs text-gray-600">Creating image…</p>
          </div>
        )}

        {smileLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 px-3 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-700" />
            <p className="mt-2 text-xs font-medium text-gray-700">Applying smile…</p>
          </div>
        )}

        {isFailed && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/90 p-3 text-center">
            <p className="text-xs text-gray-600">Generation failed</p>
          </div>
        )}
      </div>

      {isCompleted && (
        <div className="grid grid-cols-3 border-t border-gray-100">
          <button
            ref={smileButtonRef}
            type="button"
            disabled={smileLoading}
            onClick={onToggleSmile}
            className={cn(
              "flex flex-col items-center gap-1 border-r border-gray-100 py-3 text-gray-600 hover:bg-gray-50",
              editsDisabled && "opacity-60"
            )}
            aria-label="Smile options"
            aria-expanded={smileOpen}
          >
            <Smile className="h-4 w-4" />
            <span className="text-[10px] font-medium">Smile</span>
          </button>

          <SmilePopover
            open={smileOpen}
            anchorRef={smileButtonRef}
            onClose={onCloseSmile}
            onSelect={onApplySmile}
            loading={smileLoading}
          />

          <button
            type="button"
            disabled={smileLoading}
            onClick={onEdit}
            className={cn(
              "flex flex-col items-center gap-1 border-r border-gray-100 py-3 text-gray-600 hover:bg-gray-50",
              editsDisabled && "opacity-60"
            )}
            aria-label="Edit photo"
          >
            <Pencil className="h-4 w-4" />
            <span className="text-[10px] font-medium">Edit</span>
          </button>

          <a
            href={displayUrl}
            download
            className="flex flex-col items-center gap-1 py-3 text-gray-600 hover:bg-gray-50"
            aria-label="Download photo"
          >
            <Download className="h-4 w-4" />
            <span className="text-[10px] font-medium">Save</span>
          </a>
        </div>
      )}
    </div>
  );
}
