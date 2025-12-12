# AgroConect API Architecture Decision

## Current Situation

This project is configured with `output: 'export'` in `next.config.mjs`, which creates a **static HTML export** for deployment to Firebase Hosting.

### ⚠️ Important: API Routes Don't Work with Static Export

The `app/api/` folder contains API routes that **CANNOT** function in a static export. They require a Node.js server to run.

## Options Moving Forward

### Option 1: Deploy to Vercel (Recommended)
**Best for:** Full Next.js features with zero configuration

1. Remove `output: 'export'` from `next.config.mjs`
2. Push code to GitHub
3. Deploy to Vercel (vercel.com)
4. All API routes will work automatically

**Pros:**
- Zero configuration
- Free tier available
- Automatic deployments
- Full Next.js support

**Cons:**
- Not on Firebase

### Option 2: Use Direct Supabase Calls (Current Implementation)
**Best for:** Staying on Firebase with simple data fetching

The project now includes `lib/static-api.ts` which provides direct Supabase queries as a replacement for API routes.

**To use:**
```typescript
// Instead of:
const response = await fetch('/api/products');

// Use:
import { getProducts } from '@/lib/static-api';
const result = await getProducts();
```

**Pros:**
- Works with Firebase Hosting
- No server needed
- Simpler architecture

**Cons:**
- Cannot use complex server-side logic
- Cannot hide API keys (everything is client-side)
- No OCR upload functionality
- Limited to Supabase operations

### Option 3: Firebase Hosting + Cloud Functions
**Best for:** Staying entirely within Firebase ecosystem

1. Remove `output: 'export'`
2. Set up Firebase Cloud Functions
3. Migrate API routes to Cloud Functions
4. Configure custom Next.js deployment

**Pros:**
- Everything in Firebase
- Server-side capabilities

**Cons:**
- More complex setup
- Higher costs
- Requires Firebase configuration

## Current Build Errors

With `output: 'export'` enabled, you'll see these errors:
```
Error: Page "/api/market-prices/debug" is missing "generateStaticParams()"
Error: Page "/api/products" is missing "generateStaticParams()"
```

These are expected because API routes cannot be statically exported.

## Recommendation

**For production:** Use **Option 1 (Vercel)** or **Option 2 (Direct Supabase)**.

- Choose **Vercel** if you need server-side features (OCR uploads, complex logic, API key security)
- Choose **Direct Supabase** if you only need basic data fetching and want to stay on Firebase

## Migration Steps for Option 2 (Direct Supabase)

1. Update all components to use `lib/static-api.ts` instead of fetch calls
2. Remove or ignore the `app/api/` folder during build
3. Build and deploy to Firebase Hosting

Example migration:
```typescript
// Before
const response = await fetch('/api/products');
const data = await response.json();
setProducts(data.data || []);

// After
import { getProducts } from '@/lib/static-api';
const result = await getProducts();
setProducts(result.data || []);
```

## Note on OCR Feature

The OCR upload feature (`/api/ocr/upload`) **will not work** with static export because it requires server-side processing. You would need to:
- Use Vercel (Option 1), or
- Move OCR processing to a separate backend service, or
- Use Supabase Edge Functions

---

**Questions?** Check the Next.js documentation on [Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
