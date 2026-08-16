import type { MetadataRoute } from "next";
import { getProperties } from "@/lib/properties";
import { siteUrl } from "@/lib/seo";
import type { Property } from "@/lib/types";

export const dynamic = "force-dynamic";

const fallbackPropertySlugs = [
  "studio-airbnb-in-diani-beach-harlequin-apartments-ukunda",
  "1-bdrm-airbnb-in-ukunda-diani"
];

const contentRoutes = ["/contact", "/about", "/diani-beach-guide", "/policies"];

type SitemapProperty = {
  slug: string;
  lastModified?: Date;
};

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

  const propertyRoutes: SitemapProperty[] = properties.length
    ? properties.map((property) => ({
        slug: property.slug,
        lastModified: new Date(property.updatedAt)
      }))
    : fallbackPropertySlugs.map((slug) => ({
        slug
      }));

  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1
    },
    ...contentRoutes.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "monthly" as const,
      priority: 0.7
    })),
    ...propertyRoutes.map((property) => ({
      url: absoluteUrl(`/property/${property.slug}`),
      ...(property.lastModified ? { lastModified: property.lastModified } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  ];
}
