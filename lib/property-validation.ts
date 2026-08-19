import type { PropertyInput } from "@/lib/types";

const MAX_TITLE_LENGTH = 120;
const MAX_LOCATION_LENGTH = 160;
const MAX_DESCRIPTION_LENGTH = 6000;
const MAX_SLUG_LENGTH = 160;
const MAX_IMAGES = 12;
const MAX_PRICE = 1_000_000;
const ALLOWED_IMAGE_HOSTS = new Set(["res.cloudinary.com", "images.unsplash.com"]);

type ValidationResult =
  | { data: PropertyInput; error?: never }
  | { data?: never; error: string };

function requiredString(value: unknown, label: string, maximumLength: number) {
  if (typeof value !== "string" || !value.trim()) {
    return { error: `${label} is required.` };
  }

  const normalized = value.trim();
  return normalized.length <= maximumLength ? { value: normalized } : { error: `${label} is too long.` };
}

function validImageUrl(value: unknown) {
  if (typeof value !== "string" || value.length > 2048) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" && ALLOWED_IMAGE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export function validatePropertyInput(value: unknown): ValidationResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { error: "Invalid property data." };
  }

  const input = value as Record<string, unknown>;
  const title = requiredString(input.title, "Title", MAX_TITLE_LENGTH);
  const location = requiredString(input.location, "Location", MAX_LOCATION_LENGTH);
  const description = requiredString(input.description, "Description", MAX_DESCRIPTION_LENGTH);

  if (title.error || location.error || description.error) {
    return { error: title.error || location.error || description.error || "Invalid property data." };
  }

  const price = Number(input.price);
  if (!Number.isFinite(price) || price <= 0 || price > MAX_PRICE) {
    return { error: `Price must be between 1 and ${MAX_PRICE.toLocaleString("en-KE")}.` };
  }

  const images = input.images ?? [];
  if (!Array.isArray(images) || images.length > MAX_IMAGES || !images.every(validImageUrl)) {
    return { error: `Use no more than ${MAX_IMAGES} approved HTTPS image URLs.` };
  }

  let slug: string | undefined;
  if (input.slug !== undefined && input.slug !== "") {
    if (typeof input.slug !== "string" || input.slug.length > MAX_SLUG_LENGTH || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) {
      return { error: "Slug must contain lowercase letters, numbers, and single hyphens only." };
    }
    slug = input.slug;
  }

  return {
    data: {
      title: title.value!,
      location: location.value!,
      description: description.value!,
      price,
      images: images as string[],
      ...(slug ? { slug } : {})
    }
  };
}
