(function () {
  document.addEventListener("click", (event) => {
    const filter = event.target.closest("[data-template-filter]");
    if (!filter) return;
    const value = filter.dataset.templateFilter;
    INVO.$$("[data-template-filter]").forEach((btn) => btn.classList.toggle("is-active", btn === filter));
    INVO.$$("[data-template-card]").forEach((card) => {
      card.hidden = value !== "all" && card.dataset.templateCard !== value;
    });
  });
})();
