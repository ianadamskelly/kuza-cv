import type { NextRequest } from "next/server";

// Returns the canonical public origin for the app. Behind a reverse proxy
// (Coolify/Traefik) `request.url` may report the internal bind address
// (e.g. https://0.0.0.0:3000) instead of the user-facing hostname.
//
// NEXT_PUBLIC_APP_URL is the source of truth for redirects we generate. We
// fall back to request.url only if the env var is missing (dev / smoke tests).
export function canonicalOrigin(request: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL;
  if (fromEnv) {
    try {
      return new URL(fromEnv).origin;
    } catch {
      // ignore — fall through to request-based origin
    }
  }
  return new URL(request.url).origin;
}

export function canonicalUrl(request: NextRequest, path: string): URL {
  return new URL(path, canonicalOrigin(request));
}
