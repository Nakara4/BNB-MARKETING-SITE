import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const baseUrl = siteUrl.replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api"]
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
