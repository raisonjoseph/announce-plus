import { useState } from "react";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { login } from "../../shopify.server";

// ─── SEO Meta Tags ──────────────────────────────────

export const meta = () => [
  { title: "AnnouncePlus — Free Shipping Bar & Announcement Bar for Shopify" },
  {
    name: "description",
    content:
      "Boost sales with a free shipping progress bar and customizable announcement bars for your Shopify store. Real-time cart updates, no code needed. Free plan available.",
  },
  {
    name: "keywords",
    content:
      "shopify announcement bar, free shipping bar, shopify app, announcement bar app, free shipping goal, shopify progress bar, increase average order value, shopify sales tools",
  },
  { property: "og:title", content: "AnnouncePlus — Announcement Bar & Free Shipping Goal for Shopify" },
  {
    property: "og:description",
    content:
      "Show a live free shipping progress bar that updates as customers shop. Increase average order value with smart announcement bars.",
  },
  { property: "og:type", content: "website" },
  { property: "og:site_name", content: "AnnouncePlus by Makerbase" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "AnnouncePlus — Shopify Announcement Bar App" },
  {
    name: "twitter:description",
    content:
      "Free shipping progress bar + announcement bars for Shopify. Real-time cart tracking. Free to install.",
  },
  { name: "robots", content: "index, follow" },
  { name: "author", content: "Makerbase" },
  { "script:ld+json": JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AnnouncePlus",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": "Customizable announcement bars and free shipping progress goals for Shopify stores. Increase average order value with real-time cart tracking.",
    "offers": [
      {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "name": "Free",
        "description": "1 bar, 1 product goal, 2000 monthly views"
      },
      {
        "@type": "Offer",
        "price": "4.99",
        "priceCurrency": "USD",
        "name": "Starter",
        "description": "3 bars, 10000 views, URL and device targeting, running line"
      },
      {
        "@type": "Offer",
        "price": "9.99",
        "priceCurrency": "USD",
        "name": "Pro",
        "description": "Unlimited bars and views, scheduling, country targeting, exit intent"
      }
    ],
    "author": {
      "@type": "Organization",
      "name": "Makerbase",
      "url": "https://makerbase.app"
    }
  })},
  { "script:ld+json": JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is AnnouncePlus?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AnnouncePlus is a Shopify app that adds customizable announcement bars and free shipping progress goals to your store. It shows customers how much more they need to spend to qualify for free shipping, encouraging them to add more items to their cart."
        }
      },
      {
        "@type": "Question",
        "name": "How much does AnnouncePlus cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AnnouncePlus offers a free plan with 1 announcement bar and 2,000 monthly views. The Pro plan at $9.99/month includes unlimited bars, unlimited views, scheduling, and advanced targeting."
        }
      },
      {
        "@type": "Question",
        "name": "Does AnnouncePlus require coding?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. AnnouncePlus installs with one click and is configured entirely from your Shopify admin. No code changes are needed."
        }
      },
      {
        "@type": "Question",
        "name": "Does the free shipping bar update in real time?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The free shipping progress bar automatically tracks the customer's cart total and updates the remaining amount and progress bar instantly as items are added or removed."
        }
      }
    ]
  })}
];

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&family=Nunito+Sans:wght@400;500;600;700&display=swap",
  },
  { rel: "canonical", href: "https://announceplus.makerbase.app" },
];

// ─── Loader ─────────────────────────────────────────

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }
  return { showForm: Boolean(login) };
};

// ─── Inline SVG Icons (no emoji) ────────────────────

function IconChart() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function IconPalette() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="0.5" fill="#2563eb" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="#2563eb" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="#2563eb" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="#2563eb" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

function IconMegaphone() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

function IconSmartphone() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <line x1="12" x2="12.01" y1="18" y2="18" />
    </svg>
  );
}

function IconZap() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconGift() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect width="20" height="5" x="2" y="7" />
      <line x1="12" x2="12" y1="22" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── Styles ─────────────────────────────────────────

