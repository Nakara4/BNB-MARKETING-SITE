import type { Metadata } from "next";
import Image from "next/image";
import { HeartHandshake, MapPinned, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { StructuredData } from "@/components/structured-data";
import { pageStructuredData, siteImageUrl, staticPageMetadata } from "@/lib/seo";

const title = "About Harlequin Diani";
const description = "Meet Harlequin Diani, an independent, locally managed hospitality brand offering serviced apartments and responsive guest support near Diani Beach.";

export const metadata: Metadata = staticPageMetadata({
  title,
  description,
  path: "/about"
});

const principles = [
  {
    title: "Local knowledge",
    description: "Practical arrival guidance and recommendations shaped by day-to-day experience in Diani and Ukunda.",
    icon: MapPinned
  },
  {
    title: "Straightforward hosting",
    description: "Clear communication about availability, location, pricing, and what guests can expect from each stay.",
    icon: ShieldCheck
  },
  {
    title: "Responsive support",
    description: "Direct access to the Harlequin Diani team before arrival and throughout the guest stay.",
    icon: HeartHandshake
  }
];

export default function AboutPage() {
  return (
    <>
      <StructuredData data={pageStructuredData({ title, description, path: "/about", type: "AboutPage" })} />
      <SiteHeader variant="solid" />
      <main>
        <section className="bg-white py-14 sm:py-20" aria-labelledby="about-title">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-palm">About</p>
            <h1 id="about-title" className="mt-2 max-w-4xl text-4xl font-black leading-tight text-ink sm:text-6xl">
              A locally managed base for stays in Diani.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
          </div>
        </section>

        <section className="bg-mist py-14 sm:py-20" aria-labelledby="our-story">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-200">
              <Image src={siteImageUrl} alt="Harlequin Diani and the surrounding Diani Beach setting" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-palm">Our story</p>
              <h2 id="our-story" className="mt-2 text-3xl font-black text-ink sm:text-4xl">
                Harlequin Diani is growing with a clear guest promise.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                The brand began with furnished studio and one-bedroom apartments near Diani Beach. It is being developed as an independent hospitality platform that can also introduce guests to carefully selected stays elsewhere in Kenya.
              </p>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                The focus remains practical: clean spaces, useful local guidance, direct booking support, and honest information that helps guests choose the right stay.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-20" aria-labelledby="hosting-approach">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-palm">Hosting approach</p>
            <h2 id="hosting-approach" className="mt-2 text-3xl font-black text-ink sm:text-4xl">
              Trust is built through useful details and reliable care.
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {principles.map((principle) => {
                const Icon = principle.icon;
                return (
                  <article key={principle.title} className="rounded-lg border border-slate-200 bg-mist p-6">
                    <Icon className="h-6 w-6 text-coral" aria-hidden="true" />
                    <h3 className="mt-4 text-xl font-black text-ink">{principle.title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{principle.description}</p>
                  </article>
                );
              })}
            </div>
            <p className="mt-10 text-sm font-bold text-slate-500">Prepared by the Harlequin Diani team.</p>
          </div>
        </section>
      </main>
    </>
  );
}
