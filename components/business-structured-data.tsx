import { StructuredData } from "@/components/structured-data";
import { businessStructuredData } from "@/lib/seo";

export function BusinessStructuredData() {
  return <StructuredData data={businessStructuredData()} />;
}
