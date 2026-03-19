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
        "description": "1 announcement bar, 2000 monthly views"
      },
      {
        "@type": "Offer",
        "price": "9.99",
        "priceCurrency": "USD",
        "name": "Pro",
        "description": "Unlimited bars, unlimited views, scheduling, advanced targeting"
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
    maxWidth: 960, margin: "0 auto", padding: "72px 40px 56px", textAlign: "center",
  },
  badge: {
    display: "inline-block", background: "#eff6ff", color: "#2563eb",
    fontSize: 13, fontWeight: 600, padding: "6px 16px", borderRadius: 20, marginBottom: 28,
  },
  h1: {
    fontFamily: font, fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800,
    lineHeight: 1.12, margin: "0 0 20px", color: "#0f172a", letterSpacing: "-0.025em",
  },
  h1Accent: { color: "#2563eb" },
  heroP: {
    fontSize: "clamp(16px, 2vw, 19px)", color: "#64748b", maxWidth: 580,
    margin: "0 auto 36px", lineHeight: 1.65,
  },
  heroCtas: {
    display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 56,
  },
  btnSecondary: {
    background: "#f8fafc", color: "#0f172a", padding: "14px 32px", borderRadius: 10,
    fontSize: 16, fontWeight: 600, textDecoration: "none", display: "inline-block",
    border: "1px solid #e2e8f0", cursor: "pointer", transition: "background 0.2s",
  },
  btnHero: {
    background: "#2563eb", color: "#ffffff", padding: "14px 32px", borderRadius: 10,
    fontSize: 16, fontWeight: 700, textDecoration: "none", display: "inline-block",
    cursor: "pointer", transition: "background 0.2s",
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

// ─── Component ──────────────────────────────────────

export default function LandingPage() {
  const { showForm } = useLoaderData();

  const features = [
    { icon: <IconChart />, title: "Live progress bar", desc: "Tracks the cart total in real time and shows customers exactly how much more they need for free shipping. No page reload required." },
    { icon: <IconPalette />, title: "Fully customizable", desc: "Change colors, messages, threshold, fonts, and CTA buttons from your Shopify admin. No code or developer needed." },
    { icon: <IconMegaphone />, title: "Announcement bars", desc: "Display flash sale alerts, seasonal promotions, discount codes, and store-wide messages in a clean top or bottom bar." },
    { icon: <IconSmartphone />, title: "Mobile responsive", desc: "Automatically adapts to every screen size. Optimized font sizes and bar height for mobile, tablet, and desktop shoppers." },
    { icon: <IconZap />, title: "One-click install", desc: "Add to your theme in under 60 seconds from the Shopify theme editor. Works with all Online Store 2.0 themes." },
    { icon: <IconGift />, title: "Free to start", desc: "Get started with a free plan including 1 bar and 2,000 monthly views. Upgrade to Pro for unlimited bars, views, and scheduling." },
  ];

  const faqs = [
    { q: "What is AnnouncePlus?", a: "AnnouncePlus is a Shopify app that adds customizable announcement bars and a free shipping progress goal to your store. It shows customers how much more they need to spend to qualify for free shipping, encouraging them to add more items to their cart." },
    { q: "How much does AnnouncePlus cost?", a: "AnnouncePlus offers a free plan with 1 announcement bar and 2,000 monthly views. The Pro plan at $9.99/month includes unlimited bars, unlimited views, scheduling, and advanced targeting." },
    { q: "Does AnnouncePlus require coding?", a: "No. AnnouncePlus installs with one click and is configured entirely from your Shopify admin. No code changes are needed." },
    { q: "Does the free shipping bar update in real time?", a: "Yes. The progress bar tracks your customer's cart total and updates the remaining amount and progress bar instantly as items are added or removed. No page reload is needed." },
    { q: "Does it work with my Shopify theme?", a: "AnnouncePlus works with all Shopify Online Store 2.0 themes. It's added as a theme app extension, so it integrates natively without modifying your theme code." },
    { q: "Can I show different bars on different pages?", a: "Yes. You can configure placement rules to show bars on all pages, homepage only, collection pages, product pages, or the cart page." },
  ];

  const plans = [
    {
      name: "Free", price: "$0", period: "forever", highlight: false, cta: "Get started free",
      features: ["1 announcement bar", "Free shipping progress goal", "2,000 monthly views", "Basic customization", "Email support"],
    },
    {
      name: "Pro", price: "$9.99", period: "per month", highlight: true, cta: "Start free trial",
      features: ["Unlimited announcement bars", "Unlimited monthly views", "Scheduling & automation", "Advanced page targeting", "Priority support"],
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
        <div style={S.badge} role="status">Free to install — no credit card needed</div>
        <h1 style={S.h1}>
          Announcement bars that
          <br />
          <span style={S.h1Accent}>drive more sales</span>
        </h1>
        <p style={S.heroP}>
          Show a live free shipping progress bar that updates as customers add items to cart.
          Boost average order value without discounting.
        </p>
        <div style={S.heroCtas}>
          <a href="https://apps.shopify.com/announceplus" style={S.btnHero}>
            Install free on Shopify
          </a>
          <a href="#features" style={S.btnSecondary}>
            See how it works
          </a>
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
      <section style={S.priceSection} aria-labelledby="price-heading">
        <h2 id="price-heading" style={S.h2}>Simple, transparent pricing</h2>
        <p style={{ ...S.subhead, marginBottom: 40 }}>Start free. Upgrade when you need more.</p>
        <div style={S.priceGrid}>
          {plans.map((plan, i) => (
            <div key={i} style={S.priceCard(plan.highlight)}>
              {plan.highlight && <div style={S.priceBadge}>MOST POPULAR</div>}
              <div style={S.priceName}>{plan.name}</div>
              <div style={S.priceAmt(plan.highlight)}>{plan.price}</div>
              <div style={S.pricePer}>{plan.period}</div>
              <ul style={S.priceList}>
                {plan.features.map((f, fi) => (
                  <li key={fi} style={S.priceLi}>
                    <IconCheck />{f}
                  </li>
                ))}
              </ul>
              <a href="https://apps.shopify.com/announceplus" style={S.priceCta(plan.highlight)}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

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
