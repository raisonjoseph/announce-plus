export const meta = () => [
  { title: "Privacy Policy — AnnouncePlus by Makerbase" },
  { name: "description", content: "Privacy policy for AnnouncePlus Shopify app by Makerbase." },
];

export default function PrivacyPolicy() {
  return (
    <div style={{
      fontFamily: "'Nunito Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#1e293b",
      maxWidth: 720,
      margin: "0 auto",
      padding: "60px 24px",
      lineHeight: 1.8,
    }}>
      <a href="/" style={{ color: "#2563eb", textDecoration: "none", fontSize: 14 }}>&larr; Back to AnnouncePlus</a>

      <h1 style={{ fontSize: 32, fontWeight: 800, marginTop: 24, marginBottom: 8, fontFamily: "'Rubik', sans-serif" }}>Privacy Policy</h1>
      <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 40 }}>Last updated: March 21, 2026</p>

      <Section title="Who we are">
        AnnouncePlus is a Shopify app built by Makerbase. This policy explains how we collect, use, and protect data when you use our app.
      </Section>

      <Section title="What data we collect">
        <strong>Shop data:</strong> When you install AnnouncePlus, we store your Shopify shop domain, session tokens, and app settings (announcement configurations, plan information, and setup progress).
        {"\n\n"}
        <strong>View analytics:</strong> We track anonymous page views of announcement bars to enforce plan limits and display analytics in your dashboard. We do not track individual visitors or collect personal information.
        {"\n\n"}
        <strong>Customer data:</strong> We do not collect, store, or process any customer personal data. We do not access customer emails, names, addresses, or payment information.
      </Section>

      <Section title="How we use your data">
        We use your data solely to provide the AnnouncePlus service: displaying announcement bars on your store, enforcing plan view limits, showing analytics in your dashboard, and processing billing through Shopify.
      </Section>

      <Section title="Data storage">
        Your data is stored securely on Neon (PostgreSQL database) and served through Vercel. All connections use TLS encryption. We do not sell, share, or transfer your data to third parties.
      </Section>

      <Section title="Data retention">
        We retain your data for as long as you have AnnouncePlus installed. When you uninstall the app, we receive a webhook from Shopify and delete all your data including announcements, view records, plan settings, and setup progress within 48 hours.
      </Section>

      <Section title="GDPR compliance">
        We comply with GDPR requirements. We respond to customer data requests and erasure requests via Shopify's mandatory compliance webhooks. Since we do not store customer personal data, these requests are acknowledged without data to process.
      </Section>

      <Section title="Cookies and tracking">
        AnnouncePlus uses browser localStorage and sessionStorage on your storefront to track whether a visitor has dismissed an announcement bar and to prevent duplicate view counting. We do not use third-party cookies or tracking scripts.
      </Section>

      <Section title="Changes to this policy">
        We may update this policy from time to time. Changes will be reflected on this page with an updated date.
      </Section>

      <Section title="Contact">
        If you have questions about this privacy policy, contact us at support@makerbase.app.
      </Section>

      <footer style={{ marginTop: 60, paddingTop: 24, borderTop: "1px solid #f1f5f9", fontSize: 13, color: "#94a3b8" }}>
        AnnouncePlus by Makerbase
      </footer>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, fontFamily: "'Rubik', sans-serif" }}>{title}</h2>
      <p style={{ fontSize: 15, color: "#475569", whiteSpace: "pre-line" }}>{children}</p>
    </div>
  );
}
