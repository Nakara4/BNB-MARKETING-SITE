import { NextResponse } from "next/server";
import { serverErrorResponse } from "@/lib/api-errors";
import { isAdminAuthenticated } from "@/lib/auth";
import { isTrustedMutationRequest } from "@/lib/request-security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FILES = 6;
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const MAX_TOTAL_SIZE = 4 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

async function hasValidImageSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const ascii = String.fromCharCode(...bytes);

  switch (file.type) {
    case "image/jpeg":
      return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    case "image/png":
      return bytes.slice(0, 8).every((value, index) => value === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][index]);
    case "image/webp":
      return ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP";
    case "image/gif":
      return ascii.startsWith("GIF87a") || ascii.startsWith("GIF89a");
    default:
      return false;
  }
}

export async function POST(request: Request) {
  try {
    if (!isTrustedMutationRequest(request)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { uploadImage } = await import("@/lib/cloudinary");
    const formData = await request.formData();
    const files = formData.getAll("images").filter((item): item is File => item instanceof File);

    if (!files.length) {
      return NextResponse.json({ error: "Choose at least one image." }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Upload no more than ${MAX_FILES} images at once.` }, { status: 400 });
    }

    const invalidFile = files.find((file) => !ACCEPTED_IMAGE_TYPES.includes(file.type));
    if (invalidFile) {
      return NextResponse.json({ error: "Upload JPG, PNG, WebP, or GIF images only." }, { status: 400 });
    }

    const oversizedFile = files.find((file) => file.size > MAX_IMAGE_SIZE);
    if (oversizedFile) {
      return NextResponse.json({ error: "Each image must be 4MB or smaller." }, { status: 400 });
    }

    if (files.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_SIZE) {
      return NextResponse.json({ error: "The combined upload must be 4MB or smaller." }, { status: 400 });
    }

    const signatures = await Promise.all(files.map(hasValidImageSignature));
    if (signatures.some((valid) => !valid)) {
      return NextResponse.json({ error: "One or more files do not contain valid image data." }, { status: 400 });
    }

    const urls = await Promise.all(files.map(uploadImage));
    return NextResponse.json({ urls });
  } catch (error) {
    return serverErrorResponse("Cloudinary upload failed", error);
  }
}
