# Decisions Log

Last updated: July 7, 2026

Record decisions here when they affect architecture, data, workflow, deployment,
or product direction.

## 2026-07-02: Continue With The Existing MVP

Decision: Continue improving the current Next.js/MongoDB/Cloudinary app instead
of rebuilding from scratch.

Reason: The core app already exists and supports public browsing, property
details, admin CRUD, image uploads, and SEO metadata. The next value is
stabilization and richer property data.

## 2026-07-02: Use Phased Delivery

Decision: Organize remaining work into stabilization, conversion/content, SEO,
security/deployment, and growth phases.

Reason: The project can easily become confusing if visual improvements, data
model changes, SEO work, and deployment hardening happen all at once.

## 2026-07-02: Keep MongoDB Atlas And Cloudinary For Launch

Decision: Keep MongoDB Atlas for property data and Cloudinary for uploaded
property images.

Reason: Both are already integrated and match the project needs. Replacing them
before launch would add risk without solving the current highest-priority
problems.

## 2026-07-02: Separate Development Data

Decision: Use `MONGODB_DB_NAME=harlequin_diani_dev` or another development-only
database name for local/development work.

Reason: Development testing should not damage production property listings.

## 2026-07-02: Keep Booking As WhatsApp And Email For MVP

Decision: Keep booking action as direct WhatsApp/email contact for now.

Reason: It is fast to operate and easy for guests. A full booking engine should
only be added if manual handling becomes a clear bottleneck.

## 2026-07-07: Make Harlequin Diani The Public Brand

Decision: Use Harlequin Diani as the public website brand instead of generic
Staycation Homes.

Reason: The domain, Google Business Profile, pin location, Booking.com listing,
and OTA distribution already support Harlequin Diani. The brand is more
specific, more searchable, and more trustworthy for the immediate Diani launch.

## 2026-07-07: Keep A Listed-Properties Section

Decision: Keep the current property listing model and use the homepage to
feature Harlequin Diani while still showing selected stays.

Reason: Harlequin Diani is the flagship property, but the business should not
depend on one building forever. The listings section allows future Nairobi,
Diani, or partner properties without reworking the whole app.

## 2026-07-07: Use Public Location Copy Instead Of Exact Address

Decision: Public copy should describe Harlequin Diani as near Umoja, about 1.2
km from Diani Beach by footpath, about 4 km by vehicle route, close to Diani
Beach Road, Ukunda town, and Ukunda Airport.

Reason: This matches current public listing signals and gives guests useful
arrival context without exposing more address detail than necessary.

## 2026-07-07: Production Env Vars Gate The Main Merge

Decision: The development Atlas connection is important, but it does not have
to block a copy/branding deployment. The release should be blocked only if
production Vercel variables are missing or point to the wrong services.

Reason: The live website depends on production `MONGODB_URI`, `CLOUDINARY_URL`,
booking contact variables, and `NEXT_PUBLIC_SITE_URL`. A local dev connection
issue should not stop a safe content release if production is configured
correctly.

## 2026-07-07: Pin Harlequin Listings Above Newer Properties

Decision: Add a lightweight featured listing order using
`FEATURED_PROPERTY_SLUGS`, with a fallback that prioritizes Harlequin/Diani text
matches before newest-created ordering.

Reason: The business will add Nairobi and other non-Harlequin listings later,
but the first Harlequin Diani units should remain at the top of the homepage
because they are the flagship product.

## 2026-07-07: Generate Sitemap In Next.js

Decision: Use `app/sitemap.ts` and `app/robots.ts` instead of committing a
static downloaded sitemap file.

Reason: The sitemap should update as public property pages change, and private
routes such as `/admin` should not be submitted for indexing.
