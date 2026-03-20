import { json } from "@remix-run/node";
import { useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
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
import { PLANS } from "../plans";

export const loader = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);
  const shop = session.shop;

  // Sync DB with actual Shopify billing state on every load
  const plan = await syncPlanFromBilling(billing, shop);

  return json({ plan, shop });
};

export const action = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "subscribe") {
    const planName = formData.get("plan");

    // billing.request throws a redirect to Shopify's confirmation page
    await billing.request({
      plan: planName,
      isTest: true,
    });

    // This line is never reached — the redirect happens above
    return null;
  }

  if (actionType === "cancel") {
    const subscriptionId = formData.get("chargeId");

    if (subscriptionId) {
      await billing.cancel({
        subscriptionId,
        isTest: true,
        prorate: true,
      });
    }

    const { updateShopPlan } = await import("../plan.server");
    await updateShopPlan(session.shop, "free", null);

    return json({ success: true, cancelled: true });
  }

  return json({ success: false });
};

export default function PricingPage() {
  const { plan } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const isLoading = navigation.state === "submitting";

  function handleSubscribe(planName) {
    const formData = new FormData();
    formData.set("_action", "subscribe");
    formData.set("plan", planName);
    submit(formData, { method: "POST" });
  }

  function handleCancel() {
    if (!confirm("Cancel your subscription? You'll be downgraded to the Free plan.")) return;
    const formData = new FormData();
    formData.set("_action", "cancel");
    formData.set("chargeId", plan.chargeId || "");
    submit(formData, { method: "POST" });
  }

  const plans = [
    {
      id: "free",
      ...PLANS.free,
      featureList: [
        "1 announcement bar",
        "2,000 monthly views",
        "Page & visitor targeting",
        "Cart state targeting",
        "Email support",
      ],
    },
    {
      id: "starter",
      ...PLANS.starter,
      featureList: [
        "3 announcement bars",
        "10,000 monthly views",
        "URL targeting",
        "Device targeting",
        "Cart value & item rules",
        "Scroll & delay triggers",
        "Running line & rotating",
      ],
    },
    {
      id: "pro",
      ...PLANS.pro,
      featureList: [
        "Unlimited bars",
        "Unlimited views",
        "Date scheduling",
        "Customer tag targeting",
        "Country targeting",
        "UTM / referral targeting",
        "Exit intent trigger",
        "Priority support",
      ],
    },
  ];

  return (
    <Page title="Pricing" backAction={{ url: "/app" }}>
      <Layout>
        <Layout.Section>
          <Banner tone="info">
            <p>
              You're currently on the <strong>{plan.name}</strong> plan.
              {plan.id !== "free" && " All charges are handled through your Shopify bill."}
            </p>
          </Banner>
        </Layout.Section>

        <Layout.Section>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {plans.map((p) => {
              const isCurrent = plan.id === p.id;
              const isUpgrade =
                (plan.id === "free" && p.id !== "free") ||
                (plan.id === "starter" && p.id === "pro");
              const isDowngrade =
                (plan.id === "pro" && p.id !== "pro") ||
                (plan.id === "starter" && p.id === "free");

              return (
                <Card key={p.id}>
                  <BlockStack gap="400">
                    <InlineStack align="space-between" blockAlign="center">
                      <Text variant="headingMd" as="h2">
                        {p.name}
                      </Text>
                      {isCurrent && <Badge tone="success">Current</Badge>}
                      {p.id === "pro" && !isCurrent && <Badge>Popular</Badge>}
                    </InlineStack>

                    <BlockStack gap="100">
                      <Text variant="heading2xl" as="p">
                        ${p.price.toFixed(2)}
                      </Text>
                      <Text variant="bodySm" as="p" tone="subdued">
                        {p.price === 0 ? "forever" : "per month"}
                      </Text>
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="200">
                      {p.featureList.map((f, i) => (
                        <InlineStack key={i} gap="200" blockAlign="center">
                          <span style={{ color: "#22c55e", fontWeight: 700 }}>
                            {"\u2713"}
                          </span>
                          <Text variant="bodySm" as="span">
                            {f}
                          </Text>
                        </InlineStack>
                      ))}
                    </BlockStack>

                    <Box paddingBlockStart="200">
                      {isCurrent ? (
                        plan.id !== "free" ? (
                          <Button
                            fullWidth
                            tone="critical"
                            variant="plain"
                            onClick={handleCancel}
                            loading={isLoading}
                          >
                            Cancel subscription
                          </Button>
                        ) : (
                          <Button fullWidth disabled>
                            Current plan
                          </Button>
                        )
                      ) : isUpgrade ? (
                        <Button
                          fullWidth
                          variant="primary"
                          onClick={() => handleSubscribe(p.billingName)}
                          loading={isLoading}
                        >
                          Upgrade to {p.name}
                        </Button>
                      ) : isDowngrade ? (
                        <Button
                          fullWidth
                          onClick={() =>
                            p.id === "free"
                              ? handleCancel()
                              : handleSubscribe(p.billingName)
                          }
                          loading={isLoading}
                        >
                          Downgrade to {p.name}
                        </Button>
                      ) : null}
                    </Box>
                  </BlockStack>
                </Card>
              );
            })}
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
