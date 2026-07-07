# Release Checklist

Last updated: July 7, 2026

Run this checklist before merging to `main` or deploying production changes.

## Merge Readiness

- [ ] Confirm the release scope is intentional.
- [ ] Run `npm run build`.
- [ ] Review `git diff` for accidental secret or unrelated file changes.
- [ ] Confirm `.env.local` is not committed.
- [ ] Confirm `.env.development.local` is not committed.
- [ ] Confirm `.env.example` contains placeholders only.

## Production Environment Checks

- [ ] Vercel production has `MONGODB_URI`.
- [ ] Vercel production `MONGODB_URI` points to production data, not development data.
- [ ] Vercel production has `CLOUDINARY_URL`.
- [ ] Vercel production has a strong `ADMIN_PASSWORD`.
- [ ] Vercel production has `NEXT_PUBLIC_SITE_URL=https://harlequindiani.com`.
- [ ] Vercel production has the real `NEXT_PUBLIC_BOOKING_WHATSAPP`.
- [ ] Vercel production has the real `NEXT_PUBLIC_BOOKING_EMAIL`.
- [ ] Vercel production has `NEXT_PUBLIC_HERO_IMAGE_URL` if the hero should use a specific photo.
- [ ] Vercel production has `FEATURED_PROPERTY_SLUGS` with the three Harlequin Diani listing slugs.
- [ ] Production does not set `MONGODB_DB_NAME=harlequin_diani_dev`.

## Local Verification

- [ ] Start with `npm run dev:clean`.
- [ ] Open `/`.
- [ ] Open `/admin`.
- [ ] Login with `ADMIN_PASSWORD`.
- [ ] Create a test property.
- [ ] Upload at least one JPG or PNG image.
- [ ] Edit the test property.
- [ ] Delete the test property.

## Public Site Checks

- [ ] Home page loads on desktop.
- [ ] Home page loads on mobile.
- [ ] Header brand says Harlequin Diani.
- [ ] Browser tab/bookmark icon displays the Harlequin Diani mark.
- [ ] Hero copy focuses on Harlequin Diani.
- [ ] Hero image uses a real Harlequin Diani/property photo when database images are available.
- [ ] Homepage mentions about 1.2 km to Diani Beach by footpath.
- [ ] Homepage mentions about 4 km to Diani Beach by vehicle route.
- [ ] Homepage mentions Umoja as a landmark.
- [ ] Homepage mentions Ukunda Airport without over-promising exact drive time.
- [ ] Homepage keeps the listed-properties section.
- [ ] The three Harlequin Diani listings appear before newer non-Harlequin listings.
- [ ] Location search filters listings.
- [ ] Property card image, title, location, and price are correct.
- [ ] Property detail page loads from the card.
- [ ] Gallery images display correctly.
- [ ] WhatsApp link opens with the correct property message.
- [ ] Email link opens with the correct subject.
- [ ] No generic fallback image appears for real listings with uploaded photos.

## SEO Checks

- [ ] Home page title and description use Harlequin Diani.
- [ ] Each property has a unique title and description.
- [ ] Canonical URLs use the production domain.
- [ ] Open Graph image uses the first property image where available.
- [ ] Google site verification metadata is still present if needed.
- [ ] Sitemap exists and includes active properties.
- [ ] Sitemap excludes `/admin` and API routes.
- [ ] Robots rules are intentional for production.

## Security Checks

- [ ] Admin password is strong.
- [ ] Upload route rejects invalid file types.
- [ ] Upload route rejects oversized files.
- [ ] Admin routes require authentication.
- [ ] MongoDB Atlas network access is intentionally configured.

## Deployment Checks

- [ ] Merge only tested work into `main`.
- [ ] Push `main`.
- [ ] Confirm Vercel build succeeds.
- [ ] Visit production home page after deploy.
- [ ] Visit one production property page after deploy.
- [ ] Test admin login after deploy.
- [ ] Add a small test image upload after deploy, then remove it.
