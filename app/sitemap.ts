import type { MetadataRoute } from "next";
import { getProperties } from "@/lib/properties";
import { siteUrl } from "@/lib/seo";
import type { Property } from "@/lib/types";

export const dynamic = "force-dynamic";

const fallbackPropertySlugs = [
  "studio-airbnb-in-diani-beach-harlequin-apartments-ukunda",
  "1-bdrm-airbnb-in-ukunda-diani"
];

function absoluteUrl(path = "") {
  const baseUrl = siteUrl.replace(/\/$/, "");
  return `${baseUrl}${path}`;
}

async function getSitemapProperties() {
  return Promise.race([
    getProperties(),
    new Promise<Property[]>((resolve) => {
      setTimeout(() => resolve([]), 4000);
    })
  ]);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let properties: Property[] = [];

  try {
    properties = await getSitemapProperties();
  } catch {
    properties = [];
  }

  const now = new Date();
  const propertyRoutes = properties.length
    ? properties.map((property) => ({
        slug: property.slug,
        lastModified: new Date(property.updatedAt)
      }))
    : fallbackPropertySlugs.map((slug) => ({
        slug,
        lastModified: now
      }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    ...propertyRoutes.map((property) => ({
      url: absoluteUrl(`/property/${property.slug}`),
      lastModified: property.lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
