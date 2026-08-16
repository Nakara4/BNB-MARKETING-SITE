import type { Metadata } from "next";
import Link from "next/link";
import { Car, MapPin, MessageCircle, Plane, Waves } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { StructuredData } from "@/components/structured-data";
import { directoryProfiles, pageStructuredData, staticPageMetadata } from "@/lib/seo";

const title = "Diani Beach Guide for Harlequin Diani Guests";
const description = "Plan a stay at Harlequin Diani with clear answers about the beach route, Umoja landmark, Ukunda Airport access, local transport, unit types, and booking.";
const reviewedDate = "2026-08-16";

export const metadata: Metadata = staticPageMetadata({
  title,
  description,
  path: "/diani-beach-guide"
});

const quickAnswers = [
  {
    question: "How far is Harlequin Diani from Diani Beach?",
    answer: "The beach is approximately 1.2 km away using the local footpath. The vehicle route is approximately 2 km and may vary with the chosen road.",
    icon: Waves
  },
  {
    question: "What landmark should drivers use?",
    answer: "Umoja is the most useful nearby landmark when giving directions to taxi, tuk-tuk, or boda boda drivers.",
    icon: MapPin
  },
  {
    question: "How do guests arrive from Ukunda Airport?",
    answer: "Harlequin Diani is accessible by road from Ukunda Airport. Journey time depends on traffic and route choice, so confirm current arrival guidance before travelling.",
    icon: Plane
  },
  {
    question: "Which local transport options are available?",
    answer: "Taxis, tuk-tuks, and boda bodas commonly serve the Diani and Ukunda area. Ask the team for practical route guidance before setting out.",
    icon: Car
  },
  {
    question: "What accommodation can I book?",
    answer: "The flagship property offers furnished studio and one-bedroom apartments. Current availability and the exact features of each unit are shown on its listing page.",
    icon: Waves
  },
  {
    question: "How do I confirm a booking?",
    answer: "Choose a listed stay, then contact the Harlequin Diani team directly on WhatsApp or email to confirm availability and booking details.",
    icon: MessageCircle
  }
];

const googleMapsProfile = directoryProfiles.find((profile) => profile.name === "Google Maps");

export default function DianiBeachGuidePage() {
  return (
    <>
      <StructuredData
        data={pageStructuredData({
          title,
          description,
          path: "/diani-beach-guide",
          type: "WebPage",
          dateModified: reviewedDate
        })}
      />
      <SiteHeader variant="solid" />
      <main>
        <article>
          <header className="bg-white py-14 sm:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-palm">Local guide</p>
              <h1 className="mt-2 max-w-5xl text-4xl font-black leading-tight text-ink sm:text-6xl">Useful answers for planning a Harlequin Diani stay.</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
              <p className="mt-5 text-sm font-bold text-slate-500">
                Reviewed by the Harlequin Diani team on <time dateTime={reviewedDate}>August 16, 2026</time>.
              </p>
            </div>
          </header>

          <section className="bg-mist py-14 sm:py-20" aria-labelledby="guide-answers">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
              <h2 id="guide-answers" className="text-3xl font-black text-ink sm:text-4xl">Quick answers</h2>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {quickAnswers.map((item) => {
                  const Icon = item.icon;
                  return (
                    <section key={item.question} className="rounded-lg border border-slate-200 bg-white p-6">
                      <Icon className="h-6 w-6 text-coral" aria-hidden="true" />
                      <h3 className="mt-4 text-xl font-black text-ink">{item.question}</h3>
                      <p className="mt-3 leading-7 text-slate-600">{item.answer}</p>
                    </section>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="bg-white py-14 sm:py-20" aria-labelledby="route-planning">
            <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-palm">Route planning</p>
                <h2 id="route-planning" className="mt-2 text-3xl font-black text-ink sm:text-4xl">Confirm the route before arrival.</h2>
                <p className="mt-4 max-w-2xl leading-7 text-slate-600">Footpaths, traffic, and road choices can change. Use the current map listing and contact the team for the most practical arrival instructions.</p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                {googleMapsProfile ? (
                  <a href={googleMapsProfile.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-md border border-slate-300 px-5 font-bold text-ink transition hover:border-palm hover:text-palm">
                    Open Google Maps
                  </a>
                ) : null}
                <Link href="/contact" className="inline-flex min-h-12 items-center rounded-md bg-coral px-5 font-bold text-white transition hover:bg-[#cf4e43]">Contact the team</Link>
              </div>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
