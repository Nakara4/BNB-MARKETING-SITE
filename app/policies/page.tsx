import type { Metadata } from "next";
import Link from "next/link";
import { Ban, CalendarClock, CreditCard, PawPrint, PartyPopper } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { StructuredData } from "@/components/structured-data";
import { pageStructuredData, staticPageMetadata } from "@/lib/seo";

const title = "Guest Policies at Harlequin Diani";
const description = "Review Harlequin Diani check-in and checkout times, house rules, pet policy, and booking-specific cancellation and payment terms.";

export const metadata: Metadata = staticPageMetadata({
  title,
  description,
  path: "/policies"
});

const policies = [
  {
    title: "Check-in and checkout",
    description: "Check-in is from 15:00 to 18:00. Checkout is from 08:00 to 11:00. Tell the team your expected arrival time in advance.",
    icon: CalendarClock
  },
  {
    title: "No smoking",
    description: "Smoking is not permitted inside the apartments. Ask the team about any designated outdoor area.",
    icon: Ban
  },
  {
    title: "No parties or events",
    description: "Parties and disruptive events are not permitted. Guests are expected to respect neighbours and the residential setting.",
    icon: PartyPopper
  },
  {
    title: "No pets",
    description: "Pets are not accepted at the property unless a future listing explicitly states otherwise.",
    icon: PawPrint
  },
  {
    title: "Cancellation and payment",
    description: "Cancellation, prepayment, and payment terms depend on the selected stay and booking channel. Confirm the applicable terms before completing a booking.",
    icon: CreditCard
  }
];

export default function PoliciesPage() {
  return (
    <>
      <StructuredData data={pageStructuredData({ title, description, path: "/policies", type: "WebPage" })} />
      <SiteHeader variant="solid" />
      <main>
        <section className="bg-white py-14 sm:py-20" aria-labelledby="policies-title">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-palm">Guest information</p>
            <h1 id="policies-title" className="mt-2 max-w-4xl text-4xl font-black leading-tight text-ink sm:text-6xl">
              Clear expectations for a comfortable stay.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
          </div>
        </section>

        <section className="bg-mist py-14 sm:py-20" aria-labelledby="house-rules">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <h2 id="house-rules" className="text-3xl font-black text-ink sm:text-4xl">Policies and house rules</h2>
            <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
              {policies.map((policy) => {
                const Icon = policy.icon;
                return (
                  <article key={policy.title} className="grid gap-4 py-7 sm:grid-cols-[48px_1fr]">
                    <div className="grid h-12 w-12 place-items-center rounded-md bg-white">
                      <Icon className="h-6 w-6 text-coral" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-ink">{policy.title}</h3>
                      <p className="mt-2 leading-7 text-slate-600">{policy.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20" aria-labelledby="confirm-terms">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 sm:px-8 lg:flex-row lg:items-center">
            <div>
              <h2 id="confirm-terms" className="text-3xl font-black text-ink">Confirm the terms for your stay.</h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-600">The team can clarify availability, arrival details, and booking-channel terms before you commit.</p>
            </div>
            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-md bg-coral px-5 font-bold text-white transition hover:bg-[#cf4e43]">Contact Harlequin Diani</Link>
          </div>
        </section>
      </main>
    </>
  );
}
