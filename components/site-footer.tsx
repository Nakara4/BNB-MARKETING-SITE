import Link from "next/link";
import { Building2, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { GoogleMapEmbed } from "@/components/google-map-embed";
import { contactDetails, siteName, socialProfiles } from "@/lib/seo";

const footerNavigation = [
  { label: "Home", href: "/" },
  { label: "Stays", href: "/#stays" },
  { label: "Diani Guide", href: "/diani-beach-guide" },
  { label: "About", href: "/about" },
  { label: "Policies", href: "/policies" },
  { label: "Contact", href: "/contact" }
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white" aria-labelledby="contact-heading">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.8fr_0.55fr_1fr] lg:items-start">
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

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
            {socialProfiles.map((profile) => (
              <a
                key={profile.name}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow ${siteName} on ${profile.name}`}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-white/75 transition hover:text-coral"
              >
                {profile.name}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <nav aria-label="Footer navigation">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Explore</p>
          <div className="mt-5 grid gap-3">
            {footerNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-bold text-white/75 transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <section aria-label={`${siteName} map`}>
          <GoogleMapEmbed embedUrl={process.env.NEXT_PUBLIC_GOOGLE_MAP_EMBED_URL} />
        </section>
      </div>
    </footer>
  );
}
