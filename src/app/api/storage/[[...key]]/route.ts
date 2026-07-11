import { downloadFromStorage } from "@/lib/storage";
import { STORAGE_IMAGE_CACHE_CONTROL } from "@/lib/constants";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key?: string[] }> }
) {
  const { key: keyParts } = await params;
  const storageKey = (keyParts || []).map(decodeURIComponent).join("/");

  if (!storageKey) {
    return NextResponse.json({ error: "Missing storage key" }, { status: 400 });
  }

  try {
    const buffer = await downloadFromStorage(storageKey);
    const ext = path.extname(storageKey).toLowerCase();
    const contentType =
      ext === ".png" ? "image/png" :
      ext === ".webp" ? "image/webp" :
      ext === ".gif" ? "image/gif" :
      "image/jpeg";

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": STORAGE_IMAGE_CACHE_CONTROL,
      },
    });
  } catch (err) {
    console.log("[storage] download error", storageKey, err);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
