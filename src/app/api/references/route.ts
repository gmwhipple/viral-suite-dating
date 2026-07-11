import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, getClientIp } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";
import {
  listCatalogReferencesForPlan,
  listCustomReferences,
  uploadCustomReference,
} from "@/lib/reference-storage";
import type { ReferenceGender } from "@/lib/firebase/types";
import { getAppBaseUrl } from "@/lib/app-url";
import { getOrCreateUser, updateUser } from "@/lib/services/users";

const MAX_REFERENCE_SIZE = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function parseGender(value: string | null): ReferenceGender {
  return value === "women" ? "women" : "men";
}

export async function GET(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gender = parseGender(request.nextUrl.searchParams.get("gender"));
  const baseUrl = getAppBaseUrl(request);
  const user = await getOrCreateUser(auth.uid, auth.email);

  const [catalogResult, customReferences] = await Promise.all([
    listCatalogReferencesForPlan(gender, user.plan, baseUrl),
    listCustomReferences(auth.uid, baseUrl),
  ]);

  return NextResponse.json({
    gender,
    catalogReferences: catalogResult.catalogReferences,
    catalogTotal: catalogResult.catalogTotal,
    catalogLockedCount: catalogResult.catalogLockedCount,
    customReferences,
    uploadPaths: {
      men: "references/men/",
      women: "references/women/",
      location: "Firebase Console → Storage",
    },
  });
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file required" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Only JPG, PNG, or WEBP allowed" }, { status: 400 });
    }

    if (file.size > MAX_REFERENCE_SIZE) {
      return NextResponse.json({ error: "Max file size is 15MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const baseUrl = getAppBaseUrl(request);
    const reference = await uploadCustomReference(auth.uid, file.name, buffer, file.type, baseUrl);

    const genderField = formData.get("gender");
    if (genderField === "men" || genderField === "women") {
      await updateUser(auth.uid, { referenceGender: genderField });
    }

    await logActivity(auth.uid, "style_reference_uploaded", {
      storageKey: reference.storageKey,
    }, {
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ reference });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.log("[references] upload error", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await verifyAuthToken(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const gender = body?.gender;
  if (gender !== "men" && gender !== "women") {
    return NextResponse.json({ error: "gender must be men or women" }, { status: 400 });
  }

  await updateUser(auth.uid, { referenceGender: gender });
  return NextResponse.json({ gender });
}
