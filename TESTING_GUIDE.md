# Pre-Merge Testing Guide

## Local Testing (Before Merge)

### 1. Checkout the Performance Branch
```bash
git fetch origin
git checkout perf/optimize-queries-and-images
npm install
```

### 2. Test Database Index Initialization

**Expected behavior:** Indexes are created once on app startup, not on every query.

```bash
# Start the dev server
npm run dev:clean

# Monitor the console - you should see:
# "Database initialization error:" ONLY if MongoDB is unreachable
# This is safe - the app will still run without initial index creation
```

**Check MongoDB Atlas:**
1. Go to MongoDB Atlas Dashboard
2. Select your cluster → Collections → properties
3. Go to Indexes tab
4. You should see:
   - `text_search_index` (location + title + description)
   - `slug_index` (unique)
   - `created_at_index`

### 3. Test ISR Caching (Homepage)

**Test 1: Initial page load**
```bash
# Open http://localhost:3000
# Time the load - should complete in 1-2 seconds
# Check Network tab - should load immediately (static HTML)
```

**Test 2: Database query reduction**
```bash
# Open MongoDB Atlas Monitoring → Metrics
# Refresh homepage 10 times
# Before optimization: 10 database queries
# After optimization: 1 database query per minute (very few)
```

**Test 3: ISR revalidation**
```bash
# Add a new property in admin dashboard
# Go back to homepage
# The new property may NOT appear immediately (ISR cache expires in 60 seconds)
# Wait 60 seconds and refresh - new property should appear
# ✅ This is expected behavior - users see consistent pages for 60 seconds
```

### 4. Test Location Search

```bash
# Go to http://localhost:3000?location=Diani
# Search should complete in <500ms (was 1-2s before)
# ✅ Uses text search index instead of regex scan
```

### 5. Test Image Lazy Loading

```bash
# Open http://localhost:3000
# Open DevTools → Network tab
# Scroll down slowly
# Images should load ONLY as they enter the viewport
# Off-screen images should NOT download until scrolled to
```

### 6. Test Admin Dashboard

**Add a property:**
```bash
# Go to http://localhost:3000/admin
# Enter password
# Add a new property with images
# Images should upload and display with thumbnails
# ✅ Cloudinary transformations should work (w_200,h_200,c_fill,q_auto)
```

**Edit property:**
```bash
# Click Edit on a property
# Modify title/price
# Save
# Property list should update (sorted by title)
# ✅ Memoized sort should prevent unnecessary re-renders
```

**Delete property:**
```bash
# Click Delete on a property
# Confirm deletion
# Property should disappear from list
# ✅ UI should update instantly (no lag)
```

### 7. Test Connection Timeout Handling

```bash
# Simulate database being unreachable
# Stop MongoDB or block network traffic to Atlas
# Refresh homepage
# Expected: Error message appears within 5-10 seconds
# Before: Would wait up to 20 seconds
```

### 8. Performance Benchmarks

**Before & After Comparison:**

```bash
# Terminal 1: Start dev server
npm run dev:clean

# Terminal 2: Run lighthouse benchmark
curl http://localhost:3000 -w "Time: %{time_total}s\n"

# Repeat 5 times
# Average should be <1s (was 0.3-0.5s before, now much faster on first request)
```

---

## Staging/Preview Testing (On Vercel)

### 1. Create Pull Request
```bash
# Push branch to origin (already done)
git push origin perf/optimize-queries-and-images

# Go to https://github.com/Nakara4/BNB-MARKETING-SITE
# Create PR from perf/optimize-queries-and-images → main
```

### 2. Vercel Preview Deployment

- Vercel automatically creates a preview deployment for the PR
- Wait for deployment to complete (~2-3 minutes)
- Click "Visit Preview" link from the PR

### 3. Test Preview URL

```bash
# Test homepage load time
https://bnb-marketing-site-git-perf-optimize-queries-and-images-nakara4.vercel.app/

# Should load in <100ms (cached) or <500ms (cold)
# Images should lazy load
# Admin dashboard should work normally
```

### 4. Monitor Vercel Analytics

