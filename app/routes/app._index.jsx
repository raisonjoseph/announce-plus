import { useState, useCallback, useEffect } from "react";
import { json } from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Button,
  ButtonGroup,
  Badge,
  IndexTable,
  EmptyState,
  ProgressBar,
  Link,
  Banner,
} from "@shopify/polaris";
import {
  XSmallIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@shopify/polaris-icons";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { getShopPlan, getMonthlyViewCount } from "../plan.server";

// ─── Loader ─────────────────────────────────────────

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;

  const announcements = await prisma.announcement.findMany({
    where: { shop },
    orderBy: { createdAt: "desc" },
  });

  const shopPlan = await getShopPlan(shop);
  const monthlyViewCount = await getMonthlyViewCount(shop);

  // Find or create setup progress
  let setup = await prisma.setupProgress.findUnique({
    where: { shop },
  });

  if (!setup) {
    setup = await prisma.setupProgress.create({
      data: { shop },
    });
  }

  // Auto-mark barCreated if any announcements exist
  if (announcements.length > 0 && !setup.barCreated) {
    setup = await prisma.setupProgress.update({
      where: { shop },
      data: { barCreated: true },
    });
  }

  const isDev = process.env.NODE_ENV !== "production";

  return json({
    announcements,
    shop,
    apiKey: process.env.SHOPIFY_API_KEY || "",
    isDev,
    plan: shopPlan,
    viewLimit: shopPlan.maxMonthlyViews,
    viewCount: monthlyViewCount,
    setup,
  });
};

// ─── Action ─────────────────────────────────────────

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "delete") {
    const id = formData.get("id");
    await prisma.announcement.deleteMany({
      where: { id, shop },
    });
    return json({ success: true });
  }

  if (actionType === "toggle") {
    const id = formData.get("id");
    const announcement = await prisma.announcement.findFirst({
      where: { id, shop },
    });
    if (announcement) {
      await prisma.announcement.update({
        where: { id },
        data: {
          status:
            announcement.status === "published" ? "draft" : "published",
        },
      });
    }
    return json({ success: true });
  }

  if (actionType === "setup_embed_done") {
    await prisma.setupProgress.update({
      where: { shop },
      data: { embedActivated: true },
    });
    return json({ success: true });
  }

  if (actionType === "setup_confirmed") {
    await prisma.setupProgress.update({
      where: { shop },
      data: { barConfirmed: true },
    });
    return json({ success: true });
  }

  if (actionType === "setup_dismiss") {
    await prisma.setupProgress.update({
      where: { shop },
      data: { dismissed: true },
    });
    return json({ success: true });
  }

  return json({ success: false });
};

// ─── Setup Guide Component ──────────────────────────

