import assert from "node:assert/strict";
import test from "node:test";
import { validatePropertyInput } from "../lib/property-validation.ts";

const baseInput = {
  title: "Harlequin Studio",
  price: 4500,
  location: "Diani",
  description: "A furnished studio near Diani Beach."
};

test("accepts images from the configured Harlequin Cloudinary account", () => {
  const result = validatePropertyInput({
    ...baseInput,
    images: ["https://res.cloudinary.com/dcaamvlzr/image/upload/v123/staycation-homes/room.jpg"]
  });

  assert.ok("data" in result);
});

test("rejects images from other Cloudinary accounts", () => {
  const result = validatePropertyInput({
    ...baseInput,
    images: ["https://res.cloudinary.com/another-account/image/upload/room.jpg"]
  });

  assert.equal(result.error, "Use no more than 12 approved HTTPS image URLs.");
});
