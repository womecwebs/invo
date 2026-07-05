(function () {
  document.addEventListener("input", (event) => {
    if (!event.target.matches("[data-blog-search]")) return;
    const q = event.target.value.toLowerCase();
    INVO.$$("[data-article-card]").forEach((card) => {
      card.hidden = !card.textContent.toLowerCase().includes(q);
    });
  });
})();
