import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Badge,
  Divider,
  ProgressBar,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { getShopPlan, getMonthlyViewCount } from "../plan.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const plan = await getShopPlan(shop);
  const viewCount = await getMonthlyViewCount(shop);
  return json({ plan, shop, viewCount });
};

export default function PricingPage() {
  const { plan, shop, viewCount } = useLoaderData();
  const [isYearly, setIsYearly] = useState(false);
  const shopSlug = shop.replace(".myshopify.com", "");

  function handleUpgrade() {
    window.top.location.href =
      `https://admin.shopify.com/store/${shopSlug}/charges/announceplus/pricing_plans`;
  }

  const plans = [
    {
      id: "free",
      name: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      desc: "For stores getting started",
      features: [
        { text: "1 announcement bar", ok: true },
        { text: "1 product shipping goal", ok: true },
        { text: "2,000 monthly views", ok: true },
        { text: "Page & visitor targeting", ok: true },
        { text: "Cart state targeting", ok: true },
        { text: "Email support", ok: true },
        { text: "Running line & rotating", ok: false },
        { text: "Advanced targeting", ok: false },
        { text: "Scheduling", ok: false },
      ],
    },
    {
      id: "starter",
      name: "Starter",
      monthlyPrice: 4.99,
      yearlyPrice: 3.99,
      yearlyTotal: 47.88,
      desc: "For growing stores",
      features: [
        { text: "3 bars & goals", ok: true },
        { text: "10,000 monthly views", ok: true },
        { text: "URL & device targeting", ok: true },
        { text: "Cart value & item rules", ok: true },
        { text: "Running line & rotating", ok: true },
        { text: "Scroll & delay triggers", ok: true },
        { text: "Customer status targeting", ok: true },
        { text: "Scheduling", ok: false },
        { text: "Country & tag targeting", ok: false },
      ],
    },
    {
      id: "pro",
      name: "Pro",
      monthlyPrice: 9.99,
      yearlyPrice: 7.99,
      yearlyTotal: 95.88,
      desc: "For serious stores",
      highlight: true,
      features: [
        { text: "Unlimited bars & views", ok: true },
        { text: "Everything in Starter", ok: true },
        { text: "Date & day scheduling", ok: true },
        { text: "Customer tag targeting", ok: true },
        { text: "Country targeting", ok: true },
        { text: "UTM / referral targeting", ok: true },
        { text: "Exit intent trigger", ok: true },
        { text: "Page view trigger", ok: true },
        { text: "Priority support", ok: true },
      ],
    },
  ];

  return (
    <Page title="Plan & billing" backAction={{ url: "/app" }}>
      <Layout>
        {/* Current plan + usage */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <InlineStack gap="200" blockAlign="center">
                  <Text variant="headingLg" as="h2">{plan.name} plan</Text>
                  <Badge tone="success">Active</Badge>
                </InlineStack>
                {plan.id !== "pro" && (
                  <Button variant="primary" onClick={handleUpgrade}>
                    Upgrade
                  </Button>
                )}
              </InlineStack>
              <Divider />
              <InlineStack align="space-between">
                <Text variant="bodyMd" as="span">Monthly views</Text>
                <Text variant="bodyMd" as="span" fontWeight="bold">
                  {viewCount.toLocaleString()} / {plan.maxMonthlyViews === Infinity ? "\u221E" : plan.maxMonthlyViews.toLocaleString()}
                </Text>
              </InlineStack>
              {plan.maxMonthlyViews !== Infinity && (
                <ProgressBar
                  progress={Math.min((viewCount / plan.maxMonthlyViews) * 100, 100)}
                  size="small"
                  tone={viewCount >= plan.maxMonthlyViews * 0.9 ? "critical" : undefined}
                />
              )}
              <InlineStack align="space-between">
                <Text variant="bodyMd" as="span">Announcement bars</Text>
                <Text variant="bodyMd" as="span" fontWeight="bold">
                  {plan.maxBars === Infinity ? "Unlimited" : plan.maxBars}
                </Text>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Toggle */}
        <Layout.Section>
          <InlineStack align="center" gap="300" blockAlign="center">
            <Text as="span" variant="bodyMd" fontWeight={!isYearly ? "bold" : "regular"}>Monthly</Text>
            <div
              onClick={() => setIsYearly(!isYearly)}
              style={{
                width: 48, height: 26, borderRadius: 13,
                background: isYearly ? "#2563eb" : "#c4c4c4",
                position: "relative", cursor: "pointer", transition: "background 0.2s",
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: "50%", background: "#fff",
                position: "absolute", top: 3, left: isYearly ? 25 : 3,
                transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }} />
            </div>
            <InlineStack gap="100" blockAlign="center">
              <Text as="span" variant="bodyMd" fontWeight={isYearly ? "bold" : "regular"}>Yearly</Text>
              <Badge tone="success">Save 20%</Badge>
            </InlineStack>
          </InlineStack>
        </Layout.Section>

        {/* Plan cards */}
        <Layout.Section>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, alignItems: "stretch" }}>
            {plans.map((p) => {
              const isCurrent = plan.id === p.id;
              const displayPrice = isYearly ? p.yearlyPrice : p.monthlyPrice;

              return (
                <div key={p.id} style={{
                  border: p.highlight ? "2px solid #2563eb" : "1px solid #e2e8f0",
                  borderRadius: 12, padding: 24, background: "#fff",
                  display: "flex", flexDirection: "column", position: "relative",
                }}>
                  {p.highlight && (
                    <div style={{
                      position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                      background: "#2563eb", color: "#fff", fontSize: 11, fontWeight: 700,
                      padding: "3px 14px", borderRadius: 20,
                    }}>MOST POPULAR</div>
                  )}

                  <InlineStack align="space-between" blockAlign="center">
                    <Text variant="headingMd" as="h2">{p.name}</Text>
                    {isCurrent && <Badge tone="success">Current</Badge>}
                  </InlineStack>
                  <Text variant="bodySm" as="p" tone="subdued">{p.desc}</Text>

                  <div style={{ marginTop: 12, marginBottom: 4 }}>
                    <InlineStack gap="100" blockAlign="end">
                      <Text variant="heading2xl" as="span">${displayPrice.toFixed(2)}</Text>
                      {p.monthlyPrice > 0 && <Text variant="bodySm" as="span" tone="subdued">/mo</Text>}
                    </InlineStack>
                  </div>
                  <Text variant="bodySm" as="p" tone="subdued">
                    {p.monthlyPrice === 0 ? "Free forever" : isYearly ? `$${p.yearlyTotal.toFixed(2)}/year — save 20%` : "Billed monthly"}
                  </Text>

                  <div style={{ margin: "16px 0" }}><Divider /></div>

                  <div style={{ flex: 1 }}>
                    <BlockStack gap="150">
                      {p.features.map((f, i) => (
                        <InlineStack key={i} gap="200" blockAlign="center">
                          <span style={{ color: f.ok ? "#22c55e" : "#d1d5db", fontWeight: 700, fontSize: 13 }}>
                            {f.ok ? "\u2713" : "\u2715"}
                          </span>
                          <Text variant="bodySm" as="span" tone={f.ok ? undefined : "subdued"}>{f.text}</Text>
                        </InlineStack>
                      ))}
                    </BlockStack>
                  </div>

                  <div style={{ marginTop: 20 }}>
                    {isCurrent ? (
                      <Button fullWidth disabled>Current plan</Button>
                    ) : p.monthlyPrice > plan.price ? (
                      <Button fullWidth variant={p.highlight ? "primary" : undefined} onClick={handleUpgrade}>
                        Upgrade to {p.name}
                      </Button>
                    ) : (
                      <Button fullWidth onClick={handleUpgrade}>
                        Change to {p.name}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
