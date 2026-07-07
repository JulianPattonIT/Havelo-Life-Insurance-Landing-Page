import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

// ─── Types ─────────────────────────────────────────────────────
interface Lead {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  date_of_birth: string;
  product_interest: string;
  coverage_amount: string;
  zip_code: string;
  status: string;
  source: string;
  created_at: string;
}

// ─── Server Functions ──────────────────────────────────────────

const fetchLeads = createServerFn({ method: "GET" })
  .validator((data: { product_interest?: string }) => data)
  .handler(async ({ data }) => {
    const { execSync } = await import("node:child_process");
    let where = "WHERE 1=1";
    if (data.product_interest) {
      where += ` AND product_interest = '${data.product_interest.replace(/'/g, "''")}'`;
    }
    const sql = `SELECT * FROM leads ${where} ORDER BY created_at DESC`;
    const result = execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, {
      shell: true,
      encoding: "utf-8",
      stdio: "pipe",
    });
    return JSON.parse(result.trim() || "[]") as Lead[];
  });

const updateLeadStatus = createServerFn({ method: "POST" })
  .validator((data: { id: string; status: string }) => data)
  .handler(async ({ data }) => {
    const { execSync } = await import("node:child_process");
    const sql = `UPDATE leads SET status = '${data.status.replace(/'/g, "''")}', updated_at = datetime('now') WHERE id = '${data.id.replace(/'/g, "''")}'`;
    execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, {
      shell: true,
      encoding: "utf-8",
      stdio: "pipe",
    });
    return { success: true };
  });

const exportCsv = createServerFn({ method: "GET" })
  .validator((data: { product_interest?: string }) => data)
  .handler(async ({ data }) => {
    const { execSync } = await import("node:child_process");
    let where = "WHERE 1=1";
    if (data.product_interest) {
      where += ` AND product_interest = '${data.product_interest.replace(/'/g, "''")}'`;
    }
    const sql = `SELECT * FROM leads ${where} ORDER BY created_at DESC`;
    const result = execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, {
      shell: true,
      encoding: "utf-8",
      stdio: "pipe",
    });
    const leads = JSON.parse(result.trim() || "[]") as Lead[];

    if (leads.length === 0) return { csv: "No leads found", filename: "leads.csv" };

    const headers = [
      "ID", "Full Name", "Phone", "Email", "Date of Birth",
      "Product Interest", "Coverage Amount", "ZIP Code",
      "Status", "Source", "Created At",
    ];
    const rows = leads.map((l) =>
      [
        l.id,
        `"${(l.full_name || "").replace(/"/g, '""')}"`,
        l.phone,
        l.email,
        l.date_of_birth,
        l.product_interest,
        l.coverage_amount,
        l.zip_code,
        l.status,
        l.source,
        l.created_at,
      ].join(","),
    );
    return {
      csv: [headers.join(","), ...rows].join("\n"),
      filename: `leads-${new Date().toISOString().split("T")[0]}.csv`,
    };
  });

// ─── Status Cycle ──────────────────────────────────────────────
const STATUS_CYCLE = ["new", "contacted", "qualified", "closed"] as const;
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  qualified: "bg-green-100 text-green-700",
  closed: "bg-neutral-100 text-neutral-700",
};

// ─── Route ─────────────────────────────────────────────────────
export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProduct, setFilterProduct] = useState("");
  const [error, setError] = useState("");

  // Check session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("il_admin");
      if (stored === "auth") setAuthed(true);
    }
  }, []);

  const doLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (password === "insureleads2024") {
      sessionStorage.setItem("il_admin", "auth");
      setAuthed(true);
    } else {
      setLoginError("Invalid password");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("il_admin");
    setAuthed(false);
  };

  const loadLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchLeads({
        data: { product_interest: filterProduct || undefined },
      });
      setLeads(result);
    } catch {
      setError("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) loadLeads();
  }, [authed]);

  useEffect(() => {
    if (authed) loadLeads();
  }, [filterProduct]);

  const cycleStatus = async (lead: Lead) => {
    const idx = STATUS_CYCLE.indexOf(lead.status as typeof STATUS_CYCLE[number]);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    try {
      await updateLeadStatus({ data: { id: lead.id, status: next } });
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status: next } : l)),
      );
    } catch {
      setError("Failed to update status");
    }
  };

  const handleExport = async () => {
    try {
      const result = await exportCsv({
        data: { product_interest: filterProduct || undefined },
      });
      const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to export CSV");
    }
  };

  // ── Login screen ──
  if (!authed) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-navy-50 px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-navy-900">Havelo</h1>
            <p className="mt-1 text-sm text-neutral-600">Admin</p>
          </div>
          <div className="rounded-2xl bg-white px-8 py-8 shadow-xl ring-1 ring-neutral-200">
            <h2 className="mb-6 text-lg font-semibold text-neutral-900">Sign In</h2>
            {loginError && (
              <div className="mb-4 rounded-lg bg-error-light px-4 py-3 text-sm text-error">
                {loginError}
              </div>
            )}
            <form onSubmit={doLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-neutral-400 px-4 py-2.5 text-neutral-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                placeholder="Admin password"
                autoFocus
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ──
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;

  return (
    <div className="min-h-dvh bg-neutral-50">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-navy-900">Havelo</h1>
            <p className="text-xs text-neutral-500">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Download CSV
            </button>
            <button
              onClick={logout}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-lg bg-error-light px-4 py-3 text-sm text-error">
            {error}
            <button
              onClick={() => setError("")}
              className="ml-3 font-medium underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
            <p className="text-sm text-neutral-600">Total Leads</p>
            <p className="mt-1 text-2xl font-bold text-neutral-900">{totalLeads}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
            <p className="text-sm text-neutral-600">New</p>
            <p className="mt-1 text-2xl font-bold text-green-600">{newLeads}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
            <p className="text-sm text-neutral-600">Contacted</p>
            <p className="mt-1 text-2xl font-bold text-yellow-600">
              {leads.filter((l) => l.status === "contacted").length}
            </p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-neutral-200">
            <p className="text-sm text-neutral-600">Qualified</p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {leads.filter((l) => l.status === "qualified").length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm ring-1 ring-neutral-200">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">
                Product Interest
              </label>
              <select
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              >
                <option value="">All Products</option>
                <option value="Final Expense">Final Expense</option>
                <option value="Term Life">Term Life</option>
                <option value="Annuity">Annuity</option>
                <option value="Not Sure">Not Sure</option>
              </select>
            </div>
            <button
              onClick={loadLeads}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-neutral-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-600">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-600">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-600">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-600">Coverage</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-600">ZIP / DOB</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-sm text-neutral-500">
                      Loading...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-sm text-neutral-500">
                      No leads yet.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="transition-colors hover:bg-neutral-50">
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="text-sm font-medium text-neutral-900">
                          {lead.full_name}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="text-sm text-neutral-700">{lead.phone}</div>
                        <div className="text-xs text-neutral-500">{lead.email}</div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-700">
                        {lead.product_interest}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-700">
                        {lead.coverage_amount || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-700">
                        <div>{lead.zip_code}</div>
                        <div className="text-xs text-neutral-500">{lead.date_of_birth || "—"}</div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <button
                          onClick={() => cycleStatus(lead)}
                          title="Click to cycle status"
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-80 ${STATUS_COLORS[lead.status] || "bg-neutral-100 text-neutral-700"}`}
                        >
                          {lead.status}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-500">
                        {lead.created_at}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-neutral-400">
          Click a status badge to cycle:{" "}
          <span className="font-medium">new → contacted → qualified → closed</span>
        </p>
      </div>
    </div>
  );
}