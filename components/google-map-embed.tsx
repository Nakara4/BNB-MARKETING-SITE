import { MapPin } from "lucide-react";
import { contactDetails, siteName } from "@/lib/seo";

type GoogleMapEmbedProps = {
  embedUrl?: string;
};

export function GoogleMapEmbed({ embedUrl }: GoogleMapEmbedProps) {
  const normalizedEmbedUrl = embedUrl?.trim();

  if (!normalizedEmbedUrl) {
    return (
      <div
        aria-label={`${siteName} location`}
        className="flex aspect-video items-center justify-center rounded-lg border border-white/15 bg-white/5 p-6 text-center"
      >
        <div>
          <MapPin className="mx-auto h-7 w-7 text-coral" aria-hidden="true" />
          <p className="mt-3 text-sm font-bold text-white">{contactDetails.address}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video overflow-hidden rounded-lg border border-white/15 bg-white/5">
      <iframe
        src={normalizedEmbedUrl}
        title={`Map showing ${siteName} in Diani Beach`}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
      />
    </div>
  );
}
