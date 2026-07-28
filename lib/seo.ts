import type { Metadata } from "next";
import type { Property } from "@/lib/types";

export const siteName = "Harlequin Diani";
const productionSiteUrl = "https://harlequindiani.com";

function normalizeSiteUrl(value?: string) {
  const configuredUrl = value?.trim().replace(/\/$/, "");

  if (process.env.NODE_ENV === "production" && configuredUrl !== productionSiteUrl) {
    return productionSiteUrl;
  }

  return configuredUrl || "http://localhost:3000";
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export function propertyMetadata(property: Property): Metadata {
  const title = `${property.title} in ${property.location}`;
  const description = `${property.description.slice(0, 145)}${property.description.length > 145 ? "..." : ""}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/property/${property.slug}`
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: `${siteUrl}/property/${property.slug}`,
      siteName,
      images: property.images[0] ? [{ url: property.images[0], width: 1200, height: 800, alt: property.title }] : [],
      type: "website"
    }
  };
}
