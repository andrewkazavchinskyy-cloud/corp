const $ = (id) => document.getElementById(id);
const titles = {
  board: ["Доска", "GitHub Issues"],
  auto: ["Работа", "Предложить → подтвердить → очередь"],
  project: ["Проект", "Этап"],
  graphs: ["Графы", "Все проекты"],
  map: ["Карта", "Сервер"],
  console: ["Консоль", "Агенты"],
  settings: ["Настройки", "Слоты и CLI"],
};
const FILTER_KEY = "corp_project";
const COLS = [
  ["backlog", "Backlog"],
  ["ready", "Ready"],
  ["in-progress", "Ход"],
  ["qa", "QA"],
  ["done", "Done"],
];

let state = { cards: [], projects: [], profiles: [], queue: [], queue_running: false, pins: [], slots: {}, catalog: {} };
let sheetIssue = "";
let phoneCol = "ready";
let settingsDirty = false;
let lastBoardKey = "";
let refreshBusy = false;
let catalogProbed = false;
let graphFocus = "";
let graphsCache = [];
let graphView = null;
let graphPick = "";
let graphQuery = "";
let graphsKey = "";
let orchPoll = 0;
let consolePick = "";
let consoleIssue = "";
let sheetReturn = null;
let refreshGen = 0;
let stripHold = 0;
let stripTarget = "";
const ROLE_RU = { orchestrator: "Оркестр", build: "Сборка", design: "Дизайн", qa: "QA" };
const KIND_RU = { claude: "Claude", codex: "Codex", grok: "Grok", cursor: "Cursor" };
const QUEUE_RU = { waiting: "ждёт", running: "идёт", failed: "упал", done: "готово", skipped: "пропуск" };
let lastAutoKey = "";
let autoUi = { propose: "", project: "", checked: [], model: "", err: "" };

function cookieGet(name) {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
}
function cookieSet(name, value) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
}
function currentFilter() {
  const value = cookieGet(FILTER_KEY) || localStorage.getItem(FILTER_KEY) || "all";
  if (value === "p0" || value === "me") return "all";
  return value;
}
function pinNames() {
  return (state.pins || []).map((p) => p.name);
}
function isPin(name) {
  return pinNames().includes(name);
}
function setFilter(value) {
  cookieSet(FILTER_KEY, value);
  localStorage.setItem(FILTER_KEY, value);
  graphFocus = "";
  graphPick = "";
  graphsKey = "";
  lastBoardKey = "";
  renderFilters();
  renderBoard();
  renderAuto();
  if ($("tab-project").classList.contains("on")) renderProject();
  if ($("tab-console").classList.contains("on")) pollConsole();
  if ($("tab-graphs").classList.contains("on")) renderGraphs();
}

