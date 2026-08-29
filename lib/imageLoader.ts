import type { ImageLoaderProps } from "next/image";

const CLOUDINARY_HOST = "res.cloudinary.com";
const CLOUDINARY_UPLOAD_PATH = "/dcaamvlzr/image/upload/";
const UNSPLASH_HOST = "images.unsplash.com";

export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  try {
    const url = new URL(src);

    if (url.hostname === CLOUDINARY_HOST && url.pathname.startsWith(CLOUDINARY_UPLOAD_PATH)) {
      url.pathname = url.pathname.replace(
        CLOUDINARY_UPLOAD_PATH,
        `${CLOUDINARY_UPLOAD_PATH}f_auto,q_auto,c_limit,w_${width}/`
      );
      return url.toString();
    }

    if (url.hostname === UNSPLASH_HOST) {
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      url.searchParams.set("w", String(width));
      url.searchParams.set("q", String(quality ?? 75));
      return url.toString();
    }
  } catch {
    // Local images are returned unchanged. The current public image set is
    // remote, but this keeps the loader safe for future local assets.
  }

  return src;
}