function SetupGuide({ setup, shop, apiKey, isDev, onAction }) {
  const navigate = useNavigate();

  // Embed verification state
  const [embedChecking, setEmbedChecking] = useState(false);
  const [embedError, setEmbedError] = useState(null);
  const [embedSuccess, setEmbedSuccess] = useState(false);

  async function verifyEmbed() {
    setEmbedChecking(true);
    setEmbedError(null);

    try {
      const res = await fetch("/api/verify-embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.verified) {
        setEmbedSuccess(true);
        setTimeout(() => {
          onAction("setup_embed_done");
        }, 1000);
      } else {
        setEmbedError(data.message);
      }
    } catch (e) {
      setEmbedError("Could not verify. Please try again.");
    } finally {
      setEmbedChecking(false);
    }
  }

  const themeEditorUrl =
    `https://${shop}/admin/themes/current/editor?context=apps` +
    (apiKey ? `&activateAppId=${apiKey}/announceplus-bar` : "");

  const steps = [
    {
      id: "embed",
      title: "Activate app embed in Shopify",
      description:
        "Go to your theme editor \u2192 click App embeds in the left panel \u2192 toggle AnnouncePlus on \u2192 click Save. Then come back and click \u2018I have done it\u2019 to verify.",
      done: setup.embedActivated,
      devNote: isDev,
    },
    {
      id: "bar",
      title: "Create your first announcement bar",
      description:
        "Create an announcement bar to show messages on your store.",
      done: setup.barCreated,
      actions: [
        {
          label: "Create announcement",
          primary: true,
          navigateTo: "/app/new",
        },
      ],
    },
    {
      id: "confirm",
      title: "Confirm your announcement is working",
      description:
        "Visit your store and check that the announcement bar is showing correctly.",
      done: setup.barConfirmed,
      actions: [
        {
          label: "View my store",
          primary: true,
          url: `https://${shop}`,
        },
        {
          label: "Looks good!",
          primary: false,
          actionId: "setup_confirmed",
        },
      ],
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;
  const progress = (completedCount / steps.length) * 100;

  const firstIncomplete = steps.findIndex((s) => !s.done);
  const [expandedStep, setExpandedStep] = useState(firstIncomplete);
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-advance to the next incomplete step when one completes
  useEffect(() => {
    if (firstIncomplete !== -1) {
      setExpandedStep(firstIncomplete);
    }
  }, [firstIncomplete]);

  if (setup.dismissed) return null;

  // All steps done — show rate prompt
  if (allDone) {
    return (
      <Card>
        <BlockStack gap="400">
          <InlineStack align="space-between" blockAlign="start">
            <BlockStack gap="100">
              <Text variant="headingMd" as="h2">
                You're all set!
              </Text>
              <Text tone="subdued" variant="bodySm" as="p">
                AnnouncePlus is live on your store. If you're enjoying the
                app, we'd love a review!
              </Text>
            </BlockStack>
            <Button
              variant="tertiary"
              icon={XSmallIcon}
              onClick={() => onAction("setup_dismiss")}
              accessibilityLabel="Dismiss"
            />
          </InlineStack>
          <InlineStack gap="300" blockAlign="center">
            <Button
              variant="primary"
              url={`https://${shop}/admin/apps/reviews?app_id=announceplus`}
              target="_blank"
            >
              Rate AnnouncePlus
            </Button>
            <Button onClick={() => onAction("setup_dismiss")}>
              Maybe later
            </Button>
          </InlineStack>
        </BlockStack>
      </Card>
    );
  }

  // Render a step's action buttons
  function renderStepActions(step, index) {
    // Special handling for embed step
    if (step.id === "embed") {
      return (
        <BlockStack gap="200">
          <InlineStack gap="200">
            <Button variant="primary" url={themeEditorUrl} target="_blank">
              Open theme settings
            </Button>
            <Button
              variant="secondary"
              onClick={verifyEmbed}
              loading={embedChecking}
              disabled={embedChecking}
            >
              {embedChecking ? "Checking..." : "I have done it"}
            </Button>
          </InlineStack>
          {embedError && (
            <Banner tone="critical">
              <BlockStack gap="200">
                <Text variant="bodySm" as="p">
                  {embedError}
                </Text>
                <Button
                  size="slim"
                  url={themeEditorUrl}
                  target="_blank"
                >
                  Open theme editor
                </Button>
              </BlockStack>
            </Banner>
          )}
          {embedSuccess && (
            <Banner tone="success">
              <Text variant="bodySm" as="p">
                {isDev
                  ? "Marked as done. In production, this verifies your embed is live."
                  : "App embed verified and active!"}
              </Text>
            </Banner>
          )}
        </BlockStack>
      );
    }

    // Generic actions for other steps
    if (!step.actions) return null;
    return (
      <InlineStack gap="200">
        {step.actions.map((act, ai) => {
          if (act.url) {
            return (
              <Button
                key={ai}
                variant={act.primary ? "primary" : "secondary"}
                url={act.url}
                target="_blank"
              >
                {act.label}
              </Button>
            );
          }
          if (act.navigateTo) {
            return (
              <Button
                key={ai}
                variant={act.primary ? "primary" : "secondary"}
                onClick={() => navigate(act.navigateTo)}
              >
                {act.label}
              </Button>
            );
          }
          return (
            <Button
              key={ai}
              variant={act.primary ? "primary" : "secondary"}
              onClick={(e) => {
                e.stopPropagation();
                onAction(act.actionId);
              }}
            >
              {act.label}
            </Button>
          );
        })}
      </InlineStack>
    );
  }

  return (
    <Card>
      <BlockStack gap="400">
        {/* Header row */}
        <InlineStack align="space-between" blockAlign="start">
          <BlockStack gap="100">
            <Text variant="headingMd" as="h2">
              Setup guide
            </Text>
            <Text tone="subdued" variant="bodySm" as="p">
              Follow these steps to start using AnnouncePlus.
            </Text>
          </BlockStack>
          <InlineStack gap="100">
            <Button
              variant="tertiary"
              icon={isMinimized ? ChevronDownIcon : ChevronUpIcon}
              onClick={() => setIsMinimized(!isMinimized)}
              accessibilityLabel={isMinimized ? "Expand" : "Minimize"}
            />
            <Button
              variant="tertiary"
              icon={XSmallIcon}
              onClick={() => onAction("setup_dismiss")}
              accessibilityLabel="Dismiss setup guide"
            />
          </InlineStack>
        </InlineStack>

        {/* Progress bar */}
        {!isMinimized && (
          <BlockStack gap="100">
            <Text variant="bodySm" as="p" tone="subdued">
              {completedCount} / {steps.length} steps completed
            </Text>
            <ProgressBar progress={progress} size="small" />
          </BlockStack>
        )}

        {/* Steps list */}
        {!isMinimized && (
          <BlockStack gap="0">
            {steps.map((step, index) => (
              <div
                key={step.id}
                style={{
                  padding: "12px 0",
                  borderTop: index > 0 ? "1px solid #e3e3e3" : "none",
                }}
              >
                <div
                  style={{ cursor: step.done ? "default" : "pointer" }}
                  onClick={() => {
                    if (!step.done) {
                      setExpandedStep(
                        expandedStep === index ? -1 : index,
                      );
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !step.done) {
                      setExpandedStep(
                        expandedStep === index ? -1 : index,
                      );
                    }
                  }}
                >
                  <InlineStack gap="300" blockAlign="start">
                    {/* Step icon */}
                    <div style={{ marginTop: "2px", flexShrink: 0 }}>
                      {step.done ? (
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: "#22c55e",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              color: "#fff",
                              fontSize: "12px",
                              fontWeight: "bold",
                              lineHeight: 1,
                            }}
                          >
                            ✓
                          </span>
                        </div>
                      ) : (
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            border: "2px dashed #aaa",
                          }}
                        />
                      )}
                    </div>

                    <BlockStack gap="200">
                      <Text
                        as="span"
                        fontWeight={step.done ? "regular" : "semibold"}
                        tone={step.done ? "subdued" : undefined}
                        textDecorationLine={
                          step.done ? "line-through" : undefined
                        }
                      >
                        {step.title}
                      </Text>

                      {/* Expanded content */}
                      {expandedStep === index && !step.done && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <BlockStack gap="300">
                            <Text tone="subdued" variant="bodySm" as="p">
                              {step.description}
                            </Text>
                            {step.devNote && (
                              <Text variant="bodySm" as="p" tone="caution">
                                Development mode — verification is bypassed.
                                After publishing your app, this will check
                                your theme embed status automatically.
                              </Text>
                            )}
                            {renderStepActions(step, index)}
                          </BlockStack>
                        </div>
                      )}
                    </BlockStack>
                  </InlineStack>
                </div>
              </div>
            ))}
          </BlockStack>
        )}
      </BlockStack>
    </Card>
  );
}

