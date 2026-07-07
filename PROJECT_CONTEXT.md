# Project Context

Last updated: July 7, 2026

## Purpose

This project is the owned website for Harlequin Diani. Harlequin Diani should be
the main public brand and flagship stay, while the site remains flexible enough
to list selected apartments and short-stay homes in Diani, Nairobi, and other
Kenya locations later.

Guests should be able to browse properties by location, view persuasive property
detail pages, and contact the host through WhatsApp or email. The owner should
be able to manage properties and photos without editing code.

## Current Codebase Reality

The project is already a working Next.js application, not just a concept.

- Framework: Next.js 15.5.19 with App Router
- UI: React 19.2.7, TypeScript, Tailwind CSS
- Database: MongoDB Atlas through the official `mongodb` driver
- Image hosting: Cloudinary through the official `cloudinary` package
- Deployment target: Vercel
- Current branch: `development`

The code currently includes:

- Harlequin Diani homepage with flagship positioning
- Location copy for Diani Beach, Umoja, Ukunda Airport, and direct booking
- Public home page with location search and property grid
- Dynamic property pages at `/property/[slug]`
- Unique metadata for property pages through the Next.js Metadata API
- Password-protected `/admin` page
- Admin login/logout API routes
- Property create, edit, delete API routes
- Cloudinary image upload API route
- MongoDB-backed property persistence
- Development database separation with `MONGODB_DB_NAME`
- MongoDB connectivity warnings instead of hard page crashes
- Cloudinary URL normalization and upload validation
- WhatsApp booking links with normalized phone handling
- Google site verification metadata

## Important Product Direction

Harlequin Diani should stay as the public brand because the domain,
`harlequindiani.com`, Google Business Profile, pin location, Booking.com
presence, and OTA listings already point in that direction.

The homepage should lead with Harlequin Diani, not a generic staycation brand.
The existing listed-properties section should remain because the business may
later include Jamhuri/Nairobi units and other managed or marketed properties.

Recommended public positioning:

`Harlequin Diani: quiet serviced apartments near Umoja, with footpath access
toward Diani Beach and selected short-stay homes in Kenya.`

## Important Corrections To Older Chat Context

Any older plan that assumes the codebase is still unbuilt is outdated. The MVP
exists and should now be improved in phases rather than restarted.

Any older plan that brands the public website as "Staycation Homes" is outdated.
The active public brand is Harlequin Diani.

The project should not switch to a CMS, relational database, or separate backend
unless there is a clear business reason later. The current stack is appropriate
for the first production launch.

## Current Data Model

The active property model currently supports:

- `title`
- `slug`
- `price`
- `location`
- `description`
- `images`
- `createdAt`
- `updatedAt`

The model does not yet support:

- amenities
- bedrooms
- bathrooms
- guest capacity
- property type
- availability calendar
- featured property flag
- exact address or map coordinates
- SEO override fields

Those additions should be introduced carefully because they affect MongoDB
documents, admin forms, public cards, property pages, and SEO copy.

## Environment Variables

Required:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/harlequin_diani?retryWrites=true&w=majority
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
ADMIN_PASSWORD=replace-with-a-strong-password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BOOKING_WHATSAPP=https://wa.me/254700000000
NEXT_PUBLIC_BOOKING_EMAIL=mailto:hello@example.com
NEXT_PUBLIC_HERO_IMAGE_URL=https://res.cloudinary.com/cloud-name/image/upload/example/harlequin-diani-hero.jpg
FEATURED_PROPERTY_SLUGS=harlequin-diani-studio,harlequin-diani-one-bedroom,harlequin-diani-one-bedroom-2
```

Development-only:

```env
MONGODB_DB_NAME=harlequin_diani_dev
```

Production should normally use the database from `MONGODB_URI` and should not
point to the development database.

Production Vercel should set:

```env
NEXT_PUBLIC_SITE_URL=https://harlequindiani.com
```

Production can also set `FEATURED_PROPERTY_SLUGS` as a comma-separated list of
the property slugs that should always appear first. Use the real slugs from the
admin dashboard.

Production can set `NEXT_PUBLIC_HERO_IMAGE_URL` to force the homepage hero to a
specific uploaded image. If it is empty, the homepage uses the first image on
the flagship Diani listing and then falls back to a generic beach image.

## Current Risks

- Production environment variables must be confirmed before merging to `main`.
- Admin authentication is password-cookie based and should be hardened before a
  serious public launch.
- There are no automated tests yet.
- Public pages still use fallback Unsplash property imagery when a listing has
  no images or the database is unavailable.
- Featured listing order depends on correct slugs in `FEATURED_PROPERTY_SLUGS`;
  the fallback still prioritizes Harlequin/Diani text matches.
- Image deletion removes URLs from MongoDB but does not yet delete assets from
  Cloudinary.
- Property fields are still minimal for high-converting stay pages.
- No analytics, conversion tracking, sitemap, or robots configuration is in
  place yet.

## Listing Accuracy Notes

Use consistent public location language across the website and OTAs:

- Harlequin Diani is near Umoja.
- Diani Beach is about 1.2 km away by footpath.
- The vehicle route to Diani Beach is about 4 km.
- Diani Beach Road and Ukunda town are nearby.
- Ukunda Airport is a short drive away, but public copy should avoid exact road
  time unless verified in Google Maps at the time of publishing.
- The area is quiet and residential.
- Guests arriving late should use taxi, tuk-tuk, or boda boda instead of walking.

## Next Best Course Of Action

Do not rebuild. Continue from the existing MVP in practical phases:

1. Confirm production environment variables and deploy the Harlequin Diani
   homepage update.
2. Stabilize the current admin, database, and upload workflow.
3. Improve the property content model and public conversion experience.
4. Add SEO infrastructure and launch readiness checks.
5. Harden security, testing, and deployment workflow.
6. Add growth features after production is reliable.

Use `ROADMAP.md`, `TASKS.md`, `RELEASE_CHECKLIST.md`, and `DECISIONS.md` to keep
work organized.
