import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Card, Banner, BlockStack } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

const DEFINITIONS = [
  {
    name: "AnnouncePlus Settings",
    namespace: "announceplus",
    key: "settings",
    type: "json",
    ownerType: "SHOP",
    access: { storefront: "PUBLIC_READ" },
  },
  {
    name: "AnnouncePlus Bars",
    namespace: "announceplus",
    key: "bars",
    type: "json",
    ownerType: "SHOP",
    access: { storefront: "PUBLIC_READ" },
  },
  {
    name: "AnnouncePlus App URL",
    namespace: "announceplus",
    key: "app_url",
    type: "single_line_text_field",
    ownerType: "SHOP",
    access: { storefront: "PUBLIC_READ" },
  },
];

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const results = [];

  for (const definition of DEFINITIONS) {
    const response = await admin.graphql(
      `#graphql
        mutation CreateMetafieldDefinition(
          $definition: MetafieldDefinitionInput!
        ) {
          metafieldDefinitionCreate(definition: $definition) {
            createdDefinition {
              id
              name
              namespace
              key
            }
            userErrors {
              field
              message
              code
            }
          }
        }`,
      { variables: { definition } },
    );

    const data = await response.json();
    const result = data.data.metafieldDefinitionCreate;

    if (result.userErrors?.length > 0) {
      const alreadyExists = result.userErrors.some(
        (e) => e.code === "TAKEN",
      );
      results.push({
        key: definition.key,
        success: alreadyExists,
        message: alreadyExists
          ? "Already exists"
          : result.userErrors.map((e) => e.message).join(", "),
      });
    } else {
      results.push({
        key: definition.key,
        success: true,
        message: "Created",
      });
    }
  }

  // Save the app URL as a shop metafield so storefront JS can reach the API
  const appUrl = process.env.SHOPIFY_APP_URL || "";
  if (appUrl) {
    const shopIdRes = await admin.graphql(
      `#graphql
        query GetShopId { shop { id } }`,
    );
    const shopIdData = await shopIdRes.json();
    const shopId = shopIdData.data.shop.id;

    await admin.graphql(
      `#graphql
        mutation SetAppUrl($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields { key }
            userErrors { field message }
          }
        }`,
      {
        variables: {
          metafields: [
            {
              ownerId: shopId,
              namespace: "announceplus",
              key: "app_url",
              type: "single_line_text_field",
              value: appUrl,
            },
          ],
        },
      },
    );
    results.push({ key: "app_url_value", success: true, message: "Saved: " + appUrl });
  }

  const allSuccess = results.every((r) => r.success);

  return json({ success: allSuccess, results });
};

export default function Setup() {
  const data = useLoaderData();

  return (
    <Page title="AnnouncePlus Setup" narrowWidth>
      <BlockStack gap="400">
        {data.success ? (
          <Card>
            <Banner tone="success" title="Metafield definitions ready">
              <p>
                {data.results.map((r) => `${r.key}: ${r.message}`).join(" | ")}
              </p>
              <p>You can close this page.</p>
            </Banner>
          </Card>
        ) : (
          <Card>
            <Banner tone="critical" title="Setup had errors">
              {data.results.map((r, i) => (
                <p key={i}>
                  {r.key}: {r.message}
                </p>
              ))}
            </Banner>
          </Card>
        )}
      </BlockStack>
    </Page>
  );
}
