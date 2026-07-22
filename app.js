const STORAGE = {
  catalog: "app-cotizacion.catalog.v1",
  quotes: "app-cotizacion.quotes.v1",
  profile: "app-cotizacion.profile.v1"
};

const state = {
  catalog: null,
  activeCatalogSnapshot: null,
  items: [],
  currentQuoteId: null,
  installPrompt: null
};

const generatedQuoteIds = new Set();
let fallbackQuoteIdCounter = Date.now() >>> 0;
const generatedClientTokens = new Set();
let fallbackClientTokenCounter = Date.now() & 0xffffff;
const CLIENT_TOKEN_PATTERN = /^CLI-[A-F0-9]{6}$/;

const $ = (id) => document.getElementById(id);
const money = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0
});

function numberValue(id) {
  return Math.max(0, Number($(id).value) || 0);
}

function makeQuoteId() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  const prefix = `COT-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const existingIds = new Set(getQuotes().map((quote) => quote.quote_id));
  let id;

  do {
    id = `${prefix}-${makeQuoteIdSuffix()}`;
  } while (generatedQuoteIds.has(id) || existingIds.has(id));

  generatedQuoteIds.add(id);
  return id;
}

function makeQuoteIdSuffix() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  }

  if (globalThis.crypto?.getRandomValues) {
    const [value] = globalThis.crypto.getRandomValues(new Uint32Array(1));
    return value.toString(16).padStart(8, "0").toUpperCase();
  }

  fallbackQuoteIdCounter = (fallbackQuoteIdCounter + 1) >>> 0;
  return fallbackQuoteIdCounter.toString(16).padStart(8, "0").toUpperCase();
}

function normalizeClientToken(value) {
  return String(value || "").trim().toUpperCase();
}

function makeClientToken(reservedTokens = new Set()) {
  const storedTokens = new Set(
    getQuotes()
      .map((quote) => normalizeClientToken(quote?.client_token))
      .filter((token) => CLIENT_TOKEN_PATTERN.test(token))
  );
  let token;

  do {
    token = `CLI-${makeClientTokenSuffix()}`;
  } while (
    generatedClientTokens.has(token) ||
    storedTokens.has(token) ||
    reservedTokens.has(token)
  );

  generatedClientTokens.add(token);
  return token;
}

function makeClientTokenSuffix() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();
  }

  if (globalThis.crypto?.getRandomValues) {
    const [value] = globalThis.crypto.getRandomValues(new Uint32Array(1));
    return (value & 0xffffff).toString(16).padStart(6, "0").toUpperCase();
  }

  fallbackClientTokenCounter = (fallbackClientTokenCounter + 1) & 0xffffff;
  return fallbackClientTokenCounter.toString(16).padStart(6, "0").toUpperCase();
}

async function fetchCatalog(force = false) {
  const local = localStorage.getItem(STORAGE.catalog);

  if (!force && local) {
    try {
      state.catalog = JSON.parse(local);
      renderCatalog();
      return;
    } catch {
      localStorage.removeItem(STORAGE.catalog);
    }
  }

  try {
    const response = await fetch(`data/catalog.json?ts=${Date.now()}`, {
      cache: force ? "no-store" : "default"
    });
    if (!response.ok) throw new Error("No se pudo descargar el catálogo");
    state.catalog = await response.json();
    localStorage.setItem(STORAGE.catalog, JSON.stringify(state.catalog));
    renderCatalog();
    if (force) alert("Catálogo actualizado correctamente.");
  } catch (error) {
    if (local) {
      state.catalog = JSON.parse(local);
      renderCatalog();
      alert("Sin conexión. Se mantiene el catálogo guardado.");
    } else {
      $("catalogStatus").textContent = "Catálogo no disponible";
      renderSourceSummary();
      alert("No fue posible cargar el catálogo.");
    }
  }
}

function renderCatalog() {
  if (!state.catalog) {
    renderSourceSummary();
    return;
  }

  const source = state.catalog.source;
  $("catalogStatus").textContent =
    `${source.name} · versión ${state.catalog.version}${state.catalog.is_mock ? " · DEMO" : ""}`;
  renderSourceSummary();

  const options = $("productOptions");
  options.innerHTML = "";
  state.catalog.products.forEach((product) => {
    const option = document.createElement("option");
    option.value = `${product.name} — ${money.format(product.price_clp)}`;
    option.dataset.productId = product.product_id;
    options.appendChild(option);
  });
}

function createCatalogSnapshot(catalog) {
  if (!catalog) return null;

  return {
    dataset_id: catalog.dataset_id,
    version: catalog.version,
    generated_at: catalog.generated_at,
    source: structuredClone(catalog.source),
    is_mock: catalog.is_mock === true
  };
}

function renderSourceSummary() {
  const isHistoricalQuote = Boolean(state.currentQuoteId);
  const snapshot = state.activeCatalogSnapshot ||
    (isHistoricalQuote ? null : state.catalog);

  if (!snapshot || !snapshot.source) {
    $("sourceSummary").textContent = isHistoricalQuote
      ? "Fuente histórica no registrada. Los metadatos disponibles se conservan en cada material."
      : "Fuente de precios no disponible.";
    return;
  }

  const source = snapshot.source;
  const generated = snapshot.generated_at
    ? `<br>Generado: ${new Date(snapshot.generated_at).toLocaleString("es-CL")}`
    : "";
  const website = source.website
    ? `<br>Sitio: <a href="${escapeAttribute(source.website)}" target="_blank" rel="noreferrer">${escapeHtml(source.website)}</a>`
    : "";

  $("sourceSummary").innerHTML = `
    <strong>${escapeHtml(source.name)}</strong><br>
    Versión: ${escapeHtml(snapshot.version)}
    ${generated}
    ${website}
    ${snapshot.is_mock ? "<br><strong>Advertencia:</strong> catálogo demostrativo, no usar como precio vigente." : ""}
  `;
}

function findSelectedProduct() {
  const value = $("productSearch").value.trim().toLowerCase();
  if (!value || !state.catalog) return null;

  return state.catalog.products.find((product) => {
    const label = `${product.name} — ${money.format(product.price_clp)}`.toLowerCase();
    return label === value ||
      product.name.toLowerCase() === value ||
      product.sku.toLowerCase() === value;
  });
}

function addCatalogItem() {
  const product = findSelectedProduct();
  if (!product) {
    alert("Selecciona un producto de la lista.");
    return;
  }

  const quantity = numberValue("catalogQuantity");
  if (quantity <= 0) {
    alert("La cantidad debe ser mayor que cero.");
    return;
  }

  state.items.push({
    line_id: crypto.randomUUID(),
    product_id: product.product_id,
    sku: product.sku,
    name: product.name,
    unit: product.unit,
    quantity,
    unit_price_clp: product.price_clp,
    source_id: state.catalog.source.source_id,
    source_name: state.catalog.source.name,
    source_url: product.source_url,
    observed_at: product.observed_at,
    catalog_version: state.catalog.version,
    is_manual: false
  });

  $("productSearch").value = "";
  $("catalogQuantity").value = "1";
  renderItems();
}

function addManualItem() {
  const name = $("manualName").value.trim();
  const unitPrice = numberValue("manualPrice");
  const quantity = numberValue("manualQuantity");
  const unit = $("manualUnit").value.trim() || "unidad";

  if (!name || quantity <= 0) {
    alert("Ingresa el nombre y una cantidad válida.");
    return;
  }

  state.items.push({
    line_id: crypto.randomUUID(),
    product_id: null,
    sku: null,
    name,
    unit,
    quantity,
    unit_price_clp: unitPrice,
    source_id: "manual",
    source_name: "Ingresado manualmente",
    source_url: null,
    observed_at: new Date().toISOString(),
    catalog_version: null,
    is_manual: true
  });

  $("manualName").value = "";
  $("manualPrice").value = "";
  $("manualQuantity").value = "1";
  renderItems();
}

function renderItems() {
  const body = $("itemsBody");
  body.innerHTML = "";

  if (!state.items.length) {
    body.innerHTML = '<tr><td colspan="5" class="empty">Aún no hay materiales.</td></tr>';
    updateTotals();
    return;
  }

  state.items.forEach((item) => {
    const row = document.createElement("tr");
    const subtotal = item.quantity * item.unit_price_clp;

    row.innerHTML = `
      <td>
        <strong>${escapeHtml(item.name)}</strong><br>
        <small>${escapeHtml(item.unit)} · ${escapeHtml(item.source_name)}</small>
      </td>
      <td>${formatQuantity(item.quantity)}</td>
      <td>${money.format(item.unit_price_clp)}</td>
      <td>${money.format(subtotal)}</td>
      <td class="no-print">
        <button class="remove-item" type="button" data-line-id="${escapeAttribute(item.line_id)}">Quitar</button>
      </td>
    `;
    body.appendChild(row);
  });

  body.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => {
      state.items = state.items.filter((item) => item.line_id !== button.dataset.lineId);
      renderItems();
    });
  });

  updateTotals();
}

function totals() {
  const materials = state.items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price_clp,
    0
  );
  const labor = numberValue("laborCost");
  const transport = numberValue("transportCost");
  return {
    materials,
    labor,
    transport,
    total: materials + labor + transport
  };
}

function updateTotals() {
  const result = totals();
  $("materialsTotal").textContent = money.format(result.materials);
  $("laborTotal").textContent = money.format(result.labor);
  $("transportTotal").textContent = money.format(result.transport);
  $("grandTotal").textContent = money.format(result.total);
}

function validateClientTokenField() {
  const field = $("clientToken");
  const token = normalizeClientToken(field.value);
  const isValid = CLIENT_TOKEN_PATTERN.test(token);
  field.value = token;
  field.setCustomValidity(isValid ? "" : "Usa un token con formato CLI-XXXXXX.");
  field.setAttribute("aria-invalid", String(!isValid));
  updatePrintSummary();
  return isValid;
}

function updateWorkDetailsRequirement() {
  const isOther = $("workType").value === "Otro";
  const details = $("workDetails");
  details.required = isOther;
  $("workDetailsRequirement").textContent = isOther
    ? "— obligatorio para Otro"
    : "— opcional";
  $("workDetailsHint").textContent = isOther
    ? "Describe el trabajo cuando seleccionas Otro."
    : "La descripción adicional es opcional.";
  details.setCustomValidity(isOther && !details.value.trim()
    ? "Describe el trabajo cuando el tipo sea Otro."
    : "");
  details.setAttribute(
    "aria-invalid",
    String(Boolean(isOther && !details.value.trim()))
  );
  updatePrintSummary();
}

function updatePrintSummary() {
  $("printClientToken").textContent = normalizeClientToken($("clientToken").value) || "No disponible";
  $("printWorkType").textContent = $("workType").value || "No especificado";
  $("printWorkDetails").textContent = $("workDetails").value.trim() || "Sin descripción adicional";
}

function validateQuoteDetails() {
  const clientIsValid = validateClientTokenField();
  const workType = $("workType");
  const hasWorkType = Boolean(workType.value);
  workType.setCustomValidity(hasWorkType ? "" : "Selecciona un tipo de trabajo.");
  workType.setAttribute("aria-invalid", String(!hasWorkType));
  updateWorkDetailsRequirement();
  const detailsAreValid = workType.value !== "Otro" || Boolean($("workDetails").value.trim());

  if (!clientIsValid) $("clientToken").reportValidity();
  else if (!hasWorkType) workType.reportValidity();
  else if (!detailsAreValid) $("workDetails").reportValidity();

  return clientIsValid && hasWorkType && detailsAreValid;
}

function collectQuote() {
  const id = state.currentQuoteId || makeQuoteId();
  const result = totals();
  const catalogSnapshot = state.activeCatalogSnapshot
    ? structuredClone(state.activeCatalogSnapshot)
    : state.currentQuoteId
      ? null
      : createCatalogSnapshot(state.catalog);

  return {
    quote_id: id,
    created_at: new Date().toISOString(),
    worker: {
      name: $("workerName").value.trim(),
      phone: $("workerPhone").value.trim()
    },
    client_token: normalizeClientToken($("clientToken").value),
    work_type: $("workType").value,
    work_details: $("workDetails").value.trim(),
    items: structuredClone(state.items),
    costs: result,
    catalog_snapshot: catalogSnapshot
  };
}

function saveQuote() {
  if (!validateQuoteDetails()) return;

  if (!state.items.length && totals().total === 0) {
    alert("Agrega al menos un material o un costo.");
    return;
  }

  const quote = collectQuote();
  const quotes = getQuotes();
  const index = quotes.findIndex((item) => item.quote_id === quote.quote_id);

  if (index >= 0) {
    quotes[index] = quote;
  } else {
    quotes.unshift(quote);
  }

  localStorage.setItem(STORAGE.quotes, JSON.stringify(quotes));
  localStorage.setItem(
    STORAGE.profile,
    JSON.stringify({ name: quote.worker.name, phone: quote.worker.phone })
  );

  state.currentQuoteId = quote.quote_id;
  state.activeCatalogSnapshot = quote.catalog_snapshot
    ? structuredClone(quote.catalog_snapshot)
    : null;
  $("quoteIdLabel").textContent = quote.quote_id;
  renderSourceSummary();
  renderHistory();
  alert("Cotización guardada en este dispositivo.");
}

function getQuotes() {
  try {
    const quotes = JSON.parse(localStorage.getItem(STORAGE.quotes));
    return Array.isArray(quotes) ? quotes : [];
  } catch {
    return [];
  }
}

function sanitizeQuotes(quotes) {
  const reservedTokens = new Set(
    quotes
      .map((quote) => normalizeClientToken(quote?.client_token))
      .filter((token) => CLIENT_TOKEN_PATTERN.test(token))
  );
  let changed = false;

  quotes.forEach((quote) => {
    if (!quote || typeof quote !== "object") return;

    if (quote.client && typeof quote.client === "object") {
      if (Object.hasOwn(quote.client, "name")) {
        delete quote.client.name;
        changed = true;
      }
      if (Object.hasOwn(quote.client, "location")) {
        delete quote.client.location;
        changed = true;
      }
      if (!Object.keys(quote.client).length) {
        delete quote.client;
        changed = true;
      }
    }

    const normalizedToken = normalizeClientToken(quote.client_token);
    if (!CLIENT_TOKEN_PATTERN.test(normalizedToken)) {
      quote.client_token = makeClientToken(reservedTokens);
      reservedTokens.add(quote.client_token);
      changed = true;
    } else if (quote.client_token !== normalizedToken) {
      quote.client_token = normalizedToken;
      changed = true;
    }
  });

  return { quotes, changed };
}

function sanitizeStoredQuotes() {
  const stored = localStorage.getItem(STORAGE.quotes);
  if (!stored) return;

  try {
    const quotes = JSON.parse(stored);
    if (!Array.isArray(quotes)) return;
    const result = sanitizeQuotes(quotes);
    if (result.changed) {
      localStorage.setItem(STORAGE.quotes, JSON.stringify(result.quotes));
    }
  } catch {
    // Un almacenamiento dañado se deja intacto para evitar pérdida adicional.
  }
}

function renderHistory() {
  const container = $("quoteHistory");
  const quotes = getQuotes();
  container.innerHTML = "";

  if (!quotes.length) {
    container.innerHTML = '<p class="fine-print">No hay cotizaciones guardadas.</p>';
    return;
  }

  quotes.forEach((quote) => {
    if (!quote || typeof quote !== "object") return;

    const item = document.createElement("article");
    item.className = "history-item";
    item.innerHTML = `
      <div>
        <strong>${escapeHtml(quote?.quote_id || "Cotización sin ID")}</strong>
        <p>${escapeHtml(quote?.client_token || "Cliente anónimo")}</p>
        <p class="fine-print">${formatStoredDate(quote?.created_at)} · ${money.format(quote?.costs?.total || 0)}</p>
      </div>
      <div class="history-actions">
        <button class="secondary load-quote" type="button" data-id="${escapeAttribute(quote.quote_id)}">Abrir</button>
        <button class="remove-item delete-quote" type="button" data-id="${escapeAttribute(quote.quote_id)}">Borrar</button>
      </div>
    `;
    container.appendChild(item);
  });

  container.querySelectorAll(".load-quote").forEach((button) => {
    button.addEventListener("click", () => loadQuote(button.dataset.id));
  });

  container.querySelectorAll(".delete-quote").forEach((button) => {
    button.addEventListener("click", () => deleteQuote(button.dataset.id));
  });
}

function loadQuote(id) {
  const quote = getQuotes().find((item) => item.quote_id === id);
  if (!quote) return;

  state.currentQuoteId = quote.quote_id;
  state.activeCatalogSnapshot = quote.catalog_snapshot
    ? structuredClone(quote.catalog_snapshot)
    : null;
  state.items = structuredClone(Array.isArray(quote.items) ? quote.items : []);
  $("quoteIdLabel").textContent = quote.quote_id;
  $("quoteDate").textContent = new Date(quote.created_at).toLocaleDateString("es-CL");
  $("workerName").value = quote.worker?.name || "";
  $("workerPhone").value = quote.worker?.phone || "";
  $("clientToken").value = quote.client_token || makeClientToken();
  $("workType").value = quote.work_type || (quote.work_description ? "Otro" : "");
  $("workDetails").value = quote.work_details ?? quote.work_description ?? "";
  $("laborCost").value = quote.costs?.labor || 0;
  $("transportCost").value = quote.costs?.transport || 0;
  validateClientTokenField();
  updateWorkDetailsRequirement();
  renderItems();
  renderSourceSummary();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteQuote(id) {
  if (!confirm(`¿Borrar la cotización ${id}?`)) return;
  const quotes = getQuotes().filter((item) => item.quote_id !== id);
  localStorage.setItem(STORAGE.quotes, JSON.stringify(quotes));
  renderHistory();
}

function newQuote() {
  state.currentQuoteId = null;
  state.activeCatalogSnapshot = null;
  state.items = [];
  $("quoteIdLabel").textContent = "Nueva cotización";
  $("quoteDate").textContent = new Date().toLocaleDateString("es-CL");
  $("clientToken").value = makeClientToken();
  $("workType").value = "";
  $("workDetails").value = "";
  $("laborCost").value = "0";
  $("transportCost").value = "0";
  renderItems();
  renderSourceSummary();
  validateClientTokenField();
  updateWorkDetailsRequirement();
}

function exportBackup() {
  sanitizeStoredQuotes();
  const backup = {
    format: "app-cotizacion-backup",
    version: 1,
    exported_at: new Date().toISOString(),
    profile: JSON.parse(localStorage.getItem(STORAGE.profile) || "null"),
    catalog: state.catalog,
    quotes: getQuotes()
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `clinica-hogar-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function importBackup(file) {
  try {
    const backup = JSON.parse(await file.text());
    if (backup.format !== "app-cotizacion-backup" || !Array.isArray(backup.quotes)) {
      throw new Error("Formato inválido");
    }

    if (!confirm(`Se importarán ${backup.quotes.length} cotizaciones. ¿Continuar?`)) return;

    const sanitized = sanitizeQuotes(backup.quotes);
    localStorage.setItem(STORAGE.quotes, JSON.stringify(sanitized.quotes));
    if (backup.profile) {
      localStorage.setItem(STORAGE.profile, JSON.stringify(backup.profile));
      loadProfile();
    }
    if (backup.catalog) {
      state.catalog = backup.catalog;
      localStorage.setItem(STORAGE.catalog, JSON.stringify(backup.catalog));
      renderCatalog();
    }
    renderHistory();
    alert("Respaldo importado.");
  } catch {
    alert("El archivo no es un respaldo válido.");
  }
}

