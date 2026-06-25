import { SearchBar } from "@/components/search-bar";
import { SiteHeader } from "@/components/site-header";
import { PropertyCard } from "@/components/property-card";
import { getProperties } from "@/lib/properties";
import { formatMongoError } from "@/lib/mongodb";
import type { Property } from "@/lib/types";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{
    location?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { location } = await searchParams;
  let properties: Property[] = [];
  let databaseError = "";

  try {
    properties = await getProperties(location);
  } catch (error) {
    databaseError = formatMongoError(error);
  }

  return (
    <main>
      <SiteHeader />
      <section className="relative min-h-[92vh] overflow-hidden bg-ink">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(31, 41, 51, 0.78), rgba(31, 41, 51, 0.35)), url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1800&auto=format&fit=crop')"
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pb-24 pt-28 sm:px-8">
          <div className="max-w-3xl text-white">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-white/75">Curated stays by location</p>
            <h1 className="text-4xl font-black leading-tight sm:text-6xl">Book beautiful staycation homes without the back-and-forth.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
              Browse handpicked homes, compare nightly rates, and reserve directly through WhatsApp or email.
            </p>
          </div>
          <div className="mt-10">
            <SearchBar location={location} />
          </div>
        </div>
      </section>

      <section className="bg-mist py-14 sm:py-20" aria-labelledby="available-homes">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {databaseError ? (
            <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
              {databaseError}
            </div>
          ) : null}

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-palm">Available homes</p>
              <h2 id="available-homes" className="mt-2 text-3xl font-black text-ink sm:text-4xl">
                {location ? `Staycations in ${location}` : "Explore every property"}
              </h2>
            </div>
            <p className="text-sm font-semibold text-slate-600">{properties.length} home{properties.length === 1 ? "" : "s"} listed</p>
          </div>

          {properties.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : databaseError ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
              <h2 className="text-2xl font-bold text-ink">Properties are temporarily unavailable</h2>
              <p className="mt-3 text-slate-600">The site is running, but it cannot reach the development database.</p>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
              <h2 className="text-2xl font-bold text-ink">No homes found</h2>
              <p className="mt-3 text-slate-600">Try another location or add your first property from the admin dashboard.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
