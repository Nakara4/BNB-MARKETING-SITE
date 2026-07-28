import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { GoogleMapEmbed } from "@/components/google-map-embed";
import { contactDetails, siteName } from "@/lib/seo";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white" aria-labelledby="contact-heading">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <section>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Contact</p>
          <h2 id="contact-heading" className="mt-2 text-3xl font-black">
            {siteName}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/75">
            Direct contact for stays, availability, and local arrival guidance.
          </p>

          <address className="mt-7 grid gap-4 not-italic">
            <a
              href={`tel:${contactDetails.phone}`}
              aria-label={`Call ${siteName} at ${contactDetails.phone}`}
              className="group flex items-center gap-3 text-sm font-bold text-white transition hover:text-coral"
            >
              <Phone className="h-5 w-5 text-coral" aria-hidden="true" />
              <span>{contactDetails.phone}</span>
            </a>
            <a
              href={`mailto:${contactDetails.email}`}
              aria-label={`Email ${siteName} at ${contactDetails.email}`}
              className="group flex items-center gap-3 text-sm font-bold text-white transition hover:text-coral"
            >
              <Mail className="h-5 w-5 text-coral" aria-hidden="true" />
              <span>{contactDetails.email}</span>
            </a>
            <p className="flex items-start gap-3 text-sm font-bold text-white">
              <MapPin className="mt-0.5 h-5 w-5 flex-none text-coral" aria-hidden="true" />
              <span>{contactDetails.address}</span>
            </p>
            <p className="flex items-center gap-3 text-sm font-bold text-white">
              <Building2 className="h-5 w-5 flex-none text-coral" aria-hidden="true" />
              <span>{siteName}</span>
            </p>
          </address>
        </section>

        <section aria-label={`${siteName} map`}>
          <GoogleMapEmbed embedUrl={process.env.NEXT_PUBLIC_GOOGLE_MAP_EMBED_URL} />
        </section>
      </div>
    </footer>
  );
}
