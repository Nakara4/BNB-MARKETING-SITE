import type { Metadata } from "next";
import { ExternalLink, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { GoogleMapEmbed } from "@/components/google-map-embed";
import { SiteHeader } from "@/components/site-header";
import { StructuredData } from "@/components/structured-data";
import {
  contactDetails,
  directoryProfiles,
  pageStructuredData,
  siteName,
  socialProfiles,
  staticPageMetadata
} from "@/lib/seo";

const title = "Contact Harlequin Diani";
const description = "Call, email, or message Harlequin Diani for apartment availability, booking support, directions, and arrival guidance in Diani Beach.";

export const metadata: Metadata = staticPageMetadata({
  title,
  description,
  path: "/contact"
});

const whatsappMessage = encodeURIComponent("Hello! I would like to ask about availability at Harlequin Diani.");

export default function ContactPage() {
  return (
    <>
      <StructuredData data={pageStructuredData({ title, description, path: "/contact", type: "ContactPage" })} />
      <SiteHeader variant="solid" />
      <main>
        <section className="bg-white py-14 sm:py-20" aria-labelledby="contact-title">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-palm">Contact</p>
            <h1 id="contact-title" className="mt-2 max-w-4xl text-4xl font-black leading-tight text-ink sm:text-6xl">
              Talk directly with the Harlequin Diani team.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
          </div>
        </section>

        <section className="bg-mist py-14 sm:py-20" aria-labelledby="direct-contact">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <h2 id="direct-contact" className="text-3xl font-black text-ink sm:text-4xl">
              Direct contact
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <a
                href={`tel:${contactDetails.phone}`}
                aria-label={`Call ${siteName} at ${contactDetails.phone}`}
                className="rounded-lg border border-slate-200 bg-white p-6 transition hover:border-palm"
              >
                <Phone className="h-6 w-6 text-coral" aria-hidden="true" />
                <h3 className="mt-4 text-xl font-black text-ink">Call</h3>
                <p className="mt-2 font-bold text-palm">{contactDetails.phone}</p>
              </a>
              <a
                href={`mailto:${contactDetails.email}`}
                aria-label={`Email ${siteName} at ${contactDetails.email}`}
                className="rounded-lg border border-slate-200 bg-white p-6 transition hover:border-palm"
              >
                <Mail className="h-6 w-6 text-coral" aria-hidden="true" />
                <h3 className="mt-4 text-xl font-black text-ink">Email</h3>
                <p className="mt-2 break-all font-bold text-palm">{contactDetails.email}</p>
              </a>
              <a
                href={`${contactDetails.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Message ${siteName} on WhatsApp`}
                className="rounded-lg border border-slate-200 bg-white p-6 transition hover:border-palm"
              >
                <MessageCircle className="h-6 w-6 text-coral" aria-hidden="true" />
                <h3 className="mt-4 text-xl font-black text-ink">WhatsApp</h3>
                <p className="mt-2 font-bold text-palm">Ask about availability</p>
              </a>
            </div>
            <p className="mt-8 flex items-start gap-3 text-base font-bold text-slate-700">
              <MapPin className="mt-0.5 h-5 w-5 flex-none text-coral" aria-hidden="true" />
              {contactDetails.address}
            </p>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20" aria-labelledby="online-profiles">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-palm">Social media</p>
              <h2 id="online-profiles" className="mt-2 text-3xl font-black text-ink sm:text-4xl">
                Follow Harlequin Diani
              </h2>
              <div className="mt-7 grid gap-3">
                {socialProfiles.map((profile) => (
                  <a
                    key={profile.name}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${siteName} on ${profile.name}`}
                    className="flex min-h-14 items-center justify-between border-b border-slate-200 py-3 font-bold text-ink transition hover:text-palm"
                  >
                    {profile.name}
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-palm">Verified listings</p>
              <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Find us elsewhere</h2>
              <div className="mt-7 grid gap-3">
                {directoryProfiles.map((profile) => (
                  <a
                    key={profile.name}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${siteName} on ${profile.name}`}
                    className="flex min-h-14 items-center justify-between border-b border-slate-200 py-3 font-bold text-ink transition hover:text-palm"
                  >
                    {profile.name}
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-ink py-14 sm:py-20" aria-labelledby="map-heading">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.65fr_1.35fr] lg:items-center">
            <div className="text-white">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Location</p>
              <h2 id="map-heading" className="mt-2 text-3xl font-black sm:text-4xl">
                Harlequin Diani in Diani Beach
              </h2>
              <p className="mt-4 leading-7 text-white/75">Use the map for route planning and confirm arrival guidance with the team before check-in.</p>
            </div>
            <GoogleMapEmbed embedUrl={process.env.NEXT_PUBLIC_GOOGLE_MAP_EMBED_URL} />
          </div>
        </section>
      </main>
    </>
  );
}