function loadProfile() {
  try {
    const profile = JSON.parse(localStorage.getItem(STORAGE.profile));
    if (!profile) return;
    $("workerName").value = profile.name || "";
    $("workerPhone").value = profile.phone || "";
  } catch {
    localStorage.removeItem(STORAGE.profile);
  }
}

function formatQuantity(value) {
  return new Intl.NumberFormat("es-CL", {
    maximumFractionDigits: 2
  }).format(value);
}

function formatStoredDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Fecha no disponible"
    : date.toLocaleString("es-CL");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function registerEvents() {
  $("addCatalogProduct").addEventListener("click", addCatalogItem);
  $("addManualProduct").addEventListener("click", addManualItem);
  $("saveQuote").addEventListener("click", saveQuote);
  $("printQuote").addEventListener("click", () => {
    updatePrintSummary();
    window.print();
  });
  $("newQuote").addEventListener("click", newQuote);
  $("generateClientToken").addEventListener("click", () => {
    $("clientToken").value = makeClientToken();
    validateClientTokenField();
  });
  $("clientToken").addEventListener("input", (event) => {
    event.target.value = normalizeClientToken(event.target.value);
    event.target.setCustomValidity("");
    event.target.setAttribute("aria-invalid", "false");
    updatePrintSummary();
  });
  $("clientToken").addEventListener("blur", validateClientTokenField);
  $("workType").addEventListener("change", () => {
    $("workType").setCustomValidity("");
    $("workType").setAttribute("aria-invalid", "false");
    updateWorkDetailsRequirement();
  });
  $("workDetails").addEventListener("input", updateWorkDetailsRequirement);
  $("updateCatalog").addEventListener("click", () => fetchCatalog(true));
  $("exportBackup").addEventListener("click", exportBackup);
  $("importBackup").addEventListener("change", (event) => {
    const [file] = event.target.files;
    if (file) importBackup(file);
    event.target.value = "";
  });

  ["laborCost", "transportCost"].forEach((id) => {
    $(id).addEventListener("input", updateTotals);
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.installPrompt = event;
    $("installButton").classList.remove("hidden");
  });

  $("installButton").addEventListener("click", async () => {
    if (!state.installPrompt) return;
    state.installPrompt.prompt();
    await state.installPrompt.userChoice;
    state.installPrompt = null;
    $("installButton").classList.add("hidden");
  });
}

async function initialize() {
  $("quoteDate").textContent = new Date().toLocaleDateString("es-CL");
  sanitizeStoredQuotes();
  loadProfile();
  registerEvents();
  newQuote();
  renderHistory();
  await fetchCatalog();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(console.error);
  }
}

initialize();
