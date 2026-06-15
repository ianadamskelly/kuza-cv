import type { NextConfig } from "next";
import path from "node:path";

const projectRoot = path.resolve();

const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
  } catch {
    return "";
  }
})();

// Hosts that may legitimately call server actions. Required when running
// behind a reverse proxy (Coolify/Traefik) so Next.js trusts the forwarded
// host header and constructs redirect URLs with the public hostname instead
// of the internal bind address.
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
const appHost = (() => {
  try {
    return new URL(appUrl).host;
  } catch {
    return "";
  }
})();

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  experimental: {
    serverActions: {
      allowedOrigins: [appHost, "localhost:3000"].filter(Boolean),
    },
  },
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
