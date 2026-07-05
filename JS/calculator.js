(function () {
  const labels = {
    vat: "VAT", gst: "GST", discount: "Final price", margin: "Profit margin", markup: "Markup",
    "break-even": "Break-even sales", tax: "Sales tax", late: "30-day interest",
    hourly: "Hourly rate", retainer: "Monthly retainer", runway: "Cash runway", deposit: "Deposit due"
  };

  function calculate(card) {
    const type = card.dataset.calculator;
    const a = Number(INVO.$("[data-a]", card)?.value || 0);
    const b = Number(INVO.$("[data-b]", card)?.value || 0);
    const c = Number(INVO.$("[data-c]", card)?.value || 0);
    let result = 0;
    let suffix = "";
    if (type === "vat" || type === "gst" || type === "tax") result = a * (b / 100);
    if (type === "discount") result = a - a * (b / 100);
    if (type === "margin") { result = a ? ((a - b) / a) * 100 : 0; suffix = "%"; }
    if (type === "markup") { result = b ? ((a - b) / b) * 100 : 0; suffix = "%"; }
    if (type === "break-even") result = b ? a / b : 0;
    if (type === "late") result = a * (b / 100) / 365 * (c || 30);
    if (type === "hourly") result = b ? a / b : 0;
    if (type === "retainer") result = a * b;
    if (type === "runway") result = b ? a / b : 0;
    if (type === "deposit") result = a * (b / 100);
    const display = suffix ? `${result.toFixed(2)}${suffix}` : result.toFixed(2);
    INVO.$("[data-result]", card).textContent = display;
    return { label: labels[type] || "Calculation", display };
  }

  function renderSaved() {
    const list = INVO.$("[data-saved-calcs]");
    if (!list) return;
    const saved = INVO.storage.get("invo-saved-calculations", []);
    list.innerHTML = saved.length ? saved.map((item) => `<li><strong>${INVO.escape(item.label)}</strong><span>${INVO.escape(item.display)}</span></li>`).join("") : "<li><span>No saved calculations yet.</span></li>";
  }

  document.addEventListener("input", (event) => {
    const card = event.target.closest("[data-calculator]");
    if (card) calculate(card);
  });

  document.addEventListener("click", (event) => {
    const save = event.target.closest("[data-save-calc]");
    const reset = event.target.closest("[data-clear-calcs]");
    if (save) {
      const card = save.closest("[data-calculator]");
      const item = calculate(card);
      const saved = INVO.storage.get("invo-saved-calculations", []);
      saved.unshift({ ...item, date: new Date().toISOString() });
      INVO.storage.set("invo-saved-calculations", saved.slice(0, 8));
      renderSaved();
      INVO.toast("Calculation saved");
    }
    if (reset) {
      INVO.storage.remove("invo-saved-calculations");
      renderSaved();
      INVO.toast("Saved calculations cleared");
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    INVO.$$("[data-calculator]").forEach(calculate);
    renderSaved();
  });
})();
