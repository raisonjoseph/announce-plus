export const meta = () => [
  { title: "FAQ — AnnouncePlus by Makerbase" },
  { name: "description", content: "Frequently asked questions about AnnouncePlus Shopify announcement bar app." },
  { "script:ld+json": JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "What is AnnouncePlus?", "acceptedAnswer": { "@type": "Answer", "text": "AnnouncePlus is a Shopify app with three announcement types: sticky bars, free shipping progress goals, and inline product shipping goals. It helps increase average order value by showing customers how close they are to free shipping." }},
      { "@type": "Question", "name": "How much does AnnouncePlus cost?", "acceptedAnswer": { "@type": "Answer", "text": "Free plan: 1 bar, 2,000 views. Starter ($4.99/mo or $3.99/mo yearly): 3 bars, 10,000 views, advanced targeting. Pro ($9.99/mo or $7.99/mo yearly): unlimited everything, scheduling, country targeting, exit intent, and priority support." }},
      { "@type": "Question", "name": "Does AnnouncePlus require coding?", "acceptedAnswer": { "@type": "Answer", "text": "No. AnnouncePlus installs with one click and is configured entirely from your Shopify admin. No code changes are needed." }},
      { "@type": "Question", "name": "Does the free shipping bar update in real time?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The progress bar tracks your customer's cart total and updates instantly as items are added or removed. No page reload is needed." }},
      { "@type": "Question", "name": "What targeting rules are available?", "acceptedAnswer": { "@type": "Answer", "text": "18 rules including page type, URL patterns, device, new vs returning visitors, cart value, cart items, customer tags, country, UTM source, exit intent, scroll depth, time delay, and date scheduling." }},
      { "@type": "Question", "name": "Does it work with my Shopify theme?", "acceptedAnswer": { "@type": "Answer", "text": "AnnouncePlus works with all Shopify Online Store 2.0 themes. It's added as a theme app extension, so it integrates natively without modifying your theme code." }},
      { "@type": "Question", "name": "What bar types are available?", "acceptedAnswer": { "@type": "Answer", "text": "Three types: announcement bars (sticky top/bottom with static, running marquee, or rotating text), free shipping goals (live progress bar tracking cart total), and product shipping goals (inline below Add to Cart on product pages)." }},
      { "@type": "Question", "name": "Can I target specific products or collections?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The product shipping goal type lets you target all products, specific products by handle, or specific collections. The bar only appears on matching product pages." }},
      { "@type": "Question", "name": "How do I cancel my subscription?", "acceptedAnswer": { "@type": "Answer", "text": "Go to the Pricing page in the app and click Cancel subscription. You'll be downgraded to the Free plan immediately. All charges are handled through your Shopify bill." }},
      { "@type": "Question", "name": "Is there a free trial?", "acceptedAnswer": { "@type": "Answer", "text": "The Free plan is available forever with 1 bar and 2,000 monthly views. Paid plans can be tested on Shopify development stores at no cost." }},
    ]
  })},
];

const faqs = [
  { q: "What is AnnouncePlus?", a: "AnnouncePlus is a Shopify app with three announcement types: sticky bars, free shipping progress goals, and inline product shipping goals. It helps increase average order value by showing customers how close they are to free shipping." },
  { q: "How much does AnnouncePlus cost?", a: "Free plan: 1 bar, 2,000 views forever. Starter ($4.99/mo or $3.99/mo yearly): 3 bars, 10,000 views, advanced targeting. Pro ($9.99/mo or $7.99/mo yearly): unlimited everything, scheduling, country targeting, exit intent, and priority support." },
  { q: "Does AnnouncePlus require coding?", a: "No. Install the app, enable the app embed in your theme editor, and configure your bars from the Shopify admin. No code changes or developer needed." },
  { q: "Does the free shipping bar update in real time?", a: "Yes. The progress bar tracks your customer's cart total and updates the remaining amount and progress bar instantly as items are added or removed. No page reload is needed." },
  { q: "What bar types are available?", a: "Three types: announcement bars (sticky top/bottom with static text, running marquee, or rotating messages), free shipping goals (live progress bar tracking cart total), and product shipping goals (inline below the Add to Cart button on product pages)." },
  { q: "What targeting rules are available?", a: "18 rules across three plan tiers. Free: page type, visitor type, cart state. Starter: URL patterns, device, cart value, cart items, scroll depth, display delay, customer status. Pro: date scheduling, day-of-week, customer tags, country, UTM/referral, exit intent, page view count." },
  { q: "Can I target specific products or collections?", a: "Yes. The product shipping goal type lets you target all products, specific products by URL handle, or products within specific collections. The bar only appears on matching product pages." },
  { q: "Does it work with my Shopify theme?", a: "AnnouncePlus works with all Shopify Online Store 2.0 themes. It uses a theme app extension that integrates natively without modifying your theme code." },
  { q: "How do I set up the app?", a: "Three steps: install the app from the Shopify App Store, enable the AnnouncePlus app embed in your theme editor, and create your first announcement bar from the app dashboard. The whole process takes under 2 minutes." },
  { q: "Can I show different bars on different pages?", a: "Yes. Each bar has its own targeting rules. You can show one bar on the homepage, a different bar on collection pages, and a product-specific goal on product pages." },
  { q: "How do I cancel my subscription?", a: "Go to the Pricing page in the app and click Cancel subscription. You'll be downgraded to the Free plan immediately. All charges are handled through your Shopify bill." },
  { q: "Is there a free trial?", a: "The Free plan is available forever with 1 bar and 2,000 monthly views. Paid plans can be tested on Shopify development stores at no cost." },
];

export default function FAQPage() {
  return (
    <div style={{
      fontFamily: "'Nunito Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#1e293b",
      maxWidth: 720,
      margin: "0 auto",
      padding: "60px 24px",
    }}>
      <a href="/" style={{ color: "#2563eb", textDecoration: "none", fontSize: 14 }}>&larr; Back to AnnouncePlus</a>

      <h1 style={{ fontSize: 32, fontWeight: 800, marginTop: 24, marginBottom: 8, fontFamily: "'Rubik', sans-serif" }}>Frequently Asked Questions</h1>
      <p style={{ color: "#64748b", fontSize: 16, marginBottom: 40, lineHeight: 1.6 }}>Everything you need to know about AnnouncePlus.</p>

      {faqs.map((faq, i) => (
        <div key={i} style={{
          marginBottom: 24,
          padding: "20px 24px",
          background: "#f8fafc",
          borderRadius: 10,
          border: "1px solid #f1f5f9",
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, fontFamily: "'Rubik', sans-serif", color: "#0f172a" }}>{faq.q}</h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
        </div>
      ))}

      <div style={{ marginTop: 48, textAlign: "center" }}>
        <p style={{ fontSize: 15, color: "#64748b", marginBottom: 16 }}>Still have questions?</p>
        <a href="mailto:support@makerbase.app" style={{
          background: "#2563eb", color: "#fff", padding: "12px 28px", borderRadius: 8,
          fontSize: 15, fontWeight: 600, textDecoration: "none", display: "inline-block",
        }}>Contact support</a>
      </div>

      <footer style={{ marginTop: 60, paddingTop: 24, borderTop: "1px solid #f1f5f9", fontSize: 13, color: "#94a3b8" }}>
        AnnouncePlus by Makerbase
      </footer>
    </div>
  );
}
