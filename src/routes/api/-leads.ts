import { createAPIFileRoute } from "@tanstack/react-start/api";

export const APIRoute = createAPIFileRoute("/api/leads")({
  POST: async ({ request }) => {
    try {
      const body = await request.json();

      // Validate required fields
      const required = [
        "full_name",
        "phone",
        "email",
        "date_of_birth",
        "product_interest",
        "coverage_amount",
        "zip_code",
      ];
      for (const field of required) {
        if (!body[field] || !body[field].toString().trim()) {
          return new Response(
            JSON.stringify({ error: `Missing required field: ${field}` }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }

      // Validate email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        return new Response(
          JSON.stringify({ error: "Invalid email address" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      // Validate phone (10 digits)
      const phoneClean = body.phone.replace(/[\s\-\(\)]/g, "");
      if (!/^\+?1?\d{10}$/.test(phoneClean)) {
        return new Response(
          JSON.stringify({ error: "Invalid phone number" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      // Validate ZIP
      if (!/^\d{5}$/.test(body.zip_code.trim())) {
        return new Response(
          JSON.stringify({ error: "Invalid ZIP code" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const { execSync } = await import("node:child_process");
      const id = crypto.randomUUID();
      const esc = (s: string) => s.replace(/'/g, "''");

      const sql = `INSERT INTO leads (id, full_name, phone, email, date_of_birth, product_interest, coverage_amount, zip_code)
                   VALUES ('${esc(id)}', '${esc(body.full_name.trim())}', '${esc(body.phone.trim())}', '${esc(body.email.trim())}', '${esc(body.date_of_birth)}', '${esc(body.product_interest)}', '${esc(body.coverage_amount)}', '${esc(body.zip_code.trim())}')`;

      execSync(`team-db "${sql}"`, { shell: true, stdio: "pipe" });

      console.log(
        `[lead] API lead captured: ${id} — ${body.full_name} / ${body.product_interest}`,
      );

      return new Response(JSON.stringify({ success: true, id }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("[lead] Error capturing lead:", err);
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
});