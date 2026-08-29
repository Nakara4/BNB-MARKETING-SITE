"use client";

import { useSearchParams } from "next/navigation";
import { PropertyGrid } from "@/components/property-grid";
import type { Property } from "@/lib/types";

export function PropertyResults({
  properties,
  databaseError
}: {
  properties: Property[];
  databaseError?: string;
}) {
  const searchParams = useSearchParams();
  const location = searchParams.get("location")?.trim() || "";
  const normalizedLocation = location.toLowerCase();
  const filteredProperties = normalizedLocation
    ? properties.filter((property) => property.location.toLowerCase().includes(normalizedLocation))
    : properties;

  return <PropertyGrid properties={filteredProperties} location={location} databaseError={databaseError} />;
}
