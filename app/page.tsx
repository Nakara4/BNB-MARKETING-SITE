import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { SearchBar } from "@/components/search-bar";
import { SiteHeader } from "@/components/site-header";
import { PropertyGrid } from "@/components/property-grid";
import { PropertyResults } from "@/components/property-results";
import { getProperties } from "@/lib/properties";
import { formatMongoError } from "@/lib/mongodb";
import { siteUrl } from "@/lib/seo";
import type { Property } from "@/lib/types";
import { Car, MapPin, MessageCircle, ShieldCheck, Sparkles, Waves, Wifi } from "lucide-react";

// Property mutations invalidate this page immediately; this is only a safety net.
export const revalidate = 86400;

const heroFallbackImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1800&auto=format&fit=crop";

const trustHighlights = [
  { label: "Near Umoja landmark", icon: MapPin },
  { label: "1.2 km footpath to Diani Beach", icon: Waves },
  { label: "Book directly on WhatsApp", icon: MessageCircle }
];

const flagshipFeatures = [
  {
    title: "Spotless apartments",
    description: "Comfortable studio and one-bedroom stays with working kitchens.",
    icon: Sparkles
  },
  {
    title: "Reliable basics",
    description: "Wi-Fi, parking, furnished rooms, and responsive local support.",
    icon: Wifi
  },
  {
    title: "Easy to reach",
    description: "Use Umoja and the nearby international school signage as references.",
    icon: Car
  },
  {
    title: "Direct host care",
    description: "Guests can ask questions and confirm availability before booking.",
    icon: ShieldCheck
  }
];

const locationHighlights = [
  {
    title: "1.2 km",
    description: "Approximate footpath distance to Diani Beach. The vehicle route is about 2 km."
  },
  {
    title: "Umoja",
    description: "Useful landmark when directing taxis, tuk-tuks, or boda boda riders."
  },
  {
    title: "Airport",
    description: "A short drive to Ukunda Airport, with route time depending on traffic and road choice."
  }
];

function getFlagshipProperty(properties: Property[]) {
  return properties.find((property) => `${property.title} ${property.location}`.toLowerCase().includes("diani")) ?? properties[0];
}

function getHeroImage(flagshipProperty?: Property) {
  return process.env.NEXT_PUBLIC_HERO_IMAGE_URL || flagshipProperty?.images[0] || heroFallbackImage;
}

export const metadata: Metadata = {
  alternates: { canonical: `${siteUrl}/` },
  openGraph: { url: `${siteUrl}/` }
};

export default async function Home() {
  let properties: Property[] = [];
  let databaseError = "";

  try {
    properties = await getProperties();
  } catch (error) {
    databaseError = formatMongoError(error);
  }

  const flagshipProperty = getFlagshipProperty(properties);
  const heroImage = getHeroImage(flagshipProperty);

  return (
    <main>
      <SiteHeader />
      <section className="relative min-h-[88vh] overflow-hidden bg-ink">
        <div className="absolute inset-0" aria-hidden="true">
          <Image src={heroImage} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 to-ink/40" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-5 pb-20 pt-28 sm:px-8">
          <div className="max-w-4xl text-white">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-white/75">Harlequin Diani, Ukunda</p>
            <h1 className="text-4xl font-black leading-tight sm:text-6xl">Quiet serviced apartments near Diani Beach.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
              Stay at Harlequin Diani, a growing collection of furnished apartments near Umoja, with a footpath to
              Diani Beach of about 1.2 km, a vehicle route of about 2 km, and easy access to Ukunda Airport.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-sm font-bold text-white">
              {trustHighlights.map((highlight) => {
                const Icon = highlight.icon;
                return (
                  <span
                    key={highlight.label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 backdrop-blur"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {highlight.label}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="mt-10">
            <Suspense fallback={<div className="h-20 w-full max-w-3xl rounded-lg bg-white/90" />}>
              <SearchBar />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16" aria-labelledby="harlequin-diani">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-palm">Flagship stay</p>
            <h2 id="harlequin-diani" className="mt-2 max-w-3xl text-3xl font-black text-ink sm:text-5xl">
              Harlequin Diani is the home base for the brand.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              The property is still growing, but the guest promise is already clear: clean furnished apartments, a quiet
              residential setting, and easy access to Diani Beach Road, Ukunda town, malls, restaurants, the beach, and
              Ukunda Airport.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {flagshipFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-lg border border-slate-200 bg-mist p-5">
                  <Icon className="h-6 w-6 text-coral" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-black text-ink">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="stays" className="bg-mist py-14 sm:py-20" aria-labelledby="available-homes">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {databaseError ? (
            <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
              {databaseError}
            </div>
          ) : null}

          <Suspense fallback={<PropertyGrid properties={properties} databaseError={databaseError} />}>
            <PropertyResults properties={properties} databaseError={databaseError} />
          </Suspense>
        </div>
      </section>

      <section id="location" className="bg-white py-14 sm:py-20" aria-labelledby="location-heading">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-palm">Location guide</p>
            <h2 id="location-heading" className="mt-2 text-3xl font-black text-ink sm:text-4xl">
              Close to Diani Beach by footpath, easy to reach by road.
            </h2>
          </div>
          <div className="grid gap-5 text-slate-600 sm:grid-cols-3">
            {locationHighlights.map((highlight) => (
              <div key={highlight.title}>
                <p className="text-2xl font-black text-ink">{highlight.title}</p>
                <p className="mt-2 text-sm font-semibold leading-6">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
