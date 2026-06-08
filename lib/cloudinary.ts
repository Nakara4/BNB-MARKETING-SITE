import { v2 as cloudinary } from "cloudinary";

function configureCloudinary() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim().replace(/^["']|["']$/g, "");

  if (!cloudinaryUrl) {
    throw new Error("Missing CLOUDINARY_URL. Add it to .env.local before uploading images.");
  }

  const normalizedUrl = cloudinaryUrl.startsWith("cloudinary://") ? cloudinaryUrl : `cloudinary://${cloudinaryUrl}`;

  try {
    const parsedUrl = new URL(normalizedUrl);

    if (parsedUrl.protocol !== "cloudinary:" || !parsedUrl.username || !parsedUrl.password || !parsedUrl.hostname) {
      throw new Error("Invalid Cloudinary URL parts.");
    }

    cloudinary.config({
      cloud_name: parsedUrl.hostname,
      api_key: decodeURIComponent(parsedUrl.username),
      api_secret: decodeURIComponent(parsedUrl.password),
      secure: true
    });

    // Cloudinary's SDK also reads this env var internally, so normalize it too.
    process.env.CLOUDINARY_URL = normalizedUrl;
  } catch {
    throw new Error("Invalid CLOUDINARY_URL. Use the format cloudinary://api_key:api_secret@cloud_name.");
  }
}

export async function uploadImage(file: File) {
  configureCloudinary();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "staycation-homes",
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }]
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed."));
          return;
        }
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}
