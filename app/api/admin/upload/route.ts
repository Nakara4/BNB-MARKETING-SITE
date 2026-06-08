import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { uploadImage } = await import("@/lib/cloudinary");
    const formData = await request.formData();
    const files = formData.getAll("images").filter((item): item is File => item instanceof File);

    if (!files.length) {
      return NextResponse.json({ error: "Choose at least one image." }, { status: 400 });
    }

    const invalidFile = files.find((file) => !ACCEPTED_IMAGE_TYPES.includes(file.type));
    if (invalidFile) {
      return NextResponse.json({ error: "Upload JPG, PNG, WebP, or GIF images only." }, { status: 400 });
    }

    const oversizedFile = files.find((file) => file.size > MAX_IMAGE_SIZE);
    if (oversizedFile) {
      return NextResponse.json({ error: "Each image must be 10MB or smaller." }, { status: 400 });
    }

    const urls = await Promise.all(files.map(uploadImage));
    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    const message = error instanceof Error ? error.message : "Image upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
