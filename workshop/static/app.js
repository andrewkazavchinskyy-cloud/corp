const $ = (id) => document.getElementById(id);
const titles = {
  board: ["Доска", "GitHub Issues"],
  auto: ["Автоном", "не запущен · задачи → модель → очередь"],
  project: ["Проект", "Этап"],
  graphs: ["Графы", "Все проекты"],
  map: ["Карта", "Сервер"],
  journal: ["Журнал", "Память и события"],
  console: ["Консоль", "Агенты"],
  settings: ["Настройки", "Доступ · агенты · репозитории"],
};
const FILTER_KEY = "corp_project";
const COLS = [
  ["backlog", "Бэклог"],
  ["ready", "Готово"],
  ["in-progress", "Ход"],
  ["qa", "QA"],
  ["done", "Закрыто"],
];
const COL_HINT = {
  backlog: "Новые задачи до Готово",
  ready: "Сюда после подтверждения",
  "in-progress": "Сейчас пишут",
  qa: "После сборки и дизайна",
  done: "Закрыто после QA",
};
const HOME_TABS = ["board", "auto", "project", "graphs"];
const MORE_TABS = ["graphs", "map", "journal", "console", "settings"];
const QUIET_TABS = ["map", "journal", "console", "settings"];

let state = { cards: [], projects: [], profiles: [], queue: [], queue_running: false, pins: [], slots: {}, catalog: {} };
let sheetIssue = "";
let phoneCol = "ready";
let settingsDirty = false;
let lastBoardKey = "";
let refreshBusy = false;
let refreshTimer = 0;
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
let consoleLogMode = "issue";
let sheetReturn = null;
let refreshGen = 0;
let stripHold = 0;
let stripTarget = "";
let stripIssue = "";
const ROLE_RU = { orchestrator: "Оркестр", build: "Сборка", design: "Дизайн", qa: "QA" };
const KIND_RU = { claude: "Claude", codex: "Codex", grok: "Grok", cursor: "Cursor" };
const QUEUE_RU = { waiting: "ждёт", running: "идёт", failed: "упал", done: "отработал", skipped: "пропуск" };
let lastAutoKey = "";
let autoUi = { propose: "", project: "", checked: [], model: "", err: "", step: 1 };
let settingsRoom = "access";
let moreOpen = false;
let searchQuery = "";
let issueLinkDone = false;
let sortableTries = 0;
let journalKey = "";
let autoDraftChecked = [];

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
  journalKey = "";
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

function refreshSoon(ms) {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => refresh(), ms == null ? 250 : ms);
}

function cardByIssue(issue) {
  return (state.cards || []).find((c) => issueRef(c) === issue);
}

function paintLocal() {
  lastBoardKey = "";
  lastAutoKey = "";
  renderFilters();
  renderBoard();
  if ($("tab-auto") && $("tab-auto").classList.contains("on") && !autoTyping()) { renderAuto(); ensureRunStats(); }
}

function patchCard(issue, fields) {
  const card = cardByIssue(issue);
  if (!card) return false;
  Object.assign(card, fields);
  paintLocal();
  return true;
}

function applyOptimistic(path, body) {
  const issue = body && body.issue;
  if (!issue) return;
  if (path === "/api/move" && body.column) patchCard(issue, { column: body.column });
  if (path === "/api/take") patchCard(issue, { column: "in-progress", runner: "self" });
  if (path === "/api/self/drop") patchCard(issue, { column: "ready", runner: "" });
  if (path === "/api/qa" && body.verdict === "pass") patchCard(issue, { column: "done", state: "CLOSED" });
  if (path === "/api/qa" && (body.fail || body.verdict === "fail")) patchCard(issue, { column: "ready" });
  if (path === "/api/queue/add") {
    const card = cardByIssue(issue);
    patchCard(issue, { queued: true });
    if (card && !(state.queue || []).some((q) => String(q.issue) === String(card.number) && q.repo === card.repo)) {
      state.queue = [...(state.queue || []), {
        repo: card.repo, issue: card.number, project: card.project, title: card.title, status: "waiting",
      }];
    }
  }
  if (path === "/api/queue/rm" || path === "/api/queue/abort") patchCard(issue, { queued: false });
  if (path === "/api/run" || path === "/api/qa/start") patchCard(issue, { column: "in-progress" });
}

async function write(path, body, okMsg) {
  applyOptimistic(path, body);
  try {
    const data = await api(path, body);
    if (okMsg) flash(okMsg);
    refreshSoon(250);
    return data;
  } catch (err) {
    flash(err.message, true);
    refreshSoon(0);
    throw err;
  }
}

