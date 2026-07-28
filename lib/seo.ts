import type { Metadata } from "next";
import type { Property } from "@/lib/types";

export const siteName = "Harlequin Diani";
const productionSiteUrl = "https://harlequindiani.com";
const fallbackSiteImageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1800&auto=format&fit=crop";

export const contactDetails = {
  phone: "+254711837484",
  email: "ngangapepe8@gmail.com",
  address: "Diani Beach, Kwale County, Kenya"
};

function normalizeSiteUrl(value?: string) {
  const configuredUrl = value?.trim().replace(/\/$/, "");

  if (process.env.NODE_ENV === "production" && configuredUrl !== productionSiteUrl) {
    return productionSiteUrl;
  }

  return configuredUrl || "http://localhost:3000";
}

export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const siteLogoUrl = `${siteUrl}/icon.svg`;
export const siteImageUrl = process.env.NEXT_PUBLIC_HERO_IMAGE_URL || fallbackSiteImageUrl;

function sameAsUrls() {
  return (process.env.NEXT_PUBLIC_SAME_AS_URLS || "")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => {
      try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
      } catch {
        return false;
      }
    });
}

export function businessStructuredData() {
  const organizationId = `${siteUrl}/#organization`;
  const sameAs = sameAsUrls();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        url: siteUrl,
        logo: siteLogoUrl,
        image: siteImageUrl,
        telephone: contactDetails.phone,
        email: contactDetails.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Diani Beach",
          addressRegion: "Kwale County",
          addressCountry: "KE"
        },
        sameAs
      },
      {
        "@type": ["LodgingBusiness", "LocalBusiness"],
        "@id": `${siteUrl}/#business`,
        name: siteName,
        url: siteUrl,
        logo: siteLogoUrl,
        image: siteImageUrl,
        telephone: contactDetails.phone,
        email: contactDetails.email,
        priceRange: "KSh 3,500-KSh 5,500 per night",
        currenciesAccepted: "KES",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Diani Beach",
          addressRegion: "Kwale County",
          addressCountry: "KE"
        },
        parentOrganization: {
          "@id": organizationId
        },
        sameAs
      }
    ]
  };
}

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
