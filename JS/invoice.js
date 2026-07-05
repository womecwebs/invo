(function () {
  const config = {
    invoice: { store: "invo-invoice-draft", title: "Invoice", number: "INV-2026-001", due: 14, status: true },
    quote: { store: "invo-quote-draft", title: "Quote", number: "QUO-2026-001", due: 30, status: false },
    receipt: { store: "invo-receipt-draft", title: "Receipt", number: "REC-2026-001", due: 0, status: false }
  };

  function initBuilder(kind = "invoice") {
    const form = INVO.$("[data-document-form]");
    const body = INVO.$("[data-items-body]");
    const preview = INVO.$("[data-document-preview]");
    if (!form || !body || !preview) return;
    const cfg = config[kind];

    const draft = INVO.storage.get(cfg.store, {});
    form.elements.company.value = draft.company || "Northstar Studio";
    form.elements.address.value = draft.address || "125 Market Street, San Francisco, CA";
    form.elements.email.value = draft.email || "billing@northstar.example";
    form.elements.phone.value = draft.phone || "+1 415 555 0198";
    form.elements.website.value = draft.website || "northstar.example";
    form.elements.taxNumber.value = draft.taxNumber || "TIN-209145";
    form.elements.bank.value = draft.bank || "Wise Business - Account ending 8821";
    form.elements.client.value = draft.client || "Acme Labs";
    form.elements.clientEmail.value = draft.clientEmail || "finance@acmelabs.example";
    form.elements.docNumber.value = draft.docNumber || cfg.number;
    form.elements.issueDate.value = draft.issueDate || INVO.today();
    form.elements.dueDate.value = draft.dueDate || INVO.addDays(cfg.due);
    form.elements.currency.value = draft.currency || "USD";
    form.elements.terms.value = draft.terms || (kind === "quote" ? "Quote valid for 30 days." : "Payment due on or before the due date.");
    form.elements.notes.value = draft.notes || "Thank you for your business.";
    if (form.elements.status) form.elements.status.value = draft.status || "Unpaid";
    if (form.elements.paymentMethod) form.elements.paymentMethod.value = draft.paymentMethod || "Bank transfer";

    const rows = draft.rows?.length ? draft.rows : [{ description: "Brand identity design", quantity: 1, price: 1200, discount: 0, tax: 8 }, { description: "Website landing page", quantity: 1, price: 1800, discount: 10, tax: 8 }];
    rows.forEach(addRow);
    render();

    function addRow(row = {}) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input name="description" value="${row.description || ""}" aria-label="Item description"></td>
        <td><input name="quantity" type="number" min="0" step="0.01" value="${row.quantity ?? 1}" aria-label="Quantity"></td>
        <td><input name="price" type="number" min="0" step="0.01" value="${row.price ?? 0}" aria-label="Unit price"></td>
        <td><input name="discount" type="number" min="0" max="100" step="0.01" value="${row.discount ?? 0}" aria-label="Discount percent"></td>
        <td><input name="tax" type="number" min="0" max="100" step="0.01" value="${row.tax ?? 0}" aria-label="Tax percent"></td>
        <td data-line-total></td>
        <td><button class="btn btn-danger" type="button" data-remove-row aria-label="Remove row">Remove</button></td>`;
      body.appendChild(tr);
    }

    function readRows() {
      return INVO.$$("tr", body).map((tr) => {
        const description = INVO.$('[name="description"]', tr).value;
        const quantity = Number(INVO.$('[name="quantity"]', tr).value || 0);
        const price = Number(INVO.$('[name="price"]', tr).value || 0);
        const discount = Number(INVO.$('[name="discount"]', tr).value || 0);
        const tax = Number(INVO.$('[name="tax"]', tr).value || 0);
        const discounted = quantity * price * (1 - discount / 100);
        const total = discounted * (1 + tax / 100);
        INVO.$("[data-line-total]", tr).textContent = INVO.money(total, form.elements.currency.value);
        return { description, quantity, price, discount, tax, total, subtotal: quantity * price, taxAmount: discounted * tax / 100 };
      });
    }

    function render() {
      const data = INVO.serializeForm(form);
      const rows = readRows();
      const subtotal = rows.reduce((sum, row) => sum + row.subtotal, 0);
      const tax = rows.reduce((sum, row) => sum + row.taxAmount, 0);
      const total = rows.reduce((sum, row) => sum + row.total, 0);
      const currency = data.currency || "USD";
      const safe = INVO.escape;
      preview.innerHTML = `
        <div class="doc-top">
          <div><div class="preview-logo">${safe((data.company || "I").slice(0, 1))}</div><h2 class="doc-title">${safe(data.company || "Your Company")}</h2><p class="doc-muted">${safe(data.address || "")}<br>${safe(data.email || "")} ${safe(data.phone || "")}<br>${safe(data.website || "")}</p></div>
          <div><div class="doc-title">${safe(cfg.title)}</div><p class="doc-muted"># ${safe(data.docNumber || cfg.number)}<br>${data.status ? `Status: ${safe(data.status)}<br>` : ""}Tax ID: ${safe(data.taxNumber || "Not provided")}</p></div>
        </div>
        <div class="doc-meta"><p><strong>Bill to</strong><br>${safe(data.client || "Client Name")}<br><span class="doc-muted">${safe(data.clientEmail || "")}</span></p><p><strong>Issue date</strong><br>${safe(data.issueDate || "")}<br><strong>${kind === "quote" ? "Valid until" : "Due date"}</strong><br>${safe(data.dueDate || "")}</p></div>
        <table class="doc-table"><thead><tr><th>Description</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${safe(row.description || "Service")}</td><td>${safe(row.quantity)}</td><td>${INVO.money(row.price, currency)}</td><td>${INVO.money(row.total, currency)}</td></tr>`).join("")}</tbody></table>
        <div class="totals"><div class="totals-row"><span>Subtotal</span><strong>${INVO.money(subtotal, currency)}</strong></div><div class="totals-row"><span>Tax</span><strong>${INVO.money(tax, currency)}</strong></div><div class="totals-row grand"><span>Total</span><strong>${INVO.money(total, currency)}</strong></div></div>
        <div class="doc-footer"><p><strong>Notes</strong><br>${safe(data.notes || "")}</p><p><strong>${kind === "receipt" ? "Payment" : "Payment instructions"}</strong><br>${safe(data.paymentMethod || data.bank || "Bank details provided on request.")}</p></div>
        ${kind === "quote" ? '<div class="surface" style="padding:14px;margin-top:18px;color:#111827">Accepted by: __________________ Date: __________</div>' : ""}
        ${kind === "receipt" ? '<div class="surface" style="padding:14px;margin-top:18px;color:#111827">Authorized signature and company stamp</div>' : ""}
      `;
      INVO.storage.set(cfg.store, { ...data, rows });
    }

    form.addEventListener("input", render);
    form.addEventListener("change", render);
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-add-row]")) { addRow(); render(); INVO.toast("Line item added"); }
      if (event.target.closest("[data-remove-row]")) { event.target.closest("tr").remove(); render(); }
      if (event.target.closest("[data-duplicate-row]")) { const rows = readRows(); addRow(rows.at(-1)); render(); }
      if (event.target.closest("[data-save-draft]")) { render(); INVO.toast("Draft saved locally"); }
      if (event.target.closest("[data-reset-draft]")) { INVO.storage.remove(cfg.store); location.reload(); }
      if (event.target.closest("[data-print]")) window.print();
      if (event.target.closest("[data-pdf]")) INVO.toast("PDF export hook ready for backend integration");
    });
  }

  window.INVO.initDocumentBuilder = initBuilder;
})();
