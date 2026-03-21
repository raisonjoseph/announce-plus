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
  Banner,
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
  const shopSlug = shop.replace(".myshopify.com", "");
  const pricingUrl = `https://admin.shopify.com/store/${shopSlug}/charges/announceplus/pricing_plans`;

  function handleUpgrade() {
    window.top.location.href = pricingUrl;
  }

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

        {/* Upgrade banner for free/starter */}
        {plan.id !== "pro" && (
          <Layout.Section>
            <Banner
              title={plan.id === "free" ? "Unlock more with Starter or Pro" : "Get unlimited with Pro"}
              tone="info"
              action={{ content: "View plans", onAction: handleUpgrade }}
            >
              <p>
                {plan.id === "free"
                  ? "Upgrade to get more bars, views, running marquee, device targeting, cart value rules, and scheduling."
                  : "Upgrade to Pro for unlimited bars and views, scheduling, country targeting, exit intent, and priority support."}
              </p>
            </Banner>
          </Layout.Section>
        )}

        {/* Plan comparison */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">Plan comparison</Text>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                      <th style={{ textAlign: "left", padding: "10px 8px", color: "#64748b", fontWeight: 600 }}>Feature</th>
                      {[
                        { name: "Free", price: "$0" },
                        { name: "Starter", price: "$4.99/mo" },
                        { name: "Pro", price: "$9.99/mo" },
                      ].map((p, i) => (
                        <th key={i} style={{
                          textAlign: "center", padding: "10px 8px",
                          color: plan.name === p.name ? "#2563eb" : "#64748b",
                          fontWeight: 700,
                        }}>
                          {p.name}
                          <div style={{ fontSize: 11, fontWeight: 400, color: "#94a3b8" }}>{p.price}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { f: "Announcement bars", free: "1", starter: "3", pro: "\u221E" },
                      { f: "Product shipping goals", free: "1", starter: "3", pro: "\u221E" },
                      { f: "Monthly views", free: "2K", starter: "10K", pro: "\u221E" },
                      { f: "Running marquee", free: false, starter: true, pro: true },
                      { f: "Rotating messages", free: false, starter: true, pro: true },
                      { f: "Device targeting", free: false, starter: true, pro: true },
                      { f: "URL targeting", free: false, starter: true, pro: true },
                      { f: "Cart value rules", free: false, starter: true, pro: true },
                      { f: "Scroll & delay", free: false, starter: true, pro: true },
                      { f: "Date scheduling", free: false, starter: false, pro: true },
                      { f: "Customer tags", free: false, starter: false, pro: true },
                      { f: "Country targeting", free: false, starter: false, pro: true },
                      { f: "UTM targeting", free: false, starter: false, pro: true },
                      { f: "Exit intent", free: false, starter: false, pro: true },
                      { f: "Priority support", free: false, starter: false, pro: true },
                    ].map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "8px", color: "#334155" }}>{row.f}</td>
                        {["free", "starter", "pro"].map((p) => (
                          <td key={p} style={{ textAlign: "center", padding: "8px" }}>
                            {typeof row[p] === "boolean"
                              ? row[p]
                                ? <span style={{ color: "#22c55e", fontWeight: 700 }}>{"\u2713"}</span>
                                : <span style={{ color: "#d1d5db" }}>{"\u2015"}</span>
                              : <span style={{ fontWeight: 600, color: "#334155" }}>{row[p]}</span>
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {plan.id !== "pro" && (
                <InlineStack align="end">
                  <Button variant="primary" onClick={handleUpgrade}>
                    Upgrade now
                  </Button>
                </InlineStack>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