function b64urlToBuf(value) {
  const pad = "=".repeat((4 - (value.length % 4)) % 4);
  const bin = atob(value.replace(/-/g, "+").replace(/_/g, "/") + pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}
function bufToB64url(buf) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function revivePublicKey(options) {
  options.challenge = b64urlToBuf(options.challenge);
  if (options.user?.id) options.user.id = b64urlToBuf(options.user.id);
  (options.excludeCredentials || []).forEach((c) => { c.id = b64urlToBuf(c.id); });
  (options.allowCredentials || []).forEach((c) => { c.id = b64urlToBuf(c.id); });
  return options;
}
function packAttestation(cred) {
  return {
    id: cred.id,
    rawId: bufToB64url(cred.rawId),
    type: cred.type,
    response: {
      attestationObject: bufToB64url(cred.response.attestationObject),
      clientDataJSON: bufToB64url(cred.response.clientDataJSON),
      transports: cred.response.getTransports?.() || [],
    },
  };
}
function packAssertion(cred) {
  return {
    id: cred.id,
    rawId: bufToB64url(cred.rawId),
    type: cred.type,
    response: {
      authenticatorData: bufToB64url(cred.response.authenticatorData),
      clientDataJSON: bufToB64url(cred.response.clientDataJSON),
      signature: bufToB64url(cred.response.signature),
      userHandle: cred.response.userHandle ? bufToB64url(cred.response.userHandle) : null,
    },
  };
}

async function api(path, body) {
  const res = await fetch(path, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.detail || res.statusText);
  return data;
}

function flash(msg, bad) {
  $("strip").classList.toggle("bad", !!bad);
  $("strip").innerHTML = `<i class="pulse"></i><b>${escapeHtml(humanizeError(msg))}</b>`;
  stripHold = Date.now() + (bad ? 8000 : 4000);
}

function humanizeError(msg) {
  const s = String(msg || "");
  if (/passkey/i.test(s)) return s;
  if (/503|502|504|429|github list failed|no server is currently available|временно не отвечает/i.test(s)) {
    return "GitHub временно не отвечает. Пробую снова…";
  }
  return s;
}

async function write(path, body, okMsg) {
  try {
    const data = await api(path, body);
    if (okMsg) flash(okMsg);
    return data;
  } catch (err) {
    flash(err.message, true);
    throw err;
  }
}

function setupTokenFromUrl() {
  const q = new URLSearchParams(location.search).get("token");
  if (q) return q;
  const raw = location.hash.slice(1);
  const query = raw.includes("?") ? raw.slice(raw.indexOf("?") + 1) : raw;
  return new URLSearchParams(query).get("token") || "";
}

function showApp() {
  $("gate").classList.add("hidden");
  $("app").classList.remove("hidden");
  refresh();
}

function showGate(hasPasskey, unknown) {
  $("app").classList.add("hidden");
  $("gate").classList.remove("hidden");
  $("btn-login").classList.toggle("hidden", !hasPasskey && !unknown);
  $("btn-register").textContent = hasPasskey ? "Новый ключ" : "Записать ключ";
  $("btn-register").classList.toggle("primary", !hasPasskey);
  $("token-label").textContent = hasPasskey ? "Токен восстановления" : "Токен первого входа";
  $("recover").open = !hasPasskey || Boolean(unknown) || Boolean($("token").value.trim());
  if (hasPasskey && !unknown) $("btn-login").focus();
}

async function boot() {
  const token = setupTokenFromUrl();
  if (token) $("token").value = token;
  try {
    const status = await api("/api/auth/status");
    if (status.ok) return showApp();
    showGate(status.has_passkey);
  } catch (err) {
    showGate(false, true);
    $("gate-err").textContent = err.message || "мастерская не ответила";
  }
}

$("btn-register").onclick = async () => {
  $("gate-err").textContent = "";
  try {
    const begin = await api("/api/auth/register/options", { token: $("token").value.trim() });
    const cred = await navigator.credentials.create({ publicKey: revivePublicKey(begin.options) });
    await api("/api/auth/register/verify", { challenge: begin.challenge, credential: packAttestation(cred) });
    showApp();
  } catch (err) {
    $("gate-err").textContent = err.message;
  }
};

$("btn-login").onclick = async () => {
  $("gate-err").textContent = "";
  try {
    const begin = await api("/api/auth/login/options", {});
    const cred = await navigator.credentials.get({ publicKey: revivePublicKey(begin.options) });
    await api("/api/auth/login/verify", { challenge: begin.challenge, credential: packAssertion(cred) });
    showApp();
  } catch (err) {
    $("gate-err").textContent = err.message;
  }
};

$("btn-add-key").onclick = async () => {
  $("auth-note").textContent = "";
  try {
    const begin = await api("/api/auth/register/options", {});
    const cred = await navigator.credentials.create({ publicKey: revivePublicKey(begin.options) });
    await api("/api/auth/register/verify", { challenge: begin.challenge, credential: packAttestation(cred) });
    $("auth-note").textContent = "ключ записан";
  } catch (err) {
    $("auth-note").textContent = err.message;
  }
};

$("btn-logout").onclick = async () => {
  try {
    await api("/api/auth/logout", {});
  } catch (_) { /* still leave */ }
  showGate(true);
};

function visibleCards() {
  const f = currentFilter();
  const cards = (state.cards || []).filter((c) => f === "all" || c.project === f);
  return cards.slice().sort((a, b) => {
    const pa = (a.labels || []).some((l) => l.name === "P0") ? 0 : 1;
    const pb = (b.labels || []).some((l) => l.name === "P0") ? 0 : 1;
    if (pa !== pb) return pa - pb;
    return (a.runner === "self" ? 0 : 1) - (b.runner === "self" ? 0 : 1);
  });
}

function renderFilters() {
  const hide = $("tab-settings").classList.contains("on");
  $("project-filters").classList.toggle("hidden", hide);
  if (hide) return;
  const pins = state.pins || [];
  const cur = currentFilter();
  const chips = [["all", "Все"], ...pins.map((p) => [p.name, p.name])];
  $("project-filters").innerHTML = chips.map(([id, label]) =>
    `<button type="button" class="chip${id === cur ? " on" : ""}" data-filter="${id}" aria-pressed="${id === cur ? "true" : "false"}">${escapeHtml(label)}</button>`
  ).join("");
  $("project-filters").querySelectorAll("[data-filter]").forEach((btn) => {
    btn.onclick = () => setFilter(btn.dataset.filter);
  });
}

function setTab(name) {
  document.querySelectorAll(".tab").forEach((el) => el.classList.toggle("on", el.id === `tab-${name}`));
  document.querySelectorAll("[data-tab]").forEach((el) => {
    const on = el.dataset.tab === name;
    el.classList.toggle("on", on);
    if (on) el.setAttribute("aria-current", "page");
    else el.removeAttribute("aria-current");
  });
  $("page-title").textContent = titles[name][0];
  $("page-kicker").textContent = titles[name][1];
  renderFilters();
  if (name === "console") pollConsole();
  if (name === "project") renderProject();
  if (name === "graphs") renderGraphs();
  if (name === "settings") renderRepos();
  if (name === "settings" && !catalogProbed) {
    catalogProbed = true;
    $("catalog-note").textContent = "снимаю каталог с VPS…";
    api("/api/settings?probe=1").then((data) => {
      if (!settingsDirty) {
        state.catalog = data.catalog || state.catalog;
        state.profiles = data.profiles || state.profiles;
        state.slots = data.slots || state.slots;
      } else {
        state.catalog = data.catalog || state.catalog;
      }
      renderSettings();
      renderSlots();
    }).catch((err) => {
      $("catalog-note").textContent = err.message;
    });
  }
}

document.querySelectorAll("[data-tab]").forEach((btn) => {
  btn.onclick = () => setTab(btn.dataset.tab);
});

function issueRef(card) {
  return `${card.repo}#${card.number}`;
}

function badge(card) {
  const bits = [];
  if (card.blocked) bits.push('<span class="badge blocked">блок</span>');
  if (card.queued) bits.push('<span class="badge">очередь</span>');
  if (card.runner === "self") bits.push('<span class="badge self">я</span>');
  else if (card.runner && card.runner !== "queued") bits.push(`<span class="badge vps">VPS · ${escapeHtml(card.runner)}</span>`);
  if (card.column === "qa") bits.push('<span class="badge">QA</span>');
  (card.labels || []).forEach((l) => {
    if (l.name === "qa-fail") bits.push('<span class="badge blocked">QA вернул</span>');
    if (["P0", "P1", "P2"].includes(l.name)) bits.push(`<span class="badge${l.name === "P0" ? " blocked" : ""}">${l.name}</span>`);
  });
  return bits.join("");
}

function cardClass(card) {
  const bits = ["card"];
  if ((card.labels || []).some((l) => l.name === "P0")) bits.push("p0");
  if (card.runner === "self") bits.push("me");
  else if (card.runner && card.runner !== "queued") bits.push("vps");
  return bits.join(" ");
}

function cardHtml(card) {
  const project = currentFilter() === "all" ? escapeHtml(card.project) : "";
  return `<button type="button" class="${cardClass(card)}" data-issue="${issueRef(card)}" data-col="${card.column}">
    <header><span>${project}</span><span>#${card.number}</span></header>
    <h3>${escapeHtml(card.title || "")}</h3>
    <div class="badges">${badge(card)}</div>
  </button>`;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function renderColnav() {
  const cards = visibleCards();
  $("colnav").innerHTML = COLS.map(([id, label]) => {
    const n = cards.filter((c) => c.column === id).length;
    return `<button type="button" data-col="${id}" class="${id === phoneCol ? "on" : ""}" aria-pressed="${id === phoneCol ? "true" : "false"}">${label} ${n}</button>`;
  }).join("");
  $("colnav").querySelectorAll("[data-col]").forEach((btn) => {
    btn.onclick = () => {
      phoneCol = btn.dataset.col;
      lastBoardKey = "";
      renderBoard();
    };
  });
}

function nextMove() {
  const cards = visibleCards();
  if (cards.some((c) => c.column === "ready")) return null;
  const f = currentFilter();
  const drafts = (state.drafts || []).filter((d) => f === "all" || d.project === f);
  if (drafts.length) return { kind: "drafts", count: drafts.length, project: drafts[0].project || "" };
  const backlog = cards.filter((c) => c.column === "backlog" && !c.blocked);
  if (backlog.length) {
    const c = backlog[0];
    return { kind: "backlog", issue: issueRef(c), title: c.title || "", project: c.project };
  }
  return { kind: "orch", project: f === "all" ? "" : f };
}

function nextCardHtml(next) {
  if (!next) return "";
  if (next.kind === "drafts") {
    return `<button type="button" class="card next" data-next="drafts" data-project="${escapeHtml(next.project || "")}">
      <header><span>следующий шаг</span><span>черновик</span></header>
      <h3>${next.count} ${next.count === 1 ? "черновик" : "черновиков"} · на Проекте</h3></button>`;
  }
  if (next.kind === "backlog") {
    return `<button type="button" class="card next" data-next="backlog" data-issue="${escapeHtml(next.issue)}">
      <header><span>следующий шаг</span><span>${escapeHtml(next.project || "")}</span></header>
      <h3>${escapeHtml(next.title || next.issue)} · в ready</h3></button>`;
  }
  return `<button type="button" class="card next" data-next="orch" data-project="${escapeHtml(next.project || "")}">
    <header><span>следующий шаг</span><span>orch</span></header>
    <h3>Разобрать · нет ready</h3></button>`;
}

function goNext(el) {
  const kind = el.dataset.next;
  if (kind === "backlog") {
    openSheet(el.dataset.issue);
    return;
  }
  const project = el.dataset.project || (state.drafts || [])[0]?.project || pinNames()[0];
  if (project) setFilter(project);
  setTab("project");
}

function renderBoard() {
  const cards = visibleCards();
  const next = nextMove();
  const key = JSON.stringify([
    cards.map((c) => [c.repo, c.number, c.column, c.runner, c.title]),
    next,
    phoneCol,
    currentFilter(),
  ]);
  if (key === lastBoardKey && $("board").children.length) {
    renderColnav();
    return;
  }
  lastBoardKey = key;
  $("board").innerHTML = COLS.map(([id, label]) => {
    const list = cards.filter((c) => c.column === id);
    const extra = id === "ready" ? nextCardHtml(next) : "";
    return `<div class="col-wrap${id === phoneCol ? " show" : ""}" data-col="${id}"><h2>${label} <span class="count">${list.length}</span></h2>
      <div class="lane" data-col="${id}">${extra}${list.map(cardHtml).join("")}</div></div>`;
  }).join("");
  renderColnav();
  $("board").querySelectorAll(".card.next").forEach((el) => {
    el.onclick = () => goNext(el);
  });
  $("board").querySelectorAll(".card:not(.next)").forEach((el) => {
    el.onclick = () => openSheet(el.dataset.issue);
  });
  if (window.matchMedia("(max-width: 899px)").matches) return;
  $("board").querySelectorAll(".lane").forEach((lane) => {
    if (!window.Sortable) return;
    Sortable.create(lane, {
      group: "board",
      animation: 150,
      filter: ".card.next",
      onMove: (evt) => evt.to.dataset.col !== "in-progress",
      onEnd: async (evt) => {
        const issue = evt.item.dataset.issue;
        const column = evt.to.dataset.col;
        const from = evt.from.dataset.col;
        if (!issue || column === from || column === "in-progress") return;
        lastBoardKey = "";
        try {
          if (column === "done" && from !== "qa") {
            await write("/api/move", { issue, column: "qa" }, "на QA");
          } else if (column === "done") {
            if (!confirm("Закрыть без повторного QA?")) {
              refresh();
              return;
            }
            await write("/api/close", { issue }, "закрыто");
          } else {
            await write("/api/move", { issue, column }, `в ${column}`);
          }
        } catch (_) { /* strip */ }
        refresh();
      },
    });
  });
}

function catalogKind(kind) {
  return ((state.catalog || {}).kinds || {})[kind] || {};
}

function buildProfileId(project) {
  const kind = ((state.slots || {})[project] || {}).build?.kind;
  const hit = (state.profiles || []).find((p) => p.kind === kind);
  return (hit || state.profiles[0] || {}).id || "";
}

function fillProfiles(select, selected) {
  select.innerHTML = (state.profiles || []).map((p) => {
    const installed = catalogKind(p.kind).installed !== false;
    return `<option value="${p.id}" ${p.id === selected ? "selected" : ""} ${installed ? "" : "disabled"}>${escapeHtml(p.label || p.id)} · ${escapeHtml(p.model || p.kind)}</option>`;
  }).join("");
}

function vpsRunner(card) {
  return card.runner && card.runner !== "self" && card.runner !== "queued";
}

function colWord(column) {
  return ({ backlog: "backlog", ready: "ready", "in-progress": "ход", qa: "QA", done: "закрыто" }[column] || column);
}

function githubLink(card) {
  return card.url
    ? `<a class="btn link" href="${escapeHtml(card.url)}" target="_blank" rel="noreferrer">Открыть на GitHub</a>`
    : "";
}

function sheetExits(card, extra = "") {
  const moves = [["ready", "В ready"], ["backlog", "В backlog"], ["qa", "На QA"]]
    .filter(([id]) => id !== card.column)
    .map(([id, label]) => `<button type="button" class="btn" data-col="${id}">${label}</button>`)
    .join("");
  const close = card.column === "qa"
    ? `<button type="button" class="btn danger" id="sheet-close">Закрыть без QA</button>`
    : "";
  return `${extra}${moves}${githubLink(card)}${close}`;
}

function bindSheetExits() {
  $("sheet-acts").querySelectorAll("[data-col]").forEach((b) => {
    b.onclick = async () => {
      try {
        await write("/api/move", { issue: sheetIssue, column: b.dataset.col }, `в ${b.dataset.col}`);
        closeSheet();
      } catch (_) { /* strip */ }
    };
  });
  if ($("sheet-close")) {
    $("sheet-close").onclick = async () => {
      if (!confirm("Закрыть ишью на GitHub?")) return;
      try {
        await write("/api/close", { issue: sheetIssue }, "закрыто");
        closeSheet();
      } catch (_) { /* strip */ }
    };
  }
}

function issueRole(card) {
  if (card.role) return ROLE_RU[card.role] || card.role;
  const names = (card.labels || []).map((l) => l.name);
  if (names.includes("in-qa")) return "QA";
  if (names.includes("design")) return "Дизайн";
  if (names.includes("qa")) return "QA";
  return "Сборка";
}

function sheetFocusables() {
  return [...$("sheet").querySelectorAll("button, [href], input, select, textarea")].filter((el) => !el.disabled);
}

function showSheet() {
  $("sheet").classList.remove("hidden");
  $("scrim").classList.remove("hidden");
  const first = sheetFocusables()[0];
  (first || $("sheet-cancel")).focus();
}

function openConsoleFor(card) {
  consoleIssue = issueRef(card);
  consolePick = card.project;
  closeSheet();
  setFilter(card.project);
  setTab("console");
}

function openSheet(issue) {
  const card = state.cards.find((c) => issueRef(c) === issue);
  if (!card) return;
  sheetReturn = document.activeElement;
  sheetIssue = issue;
  $("sheet-title").textContent = card.title || `${card.project} #${card.number}`;
  $("sheet-kicker").textContent = `${card.project} #${card.number} · ${colWord(card.column)} · ${issueRole(card)}`;
  const acts = $("sheet-acts");
  if (card.column === "done") {
    $("sheet-note").textContent = "Закрыто";
    acts.innerHTML = githubLink(card);
  } else if (card.runner === "self") {
    $("sheet-note").textContent = "Это ты. Карточка у тебя. VPS не стартует.";
    acts.innerHTML = sheetExits(card);
    bindSheetExits();
  } else if (card.column === "qa") {
    $("sheet-note").textContent = vpsRunner(card)
      ? `QA на VPS · ${card.runner}`
      : "Ждёт QA. После сборки и дизайна карточка всегда сюда. Если QA не примет — вернётся в ready с правками и пойдёт по кругу сама.";
    acts.innerHTML = sheetExits(card, vpsRunner(card)
      ? '<button type="button" class="btn primary" id="sheet-console">Консоль</button><button type="button" class="btn danger" id="sheet-abort">Откатить запуск</button>'
      : '<button type="button" class="btn primary" id="sheet-run">Запустить QA</button>');
    if ($("sheet-console")) {
      $("sheet-console").onclick = () => openConsoleFor(card);
    }
    if ($("sheet-abort")) {
      $("sheet-abort").onclick = async () => {
        if (!confirm("Остановить агента и вернуть карточку в ready?")) return;
        try { await write("/api/queue/abort", { issue: sheetIssue }, "откатил"); closeSheet(); } catch (_) { /* strip */ }
      };
    }
    if ($("sheet-run")) {
      $("sheet-run").onclick = async () => {
        try {
          await write("/api/run", { issue: sheetIssue }, "QA");
          closeSheet();
        } catch (_) { /* strip */ }
      };
    }
    bindSheetExits();
  } else if (card.column === "in-progress" && vpsRunner(card)) {
    $("sheet-note").textContent = `Уже бежит на VPS · ${card.runner}`;
    acts.innerHTML = sheetExits(card, '<button type="button" class="btn primary" id="sheet-console">Консоль</button><button type="button" class="btn danger" id="sheet-abort">Откатить запуск</button>');
    $("sheet-console").onclick = () => openConsoleFor(card);
    $("sheet-abort").onclick = async () => {
      if (!confirm("Остановить агента и вернуть карточку в ready?")) return;
      try { await write("/api/queue/abort", { issue: sheetIssue }, "откатил"); closeSheet(); } catch (_) { /* strip */ }
    };
    bindSheetExits();
  } else {
    const why = card.can_run === false ? (card.block_reason || "нельзя запустить") : "";
    $("sheet-note").textContent = card.blocked
      ? "blocked"
      : (why || `Роль ${issueRole(card)}. Слот на сервере, не профиль.`);
    acts.innerHTML = sheetExits(card, `<button type="button" class="btn primary" id="sheet-run"${why ? " disabled" : ""}>${why ? escapeHtml(why) : "Запустить на VPS"}</button>
      <button type="button" class="btn" id="sheet-self">Я сам</button>`);
    $("sheet-self").onclick = async () => {
      try {
        await write("/api/take", { issue: sheetIssue }, "взял");
        closeSheet();
      } catch (_) { /* strip */ }
    };
    if ($("sheet-run") && !why) {
      $("sheet-run").onclick = async () => {
        try {
          await write("/api/run", { issue: sheetIssue }, "VPS");
          closeSheet();
        } catch (_) { /* strip */ }
      };
    }
    bindSheetExits();
  }
  showSheet();
}

function closeSheet() {
  $("sheet").classList.add("hidden");
  $("scrim").classList.add("hidden");
  lastBoardKey = "";
  if (sheetReturn && sheetReturn.focus) {
    try { sheetReturn.focus(); } catch (_) { /* gone */ }
  }
  sheetReturn = null;
  refresh();
}

$("sheet-cancel").onclick = closeSheet;
$("scrim").onclick = closeSheet;
document.addEventListener("keydown", (evt) => {
  if ($("sheet").classList.contains("hidden")) return;
  if (evt.key === "Escape") {
    evt.preventDefault();
    closeSheet();
    return;
  }
  if (evt.key !== "Tab") return;
  const nodes = sheetFocusables();
  if (!nodes.length) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (evt.shiftKey && document.activeElement === first) {
    evt.preventDefault();
    last.focus();
  } else if (!evt.shiftKey && document.activeElement === last) {
    evt.preventDefault();
    first.focus();
  }
});

function autoProject() {
  const name = currentFilter();
  if (isPin(name)) return name;
  return pinNames()[0] || "";
}

function snapAuto() {
  if ($("propose-title")) autoUi.propose = $("propose-title").value;
  if ($("propose-project")) autoUi.project = $("propose-project").value;
  if ($("auto-model")) autoUi.model = $("auto-model").value;
  if ($("auto-ready")) {
    autoUi.checked = [...$("auto-ready").querySelectorAll("input:checked")].map((b) => b.value);
  }
}

function autoTyping() {
  const id = (document.activeElement && document.activeElement.id) || "";
  return id === "propose-title" || id === "auto-model";
}

function modelChoices() {
  const catalog = (state.catalog && state.catalog.kinds) || {};
  const kinds = ["claude", "codex", "grok", "cursor"];
  const out = [];
  kinds.forEach((kind) => {
    const row = catalog[kind] || {};
    const name = KIND_RU[kind] || kind;
    if (row.installed === false) {
      out.push({ value: `${kind}:`, label: `${name} — нет на сервере`, disabled: true });
      return;
    }
    const models = row.models || [];
    if (!models.length) {
      if (row.installed) out.push({ value: `${kind}:`, label: `${name} · как на сервере`, disabled: false });
      return;
    }
    models.forEach((m) => {
      out.push({ value: `${kind}:${m}`, label: `${name} · ${m}`, disabled: false });
    });
  });
  if (out.length) return out;
  return (state.profiles || []).map((p) => {
    const installed = catalogKind(p.kind).installed !== false;
    const name = KIND_RU[p.kind] || p.kind;
    return {
      value: `${p.kind}:${p.model || ""}`,
      label: p.model ? `${name} · ${p.model}` : name,
      disabled: !installed,
    };
  });
}

function parseModelPick(raw) {
  const text = raw || "";
  const i = text.indexOf(":");
  if (i < 0) return { kind: text, model: "" };
  return { kind: text.slice(0, i), model: text.slice(i + 1) };
}

function bindAutoQueue() {
  if (!$("auto-queue")) return;
  $("auto-queue").querySelectorAll("[data-rm]").forEach((btn) => {
    btn.onclick = async () => {
      try {
        const data = await api("/api/queue/rm", { issue: btn.dataset.rm });
        if (data.queue) state.queue = data.queue;
        autoUi.err = "";
      } catch (err) {
        autoUi.err = err.message;
      }
      lastAutoKey = "";
      renderAuto();
    };
  });
  $("auto-queue").querySelectorAll("[data-retry]").forEach((btn) => {
    btn.onclick = async () => {
      try {
        const data = await api("/api/queue/retry", { issue: btn.dataset.retry });
        if (data.queue) state.queue = data.queue;
        autoUi.err = "";
      } catch (err) {
        autoUi.err = err.message;
      }
      lastAutoKey = "";
      renderAuto();
    };
  });
  $("auto-queue").querySelectorAll("[data-abort]").forEach((btn) => {
    btn.onclick = async () => {
      if (!confirm("Остановить агента и вернуть карточку в ready?")) return;
      try {
        const data = await api("/api/queue/abort", { issue: btn.dataset.abort });
        if (data.queue) state.queue = data.queue;
        autoUi.err = "";
      } catch (err) {
        autoUi.err = err.message;
      }
      lastAutoKey = "";
      renderAuto();
    };
  });
  $("auto-queue").querySelectorAll("[data-console]").forEach((btn) => {
    btn.onclick = () => {
      consolePick = btn.dataset.console;
      consoleIssue = btn.dataset.issue || "";
      setTab("console");
    };
  });
}

function renderAutoQueue(queued) {
  $("auto-queue-box").innerHTML = `
    <h2>Очередь</h2>
    <p class="meta">${state.queue_running ? "идёт" : "пауза"}${queued.some((q) => q.status === "waiting") ? ` · ждут ${queued.filter((q) => q.status === "waiting").length}` : ""}</p>
    <div class="stack" id="auto-queue">${queued.map((q) => {
      const ref = `${q.repo}#${q.issue}`;
      const running = q.status === "running";
      const retry = q.status === "failed" || q.status === "done";
      const model = q.model || q.kind || "";
      return `<article class="card ${q.status === "failed" ? "fail" : ""}">
        <header><span>${escapeHtml(q.project || "")}${model ? ` · ${escapeHtml(model)}` : ""}</span>
          <span>${escapeHtml(QUEUE_RU[q.status] || q.status)}${q.attempts ? ` · попытка ${q.attempts}` : ""}</span></header>
        <h3>#${q.issue} ${escapeHtml(q.title || "")}</h3>
        ${q.last_error ? `<p class="err">${escapeHtml(q.last_error)}</p>` : ""}
        ${q.blocked_reason ? `<p class="err">${escapeHtml(q.blocked_reason)}</p>` : ""}
        <div class="row">
          ${running ? `<button type="button" class="btn danger" data-abort="${escapeHtml(ref)}">Откатить</button>` : ""}
          ${retry ? `<button type="button" class="btn primary" data-retry="${escapeHtml(ref)}">Перезапустить</button>` : ""}
          ${q.status !== "running" ? `<button type="button" class="btn" data-rm="${escapeHtml(ref)}">Снять</button>` : ""}
          <button type="button" class="btn" data-console="${escapeHtml(q.project || "")}" data-issue="${escapeHtml(ref)}">Консоль</button>
        </div>
      </article>`;
    }).join("") || '<p class="meta">Очередь пуста</p>'}</div>`;
  bindAutoQueue();
}

function renderAuto() {
  if (!$("auto-propose")) return;
  snapAuto();
  const project = autoUi.project || autoProject();
  const drafts = (state.drafts || []).filter((d) => {
    if (!project) return true;
    return d.project === project || (d.repo || "").endsWith(`/${project}`);
  });
  const ready = visibleCards().filter((c) => c.column === "ready" && c.runner !== "self" && c.can_run !== false);
  const queued = state.queue || [];
  const choices = modelChoices();
  const key = JSON.stringify([
    ready.map((c) => [c.repo, c.number, c.title]),
    queued.map((q) => [q.repo, q.issue, q.status, q.last_error, q.attempts]),
    drafts.map((d) => d.id),
    state.queue_running,
    choices.map((c) => c.value),
  ]);
  if (key === lastAutoKey && $("auto-go") && $("auto-ready")) {
    if ($("auto-err")) $("auto-err").textContent = autoUi.err;
    return;
  }
  lastAutoKey = key;
  const defaultPick = autoUi.model || (choices.find((c) => !c.disabled) || {}).value || "";
  const selected = autoUi.checked || [];
  const why = !ready.length
    ? "нет готовых задач — подтверди черновик или верни карточку"
    : !selected.length
      ? "отметь хотя бы одну задачу"
      : !defaultPick
        ? "выбери модель"
        : "";

  if (!$("propose-send")) {
    $("auto-propose").innerHTML = `
      <h2>Новая задача</h2>
      <p class="meta">В GitHub попадёт только после подтверждения.</p>
      <label>Проект
        <select id="propose-project">${pinNames().map((n) =>
          `<option ${n === project ? "selected" : ""}>${escapeHtml(n)}</option>`).join("")}</select>
      </label>
      <label>Что сделать <textarea id="propose-title" rows="3" maxlength="400" placeholder="Задача и как понять, что готово"></textarea></label>
      <button type="button" class="btn primary" id="propose-send">Отправить на подтверждение</button>`;
    $("propose-send").onclick = async () => {
      try {
        const text = ($("propose-title").value || "").trim();
        await api("/api/draft", {
          action: "propose",
          project: $("propose-project").value,
          title: text.slice(0, 120),
          body: text,
        });
        autoUi.propose = "";
        $("propose-title").value = "";
        autoUi.err = "";
      } catch (err) {
        autoUi.err = err.message;
      }
      lastAutoKey = "";
      renderAuto();
    };
  }
  if ($("propose-title") && autoUi.propose) $("propose-title").value = autoUi.propose;
  if ($("propose-project") && autoUi.project) $("propose-project").value = autoUi.project;

  $("auto-drafts").innerHTML = `
    <h2>Подтвердить</h2>
    <p class="meta">${drafts.length ? "Подтверждение заводит ишью в GitHub." : "Черновиков нет."}</p>
    <label class="pick tight"><input type="checkbox" id="auto-enqueue" ${state.auto_queue_on_approve !== false ? "checked" : ""}>
      <span>После подтверждения сразу поставить в очередь</span></label>
    <div class="stack" id="auto-draft-list">${drafts.map(draftCard).join("")}</div>`;
  $("auto-enqueue").onchange = async () => {
    try {
      await api("/api/settings", { auto_queue_on_approve: $("auto-enqueue").checked });
      state.auto_queue_on_approve = $("auto-enqueue").checked;
    } catch (err) {
      autoUi.err = err.message;
    }
  };
  $("auto-draft-list").querySelectorAll("[data-approve]").forEach((b) => {
    b.onclick = async () => {
      try {
        await api("/api/draft", { id: b.dataset.approve, action: "approve" });
        autoUi.err = "";
      } catch (err) {
        autoUi.err = err.message;
      }
      lastAutoKey = "";
      renderAuto();
    };
  });
  $("auto-draft-list").querySelectorAll("[data-skip]").forEach((b) => {
    b.onclick = async () => {
      try {
        await api("/api/draft", { id: b.dataset.skip, action: "skip" });
        autoUi.err = "";
      } catch (err) {
        autoUi.err = err.message;
      }
      lastAutoKey = "";
      renderAuto();
    };
  });

  $("auto-ready-box").innerHTML = `
    <div class="auto-step">
      <h2>1. Задачи</h2>
      <div class="stack" id="auto-ready">${ready.map((c) => {
        const ref = issueRef(c);
        return `<label class="pick card"><input type="checkbox" value="${escapeHtml(ref)}" ${selected.includes(ref) ? "checked" : ""}>
          <div><strong>${escapeHtml(c.project)} #${c.number}</strong>
          <div>${escapeHtml(c.title || "")}</div></div></label>`;
      }).join("") || '<p class="meta">Нет готовых задач. Подтверди черновик или верни карточку.</p>'}</div>
    </div>
    <div class="auto-step">
      <h2>2. Модель</h2>
      <label>Какой агент запустит выбранные
        <select id="auto-model">${choices.map((c) =>
          `<option value="${escapeHtml(c.value)}" ${c.value === defaultPick ? "selected" : ""} ${c.disabled ? "disabled" : ""}>${escapeHtml(c.label)}</option>`
        ).join("")}</select>
      </label>
    </div>
    <div class="auto-step">
      <h2>3. Запуск</h2>
      <button type="button" class="btn primary" id="auto-go"${why ? " disabled" : ""}>${why || "Запустить выбранные"}</button>
      <p class="err" id="auto-err">${escapeHtml(autoUi.err)}</p>
      ${state.queue_running ? '<button type="button" class="btn" id="auto-pause">Пауза</button>' : ""}
    </div>`;
  const syncGo = () => {
    snapAuto();
    const has = $("auto-ready") && $("auto-ready").querySelector("input:checked");
    const pick = $("auto-model") && $("auto-model").value;
    const msg = !ready.length
      ? "нет готовых задач — подтверди черновик или верни карточку"
      : !has
        ? "отметь хотя бы одну задачу"
        : !pick
          ? "выбери модель"
          : "";
    $("auto-go").disabled = !!msg;
    $("auto-go").textContent = msg || "Запустить выбранные";
  };
  $("auto-ready").onchange = syncGo;
  $("auto-model").onchange = syncGo;
  $("auto-go").onclick = async () => {
    snapAuto();
    const boxes = [...$("auto-ready").querySelectorAll("input:checked")].map((b) => b.value);
    const pick = parseModelPick($("auto-model").value);
    const profile = (state.profiles || []).find((p) => p.kind === pick.kind) || {};
    try {
      const added = await api("/api/queue/add", {
        issues: boxes,
        profile: profile.id || "",
        kind: pick.kind,
        model: pick.model,
      });
      if (added.queue) state.queue = added.queue;
      const started = await api("/api/queue/start", {});
      state.queue_running = true;
      if (started.queue) state.queue = started.queue;
      autoUi.checked = [];
      autoUi.err = "";
    } catch (err) {
      autoUi.err = err.message;
    }
    lastAutoKey = "";
    renderAuto();
  };
  if ($("auto-pause")) {
    $("auto-pause").onclick = async () => {
      try {
        const data = await api("/api/queue/pause", {});
        state.queue_running = false;
        if (data.queue) state.queue = data.queue;
        autoUi.err = "";
      } catch (err) {
        autoUi.err = err.message;
      }
      lastAutoKey = "";
      renderAuto();
    };
  }

  renderAutoQueue(queued);
}

function orbSize(nodes) {
  return Math.max(52, Math.min(88, 52 + Math.round((nodes || 0) / 10)));
}

function placeOnSky(i, n, inner) {
  const a = (i / Math.max(n, 1)) * Math.PI * 2 - Math.PI / 2;
  const r = inner ? 22 : (n <= 4 ? 26 : 32 + (i % 2) * 8);
  return `left:${(50 + r * Math.cos(a)).toFixed(1)}%;top:${(50 + r * Math.sin(a)).toFixed(1)}%`;
}

function graphMatch(text) {
  const q = graphQuery.trim().toLowerCase();
  return !q || String(text || "").toLowerCase().includes(q);
}

function groupHasQuery(g) {
  return graphMatch(g.name) || (g.nodes || []).some((n) => graphMatch(n));
}

function findGroup(name) {
  const groups = (graphView && graphView.groups) || [];
  return groups.find((g) => g.name === name)
    || groups.find((g) => (g.nodes || []).includes(name));
}

function graphSky(groups) {
  const vis = groups.length ? groups : [];
  const n = Math.max(vis.length, 1);
  return vis.map((g, i) => {
    const on = graphPick === g.name ? " on" : "";
    const off = groupHasQuery(g) ? "" : " off";
    const size = Math.max(40, Math.min(76, 30 + (g.size || 1) * 1.05));
    return `<button type="button" class="g-star c${i % 5}${on}${off}" data-group="${escapeHtml(g.name)}" style="${placeOnSky(i, n, false)};width:${size}px;height:${size}px" title="${escapeHtml(g.name)} · ${g.size}">
      <b>${escapeHtml(g.name)}</b><span>${g.size}</span></button>`;
  }).join("");
}

function graphPickHtml(g) {
  if (!g) return '<p class="meta">Нажмите сообщество на небе</p>';
  const nodes = (g.nodes || []).map((n) =>
    `<span class="chip${graphMatch(n) ? "" : " off"}">${escapeHtml(n)}</span>`
  ).join("");
  return `<section class="g-pick">
    <h3>${escapeHtml(g.name)}</h3>
    <p class="meta">${g.size} узлов · связь ${g.cohesion ?? "—"}</p>
    <div class="filters">${nodes || '<span class="meta">в отчёте только счётчик</span>'}</div>
  </section>`;
}

function graphJumps(g) {
  if (!g || !g.pinned) return "";
  return `<button type="button" class="btn" id="g-board">Доска</button>
    <button type="button" class="btn" id="g-project">Проект</button>`;
}

function bindGraphJumps(name) {
  if ($("g-board")) $("g-board").onclick = () => { setFilter(name); setTab("board"); };
  if ($("g-project")) $("g-project").onclick = () => { setFilter(name); setTab("project"); };
}

function bindGraphSearch() {
  const q = $("g-q");
  if (!q) return;
  q.value = graphQuery;
  q.oninput = () => {
    graphQuery = q.value;
    $("graphs").querySelectorAll("[data-graph], [data-group], [data-node]").forEach((el) => {
      const hay = el.dataset.graph || el.dataset.group || el.dataset.node || "";
      const group = el.dataset.group ? findGroup(el.dataset.group) : null;
      const ok = graphMatch(hay) || (group && groupHasQuery(group));
      el.classList.toggle("off", !ok);
    });
  };
}

function graphDetailHtml(g) {
  const groups = g.groups || [];
  if (graphPick && !groups.some((x) => x.name === graphPick)) graphPick = "";
  if (!graphPick && groups.length) {
    graphPick = groups.slice().sort((a, b) => (b.size || 0) - (a.size || 0))[0].name;
  }
  const picked = groups.find((x) => x.name === graphPick);
  const gods = (g.gods || []).map((x) =>
    `<li data-node="${escapeHtml(x.name)}"><button type="button" class="g-link" data-node="${escapeHtml(x.name)}"><b>${escapeHtml(x.name)}</b><span>${x.edges}</span></button></li>`
  ).join("") || "<li class=\"meta\">нет</li>";
  const hubs = (g.hubs || []).map((h) =>
    `<button type="button" class="chip" data-node="${escapeHtml(h)}">${escapeHtml(h)}</button>`
  ).join("");
  const bridges = (g.bridges || []).map((b) =>
    `<li><button type="button" class="g-link" data-node="${escapeHtml(b.a)}">${escapeHtml(b.a)}</button>
      <span class="meta">${escapeHtml(b.rel)}</span>
      <button type="button" class="g-link" data-node="${escapeHtml(b.b)}">${escapeHtml(b.b)}</button></li>`
  ).join("");
  return `<article class="g-detail">
    <header class="g-hero">
      <button type="button" class="btn link" id="g-back">Все проекты</button>
      <div>
        <p class="kicker">${g.pinned ? "пин" : "репо"} · ${escapeHtml(g.age || "")}</p>
        <h2>${escapeHtml(g.name)}</h2>
      </div>
      <div class="g-stats">
        <div><b>${g.nodes || 0}</b><span>узлы</span></div>
        <div><b>${g.edges || 0}</b><span>рёбра</span></div>
        <div><b>${g.communities || 0}</b><span>сообщества</span></div>
      </div>
      ${graphJumps(g)}
    </header>
    <label class="field tight g-search"><span>Найти</span><input id="g-q" type="search" placeholder="сообщество или узел"></label>
    <div class="g-sky">${graphSky(groups)}</div>
    ${graphPickHtml(picked)}
    <div class="g-meta">
      <section><h3>Хабы</h3><div class="filters">${hubs || '<span class="meta">нет</span>'}</div></section>
      <section><h3>Ядра</h3><ol class="g-gods">${gods}</ol></section>
      ${bridges ? `<section><h3>Мосты</h3><ol class="g-bridges">${bridges}</ol></section>` : ""}
    </div>
    <p class="meta">${escapeHtml(g.fresh ? `commit ${g.fresh}` : "")} · ${escapeHtml(g.repo || "")}</p>
  </article>`;
}

function graphGalaxyHtml(list) {
  const withG = list.filter((p) => p.has_graph).length;
  return `<div class="g-bar">
      <p class="meta">${withG} с графом · ${list.length - withG} без · орб = узлы</p>
      <input id="g-q" type="search" placeholder="найти проект" value="${escapeHtml(graphQuery)}">
    </div>
    <div class="g-sky g-galaxy-sky">${list.map((p, i) => {
      const size = orbSize(p.nodes);
      const cls = `g-orb${p.pinned ? " pin" : ""}${p.has_graph ? "" : " miss"}${graphMatch(p.name) ? "" : " off"}`;
      return `<button type="button" class="${cls}" data-graph="${escapeHtml(p.name)}" style="--orb:${size}px;${placeOnSky(i, list.length, p.pinned)}" title="${escapeHtml(p.name)} · ${p.has_graph ? (p.nodes || 0) : "нет"}">
        <i>${p.has_graph ? (p.nodes || 0) : "—"}</i>
        <b>${escapeHtml(p.name)}</b>
        <span>${p.has_graph ? `${p.communities || 0}` : "нет"}</span>
      </button>`;
    }).join("")}</div>`;
}

function selectGraphNode(name) {
  const hit = findGroup(name);
  if (!hit) {
    flash(name);
    return;
  }
  graphPick = hit.name;
  graphsKey = "";
  renderGraphs(true);
}

function bindGraphDetail(g) {
  $("g-back").onclick = () => { graphFocus = "*"; graphPick = ""; graphsKey = ""; renderGraphs(true); };
  bindGraphJumps(g.name);
  bindGraphSearch();
  $("graphs").querySelectorAll("[data-group]").forEach((el) => {
    el.onclick = () => { graphPick = el.dataset.group; graphsKey = ""; renderGraphs(true); };
  });
  $("graphs").querySelectorAll("[data-node]").forEach((el) => {
    el.onclick = () => selectGraphNode(el.dataset.node);
  });
}

async function renderGraphs(force) {
  const box = $("graphs");
  if (!box) return;
  const f = currentFilter();
  const want = graphFocus === "*" ? "" : (graphFocus || (isPin(f) ? f : ""));
  const key = `${f}|${graphFocus}|${want}|${graphPick}`;
  if (!force && key === graphsKey && box.children.length) return;
  try {
    if (want) {
      const g = (graphView && graphView.name === want)
        ? graphView
        : await api(`/api/graphs/view?name=${encodeURIComponent(want)}`);
      graphView = g;
      $("page-kicker").textContent = g.name || titles.graphs[1];
      if (!g.has_graph) {
        box.innerHTML = `<article class="g-detail">
          <header class="g-hero">
            <button type="button" class="btn link" id="g-back">Все проекты</button>
            <div><h2>${escapeHtml(g.name)}</h2><p class="meta">Графа ещё нет. Появится после close и graphify.</p></div>
            ${graphJumps(g)}
          </header></article>`;
        $("g-back").onclick = () => { graphFocus = "*"; graphsKey = ""; renderGraphs(true); };
        bindGraphJumps(g.name);
        graphsKey = key;
        return;
      }
      box.innerHTML = graphDetailHtml(g);
      bindGraphDetail(g);
      graphsKey = `${f}|${graphFocus}|${want}|${graphPick}`;
      return;
    }
    const data = await api("/api/graphs");
    graphsCache = data.projects || [];
    graphView = null;
    $("page-kicker").textContent = titles.graphs[1];
    box.innerHTML = graphGalaxyHtml(graphsCache);
    bindGraphSearch();
    box.querySelectorAll("[data-graph]").forEach((btn) => {
      btn.onclick = () => {
        const row = graphsCache.find((p) => p.name === btn.dataset.graph);
        if (!row || !row.has_graph) {
          flash("граф появится после close", true);
          return;
        }
        graphFocus = row.name;
        graphPick = "";
        graphsKey = "";
        renderGraphs(true);
      };
    });
    graphsKey = key;
  } catch (err) {
    box.innerHTML = `<p class="err">${escapeHtml(err.message)}</p>`;
    graphsKey = "";
  }
}

function renderMap(data) {
  const checks = (data.doctor?.checks || []).map((c) =>
    `<li><span class="${c.ok ? "okpill" : "nopill"}">${c.ok ? "ok" : "нет"}</span> ${escapeHtml(c.name)}</li>`
  ).join("");
  const projects = (data.projects || []).map((p) =>
    `<li>${escapeHtml(p.name)} — ${p.graphify ? "граф есть" : "графа нет"}</li>`
  ).join("");
  const live = (data.live || []).join(", ") || "тихо";
  const orch = (data.orch || []).join(", ") || "тихо";
  $("map").innerHTML = `
    <article><h2>Контур</h2><p class="meta">/opt/corp · Tailscale · GitHub Issues</p>
      <ul>${checks}</ul></article>
    <article><h2>Сейчас</h2>
      <div class="map-now">
        <div><b>${escapeHtml(live)}</b><span>VPS</span></div>
        <div><b>${escapeHtml(orch)}</b><span>orch</span></div>
        <div><b>${data.queue_running ? "идёт" : "пауза"}</b><span>Автоном</span></div>
      </div>
    </article>
    <article><h2>Проекты</h2><ul>${projects}</ul></article>`;
}

function draftCard(d) {
  const why = d.why ? `<p class="draft-why">${escapeHtml(d.why)}</p>` : "";
  const body = d.body ? `<details><summary class="meta">тело</summary><pre class="draft-body">${escapeHtml(d.body)}</pre></details>` : "";
  const prd = d.vs_prd ? `<p class="meta">В спеке: ${escapeHtml(d.vs_prd)}</p>` : "";
  const open = d.vs_open ? `<p class="meta">На доске: ${escapeHtml(d.vs_open)}</p>` : "";
  return `<article class="card draft"><header><span>${escapeHtml(d.kind || "build")}</span><span>${escapeHtml(d.label || "")}</span></header>
    <h3>${escapeHtml(d.title)}</h3>
    ${why}${prd}${open}
    <div class="row">
      <button class="btn primary" data-approve="${d.id}">Approve</button>
      <button class="btn" data-skip="${d.id}">Skip</button>
    </div>
    ${body}</article>`;
}

function orchCard(orch, name) {
  if (!orch || !orch.status) return "";
  const live = orch.running || orch.status === "running";
  const mins = orch.started ? Math.max(0, Math.round((Date.now() / 1000 - orch.started) / 60)) : 0;
  const title = live
    ? `Исследует · ${mins} мин`
    : orch.status === "failed"
      ? "Исследование сломалось"
      : `Исследование готово · ${orch.drafts || 0} черновиков`;
  const log = orch.pane || orch.log || "";
  return `<article class="card orch ${live ? "live" : ""}"><h3>${title}</h3>
    <p class="meta">${escapeHtml(orch.kind || "orch")}</p>
    <pre class="orch-log">${escapeHtml(log || "ждём вывод…")}</pre>
    ${live ? `<button type="button" class="btn" id="orch-console" data-orch="${escapeHtml(name)}">Консоль</button>` : ""}</article>`;
}

function watchOrch(running) {
  clearTimeout(orchPoll);
  orchPoll = 0;
  if (running && $("tab-project").classList.contains("on")) {
    orchPoll = setTimeout(() => renderProject(), 4000);
  }
}

function stageLine(s) {
  if ((s.p0 || 0) > 0) return `${s.p0} P0 ждёт`;
  if ((s.qa || 0) > 0) return `QA · ${s.qa}`;
  if ((s.in_progress || 0) > 0) return `Идёт · ход ${s.in_progress}`;
  if ((s.ready || 0) === 0) return "Нет ready — пора разобрать";
  return `${s.ready} ready`;
}

async function renderProject() {
  const name = currentFilter();
  if (!isPin(name)) {
    $("orch-run").disabled = true;
    $("orch-run").textContent = "Разобрать";
    $("project-box").innerHTML = '<p class="meta">Выберите corp или clarity в шапке</p>';
    return;
  }
  try {
    const data = await api(`/api/project?name=${encodeURIComponent(name)}`);
    const s = data.stage || {};
    const drafts = data.drafts || [];
    const orch = data.orch || {};
    const researching = Boolean(orch.running || orch.status === "running");
    $("orch-run").disabled = researching;
    $("orch-run").textContent = researching ? "Идёт разбор…" : "Разобрать";
    $("project-box").innerHTML = `
      <article class="card"><h3>${escapeHtml(stageLine(s))}</h3>
        <p class="meta">open ${s.open || 0} · ready ${s.ready || 0} · P0 ${s.p0 || 0} · ход ${s.in_progress || 0} · QA ${s.qa || 0}</p>
        <p class="meta">граф ${escapeHtml(s.graph_age || "нет")} · ${(s.docs || []).join(", ") || "нет спеки"}</p>
      </article>
      ${orchCard(orch, name)}
      ${drafts.map(draftCard).join("") || (researching ? "" : '<p class="meta">Черновиков нет</p>')}`;
    $("project-box").querySelectorAll("[data-approve]").forEach((b) => {
      b.onclick = async () => { try { await write("/api/draft", { id: b.dataset.approve, action: "approve" }, "ишью на GitHub"); } catch (_) { /* strip */ } renderProject(); };
    });
    $("project-box").querySelectorAll("[data-skip]").forEach((b) => {
      b.onclick = async () => { try { await write("/api/draft", { id: b.dataset.skip, action: "skip" }, "пропустил"); } catch (_) { /* strip */ } renderProject(); };
    });
    if ($("orch-console")) {
      $("orch-console").onclick = () => {
        consolePick = `orch:${$("orch-console").dataset.orch || name}`;
        setTab("console");
      };
    }
    watchOrch(researching);
  } catch (err) {
    $("project-box").innerHTML = `<p class="err">${escapeHtml(err.message)}</p>`;
  }
}

$("orch-run").onclick = async () => {
  const name = currentFilter();
  if (!isPin(name)) {
    flash("сначала выберите corp или clarity", true);
    return;
  }
  try { await write("/api/orchestrate", { project: name }, "orch"); } catch (_) { /* strip */ }
  renderProject();
};

function optionList(values, selected, extra) {
  const all = [...values];
  if (extra && !all.includes(extra)) all.unshift(extra);
  return all.map((v) => `<option ${v === selected ? "selected" : ""}>${escapeHtml(v)}</option>`).join("");
}

function kindStatus(kind) {
  const row = catalogKind(kind);
  if (!row.installed) return ["nopill", "нет CLI"];
  if (row.stale) return ["nopill", "кэш"];
  if (!(row.models || []).length) return ["nopill", "пусто"];
  return ["okpill", "готов"];
}

function modelField(kind, selected, slot, role) {
  const row = catalogKind(kind);
  const models = row.models || [];
  const attrs = slot ? `data-slot="${slot}" data-role="${role}"` : "";
  const select = `<select ${attrs} data-k="model">
            <option value="">auto</option>
            ${optionList(models, selected, selected)}
          </select>`;
  if (models.length && !row.stale) return select;
  return `${select}<input ${attrs} data-k="model-custom" placeholder="свой id с CLI" value="${escapeHtml(selected || "")}">`;
}

function renderSettings() {
  $("max-parallel").value = state.max_parallel || 3;
  if ($("queue-retries")) $("queue-retries").value = state.queue_retries ?? 2;
  const catalog = (state.catalog && state.catalog.kinds) || {};
  const probed = state.catalog && state.catalog.probed_at ? `каталог ${state.catalog.probed_at}` : "каталог ещё не снимали";
  $("catalog-note").textContent = probed;
  $("profiles").innerHTML = (state.profiles || []).map((p, i) => {
    const kind = catalog[p.kind] || {};
    const efforts = kind.efforts || [];
    const [pill, status] = kindStatus(p.kind);
    return `<article class="plan ${escapeHtml(p.kind)}" data-i="${i}"><i class="accent"></i><div class="plan-b">
      <div class="plan-h"><div><h3>${escapeHtml(p.label || p.kind)}</h3>
        <p>${escapeHtml(p.kind)}</p></div>
        <span class="${pill}">${status}</span></div>
      <div class="grid2">
        <label>Имя <input data-k="label" value="${escapeHtml(p.label || "")}"></label>
        <label>Адаптер
          <select data-k="kind">
            ${["claude", "codex", "grok", "cursor"].map((k) =>
              `<option ${p.kind === k ? "selected" : ""} ${catalog[k] && catalog[k].installed === false ? "disabled" : ""}>${k}</option>`).join("")}
          </select>
        </label>
        <label>Модель
          ${modelField(p.kind, p.model)}
        </label>
        <label>Effort
          <select data-k="effort">
            <option value=""></option>
            ${optionList(efforts, p.effort, p.effort)}
          </select>
        </label>
        <label>Fast <input data-k="fast" type="checkbox" ${p.fast ? "checked" : ""} ${kind.fast ? "" : "disabled"}></label>
      </div>
    </div></article>`;
  }).join("");
}

$("add-profile").onclick = () => {
  state.profiles.push({ id: `p${Date.now()}`, kind: "claude", label: "Новая", model: "", effort: "high", fast: false });
  markDirty();
  renderSettings();
};

function renderSlots() {
  const pins = state.pins || [];
  const catalog = (state.catalog && state.catalog.kinds) || {};
  $("slots").innerHTML = pins.map((p) => {
    const slots = (state.slots || {})[p.name] || {};
    return `<article class="panel"><h2>${escapeHtml(p.name)} · слоты</h2>${["orchestrator", "build", "design", "qa"].map((role) => {
      const s = slots[role] || {};
      const kindName = s.kind || "claude";
      const kind = catalog[kindName] || {};
      return `<div class="grid2">
        <label>${ROLE_RU[role] || role}
        <select data-slot="${p.name}" data-role="${role}" data-k="kind">
          ${["claude", "codex", "grok", "cursor"].map((k) =>
            `<option ${kindName === k ? "selected" : ""} ${catalog[k] && catalog[k].installed === false ? "disabled" : ""}>${k}</option>`).join("")}
        </select></label>
        <label>модель ${modelField(kindName, s.model, p.name, role)}</label>
        <label>effort
        <select data-slot="${p.name}" data-role="${role}" data-k="effort">
          ${(kind.efforts || []).map((e) => `<option ${s.effort === e ? "selected" : ""}>${e}</option>`).join("")}
        </select></label>
        ${kind.fast ? `<label class="pick">Fast <input type="checkbox" data-slot="${p.name}" data-role="${role}" data-k="fast" ${s.fast ? "checked" : ""}></label>` : ""}
      </div>`;
    }).join("")}</article>`;
  }).join("");
}

function markDirty() {
  settingsDirty = true;
  $("save-settings").disabled = false;
}

$("tab-settings").addEventListener("input", markDirty);
$("tab-settings").addEventListener("change", (evt) => {
  markDirty();
  if (evt.target && evt.target.dataset.k === "kind") {
    const card = evt.target.closest("[data-i]");
    if (card) {
      const i = Number(card.dataset.i);
      const get = (k) => card.querySelector(`[data-k="${k}"]`);
      state.profiles[i] = {
        ...state.profiles[i],
        kind: get("kind").value,
        label: get("label").value,
        model: "",
        effort: get("effort")?.value || "",
        fast: Boolean(get("fast")?.checked),
      };
      renderSettings();
      return;
    }
    if (evt.target.dataset.slot) {
      const name = evt.target.dataset.slot;
      const role = evt.target.dataset.role;
      state.slots[name] = state.slots[name] || {};
      state.slots[name][role] = { ...(state.slots[name][role] || {}), kind: evt.target.value, model: "" };
      renderSlots();
    }
  }
});

$("refresh-catalog").onclick = async () => {
  $("catalog-note").textContent = "снимаю каталог с VPS…";
  try {
    state.catalog = await api("/api/catalog", {});
    markDirty();
    renderSettings();
    renderSlots();
  } catch (err) {
    $("catalog-note").textContent = err.message;
  }
};
$("btn-add-repo").onclick = async () => {
  try { await write("/api/projects/add", { repo: $("add-repo").value.trim() }, "на доске"); } catch (_) { return; }
  refresh();
  renderRepos();
};
$("btn-create-repo").onclick = async () => {
  try { await write("/api/projects/create", { name: $("new-repo").value.trim() }, "создан"); } catch (_) { return; }
  refresh();
  renderRepos();
};

async function renderRepos() {
  const box = $("repo-list");
  if (!box) return;
  try {
    const data = await api("/api/repos");
    box.innerHTML = (data.repos || []).map((r) => {
      const bits = [];
      if (r.pinned) {
        bits.push(`<button type="button" class="btn" data-hide="${escapeHtml(r.name)}">Скрыть</button>`);
        bits.push(`<button type="button" class="btn" data-archive="${escapeHtml(r.name)}">Архивировать</button>`);
      } else if (r.archived) {
        bits.push(`<button type="button" class="btn primary" data-unarchive="${escapeHtml(r.repo)}">Разархивировать</button>`);
      } else {
        bits.push(`<button type="button" class="btn primary" data-add="${escapeHtml(r.repo)}">Вернуть на доску</button>`);
      }
      const mark = r.pinned ? "на доске" : r.archived ? "архив" : "скрыт";
      return `<article class="card"><header><span>${escapeHtml(r.name)}</span><span>${mark}</span></header>
        <p class="meta">${escapeHtml(r.repo)}</p><div class="row">${bits.join("")}</div></article>`;
    }).join("") || '<p class="meta">Репозиториев нет</p>';
    box.querySelectorAll("[data-hide]").forEach((b) => {
      b.onclick = async () => {
        if (!confirm(`Скрыть ${b.dataset.hide} с доски?`)) return;
        try { await write("/api/hide", { project: b.dataset.hide }, "скрыт"); } catch (_) { return; }
        refresh();
        renderRepos();
      };
    });
    box.querySelectorAll("[data-archive]").forEach((b) => {
      b.onclick = async () => {
        if (!confirm(`Архивировать ${b.dataset.archive} на GitHub? Репо не удаляется.`)) return;
        try { await write("/api/archive", { project: b.dataset.archive }, "архив"); } catch (_) { return; }
        refresh();
        renderRepos();
      };
    });
    box.querySelectorAll("[data-add]").forEach((b) => {
      b.onclick = async () => {
        try { await write("/api/projects/add", { repo: b.dataset.add }, "на доске"); } catch (_) { return; }
        refresh();
        renderRepos();
      };
    });
    box.querySelectorAll("[data-unarchive]").forEach((b) => {
      b.onclick = async () => {
        if (!confirm(`Разархивировать ${b.dataset.unarchive} и вернуть на доску?`)) return;
        try { await write("/api/unarchive", { repo: b.dataset.unarchive }, "вернул"); } catch (_) { return; }
        refresh();
        renderRepos();
      };
    });
  } catch (err) {
    box.innerHTML = `<p class="err">${escapeHtml(err.message)}</p>`;
  }
}

$("save-settings").onclick = async () => {
  const profiles = [...$("profiles").querySelectorAll("[data-i]")].map((card, i) => {
    const prev = state.profiles[i];
    const get = (k) => card.querySelector(`[data-k="${k}"]`);
    return {
      id: prev.id,
      kind: get("kind").value,
      label: get("label").value,
      model: get("model-custom")?.value.trim() || get("model").value,
      effort: get("effort").value,
      fast: Boolean(get("fast")?.checked),
    };
  });
  const slots = {};
  document.querySelectorAll("#slots [data-slot]").forEach((el) => {
    const name = el.dataset.slot;
    const role = el.dataset.role;
    slots[name] = slots[name] || {};
    slots[name][role] = slots[name][role] || { kind: "claude", model: "", effort: "high", fast: false };
    if (el.dataset.k === "fast") slots[name][role].fast = el.checked;
    else if (el.dataset.k === "model-custom" && el.value.trim()) slots[name][role].model = el.value.trim();
    else if (el.dataset.k !== "model-custom") slots[name][role][el.dataset.k] = el.value;
  });
  try {
    await write("/api/settings", {
      profiles,
      max_parallel: Number($("max-parallel").value),
      queue_retries: Number($("queue-retries")?.value || 2),
      slots,
    }, "сохранил");
  } catch (_) { return; }
  settingsDirty = false;
  $("save-settings").disabled = true;
  refresh();
};

$("console-project").onchange = () => pollConsole();

function liveLabel(p) {
  return p.startsWith("orch:") ? `orch · ${p.slice(5)}` : p;
}

async function pollConsole() {
  const f = currentFilter();
  let pick = consolePick || $("console-project").value;
  if (isPin(f) && pick !== f && pick !== `orch:${f}`) pick = f;
  if (consolePick) pick = consolePick;
  consolePick = "";
  const issue = consoleIssue;
  try {
    const qs = new URLSearchParams();
    if (pick) qs.set("project", pick);
    if (issue) qs.set("issue", issue);
    const data = await api(`/api/console?${qs}`);
    const parts = [];
    if (data.last_error) parts.push(data.last_error);
    if (data.log) parts.push(data.log);
    if (!issue && data.pane) parts.push(data.pane);
    $("console").textContent = parts.join("\n\n") || "пусто";
    $("console").scrollTop = $("console").scrollHeight;
    const live = data.live || [];
    const names = [...new Set([...pinNames(), ...live, ...(isPin(f) ? [f, `orch:${f}`] : [])])];
    $("console-project").innerHTML = `<option value="">сессия</option>` + names.map((p) =>
      `<option value="${escapeHtml(p)}" ${p === pick ? "selected" : ""}>${live.includes(p) ? "● " : ""}${escapeHtml(liveLabel(p))}</option>`
    ).join("");
  } catch (err) {
    flash(err.message, true);
  }
}

async function refresh() {
  if (refreshBusy) return;
  refreshBusy = true;
  const gen = ++refreshGen;
  try {
    let board;
    try {
      board = await api("/api/board");
    } catch (err) {
      if (String(err.message).includes("passkey")) {
        showGate(true);
        return;
      }
      flash(err.message, true);
      setTimeout(() => {
        if (!document.hidden && !$("app").classList.contains("hidden")) refresh();
      }, 4000);
      return;
    }
    if (gen !== refreshGen) return;
    state = { ...state, ...board };
    if (board.github_warning) flash(board.github_warning, true);
    renderFilters();
    renderBoard();
    if ($("tab-project").classList.contains("on")) renderProject();
    if ($("tab-graphs").classList.contains("on")) renderGraphs();

    const extras = await Promise.allSettled([api("/api/settings"), api("/api/map")]);
    if (gen !== refreshGen) return;
    const settings = extras[0].status === "fulfilled" ? extras[0].value : null;
    const mapped = extras[1].status === "fulfilled" ? extras[1].value : (state._map || { live: [], orch: [] });
    if (settings) {
      const keepProfiles = settingsDirty ? state.profiles : settings.profiles;
      const keepSlots = settingsDirty ? state.slots : settings.slots;
      state = { ...state, ...settings, profiles: keepProfiles, slots: keepSlots };
      if (!settingsDirty) state.catalog = settings.catalog || state.catalog;
    } else if (extras[0].status === "rejected") {
      const msg = String(extras[0].reason?.message || extras[0].reason || "");
      if (msg.includes("passkey")) {
        showGate(true);
        return;
      }
    }
    state._map = mapped;
    const running = (mapped.live || [])[0];
    const researching = (mapped.orch || [])[0];
    const q = (state.queue || []).filter((i) => i.status === "waiting").length;
    if (Date.now() >= stripHold) {
      $("strip").classList.remove("bad");
      stripTarget = running ? "console" : researching ? "project" : "";
      $("strip").disabled = !stripTarget;
      $("strip").innerHTML = running
        ? `<i class="pulse"></i><b>VPS · ${escapeHtml(running)}${q ? ` · очередь ${q}` : ""}</b>`
        : researching
          ? `<i class="pulse"></i><b>orch · ${escapeHtml(researching)}</b>`
          : `<i class="pulse"></i><b>${state.queue_running ? `автоном · ждут ${q}` : "тихо"}</b>`;
    }
    if (!autoTyping()) renderAuto();
    renderMap(mapped);
    if (!settingsDirty && settings) {
      renderSlots();
      renderSettings();
    }
    if ($("tab-console").classList.contains("on")) pollConsole();
  } catch (err) {
    if (String(err.message).includes("passkey")) {
      showGate(true);
    } else {
      flash(err.message, true);
    }
  } finally {
    refreshBusy = false;
  }
}

$("strip").onclick = () => {
  if (stripTarget) setTab(stripTarget);
};

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && !$("app").classList.contains("hidden")) refresh();
});

boot();
setInterval(() => {
  if (document.hidden || $("app").classList.contains("hidden")) return;
  refresh();
}, 15000);
