(function () {
  const navItems = [
    ["Home", "index.html"],
    ["Invoice", "invoice-generator.html"],
    ["Quote", "quote-generator.html"],
    ["Receipt", "receipt-generator.html"],
    ["Calculators", "business-calculators.html"],
    ["Templates", "invoice-templates.html"],
    ["Guides", "business-guides.html"],
    ["Blog", "blog.html"]
  ];

  function renderHeader() {
    const current = location.pathname.split("/").pop() || "index.html";
    const header = document.querySelector("[data-header]");
    if (!header) return;
    const links = navItems.map(([label, href]) => `<a href="${href}" ${current === href ? 'aria-current="page"' : ""}>${label}</a>`).join("");
    header.innerHTML = `
      <div class="container nav-wrap">
        <a class="brand" href="index.html" aria-label="INVO home"><span class="brand-mark">I</span><span>INVO</span></a>
        <nav class="main-nav" aria-label="Primary navigation">${links}</nav>
        <div class="nav-actions">
          <button class="icon-btn" data-search-open aria-label="Search">${INVO.icon("spark")}</button>
          <button class="icon-btn" data-theme-toggle aria-label="Toggle dark mode">${INVO.icon("shield")}</button>
          <a class="btn btn-primary" href="invoice-generator.html">Create Invoice</a>
          <button class="menu-btn" data-menu-toggle aria-label="Open menu"><span></span></button>
        </div>
      </div>
      <div class="mobile-panel" data-mobile-panel>${links}<a class="btn btn-primary btn-block" href="invoice-generator.html">Create Invoice</a></div>
    `;
  }

  function renderFooter() {
    const footer = document.querySelector("[data-footer]");
    if (!footer) return;
    footer.innerHTML = `
      <div class="container footer-grid">
        <div>
          <a class="brand" href="index.html"><span class="brand-mark">I</span><span>INVO</span></a>
          <p>Smart Invoices. Better Business. Create invoices, quotes, receipts and practical business documents in minutes.</p>
          <form class="newsletter-form" data-newsletter><input type="email" required placeholder="Email for business tips" aria-label="Email address"><button class="btn btn-primary" type="submit">Subscribe</button></form>
        </div>
        <div class="footer-col"><h3>Business Tools</h3><a href="invoice-generator.html">Invoice Generator</a><a href="quote-generator.html">Quote Generator</a><a href="receipt-generator.html">Receipt Generator</a><a href="business-calculators.html">Calculators</a></div>
        <div class="footer-col"><h3>Resources</h3><a href="invoice-templates.html">Templates</a><a href="business-guides.html">Guides</a><a href="blog.html">Blog</a><a href="faq.html">FAQ</a></div>
        <div class="footer-col"><h3>Company</h3><a href="about.html">About</a><a href="contact.html">Contact</a><a href="index.html#testimonials">Customers</a><a href="index.html#features">Features</a></div>
        <div class="footer-col"><h3>Legal</h3><a href="privacy.html">Privacy Policy</a><a href="terms.html">Terms of Service</a></div>
      </div>
      <div class="container footer-bottom"><span>Copyright 2026 INVO. All rights reserved.</span><span>LinkedIn - X - YouTube</span></div>
    `;
  }

  function bindInteractions() {
    const header = document.querySelector(".site-header");
    const onScroll = () => header?.classList.toggle("is-scrolled", scrollY > 12);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });

    document.addEventListener("click", (event) => {
      const menu = event.target.closest("[data-menu-toggle]");
      if (menu) INVO.$("[data-mobile-panel]")?.classList.toggle("is-open");
      const accordion = event.target.closest(".accordion-trigger");
      if (accordion) {
        const item = accordion.closest(".accordion-item");
        const open = item.classList.toggle("is-open");
        accordion.setAttribute("aria-expanded", String(open));
      }
      const copy = event.target.closest("[data-copy]");
      if (copy) navigator.clipboard?.writeText(location.href).then(() => INVO.toast("Link copied"));
    });

    INVO.$$("[data-counter]").forEach((counter) => {
      const target = Number(counter.dataset.counter || 0);
      let frame = 0;
      const run = () => {
        frame += 1;
        const value = Math.round(target * Math.min(frame / 42, 1));
        counter.textContent = counter.dataset.suffix ? `${value}${counter.dataset.suffix}` : value;
        if (frame < 42) requestAnimationFrame(run);
      };
      run();
    });

    const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: .12 }) : null;
    INVO.$$(".reveal").forEach((el) => observer ? observer.observe(el) : el.classList.add("is-visible"));

    const top = INVO.$(".back-to-top");
    addEventListener("scroll", () => top?.classList.toggle("is-visible", scrollY > 600), { passive: true });

    INVO.$$("[data-newsletter], [data-contact-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        form.reset();
        INVO.toast("Thanks. You're on the list.");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    bindInteractions();
  });
})();
