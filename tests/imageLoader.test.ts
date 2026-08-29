import assert from "node:assert/strict";
import test from "node:test";
import imageLoader from "../lib/imageLoader.ts";

test("builds a responsive Cloudinary delivery URL", () => {
  const result = imageLoader({
    src: "https://res.cloudinary.com/dcaamvlzr/image/upload/v123/staycation-homes/room.jpg",
    width: 828,
    quality: 75
  });

  assert.equal(
    result,
    "https://res.cloudinary.com/dcaamvlzr/image/upload/f_auto,q_auto,c_limit,w_828/v123/staycation-homes/room.jpg"
  );
});

test("reuses Unsplash responsive image parameters", () => {
  const result = new URL(
    imageLoader({
      src: "https://images.unsplash.com/photo-example?w=1800&q=80",
      width: 640,
      quality: 75
    })
  );

  assert.equal(result.searchParams.get("w"), "640");
  assert.equal(result.searchParams.get("q"), "75");
  assert.equal(result.searchParams.get("auto"), "format");
  assert.equal(result.searchParams.get("fit"), "crop");
});

test("leaves unsupported image sources unchanged", () => {
  assert.equal(
    imageLoader({ src: "https://example.com/image.jpg", width: 640, quality: 75 }),
    "https://example.com/image.jpg"
  );
});
