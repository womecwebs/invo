(function () {
  const config = {
    invoice: { store: "invo-invoice-draft", title: "Invoice", number: "INV-2026-001", due: 14, status: true, className: "invoice-doc", accent: "#2563EB" },
    quote: { store: "invo-quote-draft", title: "Quote", number: "QUO-2026-001", due: 30, status: false, className: "quote-doc", accent: "#0EA5E9" },
    receipt: { store: "invo-receipt-draft", title: "Receipt", number: "REC-2026-001", due: 0, status: false, className: "receipt-doc", accent: "#22C55E" }
  };

  function initBuilder(kind = "invoice") {
    const form = INVO.$("[data-document-form]");
    const body = INVO.$("[data-items-body]");
    const preview = INVO.$("[data-document-preview]");
    if (!form || !body || !preview) return;
    const cfg = config[kind];
    preview.classList.add(cfg.className);

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

    function documentStyles() {
      return `
        body{margin:0;background:#f8fafc;font-family:Inter,Arial,sans-serif;color:#111827}
        .print-wrap{max-width:850px;margin:24px auto;padding:16px}
        .document-preview{background:#fff;border-top:7px solid ${cfg.accent};padding:38px;min-height:1050px;box-shadow:0 18px 45px rgba(15,23,42,.08)}
        .doc-top,.doc-meta,.totals-row,.doc-footer{display:flex;justify-content:space-between;gap:18px}.doc-title{font-size:2rem;font-weight:900}.preview-logo{width:48px;height:48px;border-radius:8px;background:${cfg.accent};color:#fff;display:grid;place-items:center;font-weight:900}.doc-muted{color:#64748b}.doc-table{width:100%;border-collapse:collapse;margin:28px 0}.doc-table th{background:#f1f5f9;color:#334155;text-align:left}.doc-table th,.doc-table td{padding:11px;border-bottom:1px solid #e2e8f0}.totals{margin-left:auto;width:min(100%,330px)}.totals-row{padding:8px 0;border-bottom:1px solid #e2e8f0}.totals-row.grand{font-size:1.25rem;font-weight:900}@media print{body{background:#fff}.print-wrap{margin:0;padding:0;max-width:none}.document-preview{box-shadow:none;min-height:auto}}`;
    }

    function getDocumentHtml() {
      return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${cfg.title} - INVO</title><style>${documentStyles()}</style></head><body><main class="print-wrap"><section class="document-preview ${cfg.className}">${preview.innerHTML}</section></main></body></html>`;
    }

    function pdfEscape(value) {
      return String(value ?? "").replace(/[\\()]/g, "\\$&").replace(/\r?\n/g, " ");
    }

    function makePdf(lines) {
      const safeLines = lines.map(pdfEscape);
      const content = [
        "BT",
        "/F1 22 Tf",
        "50 780 Td",
        `(${cfg.title}) Tj`,
        "/F1 11 Tf",
        ...safeLines.flatMap((line, index) => [`0 ${index === 0 ? -34 : -18} Td`, `(${line}) Tj`]),
        "ET"
      ].join("\n");
      const objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
      ];
      let pdf = "%PDF-1.4\n";
      const offsets = [0];
      objects.forEach((obj, index) => {
        offsets.push(pdf.length);
        pdf += `${index + 1} 0 obj\n${obj}\nendobj\n`;
      });
      const xref = pdf.length;
      pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
      offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; });
      pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
      return new Blob([pdf], { type: "application/pdf" });
    }

    function exportPdf() {
      render();
      const data = INVO.serializeForm(form);
      const rows = readRows();
      const currency = data.currency || "USD";
      const total = rows.reduce((sum, row) => sum + row.total, 0);
      const lines = [
        `${data.company || "Your Company"} | ${data.email || ""} ${data.phone || ""}`,
        `${cfg.title} Number: ${data.docNumber || cfg.number}`,
        `Client: ${data.client || "Client Name"} ${data.clientEmail || ""}`,
        `Issue Date: ${data.issueDate || ""} | ${kind === "quote" ? "Valid Until" : "Due Date"}: ${data.dueDate || ""}`,
        "Items:",
        ...rows.map((row) => `${row.description || "Service"} - Qty ${row.quantity} - ${INVO.money(row.total, currency)}`),
        `Total: ${INVO.money(total, currency)}`,
        `Notes: ${data.notes || ""}`,
        `${kind === "receipt" ? "Payment" : "Payment Instructions"}: ${data.paymentMethod || data.bank || "Bank details provided on request."}`
      ];
      const blob = makePdf(lines);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${cfg.title.toLowerCase()}-${(data.docNumber || cfg.number).replace(/[^a-z0-9-]/gi, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      INVO.toast(`${cfg.title} PDF downloaded`);
    }

    function openFullScreenPreview() {
      render();
      let modal = INVO.$("[data-document-modal]");
      if (!modal) {
        modal = document.createElement("div");
        modal.className = "document-modal";
        modal.dataset.documentModal = "";
        modal.innerHTML = `<div class="document-modal-inner"><div class="document-modal-bar"><strong>Full-screen ${cfg.title} Preview</strong><button class="btn" type="button" data-close-document>Close</button></div><div class="document-preview ${cfg.className}" data-document-modal-preview></div></div>`;
        document.body.appendChild(modal);
      }
      INVO.$("[data-document-modal-preview]", modal).innerHTML = preview.innerHTML;
      modal.classList.add("is-open");
      modal.querySelector("[data-close-document]")?.focus();
    }

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
          <div><div class="preview-logo" style="background:${cfg.accent}">${safe((data.company || "I").slice(0, 1))}</div><h2 class="doc-title">${safe(data.company || "Your Company")}</h2><p class="doc-muted">${safe(data.address || "")}<br>${safe(data.email || "")} ${safe(data.phone || "")}<br>${safe(data.website || "")}</p></div>
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
      if (event.target.closest("[data-pdf]")) exportPdf();
      if (event.target.closest("[data-view-document]")) openFullScreenPreview();
      if (event.target.closest("[data-close-document]")) event.target.closest("[data-document-modal]")?.classList.remove("is-open");
    });
  }

  window.INVO.initDocumentBuilder = initBuilder;
})();