const font = "'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const fontBody = "'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const S = {
  page: {
    fontFamily: fontBody,
    color: "#1e293b",
    margin: 0,
    padding: 0,
    minHeight: "100vh",
    background: "#ffffff",
    WebkitFontSmoothing: "antialiased",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 40px",
    borderBottom: "1px solid #f1f5f9",
    position: "sticky",
    top: 0,
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    zIndex: 100,
  },
  logoCt: { display: "flex", alignItems: "center", gap: 10 },
  logoBox: {
    width: 36, height: 36, background: "#2563eb", borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoText: { fontFamily: font, fontSize: 18, fontWeight: 700, color: "#0f172a" },
  navRight: { display: "flex", alignItems: "center", gap: 16 },
  navBy: { fontSize: 13, color: "#94a3b8" },
  btnPrimary: {
    background: "#2563eb", color: "#ffffff", padding: "10px 24px", borderRadius: 8,
    fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-block",
    border: "none", cursor: "pointer", transition: "background 0.2s",
  },
  hero: {
    maxWidth: 800, margin: "0 auto", padding: "80px 40px 64px", textAlign: "center",
  },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: "#eff6ff", color: "#2563eb",
    fontSize: 13, fontWeight: 600, padding: "7px 16px", borderRadius: 20, marginBottom: 32,
    border: "1px solid #dbeafe",
  },
  badgeDot: {
    width: 6, height: 6, borderRadius: "50%", background: "#22c55e",
  },
  h1: {
    fontFamily: font, fontSize: "clamp(36px, 5.5vw, 60px)", fontWeight: 800,
    lineHeight: 1.08, margin: "0 0 24px", color: "#0f172a", letterSpacing: "-0.035em",
  },
  h1Accent: { color: "#2563eb", display: "block", marginTop: 4 },
  heroP: {
    fontFamily: fontBody, fontSize: "clamp(17px, 2vw, 20px)", color: "#475569",
    maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7, letterSpacing: "-0.01em",
  },
  heroCtas: {
    display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 32,
  },
  heroProof: {
    display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap",
    marginBottom: 56, padding: "0 20px",
  },
  heroProofItem: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
  },
  heroProofNum: {
    fontFamily: font, fontSize: 20, fontWeight: 700, color: "#0f172a",
  },
  heroProofLabel: {
    fontSize: 12, color: "#94a3b8", fontWeight: 500, letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
  btnSecondary: {
    background: "#ffffff", color: "#0f172a", padding: "15px 32px", borderRadius: 10,
    fontSize: 16, fontWeight: 600, textDecoration: "none", display: "inline-block",
    border: "1px solid #e2e8f0", cursor: "pointer", transition: "all 0.2s",
  },
  btnHero: {
    background: "#2563eb", color: "#ffffff", padding: "15px 36px", borderRadius: 10,
    fontSize: 16, fontWeight: 700, textDecoration: "none", display: "inline-block",
    cursor: "pointer", transition: "all 0.2s",
    boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
  },
  mockup: {
    maxWidth: 680, margin: "0 auto", borderRadius: 14, overflow: "hidden",
    border: "1px solid #e2e8f0", boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
  },
  chrome: {
    background: "#f8fafc", padding: "10px 14px", display: "flex", gap: 6,
    alignItems: "center", borderBottom: "1px solid #e2e8f0",
  },
  dot: (c) => ({ width: 10, height: 10, borderRadius: "50%", background: c }),
  urlBar: { flex: 1, background: "#e2e8f0", borderRadius: 4, height: 18, marginLeft: 8 },
  barPreview: {
    background: "#0f172a", color: "#ffffff", padding: "13px 20px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
  },
  barText: { fontSize: 14, fontWeight: 500 },
  track: {
    width: "100%", maxWidth: 380, height: 5, background: "rgba(255,255,255,0.12)",
    borderRadius: 999, overflow: "hidden",
  },
  fill: { height: "100%", width: "60%", background: "#22c55e", borderRadius: 999 },
  mockContent: { background: "#ffffff", padding: 20 },
  mockLine: (w) => ({
    height: 10, background: "#f1f5f9", borderRadius: 5, marginBottom: 10, width: w + "%",
  }),
  howSection: { background: "#f8fafc", padding: "80px 40px" },
  sectionInner: { maxWidth: 900, margin: "0 auto" },
  h2: {
    fontFamily: font, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700,
    textAlign: "center", marginBottom: 12, color: "#0f172a",
  },
  subhead: { fontSize: 16, color: "#64748b", textAlign: "center", marginBottom: 48, maxWidth: 600, margin: "0 auto 48px" },
  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 },
  stepCard: {
    textAlign: "center", padding: "32px 20px",
  },
  stepNum: {
    width: 40, height: 40, borderRadius: "50%", background: "#eff6ff", color: "#2563eb",
    fontFamily: font, fontSize: 16, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
  },
  stepTitle: { fontFamily: font, fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 8 },
  stepDesc: { fontSize: 14, color: "#64748b", lineHeight: 1.6 },
  featSection: { padding: "80px 40px" },
  featGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 },
  featCard: {
    background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12,
    padding: 24, transition: "box-shadow 0.2s",
  },
  featIcon: { marginBottom: 14 },
  featTitle: { fontFamily: font, fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#0f172a" },
  featDesc: { fontSize: 14, color: "#64748b", lineHeight: 1.65 },
  priceSection: { padding: "80px 40px", maxWidth: 720, margin: "0 auto", textAlign: "center" },
  priceGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 },
  priceCard: (hl) => ({
    border: hl ? "2px solid #2563eb" : "1px solid #e2e8f0", borderRadius: 14,
    padding: "36px 24px", position: "relative", background: "#ffffff",
  }),
  priceBadge: {
    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
    background: "#2563eb", color: "#fff", fontSize: 11, fontWeight: 700,
    padding: "3px 14px", borderRadius: 20, letterSpacing: "0.02em",
  },
  priceName: { fontFamily: font, fontSize: 18, fontWeight: 700, marginBottom: 8 },
  priceAmt: (hl) => ({
    fontFamily: font, fontSize: 42, fontWeight: 800,
    color: hl ? "#2563eb" : "#0f172a", marginBottom: 4,
  }),
  pricePer: { fontSize: 13, color: "#94a3b8", marginBottom: 24 },
  priceList: { listStyle: "none", padding: 0, margin: "0 0 24px", textAlign: "left" },
  priceLi: {
    fontSize: 14, color: "#334155", padding: "7px 0", borderBottom: "1px solid #f1f5f9",
    display: "flex", alignItems: "center", gap: 8,
  },
  priceCta: (hl) => ({
    display: "block", textAlign: "center", padding: 13, borderRadius: 8,
    fontSize: 15, fontWeight: 700, textDecoration: "none", cursor: "pointer",
    background: hl ? "#2563eb" : "#f1f5f9",
    color: hl ? "#ffffff" : "#0f172a",
    border: hl ? "none" : "1px solid #e2e8f0",
    transition: "background 0.2s",
  }),
  faqSection: { background: "#f8fafc", padding: "80px 40px" },
  faqItem: {
    maxWidth: 680, margin: "0 auto 16px", background: "#ffffff",
    border: "1px solid #e2e8f0", borderRadius: 10, padding: "20px 24px",
  },
  faqQ: { fontFamily: font, fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 8 },
  faqA: { fontSize: 14, color: "#64748b", lineHeight: 1.65, margin: 0 },
  loginSection: { padding: 40, maxWidth: 500, margin: "0 auto", textAlign: "center" },
  loginForm: { display: "flex", gap: 8, justifyContent: "center" },
  loginInput: {
    padding: "10px 16px", borderRadius: 8, border: "1px solid #e2e8f0",
    fontSize: 14, width: 280,
  },
  footer: {
    borderTop: "1px solid #f1f5f9", padding: "32px 40px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexWrap: "wrap", gap: 12,
  },
  footerText: { fontSize: 13, color: "#94a3b8" },
  footerLinks: { display: "flex", gap: 20 },
  footerLink: { fontSize: 13, color: "#94a3b8", textDecoration: "none" },
};

