import type { Metadata } from "next";
import type { Property } from "@/lib/types";

export const siteName = "Harlequin Diani";
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function propertyMetadata(property: Property): Metadata {
  const title = `${property.title} in ${property.location} | ${siteName}`;
  const description = `${property.description.slice(0, 145)}${property.description.length > 145 ? "..." : ""}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/property/${property.slug}`
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/property/${property.slug}`,
      siteName,
      images: property.images[0] ? [{ url: property.images[0], width: 1200, height: 800, alt: property.title }] : [],
      type: "website"
    }
  };
}
