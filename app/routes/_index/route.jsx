import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { login } from "../../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function LandingPage() {
  const { showForm } = useLoaderData();

  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#0f0f0f",
        margin: 0,
        padding: 0,
        minHeight: "100vh",
        background: "#ffffff",
      }}
    >
      {/* ── NAV ── */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 40px",
          borderBottom: "1px solid #f0f0f0",
          position: "sticky",
          top: 0,
          background: "#ffffff",
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "#2563eb",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <polygon points="5,7 5,13 8,11.5 8,8.5" fill="white" />
              <polygon points="8,8.5 8,11.5 13,14 13,6" fill="white" />
              <rect x="3.5" y="7" width="1.5" height="6" rx="0.75" fill="white" />
              <path
                d="M14 8.5 Q16.5 10 14 11.5"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M15 7.5 Q18 10 15 12.5"
                stroke="white"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeOpacity="0.5"
                fill="none"
              />
            </svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#0f0f0f" }}>
            AnnouncePlus
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>by Makerbase</span>
          <a
            href="https://apps.shopify.com/announceplus"
            style={{
              background: "#2563eb",
              color: "#ffffff",
              padding: "9px 20px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Add to Shopify
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "80px 40px 60px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "#eff6ff",
            color: "#2563eb",
            fontSize: 13,
            fontWeight: 600,
            padding: "5px 14px",
            borderRadius: 20,
            marginBottom: 24,
          }}
        >
          Free to install — no credit card needed
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 800,
            lineHeight: 1.15,
            margin: "0 0 20px",
            color: "#0f0f0f",
            letterSpacing: "-0.02em",
          }}
        >
          A smarter announcement bar
          <br />
          <span style={{ color: "#2563eb" }}>that drives more sales</span>
        </h1>

        <p
          style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "#6b7280",
            maxWidth: 600,
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          Show a live free shipping progress goal that updates as customers
          shop. More items in cart, more revenue for you.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 56,
          }}
        >
          <a
            href="https://apps.shopify.com/announceplus"
            style={{
              background: "#2563eb",
              color: "#ffffff",
              padding: "14px 32px",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Install for free
          </a>
          <a
            href="#features"
            style={{
              background: "#f9fafb",
              color: "#0f0f0f",
              padding: "14px 32px",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-block",
              border: "1px solid #e5e7eb",
            }}
          >
            See features
          </a>
        </div>

        {/* ── BAR PREVIEW ── */}
        <div
          style={{
            maxWidth: 700,
            margin: "0 auto",
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              background: "#f5f5f5",
              padding: "10px 14px",
              display: "flex",
              gap: 6,
              alignItems: "center",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} />
            <div style={{ flex: 1, background: "#e5e7eb", borderRadius: 4, height: 18, marginLeft: 8 }} />
          </div>
          <div
            style={{
              background: "#1a1a1a",
              color: "#ffffff",
              padding: "12px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              Spend $20.00 more for free shipping!
            </span>
            <div
              style={{
                width: "100%",
                maxWidth: 400,
                height: 5,
                background: "rgba(255,255,255,0.15)",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div style={{ height: "100%", width: "60%", background: "#22c55e", borderRadius: 999 }} />
            </div>
          </div>
          <div style={{ background: "#ffffff", padding: "20px" }}>
            {[100, 80, 60].map((w, i) => (
              <div
                key={i}
                style={{
                  height: 10,
                  background: "#f3f4f6",
                  borderRadius: 5,
                  marginBottom: 10,
                  width: w + "%",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ background: "#f9fafb", padding: "80px 40px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 48,
              color: "#0f0f0f",
            }}
          >
            Everything you need to sell more
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                icon: "\uD83D\uDCCA",
                title: "Live progress bar",
                desc: "Updates in real time as customers add items to cart. No page reload. Nudges shoppers to spend just a little more.",
              },
              {
                icon: "\uD83C\uDFA8",
                title: "Fully customizable",
                desc: "Colors, messages, threshold, CTA button \u2014 all configurable from your Shopify admin without touching code.",
              },
              {
                icon: "\uD83D\uDCE2",
                title: "Announcement bar",
                desc: "Show flash sale alerts, promotions, and custom messages with a clean sticky bar at the top of your store.",
              },
              {
                icon: "\uD83D\uDCF1",
                title: "Mobile responsive",
                desc: "Looks great on every device. Automatically adjusts font size and bar height for mobile shoppers.",
              },
              {
                icon: "\u26A1",
                title: "No code needed",
                desc: "Install, configure, done. Add the bar to your theme in seconds from the Shopify theme editor.",
              },
              {
                icon: "\uD83C\uDD93",
                title: "Free to start",
                desc: "Get started for free with up to 2,000 monthly views. Upgrade to Pro for unlimited views and advanced features.",
              },
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: "24px",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#0f0f0f" }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding: "80px 40px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2
          style={{
            fontSize: "clamp(24px, 3vw, 36px)",
            fontWeight: 700,
            marginBottom: 12,
            color: "#0f0f0f",
          }}
        >
          Simple pricing
        </h2>
        <p style={{ fontSize: 16, color: "#6b7280", marginBottom: 40 }}>
          Start free. Upgrade when you need more.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {[
            {
              name: "Free",
              price: "$0",
              period: "forever",
              features: [
                "1 announcement bar",
                "Free shipping goal",
                "2,000 monthly views",
                "Basic customization",
                "Email support",
              ],
              cta: "Get started free",
              highlight: false,
            },
            {
              name: "Pro",
              price: "$9.99",
              period: "per month",
              features: [
                "Unlimited bars",
                "Unlimited views",
                "Scheduling",
                "Advanced targeting",
                "Priority support",
              ],
              cta: "Start free trial",
              highlight: true,
            },
          ].map((plan, i) => (
            <div
              key={i}
              style={{
                border: plan.highlight ? "2px solid #2563eb" : "1px solid #e5e7eb",
                borderRadius: 14,
                padding: "32px 24px",
                position: "relative",
                background: "#ffffff",
              }}
            >
              {plan.highlight && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#2563eb",
                    color: "#ffffff",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "3px 14px",
                    borderRadius: 20,
                  }}
                >
                  Most popular
                </div>
              )}
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{plan.name}</div>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: plan.highlight ? "#2563eb" : "#0f0f0f",
                  marginBottom: 4,
                }}
              >
                {plan.price}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>{plan.period}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", textAlign: "left" }}>
                {plan.features.map((f, fi) => (
                  <li
                    key={fi}
                    style={{
                      fontSize: 14,
                      color: "#374151",
                      padding: "6px 0",
                      borderBottom: "1px solid #f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: "#22c55e", fontWeight: 700 }}>{"\u2713"}</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="https://apps.shopify.com/announceplus"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "12px",
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 700,
                  textDecoration: "none",
                  background: plan.highlight ? "#2563eb" : "#f3f4f6",
                  color: plan.highlight ? "#ffffff" : "#0f0f0f",
                  border: plan.highlight ? "none" : "1px solid #e5e7eb",
                }}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOP LOGIN (for direct installs) ── */}
      {showForm && (
        <section
          style={{
            padding: "40px",
            maxWidth: 500,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <Form method="post" action="/auth/login" style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <input
              type="text"
              name="shop"
              placeholder="your-store.myshopify.com"
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 14,
                width: 280,
              }}
            />
            <button
              type="submit"
              style={{
                background: "#2563eb",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Log in
            </button>
          </Form>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid #f0f0f0",
          padding: "32px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 14, color: "#6b7280" }}>
          AnnouncePlus by Makerbase — 2025
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "Privacy policy", href: "https://makerbase.app/privacy" },
            { label: "Support", href: "mailto:support@makerbase.app" },
            { label: "Shopify App Store", href: "https://apps.shopify.com/announceplus" },
          ].map((l, i) => (
            <a
              key={i}
              href={l.href}
              style={{ fontSize: 14, color: "#6b7280", textDecoration: "none" }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
