import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, getClientIp } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";
import { editImageWithNanoBanana, isFalConfigured } from "@/lib/fal";
import { getAdminDb, COLLECTIONS, isAdminConfigured } from "@/lib/firebase/admin";
import { uploadUserPhoto } from "@/lib/storage";
import { removeWatermark, fetchImageBuffer } from "@/lib/watermark";
import type { EditJob } from "@/lib/firebase/types";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isFalConfigured()) {
    return NextResponse.json({ error: "FAL API not configured" }, { status: 503 });
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    let prompt = "";
    let sourceImageUrl = "";
    let attachmentUrl: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      prompt = (formData.get("prompt") as string) || "";
      sourceImageUrl = (formData.get("sourceImageUrl") as string) || "";
      const attachment = formData.get("attachment") as File | null;

      if (attachment && attachment.size > 0) {
        const buffer = Buffer.from(await attachment.arrayBuffer());
        const stored = await uploadUserPhoto(auth.uid, attachment.name, buffer, attachment.type);
        attachmentUrl = stored.publicUrl;
      }
    } else {
      const body = await request.json();
      prompt = body.prompt || "";
      sourceImageUrl = body.sourceImageUrl || "";
      attachmentUrl = body.attachmentUrl;
    }

    if (!prompt || !sourceImageUrl) {
      return NextResponse.json({ error: "prompt and sourceImageUrl required" }, { status: 400 });
    }

    const imageUrls = attachmentUrl
      ? [sourceImageUrl, attachmentUrl]
      : [sourceImageUrl];

    const editId = uuidv4();
    const editJob: EditJob = {
      id: editId,
      userId: auth.uid,
      sourceGenerationId: "",
      prompt,
      attachmentUrl,
      status: "processing",
      provider: "fal",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isAdminConfigured()) {
      await getAdminDb().collection(COLLECTIONS.edits).doc(editId).set(editJob);
    }

    const result = await editImageWithNanoBanana({ prompt, imageUrls });
    const rawBuffer = await fetchImageBuffer(result.imageUrl);
    const cleanedBuffer = await removeWatermark(rawBuffer);
    const stored = await uploadUserPhoto(auth.uid, `edit-${editId}.png`, cleanedBuffer, "image/png");

    if (isAdminConfigured()) {
      await getAdminDb().collection(COLLECTIONS.edits).doc(editId).update({
        status: "completed",
        resultImageUrl: stored.publicUrl,
        storageKey: stored.storageKey,
        updatedAt: new Date().toISOString(),
      });
    }

    await logActivity(auth.uid, "photo_edit_completed", {
      editId,
      prompt: prompt.slice(0, 200),
      hasAttachment: Boolean(attachmentUrl),
    }, {
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({
      edit: {
        ...editJob,
        status: "completed",
        resultImageUrl: stored.publicUrl,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Edit failed";
    console.log("[edit] error", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
