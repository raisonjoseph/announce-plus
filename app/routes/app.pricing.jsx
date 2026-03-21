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
  const shopSlug = shop.replace(".myshopify.com", "");

  function handleChangePlan() {
    window.top.location.href =
      `https://admin.shopify.com/store/${shopSlug}/charges/announceplus/pricing_plans`;
  }

  return (
    <Page title="Plan & billing" backAction={{ url: "/app" }}>
      <Layout>
        {/* Current plan */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="100">
                  <InlineStack gap="200" blockAlign="center">
                    <Text variant="headingLg" as="h2">{plan.name}</Text>
                    <Badge tone="success">Active</Badge>
                  </InlineStack>
                  <Text variant="bodySm" as="p" tone="subdued">
                    {plan.price === 0
                      ? "Free forever — no credit card needed"
                      : `$${plan.price.toFixed(2)}/month — billed through Shopify`}
                  </Text>
                </BlockStack>
                <Button variant="primary" onClick={handleChangePlan}>
                  {plan.id === "free" ? "Upgrade plan" : "Change plan"}
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Usage */}
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h2">Usage this month</Text>
              <BlockStack gap="200">
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
              </BlockStack>
              <Divider />
              <InlineStack align="space-between">
                <Text variant="bodyMd" as="span">Announcement bars</Text>
                <Text variant="bodyMd" as="span" fontWeight="bold">
                  {plan.maxBars === Infinity ? "Unlimited" : plan.maxBars}
                </Text>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* What's included */}
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h2">What's included in {plan.name}</Text>
              <BlockStack gap="200">
                {getIncludedFeatures(plan.id).map((f, i) => (
                  <InlineStack key={i} gap="200" blockAlign="center">
                    <span style={{ color: "#22c55e", fontWeight: 700 }}>{"\u2713"}</span>
                    <Text variant="bodySm" as="span">{f}</Text>
                  </InlineStack>
                ))}
              </BlockStack>
              {plan.id !== "pro" && (
                <>
                  <Divider />
                  <Button onClick={handleChangePlan}>
                    See all plans
                  </Button>
                </>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function getIncludedFeatures(planId) {
  const features = {
    free: [
      "1 announcement bar",
      "1 product shipping goal",
      "2,000 monthly views",
      "Page & visitor targeting",
      "Cart state targeting",
      "Customizable colors & fonts",
      "Email support",
    ],
    starter: [
      "3 announcement bars & goals",
      "10,000 monthly views",
      "Everything in Free",
      "URL & device targeting",
      "Cart value & item rules",
      "Scroll & delay triggers",
      "Running line & rotating messages",
      "Customer status targeting",
    ],
    pro: [
      "Unlimited bars, goals & views",
      "Everything in Starter",
      "Date & day scheduling",
      "Customer tag targeting",
      "Country & locale targeting",
      "UTM / referral targeting",
      "Exit intent trigger",
      "Priority support",
    ],
  };
  return features[planId] || features.free;
}
