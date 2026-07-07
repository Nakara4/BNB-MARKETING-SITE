# Project Roadmap

Last updated: July 7, 2026

This roadmap keeps the project moving in realistic phases. Each phase should be
completed, tested, and documented before the next phase begins.

## Phase 0: Harlequin Diani Brand Release

Estimated time: same day

Goal: Ship the public brand pivot from generic "Staycation Homes" to Harlequin
Diani without destabilizing the admin or database workflows.

Scope:

- Update public brand name to Harlequin Diani.
- Rework the homepage around Harlequin Diani as the flagship stay.
- Keep the listed-properties section for future Diani, Nairobi, and partner
  units.
- Add clear Diani location copy: about 1.2 km to Diani Beach by footpath, about
  4 km by vehicle route, near Umoja, close to Ukunda, Diani Beach Road, and
  Ukunda Airport.
- Confirm production Vercel environment variables before merging to `main`.
- Run `npm run build`.

Exit criteria:

- Homepage clearly presents Harlequin Diani as the primary product.
- Existing property listings still load from MongoDB.
- Production variables are correct for `harlequindiani.com`.
- `npm run build` passes.

## Phase 1: Stabilize The MVP

Estimated time: 1-2 focused days

Goal: Make the current app reliable enough to keep adding real properties.

Scope:

- Confirm MongoDB Atlas development database connectivity.
- Confirm Cloudinary uploads from the admin dashboard.
- Test add, edit, delete, and image removal workflows end to end.
- Set the best Harlequin Diani building photo as the first image on a Diani
  listing so it powers the homepage hero.
- Replace generic fallback property images with an intentional empty-image UI.
- Improve admin success and error messages.
- Document the exact local setup and recovery steps.

Exit criteria:

- A new property can be created with real images.
- The property appears on the home page and detail page.
- The property can be edited and deleted.
- Failed database or upload states show clear messages.
- `npm run build` passes.

## Phase 2: Improve Property Content And Conversion

Estimated time: 3-5 focused days

Goal: Make listings more persuasive and useful for guests.

Scope:

- Add bedrooms, bathrooms, guest capacity, amenities, and property type.
- Update MongoDB types and admin forms for the new fields.
- Update property cards and detail pages to show the new fields.
- Improve the gallery layout for mobile and desktop.
- Add a clearer booking panel with WhatsApp and email actions.
- Add FAQs, house rules, location guidance, and check-in notes.
- Add stronger location-focused page copy and headings.

Exit criteria:

- Every listing can show the details guests expect before booking.
- Admin can edit all new fields without code changes.
- Public pages remain responsive and readable on mobile.

## Phase 3: SEO And Launch Foundations

Estimated time: 2-4 focused days

Goal: Prepare the site for indexing and sharing.

Scope:

- Add `app/sitemap.ts`.
- Add `app/robots.ts`.
- Confirm canonical URLs use `https://harlequindiani.com`.
- Add Open Graph image handling for properties with uploaded images.
- Add structured data for lodging/business listings where appropriate.
- Review page headings and metadata for location-based search terms.
- Standardize Harlequin Diani location wording across OTAs and Google Business
  Profile.

Exit criteria:

- Property pages have unique titles, descriptions, canonical URLs, and images.
- Sitemap lists the home page and every active property.
- Robots rules are production-safe.
- `NEXT_PUBLIC_SITE_URL` is correct in Vercel.

## Phase 4: Security, Testing, And Deployment

Estimated time: 3-5 focused days

Goal: Make the project safer to operate publicly.

Scope:

- Add automated tests for property APIs and auth behavior.
- Add rate limiting or request protection to admin login and upload routes.
- Improve admin auth beyond a simple shared password if needed.
- Configure Vercel preview deployment for `development`.
- Configure production deployment from `main`.
- Confirm environment variables are separated between preview and production.

Exit criteria:

- Tests cover core admin and public data behavior.
- Preview deployment works without production data risk.
- Production deployment checklist is repeatable.

## Phase 5: Growth Enhancements

Estimated time: ongoing after launch

Goal: Improve conversion, operations, and insight after the site is live.

Scope:

- Add analytics and booking conversion tracking.
- Add featured listings or curated location sections.
- Add availability notes or calendar integration if needed.
- Add Cloudinary asset deletion when images are removed permanently.
- Add inquiry logging if WhatsApp/email alone becomes hard to track.
- Add owner/co-hosting page when the business starts onboarding other units.
- Add testimonials and review highlights from Google Business Profile and OTAs.

Exit criteria:

- Improvements are guided by real guest behavior and owner workflow needs.
