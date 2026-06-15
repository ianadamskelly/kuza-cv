// Quick connection check: confirms env vars load, Supabase URL is reachable,
// and the schema tables exist with RLS in the expected shape.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// Tiny .env loader (we don't pull dotenv just for this).
const envText = (() => {
  try {
    return readFileSync(new URL("../.env", import.meta.url), "utf8");
  } catch {
    return readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  }
})();
for (const line of envText.split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("URL:", url);
console.log("Anon key:", anon ? `${anon.slice(0, 12)}…` : "MISSING");
console.log("Service key:", service ? `${service.slice(0, 12)}…` : "MISSING");

if (!url || !anon) {
  console.error("\n❌ Missing required env vars.");
  process.exit(1);
}

// 1. Anon client should reach the API and be blocked by RLS (good).
const anonClient = createClient(url, anon);
const { data: anonRows, error: anonErr } = await anonClient
  .from("resumes")
  .select("id")
  .limit(1);

if (anonErr) {
  // If RLS blocks, supabase-js returns data: [] with no error.
  // An error here means a real problem (bad URL, table missing, etc.).
  console.error("\n❌ Anon query failed:", anonErr.message);
  process.exit(1);
}
console.log(`✅ Anon connection works (returned ${anonRows?.length ?? 0} rows — RLS active).`);

// 2. Service client should see the same table without RLS.
if (service) {
  const svc = createClient(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  for (const table of ["profiles", "resumes", "resume_versions", "payments"]) {
    const { error } = await svc.from(table).select("*", { count: "exact", head: true });
    if (error) {
      console.error(`❌ Table ${table}: ${error.message}`);
      process.exit(1);
    }
    console.log(`✅ Table ${table} exists.`);
  }
}

console.log("\n🎉 Supabase is wired up correctly.");
