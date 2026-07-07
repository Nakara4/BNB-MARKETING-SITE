# Harlequin Diani Project Tracker

Last updated: July 7, 2026

## Project Goal

Build and maintain a high-converting, SEO-friendly website for Harlequin Diani
as the flagship short-stay property, while keeping room to list selected
properties in Diani, Nairobi, and other Kenya locations later.

The website should support two business needs:

- Guest bookings for Harlequin Diani and other curated stays.
- Owner control over property details and photos without editing code.

## Current Status

The core application is implemented and runs on Next.js. The public site,
property pages, admin authentication, property CRUD, Cloudinary uploads, and
MongoDB integration are in place.

The public homepage has been repositioned from generic "Staycation Homes" to
"Harlequin Diani" as the main brand. It now presents Harlequin Diani as the
flagship stay, keeps the existing listed-properties section, and includes
location copy for Diani Beach, Umoja, Ukunda Airport, and direct WhatsApp booking.

Current development branch: `development`

Production branch: `main`

## Technology

- Next.js 15.5.19 with App Router
- React 19.2.7
- TypeScript
- Tailwind CSS
- MongoDB Atlas
- Cloudinary
- Vercel

## Application Structure

- `app/page.tsx`: Harlequin Diani homepage, location search, and property grid
- `app/property/[slug]/page.tsx`: dynamic property detail and booking page
- `app/admin/page.tsx`: password-protected administration page
- `app/api/admin/`: login, logout, property CRUD, and image upload APIs
- `components/site-header.tsx`: public header and in-page navigation
- `components/admin-dashboard.tsx`: property management interface
- `components/property-card.tsx`: listing card UI
- `lib/mongodb.ts`: MongoDB connection and database selection
- `lib/properties.ts`: property database operations
- `lib/cloudinary.ts`: Cloudinary image uploads
- `lib/auth.ts`: admin cookie authentication
- `lib/seo.ts`: brand name, site URL, and property metadata

## Planning Documents

- `PROJECT_CONTEXT.md`: current project reality and technical context
- `ROADMAP.md`: phased delivery plan
- `TASKS.md`: active task board
- `RELEASE_CHECKLIST.md`: verification checklist before launch or merge
- `DECISIONS.md`: record of important technical/product decisions

## Environment Setup

Secrets belong in `.env.local`, which is ignored by Git.

Required values:

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

Use `.env.example` as the safe template.

### Database Separation

- Production should use the production database in `MONGODB_URI`.
- Development should use a separate database such as `harlequin_diani_dev`.
- `.env.development.local` can set `MONGODB_DB_NAME=harlequin_diani_dev`.
- Do not add `MONGODB_DB_NAME=harlequin_diani_dev` to production Vercel variables.
- Do not test development changes against the production database.

### Production Vercel Variables

Before merging to `main`, confirm Vercel production has:

- `MONGODB_URI` pointing to the production Atlas database.
- `CLOUDINARY_URL` for the production Cloudinary account.
- `ADMIN_PASSWORD` set to a strong private password.
- `NEXT_PUBLIC_SITE_URL=https://harlequindiani.com`.
- `NEXT_PUBLIC_BOOKING_WHATSAPP` set to the real booking WhatsApp number.
- `NEXT_PUBLIC_BOOKING_EMAIL` set to the real booking email.
- `NEXT_PUBLIC_HERO_IMAGE_URL` set to the desired landing-page photo URL.
- `FEATURED_PROPERTY_SLUGS` set to the three Harlequin Diani property slugs in
  the order they should appear.

The development Atlas connection does not have to be completed before merging a
copy/branding-only release, but production must already have working database
and image environment variables if the live site should show real listings.

## Local Development

Install dependencies:

```bash
npm install
```

Start with a clean Next.js cache:

```bash
npm run dev:clean
```

Open:

- Public site: `http://localhost:3000`
- Admin dashboard: `http://localhost:3000/admin`

Production verification:

```bash
npm run build
```

## Git Workflow

1. Perform feature and bug-fix work on `development`.
2. Build and test changes locally.
3. Confirm production environment variables are ready.
4. Push commits to `origin/development`.
5. Merge `development` into `main` when the release checklist passes.
6. Push `main` so Vercel can deploy production.

Never commit `.env.local`, Cloudinary secrets, MongoDB credentials, or admin
passwords.

## Completed Features

- Responsive Harlequin Diani homepage
- Harlequin Diani browser/bookmark icon
- Configurable homepage hero image through `NEXT_PUBLIC_HERO_IMAGE_URL`
- Flagship-property positioning with listed-properties growth path
- Featured listing order for pinned Harlequin Diani properties
- Location copy for Diani Beach, Umoja, Ukunda Airport, and route differences
- Location-based property search
- Dynamic property detail pages
- Unique SEO metadata for each property
- Dynamic sitemap at `/sitemap.xml`
- Production robots rules at `/robots.txt`
- WhatsApp and email booking links
- Password-protected admin dashboard
- Add, edit, and delete property workflows
- Multiple image uploads through Cloudinary
- MongoDB-backed property storage
- Separate development database selection
- Graceful UI when MongoDB Atlas is unreachable
- Google site verification metadata
- Slug normalization for property detail pages
- WhatsApp booking link normalization
- Admin database connectivity warning state
- Cloudinary upload validation and clearer JSON error responses

## Known Issues

### MongoDB Atlas Connectivity

Local connections have timed out on port `27017` in previous testing. The
application displays a warning instead of crashing, but property data cannot
load until Atlas is reachable.

Check:

- The Atlas cluster is active.
- The current public IP is allowed under Atlas Network Access.
- The local network permits outbound traffic on port `27017`.
- `MONGODB_URI` contains valid credentials and the correct cluster hostname.

### Listing Content Consistency

Public OTA listings should use consistent location wording:

`Harlequin Diani is in a quiet residential area near Umoja, with a footpath to
Diani Beach of about 1.2 km and a vehicle route of about 4 km. It is also close
to Diani Beach Road, Ukunda town, shops, restaurants, transport, and Ukunda
Airport.`

### Cloudinary Configuration

Image uploads require a valid `CLOUDINARY_URL`. The application normalizes a
missing `cloudinary://` prefix, but the preferred value is:

```env
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

## Next Priorities

- Confirm production Vercel variables before merging to `main`.
- Confirm `FEATURED_PROPERTY_SLUGS` uses the real slugs for the three Harlequin
  Diani listings.
- Confirm live connectivity to the development Atlas database.
- Test add, edit, delete, and image upload workflows end to end.
- Set the best Harlequin Diani building photo as the first image on a Diani listing.
- Add property amenities, bedrooms, bathrooms, and guest capacity.
- Add loading, success, and error notifications to admin actions.
- Replace fallback property images with an intentional empty-image state.
- Add automated tests for property APIs and authentication.
- Review security before production launch, including rate limiting and stronger
  admin authentication.

## Maintenance Rule

Update this file whenever:

- A feature is completed or removed.
- An environment variable changes.
- A new issue or deployment dependency is discovered.
- The database or deployment workflow changes.
- A major technical or product decision is made.

Keep entries factual, concise, and free of credentials.
