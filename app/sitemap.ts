import type { MetadataRoute } from "next";
import { getProperties } from "@/lib/properties";
import { siteUrl } from "@/lib/seo";
import type { Property } from "@/lib/types";

export const dynamic = "force-dynamic";

function absoluteUrl(path = "") {
  const baseUrl = siteUrl.replace(/\/$/, "");
  return `${baseUrl}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let properties: Property[] = [];

  try {
    properties = await getProperties();
  } catch {
    properties = [];
  }

  const now = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    ...properties.map((property) => ({
      url: absoluteUrl(`/property/${property.slug}`),
      lastModified: new Date(property.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
