(function () {
  const pages = [
    ["Invoice Generator", "Create professional invoices with live totals, taxes, discounts and print-ready output.", "invoice-generator.html"],
    ["Quote Generator", "Build client quotations with validity dates and acceptance sections.", "quote-generator.html"],
    ["Receipt Generator", "Create proof of payment receipts for paid invoices and services.", "receipt-generator.html"],
    ["Business Calculators", "VAT, GST, discount, margin, markup, tax and break-even calculators.", "business-calculators.html"],
    ["Invoice Templates", "Modern, minimal, corporate, agency and industry invoice templates.", "invoice-templates.html"],
    ["Business Guides", "Practical guides for invoicing, payments, taxes and client management.", "business-guides.html"],
    ["Blog", "SEO articles and small business operations advice.", "blog.html"],
    ["FAQ", "Answers to common invoice and payment questions.", "faq.html"]
  ];

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-search-open]")) return;
    const query = prompt("Search INVO tools and resources");
    if (!query) return;
    const hit = pages.find(([title, desc]) => `${title} ${desc}`.toLowerCase().includes(query.toLowerCase()));
    if (hit) location.href = hit[2];
    else INVO.toast("No exact result found. Try invoices, quotes, tax, templates or guides.");
  });
})();