// ─── Dashboard Page ─────────────────────────────────

export default function DashboardPage() {
  const { announcements, shop, apiKey, isDev, plan, viewLimit, viewCount, setup } =
    useLoaderData();
  const navigate = useNavigate();
  const submit = useSubmit();

  const handleSetupAction = useCallback(
    (actionId) => {
      const formData = new FormData();
      formData.set("_action", actionId);
      submit(formData, { method: "POST" });
    },
    [submit],
  );

  const handleDelete = useCallback(
    (id) => {
      if (!confirm("Delete this announcement?")) return;
      const formData = new FormData();
      formData.set("_action", "delete");
      formData.set("id", id);
      submit(formData, { method: "POST" });
    },
    [submit],
  );

  const handleToggle = useCallback(
    (id) => {
      const formData = new FormData();
      formData.set("_action", "toggle");
      formData.set("id", id);
      submit(formData, { method: "POST" });
    },
    [submit],
  );

  const placementLabels = {
    all_pages: "Every page",
    homepage: "Homepage only",
    collections: "Collection pages",
    products: "Product pages",
  };

  return (
    <Page
      title="Announcements"
      primaryAction={{
        content: "New announcement",
        onAction: () => navigate("/app/new"),
      }}
    >
      <Layout>
        {/* Setup guide — first section */}
        {!setup.dismissed && (
          <Layout.Section>
            <SetupGuide
              setup={setup}
              shop={shop}
              apiKey={apiKey}
              isDev={isDev}
              onAction={handleSetupAction}
            />
          </Layout.Section>
        )}

        {/* Plan usage card */}
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text as="p" variant="bodyMd">
                You're currently on{" "}
                <Text as="span" fontWeight="bold">
                  {plan.name}
                </Text>{" "}
                ({viewCount} / {viewLimit} monthly views). One visitor can
                have multiple views per session.
              </Text>
              <ProgressBar
                progress={Math.min((viewCount / viewLimit) * 100, 100)}
                size="small"
                tone={viewCount >= viewLimit * 0.9 ? "critical" : undefined}
              />
              {plan.id !== "pro" && (
                <InlineStack align="end">
                  <Button url="/app/pricing" size="slim">
                    Upgrade plan
                  </Button>
                </InlineStack>
              )}
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* View limit warning */}
        {viewCount >= viewLimit * 0.8 && (
          <Layout.Section>
            <Banner tone="warning" title="Approaching view limit">
              <p>
                You've used {viewCount.toLocaleString()} of your{" "}
                {viewLimit.toLocaleString()} monthly views. Upgrade to Pro
                for unlimited views.
              </p>
            </Banner>
          </Layout.Section>
        )}

        {/* Announcements table */}
        <Layout.Section>
          <Card padding="0">
            {announcements.length === 0 ? (
              <EmptyState
                heading="No announcements yet"
                action={{
                  content: "Create your first announcement",
                  onAction: () => navigate("/app/new"),
                }}
                image=""
              >
                <p>
                  Create an announcement bar to show messages and promotions
                  on your store.
                </p>
              </EmptyState>
            ) : (
              <IndexTable
                resourceName={{
                  singular: "announcement",
                  plural: "announcements",
                }}
                itemCount={announcements.length}
                headings={[
                  { title: "Announcement name" },
                  { title: "Type" },
                  { title: "Placement" },
                  { title: "Views" },
                  { title: "Status" },
                  { title: "Actions" },
                ]}
                selectable={false}
              >
                {announcements.map((ann) => (
                  <IndexTable.Row id={ann.id} key={ann.id}>
                    <IndexTable.Cell>
                      <Link
                        url={`/app/announcement/${ann.id}`}
                        removeUnderline
                        monochrome
                      >
                        {ann.name}
                      </Link>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      {ann.type === "topbar"
                        ? "Simple"
                        : "Free shipping goal"}
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      {placementLabels[ann.placement] || ann.placement}
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      {ann.viewCount.toLocaleString()}
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <Badge
                        tone={
                          ann.status === "published" ? "success" : undefined
                        }
                      >
                        {ann.status === "published" ? "Published" : "Draft"}
                      </Badge>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <ButtonGroup>
                        <Button
                          size="slim"
                          onClick={() =>
                            navigate(`/app/announcement/${ann.id}`)
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          size="slim"
                          onClick={() => handleToggle(ann.id)}
                        >
                          {ann.status === "published"
                            ? "Unpublish"
                            : "Publish"}
                        </Button>
                        <Button
                          size="slim"
                          tone="critical"
                          onClick={() => handleDelete(ann.id)}
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
                    </IndexTable.Cell>
                  </IndexTable.Row>
                ))}
              </IndexTable>
            )}
          </Card>
        </Layout.Section>

        {/* App embed status */}
        <Layout.Section>
          <Card>
            <InlineStack align="space-between">
              <InlineStack gap="200" blockAlign="center">
                <Text as="span" fontWeight="bold">
                  App embed status
                </Text>
                <Badge tone="success">Active</Badge>
              </InlineStack>
              <Link
                url={`https://${shop}/admin/themes/current/editor`}
                target="_blank"
              >
                Manage app embed in the online store editor
              </Link>
            </InlineStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
