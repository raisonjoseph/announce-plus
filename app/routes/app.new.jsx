import { useNavigate } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
} from "@shopify/polaris";

export default function NewAnnouncementPage() {
  const navigate = useNavigate();

  return (
    <Page
      title="New announcement"
      backAction={{ onAction: () => navigate("/app") }}
    >
      <Layout>
        <Layout.Section>
          <Text variant="headingMd" as="h2">
            Select an announcement type
          </Text>
        </Layout.Section>

        <Layout.Section>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, 320px)",
              gap: "16px",
            }}
          >
            {/* Card 1: Top/Bottom bar */}
            <Card>
              <BlockStack gap="400">
                <img src="/thumbnails/thumbnail-topbar.svg"
                  alt="Top bar preview"
                  style={{ width: "100%", borderRadius: "8px" }} />
                <BlockStack gap="100">
                  <Text variant="headingMd" as="h3">
                    Top/Bottom bar
                  </Text>
                  <Text tone="subdued" as="p">
                    Fixed or sticky bar on the top or bottom of any page.
                  </Text>
                </BlockStack>
                <Button
                  fullWidth
                  onClick={() =>
                    navigate("/app/announcement/new?type=topbar")
                  }
                >
                  Select
                </Button>
              </BlockStack>
            </Card>

            {/* Card 2: Free shipping goal */}
            <Card>
              <BlockStack gap="400">
                <img src="/thumbnails/thumbnail-shipping-goal.svg"
                  alt="Top bar preview"
                  style={{ width: "100%", borderRadius: "8px" }} />
                <BlockStack gap="100">
                  <Text variant="headingMd" as="h3">
                    Free shipping goal
                  </Text>
                  <Text tone="subdued" as="p">
                    Show a progress bar toward free shipping to increase
                    average order value.
                  </Text>
                </BlockStack>
                <Button
                  fullWidth
                  onClick={() =>
                    navigate("/app/announcement/new?type=shipping_goal")
                  }
                >
                  Select
                </Button>
              </BlockStack>
            </Card>

            {/* Card 3: Product Shipping Goal */}
            <Card>
              <BlockStack gap="400">
                <div
                  style={{
                    background: "#f8fafc",
                    borderRadius: "8px",
                    padding: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ fontSize: "13px", color: "#1e293b", textAlign: "center", marginBottom: "6px" }}>
                    Free shipping for orders over $50!
                  </div>
                  <div
                    style={{
                      height: "4px",
                      background: "#e2e8f0",
                      borderRadius: "999px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: "40%",
                        background: "#22c55e",
                        borderRadius: "999px",
                      }}
                    />
                  </div>
                </div>
                <BlockStack gap="100">
                  <Text variant="headingMd" as="h3">
                    Product shipping goal
                  </Text>
                  <Text tone="subdued" as="p">
                    Inline progress bar below the Add to Cart button on
                    product pages. Target specific products or collections.
                  </Text>
                </BlockStack>
                <Button
                  fullWidth
                  onClick={() =>
                    navigate("/app/announcement/new?type=product_shipping_goal")
                  }
                >
                  Select
                </Button>
              </BlockStack>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
