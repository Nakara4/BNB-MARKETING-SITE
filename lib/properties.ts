import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { Property, PropertyDocument, PropertyInput } from "@/lib/types";

const COLLECTION = "properties";

function featuredSlugs() {
  return (process.env.FEATURED_PROPERTY_SLUGS || process.env.NEXT_PUBLIC_FEATURED_PROPERTY_SLUGS || "")
    .split(",")
    .map((slug) => normalizeSlug(slug))
    .filter(Boolean);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeSlug(value: string) {
  try {
    return slugify(decodeURIComponent((value || "").trim()));
  } catch {
    return slugify((value || "").trim());
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toProperty(document: PropertyDocument): Property {
  return {
    id: document._id?.toString() ?? "",
    title: document.title,
    slug: document.slug,
    price: document.price,
    location: document.location,
    description: document.description,
    images: document.images ?? [],
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString()
  };
}

function getFeaturedRank(property: Property, pinnedSlugs: string[]) {
  const pinnedIndex = pinnedSlugs.indexOf(normalizeSlug(property.slug));

  if (pinnedIndex >= 0) {
    return pinnedIndex;
  }

  const searchableText = `${property.title} ${property.location}`.toLowerCase();

  if (searchableText.includes("harlequin")) {
    return 100;
  }

  if (searchableText.includes("diani")) {
    return 200;
  }

  return 1000;
}

function sortProperties(properties: Property[]) {
  const pinnedSlugs = featuredSlugs();

  return [...properties].sort((first, second) => {
    const rankDifference = getFeaturedRank(first, pinnedSlugs) - getFeaturedRank(second, pinnedSlugs);

    if (rankDifference !== 0) {
      return rankDifference;
    }

    return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
  });
}

async function collection() {
  const db = await getDb();
  const properties = db.collection<PropertyDocument>(COLLECTION);
  await properties.createIndex({ slug: 1 }, { unique: true });
  await properties.createIndex({ location: "text", title: "text", description: "text" });
  return properties;
}

export async function getProperties(location?: string) {
  if (!process.env.MONGODB_URI) {
    return [];
  }

  const properties = await collection();
  const normalizedLocation = location?.trim().slice(0, 100);
  const query = normalizedLocation
    ? {
        location: {
          $regex: escapeRegExp(normalizedLocation),
          $options: "i"
        }
      }
    : {};

  const documents = await properties.find(query).sort({ createdAt: -1 }).toArray();
  return sortProperties(documents.map(toProperty));
}

export async function getPropertyBySlug(slug: string) {
  const normalizedSlug = normalizeSlug(slug);

  if (!process.env.MONGODB_URI || !normalizedSlug) {
    return null;
  }

  const properties = await collection();
  const document = await properties.findOne({
    $or: [
      { slug },
      { slug: normalizedSlug },
      { slug: { $regex: `^${escapeRegExp(normalizedSlug)}$`, $options: "i" } },
      { slug: { $regex: `^${escapeRegExp(slug)}$`, $options: "i" } }
    ]
  });

  return document ? toProperty(document) : null;
}

export async function createProperty(input: PropertyInput) {
  const properties = await collection();
  const now = new Date();
  const baseSlug = slugify(input.slug || input.title);
  let slug = baseSlug;
  let suffix = 2;

  while (await properties.findOne({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const document: PropertyDocument = {
    title: input.title,
    slug,
    price: Number(input.price),
    location: input.location,
    description: input.description,
    images: input.images ?? [],
    createdAt: now,
    updatedAt: now
  };

  const result = await properties.insertOne(document);
  return toProperty({ ...document, _id: result.insertedId });
}

export async function updateProperty(id: string, input: PropertyInput) {
  const properties = await collection();
  const now = new Date();
  const existing = await properties.findOne({ _id: new ObjectId(id) });

  if (!existing) {
    return null;
  }

  let slug = existing.slug;
  const requestedSlug = slugify(input.slug || input.title);

  if (requestedSlug && requestedSlug !== existing.slug) {
    slug = requestedSlug;
    let suffix = 2;
    while (await properties.findOne({ slug, _id: { $ne: existing._id } })) {
      slug = `${requestedSlug}-${suffix}`;
      suffix += 1;
    }
  }

  await properties.updateOne(
    { _id: existing._id },
    {
      $set: {
        title: input.title,
        slug,
        price: Number(input.price),
        location: input.location,
        description: input.description,
        images: input.images ?? [],
        updatedAt: now
      }
    }
  );

  const updated = await properties.findOne({ _id: existing._id });
  return updated ? toProperty(updated) : null;
}

export async function deleteProperty(id: string) {
  const properties = await collection();
  await properties.deleteOne({ _id: new ObjectId(id) });
}
