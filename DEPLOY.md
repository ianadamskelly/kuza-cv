# Deploying Kuza Resume to Coolify

This guide assumes Coolify is already installed and reachable.

## 1. Create the app in Coolify

1. **+ New Resource → Public Repository**
   (or Private if you connect a GitHub App — public is fine since the repo is open)
   - Repository: `https://github.com/ianadamskelly/kuza-cv`
   - Branch: `main`
   - Build pack: **Dockerfile**
   - Port: `3000`

2. **Domains**
   - Add `https://cv.kuzakizazi.com`
   - Enable HTTPS (Coolify provisions Let's Encrypt automatically once DNS points at it)

3. **Build & runtime environment variables**

   Paste these. Mark every `NEXT_PUBLIC_*` as a **Build Variable** so it gets baked into the client bundle. The rest are runtime-only.

   | Key | Value | Scope |
   |---|---|---|
   | `NEXT_PUBLIC_APP_URL` | `https://cv.kuzakizazi.com` | Build + Runtime |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://pwlxgqcsoecgjefkbcjx.supabase.co` | Build + Runtime |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(from Supabase → Project Settings → API)* | Build + Runtime |
   | `NEXT_PUBLIC_PRICE_KES` | `130` | Build + Runtime |
   | `SUPABASE_SERVICE_ROLE_KEY` | *(from Supabase → Project Settings → API)* | Runtime only |
   | `FLUTTERWAVE_PUBLIC_KEY` | `FLWPUBK-…-X` | Runtime only |
   | `FLUTTERWAVE_SECRET_KEY` | `FLWSECK-…-X` | Runtime only |
   | `FLUTTERWAVE_SECRET_HASH` | *(your chosen webhook secret)* | Runtime only |
   | `FLUTTERWAVE_BASE_URL` | `https://api.flutterwave.com/v3` | Runtime only |

4. **Deploy**. The first build takes 3–5 minutes (Next standalone build).

## 2. DNS

Point `cv.kuzakizazi.com` at the Coolify host.

- **A record** if Coolify is on a fixed IP: `cv` → your VPS IP
- **CNAME** if you're using a proxy/host alias: `cv` → your Coolify host
- TTL: 300 (5 minutes) for now, raise later

Verify: `dig +short cv.kuzakizazi.com` should return the host within a minute or two.

## 3. Update external services

Once the domain resolves and the app is up, three places need their URLs updated:

### Supabase

**Authentication → URL Configuration**
- Site URL: `https://cv.kuzakizazi.com`
- Redirect URLs: add
  - `https://cv.kuzakizazi.com/auth/callback`
  - `https://cv.kuzakizazi.com/**` (optional catch-all)

If you have Google OAuth enabled, also update the redirect URI on the Google Cloud OAuth client to match the Supabase callback URL.

### Flutterwave

**Settings → Webhooks**
- URL: `https://cv.kuzakizazi.com/api/payments/webhook`
- Secret hash: must match `FLUTTERWAVE_SECRET_HASH` in Coolify env

## 4. Smoke test

In order:

1. Open `https://cv.kuzakizazi.com` — landing page renders.
2. Sign up with a real email.
3. Confirm the email (Supabase sends it). Land on `/dashboard`.
4. Pick a template → fill in 2–3 sections → preview opens (watermarked PDF).
5. **Test payment**: click Pay → Flutterwave checkout opens → pay KES 130 via M-Pesa.
6. Return to `/builder/[id]/paid` → see "Payment received" → click Download → clean PDF without watermark.
7. Re-download the same paid version — should work without paying again.

If any step fails, check Coolify's runtime logs first — most issues will be missing env vars or DNS not propagated yet.

## 5. After it works

- Bump DNS TTL back up (3600+).
- Turn on Coolify's "auto deploy on push" so `git push` → deploy.
- (Optional) Add a status badge to README pointing at Coolify health.