function setupTokenFromUrl() {
  const url = new URL(location.href);
  const fromQuery = url.searchParams.get("token");
  let token = fromQuery || "";
  if (!token) {
    const raw = location.hash.slice(1);
    const query = raw.includes("?") ? raw.slice(raw.indexOf("?") + 1) : raw;
    token = new URLSearchParams(query).get("token") || "";
  }
  if (url.searchParams.has("token")) {
    url.searchParams.delete("token");
    history.replaceState(history.state, "", url.pathname + url.search + url.hash);
  }
  return token;
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

$("btn-logout-all").onclick = async () => {
  if (!window.confirm("Выйти на всех устройствах?")) return;
  $("auth-note").textContent = "";
  try {
    await api("/api/auth/logout-all", {});
  } catch (err) {
    $("auth-note").textContent = err.message || "не вышло";
    return;
  }
  showGate(true);
};

function matchesQuery(...parts) {
  const q = searchQuery.trim().toLowerCase();
  if (!q) return true;
  return parts.map((p) => String(p || "").toLowerCase()).join(" ").includes(q);
}

function cardMatches(card) {
  return matchesQuery(
    card.title,
    card.project,
    card.repo,
    `#${card.number}`,
    `${card.repo}#${card.number}`,
    `${card.project}#${card.number}`,
  );
}

function draftMatches(d) {
  return matchesQuery(d.title, d.project, d.repo, d.why, d.body, d.kind);
}

function visibleCards() {
  const f = currentFilter();
  const cards = (state.cards || []).filter((c) => (f === "all" || c.project === f) && cardMatches(c));
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
  if ($("q")) $("q").closest(".q-wrap")?.classList.toggle("hidden", hide);
  if (hide) return;
  const pins = state.pins || [];
  const cur = currentFilter();
  const chips = [["all", "Все"], ...pins.map((p) => [p.name, p.name])].filter(([id, label]) => {
    if (!searchQuery.trim() || id === "all" || id === cur) return true;
    const hasCards = (state.cards || []).some((c) => c.project === id && cardMatches(c));
    const hasDrafts = (state.drafts || []).some((d) => d.project === id && draftMatches(d));
    return matchesQuery(id, label) || hasCards || hasDrafts;
  });
  $("project-filters").innerHTML = chips.map(([id, label]) =>
    `<button type="button" class="chip${id === cur ? " on" : ""}" data-filter="${id}" aria-pressed="${id === cur ? "true" : "false"}">${escapeHtml(label)}</button>`
  ).join("");
  $("project-filters").querySelectorAll("[data-filter]").forEach((btn) => {
    btn.onclick = () => setFilter(btn.dataset.filter);
  });
}

function moreTab(name) {
  return MORE_TABS.includes(name);
}

function moreItems() {
  return [...$("more-menu").querySelectorAll("[role='menuitem']")].filter((el) => !el.disabled);
}

function paintDockMore(name) {
  const btn = $("dock-more");
  if (!btn) return;
  btn.textContent = moreTab(name) ? titles[name][0] : "Ещё";
}

function closeMore() {
  moreOpen = false;
  $("more-menu").classList.add("hidden");
  $("more-scrim").classList.add("hidden");
  $("dock-more").setAttribute("aria-expanded", "false");
}

function openMore() {
  moreOpen = true;
  $("more-menu").classList.remove("hidden");
  $("more-scrim").classList.remove("hidden");
  $("dock-more").setAttribute("aria-expanded", "true");
  const first = moreItems()[0];
  if (first) first.focus();
}

function toggleMore() {
  if (moreOpen) closeMore();
  else openMore();
}

function setSettingsRoom(room) {
  settingsRoom = room;
  ["access", "agents", "repos"].forEach((id) => {
    const el = $(`room-${id}`);
    if (el) el.classList.toggle("hidden", id !== room);
  });
  document.querySelectorAll("#settings-rooms [data-room]").forEach((btn) => {
    const on = btn.dataset.room === room;
    btn.classList.toggle("on", on);
    btn.setAttribute("aria-selected", on ? "true" : "false");
    btn.setAttribute("tabindex", on ? "0" : "-1");
  });
}

function setTab(name) {
  if (name === "more") {
    toggleMore();
    return;
  }
  closeMore();
  document.querySelectorAll(".tab").forEach((el) => el.classList.toggle("on", el.id === `tab-${name}`));
  document.querySelectorAll("[data-tab]").forEach((el) => {
    const tab = el.dataset.tab;
    const on = tab === name || (tab === "more" && moreTab(name));
    el.classList.toggle("on", on);
    if (on) el.setAttribute("aria-current", "page");
    else el.removeAttribute("aria-current");
  });
  $("page-title").textContent = titles[name][0];
  $("page-kicker").textContent = name === "auto" ? autoKicker() : titles[name][1];
  paintDockMore(name);
  renderFilters();
  if (name === "console") pollConsole();
  if (name === "project") renderProject();
  if (name === "graphs") renderGraphs();
  if (name === "auto") { renderAuto(); ensureRunStats(true); }
  if (name === "journal") renderJournal();
  if (name === "settings") {
    setSettingsRoom(settingsRoom);
    renderRepos();
  }
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
$("more-scrim").onclick = closeMore;
document.querySelectorAll("#settings-rooms [data-room]").forEach((btn) => {
  btn.onclick = () => setSettingsRoom(btn.dataset.room);
  btn.onkeydown = (evt) => {
    if (evt.key !== "ArrowRight" && evt.key !== "ArrowLeft") return;
    const tabs = [...document.querySelectorAll("#settings-rooms [data-room]")];
    const i = tabs.indexOf(btn);
    const next = tabs[(i + (evt.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    setSettingsRoom(next.dataset.room);
    next.focus();
  };
});

function issueRef(card) {
  return `${card.repo}#${card.number}`;
}

function issueLinkValue(card) {
  return `${card.repo}/${card.number}`;
}

function phoneNarrow() {
  return window.matchMedia("(max-width: 899px)").matches;
}

function autoKicker() {
  const queued = state.queue || [];
  if (state.queue_running) return queued.length ? `идёт · в очереди ${queued.length}` : "идёт";
  if (!queued.length) return "на паузе · очередь пуста";
  return `на паузе · в очереди ${queued.length}`;
}

function badge(card) {
  const bits = [];
  if (card.blocked) bits.push('<span class="badge blocked">блок</span>');
  if (card.sync_error) bits.push('<span class="badge syncerr">sync не прошёл</span>');
  else if (card.pending) bits.push('<span class="badge pending">на GitHub…</span>');
  if (card.queued) bits.push('<span class="badge">очередь</span>');
  if (card.runner === "self") bits.push('<span class="badge self">я</span>');
  else if (card.runner && card.runner !== "queued") bits.push(`<span class="badge vps">VPS · ${escapeHtml(card.runner)}</span>`);
  if (card.column === "qa") bits.push('<span class="badge">QA</span>');
  if (isDisposable(card)) bits.push('<span class="badge">песочница</span>');
  (card.labels || []).forEach((l) => {
    if (l.name === "qa-fail") bits.push('<span class="badge blocked">QA вернул</span>');
    if (["P0", "P1", "P2"].includes(l.name)) bits.push(`<span class="badge${l.name === "P0" ? " blocked" : ""}">${l.name}</span>`);
  });
  return bits.join("");
}

function cardClass(card) {
  const bits = ["card"];
  if ((card.labels || []).some((l) => l.name === "P0")) bits.push("p0");
  if (card.sync_error) bits.push("syncerr");
  else if (card.pending) bits.push("pending");
  if (card.runner === "self") bits.push("me");
  else if (card.runner && card.runner !== "queued") bits.push("vps");
  return bits.join(" ");
}

function cardHtml(card) {
  const project = currentFilter() === "all" ? escapeHtml(card.project) : "";
  const on = !$("sheet").classList.contains("hidden") && sheetIssue === issueRef(card) ? " on" : "";
  return `<button type="button" class="${cardClass(card)}${on}" data-issue="${issueRef(card)}" data-col="${card.column}">
    <span class="card-handle" data-handle aria-hidden="true">⋮⋮</span>
    <header><span>${project}</span><span>#${card.number}</span></header>
    <h3>${escapeHtml(card.title || "")}</h3>
    <div class="badges">${badge(card)}</div>
  </button>`;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function renderIssueDetail(data) {
  const esc = escapeHtml;
  const body = String(data.body || "").trim();
  const parts = [
    `<details open class="iss"><summary>Постановка</summary><pre class="iss-body">${esc(body || "(пусто)")}</pre></details>`,
  ];
  const comments = Array.isArray(data.comments) ? data.comments : [];
  if (comments.length) {
    const rows = comments
      .map((c) => `<li><b>${esc(c.author || "")}</b> <span class="muted">${esc(c.at || "")}</span><pre class="iss-body">${esc(c.body || "")}</pre></li>`)
      .join("");
    parts.push(`<details class="iss"><summary>Комментарии · ${comments.length}</summary><ul class="iss-comments">${rows}</ul></details>`);
  }
  const runs = Array.isArray(data.runs) ? data.runs : [];
  if (runs.length) {
    const word = { done: "прошёл", to_qa: "на QA", fail: "упал", hung: "завис", incomplete: "не докрутил", qa_fail: "QA вернул" };
    const rows = runs
      .map((r) => {
        const mins = r.duration_s != null ? ` · ${Math.max(1, Math.round(r.duration_s / 60))} мин` : "";
        const att = r.attempt != null ? ` · попытка ${r.attempt}` : "";
        return `<li><b>${esc(word[r.outcome] || r.outcome || r.kind || "")}</b><span class="muted">${esc(new Date((r.at || 0) * 1000).toLocaleString())}${att}${mins}</span></li>`;
      })
      .join("");
    parts.push(`<details class="iss"><summary>Прошлые прогоны · ${runs.length}</summary><ul class="iss-comments">${rows}</ul></details>`);
  }
  return parts.join("");
}

let runsStatsAt = 0;
function ensureRunStats(force) {
  const box = $("runs-stats");
  if (!box) return;
  const now = Date.now();
  if (!force && now - runsStatsAt < 60000) return;
  runsStatsAt = now;
  api("/api/runs/stats")
    .then((data) => {
      const stats = (data && data.stats) || [];
      if (!stats.length) {
        box.innerHTML = '<p class="muted">Прогонов пока нет.</p>';
        return;
      }
      box.innerHTML = stats
        .map((s) => {
          const avg = s.avg_min != null ? ` · ср. ${s.avg_min} мин` : "";
          return `<p class="runs-line"><b>${escapeHtml(s.profile)}</b> · ${s.runs} прогонов · ${Math.round((s.success_rate || 0) * 100)}% ok${avg}</p>`;
        })
        .join("");
    })
    .catch(() => {});
}

function loadSheetDetail(card) {
  const box = $("sheet-detail");
  if (!box) return;
  const [owner, repoName] = String(card.repo || "").split("/");
  if (!owner || !repoName || !card.number) {
    box.innerHTML = "";
    return;
  }
  box.innerHTML = '<p class="muted">Читаю постановку…</p>';
  api(`/api/issue/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/${card.number}`)
    .then((data) => {
      if (sheetIssue === issueRef(card)) box.innerHTML = renderIssueDetail(data || {});
    })
    .catch(() => {
      box.innerHTML = "";
    });
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
  const drafts = (state.drafts || []).filter((d) => (f === "all" || d.project === f) && draftMatches(d));
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
      <h3>${escapeHtml(next.title || next.issue)} · в Готово</h3></button>`;
  }
  return `<button type="button" class="card next" data-next="orch" data-project="${escapeHtml(next.project || "")}">
    <header><span>следующий шаг</span><span>разбор</span></header>
    <h3>Разобрать · нет карточек в Готово</h3></button>`;
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
    searchQuery,
    Boolean(window.Sortable),
  ]);
  if (key === lastBoardKey && $("board").children.length) {
    renderColnav();
    return;
  }
  lastBoardKey = key;
  $("board").innerHTML = COLS.map(([id, label]) => {
    const list = cards.filter((c) => c.column === id);
    const extra = id === "ready" && !list.length ? nextCardHtml(next) : "";
    const hint = !list.length && !extra
      ? `<p class="lane-empty">${COL_HINT[id] || ""}</p>`
      : (id === "ready" && list.length ? '<p class="lane-empty">Запуск выбранных — на Автономе, не перетаскиванием</p>' : "");
    return `<div class="col-wrap${id === phoneCol ? " show" : ""}" data-col="${id}"><h2>${label} <span class="count">${list.length}</span></h2>
      <div class="lane" data-col="${id}">${extra}${list.map(cardHtml).join("")}${hint}</div></div>`;
  }).join("");
  renderColnav();
  $("board").querySelectorAll(".card.next").forEach((el) => {
    el.onclick = () => goNext(el);
  });
  $("board").querySelectorAll(".card:not(.next)").forEach((el) => {
    el.onclick = (evt) => {
      if (evt.target.closest("[data-handle]")) return;
      openSheet(el.dataset.issue);
    };
  });
  bindBoardSortable();
}

function bindBoardSortable() {
  const board = $("board");
  if (!board) return;
  const note = $("board-drag-note");
  if (note) note.remove();
  if (window.matchMedia("(max-width: 899px)").matches) {
    board.classList.remove("can-drag");
    return;
  }
  if (!window.Sortable) {
    board.classList.remove("can-drag");
    const warn = document.createElement("p");
    warn.id = "board-drag-note";
    warn.className = "note board-drag-note";
    warn.textContent = sortableTries >= 20
      ? "Перетаскивание недоступно: нет Sortable. Обновите страницу."
      : "Жду Sortable…";
    board.before(warn);
    if (sortableTries < 20) {
      sortableTries += 1;
      setTimeout(() => {
        lastBoardKey = "";
        renderBoard();
      }, 150);
    }
    return;
  }
  sortableTries = 0;
  board.classList.add("can-drag");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  board.querySelectorAll(".lane").forEach((lane) => {
    Sortable.create(lane, {
      group: "board",
      animation: motion ? 0 : 150,
      handle: ".card-handle",
      filter: ".card.next, .lane-empty",
      onMove: (evt) => evt.to.dataset.col !== "in-progress",
      onEnd: async (evt) => {
        const issue = evt.item.dataset.issue;
        const column = evt.to.dataset.col;
        const from = evt.from.dataset.col;
        if (!issue || column === from || column === "in-progress") return;
        lastBoardKey = "";
        try {
          if (column === "done" && from !== "qa") {
            if (!confirm("Сначала QA — перенести карточку?")) {
              refresh();
              return;
            }
            await write("/api/move", { issue, column: "qa" }, "в колонку QA");
          } else if (column === "done") {
            if (!confirm("Закрыть карточку на GitHub? Это приёмка QA.")) {
              refresh();
              return;
            }
            await write("/api/qa", { issue, verdict: "pass" }, "QA прошёл");
          } else {
            await write("/api/move", { issue, column }, `в ${colWord(column)}`);
          }
        } catch (_) { /* strip */ }
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

function isDisposable(item) {
  const t = `${item.title || ""} ${item.body || ""} ${item.why || ""}`.toLowerCase();
  return /песочниц|sandbox|throwaway|выброс|однораз/.test(t);
}

function sandboxBlocked(card) {
  return !!(card.blocked || card.runner === "self" || (card.labels || []).some((l) => l.name === "P0"));
}

function liveWritingCard(project) {
  if (!project) return null;
  const cards = state.cards || [];
  const q = (state.queue || []).find((i) => i.status === "running" && (i.project === project || String(i.repo || "").endsWith(`/${project}`)));
  if (q) {
    const hit = cards.find((c) => c.repo === q.repo && String(c.number) === String(q.issue));
    if (hit) return hit;
  }
  return cards.find((c) => c.project === project && vpsRunner(c)) || null;
}

function setSheetOpen(on) {
  const main = document.querySelector(".main");
  if (main) main.classList.toggle("sheet-open", on);
}

function paintConsoleChrome() {
  const has = !!consoleIssue;
  if ($("console-modes")) $("console-modes").classList.toggle("hidden", !has);
  if ($("console-to-card")) $("console-to-card").classList.toggle("hidden", !has);
  const issueOn = has && consoleLogMode !== "run";
  if ($("console-mode-issue")) {
    $("console-mode-issue").classList.toggle("on", issueOn);
    $("console-mode-issue").setAttribute("aria-selected", issueOn ? "true" : "false");
  }
  if ($("console-mode-run")) {
    $("console-mode-run").classList.toggle("on", !issueOn);
    $("console-mode-run").setAttribute("aria-selected", !issueOn ? "true" : "false");
  }
}

function colWord(column) {
  return (COLS.find(([id]) => id === column) || [column, column])[1];
}

function humanReason(msg) {
  const s = String(msg || "");
  if (/blocked/i.test(s)) return "Карточка в блоке.";
  if (/claimed as self/i.test(s)) return "Уже у тебя.";
  if (/already claimed/i.test(s)) return "Уже занята.";
  if (/закрыта/.test(s)) return "Карточка закрыта.";
  return s;
}

function githubLink(card) {
  return card.url
    ? `<a class="btn link" href="${escapeHtml(card.url)}" target="_blank" rel="noreferrer">Открыть на GitHub</a>`
    : "";
}

function sheetHouse(card, extra = "") {
  const moves = [["ready", "В колонку Готово"], ["backlog", "В бэклог"], ["qa", "В колонку QA"]]
    .filter(([id]) => id !== card.column)
    .map(([id, label]) => `<button type="button" class="btn" data-col="${id}">${label}</button>`)
    .join("");
  return `${extra}${moves}${githubLink(card)}`;
}

function bindSheetHouse() {
  $("sheet-house").querySelectorAll("[data-col]").forEach((b) => {
    b.onclick = () => {
      const issue = sheetIssue;
      const column = b.dataset.col;
      closeSheet();
      write("/api/move", { issue, column }, `в ${colWord(column)}`).catch(() => {});
    };
  });
}

function bindSheetAct(id, fn) {
  const el = $(id);
  if (el) el.onclick = fn;
}

function sheetWrite(path, extra, okMsg) {
  const issue = sheetIssue;
  closeSheet();
  return write(path, { issue, ...(extra || {}) }, okMsg).catch(() => {});
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
  setSheetOpen(true);
  const first = sheetFocusables()[0];
  (first || $("sheet-cancel")).focus();
}

function hideSheet(keepIssue) {
  $("sheet").classList.add("hidden");
  $("scrim").classList.add("hidden");
  setSheetOpen(false);
  if (!keepIssue && issueFromUrl()) setIssueParam("");
  if (!keepIssue && sheetReturn && sheetReturn.focus) {
    try { sheetReturn.focus(); } catch (_) { /* gone */ }
  }
  sheetReturn = null;
}

function openConsole(pick, issue) {
  consolePick = pick || "";
  consoleIssue = issue || "";
  consoleLogMode = consoleIssue ? "issue" : "run";
  if (consoleIssue) setIssueParam(consoleIssue);
  paintConsoleChrome();
  setTab("console");
}

function openConsoleFor(card) {
  hideSheet(true);
  renderBoard();
  openConsole(card.project, issueRef(card));
}

function issueFromUrl() {
  const url = new URL(location.href);
  let raw = (url.searchParams.get("issue") || "").trim();
  const hash = (location.hash || "").replace(/^#/, "");
  if (raw && hash && /^\d+$/.test(hash) && !/[/#]/.test(raw)) {
    raw = `${raw}#${hash}`;
  }
  return raw;
}

function setIssueParam(ref) {
  const url = new URL(location.href);
  if (ref) {
    const card = (state.cards || []).find((c) => issueRef(c) === ref);
    url.searchParams.set("issue", card ? issueLinkValue(card) : String(ref).replace("#", "/"));
  } else {
    url.searchParams.delete("issue");
  }
  history.replaceState({}, "", url.pathname + url.search);
}

function toApiIssueRef(raw) {
  const text = decodeURIComponent(String(raw || "")).replace(/%23/gi, "#").trim();
  const slash = text.match(/^([^/]+\/[^/]+)\/(\d+)$/);
  if (slash) return `${slash[1]}#${slash[2]}`;
  if (/^[^/#]+\/[^/#]+#\d+$/.test(text)) return text;
  const card = findCardByIssueParam(text);
  return card ? issueRef(card) : "";
}

function findCardByIssueParam(raw) {
  const text = decodeURIComponent(String(raw || "")).replace(/%23/gi, "#").trim();
  if (!text) return null;
  const cards = state.cards || [];
  const slash = text.match(/^([^/]+\/[^/]+)\/(\d+)$/);
  if (slash) {
    return cards.find((c) => c.repo === slash[1] && String(c.number) === slash[2]) || null;
  }
  const hash = text.match(/^([^#]+)#(\d+)$/);
  if (hash) {
    return cards.find((c) => issueRef(c) === text || `${c.project}#${c.number}` === text || `${c.repo}#${c.number}` === text) || null;
  }
  if (/^\d+$/.test(text)) {
    const hits = cards.filter((c) => String(c.number) === text);
    return hits.length === 1 ? hits[0] : null;
  }
  return cards.find((c) => issueRef(c) === text || issueLinkValue(c) === text || `${c.project}#${c.number}` === text) || null;
}

function applyIssueLink() {
  if (issueLinkDone) return;
  const raw = issueFromUrl();
  if (!raw) {
    issueLinkDone = true;
    return;
  }
  issueLinkDone = true;
  resolveIssueLink(raw);
}

async function resolveIssueLink(raw) {
  let card = findCardByIssueParam(raw);
  const apiRef = toApiIssueRef(raw);
  if (!card && apiRef) {
    try {
      const link = await api(`/api/link?issue=${encodeURIComponent(apiRef)}`);
      card = findCardByIssueParam(link.issue_ref || link.issue || apiRef);
    } catch (_) { /* missing or bad ref */ }
  }
  if (!card) {
    flash("карточка по ссылке не найдена", true);
    return;
  }
  phoneCol = card.column || phoneCol;
  lastBoardKey = "";
  if (isPin(card.project)) setFilter(card.project);
  setTab("board");
  renderBoard();
  openSheet(issueRef(card));
}

function openSheet(issue) {
  const card = state.cards.find((c) => issueRef(c) === issue);
  if (!card) return;
  setIssueParam(issueRef(card));
  sheetReturn = document.activeElement;
  sheetIssue = issue;
  $("sheet-title").textContent = card.title || `${card.project} #${card.number}`;
  $("sheet-kicker").textContent = `${card.project} #${card.number} · ${colWord(card.column)} · ${issueRole(card)}`;
  loadSheetDetail(card);
  const acts = $("sheet-acts");
  const house = $("sheet-house");
  const why = card.can_run === false ? humanReason(card.block_reason || "нельзя запустить") : "";
  const enqueue = `<button type="button" class="btn" id="sheet-queue"${why ? " disabled" : ""}>В очередь</button>`;
  const selfBtn = '<button type="button" class="btn" id="sheet-self">Я сам</button>';
  if (card.column === "done") {
    $("sheet-note").textContent = "Закрыто.";
    acts.innerHTML = "";
    house.innerHTML = githubLink(card);
  } else if (card.column === "qa") {
    $("sheet-note").textContent = vpsRunner(card)
      ? `QA на VPS · ${card.runner}. Принять или вернуть можно и сейчас.`
      : "Ждёт приёмки. Прошёл — закрываем. Не принял — вернётся в колонку Готово (не закрыта) с правками.";
    const startQa = vpsRunner(card)
      ? ""
      : '<button type="button" class="btn" id="sheet-qa-slot">Запустить QA</button>';
    acts.innerHTML = `
      <button type="button" class="btn primary" id="sheet-qa-pass">QA прошёл</button>
      <button type="button" class="btn danger" id="sheet-qa-fail">QA не принял</button>
      ${startQa}
      ${vpsRunner(card) ? '<button type="button" class="btn" id="sheet-console">Консоль</button><button type="button" class="btn" id="sheet-abort">Откатить</button>' : ""}
      <label class="field hidden" id="qa-fail-wrap"><span>Что поправить</span>
        <textarea id="qa-fail-note" rows="3" required placeholder="Без этой заметки карточку не вернуть"></textarea>
        <button type="button" class="btn danger" id="sheet-qa-fail-go">Вернуть в колонку Готово</button>
      </label>`;
    house.innerHTML = sheetHouse(card);
    bindSheetAct("sheet-qa-pass", () => {
      if (!confirm("Закрыть карточку на GitHub? Это приёмка QA.")) return;
      sheetWrite("/api/qa", { verdict: "pass" }, "QA прошёл");
    });
    bindSheetAct("sheet-qa-fail", () => {
      const wrap = $("qa-fail-wrap");
      if (wrap) wrap.classList.remove("hidden");
      if ($("qa-fail-note")) $("qa-fail-note").focus();
    });
    bindSheetAct("sheet-qa-fail-go", () => {
      const note = ($("qa-fail-note")?.value || "").trim();
      if (!note) {
        flash("нужна заметка с правками", true);
        return;
      }
      sheetWrite("/api/qa", { verdict: "fail", fail: true, note }, "QA не принял");
    });
    bindSheetAct("sheet-qa-slot", () => sheetWrite("/api/qa/start", {}, "QA слот запущен"));
    bindSheetAct("sheet-console", () => openConsoleFor(card));
    bindSheetAct("sheet-abort", () => {
      if (!confirm("Остановить агента и вернуть карточку в колонку Готово?")) return;
      sheetWrite("/api/queue/abort", {}, "откатил");
    });
    bindSheetHouse();
  } else if (card.column === "in-progress" && vpsRunner(card)) {
    $("sheet-note").textContent = `Уже пишет VPS · ${card.runner}.`;
    acts.innerHTML = '<button type="button" class="btn primary" id="sheet-console">Консоль</button><button type="button" class="btn" id="sheet-abort">Откатить</button>';
    house.innerHTML = sheetHouse(card);
    bindSheetAct("sheet-console", () => openConsoleFor(card));
    bindSheetAct("sheet-abort", () => {
      if (!confirm("Остановить агента и вернуть карточку в колонку Готово?")) return;
      sheetWrite("/api/queue/abort", {}, "откатил");
    });
    bindSheetHouse();
  } else if (card.runner === "self") {
    $("sheet-note").textContent = "Это ты. Карточка у тебя. VPS не стартует.";
    acts.innerHTML = '<button type="button" class="btn primary" id="sheet-drop">Снять</button>';
    house.innerHTML = sheetHouse(card);
    bindSheetAct("sheet-drop", () => sheetWrite("/api/self/drop", {}, "снял с себя"));
    bindSheetHouse();
  } else if (card.column === "backlog") {
    $("sheet-note").textContent = card.blocked
      ? "Карточка в блоке. Сначала снимите блок на GitHub."
      : "Ещё не в колонке Готово. Можно перенести, взять себе или поставить в очередь.";
    acts.innerHTML = `<button type="button" class="btn primary" id="sheet-ready">В Готово</button>${selfBtn}${enqueue}`;
    house.innerHTML = sheetHouse(card);
    bindSheetAct("sheet-ready", () => sheetWrite("/api/move", { column: "ready" }, "в Готово"));
    bindSheetAct("sheet-self", () => sheetWrite("/api/take", {}, "взял себе"));
    bindSheetAct("sheet-queue", () => sheetWrite("/api/queue/add", {}, "в очереди"));
    bindSheetHouse();
  } else {
    $("sheet-note").textContent = card.blocked
      ? "Карточка в блоке. Сначала снимите блок на GitHub."
      : (why || `Роль ${issueRole(card)}. Запуск пойдёт на VPS.`);
    acts.innerHTML = `<button type="button" class="btn primary" id="sheet-run"${why ? " disabled" : ""}>${why ? escapeHtml(why) : "Запустить"}</button>
      ${selfBtn}${enqueue}`;
    house.innerHTML = sheetHouse(card);
    bindSheetAct("sheet-self", () => sheetWrite("/api/take", {}, "взял себе"));
    bindSheetAct("sheet-queue", () => sheetWrite("/api/queue/add", {}, "в очереди"));
    if ($("sheet-run") && !why) {
      $("sheet-run").onclick = () => sheetWrite("/api/run", {}, "запустил");
    }
    bindSheetHouse();
  }
  if (card.sync_error || card.pending) {
    const note = $("sheet-note");
    const warn = card.sync_error
      ? `GitHub не подтвердил последнее действие: ${card.sync_error}. Повтори действие или сними локальную краску.`
      : "Действие ещё не подтверждено GitHub — подожди или обнови доску.";
    note.textContent = `${warn} ${note.textContent}`;
    if (card.sync_error && !$("sheet-clear-ov")) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn danger";
      btn.id = "sheet-clear-ov";
      btn.textContent = "Снять локальную краску";
      btn.onclick = () => sheetWrite("/api/board/clear-ov", {}, "снял локальную краску");
      $("sheet-house").appendChild(btn);
    }
  }
  showSheet();
}

function closeSheet() {
  hideSheet(false);
}

$("sheet-cancel").onclick = closeSheet;
$("scrim").onclick = closeSheet;
document.addEventListener("keydown", (evt) => {
  if (moreOpen) {
    const items = moreItems();
    if (evt.key === "Escape") {
      evt.preventDefault();
      closeMore();
      $("dock-more").focus();
      return;
    }
    if (evt.key === "Tab" && items.length) {
      const first = items[0];
      const last = items[items.length - 1];
      if (evt.shiftKey && document.activeElement === first) {
        evt.preventDefault();
        last.focus();
        return;
      }
      if (!evt.shiftKey && document.activeElement === last) {
        evt.preventDefault();
        first.focus();
        return;
      }
      if (!items.includes(document.activeElement)) {
        evt.preventDefault();
        first.focus();
        return;
      }
    }
    if ((evt.key === "ArrowDown" || evt.key === "ArrowUp") && items.length) {
      evt.preventDefault();
      const i = items.indexOf(document.activeElement);
      const next = evt.key === "ArrowDown"
        ? items[(i + 1) % items.length]
        : items[(i - 1 + items.length) % items.length];
      next.focus();
      return;
    }
  }
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
  return id === "propose-title" || id === "auto-model" || id === "q";
}

function modelChoices() {
  const catalog = (state.catalog && state.catalog.kinds) || {};
  const kinds = ["claude", "codex", "grok", "cursor"];
  const out = [];
  kinds.forEach((kind) => {
    const row = catalog[kind] || {};
    const name = KIND_RU[kind] || kind;
    if (row.installed === false) {
      out.push({ value: `${kind}:`, label: `${name} — ${row.note || "нет на сервере"}`, disabled: true });
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
      if (!confirm("Остановить агента и вернуть карточку в колонку Готово?")) return;
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
  const bindConsole = (root) => {
    if (!root) return;
    root.querySelectorAll("[data-console]").forEach((btn) => {
      btn.onclick = () => {
        openConsole(btn.dataset.console, btn.dataset.issue || "");
      };
    });
    root.querySelectorAll("[data-sheet]").forEach((btn) => {
      btn.onclick = () => openSheet(btn.dataset.sheet);
    });
    root.querySelectorAll("[data-qa-slot]").forEach((btn) => {
      btn.onclick = async () => {
        try {
          await write("/api/qa/start", { issue: btn.dataset.qaSlot }, "QA слот запущен");
          autoUi.err = "";
        } catch (err) {
          autoUi.err = err.message;
        }
        lastAutoKey = "";
        renderAuto();
      };
    });
  };
  bindConsole($("auto-queue"));
  bindConsole($("auto-qa"));
}

function stuckQaCards() {
  const running = new Set(
    (state.queue || []).filter((q) => q.status === "running").map((q) => `${q.repo}#${q.issue}`),
  );
  return visibleCards().filter((c) => c.column === "qa" && !running.has(issueRef(c)));
}

function autoStatusHtml(queued) {
  const waiting = queued.filter((q) => q.status === "waiting").length;
  const failed = queued.some((q) => q.status === "failed");
  const stuck = stuckQaCards();
  const bits = [state.queue_running ? "идёт" : "пауза"];
  if (waiting) bits.push(`ждут ${waiting}`);
  if (failed) bits.push("ошибка");
  if (stuck.length) bits.push(`QA ${stuck.length}`);
  const rows = queued.map((q) => {
    const ref = `${q.repo}#${q.issue}`;
    const running = q.status === "running";
    const retry = q.status === "failed" || q.status === "done" || (q.status === "waiting" && q.last_error);
    const model = q.model || q.kind || "";
    return `<article class="card ${q.status === "failed" ? "fail" : ""}">
      <header><span>${escapeHtml(q.project || "")}${model ? ` · ${escapeHtml(model)}` : ""}</span>
        <span>${escapeHtml(QUEUE_RU[q.status] || q.status)}${q.attempts ? ` · попытка ${q.attempts}` : ""}</span></header>
      <h3>#${q.issue} ${escapeHtml(q.title || "")}</h3>
      ${q.last_error ? `<p class="err">${escapeHtml(humanizeError(q.last_error))}</p>` : ""}
      ${q.blocked_reason ? `<p class="err">${escapeHtml(humanReason(q.blocked_reason))}</p>` : ""}
      <div class="row">
        ${running ? `<button type="button" class="btn danger" data-abort="${escapeHtml(ref)}">Откатить</button>` : ""}
        ${retry ? `<button type="button" class="btn primary" data-retry="${escapeHtml(ref)}">Перезапустить</button>` : ""}
        ${q.status !== "running" ? `<button type="button" class="btn" data-rm="${escapeHtml(ref)}">Снять</button>` : ""}
        <button type="button" class="btn" data-console="${escapeHtml(q.project || "")}" data-issue="${escapeHtml(ref)}">Консоль</button>
      </div>
    </article>`;
  }).join("");
  const qaRows = stuck.map((c) => {
    const ref = issueRef(c);
    return `<article class="card">
      <header><span>${escapeHtml(c.project)}</span><span>застрял на QA</span></header>
      <h3>#${c.number} ${escapeHtml(c.title || "")}</h3>
      <div class="row">
        <button type="button" class="btn primary" data-qa-slot="${escapeHtml(ref)}">Запустить QA</button>
        <button type="button" class="btn" data-sheet="${escapeHtml(ref)}">Карточка</button>
        <button type="button" class="btn" data-console="${escapeHtml(c.project)}" data-issue="${escapeHtml(ref)}">Консоль</button>
      </div>
    </article>`;
  }).join("");
  const emptyPaused = !state.queue_running && !queued.length && !stuck.length;
  const resume = !state.queue_running && queued.length
    ? '<button type="button" class="btn primary" id="auto-resume">Продолжить</button>'
    : "";
  const pause = state.queue_running
    ? '<button type="button" class="btn" id="auto-pause">Пауза</button>'
    : "";
  const council = '<button type="button" class="btn" id="auto-council">Команда</button>';
  const emptyHint = emptyPaused
    ? '<p class="empty-next">Очередь пуста и на паузе. Отметь карточки в колонке Готово ниже или прими черновик — «Продолжить» появится, когда будет что запускать.</p>'
    : "";
  return `<section class="auto-status" data-kind="${failed ? "fail" : "ok"}">
    <h2>Статус</h2>
    <p class="meta">${bits.join(" · ")}${!queued.length && !stuck.length ? " · очередь пуста" : ""}</p>
    ${emptyHint}
    <div class="row">${pause}${resume}${council}</div>
    <div class="stack" id="auto-queue">${rows || ""}</div>
    ${qaRows ? `<div class="stuck-qa"><h2>Застряли на QA</h2><div class="stack" id="auto-qa">${qaRows}</div></div>` : ""}
  </section>`;
}

function renderAuto() {
  const root = $("auto-root");
  if (!root) return;
  snapAuto();
  const project = autoUi.project || autoProject();
  const drafts = (state.drafts || []).filter((d) => {
    if (!draftMatches(d)) return false;
    if (!project) return true;
    return d.project === project || (d.repo || "").endsWith(`/${project}`);
  });
  const ready = visibleCards().filter((c) => c.column === "ready" && c.runner !== "self" && c.can_run !== false);
  const queued = state.queue || [];
  const choices = modelChoices();
  const stuck = stuckQaCards();
  const key = JSON.stringify([
    ready.map((c) => [c.repo, c.number, c.title]),
    queued.map((q) => [q.repo, q.issue, q.status, q.last_error, q.attempts]),
    drafts.map((d) => d.id),
    stuck.map((c) => [c.repo, c.number]),
    state.queue_running,
    choices.map((c) => c.value),
    project,
    searchQuery,
    autoUi.step,
  ]);
  if (key === lastAutoKey && root.querySelector(".auto-go") && $("auto-ready")) {
    if ($("auto-err")) $("auto-err").textContent = autoUi.err;
    if ($("page-kicker")) $("page-kicker").textContent = autoKicker();
    return;
  }
  lastAutoKey = key;
  if ($("tab-auto")?.classList.contains("on") && $("page-kicker")) {
    $("page-kicker").textContent = autoKicker();
  }
  const defaultPick = autoUi.model || (choices.find((c) => !c.disabled) || {}).value || "";
  const selected = autoUi.checked || [];
  const why = !ready.length
    ? "нет карточек в Готово — прими черновик или верни карточку в колонку"
    : !selected.length
      ? "отметь хотя бы одну задачу"
      : !defaultPick
        ? "выбери модель"
        : "";
  const openNew = !ready.length && !drafts.length;
  const step = Math.min(3, Math.max(1, Number(autoUi.step) || 1));
  const pickLabel = (choices.find((c) => c.value === defaultPick) || {}).label || defaultPick || "модель";
  const step3 = why
    ? `Сейчас запуск закрыт: ${why}.`
    : `Решение: ${selected.length} ${selected.length === 1 ? "задача" : "задач"} · ${pickLabel}. Кнопка поставит их в очередь и стартует Автоном.`;
  const stepper = `<div class="auto-stepper">
      <button type="button" class="btn auto-back"${step <= 1 ? " disabled" : ""}>Назад</button>
      <button type="button" class="btn primary auto-next"${step >= 3 ? " disabled" : ""}>Дальше</button>
    </div>`;
  const goBtn = `<button type="button" class="btn primary auto-go"${why ? " disabled" : ""}>${why || "Запустить выбранные"}</button>`;
  const sandDrafts = drafts.filter(isDisposable);
  const sandReady = ready.filter((c) => isDisposable(c) && !sandboxBlocked(c));

  root.innerHTML = `
    ${autoStatusHtml(queued)}
    <ol class="wizard" data-step="${step}">
      <li class="auto-step" data-step="1">
        <h2><i>1</i> Задачи</h2>
        <section class="panel" id="auto-sandbox">
          <h2>Песочница</h2>
          <p class="meta">путь · /home/corp/projects/${escapeHtml(project || "corp")}</p>
          <p class="meta">Одноразовый черновик, не P0. Живой GitHub и Автоном отсюда не стартуют. P0 / я / блок отсюда не запускаются.</p>
          <button type="button" class="btn" id="sandbox-propose">Предложить одноразовый черновик</button>
          ${sandDrafts.length ? `<p class="meta">черновик · ${sandDrafts.map((d) => escapeHtml(d.title || d.id)).join(" · ")}</p>` : ""}
          ${sandReady.length ? `<p class="meta">готово · ${sandReady.map((c) => `${escapeHtml(c.project)} #${c.number}`).join(" · ")}</p>` : ""}
        </section>
        <div class="stack" id="auto-ready">${ready.map((c) => {
          const ref = issueRef(c);
          return `<label class="pick card"><input type="checkbox" value="${escapeHtml(ref)}" ${selected.includes(ref) ? "checked" : ""}>
            <div><strong>${escapeHtml(c.project)} #${c.number}</strong>
            <div>${escapeHtml(c.title || "")}${isDisposable(c) ? ' <span class="badge">песочница</span>' : ""}</div></div></label>`;
        }).join("") || '<p class="meta">Нет карточек в колонке Готово. Прими черновик ниже или верни карточку в Готово с доски.</p>'}</div>
        ${drafts.length ? `${draftBatchBar("auto-draft")}<div class="stack" id="auto-draft-list">${drafts.map((d) => draftCard(d, true)).join("")}</div>` : `<p class="meta empty-next">Черновиков нет. Нажми Разобрать на Проекте или опиши задачу ниже.</p>`}
        <details class="auto-new"${openNew ? " open" : ""}>
          <summary>Новая задача — в GitHub только после принятия</summary>
          <label>Проект
            <select id="propose-project">${pinNames().map((n) =>
              `<option ${n === project ? "selected" : ""}>${escapeHtml(n)}</option>`).join("")}</select>
          </label>
          <label>Что сделать <textarea id="propose-title" rows="3" maxlength="400" placeholder="Задача и как понять, что готово"></textarea></label>
          <button type="button" class="btn" id="propose-send">Отправить как черновик</button>
        </details>
        ${stepper}
      </li>
      <li class="auto-step" data-step="2">
        <h2><i>2</i> Модель</h2>
        <label>Какой агент запустит выбранные
          <select id="auto-model">${choices.map((c) =>
            `<option value="${escapeHtml(c.value)}" ${c.value === defaultPick ? "selected" : ""} ${c.disabled ? "disabled" : ""}>${escapeHtml(c.label)}</option>`
          ).join("")}</select>
        </label>
        ${stepper}
      </li>
      <li class="auto-step" data-step="3">
        <h2><i>3</i> Запуск</h2>
        <p class="wizard-why">${escapeHtml(step3)}</p>
        <div class="auto-go-phone" id="auto-go-phone"></div>
        ${stepper}
      </li>
    </ol>
    <div class="auto-go-bar" id="auto-go-bar">
      ${goBtn}
      <p class="err" id="auto-err">${escapeHtml(autoUi.err)}</p>
    </div>`;

  if ($("propose-title") && autoUi.propose) $("propose-title").value = autoUi.propose;
  if ($("propose-project") && autoUi.project) $("propose-project").value = autoUi.project;
  if ($("sandbox-propose")) {
    $("sandbox-propose").onclick = async () => {
      const pin = ($("propose-project") && $("propose-project").value) || project || "corp";
      try {
        await api("/api/draft", {
          action: "propose",
          project: pin,
          title: "Песочница первого часа — выбросить после проверки",
          body: "Одноразовая песочница. Не P0, не self, не blocked. После проверки выбросить.",
        });
        autoUi.err = "";
      } catch (err) {
        autoUi.err = err.message;
      }
      lastAutoKey = "";
      renderAuto();
    };
  }
  if ($("propose-send")) {
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
  bindDraftList($("auto-draft-list"), () => {
    lastAutoKey = "";
    renderAuto();
  }, (err) => { autoUi.err = err; });
  bindDraftBatch("auto-draft", drafts, () => {
    lastAutoKey = "";
    renderAuto();
  }, (err) => { autoUi.err = err; });
  const goButtons = () => [...root.querySelectorAll(".auto-go")];
  const syncGo = () => {
    snapAuto();
    const has = $("auto-ready") && $("auto-ready").querySelector("input:checked");
    const pick = $("auto-model") && $("auto-model").value;
    const msg = !ready.length
      ? "нет карточек в Готово — прими черновик или верни карточку в колонку"
      : !has
        ? "отметь хотя бы одну задачу"
        : !pick
          ? "выбери модель"
          : "";
    goButtons().forEach((btn) => {
      btn.disabled = !!msg;
      btn.textContent = msg || "Запустить выбранные";
    });
  };
  if (phoneNarrow() && $("auto-go-phone") && $("auto-go-bar")) {
    $("auto-go-phone").appendChild($("auto-go-bar"));
  }
  root.querySelectorAll(".auto-back").forEach((btn) => {
    btn.onclick = () => {
      snapAuto();
      autoUi.step = Math.max(1, (autoUi.step || 1) - 1);
      lastAutoKey = "";
      renderAuto();
    };
  });
  root.querySelectorAll(".auto-next").forEach((btn) => {
    btn.onclick = () => {
      snapAuto();
      autoUi.step = Math.min(3, (autoUi.step || 1) + 1);
      lastAutoKey = "";
      renderAuto();
    };
  });
  if ($("auto-ready")) $("auto-ready").onchange = syncGo;
  if ($("auto-model")) $("auto-model").onchange = syncGo;
  const launchSelected = async () => {
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
  goButtons().forEach((btn) => { btn.onclick = launchSelected; });
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
  if ($("auto-resume")) {
    $("auto-resume").onclick = async () => {
      try {
        const data = await api("/api/queue/start", {});
        state.queue_running = true;
        if (data.queue) state.queue = data.queue;
        autoUi.err = "";
      } catch (err) {
        autoUi.err = err.message;
      }
      lastAutoKey = "";
      renderAuto();
    };
  }
  if ($("auto-council")) {
    $("auto-council").onclick = async () => {
      try {
        const pin = currentFilter();
        await write("/api/council", { project: isPin(pin) ? pin : "corp" }, "цикл");
        autoUi.err = "";
      } catch (err) {
        autoUi.err = err.message;
      }
      lastAutoKey = "";
      renderAuto();
    };
  }
  bindAutoQueue();
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

function doctorCheckLabel(name, ok, isolation) {
  if (name === "agent identity isolated" && !ok) {
    const mode = isolation || "transitional";
    return ["переходный", `изоляция агента · ${mode}`];
  }
  return [ok ? "ok" : "нет", name];
}

function doctorChecksHtml(checks, isolation) {
  return (checks || []).map((c) => {
    const [mark, label] = doctorCheckLabel(c.name, c.ok, isolation);
    const pill = mark === "ok" ? "okpill" : "nopill";
    return `<li><span class="${pill}">${escapeHtml(mark)}</span> ${escapeHtml(label)}</li>`;
  }).join("");
}

function eventKindRu(kind) {
  return ({
    take: "взял",
    enqueue: "в очередь",
    abort: "откатил",
    qa_pass: "QA прошёл",
    qa_fail: "QA не принял",
    login: "вход",
    recover: "восстановление",
    start: "старт",
    fail: "ошибка",
    hung: "завис",
    closed: "закрыл",
    retry: "повтор",
    filed: "черновик",
    to_qa: "на QA",
    need_human: "нужен человек",
  }[kind] || kind);
}

function renderJournalHtml(notes, events, pin) {
  const mem = notes.length
    ? notes.map((n) => `<details class="block"><summary>${escapeHtml(n.name)}</summary><pre>${escapeHtml(n.text || "")}</pre></details>`).join("")
    : `<p class="meta">${pin && pin !== "all" ? "Нет memory/sessions для этого пина. Открой Проект и нажми Разобрать." : "Выберите пин в шапке — журнал читает memory/sessions этого репо."}</p>`;
  const ev = events.length
    ? `<ul class="event-list">${events.map((e) => {
      const when = e.t ? new Date(e.t * 1000).toLocaleString("ru") : "";
      return `<li><b>${escapeHtml(eventKindRu(e.kind))}</b>
        <span class="meta">${escapeHtml(e.ref || "")}${e.text ? ` · ${escapeHtml(e.text)}` : ""}</span>
        <span class="meta">${escapeHtml(when)}</span></li>`;
    }).join("")}</ul>`
    : '<p class="meta">Событий пока нет. Возьми карточку, запусти Автоном или прими черновик — запись появится здесь.</p>';
  return `<article><h2>Память сессий</h2><p class="meta">Последние 7 · ${escapeHtml(pin || "пин")}</p>${mem}</article>
    <article><h2>События</h2><p class="meta">take · очередь · abort · QA · вход</p>${ev}</article>`;
}

async function renderJournal() {
  const box = $("journal");
  if (!box) return;
  const pin = currentFilter();
  const key = `${pin}|${searchQuery}`;
  if (key === journalKey && box.children.length) return;
  try {
    const [mem, ev] = await Promise.all([
      isPin(pin) ? api(`/api/memory?name=${encodeURIComponent(pin)}`) : Promise.resolve({ notes: [] }),
      api("/api/events"),
    ]);
    let notes = mem.notes || [];
    let events = ev.events || [];
    if (searchQuery.trim()) {
      notes = notes.filter((n) => matchesQuery(n.name, n.text));
      events = events.filter((e) => matchesQuery(e.kind, e.ref, e.text, eventKindRu(e.kind)));
    }
    box.innerHTML = renderJournalHtml(notes, events, pin);
    journalKey = key;
  } catch (err) {
    box.innerHTML = `<p class="err">${escapeHtml(err.message)}</p>`;
    journalKey = "";
  }
}

function doctorMeta(doc) {
  if (!doc) return "/opt/corp · Tailscale · GitHub Issues";
  const sha = (doc.uvicorn_sha || "").slice(0, 7) || "—";
  const iso = doc.isolation || "transitional";
  return `/opt/corp · uvicorn ${sha} · ${iso}`;
}

function renderDoctor(doc) {
  const box = $("doctor-checks");
  const meta = $("doctor-meta");
  if (meta) meta.textContent = doctorMeta(doc);
  if (box) box.innerHTML = doctorChecksHtml(doc?.checks, doc?.isolation);
}

function contourTreesHtml(data) {
  const doc = data.doctor || {};
  const trees = data.trees || doc.trees || {};
  const live = trees.live || trees.live_tree || data.live_tree || doc.live || "/opt/corp";
  const writers = trees.writers || trees.writers_tree || data.writers_tree || data.writers || doc.workspace || doc.corp || "";
  const liveSha = (trees.live_sha || trees.uvicorn_sha || data.live_sha || doc.live_sha || doc.uvicorn_sha || "").toString().slice(0, 7);
  const stale = data.graphify_stale || trees.graphify_stale
    ? '<p class="meta">graphify устарел — после close нужен graphify update в репо писателей.</p>'
    : "";
  if (writers && String(writers) !== String(live)) {
    return `<ul>
      <li>живой контур · ${escapeHtml(live)}${liveSha ? ` · ${escapeHtml(liveSha)}` : ""}</li>
      <li>писатели · ${escapeHtml(writers)}</li>
    </ul>${stale}`;
  }
  return `<p class="meta">живой контур · /opt/corp · писатели — отдельное дерево (часто /home/corp/projects). Mac — третье место, не сервер.</p>${stale}`;
}

function renderMap(data) {
  const doc = data.doctor || {};
  const checks = doctorChecksHtml(doc.checks, doc.isolation);
  const projects = (data.projects || []).map((p) =>
    `<li>${escapeHtml(p.name)} — ${p.graphify ? "граф есть" : "графа нет"}</li>`
  ).join("");
  const live = (data.live || []).join(", ") || "тихо";
  const orch = (data.orch || []).join(", ") || "тихо";
  const registryWarn = data.uncommitted_registry
    ? `<p class="map-banner" role="status">Реестр разошёлся: git registry.json — канон, workshop.json overlay только авария. Пины не бросаем.</p>`
    : "";
  const emptyProjects = projects
    ? `<ul>${projects}</ul>`
    : '<p class="meta">Проектов на карте нет. Добавь репо в Настройках → Репозитории.</p>';
  $("map").innerHTML = `
    ${registryWarn}
    <article><h2>Контур</h2>
      <p class="meta">${escapeHtml(doctorMeta(doc))}</p>
      ${contourTreesHtml(data)}
    </article>
    <article><h2>Doctor</h2>
      <p class="meta">${escapeHtml(doc.isolation || "transitional")}${doc.isolation_reason ? ` · ${escapeHtml(doc.isolation_reason)}` : ""}</p>
      <ul>${checks || '<li class="meta">Проверок нет. Открой Настройки → Доступ.</li>'}</ul>
    </article>
    <article><h2>Сейчас</h2>
      <div class="map-now">
        <div><b>${escapeHtml(live)}</b><span>VPS</span></div>
        <div><b>${escapeHtml(orch)}</b><span>разбор</span></div>
        <div><b>${data.queue_running ? "идёт" : "пауза"}</b><span>Автоном</span></div>
      </div>
    </article>
    <article><h2>Проекты</h2>${emptyProjects}</article>`;
}

function draftBatchBar(prefix) {
  return `<div class="row draft-batch">
    <button type="button" class="btn primary" id="${prefix}-approve-sel">Принять выбранные</button>
    <button type="button" class="btn" id="${prefix}-approve-vis">Принять все видимые</button>
  </div>`;
}

function draftCard(d, pick) {
  const why = d.why ? `<p class="draft-why">${escapeHtml(d.why)}</p>` : "";
  const body = d.body ? `<details><summary class="meta">текст</summary><pre class="draft-body">${escapeHtml(d.body)}</pre></details>` : "";
  const prd = d.vs_prd ? `<p class="meta">В спеке: ${escapeHtml(d.vs_prd)}</p>` : "";
  const open = d.vs_open ? `<p class="meta">На доске: ${escapeHtml(d.vs_open)}</p>` : "";
  const box = pick
    ? `<label class="pick"><input type="checkbox" data-draft-id="${escapeHtml(d.id)}" ${autoDraftChecked.includes(d.id) ? "checked" : ""}><span class="sr-only">Выбрать черновик ${escapeHtml(d.title || d.id)} для принятия</span></label>`
    : "";
  return `<article class="card draft${pick ? " pick" : ""}"><header><span>${escapeHtml(d.kind || "build")}</span><span>${escapeHtml(d.label || "")}${isDisposable(d) ? ' <span class="badge">песочница</span>' : ""}</span></header>
    ${box}
    <h3>${escapeHtml(d.title)}</h3>
    ${why}${prd}${open}
    <div class="row">
      <button class="btn primary" data-approve="${d.id}">Принять</button>
      <button class="btn" data-skip="${d.id}">Пропустить</button>
    </div>
    ${body}</article>`;
}

async function approveDraftIds(ids, onDone, onErr) {
  if (!ids.length) {
    if (onErr) onErr("отметь хотя бы один черновик");
    return { ok: false, errors: [{ error: "пусто" }] };
  }
  try {
    const data = await api("/api/draft", { action: "approve", ids });
    const errors = data.errors || [];
    const approved = data.approved || [];
    const okIds = new Set(approved.map((row) => row?.draft?.id || row?.id).filter(Boolean));
    autoDraftChecked = autoDraftChecked.filter((id) => !okIds.has(id));
    if (data.ok !== true || errors.length) {
      const msg = errors.map((e) => e.error || e.message || e.id || String(e)).join("; ")
        || "часть черновиков не принята";
      if (onErr) onErr(msg);
      else flash(msg, true);
      if (onDone) onDone();
      return data;
    }
    if (onErr) onErr("");
    flash(ids.length > 1 ? "принятые черновики на GitHub" : "черновик на GitHub");
    if (onDone) onDone();
    return data;
  } catch (err) {
    if (onErr) onErr(err.message);
    else flash(err.message, true);
    if (onDone) onDone();
    return { ok: false, errors: [{ error: err.message }] };
  }
}

function bindDraftList(root, onDone, onErr) {
  if (!root) return;
  root.querySelectorAll("[data-draft-id]").forEach((box) => {
    box.onchange = () => {
      const id = box.dataset.draftId;
      if (box.checked) {
        if (!autoDraftChecked.includes(id)) autoDraftChecked.push(id);
      } else {
        autoDraftChecked = autoDraftChecked.filter((x) => x !== id);
      }
    };
  });
  root.querySelectorAll("[data-approve]").forEach((b) => {
    b.onclick = async () => {
      await approveDraftIds([b.dataset.approve], onDone, onErr);
    };
  });
  root.querySelectorAll("[data-skip]").forEach((b) => {
    b.onclick = async () => {
      try {
        await api("/api/draft", { id: b.dataset.skip, action: "skip" });
        autoDraftChecked = autoDraftChecked.filter((id) => id !== b.dataset.skip);
        if (onErr) onErr("");
      } catch (err) {
        if (onErr) onErr(err.message);
      }
      if (onDone) onDone();
    };
  });
}

function bindDraftBatch(prefix, drafts, onDone, onErr) {
  const sel = $(`${prefix}-approve-sel`);
  const vis = $(`${prefix}-approve-vis`);
  if (sel) {
    sel.onclick = async () => {
      const ids = drafts.map((d) => d.id).filter((id) => autoDraftChecked.includes(id));
      await approveDraftIds(ids, onDone, onErr);
    };
  }
  if (vis) {
    vis.onclick = async () => {
      await approveDraftIds(drafts.map((d) => d.id).filter(Boolean), onDone, onErr);
    };
  }
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
  const err = orch.error && !live ? `<p class="err">${escapeHtml(orch.error)}</p>` : "";
  return `<article class="card orch ${live ? "live" : ""}"><h3>${title}</h3>
    <p class="meta">${escapeHtml(orch.kind || "разбор")}</p>
    ${err}
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
  if ((s.ready || 0) === 0) return "Нет карточек в Готово — пора разобрать";
  return `${s.ready} в Готово`;
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
    const drafts = (data.drafts || []).filter(draftMatches);
    const orch = data.orch || {};
    const researching = Boolean(orch.running || orch.status === "running");
    $("orch-run").disabled = researching;
    $("orch-run").textContent = researching ? "Идёт разбор…" : "Разобрать";
    const phone = phoneNarrow();
    let journalHtml = "";
    if (!phone) {
      journalHtml = '<p class="meta">Журнал загружается…</p>';
      try {
        const [mem, ev] = await Promise.all([
          api(`/api/memory?name=${encodeURIComponent(name)}`),
          api("/api/events"),
        ]);
        const notes = (mem.notes || []).filter((n) => matchesQuery(n.name, n.text));
        const events = (ev.events || []).filter((e) => matchesQuery(e.kind, e.ref, e.text, eventKindRu(e.kind)));
        journalHtml = renderJournalHtml(notes, events, name);
      } catch (err) {
        journalHtml = `<p class="err">${escapeHtml(err.message)}</p>`;
      }
    }
    const emptyDrafts = researching
      ? ""
      : '<p class="meta empty-next">Черновиков нет. Нажми Разобрать — оркестр предложит следующие шаги, не пустую доску.</p>';
    $("project-box").innerHTML = `
      <div class="project-split">
        ${phone ? "" : `<aside class="project-journal">${journalHtml}</aside>`}
        <div class="project-main stack">
          <article class="card"><h3>${escapeHtml(stageLine(s))}</h3>
            <p class="meta">открыто ${s.open || 0} · в Готово ${s.ready || 0} · P0 ${s.p0 || 0} · ход ${s.in_progress || 0} · QA ${s.qa || 0}</p>
            <p class="meta">SPEC ${s.spec_present ? "есть" : "нет"} · PRD ${s.prd_present ? "есть" : "нет"} · разрыв ${escapeHtml(s.gap || "нет")} · граф ${escapeHtml(s.graph_age || "нет")}${s.dirty || s.unpushed ? ` · git ${[s.dirty ? "dirty" : "", s.unpushed ? "unpushed" : ""].filter(Boolean).join("/")}` : ""}</p>
            <p class="meta">${(s.unshipped || []).map((b) => escapeHtml(b)).join(" · ") || (s.docs || []).join(", ") || "нет спеки"}</p>
          </article>
          ${orchCard(orch, name)}
          ${drafts.length ? draftBatchBar("proj-draft") : ""}
          ${drafts.map((d) => draftCard(d, true)).join("") || emptyDrafts}
          ${phone ? '<p class="meta"><button type="button" class="btn link" id="proj-journal">Журнал</button></p>' : ""}
        </div>
      </div>`;
    bindDraftList($("project-box"), () => renderProject(), (err) => { if (err) flash(err, true); });
    bindDraftBatch("proj-draft", drafts, () => renderProject(), (err) => {
      if (err) flash(err, true);
    });
    if ($("proj-journal")) $("proj-journal").onclick = () => setTab("journal");
    if ($("orch-console")) {
      $("orch-console").onclick = () => {
        openConsole(`orch:${$("orch-console").dataset.orch || name}`, "");
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
  try { await write("/api/orchestrate", { project: name }, "разбор"); } catch (_) { /* strip */ }
  renderProject();
};

function optionList(values, selected, extra) {
  const all = [...values];
  if (extra && !all.includes(extra)) all.unshift(extra);
  return all.map((v) => `<option ${v === selected ? "selected" : ""}>${escapeHtml(v)}</option>`).join("");
}

function kindStatus(kind) {
  const row = catalogKind(kind);
  if (row.installed === false) return ["nopill", row.note || "нет CLI"];
  if (!row.installed) return ["nopill", row.note || "нет CLI"];
  if (row.stale) return ["nopill", "кэш"];
  if (!(row.models || []).length) return ["nopill", "пусто"];
  return ["okpill", "готов"];
}

function modelField(kind, selected, slot, role) {
  const row = catalogKind(kind);
  if (row.installed === false) {
    return `<span class="note">${escapeHtml(row.note || "нет CLI")}</span>`;
  }
  const models = row.models || [];
  const attrs = slot ? `data-slot="${slot}" data-role="${role}"` : "";
  const select = `<select ${attrs} data-k="model">
            <option value="">авто</option>
            ${optionList(models, selected, selected)}
          </select>`;
  if (models.length && !row.stale) return select;
  return `${select}<input ${attrs} data-k="model-custom" placeholder="свой id с CLI" value="${escapeHtml(selected || "")}">`;
}

function paintRegistryWarn() {
  const room = $("room-repos");
  if (!room) return;
  let el = $("registry-warn");
  if (!el) {
    el = document.createElement("p");
    el.id = "registry-warn";
    el.className = "err";
    room.insertBefore(el, room.firstChild);
  }
  if (state.uncommitted_registry) {
    el.textContent = "uncommitted registry — git registry.json канон, workshop.json overlay только авария. Пины не бросаем.";
    el.classList.remove("hidden");
  } else {
    el.textContent = "";
    el.classList.add("hidden");
  }
}

function renderSettings() {
  paintRegistryWarn();
  const doc = state.doctor || state._map?.doctor;
  renderDoctor(doc);
  const meta = $("doctor-meta");
  if (meta && (doc || state._map)) {
    const trees = contourTreesHtml({
      doctor: doc,
      trees: state.trees || state._map?.trees,
      graphify_stale: state.graphify_stale || state._map?.graphify_stale,
      ...(state._map || {}),
    });
    if (!$("settings-trees")) {
      const wrap = document.createElement("div");
      wrap.id = "settings-trees";
      wrap.className = "note";
      meta.after(wrap);
    }
    const box = $("settings-trees");
    if (box) box.innerHTML = trees;
  }
  $("max-parallel").value = state.max_parallel || 3;
  if ($("queue-retries")) $("queue-retries").value = state.queue_retries ?? 2;
  const catalog = (state.catalog && state.catalog.kinds) || {};
  const notes = [];
  if (state.catalog && state.catalog.probed_at) notes.push(`каталог ${state.catalog.probed_at}`);
  Object.entries(catalog).forEach(([k, row]) => {
    if (row && row.note) notes.push(`${k}: ${row.note}`);
  });
  $("catalog-note").textContent = notes.join(" · ") || "каталог ещё не снимали";
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
        <label>Усилие
          <select data-k="effort">
            <option value=""></option>
            ${optionList(efforts, p.effort, p.effort)}
          </select>
        </label>
        <label>Быстрый <input data-k="fast" type="checkbox" ${p.fast ? "checked" : ""} ${kind.fast ? "" : "disabled"}></label>
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
        <label>усилие
        <select data-slot="${p.name}" data-role="${role}" data-k="effort">
          ${(kind.efforts || []).map((e) => `<option ${s.effort === e ? "selected" : ""}>${e}</option>`).join("")}
        </select></label>
        ${kind.fast ? `<label class="pick">Быстрый <input type="checkbox" data-slot="${p.name}" data-role="${role}" data-k="fast" ${s.fast ? "checked" : ""}></label>` : ""}
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
  const name = ($("new-repo").value || "").trim();
  try { await write("/api/projects/create", { name }, `создан ${name}`); } catch (_) { return; }
  const next = $("create-next");
  if (next) {
    next.classList.remove("hidden");
    next.innerHTML = `Дальше: открой пин <b>${escapeHtml(name)}</b>, правь <code>docs/SPEC.md</code>, затем Разобрать на Проекте — черновики, не пустая доска.`;
  }
  flash(`создан ${name} · открой пин, правь SPEC, заведи черновики`);
  setFilter(name);
  setTab("project");
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

$("console-project").onchange = () => {
  consolePick = $("console-project").value;
  pollConsole();
};
if ($("console-mode-issue")) {
  $("console-mode-issue").onclick = () => {
    consoleLogMode = "issue";
    paintConsoleChrome();
    pollConsole();
  };
}
if ($("console-mode-run")) {
  $("console-mode-run").onclick = () => {
    consoleLogMode = "run";
    paintConsoleChrome();
    pollConsole();
  };
}
if ($("console-to-card")) {
  $("console-to-card").onclick = () => {
    if (!consoleIssue) return;
    setTab("board");
    openSheet(consoleIssue);
  };
}

function liveLabel(p) {
  return p.startsWith("orch:") ? `разбор · ${p.slice(5)}` : p;
}

function paintConsolePayload(data) {
  const issue = consoleIssue || "";
  const parts = [];
  if (issue) {
    if (data.log) parts.push(data.log);
    if (data.last_error) parts.push(data.last_error);
  } else {
    if (data.last_error) parts.push(data.last_error);
    if (data.log) parts.push(data.log);
    if (data.pane) parts.push(data.pane);
  }
  $("console").textContent = parts.join("\n\n") || (issue ? "нет лога этой карточки" : "пока тихо");
  $("console").scrollTop = $("console").scrollHeight;
  const live = data.live || [];
  const f = currentFilter();
  const names = [...new Set([...pinNames(), ...live, ...(isPin(f) ? [f, `orch:${f}`] : [])])];
  const pick = consolePick || "";
  $("console-project").innerHTML = `<option value="">сессия</option>` + names.map((p) =>
    `<option value="${escapeHtml(p)}" ${p === pick ? "selected" : ""}>${live.includes(p) ? "● " : ""}${escapeHtml(liveLabel(p))}</option>`
  ).join("");
}

async function pollConsole() {
  const f = currentFilter();
  let pick = consolePick || $("console-project").value;
  if (!consoleIssue && isPin(f) && pick !== f && pick !== `orch:${f}`) pick = f;
  consolePick = pick;
  const issue = (consoleIssue && consoleLogMode !== "run") ? consoleIssue : "";
  paintConsoleChrome();
  try {
    const qs = new URLSearchParams();
    if (pick) qs.set("project", pick);
    if (issue) qs.set("issue", issue);
    const data = await api(`/api/console?${qs}`);
    paintConsolePayload(data);
  } catch (err) {
    flash(err.message, true);
  }
  syncSse();
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
    applyIssueLink();
    if ($("tab-project").classList.contains("on")) renderProject();
    if ($("tab-graphs").classList.contains("on")) renderGraphs();
    if ($("tab-journal") && $("tab-journal").classList.contains("on")) renderJournal();
    refreshBusy = false;
    Promise.allSettled([api("/api/settings"), api("/api/map")]).then((extras) => {
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
      const writing = liveWritingCard(running);
      stripIssue = writing ? issueRef(writing) : "";
      const q = (state.queue || []).filter((i) => i.status === "waiting").length;
      if (Date.now() >= stripHold) {
        $("strip").classList.remove("bad");
        stripTarget = running ? "console" : researching ? "project" : "";
        $("strip").disabled = !(stripTarget || stripIssue);
        $("strip").innerHTML = running
          ? `<i class="pulse"></i><b>VPS · ${escapeHtml(running)}${q ? ` · очередь ${q}` : ""}</b>`
          : researching
            ? `<i class="pulse"></i><b>разбор · ${escapeHtml(researching)}</b>`
            : `<i class="pulse"></i><b>${state.queue_running ? `Автоном · ждут ${q}` : "тихо"}</b>`;
      }
      if (!autoTyping()) renderAuto();
      renderMap(mapped);
      if (!settingsDirty && settings) {
        renderSlots();
        renderSettings();
      }
      if ($("tab-console").classList.contains("on")) pollConsole();
    });
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
  if (stripIssue) {
    const card = (state.cards || []).find((c) => issueRef(c) === stripIssue);
    if (card) {
      consoleIssue = stripIssue;
      consolePick = card.project;
      consoleLogMode = "issue";
      phoneCol = card.column || phoneCol;
      setTab("board");
      openSheet(stripIssue);
      return;
    }
  }
  const running = (state._map && state._map.live && state._map.live[0]) || "";
  if (running) {
    openConsole(running, stripIssue);
    return;
  }
  if (stripTarget) setTab(stripTarget);
};

if ($("q")) {
  $("q").oninput = () => {
    searchQuery = $("q").value || "";
    lastBoardKey = "";
    lastAutoKey = "";
    journalKey = "";
    renderFilters();
    renderBoard();
    if ($("tab-auto").classList.contains("on")) renderAuto();
    if ($("tab-project").classList.contains("on")) renderProject();
    if ($("tab-journal") && $("tab-journal").classList.contains("on")) renderJournal();
  };
}

boot();
setInterval(() => {
  if (document.hidden || $("app").classList.contains("hidden")) return;
  if (sse) return;
  refresh();
  if ($("tab-console") && $("tab-console").classList.contains("on")) pollConsole();
}, 8000);

let sse = null;
function sseUrl() {
  const qs = new URLSearchParams();
  const pick = consolePick || "";
  const issue = (consoleIssue && consoleLogMode !== "run") ? consoleIssue : "";
  if (pick) qs.set("project", pick);
  if (issue) qs.set("issue", issue);
  const q = qs.toString();
  return `/api/console/stream${q ? `?${q}` : ""}`;
}

function closeSse() {
  if (sse) {
    try { sse.close(); } catch (_) { /* already gone */ }
    sse = null;
  }
}

function syncSse() {
  if (!window.EventSource || document.hidden || $("app").classList.contains("hidden")) return;
  const want = sseUrl();
  if (sse && sse._url === want) return;
  closeSse();
  try {
    sse = new EventSource(want);
    sse._url = want;
    sse.addEventListener("console", (ev) => {
      try { paintConsolePayload(JSON.parse(ev.data)); } catch (_) { /* skip bad frame */ }
    });
    sse.addEventListener("status", () => {
      if (!document.hidden) refresh();
    });
    sse.onerror = () => {
      closeSse();
      setTimeout(syncSse, 5000);
    };
  } catch (_) {
    sse = null;
  }
}
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && !$("app").classList.contains("hidden")) {
    refresh();
    syncSse();
  } else {
    closeSse();
  }
});

boot();
if ($("app") && !$("app").classList.contains("hidden")) syncSse();
