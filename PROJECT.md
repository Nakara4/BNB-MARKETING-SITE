# Staycation Homes Project Tracker

Last updated: June 25, 2026

## Project Goal

Build and maintain a high-converting, SEO-friendly website where guests can
browse staycation homes and the owner can manage property details and photos.

## Current Status

The core application is implemented and runs on Next.js. The public site,
property pages, admin authentication, property CRUD, Cloudinary uploads, and
MongoDB integration are in place.

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

- `app/page.tsx`: public home page and location search
- `app/property/[slug]/page.tsx`: dynamic property detail and booking page
- `app/admin/page.tsx`: password-protected administration page
- `app/api/admin/`: login, logout, property CRUD, and image upload APIs
- `components/admin-dashboard.tsx`: property management interface
- `lib/mongodb.ts`: MongoDB connection and database selection
- `lib/properties.ts`: property database operations
- `lib/cloudinary.ts`: Cloudinary image uploads
- `lib/auth.ts`: admin cookie authentication
- `lib/seo.ts`: site and property metadata

## Environment Setup

Secrets belong in `.env.local`, which is ignored by Git.

Required values:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/staycation_db
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
ADMIN_PASSWORD=strong-password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BOOKING_WHATSAPP=https://wa.me/254700000000
NEXT_PUBLIC_BOOKING_EMAIL=mailto:hello@example.com
```

Use `.env.example` as the safe template.

### Database Separation

- Production database: `staycation_db`
- Development database: `staycation_dev`
- `.env.development` sets `MONGODB_DB_NAME=staycation_dev`
- Do not add `MONGODB_DB_NAME=staycation_dev` to production Vercel variables.
- Do not test development changes against `staycation_db`.

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
3. Push commits to `origin/development`.
4. Open a pull request from `development` to `main`.
5. Keep `main` deployable and connected to production services.

Never commit `.env.local`, Cloudinary secrets, MongoDB credentials, or admin
passwords.

## Completed Features

- Responsive public marketing home page
- Location-based property search
- Dynamic property detail pages
- Unique SEO metadata for each property
- WhatsApp and email booking links
- Password-protected admin dashboard
- Add, edit, and delete property workflows
- Multiple image uploads through Cloudinary
- MongoDB-backed property storage
- Separate development database selection
- Graceful UI when MongoDB Atlas is unreachable
- Google site verification metadata

## Known Issues

### MongoDB Atlas Connectivity

Local connections have timed out on port `27017`. The application now displays
a warning instead of crashing, but property data cannot load until Atlas is
reachable.

Check:

- The Atlas cluster is active.
- The current public IP is allowed under Atlas Network Access.
- The local network permits outbound traffic on port `27017`.
- `MONGODB_URI` contains valid credentials and the correct cluster hostname.

### Cloudinary Configuration

Image uploads require a valid `CLOUDINARY_URL`. The application normalizes a
missing `cloudinary://` prefix, but the preferred value is:

```env
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

## Next Priorities

- Confirm live connectivity to the `staycation_dev` database.
- Test add, edit, delete, and image upload workflows end to end.
- Replace fallback property images with an intentional empty-image state.
- Add property amenities, bedrooms, bathrooms, and guest capacity.
- Add loading, success, and error notifications to admin actions.
- Add automated tests for property APIs and authentication.
- Configure a Vercel preview deployment for the `development` branch.
- Review security before production launch, including rate limiting and stronger
  admin authentication.

## Maintenance Rule

Update this file whenever:

- A feature is completed or removed.
- An environment variable changes.
- A new issue or deployment dependency is discovered.
- The database or deployment workflow changes.
- A major technical decision is made.

Keep entries factual, concise, and free of credentials.
