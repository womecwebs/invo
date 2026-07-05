(function () {
  const saved = INVO.storage.get("invo-theme", "light");
  document.documentElement.dataset.theme = saved;

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-theme-toggle]");
    if (!toggle) return;
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    INVO.storage.set("invo-theme", next);
    INVO.toast(`${next === "dark" ? "Dark" : "Light"} mode enabled`);
  });
})();
