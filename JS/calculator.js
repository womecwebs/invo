(function () {
  document.addEventListener("input", (event) => {
    const card = event.target.closest("[data-calculator]");
    if (!card) return;
    const type = card.dataset.calculator;
    const a = Number(INVO.$("[data-a]", card)?.value || 0);
    const b = Number(INVO.$("[data-b]", card)?.value || 0);
    let result = 0;
    if (type === "vat" || type === "gst" || type === "tax") result = a * (b / 100);
    if (type === "discount") result = a - a * (b / 100);
    if (type === "margin") result = a ? ((a - b) / a) * 100 : 0;
    if (type === "markup") result = b ? ((a - b) / b) * 100 : 0;
    if (type === "break-even") result = b ? a / b : 0;
    if (type === "late") result = a * (b / 100) / 365 * 30;
    INVO.$("[data-result]", card).textContent = type === "margin" || type === "markup" ? `${result.toFixed(2)}%` : result.toFixed(2);
  });
})();
