// Production server for the built site. The TanStack Start build emits a portable
// fetch handler (dist/server/server.js) plus static client assets (dist/client);
// this wraps them in a Bun server on port 3000 — static files first, SSR for the
// rest. Run `bun run build` before starting. Restart it with `bun run publish`.
//
// Starting a new instance supersedes the old one: it frees the port no matter
// which user owns the current server (provisioning starts it as `engine`; a team
// member's `bun run publish` runs as their own user), so publish never collides
// with an already-running server. Every sandbox user has passwordless sudo, so
// the takeover works across user boundaries.
import handler from "./dist/server/server.js";

import { execSync } from "node:child_process";

// Pinned, NOT read from the environment. The published preview URL
// (<label>.<PUBLIC_SITE_DOMAIN>) is reverse-proxied to 0.0.0.0:3000 inside the
// sandbox, so the default site MUST bind there. Bun auto-loads .env files, so
// honouring process.env.PORT/HOST would let a stray env var or a .env in the site
// dir silently move the site off :3000 (or onto loopback) and break the public URL.
const PORT = 3000;
const HOST = "0.0.0.0";
const CLIENT_DIR = `${import.meta.dir}/dist/client`;

// ─── Webhook: Zapier / Facebook Lead Ads ────────────────────
function normalizeField(name: string): string {
  const map: Record<string, string> = {
    "full name": "full_name", "full_name": "full_name", name: "full_name",
    phone: "phone", "phone number": "phone", telephone: "phone", "phone_number": "phone",
    email: "email", "email address": "email", "email_address": "email", "e-mail": "email",
    "date of birth": "date_of_birth", "date_of_birth": "date_of_birth", dob: "date_of_birth",
    "product interest": "product_interest", "product_interest": "product_interest", product: "product_interest",
    "coverage amount": "coverage_amount", "coverage_amount": "coverage_amount", coverage: "coverage_amount",
    "zip code": "zip_code", "zip_code": "zip_code", zip: "zip_code", postal: "zip_code", "postal code": "zip_code",
  };
  return map[name.toLowerCase().trim()] || name;
}

function extractValue(obj: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const val = obj[key];
    if (val !== undefined && val !== null && val !== "") return String(val).trim();
  }
  return "";
}

async function handleWebhook(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  if (url.pathname !== "/api/webhook/zapier") return null;
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  }

  try {
    let body: Record<string, unknown>;
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/x-www-form-urlencoded")) {
      const fd = await req.formData();
      body = Object.fromEntries(fd.entries()) as Record<string, unknown>;
    } else {
      body = await req.json();
    }

    console.log(`[webhook] Received payload:`, JSON.stringify(body));

    const raw: Record<string, unknown> = body.data ? (body.data as Record<string, unknown>) : body;

    // Normalize field names
    const normalized: Record<string, string> = {};
    for (const [key, value] of Object.entries(raw)) {
      normalized[normalizeField(key)] = String(value ?? "").trim();
    }

    const full_name = normalized.full_name || extractValue(raw, "full_name", "Full Name", "name", "Name");
    const phone = normalized.phone || extractValue(raw, "phone", "Phone", "phone_number", "Phone Number");
    const email = normalized.email || extractValue(raw, "email", "Email", "email_address", "Email Address");
    const date_of_birth = normalized.date_of_birth || extractValue(raw, "date_of_birth", "Date of Birth", "dob", "DOB");
    const product_interest = normalized.product_interest || extractValue(raw, "product_interest", "Product Interest", "product", "Product") || "Not Sure";
    const coverage_amount = normalized.coverage_amount || extractValue(raw, "coverage_amount", "Coverage Amount", "coverage", "Coverage");
    const zip_code = normalized.zip_code || extractValue(raw, "zip_code", "ZIP Code", "zip", "ZIP");

    if (!full_name || !phone || !email) {
      return new Response(JSON.stringify({ error: "Missing required fields", missing: { full_name: !full_name, phone: !phone, email: !email } }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    const validProducts = ["Final Expense", "Term Life", "Annuity", "Not Sure"];
    const finalProduct = validProducts.includes(product_interest) ? product_interest : "Not Sure";

    const id = crypto.randomUUID();
    const esc = (s: string) => s.replace(/'/g, "''");
    const sql = `INSERT INTO leads (id, full_name, phone, email, date_of_birth, product_interest, coverage_amount, zip_code, source, created_at, updated_at)
                 VALUES ('${esc(id)}', '${esc(full_name)}', '${esc(phone)}', '${esc(email)}', '${esc(date_of_birth)}', '${esc(finalProduct)}', '${esc(coverage_amount)}', '${esc(zip_code)}', 'facebook_lead_ad', datetime('now'), datetime('now'))`;

    execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, { shell: true, stdio: "pipe" });
    console.log(`[webhook] Lead stored: ${id} — ${full_name} / ${finalProduct}`);

    return new Response(JSON.stringify({ success: true, id, message: "Lead captured" }), {
      status: 201, headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[webhook] Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}

// Free PORT regardless of which user owns the current listener. lsof runs under
// sudo so it can see (and the kill can signal) a process owned by another user;
// the loop waits for the socket to actually release before we bind.
const freePort =
  `for _ in $(seq 1 25); do ` +
  `pids=$(lsof -t -iTCP:${String(PORT)} -sTCP:LISTEN 2>/dev/null || true); ` +
  `if [ -z "$pids" ]; then exit 0; fi; ` +
  `kill $pids 2>/dev/null || true; sleep 0.2; ` +
  `done`;

// Take over the port, re-freeing and retrying if another publish grabbed it in the
// gap between freeing and binding (last publish wins). Bun.serve throws EADDRINUSE
// synchronously, so without this a raced publish would die while the shell already
// reported success.
for (let attempt = 1; ; attempt++) {
  await Bun.$`sudo sh -c ${freePort}`.quiet().nothrow();
  try {
    Bun.serve({
      port: PORT,
      hostname: HOST,
      async fetch(req) {
        // Check webhook first
        const webhookResponse = await handleWebhook(req);
        if (webhookResponse) return webhookResponse;

        // Static files
        const { pathname } = new URL(req.url);
        if (pathname !== "/") {
          const file = Bun.file(CLIENT_DIR + pathname);
          if (await file.exists()) return new Response(file);
        }
        // Delegate to TanStack Start handler
        return (handler as { fetch: (r: Request) => Response | Promise<Response> }).fetch(req);
      },
    });
    break;
  } catch (err) {
    if (attempt >= 10) throw err;
    await Bun.sleep(200);
  }
}

console.log(`team-site serving on http://${HOST}:${String(PORT)}`);