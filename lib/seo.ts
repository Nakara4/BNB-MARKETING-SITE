import type { Metadata } from "next";
import type { Property } from "@/lib/types";

export const siteName = "Harlequin Diani";
const productionSiteUrl = "https://harlequindiani.com";
const fallbackSiteImageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1800&auto=format&fit=crop";

export const contactDetails = {
  phone: "+254711837484",
  email: "ngangapepe8@gmail.com",
  address: "Diani Beach, Kwale County, Kenya",
  whatsapp: "https://wa.me/254711837484"
};

export type PublicProfile = {
  name: string;
  url: string;
  category: "social" | "directory";
};

export const socialProfiles: PublicProfile[] = [
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@harlequindiani",
    category: "social"
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/people/Harlequin-Diani-Villas/61590755278313/",
    category: "social"
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/harlequin_diani/",
    category: "social"
  }
];

export const directoryProfiles: PublicProfile[] = [
  {
    name: "Google Maps",
    url: "https://maps.app.goo.gl/RsoUL1qEokRmVzPY8",
    category: "directory"
  },
  {
    name: "Booking.com",
    url: "https://www.booking.com/hotel/ke/harlequin-diani.html",
    category: "directory"
  }
];

export const publicProfiles = [...socialProfiles, ...directoryProfiles];

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

type StaticPageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

type PageStructuredDataInput = StaticPageMetadataInput & {
  type: "AboutPage" | "ContactPage" | "WebPage";
  dateModified?: string;
};

export function staticPageMetadata({ title, description, path }: StaticPageMetadataInput): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url,
      siteName,
      images: [{ url: siteImageUrl, alt: siteName }],
      type: "website"
    }
  };
}

export function pageStructuredData({ title, description, path, type, dateModified }: PageStructuredDataInput) {
  const url = `${siteUrl}${path}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: {
          "@id": `${siteUrl}/#website`
        },
        about: {
          "@id": `${siteUrl}/#business`
        },
        author: {
          "@id": `${siteUrl}/#organization`
        },
        ...(dateModified ? { dateModified } : {}),
        breadcrumb: {
          "@id": `${url}#breadcrumb`
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${siteUrl}/`
          },
          {
            "@type": "ListItem",
            position: 2,
            name: title,
            item: url
          }
        ]
      }
    ]
  };
}

export function businessStructuredData() {
  const organizationId = `${siteUrl}/#organization`;
  const sameAs = publicProfiles.map((profile) => profile.url);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        publisher: {
          "@id": organizationId
        }
      },
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

export function propertyStructuredData(property: Property) {
  const url = `${siteUrl}/property/${property.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": ["Apartment", "Accommodation"],
    "@id": `${url}#accommodation`,
    name: property.title,
    description: property.description,
    url,
    image: property.images.length ? property.images : [siteImageUrl],
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location,
      addressCountry: "KE"
    },
    provider: {
      "@id": `${siteUrl}/#business`
    },
    offers: {
      "@type": "Offer",
      url,
      price: property.price,
      priceCurrency: "KES",
      availability: "https://schema.org/InStock"
    }
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
