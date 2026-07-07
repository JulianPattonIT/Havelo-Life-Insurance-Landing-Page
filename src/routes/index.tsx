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
      <div className="havelo">
        <main className="wrap" style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ maxWidth: 480 }}>
            <div className="check" style={{ margin: "0 auto 20px", width: 48, height: 48, borderRadius: "50%", background: "var(--havelo-ink)", color: "var(--havelo-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>✓</div>
            <h2 style={{ fontSize: 30, marginBottom: 10 }}>Thank You!</h2>
            <p style={{ fontSize: 15.5, color: "var(--havelo-ink-soft)", lineHeight: 1.6 }}>
              Your information has been submitted successfully. A licensed insurance agent will reach out shortly with your free quote.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="havelo">
      {/* ── Sticky Header ── */}
      <header>
        <div className="wrap">
          <div className="header-row">
            <div className="logo">
              <div className="logo-mark">H</div>
              Havelo
            </div>
            <div className="header-note">Licensed & approved</div>
          </div>
        </div>
      </header>

      {/* ── Hero Photo ── */}
      <div className="hero-photo-full">
        <img src="/images/consult.jpg" alt="Licensed insurance agent helping a client" />
      </div>

      {/* ── Hero + Form Grid ── */}
      <div className="wrap">
        <div className="hero">
          <div className="content-grid">
            {/* Left: Intro */}
            <div className="hero-intro">
              <div className="eyebrow">Free · No Obligation · 2 Minutes</div>
              <h1>Protection for the people who count on you</h1>
              <p className="sub">
                Get a free, no-pressure quote for final expense, term life, or annuity coverage — and talk it through with a licensed agent who'll actually explain your options.
              </p>
              <div className="trust-row">
                <span className="trust-item">
                  <span style={{ color: "var(--havelo-accent)", fontWeight: 700, marginRight: 4 }}>✓</span>
                  Licensed agents only
                </span>
                <span className="trust-item">
                  <span style={{ color: "var(--havelo-accent)", fontWeight: 700, marginRight: 4 }}>✓</span>
                  Your info is never sold
                </span>
                <span className="trust-item">
                  <span style={{ color: "var(--havelo-accent)", fontWeight: 700, marginRight: 4 }}>✓</span>
                  No cost, no obligation
                </span>
                <span className="trust-item">
                  <span style={{ color: "var(--havelo-accent)", fontWeight: 700, marginRight: 4 }}>✓</span>
                  We'll call within 24 hours
                </span>
              </div>
            </div>

            {/* Right: Form Card */}
            <div>
              {/* Step 1: ZIP Input */}
              {step === "zip" && (
                <div className="form-card">
                  <h2>Get your free quote</h2>
                  <p className="form-sub">Enter your ZIP code to check availability in your area.</p>
                  <form onSubmit={handleZipSubmit}>
                    <div className="field">
                      <label htmlFor="zip-input">Your ZIP Code</label>
                      <input
                        id="zip-input"
                        type="text"
                        value={zipCode}
                        onChange={(e) => { setZipCode(e.target.value); setZipError(""); }}
                        placeholder="e.g. 12345"
                        maxLength={5}
                      />
                      {zipError && <p style={{ color: "var(--havelo-accent)", fontSize: 12, marginTop: 6 }}>{zipError}</p>}
                    </div>
                    <button type="submit" className="submit-btn">Get My Free Quote →</button>
                  </form>
                </div>
              )}

              {/* Step 2: Full Form */}
              {step === "form" && (
                <div className="form-card">
                  <h2>Get your free quote</h2>
                  <p className="form-sub">
                    Answer a few quick questions and a licensed agent will reach out to walk you through your options — no pressure, no commitment.
                  </p>
                  {serverError && (
                    <div style={{ background: "var(--havelo-accent-soft)", padding: "10px 14px", borderRadius: 9, marginBottom: 14, fontSize: 13, color: "var(--havelo-accent)" }}>{serverError}</div>
                  )}
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="field">
                      <label htmlFor="full_name">Full Name</label>
                      <input type="text" id="full_name" value={formData.full_name}
                        onChange={(e) => updateField("full_name", e.target.value)}
                        placeholder="John Doe"
                        style={{ borderColor: errors.full_name ? "var(--havelo-accent)" : undefined }} />
                      {errors.full_name && <p className="error-msg">{errors.full_name}</p>}
                    </div>

                    <div className="field-row">
                      <div className="field">
                        <label htmlFor="phone">Phone</label>
                        <input type="tel" id="phone" value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          placeholder="(555) 123-4567"
                          style={{ borderColor: errors.phone ? "var(--havelo-accent)" : undefined }} />
                        {errors.phone && <p className="error-msg">{errors.phone}</p>}
                      </div>
                      <div className="field">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="john@example.com"
                          style={{ borderColor: errors.email ? "var(--havelo-accent)" : undefined }} />
                        {errors.email && <p className="error-msg">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="field-row">
                      <div className="field">
                        <label htmlFor="date_of_birth">Date of Birth</label>
                        <input type="date" id="date_of_birth" value={formData.date_of_birth}
                          onChange={(e) => updateField("date_of_birth", e.target.value)}
                          style={{ borderColor: errors.date_of_birth ? "var(--havelo-accent)" : undefined }} />
                        {errors.date_of_birth && <p className="error-msg">{errors.date_of_birth}</p>}
                      </div>
                      <div className="field">
                        <label>ZIP Code</label>
                        <input type="text" value={zipCode} disabled style={{ opacity: 0.6 }} />
                      </div>
                    </div>

                    <div className="field">
                      <label htmlFor="product_interest">Product Interest</label>
                      <select id="product_interest" value={formData.product_interest}
                        onChange={(e) => updateField("product_interest", e.target.value)}
                        style={{ borderColor: errors.product_interest ? "var(--havelo-accent)" : undefined }}>
                        <option value="">Select a product...</option>
                        <option value="Final Expense">Final Expense</option>
                        <option value="Term Life">Term Life</option>
                        <option value="Annuity">Annuity</option>
                        <option value="Not Sure / Show Me Everything">Not Sure / Show Me Everything</option>
                      </select>
                      {errors.product_interest && <p className="error-msg">{errors.product_interest}</p>}
                    </div>

                    <div className="field">
                      <label htmlFor="coverage_amount">Desired Coverage</label>
                      <select id="coverage_amount" value={formData.coverage_amount}
                        onChange={(e) => updateField("coverage_amount", e.target.value)}
                        style={{ borderColor: errors.coverage_amount ? "var(--havelo-accent)" : undefined }}>
                        <option value="">Select coverage...</option>
                        <option value="$5,000 – $10,000">$5,000 – $10,000</option>
                        <option value="$10,000 – $25,000">$10,000 – $25,000</option>
                        <option value="$25,000 – $50,000">$25,000 – $50,000</option>
                        <option value="$50,000 – $100,000">$50,000 – $100,000</option>
                        <option value="$100,000+">$100,000+</option>
                        <option value="Not Sure">Not Sure</option>
                      </select>
                      {errors.coverage_amount && <p className="error-msg">{errors.coverage_amount}</p>}
                    </div>

                    <div className="consent">
                      <input type="checkbox" id="tcpa_consent" checked={formData.tcpa_consent}
                        onChange={(e) => updateField("tcpa_consent", e.target.checked)} />
                      <label htmlFor="tcpa_consent">
                        By checking this box and submitting this form, I agree that Havelo and its licensed insurance partner may contact me at the phone number and email provided — by call, text/SMS, or email, including by automated dialing technology or prerecorded message — to discuss insurance products and provide a quote. I understand consent is not required to purchase any product or service, message/data rates may apply, and I can opt out at any time by replying STOP to any text or calling to request removal.
                      </label>
                    </div>
                    {errors.tcpa_consent && <p className="error-msg" style={{ marginTop: 4 }}>{errors.tcpa_consent}</p>}

                    <button type="submit" className="submit-btn" disabled={submitting}>
                      {submitting ? "Submitting..." : "Get My Free Quote →"}
                    </button>

                    <div className="form-badges">
                      <span>🔒 Secure & confidential</span>
                      <span>✓ Licensed agents only</span>
                      <span>✓ No spam, ever</span>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Why Havelo ── */}
      <div className="wrap">
        <div className="why">
          <div className="why-grid">
            <div className="why-photo">
              <img src="/images/secondary.jpg" alt="Family peace of mind" />
            </div>
            <div>
              <div className="eyebrow">Why Havelo</div>
              <h2 style={{ fontSize: "clamp(24px,4vw,34px)", marginBottom: 6 }}>
                Real coverage from people who know the ropes
              </h2>
              <p style={{ fontSize: 14.5, color: "var(--havelo-ink-soft)", margin: 0 }}>
                We don't do call centers or bots — just real, licensed agents who'll help you find the right fit.
              </p>
              <div className="why-points">
                <div className="why-point">
                  <div className="check">✓</div>
                  <div>
                    <h3>Licensed agents, not robots</h3>
                    <p>Every quote comes from a real person licensed in your state — no automated call centers, no bots.</p>
                  </div>
                </div>
                <div className="why-point">
                  <div className="check">✓</div>
                  <div>
                    <h3>Your information stays yours</h3>
                    <p>We never sell your data. Your info is only shared with the licensed agent helping you — and no one else.</p>
                  </div>
                </div>
                <div className="why-point">
                  <div className="check">✓</div>
                  <div>
                    <h3>No pressure, no hurry</h3>
                    <p>The whole point is to help you understand your options. Ask questions, take your time — there's zero obligation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── How It Works ── */}
      <div className="wrap">
        <div className="how">
          <div className="section-head">
            <div className="eyebrow">Simple process</div>
            <h2>Getting a quote takes less time than filling out a coffee order</h2>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <h3>Tell us a bit about you</h3>
              <p>A couple quick questions about the coverage you're thinking about — takes about two minutes.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h3>We match you with a licensed agent</h3>
              <p>No call centers, no bots — a real licensed agent who works in your state.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h3>Get your quote, on your terms</h3>
              <p>Talk it through, ask questions, and decide what's right for you. No pressure, ever.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <div className="wrap">
        <div className="products">
          <img src="/images/trust.jpg" alt="Coverage you can trust" />
          <div>
            <div className="eyebrow">Coverage types</div>
            <h2 style={{ fontSize: "clamp(24px,4vw,34px)", marginBottom: 6 }}>We help you find the right fit</h2>
            <p style={{ fontSize: 14.5, color: "var(--havelo-ink-soft)", margin: 0 }}>
              Whether you're planning ahead, protecting your family, or looking for retirement income — we've got you covered.
            </p>
            <div className="product-list">
              <div className="product-pill">
                <div className="dot" />
                Final Expense — coverage for end-of-life costs
              </div>
              <div className="product-pill">
                <div className="dot" />
                Term Life — affordable protection for a set period
              </div>
              <div className="product-pill">
                <div className="dot" />
                Annuity — guaranteed income for retirement
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Licensing ── */}
      <div className="wrap">
        <div className="licensing">
          <p>Licensed agents available in all 50 states</p>
          <div className="state-row">
            <span className="state-pill">TX</span>
            <span className="state-pill">FL</span>
            <span className="state-pill">CA</span>
            <span className="state-pill">NY</span>
            <span className="state-pill">OH</span>
            <span className="state-pill">PA</span>
            <span className="state-pill">GA</span>
            <span className="state-pill">NC</span>
            <span className="state-pill">IL</span>
            <span className="state-pill">MI</span>
          </div>
        </div>
      </div>

      {/* ── Final CTA ── */}
      <div className="wrap">
        <div className="final-cta">
          <div className="cta-box">
            <h2>We do the shopping. You do the closing.</h2>
            <p>Ready to see what you could save? It only takes two minutes — and there's absolutely no obligation.</p>
            {step === "zip" && (
              <button
                onClick={() => document.getElementById("zip-input")?.focus()}
                className="submit-btn"
                style={{ display: "block" }}
              >
                Get My Free Quote →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div className="logo" style={{ fontSize: 15 }}>
              <div className="logo-mark" style={{ width: 22, height: 22, fontSize: 10 }}>H</div>
              Havelo
            </div>
            <div className="foot-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
          <p>Havelo connects you with a licensed insurance agent to help you find coverage that fits your life. Submitting this form doesn't guarantee approval or coverage — it starts a conversation with a real, licensed agent.</p>
          <p style={{ marginTop: 12 }}>&copy; {new Date().getFullYear()} Havelo. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        .error-msg { color: var(--havelo-accent); font-size: 12px; margin-top: 4px; }
      `}</style>
    </div>
  );
}