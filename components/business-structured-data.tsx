import { businessStructuredData } from "@/lib/seo";

export function BusinessStructuredData() {
  const structuredData = JSON.stringify(businessStructuredData()).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />;
}
