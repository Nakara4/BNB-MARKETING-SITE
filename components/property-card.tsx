import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Property } from "@/lib/types";

export function PropertyCard({ property }: { property: Property }) {
  const cover = property.images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop";

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link href={`/property/${property.slug}`} aria-label={`View ${property.title}`}>
        <div className="relative aspect-[4/3] bg-slate-100">
          <Image src={cover} alt={property.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="space-y-3 p-5">
          <div>
            <h2 className="text-xl font-bold text-ink">{property.title}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-600">
              <MapPin className="h-4 w-4 text-palm" aria-hidden="true" />
              {property.location}
            </p>
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-slate-600">{property.description}</p>
          <p className="text-lg font-extrabold text-ink">
            KSh {property.price.toLocaleString()}
            <span className="text-sm font-semibold text-slate-500"> / night</span>
          </p>
        </div>
      </Link>
    </article>
  );
}
