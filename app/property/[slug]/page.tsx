import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/properties";
import { propertyMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type PropertyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function normalizeWhatsAppPhone(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return "";
  }

  const digitsOnly = trimmedValue.replace(/\D/g, "");
  if (!digitsOnly) {
    return "";
  }

  const hasPlusPrefix = trimmedValue.startsWith("+");
  return hasPlusPrefix ? `+${digitsOnly}` : `+${digitsOnly}`;
}

function buildWhatsAppHref(baseUrl: string, message: string) {
  const trimmedBaseUrl = (baseUrl || "").trim();
  const fallbackPhone = "254700000000";
  let phone = "";

  if (trimmedBaseUrl) {
    const phoneMatch = trimmedBaseUrl.match(/(?:^|[/?&])phone=(\+?\d+)/i);
    const waMeMatch = trimmedBaseUrl.match(/wa\.me\/(\+?\d+)/i);
    const apiMatch = trimmedBaseUrl.match(/api\.whatsapp\.com\/send\/(?:.*)?phone=(\+?\d+)/i);

    if (phoneMatch?.[1]) {
      phone = normalizeWhatsAppPhone(phoneMatch[1]);
    } else if (waMeMatch?.[1]) {
      phone = normalizeWhatsAppPhone(waMeMatch[1]);
    } else if (apiMatch?.[1]) {
      phone = normalizeWhatsAppPhone(apiMatch[1]);
    } else {
      phone = normalizeWhatsAppPhone(trimmedBaseUrl);
    }
  }

  const normalizedPhone = phone || fallbackPhone;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${normalizedPhone.replace(/^\+/, "")}?text=${encodedMessage}`;
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Property Not Found",
      description: "This staycation home is no longer available."
    };
  }

  return propertyMetadata(property);
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const images = property.images.length
    ? property.images
    : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1400&auto=format&fit=crop"];
  const bookingMessage = `Hello! I’m interested in ${property.title} in ${property.location}. Please help me with availability and booking details.`;
  const whatsappHref = buildWhatsAppHref(
    process.env.NEXT_PUBLIC_BOOKING_WHATSAPP || "https://wa.me/254700000000",
    bookingMessage
  );
  const emailHref = process.env.NEXT_PUBLIC_BOOKING_EMAIL || "mailto:hello@example.com";

  return (
    <main className="bg-white">
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-5 py-5 sm:px-8">
        <Link href="/" className="text-sm font-bold text-palm hover:text-coral">
          Back to all homes
        </Link>
      </nav>

      <article>
        <header className="mx-auto max-w-7xl px-5 pb-8 sm:px-8">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-palm">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {property.location}
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-ink sm:text-6xl">{property.title}</h1>
        </header>

        <section aria-label={`${property.title} photo gallery`} className="mx-auto grid max-w-7xl gap-3 px-5 sm:grid-cols-4 sm:px-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100 sm:col-span-2 sm:row-span-2">
            <Image src={images[0]} alt={`${property.title} main view`} fill priority sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
          </div>
          {images.slice(1, 5).map((image, index) => (
            <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
              <Image src={image} alt={`${property.title} view ${index + 2}`} fill sizes="(min-width: 640px) 25vw, 100vw" className="object-cover" />
            </div>
          ))}
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_380px]">
          <div>
            <h2 className="text-2xl font-black text-ink">About this stay</h2>
            <p className="mt-4 whitespace-pre-line text-lg leading-8 text-slate-600">{property.description}</p>
          </div>

          <aside className="h-fit rounded-lg border border-slate-200 bg-mist p-6 shadow-sm">
            <p className="text-3xl font-black text-ink">
              KSh {property.price.toLocaleString()}
              <span className="text-base font-bold text-slate-600"> / night</span>
            </p>
            <div className="mt-6 grid gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-coral px-5 font-bold text-white transition hover:bg-[#cf4e43]"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Book on WhatsApp
              </a>
              <a
                href={`${emailHref}?subject=${encodeURIComponent(`Booking request: ${property.title}`)}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 font-bold text-ink transition hover:border-palm hover:text-palm"
              >
                <Mail className="h-5 w-5" aria-hidden="true" />
                Email to Book
              </a>
            </div>
          </aside>
        </section>
      </article>
    </main>
  );
}
