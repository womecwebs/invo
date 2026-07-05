(function () {
  const affiliateUrl = "https://readdy.ai/?via=joshua-eddy";
  const slots = {
    leaderboard: { key: "5e0bc7ce7e8c29baedba215ddc1fefae", width: 728, height: 90 },
    banner: { key: "6b11f1dcd5ffaa97d65e5d670d426c8b", width: 468, height: 60 },
    rectangle: { key: "f3d568dad2f0df4ad9b86042f545c5f6", width: 300, height: 250 },
    skyscraper: { key: "4f04b858e0b72b77b48b3835cb223b9e", width: 160, height: 300 }
  };

  function createAd(type, label = "Advertisement") {
    const slot = slots[type];
    if (!slot) return null;
    const wrap = document.createElement("aside");
    wrap.className = "ad-slot";
    wrap.setAttribute("aria-label", label);
    wrap.innerHTML = `<div class="ad-shell" style="width:${slot.width}px;min-height:${slot.height}px" data-ad-shell><span class="ad-label">Advertisement</span><div data-ad-host></div></div>`;
    const host = wrap.querySelector("[data-ad-host]");
    const options = document.createElement("script");
    options.text = `atOptions={key:'${slot.key}',format:'iframe',height:${slot.height},width:${slot.width},params:{}};`;
    const invoke = document.createElement("script");
    invoke.src = `https://www.highperformanceformat.com/${slot.key}/invoke.js`;
    invoke.async = false;
    invoke.onerror = () => {
      host.innerHTML = `<a class="ad-fallback" href="${affiliateUrl}" target="_blank" rel="sponsored noopener">Create a professional business website with AI</a>`;
    };
    host.append(options, invoke);
    setTimeout(() => {
      const hasFrame = host.querySelector("iframe, ins, object");
      if (!hasFrame && host.textContent.trim() === "") {
        host.innerHTML = `<a class="ad-fallback" href="${affiliateUrl}" target="_blank" rel="sponsored noopener">Create a professional business website with AI</a>`;
      }
    }, 3500);
    return wrap;
  }

  function placeAds() {
    const main = document.querySelector("main");
    if (!main || document.querySelector("[data-invo-ads-ready]")) return;
    main.dataset.invoAdsReady = "true";
    const hero = main.querySelector(".hero, .document-hero, .section-sm");
    const leaderboard = createAd(innerWidth < 760 ? "banner" : "leaderboard", "Sponsored business resource");
    if (hero && leaderboard) hero.insertAdjacentElement("afterend", leaderboard);

    const appShell = main.querySelector(".app-shell");
    const section = main.querySelector(".section:last-of-type");
    setTimeout(() => {
      const secondary = createAd(appShell ? "rectangle" : "banner", "Advertisement");
      if (appShell && secondary) appShell.insertAdjacentElement("afterend", secondary);
      else if (section && secondary) section.insertAdjacentElement("afterend", secondary);
    }, 900);
  }

  function showAffiliate() {
    const dismissedUntil = Number(localStorage.getItem("invo-readdy-dismissed") || 0);
    if (Date.now() < dismissedUntil) return;
    const modal = document.createElement("div");
    modal.className = "affiliate-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Website builder recommendation");
    modal.innerHTML = `
      <div class="affiliate-card">
        <div class="affiliate-head">
          <div><span class="eyebrow">Business growth partner</span><h2>Need a website for your business too?</h2></div>
          <button class="icon-btn" type="button" data-affiliate-close aria-label="Close recommendation">x</button>
        </div>
        <p>Invoices help you get paid. A polished website helps clients trust you before they ever ask for a quote. Readdy AI can help business owners generate professional website ideas and pages faster with AI-assisted design and content.</p>
        <ul class="affiliate-list">
          <li>Turn a business idea into a website direction quickly.</li>
          <li>Create modern pages for services, portfolios and local businesses.</li>
          <li>Save time on layout, copy and design decisions.</li>
        </ul>
        <div class="form-actions"><a class="btn btn-primary" href="${affiliateUrl}" target="_blank" rel="sponsored noopener">Build your business website</a><button class="btn" type="button" data-affiliate-close>Maybe later</button></div>
      </div>`;
    document.body.appendChild(modal);
    setTimeout(() => {
      modal.classList.add("is-open");
      modal.querySelector("[data-affiliate-close]")?.focus();
    }, 10000);
  }

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-affiliate-close]")) return;
    localStorage.setItem("invo-readdy-dismissed", String(Date.now() + 12 * 60 * 60 * 1000));
    event.target.closest(".affiliate-modal")?.remove();
  });

  document.addEventListener("DOMContentLoaded", () => {
    placeAds();
    showAffiliate();
  });
})();
