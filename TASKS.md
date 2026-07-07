# Task Board

Last updated: July 7, 2026

Use this file as the working board. Move tasks between sections as progress is
made. Keep tasks small enough to finish in one sitting where possible.

## Now

- [ ] Confirm Vercel production has `NEXT_PUBLIC_SITE_URL=https://harlequindiani.com`.
- [ ] Confirm Vercel production has the real booking WhatsApp and email values.
- [ ] Confirm Vercel production has working `MONGODB_URI`, `CLOUDINARY_URL`, and `ADMIN_PASSWORD`.
- [ ] Confirm Vercel production has `NEXT_PUBLIC_HERO_IMAGE_URL` if a specific hero photo should be forced.
- [ ] Confirm Vercel production has `FEATURED_PROPERTY_SLUGS` with the three Harlequin Diani listing slugs.
- [ ] Review the homepage on desktop and mobile before merging to `main`.
- [ ] Set the best Harlequin Diani building photo as the first image on the main Diani listing.
- [ ] Confirm `.env.local` and `.env.development.local` are set correctly.
- [ ] Confirm the app can connect to the development Atlas database.

## Next

- [ ] Test Cloudinary image upload from `/admin`.
- [ ] Create, edit, and delete a test property end to end.
- [ ] Standardize Harlequin Diani location wording on Booking.com, Vrbo/Expedia, and Google Business Profile.
- [ ] Confirm the best public wording for Ukunda Airport distance after checking the pin in Google Maps.
- [ ] Add property fields: bedrooms, bathrooms, guest capacity, amenities, and property type.
- [ ] Update MongoDB types and admin form handling for the new fields.
- [ ] Update public property cards to show key guest details.
- [ ] Update property detail pages with amenity and capacity sections.
## Later

- [ ] Add basic API/auth tests.
- [ ] Add stronger admin authentication or a real auth provider.
- [ ] Add rate limiting to admin login and upload routes.
- [ ] Delete unused Cloudinary assets when images are permanently removed.
- [ ] Add analytics and conversion tracking.
- [ ] Add testimonials, FAQs, house rules, and cancellation policy sections.
- [ ] Add owner/co-hosting page for future property partners.
- [ ] Add availability/calendar support if manual WhatsApp booking becomes too slow.
- [ ] Replace fallback property card/detail images with an intentional empty image state.
- [ ] Improve admin upload and save feedback messages.

## Blocked Or Needs Decision

- [ ] Confirm final public booking WhatsApp number.
- [ ] Confirm final public booking email.
- [ ] Confirm whether prices should be shown as KSh only or support multiple currencies.
- [ ] Confirm whether each property needs a precise map/address or only a public location.
- [ ] Confirm whether booking should remain WhatsApp/email or move toward a booking form.

## Done

- [x] Build initial Next.js App Router application.
- [x] Add MongoDB-backed property storage.
- [x] Add Cloudinary image upload route.
- [x] Add password-protected admin dashboard.
- [x] Add public home and property detail pages.
- [x] Add property-level SEO metadata.
- [x] Add development database selection with `MONGODB_DB_NAME`.
- [x] Add clearer MongoDB connection warnings.
- [x] Add Cloudinary upload validation and JSON error handling.
- [x] Rebrand public site metadata from Staycation Homes to Harlequin Diani.
- [x] Add Harlequin Diani browser/bookmark icon.
- [x] Add configurable homepage hero image URL.
- [x] Add dynamic sitemap at `/sitemap.xml`.
- [x] Add robots rules at `/robots.txt`.
- [x] Rework homepage around Harlequin Diani as the flagship property.
- [x] Keep listed-properties section for Diani, Nairobi, and future curated stays.
- [x] Add featured listing order so Harlequin Diani stays remain above newer non-Harlequin listings.
- [x] Add homepage location guidance for Diani Beach, Umoja, Ukunda, and Ukunda Airport.
- [x] Clarify Diani Beach distance as about 1.2 km by footpath and about 4 km by vehicle route.
