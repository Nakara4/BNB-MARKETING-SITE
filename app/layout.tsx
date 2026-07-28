import type { Metadata } from "next";
import "./globals.css";
import { BusinessStructuredData } from "@/components/business-structured-data";
import { SiteFooter } from "@/components/site-footer";
import { siteName, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  other: {
    "google-site-verification": "-Bekxg88Twwc3j0t1Og89nZ0NiiRKBRMfOByhubFNns"
  },
  title: {
    default: `${siteName} | Diani Apartments and Curated Stays`,
    template: `%s | ${siteName}`
  },
  description:
    "Book Harlequin Diani near Umoja, Diani Beach, and Ukunda Airport, plus curated short-stay apartments in Kenya.",
  openGraph: {
    title: `${siteName} | Diani Apartments and Curated Stays`,
    description:
      "Book Harlequin Diani near Umoja, Diani Beach, and Ukunda Airport, plus curated short-stay apartments in Kenya.",
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
      <body className="antialiased">
        <BusinessStructuredData />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
