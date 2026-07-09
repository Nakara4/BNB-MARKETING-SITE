import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";

export function PropertyCard({ property }: { property: Property }) {
  // Optimize Cloudinary images with transformations
  // w_500 = max width for card
  // q_auto = automatic quality optimization
  // f_auto = automatic format selection (webp, etc.)
  const optimizedImageUrl = property.images[0]
    ? property.images[0].includes("cloudinary.com")
      ? property.images[0].replace("/image/upload/", "/image/upload/w_500,q_auto,f_auto/")
      : property.images[0]
    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=500&auto=format&fit=crop";

  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <Image
          src={optimizedImageUrl}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-ink">{property.title}</h3>
        <p className="mt-1 text-sm font-semibold text-palm">{property.location}</p>
        <p className="mt-2 text-sm font-bold text-slate-900">KSh {property.price.toLocaleString()} / night</p>
        <Link
          href={`/property/${property.slug}`}
          className="mt-4 inline-flex text-sm font-bold text-coral transition-colors hover:text-coral/80"
        >
          View details →
        </Link>
      </div>
    </article>
  );
}
