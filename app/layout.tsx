import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { initializeIndexes } from "@/lib/db";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Harlequin Diani | Serviced Apartments in Ukunda",
  description: "Book quiet furnished apartments near Diani Beach, Umoja, Ukunda. Direct WhatsApp booking."
};

// Initialize database indexes once on server startup
if (process.env.NODE_ENV !== "test") {
  initializeIndexes().catch((error) => {
    console.error("Database initialization error:", error);
  });
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
