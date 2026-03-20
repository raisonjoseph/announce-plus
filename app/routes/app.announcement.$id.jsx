import { useState, useCallback, useEffect } from "react";
import { json, redirect } from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  Page,
  Card,
  FormLayout,
  TextField,
  Select,
  Button,
  BlockStack,
  InlineStack,
  Text,
  Divider,
  Badge,
  Tabs,
  Checkbox,
  ChoiceList,
  Box,
  RangeSlider,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { canCreateBar } from "../plan.server";

const TOPBAR_DEFAULTS = {
  message: "Welcome to our store!",
  ctaText: "Shop now!",
  ctaUrl: "/",
  backgroundColor: "#1a1a1a",
  textColor: "#ffffff",
};

const SHIPPING_DEFAULTS = {
  threshold: "50",
  currencySymbol: "$",
  barMessage: "Spend {amount} more for free shipping!",
  successMessage: "You've unlocked free shipping!",
  barColor: "#22c55e",
  backgroundColor: "#1a1a1a",
  textColor: "#ffffff",
  showPercentage: false,
  showCloseButton: false,
};

// ─── Loader & Action (unchanged) ────────────────────

export const loader = async ({ request, params }) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  if (params.id === "new") {
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "topbar";
    return json({ announcement: null, type, isNew: true });
  }

  const announcement = await prisma.announcement.findFirst({
    where: { id: params.id, shop },
  });

  if (!announcement) {
    throw new Response("Not found", { status: 404 });
  }

  let parsedSettings = {};
  try {
    parsedSettings = JSON.parse(announcement.settings);
  } catch (e) {}

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const monthlyViews = await prisma.barView.count({
    where: {
      announcementId: params.id,
      viewedAt: { gte: startOfMonth },
    },
  });

  return json({
    announcement: { ...announcement, parsedSettings },
    type: announcement.type,
    isNew: false,
    monthlyViews,
  });
};

export const action = async ({ request, params }) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "delete") {
    await prisma.announcement.deleteMany({
      where: { id: params.id, shop },
    });
    await syncBarsMetafield(admin, shop);
    return redirect("/app");
  }

  const type = formData.get("type");
  const name = formData.get("name") || "Untitled";
  const placement = formData.get("placement") || "all_pages";
  const position = formData.get("position") || "top";
  const isEnabled = formData.get("isEnabled") === "true";
  const status = isEnabled ? "published" : "draft";

  let settings = {};

  // Shared design fields
  const sharedDesign = {
    backgroundColor: formData.get("backgroundColor") || "#1a1a1a",
    textColor: formData.get("textColor") || "#ffffff",
    barHeight: formData.get("barHeight") || "medium",
    isSticky: formData.get("isSticky") === "true",
    showCloseButton: formData.get("showCloseButton") === "true",
    fontSize: formData.get("fontSize") || "medium",
    fontWeight: formData.get("fontWeight") || "normal",
    textAlign: formData.get("textAlign") || "center",
    pages: formData.get("pages") || "all_pages",
    showTo: formData.get("showTo") || "all",
    deviceTarget: formData.get("deviceTarget") || "all",
    delaySeconds: parseInt(formData.get("delaySeconds"), 10) || 0,
    cartState: formData.get("cartState") || "any",
    targetUrls: formData.get("targetUrls") || "",
    excludeUrls: formData.get("excludeUrls") || "",
    cartValueMin: parseFloat(formData.get("cartValueMin")) || 0,
    cartValueMax: parseFloat(formData.get("cartValueMax")) || 0,
    cartItemMin: parseInt(formData.get("cartItemMin"), 10) || 0,
    cartItemMax: parseInt(formData.get("cartItemMax"), 10) || 0,
    scrollTrigger: parseInt(formData.get("scrollTrigger"), 10) || 0,
    customerStatus: formData.get("customerStatus") || "any",
    startDate: formData.get("startDate") || "",
    endDate: formData.get("endDate") || "",
    activeDays: (() => { try { return JSON.parse(formData.get("activeDays") || "[]"); } catch (e) { return []; } })(),
    customerTags: formData.get("customerTags") || "",
    countryTarget: formData.get("countryTarget") || "",
    exitIntent: formData.get("exitIntent") === "true",
    utmSource: formData.get("utmSource") || "",
    utmMedium: formData.get("utmMedium") || "",
    utmCampaign: formData.get("utmCampaign") || "",
    minPageViews: parseInt(formData.get("minPageViews"), 10) || 0,
    announcementSubtype: formData.get("announcementSubtype") || "simple",
  };

  if (type === "topbar") {
    let rotatingMessages = [];
    try {
      rotatingMessages = JSON.parse(formData.get("rotatingMessages") || "[]");
    } catch (e) {}
    settings = {
      ...sharedDesign,
      message: formData.get("message") || "",
      ctaText: formData.get("ctaText") || "",
      ctaUrl: formData.get("ctaUrl") || "",
      rotatingMessages,
      rotationSpeed: parseInt(formData.get("rotationSpeed"), 10) || 4,
      rotationAnimation: formData.get("rotationAnimation") || "fade",
      marqueeDirection: formData.get("marqueeDirection") || "ltr",
    };
  } else {
    const threshold = parseFloat(formData.get("threshold")) || 50;
    settings = {
      ...sharedDesign,
      threshold,
      thresholdCents: Math.round(threshold * 100),
      currencySymbol: formData.get("currencySymbol") || "$",
      barMessage:
        formData.get("barMessage") ||
        "Spend {amount} more for free shipping!",
      successMessage:
        formData.get("successMessage") || "You've unlocked free shipping!",
      barColor: formData.get("barColor") || "#22c55e",
      showPercentage: formData.get("showPercentage") === "true",
    };
  }

  if (params.id === "new") {
    const barCheck = await canCreateBar(shop);
    if (!barCheck.allowed) {
      return json({
        error: `You've reached the limit of ${barCheck.limit} announcement bar${barCheck.limit === 1 ? "" : "s"} on the ${barCheck.plan.name} plan. Upgrade to create more.`,
      });
    }

    await prisma.announcement.create({
      data: {
        shop,
        name,
        type,
        placement,
        position,
        status,
        settings: JSON.stringify(settings),
      },
    });
  } else {
    await prisma.announcement.updateMany({
      where: { id: params.id, shop },
      data: {
        name,
        type,
        placement,
        position,
        status,
        settings: JSON.stringify(settings),
      },
    });
  }

  await syncBarsMetafield(admin, shop);
  return redirect("/app");
};

