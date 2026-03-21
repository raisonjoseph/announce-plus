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
  Banner,
  Box,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { syncPlanFromBilling } from "../plan.server";

export const loader = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);
  const shop = session.shop;
  const plan = await syncPlanFromBilling(billing, shop);
  return json({ plan, shop });
};

export default function PricingPage() {
  const { plan, shop } = useLoaderData();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        { text: "1 announcement bar", included: true },
        { text: "1 product shipping goal", included: true },
        { text: "2,000 monthly views", included: true },
        { text: "Page & visitor targeting", included: true },
        { text: "Cart state targeting", included: true },
        { text: "Email support", included: true },
        { text: "Running line & rotating", included: false },
        { text: "Advanced targeting", included: false },
        { text: "Scheduling", included: false },
      ],
    },
    {
      id: "starter",
      name: "Starter",
      monthlyPrice: 4.99,
      yearlyPrice: 3.99,
      yearlyTotal: 47.88,
      savePercent: 20,
      features: [
        { text: "3 announcement bars", included: true },
        { text: "3 product shipping goals", included: true },
        { text: "10,000 monthly views", included: true },
        { text: "URL & device targeting", included: true },
        { text: "Cart value & item rules", included: true },
        { text: "Scroll & delay triggers", included: true },
        { text: "Running line & rotating", included: true },
        { text: "Customer status targeting", included: true },
        { text: "Scheduling", included: false },
      ],
    },
    {
      id: "pro",
      name: "Pro",
      monthlyPrice: 9.99,
      yearlyPrice: 7.99,
      yearlyTotal: 95.88,
      savePercent: 20,
      highlight: true,
      features: [
        { text: "Unlimited bars & goals", included: true },
        { text: "Unlimited monthly views", included: true },
        { text: "Date & day scheduling", included: true },
        { text: "Customer tag targeting", included: true },
        { text: "Country & locale targeting", included: true },
        { text: "UTM / referral targeting", included: true },
        { text: "Exit intent trigger", included: true },
        { text: "Page view count trigger", included: true },
        { text: "Priority support", included: true },
      ],
    },
  ];

  return (
    <Page title="Pricing" backAction={{ url: "/app" }}>
      <Layout>
        <Layout.Section>
          <Banner tone="info">
            <p>
              You're on the <strong>{plan.name}</strong> plan.
              {plan.id !== "free"
                ? " All charges are handled through your Shopify bill."
                : " To upgrade, go to your Shopify admin → Apps → AnnouncePlus → choose a plan."}
            </p>
          </Banner>
        </Layout.Section>

        {/* Monthly / Yearly toggle */}
        <Layout.Section>
          <InlineStack align="center" gap="300" blockAlign="center">
            <Text as="span" variant="bodyMd" fontWeight={!isYearly ? "bold" : "regular"}>
              Monthly
            </Text>
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
              <Text as="span" variant="bodyMd" fontWeight={isYearly ? "bold" : "regular"}>
                Yearly
              </Text>
              <Badge tone="success">Save 20%</Badge>
            </InlineStack>
          </InlineStack>
        </Layout.Section>

        {/* Plan cards */}
        <Layout.Section>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px", alignItems: "stretch",
          }}>
            {plans.map((p) => {
              const isCurrent = plan.id === p.id;
              const displayPrice = isYearly ? p.yearlyPrice : p.monthlyPrice;

              return (
                <div key={p.id} style={{
                  border: p.highlight ? "2px solid #2563eb" : "1px solid #e2e8f0",
                  borderRadius: 12, padding: "24px", background: "#fff",
                  display: "flex", flexDirection: "column", position: "relative",
                }}>
                  {p.highlight && (
                    <div style={{
                      position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                      background: "#2563eb", color: "#fff", fontSize: 11, fontWeight: 700,
                      padding: "3px 14px", borderRadius: 20, whiteSpace: "nowrap",
                    }}>MOST POPULAR</div>
                  )}

                  <InlineStack align="space-between" blockAlign="center">
                    <Text variant="headingMd" as="h2">{p.name}</Text>
                    {isCurrent && <Badge tone="success">Current</Badge>}
                  </InlineStack>

                  <div style={{ marginTop: 16, marginBottom: 4 }}>
                    <InlineStack gap="100" blockAlign="end">
                      <Text variant="heading2xl" as="span">
                        ${displayPrice.toFixed(2)}
                      </Text>
                      {p.monthlyPrice > 0 && (
                        <Text variant="bodySm" as="span" tone="subdued">/mo</Text>
                      )}
                    </InlineStack>
                  </div>
                  <Text variant="bodySm" as="p" tone="subdued">
                    {p.monthlyPrice === 0
                      ? "Free forever"
                      : isYearly
                        ? `$${p.yearlyTotal.toFixed(2)}/year — save ${p.savePercent}%`
                        : "Billed monthly"}
                  </Text>

                  <div style={{ margin: "16px 0" }}><Divider /></div>

                  <div style={{ flex: 1 }}>
                    <BlockStack gap="200">
                      {p.features.map((f, i) => (
                        <InlineStack key={i} gap="200" blockAlign="center">
                          <span style={{
                            color: f.included ? "#22c55e" : "#d1d5db",
                            fontWeight: 700, fontSize: 14,
                          }}>
                            {f.included ? "\u2713" : "\u2715"}
                          </span>
                          <Text variant="bodySm" as="span" tone={f.included ? undefined : "subdued"}>
                            {f.text}
                          </Text>
                        </InlineStack>
                      ))}
                    </BlockStack>
                  </div>

                  <div style={{ marginTop: 20 }}>
                    {isCurrent ? (
                      <Button fullWidth disabled>Current plan</Button>
                    ) : (
                      <Button
                        fullWidth
                        variant={p.highlight ? "primary" : undefined}
                        onClick={() => {
                          if (window.shopify) {
                            window.shopify.toast.show("Redirecting to plan selection...");
                          }
                          open(`https://${shop}/admin/apps/announceplus`, "_top");
                        }}
                      >
                        {p.monthlyPrice > plan.price ? "Upgrade" : "Change"} to {p.name}
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
