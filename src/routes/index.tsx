import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

// Server function to submit a lead
const submitLead = createServerFn({ method: "POST" })
  .validator(
    (data: {
      full_name: string;
      phone: string;
      email: string;
      date_of_birth: string;
      product_interest: string;
      coverage_amount: string;
      zip_code: string;
      tcpa_consent: boolean;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { execSync } = await import("node:child_process");
    const id = crypto.randomUUID();
    const esc = (s: string) => s.replace(/'/g, "''");
    const tcpa = data.tcpa_consent ? 1 : 0;
    const sql = `INSERT INTO leads (id, full_name, phone, email, date_of_birth, product_interest, coverage_amount, zip_code, tcpa_consent)
                 VALUES ('${esc(id)}', '${esc(data.full_name)}', '${esc(data.phone)}', '${esc(data.email)}', '${esc(data.date_of_birth)}', '${esc(data.product_interest)}', '${esc(data.coverage_amount)}', '${esc(data.zip_code)}', ${tcpa})`;
    execSync(`team-db "${sql.replace(/"/g, '\\"')}"`, { shell: true, stdio: "pipe" });
    console.log(`[lead] New lead: ${id} — ${data.full_name} / ${data.product_interest}`);
    return { success: true, id };
  });

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  // Step 1: ZIP code
  const [step, setStep] = useState<"zip" | "form" | "done">("zip");
  const [zipCode, setZipCode] = useState("");
  const [zipError, setZipError] = useState("");

  // Step 2: Full form
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    date_of_birth: "",
    product_interest: "",
    coverage_amount: "",
    zip_code: "",
    tcpa_consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // ── Step 1: ZIP Validation ──
  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode.trim()) {
      setZipError("Please enter your ZIP code");
      return;
    }
    if (!/^\d{5}$/.test(zipCode.trim())) {
      setZipError("Enter a valid 5-digit ZIP code");
      return;
    }
    setZipError("");
    setFormData((prev) => ({ ...prev, zip_code: zipCode.trim() }));
    setStep("form");
  };

  // ── Step 2: Full Form Validation ──
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.full_name.trim()) errs.full_name = "Full name is required";
    const phoneClean = formData.phone.replace(/[\s\-\(\)]/g, "");
    if (!phoneClean) errs.phone = "Phone is required";
    else if (!/^\+?1?\d{10}$/.test(phoneClean)) errs.phone = "Enter a valid 10-digit phone";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Enter a valid email";
    if (!formData.date_of_birth) errs.date_of_birth = "Date of birth is required";
    else {
      const age = new Date().getFullYear() - new Date(formData.date_of_birth).getFullYear();
      if (age < 18) errs.date_of_birth = "Must be at least 18";
    }
    if (!formData.product_interest) errs.product_interest = "Select a product";
    if (!formData.coverage_amount) errs.coverage_amount = "Select coverage amount";
    if (!formData.tcpa_consent) errs.tcpa_consent = "You must agree to the terms to continue";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const result = await submitLead({
        data: {
          full_name: formData.full_name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          date_of_birth: formData.date_of_birth,
          product_interest: formData.product_interest,
          coverage_amount: formData.coverage_amount,
          zip_code: formData.zip_code,
          tcpa_consent: formData.tcpa_consent,
        },
      });
      if (result.success) setStep("done");
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  // ── SUCCESS VIEW ──
  if (step === "done") {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-50 px-6 text-center">
        <div className="mx-auto max-w-lg">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success-light">
            <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-neutral-900 sm:text-4xl">Thank You!</h2>
          <p className="mb-6 text-lg leading-relaxed text-neutral-700">
            Your information has been submitted successfully. A licensed insurance agent will reach out shortly with your free quote.
          </p>
          <p className="text-xs font-light text-neutral-500">
            Your information is secure and will never be shared without permission.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-dvh bg-white">
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.svg"
              alt="Havelo"
              className="h-9"
            />
          </div>
          {step === "zip" && (
            <button
              onClick={() => document.getElementById("zip-input")?.focus()}
              className="rounded-full bg-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-teal-700 hover:shadow-md"
            >
              Get My Free Quote
            </button>
          )}
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="px-6 pb-16 pt-10 sm:pb-24 sm:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow badge */}
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Free · No Obligation · 2 Minutes
          </div>

          {/* Headline */}
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Protection for the people{" "}
            <span className="text-teal-600">who count on you</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-neutral-700">
            Get a free, no-pressure quote for final expense, term life, or annuity coverage — and talk it through with a licensed agent who'll actually explain your options.
          </p>

          {/* Trust row */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-600">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Licensed agents only</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Your info is never sold</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>No cost, no obligation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>We'll call within 24 hours</span>
            </div>
          </div>

          {/* ── Step 1: ZIP Form ── */}
          {step === "zip" && (
            <>
              <form onSubmit={handleZipSubmit} className="mx-auto flex max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <input
                  id="zip-input"
                  type="text"
                  value={zipCode}
                  onChange={(e) => { setZipCode(e.target.value); setZipError(""); }}
                  placeholder="Enter ZIP Code"
                  maxLength={5}
                  className="h-12 w-44 rounded-full border-2 border-teal-600 px-5 text-center text-base font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
                <button
                  type="submit"
                  className="h-12 rounded-full bg-teal-600 px-8 text-base font-bold text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-2"
                >
                  Get My Free Quote →
                </button>
              </form>
              {zipError && (
                <p className="mt-3 text-sm text-error">{zipError}</p>
              )}

              {/* Social Proof */}
              <div className="mt-8 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <span className="font-semibold text-neutral-900">Jay</span>
                  <span className="text-neutral-300">•</span>
                  <span>$500K policy for <span className="font-bold text-teal-600">$19/month</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-gold-500">★★★★★</div>
                  <span className="text-sm font-medium text-neutral-600">
                    Rated <strong className="text-neutral-900">4.5</strong> / 5 • <strong className="text-neutral-900">11,971</strong> reviews
                  </span>
                </div>
              </div>
            </>
          )}

          {/* ── Step 2: Full Form ── */}
          {step === "form" && (
            <div className="mx-auto max-w-xl">
              <div className="mb-6 rounded-2xl bg-white shadow-xl ring-1 ring-neutral-200">
                <div className="border-b border-neutral-200 px-8 py-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-teal-600">ZIP {zipCode}</p>
                  <h2 className="text-xl font-bold text-neutral-900">Get your free quote</h2>
                  <p className="mt-0.5 text-sm text-neutral-600">
                    Answer a few quick questions and a licensed agent will reach out to walk you through your options — no pressure, no commitment.
                  </p>
                </div>

                {serverError && (
                  <div className="mx-8 mt-6 rounded-lg bg-error-light px-4 py-3 text-sm text-error">{serverError}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 px-8 py-6" noValidate>
                  {/* Name */}
                  <div className="text-left">
                    <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium text-neutral-700">
                      Full Name <span className="text-error">*</span>
                    </label>
                    <input type="text" id="full_name" value={formData.full_name}
                      onChange={(e) => updateField("full_name", e.target.value)}
                      className={`block w-full rounded-lg border px-4 py-2.5 text-neutral-900 shadow-sm placeholder:text-neutral-500 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/30 ${errors.full_name ? "border-error" : "border-neutral-400"}`}
                      placeholder="John Doe" />
                    {errors.full_name && <p className="mt-1 text-sm text-error text-left">{errors.full_name}</p>}
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 gap-5 text-left sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-neutral-700">
                        Phone <span className="text-error">*</span>
                      </label>
                      <input type="tel" id="phone" value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className={`block w-full rounded-lg border px-4 py-2.5 text-neutral-900 shadow-sm placeholder:text-neutral-500 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/30 ${errors.phone ? "border-error" : "border-neutral-400"}`}
                        placeholder="(555) 123-4567" />
                      {errors.phone && <p className="mt-1 text-sm text-error">{errors.phone}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700">
                        Email <span className="text-error">*</span>
                      </label>
                      <input type="email" id="email" value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className={`block w-full rounded-lg border px-4 py-2.5 text-neutral-900 shadow-sm placeholder:text-neutral-500 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/30 ${errors.email ? "border-error" : "border-neutral-400"}`}
                        placeholder="john@example.com" />
                      {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
                    </div>
                  </div>

                  {/* DOB & ZIP */}
                  <div className="grid grid-cols-1 gap-5 text-left sm:grid-cols-2">
                    <div>
                      <label htmlFor="date_of_birth" className="mb-1.5 block text-sm font-medium text-neutral-700">
                        Date of Birth <span className="text-error">*</span>
                      </label>
                      <input type="date" id="date_of_birth" value={formData.date_of_birth}
                        onChange={(e) => updateField("date_of_birth", e.target.value)}
                        className={`block w-full rounded-lg border px-4 py-2.5 text-neutral-900 shadow-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-500/30 ${errors.date_of_birth ? "border-error" : "border-neutral-400"}`} />
                      {errors.date_of_birth && <p className="mt-1 text-sm text-error">{errors.date_of_birth}</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">ZIP Code</label>
                      <input type="text" value={zipCode} disabled
                        className="block w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-neutral-500" />
                    </div>
                  </div>

                  {/* Product Interest */}
                  <div className="text-left">
                    <label htmlFor="product_interest" className="mb-1.5 block text-sm font-medium text-neutral-700">
                      Product Interest <span className="text-error">*</span>
                    </label>
                    <select id="product_interest" value={formData.product_interest}
                      onChange={(e) => updateField("product_interest", e.target.value)}
                      className={`block w-full rounded-lg border px-4 py-2.5 text-neutral-900 shadow-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-500/30 ${errors.product_interest ? "border-error" : "border-neutral-400"}`}>
                      <option value="">Select a product...</option>
                      <option value="Final Expense">Final Expense</option>
                      <option value="Term Life">Term Life</option>
                      <option value="Annuity">Annuity</option>
                      <option value="Not Sure / Show Me Everything">Not Sure / Show Me Everything</option>
                    </select>
                    {errors.product_interest && <p className="mt-1 text-sm text-error">{errors.product_interest}</p>}
                  </div>

                  {/* Coverage */}
                  <div className="text-left">
                    <label htmlFor="coverage_amount" className="mb-1.5 block text-sm font-medium text-neutral-700">
                      Desired Coverage <span className="text-error">*</span>
                    </label>
                    <select id="coverage_amount" value={formData.coverage_amount}
                      onChange={(e) => updateField("coverage_amount", e.target.value)}
                      className={`block w-full rounded-lg border px-4 py-2.5 text-neutral-900 shadow-sm focus:border-teal-600 focus:ring-2 focus:ring-teal-500/30 ${errors.coverage_amount ? "border-error" : "border-neutral-400"}`}>
                      <option value="">Select coverage...</option>
                      <option value="$5,000 – $10,000">$5,000 – $10,000</option>
                      <option value="$10,000 – $25,000">$10,000 – $25,000</option>
                      <option value="$25,000 – $50,000">$25,000 – $50,000</option>
                      <option value="$50,000 – $100,000">$50,000 – $100,000</option>
                      <option value="$100,000+">$100,000+</option>
                      <option value="Not Sure">Not Sure</option>
                    </select>
                    {errors.coverage_amount && <p className="mt-1 text-sm text-error">{errors.coverage_amount}</p>}
                  </div>

                  {/* Submit */}
                  <div className="space-y-3">
                    {/* TCPA Consent */}
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="tcpa_consent"
                        checked={formData.tcpa_consent}
                        onChange={(e) => updateField("tcpa_consent", e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-neutral-400 text-teal-600 focus:ring-teal-500"
                      />
                      <label htmlFor="tcpa_consent" className="text-xs leading-relaxed text-neutral-600">
                        By checking this box and submitting this form, I agree that Havelo and its licensed insurance partner may contact me at the phone number and email provided — by call, text/SMS, or email, including by automated dialing technology or prerecorded message — to discuss insurance products and provide a quote. I understand consent is not required to purchase any product or service, message/data rates may apply, and I can opt out at any time by replying STOP to any text or calling to request removal.
                      </label>
                    </div>
                    {errors.tcpa_consent && (
                      <p className="text-sm text-error text-left">{errors.tcpa_consent}</p>
                    )}

                    <button type="submit" disabled={submitting}
                      className="w-full rounded-full bg-teal-600 px-8 py-3 text-base font-bold text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
                      {submitting ? "Submitting..." : "Get My Free Quote →"}
                    </button>

                    <p className="text-center text-xs font-light text-neutral-500">
                      Your information is secure and will never be shared without permission.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Trust Badges Under Form ── */}
      {step === "form" && (
        <section className="border-t border-neutral-200 bg-neutral-50 py-8">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure & confidential</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Licensed agents only</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>We'll never sell your info</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>No spam, ever</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── How It Works ── */}
      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-4 text-center text-3xl font-bold text-neutral-900 sm:text-4xl">How it works</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-neutral-700">
            Getting a quote takes less time than filling out a coffee order.
          </p>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-xl font-bold text-white">1</div>
              <h3 className="mb-2 text-xl font-bold text-neutral-900">Tell us a bit about you</h3>
              <p className="text-neutral-700">A couple quick questions about the coverage you're thinking about — takes about two minutes.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-xl font-bold text-white">2</div>
              <h3 className="mb-2 text-xl font-bold text-neutral-900">We match you with a licensed agent</h3>
              <p className="text-neutral-700">No call centers, no bots — a real licensed agent who works in your state.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-xl font-bold text-white">3</div>
              <h3 className="mb-2 text-xl font-bold text-neutral-900">Get your quote, on your terms</h3>
              <p className="text-neutral-700">Talk it through, ask questions, and decide what's right for you. No pressure, ever.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="border-t border-neutral-200 bg-teal-50 px-6 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-neutral-900">We do the shopping. You do the closing.</h2>
          <p className="mb-8 text-lg text-neutral-700">Ready to see what you could save? It only takes two minutes.</p>
          {step === "zip" && (
            <button
              onClick={() => document.getElementById("zip-input")?.focus()}
              className="rounded-full bg-teal-600 px-8 py-3 text-base font-bold text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg"
            >
              Get My Free Quote →
            </button>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-200 bg-navy-900 px-6 py-12">
        <div className="mx-auto max-w-[800px] text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <img src="/images/logo.svg" alt="Havelo" className="h-7 brightness-0 invert" />
          </div>
          <p className="mx-auto mb-6 max-w-xl text-xs leading-relaxed text-navy-300">
            Havelo connects you with a licensed insurance agent to help you find coverage that fits your life. Submitting this form doesn't guarantee approval or coverage — it starts a conversation with a real, licensed agent.
          </p>
          <div className="mb-4 flex items-center justify-center gap-4 text-xs text-navy-300">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
          <p className="text-xs text-navy-400">
            &copy; {new Date().getFullYear()} Havelo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}