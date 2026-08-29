import { PropertyCard } from "@/components/property-card";
import type { Property } from "@/lib/types";

export function PropertyGrid({
  properties,
  location = "",
  databaseError = ""
}: {
  properties: Property[];
  location?: string;
  databaseError?: string;
}) {
  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-palm">Available stays</p>
          <h2 id="available-homes" className="mt-2 text-3xl font-black text-ink sm:text-4xl">
            {location ? `Stays in ${location}` : "Book Harlequin Diani and selected stays"}
          </h2>
        </div>
        <p className="text-sm font-semibold text-slate-600">
          {properties.length} stay{properties.length === 1 ? "" : "s"} listed
        </p>
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
          <h2 className="text-2xl font-bold text-ink">No stays found</h2>
          <p className="mt-3 text-slate-600">Try another location or add your first property from the admin dashboard.</p>
        </div>
      )}
    </>
  );
}