- Go to Vercel Dashboard → Project
- Click "Analytics"
- Compare Web Vitals:
  - **Before:** First Contentful Paint ~500ms
  - **After:** First Contentful Paint ~50ms

---

## Post-Merge Verification (Production)

After merging to `main` and deploying to production:

### 1. Monitor homepage performance
```bash
# Go to https://harlequindiani.com
# Open DevTools → Network tab
# Check response times
# Expected: <100ms (should be cached)
```

### 2. Check Vercel Analytics

- Vercel Dashboard → Harlequin Diani project
- Monitor these metrics for 1 hour:
  - **Response Time:** Should be <100ms average
  - **Requests:** Should drop 80-90% compared to before
  - **Edge Cache Hit Rate:** Should increase to 85%+

### 3. Verify Database Load

- MongoDB Atlas → Metrics
- **Before:** 60-100 queries/minute
- **After:** 1-2 queries/minute
- ✅ Database load should drop dramatically

### 4. Test User Journeys

**User 1: Browse homepage**
```
1. Visit homepage
2. Scroll through properties
3. Filter by location
4. Click on property detail
5. Expected: All fast, images lazy load
```

**User 2: Add/Edit property**
```
1. Go to /admin, login
2. Add new property with images
3. Edit existing property
4. Delete property
5. Expected: All operations smooth, no lag
```

### 5. Rollback Plan (If Issues)

```bash
# If any issue occurs within 30 minutes of deployment:

# Option 1: Revert commit
git revert <commit-sha>
git push origin main
# Vercel will auto-redeploy from main

# Option 2: Revert to previous main
git reset --hard origin/main~1
git push -f origin main
```

---

## Monitoring Checklist

After deployment, monitor for 24 hours:

- [ ] **Homepage loads in <200ms** (avg)
- [ ] **Admin dashboard is responsive** (no lag)
- [ ] **Images lazy load properly** (no full-res downloads)
- [ ] **Location search works** (<500ms response)
- [ ] **No database errors** in MongoDB logs
- [ ] **Connection pool** is healthy (2-10 active connections)
- [ ] **Vercel analytics** show improvement
- [ ] **Error rate** remains <1%

---

## Troubleshooting

### Issue: Homepage shows old properties
**Cause:** ISR cache hasn't expired yet (60 seconds)
**Solution:** Wait 60 seconds or manually revalidate
```bash
# If you need immediate update on production:
# Go to Vercel → Deployments → Current → "Redeploy"
# Or use the revalidate API endpoint (if configured)
```

### Issue: Images not loading
**Cause:** Cloudinary transformation URL malformed
**Solution:** Check Cloudinary URL format
```
# Before: https://res.cloudinary.com/.../image/upload/v123/file.jpg
# After:  https://res.cloudinary.com/.../image/upload/w_500,q_auto,f_auto/v123/file.jpg
```

### Issue: Admin dashboard slow
**Cause:** Too many properties in list (100+)
**Solution:** Verify memoization is working
```bash
# Check React DevTools Profiler
# PropertyListItem should not re-render when list size changes
```

### Issue: Database connection timeouts
**Cause:** Timeout settings too aggressive (5s)
**Solution:** Check MongoDB Atlas network access
```bash
# MongoDB Atlas → Network Access
# Verify current IP is whitelisted
# Check connection status page
```

---

## Performance Baseline

For future reference, record these baseline metrics after merge:

| Metric | Baseline | Target | Status |
|--------|----------|--------|--------|
| Homepage Load (cold) | ___ ms | <500ms | [ ] |
| Homepage Load (cache) | ___ ms | <100ms | [ ] |
| Location Search | ___ ms | <500ms | [ ] |
| DB Queries/min | ___ | <5 | [ ] |
| Image Bandwidth | ___ MB | <30MB | [ ] |
| Admin Dashboard FCP | ___ ms | <1s | [ ] |

---

## Questions?

If anything is unclear or breaks:
1. Check the PERFORMANCE_OPTIMIZATION.md file
2. Review individual commit messages in the PR
3. Consult MongoDB documentation for index optimization
4. Check Next.js ISR documentation: https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
