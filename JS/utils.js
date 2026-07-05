const INVO = window.INVO || {};

INVO.$ = (selector, scope = document) => scope.querySelector(selector);
INVO.$$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

INVO.money = (value, currency = "USD") => {
  const amount = Number.isFinite(Number(value)) ? Number(value) : 0;
  return new Intl.NumberFormat("en", { style: "currency", currency }).format(amount);
};

INVO.toast = (message) => {
  let toast = INVO.$(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(INVO.toastTimer);
  INVO.toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
};

INVO.storage = {
  get(key, fallback = null) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

INVO.today = () => new Date().toISOString().slice(0, 10);
INVO.addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

INVO.serializeForm = (form) => Object.fromEntries(new FormData(form).entries());

INVO.escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;"
}[char]));

INVO.icon = (name) => {
  const icons = {
    invoice: "M7 3h7l4 4v14H7z M14 3v5h5 M9 13h8 M9 17h6",
    quote: "M5 5h14v12H8l-3 3z M8 9h8 M8 13h6",
    receipt: "M7 3l2 1 2-1 2 1 2-1 2 1v18l-2-1-2 1-2-1-2 1-2-1z M9 9h6 M9 13h8 M9 17h5",
    calculator: "M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M8 7h8 M8 11h2 M12 11h2 M16 11h0 M8 15h2 M12 15h2 M16 15h0",
    shield: "M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z",
    spark: "M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z",
    chart: "M4 19V5 M4 19h16 M8 16v-5 M12 16V8 M16 16v-8"
  };
  return `<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${icons[name] || icons.spark}"/></svg>`;
};

window.INVO = INVO;