async function syncBarsMetafield(admin, shop) {
  const published = await prisma.announcement.findMany({
    where: { shop, status: "published" },
    orderBy: { createdAt: "asc" },
  });

  const bars = published.map((a) => {
    let s = {};
    try {
      s = JSON.parse(a.settings);
    } catch (e) {}
    return {
      id: a.id,
      name: a.name,
      type: a.type,
      placement: a.placement,
      position: a.position,
      status: a.status,
      isEnabled: true,
      ...s,
    };
  });

  const idResponse = await admin.graphql(
    `#graphql
      query GetShopId {
        shop { id }
      }`,
  );
  const idData = await idResponse.json();
  const shopId = idData.data.shop.id;

  await admin.graphql(
    `#graphql
      mutation SetBarsMetafield($metafields: [MetafieldsSetInput!]!) {
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
            key: "bars",
            type: "json",
            value: JSON.stringify(bars),
          },
          {
            ownerId: shopId,
            namespace: "announceplus",
            key: "app_url",
            type: "single_line_text_field",
            value: process.env.SHOPIFY_APP_URL || "",
          },
        ],
      },
    },
  );
}

// ─── Color Field Component ──────────────────────────

function ColorField({ label, value, onChange }) {
  const hex = value.startsWith("#") ? value : "#" + value;
  return (
    <BlockStack gap="100">
      <Text as="label" variant="bodyMd">{label}</Text>
      <InlineStack gap="200" blockAlign="center">
        <div
          style={{
            position: "relative",
            width: 36,
            height: 36,
            borderRadius: "8px",
            border: "1px solid #ccc",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <input
            type="color"
            value={hex}
            onChange={(e) => onChange(e.target.value)}
            style={{
              position: "absolute",
              top: -4,
              left: -4,
              width: 44,
              height: 44,
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <TextField
            value={value}
            onChange={onChange}
            prefix="#"
            autoComplete="off"
            label=""
            labelHidden
          />
        </div>
      </InlineStack>
    </BlockStack>
  );
}

// ─── Component ──────────────────────────────────────

export default function AnnouncementEditorPage() {
  const { announcement, type, isNew, monthlyViews } = useLoaderData();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const submit = useSubmit();

  const saved = announcement?.parsedSettings || {};

  // ─── Shared state ───
  const [name, setName] = useState(announcement?.name || "");
  const [isEnabled, setIsEnabled] = useState(
    announcement ? announcement.status === "published" : true,
  );

  // ─── Content tab state ───
  const [announcementSubtype, setAnnouncementSubtype] = useState(
    saved.announcementSubtype || "simple",
  );
  const [message, setMessage] = useState(
    saved.message || TOPBAR_DEFAULTS.message,
  );
  const [showCta, setShowCta] = useState(
    !!(saved.ctaText),
  );
  const [ctaText, setCtaText] = useState(
    saved.ctaText || TOPBAR_DEFAULTS.ctaText,
  );
  const [ctaUrl, setCtaUrl] = useState(
    saved.ctaUrl || TOPBAR_DEFAULTS.ctaUrl,
  );
  // Rotating messages state
  const [rotatingMessages, setRotatingMessages] = useState(
    saved.rotatingMessages || ["Welcome to our store!", "Free shipping on orders over $50"],
  );
  const [rotationSpeed, setRotationSpeed] = useState(
    (saved.rotationSpeed || 4).toString(),
  );
  const [rotationAnimation, setRotationAnimation] = useState(
    saved.rotationAnimation || "fade",
  );
  const [marqueeDirection, setMarqueeDirection] = useState(
    saved.marqueeDirection || "ltr",
  );
  const [threshold, setThreshold] = useState(
    (saved.threshold || SHIPPING_DEFAULTS.threshold).toString(),
  );
  const [currencySymbol, setCurrencySymbol] = useState(
    saved.currencySymbol || SHIPPING_DEFAULTS.currencySymbol,
  );
  const [barMessage, setBarMessage] = useState(
    saved.barMessage || SHIPPING_DEFAULTS.barMessage,
  );
  const [successMessage, setSuccessMessage] = useState(
    saved.successMessage || SHIPPING_DEFAULTS.successMessage,
  );

  // ─── Design tab state ───
  const [backgroundColor, setBackgroundColor] = useState(
    saved.backgroundColor || "#1a1a1a",
  );
  const [textColor, setTextColor] = useState(
    saved.textColor || "#ffffff",
  );
  const [barColor, setBarColor] = useState(
    saved.barColor || SHIPPING_DEFAULTS.barColor,
  );
  const [position, setPosition] = useState(
    announcement?.position || "top",
  );
  const [barHeight, setBarHeight] = useState(
    saved.barHeight || "medium",
  );
  const [isSticky, setIsSticky] = useState(
    saved.isSticky ?? true,
  );
  const [showCloseButton, setShowCloseButton] = useState(
    saved.showCloseButton ?? false,
  );
  const [fontSize, setFontSize] = useState(
    saved.fontSize || "medium",
  );
  const [fontWeight, setFontWeight] = useState(
    saved.fontWeight || "normal",
  );
  const [textAlign, setTextAlign] = useState(
    saved.textAlign || "center",
  );

  // ─── Placement tab state ───
  const [pages, setPages] = useState(
    saved.pages ? saved.pages.split(",") : ["all_pages"],
  );
  const [showTo, setShowTo] = useState(
    saved.showTo || "all",
  );
  const [deviceTarget, setDeviceTarget] = useState(
    saved.deviceTarget || "all",
  );
  const [delaySeconds, setDelaySeconds] = useState(
    (saved.delaySeconds || 0).toString(),
  );
  const [cartState, setCartState] = useState(
    saved.cartState || "any",
  );
  // Starter targeting
  const [targetUrls, setTargetUrls] = useState(
    saved.targetUrls || "",
  );
  const [excludeUrls, setExcludeUrls] = useState(
    saved.excludeUrls || "",
  );
  const [cartValueMin, setCartValueMin] = useState(
    (saved.cartValueMin || "").toString(),
  );
  const [cartValueMax, setCartValueMax] = useState(
    (saved.cartValueMax || "").toString(),
  );
  const [cartItemMin, setCartItemMin] = useState(
    (saved.cartItemMin || "").toString(),
  );
  const [cartItemMax, setCartItemMax] = useState(
    (saved.cartItemMax || "").toString(),
  );
  const [scrollTrigger, setScrollTrigger] = useState(
    (saved.scrollTrigger || 0).toString(),
  );
  const [customerStatus, setCustomerStatus] = useState(
    saved.customerStatus || "any",
  );
  const [showPercentage, setShowPercentage] = useState(
    saved.showPercentage ?? false,
  );
  // Pro targeting
  const [startDate, setStartDate] = useState(saved.startDate || "");
  const [endDate, setEndDate] = useState(saved.endDate || "");
  const [activeDays, setActiveDays] = useState(
    saved.activeDays || ["0", "1", "2", "3", "4", "5", "6"],
  );
  const [customerTags, setCustomerTags] = useState(saved.customerTags || "");
  const [countryTarget, setCountryTarget] = useState(saved.countryTarget || "");
  const [exitIntent, setExitIntent] = useState(saved.exitIntent ?? false);
  const [utmSource, setUtmSource] = useState(saved.utmSource || "");
  const [utmMedium, setUtmMedium] = useState(saved.utmMedium || "");
  const [utmCampaign, setUtmCampaign] = useState(saved.utmCampaign || "");
  const [minPageViews, setMinPageViews] = useState(
    (saved.minPageViews || 0).toString(),
  );

  // ─── Tabs ───
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { id: "content", content: "Content" },
    { id: "design", content: "Design" },
    { id: "targeting", content: "Targeting" },
  ];

  const isSaving = navigation.state === "submitting";

  // ─── Handlers ───

  const handleSave = useCallback(() => {
    const formData = new FormData();
    formData.set("type", type);
    formData.set("name", name);
    formData.set("placement", pages.join(","));
    formData.set("position", position);
    formData.set("isEnabled", isEnabled.toString());
    formData.set("backgroundColor", backgroundColor);
    formData.set("textColor", textColor);
    formData.set("barHeight", barHeight);
    formData.set("isSticky", isSticky.toString());
    formData.set("showCloseButton", showCloseButton.toString());
    formData.set("fontSize", fontSize);
    formData.set("fontWeight", fontWeight);
    formData.set("textAlign", textAlign);
    formData.set("pages", pages.join(","));
    formData.set("showTo", showTo);
    formData.set("deviceTarget", deviceTarget);
    formData.set("delaySeconds", delaySeconds);
    formData.set("cartState", cartState);
    formData.set("targetUrls", targetUrls);
    formData.set("excludeUrls", excludeUrls);
    formData.set("cartValueMin", cartValueMin);
    formData.set("cartValueMax", cartValueMax);
    formData.set("cartItemMin", cartItemMin);
    formData.set("cartItemMax", cartItemMax);
    formData.set("scrollTrigger", scrollTrigger);
    formData.set("customerStatus", customerStatus);
    formData.set("startDate", startDate);
    formData.set("endDate", endDate);
    formData.set("activeDays", JSON.stringify(activeDays));
    formData.set("customerTags", customerTags);
    formData.set("countryTarget", countryTarget);
    formData.set("exitIntent", exitIntent.toString());
    formData.set("utmSource", utmSource);
    formData.set("utmMedium", utmMedium);
    formData.set("utmCampaign", utmCampaign);
    formData.set("minPageViews", minPageViews);
    formData.set("announcementSubtype", announcementSubtype);

    if (type === "topbar") {
      formData.set("message", message);
      formData.set("ctaText", showCta ? ctaText : "");
      formData.set("ctaUrl", showCta ? ctaUrl : "");
      formData.set("rotatingMessages", JSON.stringify(rotatingMessages));
      formData.set("rotationSpeed", rotationSpeed);
      formData.set("rotationAnimation", rotationAnimation);
      formData.set("marqueeDirection", marqueeDirection);
    } else {
      formData.set("threshold", threshold);
      formData.set("currencySymbol", currencySymbol);
      formData.set("barMessage", barMessage);
      formData.set("successMessage", successMessage);
      formData.set("barColor", barColor);
      formData.set("showPercentage", showPercentage.toString());
    }

    submit(formData, { method: "POST" });
  }, [
    type, name, pages, position, isEnabled, backgroundColor, textColor,
    barHeight, isSticky, showCloseButton, fontSize, fontWeight, textAlign,
    showTo, deviceTarget, delaySeconds, cartState,
    targetUrls, excludeUrls, cartValueMin, cartValueMax,
    cartItemMin, cartItemMax, scrollTrigger, customerStatus,
    startDate, endDate, activeDays, customerTags, countryTarget,
    exitIntent, utmSource, utmMedium, utmCampaign, minPageViews,
    announcementSubtype, message, showCta, ctaText, ctaUrl,
    rotatingMessages, rotationSpeed, rotationAnimation, marqueeDirection,
    threshold, currencySymbol, barMessage, successMessage, barColor,
    showPercentage, submit,
  ]);

  const handleDelete = useCallback(() => {
    if (!confirm("Delete this announcement? This cannot be undone.")) return;
    const formData = new FormData();
    formData.set("_action", "delete");
    submit(formData, { method: "POST" });
  }, [submit]);

  const pageTitle = isNew
    ? type === "topbar"
      ? "New Top/Bottom Bar"
      : "New Free Shipping Goal"
    : `Edit: ${announcement?.name || ""}`;

  // ─── Rotating preview index ───
  const [previewMsgIndex, setPreviewMsgIndex] = useState(0);

  useEffect(() => {
    if (announcementSubtype !== "rotating" || rotatingMessages.length < 2) return;
    const speed = (parseInt(rotationSpeed, 10) || 4) * 1000;
    const timer = setInterval(() => {
      setPreviewMsgIndex((prev) => (prev + 1) % rotatingMessages.length);
    }, speed);
    return () => clearInterval(timer);
  }, [announcementSubtype, rotatingMessages.length, rotationSpeed]);

  // ─── Computed preview text ───
  const previewText =
    type === "shipping_goal"
      ? barMessage.replace(
          "{amount}",
          currencySymbol + (parseFloat(threshold || 50) / 2).toFixed(2),
        )
      : announcementSubtype === "rotating" && rotatingMessages.length > 0
        ? rotatingMessages[previewMsgIndex % rotatingMessages.length] || "Message"
        : message || "Your announcement text";

  const heightPx =
    barHeight === "small" ? "36px" : barHeight === "large" ? "60px" : "48px";
  const fontSizePx =
    fontSize === "small" ? "12px" : fontSize === "large" ? "16px" : "14px";
  const fontWeightVal =
    fontWeight === "bold" ? "700" : fontWeight === "medium" ? "500" : "400";

  const bgColor = backgroundColor.startsWith("#")
    ? backgroundColor
    : "#" + backgroundColor;
  const txtColor = textColor.startsWith("#")
    ? textColor
    : "#" + textColor;
  const progressColor = barColor.startsWith("#")
    ? barColor
    : "#" + barColor;

  // ─── Render ───

  return (
    <Page
      title={pageTitle}
      backAction={{ onAction: () => navigate("/app") }}
      primaryAction={{
        content: "Save",
        onAction: handleSave,
        loading: isSaving,
      }}
      secondaryActions={
        isNew
          ? []
          : [{ content: "Delete", destructive: true, onAction: handleDelete }]
      }
    >
      {/* Stats card (edit mode only) */}
      {!isNew && (
        <Box paddingBlockEnd="400">
          <Card>
            <InlineStack gap="600">
              <BlockStack gap="100">
                <Text variant="bodySm" as="p" tone="subdued">
                  Total views
                </Text>
                <Text variant="headingLg" as="p">
                  {(announcement.viewCount || 0).toLocaleString()}
                </Text>
              </BlockStack>
              <BlockStack gap="100">
                <Text variant="bodySm" as="p" tone="subdued">
                  This month
                </Text>
                <Text variant="headingLg" as="p">
                  {(monthlyViews || 0).toLocaleString()}
                </Text>
              </BlockStack>
              <BlockStack gap="100">
                <Text variant="bodySm" as="p" tone="subdued">
                  Status
                </Text>
                <Badge
                  tone={
                    announcement.status === "published" ? "success" : undefined
                  }
                >
                  {announcement.status === "published" ? "Published" : "Draft"}
                </Badge>
              </BlockStack>
            </InlineStack>
          </Card>
        </Box>
      )}

      {/* Name field above tabs */}
      <Box paddingBlockEnd="400">
        <Card>
          <TextField
            label="Announcement name"
            value={name}
            onChange={setName}
            helpText="Internal name, not shown to customers"
            autoComplete="off"
          />
        </Card>
      </Box>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 480px",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* ─── Left: Tabs + Form ─── */}
        <div>
          <Card padding="0">
            <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
              <Box padding="400">
                {/* ─── CONTENT TAB ─── */}
                {selectedTab === 0 && (
                  <BlockStack gap="500">
                    {type === "topbar" && (
                      <>
                        <BlockStack gap="300">
                          <Text variant="headingSm" as="h3">
                            Announcement type
                          </Text>
                          <ChoiceList
                            choices={[
                              { label: "Simple announcement", value: "simple" },
                              {
                                label: (
                                  <InlineStack gap="200" blockAlign="center">
                                    <span>Running line announcement</span>
                                    <Badge>Starter plan</Badge>
                                  </InlineStack>
                                ),
                                value: "running",
                              },
                              {
                                label: "Multiple rotating",
                                value: "rotating",
                              },
                            ]}
                            selected={[announcementSubtype]}
                            onChange={(v) => setAnnouncementSubtype(v[0])}
                          />
                        </BlockStack>
                        <Divider />

                        {/* Message section — varies by subtype */}
                        {announcementSubtype === "rotating" ? (
                          <BlockStack gap="300">
                            <Text variant="headingSm" as="h3">
                              Rotating messages
                            </Text>
                            <Text variant="bodySm" as="p" tone="subdued">
                              Add multiple messages that rotate automatically.
                            </Text>
                            {rotatingMessages.map((msg, i) => (
                              <InlineStack key={i} gap="200" blockAlign="end">
                                <div style={{ flex: 1 }}>
                                  <TextField
                                    label={`Message ${i + 1}`}
                                    value={msg}
                                    onChange={(val) => {
                                      const updated = [...rotatingMessages];
                                      updated[i] = val;
                                      setRotatingMessages(updated);
                                    }}
                                    autoComplete="off"
                                  />
                                </div>
                                {rotatingMessages.length > 2 && (
                                  <Button
                                    tone="critical"
                                    variant="plain"
                                    onClick={() => {
                                      setRotatingMessages(
                                        rotatingMessages.filter((_, j) => j !== i),
                                      );
                                    }}
                                  >
                                    Remove
                                  </Button>
                                )}
                              </InlineStack>
                            ))}
                            <Button
                              onClick={() =>
                                setRotatingMessages([
                                  ...rotatingMessages,
                                  "",
                                ])
                              }
                            >
                              Add message
                            </Button>
                            <Divider />
                            <Text variant="headingSm" as="h3">
                              Animation
                            </Text>
                            <FormLayout>
                              <Select
                                label="Animation style"
                                options={[
                                  { label: "Fade", value: "fade" },
                                  { label: "Slide up", value: "slide-up" },
                                  { label: "Slide down", value: "slide-down" },
                                ]}
                                value={rotationAnimation}
                                onChange={setRotationAnimation}
                              />
                              <TextField
                                label="Rotation speed (seconds)"
                                type="number"
                                value={rotationSpeed}
                                onChange={setRotationSpeed}
                                helpText="How long each message stays visible"
                                autoComplete="off"
                                suffix="sec"
                              />
                            </FormLayout>
                          </BlockStack>
                        ) : announcementSubtype === "running" ? (
                          <BlockStack gap="400">
                            <Text variant="headingSm" as="h3">
                              Running line
                            </Text>
                            <TextField
                              label="Scrolling text"
                              value={message}
                              onChange={setMessage}
                              multiline={2}
                              helpText="This text scrolls continuously across the bar"
                              autoComplete="off"
                            />
                            <Select
                              label="Scroll direction"
                              options={[
                                { label: "Left to right \u2192", value: "ltr" },
                                { label: "\u2190 Right to left", value: "rtl" },
                              ]}
                              value={marqueeDirection}
                              onChange={setMarqueeDirection}
                            />
                            <BlockStack gap="100">
                              <Text variant="bodySm" as="label">
                                Scroll speed: {rotationSpeed}s
                              </Text>
                              <RangeSlider
                                label="Scroll speed"
                                labelHidden
                                value={parseInt(rotationSpeed, 10) || 15}
                                min={3}
                                max={40}
                                step={1}
                                onChange={(val) => setRotationSpeed(val.toString())}
                                suffix={
                                  <Text variant="bodySm" as="span" tone="subdued">
                                    {parseInt(rotationSpeed, 10) <= 8
                                      ? "Fast"
                                      : parseInt(rotationSpeed, 10) <= 20
                                        ? "Medium"
                                        : "Slow"}
                                  </Text>
                                }
                                output
                              />
                            </BlockStack>
                          </BlockStack>
                        ) : (
                          <BlockStack gap="300">
                            <Text variant="headingSm" as="h3">
                              Message
                            </Text>
                            <TextField
                              label="Announcement text"
                              value={message}
                              onChange={setMessage}
                              multiline={2}
                              helpText="This is the main text shown in the bar"
                              autoComplete="off"
                            />
                          </BlockStack>
                        )}

                        <Divider />
                        <BlockStack gap="300">
                          <Text variant="headingSm" as="h3">
                            Call to action
                          </Text>
                          <Checkbox
                            label="Add a button or link"
                            checked={showCta}
                            onChange={setShowCta}
                          />
                          {showCta && (
                            <FormLayout>
                              <TextField
                                label="Button text"
                                value={ctaText}
                                onChange={setCtaText}
                                autoComplete="off"
                              />
                              <TextField
                                label="Button URL"
                                value={ctaUrl}
                                onChange={setCtaUrl}
                                autoComplete="off"
                              />
                            </FormLayout>
                          )}
                        </BlockStack>
                      </>
                    )}

                    {type === "shipping_goal" && (
                      <>
                        <BlockStack gap="300">
                          <Text variant="headingSm" as="h3">
                            Goal settings
                          </Text>
                          <FormLayout>
                            <FormLayout.Group>
                              <TextField
                                label="Threshold amount"
                                type="number"
                                value={threshold}
                                onChange={setThreshold}
                                prefix={currencySymbol}
                                autoComplete="off"
                              />
                              <TextField
                                label="Currency symbol"
                                value={currencySymbol}
                                onChange={setCurrencySymbol}
                                autoComplete="off"
                              />
                            </FormLayout.Group>
                          </FormLayout>
                        </BlockStack>
                        <Divider />
                        <BlockStack gap="300">
                          <Text variant="headingSm" as="h3">
                            Messages
                          </Text>
                          <FormLayout>
                            <TextField
                              label="Progress message"
                              value={barMessage}
                              onChange={setBarMessage}
                              helpText="Use {amount} for the remaining amount"
                              autoComplete="off"
                            />
                            <TextField
                              label="Success message"
                              value={successMessage}
                              onChange={setSuccessMessage}
                              autoComplete="off"
                            />
                          </FormLayout>
                        </BlockStack>
                      </>
                    )}
                  </BlockStack>
                )}

                {/* ─── DESIGN TAB ─── */}
                {selectedTab === 1 && (
                  <BlockStack gap="500">
                    <BlockStack gap="300">
                      <Text variant="headingSm" as="h3">
                        Colors
                      </Text>
                      <FormLayout>
                        <FormLayout.Group>
                          <ColorField
                            label="Background color"
                            value={backgroundColor}
                            onChange={setBackgroundColor}
                          />
                          <ColorField
                            label="Text color"
                            value={textColor}
                            onChange={setTextColor}
                          />
                        </FormLayout.Group>
                        {type === "shipping_goal" && (
                          <ColorField
                            label="Progress bar color"
                            value={barColor}
                            onChange={setBarColor}
                          />
                        )}
                      </FormLayout>
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="300">
                      <Text variant="headingSm" as="h3">
                        Bar style
                      </Text>
                      <FormLayout>
                        <Select
                          label="Bar position"
                          options={[
                            { label: "Top of page", value: "top" },
                            { label: "Bottom of page", value: "bottom" },
                          ]}
                          value={position}
                          onChange={setPosition}
                        />
                        <Select
                          label="Bar height"
                          options={[
                            { label: "Small (36px)", value: "small" },
                            { label: "Medium (48px)", value: "medium" },
                            { label: "Large (60px)", value: "large" },
                          ]}
                          value={barHeight}
                          onChange={setBarHeight}
                        />
                        <Checkbox
                          label="Sticky (stays fixed when scrolling)"
                          checked={isSticky}
                          onChange={setIsSticky}
                        />
                        <Checkbox
                          label="Show close button"
                          checked={showCloseButton}
                          onChange={setShowCloseButton}
                        />
                      </FormLayout>
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="300">
                      <Text variant="headingSm" as="h3">
                        Typography
                      </Text>
                      <FormLayout>
                        <Select
                          label="Font size"
                          options={[
                            { label: "Small (12px)", value: "small" },
                            { label: "Medium (14px)", value: "medium" },
                            { label: "Large (16px)", value: "large" },
                          ]}
                          value={fontSize}
                          onChange={setFontSize}
                        />
                        <Select
                          label="Font weight"
                          options={[
                            { label: "Normal", value: "normal" },
                            { label: "Medium", value: "medium" },
                            { label: "Bold", value: "bold" },
                          ]}
                          value={fontWeight}
                          onChange={setFontWeight}
                        />
                        <Select
                          label="Text alignment"
                          options={[
                            { label: "Left", value: "left" },
                            { label: "Center", value: "center" },
                            { label: "Right", value: "right" },
                          ]}
                          value={textAlign}
                          onChange={setTextAlign}
                        />
                      </FormLayout>
                    </BlockStack>
                  </BlockStack>
                )}

                {/* ─── PLACEMENT TAB ─── */}
                {selectedTab === 2 && (
                  <BlockStack gap="500">
                    <BlockStack gap="300">
                      <Text variant="headingSm" as="h3">
                        Pages
                      </Text>
                      <ChoiceList
                        allowMultiple
                        title="Show on these pages"
                        choices={[
                          { label: "All pages", value: "all_pages" },
                          { label: "Homepage only", value: "homepage" },
                          { label: "Collection pages", value: "collections" },
                          { label: "Product pages", value: "products" },
                          { label: "Cart page", value: "cart" },
                        ]}
                        selected={pages}
                        onChange={setPages}
                      />
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="300">
                      <Text variant="headingSm" as="h3">
                        Visitors
                      </Text>
                      <Checkbox
                        label="Enable this announcement"
                        checked={isEnabled}
                        onChange={setIsEnabled}
                      />
                      <Select
                        label="Show to"
                        options={[
                          { label: "All visitors", value: "all" },
                          { label: "New visitors only", value: "new" },
                          { label: "Returning visitors only", value: "returning" },
                        ]}
                        value={showTo}
                        onChange={setShowTo}
                      />
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="300">
                      <Text variant="headingSm" as="h3">
                        Device
                      </Text>
                      <Select
                        label="Show on"
                        options={[
                          { label: "All devices", value: "all" },
                          { label: "Desktop only", value: "desktop" },
                          { label: "Mobile only", value: "mobile" },
                        ]}
                        value={deviceTarget}
                        onChange={setDeviceTarget}
                      />
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="300">
                      <Text variant="headingSm" as="h3">
                        Cart condition
                      </Text>
                      <Select
                        label="Show when cart is"
                        options={[
                          { label: "Any state (always)", value: "any" },
                          { label: "Empty", value: "empty" },
                          { label: "Not empty", value: "non_empty" },
                        ]}
                        value={cartState}
                        onChange={setCartState}
                      />
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="300">
                      <Text variant="headingSm" as="h3">
                        Display delay
                      </Text>
                      <TextField
                        label="Show after (seconds)"
                        type="number"
                        value={delaySeconds}
                        onChange={setDelaySeconds}
                        helpText="0 = show immediately"
                        autoComplete="off"
                        suffix="sec"
                      />
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="300">
                      <InlineStack gap="200" blockAlign="center">
                        <Text variant="headingSm" as="h3">
                          URL targeting
                        </Text>
                        <Badge>Starter</Badge>
                      </InlineStack>
                      <TextField
                        label="Show only on these URLs"
                        value={targetUrls}
                        onChange={setTargetUrls}
                        helpText="Comma-separated paths. Use * as wildcard. e.g. /collections/sale, /pages/*"
                        autoComplete="off"
                        placeholder="/collections/sale, /products/*"
                        multiline={2}
                      />
                      <TextField
                        label="Hide on these URLs"
                        value={excludeUrls}
                        onChange={setExcludeUrls}
                        helpText="Bar won't show on these pages even if other rules match"
                        autoComplete="off"
                        placeholder="/pages/about, /policies/*"
                        multiline={2}
                      />
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="300">
                      <InlineStack gap="200" blockAlign="center">
                        <Text variant="headingSm" as="h3">
                          Customer status
                        </Text>
                        <Badge>Starter</Badge>
                      </InlineStack>
                      <Select
                        label="Show to"
                        options={[
                          { label: "Everyone", value: "any" },
                          { label: "Logged-in customers only", value: "logged_in" },
                          { label: "Guests only", value: "guest" },
                        ]}
                        value={customerStatus}
                        onChange={setCustomerStatus}
                      />
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="300">
                      <InlineStack gap="200" blockAlign="center">
                        <Text variant="headingSm" as="h3">
                          Cart value
                        </Text>
                        <Badge>Starter</Badge>
                      </InlineStack>
                      <FormLayout>
                        <FormLayout.Group>
                          <TextField
                            label="Minimum cart value ($)"
                            type="number"
                            value={cartValueMin}
                            onChange={setCartValueMin}
                            helpText="0 = no minimum"
                            autoComplete="off"
                            prefix="$"
                          />
                          <TextField
                            label="Maximum cart value ($)"
                            type="number"
                            value={cartValueMax}
                            onChange={setCartValueMax}
                            helpText="0 = no maximum"
                            autoComplete="off"
                            prefix="$"
                          />
                        </FormLayout.Group>
                      </FormLayout>
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="300">
                      <InlineStack gap="200" blockAlign="center">
                        <Text variant="headingSm" as="h3">
                          Cart items
                        </Text>
                        <Badge>Starter</Badge>
                      </InlineStack>
                      <FormLayout>
                        <FormLayout.Group>
                          <TextField
                            label="Min items in cart"
                            type="number"
                            value={cartItemMin}
                            onChange={setCartItemMin}
                            helpText="0 = no minimum"
                            autoComplete="off"
                          />
                          <TextField
                            label="Max items in cart"
                            type="number"
                            value={cartItemMax}
                            onChange={setCartItemMax}
                            helpText="0 = no maximum"
                            autoComplete="off"
                          />
                        </FormLayout.Group>
                      </FormLayout>
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="300">
                      <InlineStack gap="200" blockAlign="center">
                        <Text variant="headingSm" as="h3">
                          Scroll trigger
                        </Text>
                        <Badge>Starter</Badge>
                      </InlineStack>
                      <TextField
                        label="Show after scrolling (%)"
                        type="number"
                        value={scrollTrigger}
                        onChange={setScrollTrigger}
                        helpText="0 = show immediately. 50 = show after scrolling halfway."
                        autoComplete="off"
                        suffix="%"
                      />
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="300">
                      <InlineStack gap="200" blockAlign="center">
                        <Text variant="headingSm" as="h3">
                          Scheduling
                        </Text>
                        <Badge>Pro</Badge>
                      </InlineStack>
                      <FormLayout>
                        <FormLayout.Group>
                          <TextField
                            label="Start date"
                            type="date"
                            value={startDate}
                            onChange={setStartDate}
                            autoComplete="off"
                          />
                          <TextField
                            label="End date"
                            type="date"
                            value={endDate}
                            onChange={setEndDate}
                            autoComplete="off"
                          />
                        </FormLayout.Group>
                      </FormLayout>
                      <Text tone="subdued" variant="bodySm" as="p">
                        Leave empty to show indefinitely.
                      </Text>
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="300">
                      <InlineStack gap="200" blockAlign="center">
                        <Text variant="headingSm" as="h3">
                          Active days
                        </Text>
                        <Badge>Pro</Badge>
                      </InlineStack>
                      <ChoiceList
                        allowMultiple
                        title="Show on these days"
                        choices={[
                          { label: "Sunday", value: "0" },
                          { label: "Monday", value: "1" },
                          { label: "Tuesday", value: "2" },
                          { label: "Wednesday", value: "3" },
                          { label: "Thursday", value: "4" },
                          { label: "Friday", value: "5" },
                          { label: "Saturday", value: "6" },
                        ]}
                        selected={activeDays}
                        onChange={setActiveDays}
                      />
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="300">
                      <InlineStack gap="200" blockAlign="center">
                        <Text variant="headingSm" as="h3">
                          Customer tags
                        </Text>
                        <Badge>Pro</Badge>
                      </InlineStack>
                      <TextField
                        label="Show to customers with these tags"
                        value={customerTags}
                        onChange={setCustomerTags}
                        helpText="Comma-separated. e.g. VIP, wholesale, loyalty"
                        autoComplete="off"
                        placeholder="VIP, wholesale"
                      />
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="300">
                      <InlineStack gap="200" blockAlign="center">
                        <Text variant="headingSm" as="h3">
                          Country targeting
                        </Text>
                        <Badge>Pro</Badge>
                      </InlineStack>
                      <TextField
                        label="Show to visitors from these countries"
                        value={countryTarget}
                        onChange={setCountryTarget}
                        helpText="ISO country codes, comma-separated. e.g. US, CA, GB"
                        autoComplete="off"
                        placeholder="US, CA, GB"
                      />
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="300">
                      <InlineStack gap="200" blockAlign="center">
                        <Text variant="headingSm" as="h3">
                          Referral / UTM targeting
                        </Text>
                        <Badge>Pro</Badge>
                      </InlineStack>
                      <FormLayout>
                        <TextField
                          label="UTM Source"
                          value={utmSource}
                          onChange={setUtmSource}
                          helpText="e.g. facebook, instagram, google"
                          autoComplete="off"
                          placeholder="facebook"
                        />
                        <TextField
                          label="UTM Medium"
                          value={utmMedium}
                          onChange={setUtmMedium}
                          autoComplete="off"
                          placeholder="cpc"
                        />
                        <TextField
                          label="UTM Campaign"
                          value={utmCampaign}
                          onChange={setUtmCampaign}
                          autoComplete="off"
                          placeholder="summer_sale"
                        />
                      </FormLayout>
                    </BlockStack>

                    <Divider />

                    <BlockStack gap="300">
                      <InlineStack gap="200" blockAlign="center">
                        <Text variant="headingSm" as="h3">
                          Behavioral triggers
                        </Text>
                        <Badge>Pro</Badge>
                      </InlineStack>
                      <Checkbox
                        label="Exit intent — show when visitor is about to leave"
                        checked={exitIntent}
                        onChange={setExitIntent}
                      />
                      <TextField
                        label="Minimum page views"
                        type="number"
                        value={minPageViews}
                        onChange={setMinPageViews}
                        helpText="0 = show on first page. 3 = show after visitor views 3 pages."
                        autoComplete="off"
                      />
                    </BlockStack>

                    {type === "shipping_goal" && (
                      <>
                        <Divider />
                        <BlockStack gap="300">
                          <Text variant="headingSm" as="h3">
                            Extra options
                          </Text>
                          <Checkbox
                            label='Show percentage ("X% there")'
                            checked={showPercentage}
                            onChange={setShowPercentage}
                          />
                        </BlockStack>
                      </>
                    )}
                  </BlockStack>
                )}
              </Box>
            </Tabs>
          </Card>
        </div>

        {/* ─── Right: Live Preview ─── */}
        <div style={{ position: "sticky", top: "20px" }}>
          <Card>
            <BlockStack gap="300">
              <Text variant="headingSm" as="h3">
                Preview
              </Text>

              {/* Browser mockup */}
              <div
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {/* Browser chrome */}
                <div
                  style={{
                    background: "#f5f5f5",
                    padding: "8px 12px",
                    display: "flex",
                    gap: "6px",
                    alignItems: "center",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#ff5f56",
                    }}
                  />
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#ffbd2e",
                    }}
                  />
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#27c93f",
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      background: "#fff",
                      borderRadius: "4px",
                      height: "20px",
                      marginLeft: "8px",
                    }}
                  />
                </div>

                {/* Preview bar (top position) */}
                {position === "top" && (
                  <PreviewBar
                    bgColor={bgColor}
                    txtColor={txtColor}
                    heightPx={heightPx}
                    fontSizePx={fontSizePx}
                    fontWeightVal={fontWeightVal}
                    textAlign={textAlign}
                    previewText={previewText}
                    showCta={showCta && type === "topbar"}
                    ctaText={ctaText}
                    type={type}
                    progressColor={progressColor}
                    showCloseButton={showCloseButton}
                  />
                )}

                {/* Mock page content */}
                <div style={{ padding: "16px", background: "#fff" }}>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: "12px",
                        background: "#f0f0f0",
                        borderRadius: "4px",
                        marginBottom: "8px",
                        width: i === 3 ? "60%" : "100%",
                      }}
                    />
                  ))}
                  <div style={{ height: "40px" }} />
                  {[4, 5].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: "12px",
                        background: "#f0f0f0",
                        borderRadius: "4px",
                        marginBottom: "8px",
                        width: i === 5 ? "40%" : "80%",
                      }}
                    />
                  ))}
                </div>

                {/* Preview bar (bottom position) */}
                {position === "bottom" && (
                  <PreviewBar
                    bgColor={bgColor}
                    txtColor={txtColor}
                    heightPx={heightPx}
                    fontSizePx={fontSizePx}
                    fontWeightVal={fontWeightVal}
                    textAlign={textAlign}
                    previewText={previewText}
                    showCta={showCta && type === "topbar"}
                    ctaText={ctaText}
                    type={type}
                    progressColor={progressColor}
                    showCloseButton={showCloseButton}
                  />
                )}
              </div>

              <Text tone="subdued" variant="bodySm" as="p" alignment="center">
                Preview updates as you type
              </Text>
            </BlockStack>
          </Card>
        </div>
      </div>
    </Page>
  );
}

// ─── Preview Bar Sub-component ──────────────────────

function PreviewBar({
  bgColor,
  txtColor,
  heightPx,
  fontSizePx,
  fontWeightVal,
  textAlign,
  previewText,
  showCta,
  ctaText,
  type,
  progressColor,
  showCloseButton,
}) {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: txtColor,
        minHeight: heightPx,
        display: "flex",
        alignItems: "center",
        justifyContent:
          textAlign === "left"
            ? "flex-start"
            : textAlign === "right"
              ? "flex-end"
              : "center",
        gap: "12px",
        padding: "0 16px",
        fontSize: fontSizePx,
        fontWeight: fontWeightVal,
        position: "relative",
      }}
    >
      <span
        key={previewText}
        style={{
          animation: "ap-preview-fade 0.4s ease",
        }}
      >
        {previewText}
      </span>
      <style>{`
        @keyframes ap-preview-fade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {showCta && ctaText && (
        <span
          style={{
            background: txtColor,
            color: bgColor,
            padding: "4px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "500",
            whiteSpace: "nowrap",
          }}
        >
          {ctaText}
        </span>
      )}
      {showCloseButton && (
        <span
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.6,
            fontSize: "14px",
          }}
        >
          &#215;
        </span>
      )}
      {type === "shipping_goal" && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "rgba(255,255,255,0.2)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "60%",
              background: progressColor,
              borderRadius: "0 2px 2px 0",
            }}
          />
        </div>
      )}
    </div>
  );
}
