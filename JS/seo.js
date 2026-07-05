(function () {
  const base = "https://invoe.netlify.app";
  const page = location.pathname.split("/").pop() || "index.html";
  const name = document.title || "INVO";
  const description = document.querySelector('meta[name="description"]')?.content || "INVO business tools for invoices, quotes, receipts, templates and calculators.";
  const canonical = document.querySelector('link[rel="canonical"]')?.href || `${base}/${page.replace(".html", "")}`;
  const crumbName = page === "index.html" ? "Home" : name.split("|")[0].trim();
  const graph = [
    { "@context": "https://schema.org", "@type": "Organization", "name": "INVO", "url": base, "slogan": "Smart Invoices. Better Business." },
    { "@context": "https://schema.org", "@type": "WebSite", "name": "INVO", "url": base, "potentialAction": { "@type": "SearchAction", "target": `${base}/search?q={search_term_string}`, "query-input": "required name=search_term_string" } },
    { "@context": "https://schema.org", "@type": "WebPage", "name": name, "description": description, "url": canonical, "isPartOf": { "@type": "WebSite", "name": "INVO", "url": base } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${base}/` },
      { "@type": "ListItem", "position": 2, "name": crumbName, "item": canonical }
    ] }
  ];
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(graph);
  document.head.appendChild(script);
})();
