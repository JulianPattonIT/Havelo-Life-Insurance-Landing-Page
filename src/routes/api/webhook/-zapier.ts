import { createAPIFileRoute } from "@tanstack/react-start/api";

/**
 * Zapier / Facebook Lead Ads Webhook Endpoint
 *
 * Accepts POST requests from Zapier (triggered by Facebook Lead Ads).
 * Maps incoming fields to the Havelo schema and stores the lead.
 *
 * Expected payload format (Zapier Facebook Lead Ads):
 * {
 *   "full_name": "John Doe",
 *   "phone": "555-123-4567",
 *   "email": "john@example.com",
 *   "date_of_birth": "1985-03-15",
 *   "product_interest": "Final Expense",
 *   "coverage_amount": "$25,000 - $50,000",
 *   "zip_code": "90210"
 * }
 *
 * Also supports flattened field names like:
 *   "Full Name", "Phone Number", "Email Address",
 *   "Date of Birth", "Product Interest", "Coverage Amount", "ZIP Code"
 */

type LeadInput = {
  full_name: string;
  phone: string;
  email: string;
  date_of_birth?: string;
  product_interest: string;
  coverage_amount?: string;
  zip_code?: string;
};

function normalizeField(name: string): string {
  const map: Record<string, string> = {
    "full name": "full_name",
    "full_name": "full_name",
    name: "full_name",
    phone: "phone",
    "phone number": "phone",
    telephone: "phone",
    "phone_number": "phone",
    email: "email",
    "email address": "email",
    "email_address": "email",
    "e-mail": "email",
    "date of birth": "date_of_birth",
    "date_of_birth": "date_of_birth",
    dob: "date_of_birth",
    "product interest": "product_interest",
    "product_interest": "product_interest",
    product: "product_interest",
    "coverage amount": "coverage_amount",
    "coverage_amount": "coverage_amount",
    coverage: "coverage_amount",
    "zip code": "zip_code",
    "zip_code": "zip_code",
    zip: "zip_code",
    postal: "zip_code",
    "postal code": "zip_code",
  };
  return map[name.toLowerCase().trim()] || name;
}

function extractValue(obj: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const val = obj[key];
    if (val !== undefined && val !== null && val !== "") {
      return String(val).trim();
    }
  }
  return "";
}

export const APIRoute = createAPIFileRoute("/api/webhook/zapier")({
  POST: async ({ request }) => {
    try {
      let body: Record<string, unknown>;
      const contentType = request.headers.get("content-type") || "";

      if (contentType.includes("application/x-www-form-urlencoded")) {
        const formData = await request.formData();
        body = Object.fromEntries(formData.entries()) as Record<
          string,
          unknown
        >;
      } else {
        body = await request.json();
      }

      console.log(`[webhook] Received payload:`, JSON.stringify(body));

      // Normalize: support both direct and nested objects
      const raw: Record<string, unknown> = body.data
        ? (body.data as Record<string, unknown>)
        : body;

      // Map fields using flexible name matching
      const normalized: Record<string, string> = {};
      for (const [key, value] of Object.entries(raw)) {
        const mapped = normalizeField(key);
        normalized[mapped] = String(value ?? "").trim();
      }

      const lead: LeadInput = {
        full_name:
          normalized.full_name ||
          extractValue(raw, "full_name", "Full Name", "name", "Name"),
        phone:
          normalized.phone ||
          extractValue(raw, "phone", "Phone", "phone_number", "Phone Number"),
        email:
          normalized.email ||
          extractValue(
            raw,
            "email",
            "Email",
            "email_address",
            "Email Address",
          ),
        date_of_birth:
          normalized.date_of_birth ||
          extractValue(
            raw,
            "date_of_birth",
            "Date of Birth",
            "dob",
            "DOB",
          ),
        product_interest:
          normalized.product_interest ||
          extractValue(
            raw,
            "product_interest",
            "Product Interest",
            "product",
            "Product",
          ),
        coverage_amount:
          normalized.coverage_amount ||
          extractValue(
            raw,
            "coverage_amount",
            "Coverage Amount",
            "coverage",
            "Coverage",
          ),
        zip_code:
          normalized.zip_code ||
          extractValue(raw, "zip_code", "ZIP Code", "zip", "ZIP"),
      };

      // Validate required fields
      const missing: string[] = [];
      if (!lead.full_name) missing.push("full_name");
      if (!lead.phone) missing.push("phone");
      if (!lead.email) missing.push("email");
      if (!lead.product_interest) missing.push("product_interest");

      if (missing.length > 0) {
        return new Response(
          JSON.stringify({
            error: "Missing required fields",
            missing,
            received: Object.keys(raw),
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      // Validate product interest
      const validProducts = [
        "Final Expense",
        "Term Life",
        "Annuity",
        "Not Sure",
      ];
      if (!validProducts.includes(lead.product_interest)) {
        lead.product_interest = "Not Sure";
      }

      // Store in database
      const { execSync } = await import("node:child_process");
      const id = crypto.randomUUID();
      const esc = (s: string) => s.replace(/'/g, "''");

      const sql = `INSERT INTO leads (id, full_name, phone, email, date_of_birth, product_interest, coverage_amount, zip_code, source)
                   VALUES ('${esc(id)}', '${esc(lead.full_name)}', '${esc(lead.phone)}', '${esc(lead.email)}', '${esc(lead.date_of_birth || "")}', '${esc(lead.product_interest)}', '${esc(lead.coverage_amount || "")}', '${esc(lead.zip_code || "")}', 'facebook_lead_ad')`;

      execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, {
        shell: true,
        stdio: "pipe",
      });

      console.log(
        `[webhook] Lead stored: ${id} — ${lead.full_name} / ${lead.product_interest}`,
      );

      return new Response(
        JSON.stringify({
          success: true,
          id,
          message: "Lead captured successfully",
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (err) {
      console.error("[webhook] Error:", err);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
});