// ─── Pricing Section ────────────────────────────────

function PricingSection({ plans }) {
  const [yearly, setYearly] = useState(false);

  return (
    <section style={{ padding: "80px 40px", maxWidth: 960, margin: "0 auto", textAlign: "center" }} aria-labelledby="price-heading">
      <h2 id="price-heading" style={S.h2}>Simple, transparent pricing</h2>
      <p style={{ ...S.subhead, marginBottom: 24 }}>Start free. Upgrade when you need more.</p>

      {/* Toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 40 }}>
        <span style={{ fontSize: 14, fontWeight: yearly ? 400 : 700, color: "#0f172a" }}>Monthly</span>
        <div
          onClick={() => setYearly(!yearly)}
          style={{
            width: 48, height: 26, borderRadius: 13,
            background: yearly ? "#2563eb" : "#cbd5e1",
            position: "relative", cursor: "pointer", transition: "background 0.2s",
          }}
        >
          <div style={{
            width: 20, height: 20, borderRadius: "50%", background: "#fff",
            position: "absolute", top: 3, left: yearly ? 25 : 3,
            transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: yearly ? 700 : 400, color: "#0f172a" }}>
          Yearly
        </span>
        <span style={{
          background: "#dcfce7", color: "#15803d", fontSize: 11, fontWeight: 700,
          padding: "3px 10px", borderRadius: 20,
        }}>Save 20%</span>
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, textAlign: "left" }}>
        {plans.map((plan, i) => (
          <div key={i} style={{
            border: plan.highlight ? "2px solid #2563eb" : "1px solid #e2e8f0",
            borderRadius: 14, padding: "32px 24px", position: "relative", background: "#fff",
            display: "flex", flexDirection: "column",
          }}>
            {plan.highlight && (
              <div style={{
                position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                background: "#2563eb", color: "#fff", fontSize: 11, fontWeight: 700,
                padding: "3px 14px", borderRadius: 20,
              }}>MOST POPULAR</div>
            )}
            <div style={{ fontFamily: S.h2.fontFamily, fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{plan.name}</div>
            <div style={{ display: "flex", alignItems: "end", gap: 4, marginBottom: 4 }}>
              <span style={{
                fontFamily: S.h2.fontFamily, fontSize: 40, fontWeight: 800, lineHeight: 1,
                color: plan.highlight ? "#2563eb" : "#0f172a",
              }}>{yearly ? plan.yearlyPrice : plan.price}</span>
              {plan.price !== "$0" && <span style={{ fontSize: 13, color: "#94a3b8", paddingBottom: 4 }}>/mo</span>}
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>
              {plan.price === "$0" ? "Free forever" : yearly ? "Billed yearly — save 20%" : "Billed monthly"}
            </div>
            <div style={{ height: 1, background: "#f1f5f9", marginBottom: 20 }} />
            <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
              {plan.features.map((f, fi) => (
                <li key={fi} style={{
                  fontSize: 14, color: "#334155", padding: "6px 0",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <IconCheck />{f}
                </li>
              ))}
            </ul>
            <a href="https://apps.shopify.com/announceplus" style={{
              display: "block", textAlign: "center", padding: 13, borderRadius: 8,
              fontSize: 15, fontWeight: 700, textDecoration: "none", marginTop: 20,
              background: plan.highlight ? "#2563eb" : "#f1f5f9",
              color: plan.highlight ? "#fff" : "#0f172a",
              border: plan.highlight ? "none" : "1px solid #e2e8f0",
            }}>{plan.cta}</a>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Component ──────────────────────────────────────

export default function LandingPage() {
  const { showForm } = useLoaderData();

  const announcementTypes = [
    {
      title: "Announcement bar",
      desc: "Sticky bar at the top or bottom of any page. Static, running marquee, or rotating messages with CTA buttons.",
      preview: { bg: "#0f172a", text: "Free shipping on all orders this weekend!", hasBtn: true },
    },
    {
      title: "Free shipping goal",
      desc: "Live progress bar that tracks the cart total and shows how much more the customer needs for free shipping.",
      preview: { bg: "#0f172a", text: "Spend $20 more for free shipping!", hasProgress: true },
    },
    {
      title: "Product shipping goal",
      desc: "Inline progress bar below the Add to Cart button on product pages. Target specific products or collections.",
      preview: { bg: "#f0fdf4", textColor: "#15803d", text: "Free shipping for orders over $50!", hasProgress: true, light: true },
    },
  ];

  const features = [
    { icon: <IconChart />, title: "Live cart tracking", desc: "Progress bars update instantly as customers add or remove items. No page reload needed." },
    { icon: <IconPalette />, title: "Fully customizable", desc: "Colors, fonts, messages, CTA buttons, height, position — all configurable from your Shopify admin." },
    { icon: <IconMegaphone />, title: "3 announcement types", desc: "Top/bottom bars, free shipping goals, and inline product goals. Static, running marquee, or rotating." },
    { icon: <IconSmartphone />, title: "18 targeting rules", desc: "Page, device, visitor, cart value, URL patterns, customer tags, country, UTM, exit intent, scheduling, and more." },
    { icon: <IconZap />, title: "One-click install", desc: "Enable the app embed and you're live. No code, no theme editing. Works with all Online Store 2.0 themes." },
    { icon: <IconGift />, title: "Free forever plan", desc: "1 bar + 2,000 monthly views free forever. Upgrade to Starter or Pro as you grow." },
  ];

  const faqs = [
    { q: "What is AnnouncePlus?", a: "AnnouncePlus is a Shopify app with three announcement types: sticky bars, free shipping progress goals, and inline product shipping goals. It helps increase average order value by showing customers how close they are to free shipping." },
    { q: "How much does AnnouncePlus cost?", a: "Free plan: 1 bar, 2,000 views. Starter ($4.99/mo or $3.99/mo yearly): 3 bars, 10,000 views, advanced targeting. Pro ($9.99/mo or $7.99/mo yearly): unlimited everything, scheduling, country targeting, exit intent, and priority support." },
    { q: "Does AnnouncePlus require coding?", a: "No. AnnouncePlus installs with one click and is configured entirely from your Shopify admin. No code changes are needed." },
    { q: "Does the free shipping bar update in real time?", a: "Yes. The progress bar tracks your customer's cart total and updates the remaining amount and progress bar instantly as items are added or removed. No page reload is needed." },
    { q: "What targeting rules are available?", a: "AnnouncePlus offers 18 targeting rules including page type, URL patterns, device, new vs returning visitors, cart value, cart items, customer tags, country, UTM source, exit intent, scroll depth, time delay, and date scheduling." },
    { q: "Does it work with my Shopify theme?", a: "AnnouncePlus works with all Shopify Online Store 2.0 themes. It's added as a theme app extension, so it integrates natively without modifying your theme code." },
  ];

  const plans = [
    {
      name: "Free", price: "$0", yearlyPrice: "$0", period: "forever", highlight: false, cta: "Get started free",
      features: ["1 announcement bar", "1 product shipping goal", "2,000 monthly views", "Page & visitor targeting", "Email support"],
    },
    {
      name: "Starter", price: "$4.99", yearlyPrice: "$3.99", period: "per month", highlight: false, cta: "Start with Starter",
      features: ["3 bars & goals", "10,000 monthly views", "URL & device targeting", "Cart value & item rules", "Running line & rotating"],
    },
    {
      name: "Pro", price: "$9.99", yearlyPrice: "$7.99", period: "per month", highlight: true, cta: "Start free trial",
      features: ["Unlimited bars & views", "Date & day scheduling", "Country & tag targeting", "UTM & exit intent", "Priority support"],
    },
  ];

  return (
    <div style={S.page}>
      {/* ── NAV ── */}
      <nav style={S.nav} aria-label="Main navigation">
        <div style={S.logoCt}>
          <div style={S.logoBox} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <polygon points="5,7 5,13 8,11.5 8,8.5" fill="white" />
              <polygon points="8,8.5 8,11.5 13,14 13,6" fill="white" />
              <rect x="3.5" y="7" width="1.5" height="6" rx="0.75" fill="white" />
              <path d="M14 8.5 Q16.5 10 14 11.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <span style={S.logoText}>AnnouncePlus</span>
        </div>
        <div style={S.navRight}>
          <span style={S.navBy}>by Makerbase</span>
          <a href="https://apps.shopify.com/announceplus" style={S.btnPrimary}>
            Add to Shopify
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <header style={S.hero}>
        <div style={S.badge}>
          <span style={S.badgeDot} />
          Free to install — no credit card needed
        </div>
        <h1 style={S.h1}>
          Turn every visitor into
          <span style={S.h1Accent}>a bigger order</span>
        </h1>
        <p style={S.heroP}>
          Add a free shipping progress bar to your Shopify store.
          Customers see exactly how much more they need to spend —
          and they do.
        </p>
        <div style={S.heroCtas}>
          <a href="https://apps.shopify.com/announceplus" style={S.btnHero}>
            Install free on Shopify
          </a>
          <a href="#how-heading" style={S.btnSecondary}>
            See how it works
          </a>
        </div>
        <div style={S.heroProof}>
          <div style={S.heroProofItem}>
            <span style={S.heroProofNum}>+23%</span>
            <span style={S.heroProofLabel}>Avg. order value</span>
          </div>
          <div style={S.heroProofItem}>
            <span style={S.heroProofNum}>60s</span>
            <span style={S.heroProofLabel}>Setup time</span>
          </div>
          <div style={S.heroProofItem}>
            <span style={S.heroProofNum}>Free</span>
            <span style={S.heroProofLabel}>To get started</span>
          </div>
        </div>

        {/* Bar preview mockup */}
        <div style={S.mockup} role="img" aria-label="Preview of AnnouncePlus free shipping progress bar on a Shopify store">
          <div style={S.chrome}>
            <div style={S.dot("#ff5f56")} /><div style={S.dot("#ffbd2e")} /><div style={S.dot("#27c93f")} />
            <div style={S.urlBar} />
          </div>
          <div style={S.barPreview}>
            <span style={S.barText}>Spend $20.00 more for free shipping!</span>
            <div style={S.track}><div style={S.fill} /></div>
          </div>
          <div style={S.mockContent}>
            {[100, 85, 60].map((w, i) => <div key={i} style={S.mockLine(w)} />)}
          </div>
        </div>
      </header>

      {/* ── HOW IT WORKS ── */}
      <section style={S.howSection} aria-labelledby="how-heading">
        <div style={S.sectionInner}>
          <h2 id="how-heading" style={S.h2}>How it works</h2>
          <p style={S.subhead}>Set up in under 2 minutes. No developer needed.</p>
          <div style={S.stepsGrid}>
            {[
              { num: "1", title: "Install the app", desc: "Add AnnouncePlus from the Shopify App Store with one click." },
              { num: "2", title: "Configure your bar", desc: "Set your free shipping threshold, customize colors, and write your message." },
              { num: "3", title: "Go live", desc: "Enable the app embed in your theme editor. Your bar appears instantly on your store." },
            ].map((s, i) => (
              <div key={i} style={S.stepCard}>
                <div style={S.stepNum}>{s.num}</div>
                <h3 style={S.stepTitle}>{s.title}</h3>
                <p style={S.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANNOUNCEMENT TYPES ── */}
      <section style={{ padding: "80px 40px" }} aria-labelledby="types-heading">
        <div style={S.sectionInner}>
          <h2 id="types-heading" style={S.h2}>Three ways to boost sales</h2>
          <p style={S.subhead}>Choose the right announcement type for your goal.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>

            {/* Type 1: Announcement Bar */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
              <div>
                <div style={{ display: "inline-block", background: "#eff6ff", color: "#2563eb", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, marginBottom: 16 }}>Type 1</div>
                <h3 style={{ fontFamily: font, fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 12, lineHeight: 1.3 }}>Announcement bar</h3>
                <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, marginBottom: 16 }}>
                  Sticky bar at the top or bottom of any page. Choose from static text, a running marquee that scrolls continuously, or multiple rotating messages with fade/slide animations.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Static", "Running marquee", "Rotating", "CTA button", "Dismissible"].map((t, i) => (
                    <span key={i} style={{ fontSize: 12, color: "#475569", background: "#f1f5f9", padding: "4px 10px", borderRadius: 6 }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                <div style={{ background: "#f8fafc", padding: "8px 12px", display: "flex", gap: 5, alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f56" }} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#27c93f" }} />
                  <div style={{ flex: 1, background: "#e2e8f0", borderRadius: 4, height: 14, marginLeft: 6 }} />
                </div>
                <div style={{ background: "#0f172a", color: "#fff", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 13, fontWeight: 500 }}>
                  <span>Free shipping on all orders this weekend!</span>
                  <span style={{ background: "#fff", color: "#0f172a", padding: "3px 12px", borderRadius: 4, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>Shop now</span>
                </div>
                <div style={{ padding: 16, background: "#fff" }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ width: 50, height: 50, borderRadius: 8, background: "#f1f5f9" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 10, background: "#f1f5f9", borderRadius: 4, marginBottom: 8, width: "70%" }} />
                      <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, width: "50%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Type 2: Free Shipping Goal */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
              <div style={{ order: 2 }}>
                <div style={{ display: "inline-block", background: "#f0fdf4", color: "#15803d", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, marginBottom: 16 }}>Type 2</div>
                <h3 style={{ fontFamily: font, fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 12, lineHeight: 1.3 }}>Free shipping goal</h3>
                <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, marginBottom: 16 }}>
                  A live progress bar that tracks the cart total in real time. Shows customers exactly how much more they need to spend to unlock free shipping. Updates instantly as items are added or removed.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Real-time tracking", "Progress bar", "Empty cart message", "Success state", "Percentage display"].map((t, i) => (
                    <span key={i} style={{ fontSize: 12, color: "#475569", background: "#f1f5f9", padding: "4px 10px", borderRadius: 6 }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ order: 1, border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                <div style={{ background: "#f8fafc", padding: "8px 12px", display: "flex", gap: 5, alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f56" }} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#27c93f" }} />
                  <div style={{ flex: 1, background: "#e2e8f0", borderRadius: 4, height: 14, marginLeft: 6 }} />
                </div>
                <div style={{ background: "#0f172a", color: "#fff", padding: "12px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500 }}>
                  <span>Spend $18.50 more for free shipping!</span>
                  <div style={{ width: "70%", height: 5, background: "rgba(255,255,255,0.12)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "63%", background: "#22c55e", borderRadius: 999 }} />
                  </div>
                </div>
                <div style={{ padding: 16, background: "#fff" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {[1, 2, 3].map(n => (
                      <div key={n} style={{ textAlign: "center" }}>
                        <div style={{ height: 48, background: "#f1f5f9", borderRadius: 6, marginBottom: 6 }} />
                        <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, marginBottom: 4, width: "80%", margin: "0 auto 4px" }} />
                        <div style={{ height: 6, background: "#e2e8f0", borderRadius: 3, width: "40%", margin: "0 auto" }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Type 3: Product Shipping Goal */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
              <div>
                <div style={{ display: "inline-block", background: "#fef3c7", color: "#92400e", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, marginBottom: 16 }}>Type 3</div>
                <h3 style={{ fontFamily: font, fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 12, lineHeight: 1.3 }}>Product shipping goal</h3>
                <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, marginBottom: 16 }}>
                  An inline progress bar that appears below the Add to Cart button on product pages. Automatically injected — no theme editing needed. Target all products, specific products, or entire collections.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Auto-injected", "All products", "Specific products", "By collection", "Inline design"].map((t, i) => (
                    <span key={i} style={{ fontSize: 12, color: "#475569", background: "#f1f5f9", padding: "4px 10px", borderRadius: 6 }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                <div style={{ padding: 20, background: "#fff" }}>
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ width: 100, height: 120, background: "#f1f5f9", borderRadius: 8, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 10, background: "#e2e8f0", borderRadius: 4, marginBottom: 8, width: "80%" }} />
                      <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, marginBottom: 6, width: "50%" }} />
                      <div style={{ height: 12, background: "#e2e8f0", borderRadius: 4, marginBottom: 16, width: "30%" }} />
                      <div style={{ background: "#0f172a", color: "#fff", textAlign: "center", padding: "8px 0", borderRadius: 6, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Add to cart</div>
                      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, padding: "8px 12px", textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "#15803d", fontWeight: 500, marginBottom: 4 }}>Free shipping for orders over $50!</div>
                        <div style={{ height: 3, background: "#dcfce7", borderRadius: 999, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: "35%", background: "#22c55e", borderRadius: 999 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={S.featSection} aria-labelledby="feat-heading">
        <div style={S.sectionInner}>
          <h2 id="feat-heading" style={S.h2}>Everything you need to increase sales</h2>
          <p style={S.subhead}>Built specifically for Shopify merchants who want higher average order values.</p>
          <div style={S.featGrid}>
            {features.map((f, i) => (
              <article key={i} style={S.featCard}>
                <div style={S.featIcon}>{f.icon}</div>
                <h3 style={S.featTitle}>{f.title}</h3>
                <p style={S.featDesc}>{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <PricingSection plans={plans} />

      {/* ── FAQ (AEO-optimized) ── */}
      <section style={S.faqSection} aria-labelledby="faq-heading">
        <div style={S.sectionInner}>
          <h2 id="faq-heading" style={S.h2}>Frequently asked questions</h2>
          <p style={S.subhead}>Everything merchants ask before installing.</p>
          {faqs.map((faq, i) => (
            <div key={i} style={S.faqItem}>
              <h3 style={S.faqQ}>{faq.q}</h3>
              <p style={S.faqA}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOP LOGIN ── */}
      {showForm && (
        <section style={S.loginSection} aria-label="Shop login">
          <Form method="post" action="/auth/login" style={S.loginForm}>
            <label htmlFor="shop-domain" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>
              Shop domain
            </label>
            <input
              id="shop-domain"
              type="text"
              name="shop"
              placeholder="your-store.myshopify.com"
              style={S.loginInput}
              autoComplete="url"
            />
            <button type="submit" style={S.btnPrimary}>Log in</button>
          </Form>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer style={S.footer}>
        <span style={S.footerText}>AnnouncePlus by Makerbase</span>
        <nav style={S.footerLinks} aria-label="Footer links">
          {[
            { label: "Privacy Policy", href: "https://makerbase.app/privacy" },
            { label: "Support", href: "mailto:support@makerbase.app" },
            { label: "Shopify App Store", href: "https://apps.shopify.com/announceplus" },
          ].map((l, i) => (
            <a key={i} href={l.href} style={S.footerLink}>{l.label}</a>
          ))}
        </nav>
      </footer>
    </div>
  );
}
