# Kuza Resume — Setup

## 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Copy these from **Project Settings → API** into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (keep this server-only — never expose)
3. Open the **SQL Editor** and run `supabase/migrations/0001_init.sql`.
4. In **Authentication → Providers**:
   - Enable **Email** (confirm email on or off — your call for V1).
   - Enable **Google** (add OAuth client ID + secret from Google Cloud Console).
5. In **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000` for dev, `https://cv.kuzakizazi.com` for prod.
   - Redirect URLs: add `http://localhost:3000/auth/callback` and the prod equivalent.

## 2. Flutterwave

1. Create an account at [flutterwave.com](https://flutterwave.com).
2. From **Settings → API Keys**, copy:
   - `NEXT_PUBLIC_FLW_PUBLIC_KEY`
   - `FLW_SECRET_KEY`
3. From **Settings → Webhooks**:
   - URL: `https://cv.kuzakizazi.com/api/payments/webhook`
   - Secret hash: pick any strong string, save as `FLW_SECRET_HASH`.

## 3. Local dev

```bash
cp .env.example .env.local
# fill in the values
npm run dev
```

Visit http://localhost:3000.

## 4. Deploy

- Vercel project pointed at this repo.
- Add all env vars from `.env.example` in the Vercel dashboard.
- Add `cv.kuzakizazi.com` as a custom domain and set the CNAME on your DNS.
