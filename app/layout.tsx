import type { Metadata } from "next";
import "./globals.css";
import { siteName, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Curated Staycation Homes`,
    template: `%s | ${siteName}`
  },
  description: "Browse beautiful staycation homes by location, compare prices, and book directly with the host.",
  openGraph: {
    title: `${siteName} | Curated Staycation Homes`,
    description: "Browse beautiful staycation homes by location, compare prices, and book directly with the host.",
    siteName,
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
