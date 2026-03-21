import { useState } from "react";

export const meta = () => [
  { title: "Pricing — AnnouncePlus by Makerbase" },
  { name: "description", content: "AnnouncePlus pricing plans. Free forever plan, Starter at $4.99/mo, Pro at $9.99/mo. Save 20% with yearly billing." },
  { property: "og:title", content: "AnnouncePlus Pricing — Free, Starter & Pro Plans" },
  { property: "og:description", content: "Start free with 1 bar and 2,000 views. Upgrade to Starter or Pro for more bars, views, and targeting rules." },
];

const font = "'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const fontBody = "'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

function IconCheck({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color || "#22c55e"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const plans = [
  {
    id: "free",
    name: "Free",
    desc: "For stores just getting started",
    monthly: 0,
    yearly: 0,
    cta: "Get started free",
    features: [
      { text: "1 announcement bar", included: true },
      { text: "1 product shipping goal", included: true },
      { text: "2,000 monthly views", included: true },
      { text: "Page & visitor targeting", included: true },
      { text: "Cart state targeting", included: true },
      { text: "Customizable colors & fonts", included: true },
      { text: "Email support", included: true },
      { text: "Running line & rotating", included: false },
      { text: "URL & device targeting", included: false },
      { text: "Cart value rules", included: false },
      { text: "Scheduling", included: false },
      { text: "Country targeting", included: false },
    ],
  },
  {
    id: "starter",
    name: "Starter",
    desc: "For growing stores with more needs",
    monthly: 4.99,
    yearly: 3.99,
    yearlyTotal: 47.88,
    cta: "Start with Starter",
    features: [
      { text: "3 announcement bars", included: true },
      { text: "3 product shipping goals", included: true },
      { text: "10,000 monthly views", included: true },
      { text: "Everything in Free", included: true },
      { text: "URL & device targeting", included: true },
      { text: "Cart value & item rules", included: true },
      { text: "Scroll & delay triggers", included: true },
      { text: "Running line & rotating", included: true },
      { text: "Customer status targeting", included: true },
      { text: "Scheduling", included: false },
      { text: "Country & tag targeting", included: false },
      { text: "Exit intent & UTM", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    desc: "For serious stores that want it all",
    monthly: 9.99,
    yearly: 7.99,
    yearlyTotal: 95.88,
    highlight: true,
    cta: "Start free trial",
    features: [
      { text: "Unlimited bars & goals", included: true },
      { text: "Unlimited monthly views", included: true },
      { text: "Everything in Starter", included: true },
      { text: "Date & day scheduling", included: true },
      { text: "Customer tag targeting", included: true },
      { text: "Country & locale targeting", included: true },
      { text: "UTM / referral targeting", included: true },
      { text: "Exit intent trigger", included: true },
      { text: "Page view count trigger", included: true },
      { text: "Priority support", included: true },
      { text: "All future features", included: true },
      { text: "", included: true, spacer: true },
    ],
  },
];

const comparisons = [
  { category: "Limits", rows: [
    { feature: "Announcement bars", free: "1", starter: "3", pro: "Unlimited" },
    { feature: "Product shipping goals", free: "1", starter: "3", pro: "Unlimited" },
    { feature: "Monthly views", free: "2,000", starter: "10,000", pro: "Unlimited" },
  ]},
  { category: "Bar Types", rows: [
    { feature: "Static announcement", free: true, starter: true, pro: true },
    { feature: "Running marquee", free: false, starter: true, pro: true },
    { feature: "Rotating messages", free: false, starter: true, pro: true },
    { feature: "Free shipping goal", free: true, starter: true, pro: true },
    { feature: "Product shipping goal", free: true, starter: true, pro: true },
  ]},
  { category: "Targeting", rows: [
    { feature: "Page type targeting", free: true, starter: true, pro: true },
    { feature: "New vs returning visitors", free: true, starter: true, pro: true },
    { feature: "Cart state (empty/non-empty)", free: true, starter: true, pro: true },
    { feature: "Device (desktop/mobile)", free: false, starter: true, pro: true },
    { feature: "URL patterns", free: false, starter: true, pro: true },
    { feature: "Customer logged-in status", free: false, starter: true, pro: true },
    { feature: "Cart value threshold", free: false, starter: true, pro: true },
    { feature: "Cart item count", free: false, starter: true, pro: true },
    { feature: "Scroll depth trigger", free: false, starter: true, pro: true },
    { feature: "Display delay", free: false, starter: true, pro: true },
    { feature: "Date scheduling", free: false, starter: false, pro: true },
    { feature: "Day-of-week scheduling", free: false, starter: false, pro: true },
    { feature: "Customer tag targeting", free: false, starter: false, pro: true },
    { feature: "Country targeting", free: false, starter: false, pro: true },
    { feature: "UTM / referral targeting", free: false, starter: false, pro: true },
    { feature: "Exit intent", free: false, starter: false, pro: true },
    { feature: "Page view count", free: false, starter: false, pro: true },
  ]},
  { category: "Design", rows: [
    { feature: "Custom colors", free: true, starter: true, pro: true },
    { feature: "Font size & weight", free: true, starter: true, pro: true },
    { feature: "Bar height & position", free: true, starter: true, pro: true },
    { feature: "CTA buttons", free: true, starter: true, pro: true },
    { feature: "Close button", free: true, starter: true, pro: true },
  ]},
  { category: "Support", rows: [
    { feature: "Email support", free: true, starter: true, pro: true },
    { feature: "Priority support", free: false, starter: false, pro: true },
  ]},
];

export default function PricingPublicPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div style={{ fontFamily: fontBody, color: "#1e293b", minHeight: "100vh", background: "#fff" }}>
      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 40px", borderBottom: "1px solid #f1f5f9",
        position: "sticky", top: 0, background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)", zIndex: 100,
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/announceplus-icon.png" alt="AnnouncePlus" width={36} height={36} style={{ borderRadius: 8 }} />
          <span style={{ fontFamily: font, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>AnnouncePlus</span>
        </a>
        <a href="https://apps.shopify.com/announceplus" style={{
          background: "#2563eb", color: "#fff", padding: "10px 24px", borderRadius: 8,
          fontSize: 14, fontWeight: 600, textDecoration: "none",
        }}>Add to Shopify</a>
      </nav>

      {/* Header */}
      <section style={{ textAlign: "center", padding: "64px 40px 32px", maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ fontFamily: font, fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, lineHeight: 1.15, color: "#0f172a", marginBottom: 16 }}>
          Simple pricing, no surprises
        </h1>
        <p style={{ fontSize: 17, color: "#64748b", lineHeight: 1.6, marginBottom: 32 }}>
          Start free. Upgrade as your store grows. All plans include a free shipping progress bar, customizable design, and one-click setup.
        </p>

        {/* Toggle */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#f8fafc", padding: "6px 20px", borderRadius: 40, border: "1px solid #e2e8f0" }}>
          <span style={{ fontSize: 14, fontWeight: yearly ? 400 : 700, color: "#0f172a" }}>Monthly</span>
          <div
            onClick={() => setYearly(!yearly)}
            style={{
              width: 44, height: 24, borderRadius: 12,
              background: yearly ? "#2563eb" : "#cbd5e1",
              position: "relative", cursor: "pointer", transition: "background 0.2s",
            }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: "50%", background: "#fff",
              position: "absolute", top: 3, left: yearly ? 23 : 3,
              transition: "left 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
            }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: yearly ? 700 : 400, color: "#0f172a" }}>Yearly</span>
          <span style={{ background: "#dcfce7", color: "#15803d", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>-20%</span>
        </div>
      </section>

      {/* Plan cards */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, alignItems: "stretch" }}>
          {plans.map((p) => (
            <div key={p.id} style={{
              border: p.highlight ? "2px solid #2563eb" : "1px solid #e2e8f0",
              borderRadius: 14, padding: "32px 24px", background: "#fff",
              display: "flex", flexDirection: "column", position: "relative",
            }}>
              {p.highlight && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: "#2563eb", color: "#fff", fontSize: 11, fontWeight: 700,
                  padding: "3px 14px", borderRadius: 20,
                }}>MOST POPULAR</div>
              )}

              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontFamily: font, fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{p.name}</h2>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{p.desc}</p>
              </div>

              <div style={{ display: "flex", alignItems: "end", gap: 4, marginBottom: 4 }}>
                <span style={{
                  fontFamily: font, fontSize: 42, fontWeight: 800, lineHeight: 1,
                  color: p.highlight ? "#2563eb" : "#0f172a",
                }}>${(yearly ? p.yearly : p.monthly).toFixed(2)}</span>
                {p.monthly > 0 && <span style={{ fontSize: 14, color: "#94a3b8", paddingBottom: 6 }}>/mo</span>}
              </div>
              <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 20 }}>
                {p.monthly === 0 ? "Free forever" : yearly ? `$${p.yearlyTotal.toFixed(2)}/year — save 20%` : "Billed monthly. Cancel anytime."}
              </p>

              <div style={{ height: 1, background: "#f1f5f9", marginBottom: 20 }} />

              <div style={{ flex: 1 }}>
                {p.features.map((f, fi) => (
                  f.spacer ? <div key={fi} style={{ height: 8 }} /> :
                  <div key={fi} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                    {f.included ? <IconCheck /> : <IconX />}
                    <span style={{ fontSize: 14, color: f.included ? "#334155" : "#cbd5e1" }}>{f.text}</span>
                  </div>
                ))}
              </div>

              <a href="https://apps.shopify.com/announceplus" style={{
                display: "block", textAlign: "center", padding: 14, borderRadius: 10, marginTop: 24,
                fontSize: 15, fontWeight: 700, textDecoration: "none",
                background: p.highlight ? "#2563eb" : "#f8fafc",
                color: p.highlight ? "#fff" : "#0f172a",
                border: p.highlight ? "none" : "1px solid #e2e8f0",
              }}>{p.cta}</a>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ background: "#f8fafc", padding: "64px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: font, fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 40, color: "#0f172a" }}>
            Compare all features
          </h2>

          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
            {/* Table header */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 100px 100px 100px",
              padding: "16px 24px", borderBottom: "2px solid #e2e8f0", background: "#f8fafc",
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Feature</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#64748b", textAlign: "center" }}>Free</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#64748b", textAlign: "center" }}>Starter</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", textAlign: "center" }}>Pro</span>
            </div>

            {comparisons.map((section, si) => (
              <div key={si}>
                <div style={{ padding: "12px 24px", background: "#f8fafc", borderTop: si > 0 ? "1px solid #e2e8f0" : "none" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.03em" }}>{section.category}</span>
                </div>
                {section.rows.map((row, ri) => (
                  <div key={ri} style={{
                    display: "grid", gridTemplateColumns: "1fr 100px 100px 100px",
                    padding: "10px 24px", borderTop: "1px solid #f1f5f9",
                  }}>
                    <span style={{ fontSize: 14, color: "#475569" }}>{row.feature}</span>
                    {["free", "starter", "pro"].map((plan) => (
                      <span key={plan} style={{ textAlign: "center", fontSize: 13, color: "#475569" }}>
                        {typeof row[plan] === "boolean"
                          ? row[plan] ? <IconCheck color={plan === "pro" ? "#2563eb" : "#22c55e"} /> : <IconX />
                          : <span style={{ fontWeight: 600 }}>{row[plan]}</span>
                        }
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "64px 24px", maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontFamily: font, fontSize: 24, fontWeight: 700, textAlign: "center", marginBottom: 32, color: "#0f172a" }}>
          Pricing FAQ
        </h2>
        {[
          { q: "Can I try before I pay?", a: "Yes. The Free plan is available forever with no credit card required. Paid plans can also be tested at no cost on Shopify development stores." },
          { q: "How does billing work?", a: "All charges go through your Shopify bill. You pay monthly or yearly through the same invoice as your Shopify subscription. Cancel anytime from the app." },
          { q: "What happens if I hit the view limit?", a: "On the Free and Starter plans, bars stop showing to new visitors once the monthly view limit is reached. They reappear on the first day of the next month. Upgrade to Pro for unlimited views." },
          { q: "Can I switch plans anytime?", a: "Yes. Upgrade or downgrade at any time from the Pricing page in the app. Upgrades apply immediately. Downgrades take effect at the end of the billing cycle." },
          { q: "Is there a yearly discount?", a: "Yes. Save 20% by choosing yearly billing. Starter drops to $3.99/mo ($47.88/year) and Pro drops to $7.99/mo ($95.88/year)." },
        ].map((faq, i) => (
          <div key={i} style={{ marginBottom: 20, padding: "16px 20px", background: "#f8fafc", borderRadius: 10, border: "1px solid #f1f5f9" }}>
            <h3 style={{ fontFamily: font, fontSize: 15, fontWeight: 700, marginBottom: 6, color: "#0f172a" }}>{faq.q}</h3>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "40px 24px 64px" }}>
        <a href="https://apps.shopify.com/announceplus" style={{
          background: "#2563eb", color: "#fff", padding: "16px 40px", borderRadius: 10,
          fontSize: 16, fontWeight: 700, textDecoration: "none", display: "inline-block",
        }}>Install AnnouncePlus free</a>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #f1f5f9", padding: "24px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <span style={{ fontSize: 13, color: "#94a3b8" }}>AnnouncePlus by Makerbase</span>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "Home", href: "/" },
            { label: "Privacy", href: "/privacy" },
            { label: "FAQ", href: "/faq" },
            { label: "Support", href: "mailto:support@makerbase.app" },
          ].map((l, i) => (
            <a key={i} href={l.href} style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none" }}>{l.label}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
