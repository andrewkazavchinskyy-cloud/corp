const $ = (id) => document.getElementById(id);
const titles = {
  board: ["Доска", "GitHub Issues"],
  auto: ["Автоном", "Очередь VPS"],
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
let orchPoll = 0;
let consolePick = "";

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

function showApp() {
  $("gate").classList.add("hidden");
  $("app").classList.remove("hidden");
  refresh();
}

async function boot() {
  const token = new URLSearchParams(location.hash.slice(1)).get("token")
    || new URLSearchParams(location.search).get("token") || "";
  if (token) $("token").value = token;
  const status = await api("/api/auth/status");
  if (status.ok) return showApp();
  $("gate").classList.remove("hidden");
  if (status.has_passkey) $("btn-login").classList.remove("hidden");
  else {
    $("token-wrap").classList.remove("hidden");
    $("btn-register").classList.remove("hidden");
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
  $("app").classList.add("hidden");
  $("gate").classList.remove("hidden");
  $("btn-login").classList.remove("hidden");
  $("token-wrap").classList.add("hidden");
  $("btn-register").classList.add("hidden");
};

function visibleCards() {
  const f = currentFilter();
  if (f === "all") return state.cards || [];
  return (state.cards || []).filter((c) => c.project === f);
}

function renderFilters() {
  const hide = $("tab-settings").classList.contains("on");
  $("project-filters").classList.toggle("hidden", hide);
  if (hide) return;
  const pins = state.pins || [];
  const cur = currentFilter();
  const chips = [["all", "Все"], ...pins.map((p) => [p.name, p.name])];
  $("project-filters").innerHTML = chips.map(([id, label]) =>
    `<button type="button" class="chip${id === cur ? " on" : ""}" data-filter="${id}">${escapeHtml(label)}</button>`
  ).join("");
  $("project-filters").querySelectorAll("[data-filter]").forEach((btn) => {
    btn.onclick = () => setFilter(btn.dataset.filter);
  });
}

function setTab(name) {
  document.querySelectorAll(".tab").forEach((el) => el.classList.toggle("on", el.id === `tab-${name}`));
  document.querySelectorAll("[data-tab]").forEach((el) => el.classList.toggle("on", el.dataset.tab === name));
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
  if (card.blocked) bits.push('<span class="badge blocked">blocked</span>');
  if (card.queued) bits.push('<span class="badge">очередь</span>');
  if (card.runner === "self") bits.push('<span class="badge self">я</span>');
  else if (card.runner && card.runner !== "queued") bits.push(`<span class="badge vps">VPS · ${escapeHtml(card.runner)}</span>`);
  (card.labels || []).forEach((l) => {
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
  return `<article class="${cardClass(card)}" data-issue="${issueRef(card)}" data-col="${card.column}">
    <header><span>${escapeHtml(card.project)}</span><span>#${card.number}</span></header>
    <h3>${escapeHtml(card.title || "")}</h3>
    <div class="badges">${badge(card)}</div>
  </article>`;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function renderColnav() {
  const cards = visibleCards();
  $("colnav").innerHTML = COLS.map(([id, label]) => {
    const n = cards.filter((c) => c.column === id).length;
    return `<button type="button" data-col="${id}" class="${id === phoneCol ? "on" : ""}">${label} ${n}</button>`;
  }).join("");
  $("colnav").querySelectorAll("[data-col]").forEach((btn) => {
    btn.onclick = () => {
      phoneCol = btn.dataset.col;
      lastBoardKey = "";
      renderBoard();
    };
  });
}

function renderBoard() {
  const cards = visibleCards();
  const key = JSON.stringify(cards.map((c) => [c.repo, c.number, c.column, c.runner, c.title, phoneCol, currentFilter()]));
  if (key === lastBoardKey && $("board").children.length) {
    renderColnav();
    return;
  }
  lastBoardKey = key;
  $("board").innerHTML = COLS.map(([id, label]) => {
    const list = cards.filter((c) => c.column === id);
    return `<div class="col-wrap${id === phoneCol ? " show" : ""}" data-col="${id}"><h2>${label} <span class="count">${list.length}</span></h2>
      <div class="lane" data-col="${id}">${list.map(cardHtml).join("")}</div></div>`;
  }).join("");
  renderColnav();
  $("board").querySelectorAll(".card").forEach((el) => {
    el.onclick = () => openSheet(el.dataset.issue);
  });
  if (window.matchMedia("(max-width: 899px)").matches) return;
  $("board").querySelectorAll(".lane").forEach((lane) => {
    Sortable.create(lane, {
      group: "board",
      animation: 150,
      onMove: (evt) => evt.to.dataset.col !== "in-progress",
      onEnd: async (evt) => {
        const issue = evt.item.dataset.issue;
        const column = evt.to.dataset.col;
        const from = evt.from.dataset.col;
        if (column === from || column === "in-progress") return;
        lastBoardKey = "";
        try {
          if (column === "done") {
            if (!confirm("Закрыть ишью на GitHub?")) {
              refresh();
              return;
            }
            await api("/api/close", { issue });
          } else {
            await api("/api/move", { issue, column });
          }
        } catch (err) {
          alert(err.message);
        }
        refresh();
      },
    });
  });
}

function catalogKind(kind) {
  return ((state.catalog || {}).kinds || {})[kind] || {};
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

function sheetExits(card, extra = "") {
  const moves = [["ready", "В ready"], ["backlog", "В backlog"]]
    .filter(([id]) => id !== card.column)
    .map(([id, label]) => `<button type="button" class="btn" data-col="${id}">${label}</button>`)
    .join("");
  return `${extra}${moves}<button type="button" class="btn" id="sheet-close">Закрыть</button>`;
}

function bindSheetExits() {
  $("sheet-acts").querySelectorAll("[data-col]").forEach((b) => {
    b.onclick = async () => {
      try {
        await api("/api/move", { issue: sheetIssue, column: b.dataset.col });
        closeSheet();
      } catch (err) { alert(err.message); }
    };
  });
  if ($("sheet-close")) {
    $("sheet-close").onclick = async () => {
      if (!confirm("Закрыть ишью на GitHub?")) return;
      try {
        await api("/api/close", { issue: sheetIssue });
        closeSheet();
      } catch (err) { alert(err.message); }
    };
  }
}

function openSheet(issue) {
  const card = state.cards.find((c) => issueRef(c) === issue);
  if (!card) return;
  sheetIssue = issue;
  $("sheet-title").textContent = card.title || `${card.project} #${card.number}`;
  $("sheet-kicker").textContent = `${card.project} #${card.number}`;
  const acts = $("sheet-acts");
  if (card.column === "done") {
    $("sheet-note").textContent = "Закрыто";
    acts.innerHTML = card.url
      ? `<a class="btn" href="${escapeHtml(card.url)}" target="_blank" rel="noreferrer">Открыть на GitHub</a>`
      : "";
  } else if (card.runner === "self") {
    $("sheet-note").textContent = "Это ты. Карточка у тебя. VPS не стартует.";
    acts.innerHTML = sheetExits(card);
    bindSheetExits();
  } else if (card.column === "in-progress" && vpsRunner(card)) {
    $("sheet-note").textContent = `Уже бежит на VPS · ${card.runner}`;
    acts.innerHTML = sheetExits(card, '<button type="button" class="btn primary" id="sheet-console">Консоль</button>');
    $("sheet-console").onclick = () => {
      closeSheet();
      setFilter(card.project);
      setTab("console");
    };
    bindSheetExits();
  } else {
    $("sheet-note").textContent = card.title || "";
    acts.innerHTML = sheetExits(card, `<button type="button" class="btn" id="sheet-self">Я сам</button>
      <label class="field"><span>Профиль VPS</span><select id="sheet-profile"></select></label>
      <button type="button" class="btn primary" id="sheet-run">Запустить на VPS</button>`);
    fillProfiles($("sheet-profile"));
    $("sheet-self").onclick = async () => {
      try {
        await api("/api/take", { issue: sheetIssue });
        closeSheet();
      } catch (err) { alert(err.message); }
    };
    $("sheet-run").onclick = async () => {
      try {
        await api("/api/run", { issue: sheetIssue, profile: $("sheet-profile").value });
        closeSheet();
      } catch (err) { alert(err.message); }
    };
    bindSheetExits();
  }
  $("sheet").classList.remove("hidden");
  $("scrim").classList.remove("hidden");
}

function closeSheet() {
  $("sheet").classList.add("hidden");
  $("scrim").classList.add("hidden");
  lastBoardKey = "";
  refresh();
}

$("sheet-cancel").onclick = closeSheet;
$("scrim").onclick = closeSheet;

function renderAuto() {
  fillProfiles($("bulk-profile"));
  const ready = visibleCards().filter((c) => c.column === "ready" && c.runner !== "self");
  $("auto-ready").innerHTML = ready.map((c) =>
    `<label class="pick card"><input type="checkbox" value="${issueRef(c)}">
      <div><strong>${escapeHtml(c.project)} #${c.number}</strong>
      <div>${escapeHtml(c.title || "")}</div></div></label>`
  ).join("") || '<p class="meta">Нет ready</p>';
  $("auto-queue").innerHTML = (state.queue || []).map((q) =>
    `<article class="card"><header><span>${escapeHtml(q.project)}</span><span>${escapeHtml(q.status)}</span></header>
      <h3>#${q.issue} ${escapeHtml(q.title || "")}</h3>
      <p class="meta">${escapeHtml(q.profile || "")}</p>
      ${q.status === "waiting" ? `<button class="btn" data-rm="${q.repo}#${q.issue}">Убрать</button>` : ""}</article>`
  ).join("") || '<p class="meta">Очередь пуста</p>';
  $("auto-queue").querySelectorAll("[data-rm]").forEach((btn) => {
    btn.onclick = async () => {
      await api("/api/queue/rm", { issue: btn.dataset.rm });
      refresh();
    };
  });
}

$("auto-add").onclick = async () => {
  const profile = $("bulk-profile").value;
  const boxes = [...$("auto-ready").querySelectorAll("input:checked")];
  for (const box of boxes) {
    await api("/api/queue/add", { issue: box.value, profile });
  }
  refresh();
};
$("auto-start").onclick = async () => { await api("/api/queue/start", {}); refresh(); };
$("auto-pause").onclick = async () => { await api("/api/queue/pause", {}); refresh(); };

function orbSize(nodes) {
  return Math.max(72, Math.min(132, 72 + Math.round((nodes || 0) / 8)));
}

function graphSky(groups) {
  const n = Math.max(groups.length, 1);
  return groups.map((g, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = 34 + (i % 2) * 6;
    const left = 50 + r * Math.cos(a);
    const top = 50 + r * Math.sin(a);
    const size = Math.max(44, Math.min(88, 36 + (g.size || 1) * 1.4));
    return `<button type="button" class="g-star c${i % 5}" style="left:${left}%;top:${top}%;width:${size}px;height:${size}px" title="${escapeHtml(g.name)} · ${g.size}">
      <b>${escapeHtml(g.name)}</b><span>${g.size}</span></button>`;
  }).join("");
}

function graphDetailHtml(g) {
  const gods = (g.gods || []).map((x) =>
    `<li><b>${escapeHtml(x.name)}</b><span>${x.edges}</span></li>`
  ).join("") || "<li class=\"meta\">нет</li>";
  const hubs = (g.hubs || []).map((h) => `<span class="chip">${escapeHtml(h)}</span>`).join("");
  return `<article class="g-detail">
    <header class="g-hero">
      <button type="button" class="btn" id="g-back">Все проекты</button>
      <div>
        <p class="kicker">${g.pinned ? "пин" : "репо"} · ${escapeHtml(g.age || "")}</p>
        <h2>${escapeHtml(g.name)}</h2>
      </div>
      <div class="g-stats">
        <div><b>${g.nodes || 0}</b><span>узлы</span></div>
        <div><b>${g.edges || 0}</b><span>рёбра</span></div>
        <div><b>${g.communities || 0}</b><span>сообщества</span></div>
      </div>
    </header>
    <div class="g-sky">${graphSky(g.groups || [])}</div>
    <div class="g-meta">
      <section><h3>Хабы</h3><div class="filters">${hubs || '<span class="meta">нет</span>'}</div></section>
      <section><h3>Ядра</h3><ol class="g-gods">${gods}</ol></section>
    </div>
    <p class="meta">${escapeHtml(g.fresh ? `commit ${g.fresh}` : "")} · ${escapeHtml(g.repo || "")}</p>
  </article>`;
}

function graphGalaxyHtml(list) {
  const withG = list.filter((p) => p.has_graph).length;
  return `<div class="g-bar"><p class="meta">${withG} с графом · ${list.length - withG} без</p></div>
    <div class="g-galaxy">${list.map((p) => {
      const size = orbSize(p.nodes);
      const cls = `g-orb${p.pinned ? " pin" : ""}${p.has_graph ? "" : " miss"}`;
      return `<button type="button" class="${cls}" data-graph="${escapeHtml(p.name)}" style="--orb:${size}px">
        <i>${p.has_graph ? (p.nodes || 0) : "—"}</i>
        <b>${escapeHtml(p.name)}</b>
        <span>${p.has_graph ? `${p.communities || 0} сообществ` : "графа нет"}</span>
      </button>`;
    }).join("")}</div>`;
}

async function renderGraphs() {
  const box = $("graphs");
  if (!box) return;
  try {
    const f = currentFilter();
    const want = isPin(f) ? f : graphFocus;
    if (want) {
      const g = await api(`/api/graphs/view?name=${encodeURIComponent(want)}`);
      if (!g.has_graph) {
        box.innerHTML = `<article class="g-detail"><button type="button" class="btn" id="g-back">Все проекты</button>
          <h2>${escapeHtml(g.name)}</h2><p class="meta">Графа ещё нет. Появится после close и graphify.</p></article>`;
        $("g-back").onclick = () => { graphFocus = ""; if (isPin(currentFilter())) setFilter("all"); else renderGraphs(); };
        return;
      }
      box.innerHTML = graphDetailHtml(g);
      $("g-back").onclick = () => {
        graphFocus = "";
        if (isPin(currentFilter())) setFilter("all");
        else renderGraphs();
      };
      return;
    }
    const data = await api("/api/graphs");
    graphsCache = data.projects || [];
    box.innerHTML = graphGalaxyHtml(graphsCache);
    box.querySelectorAll("[data-graph]").forEach((btn) => {
      btn.onclick = () => {
        const row = graphsCache.find((p) => p.name === btn.dataset.graph);
        if (!row || !row.has_graph) return;
        graphFocus = row.name;
        renderGraphs();
      };
    });
  } catch (err) {
    box.innerHTML = `<p class="err">${escapeHtml(err.message)}</p>`;
  }
}

function renderMap(data) {
  const checks = (data.doctor?.checks || []).map((c) => `<li>${c.ok ? "ok" : "нет"} ${escapeHtml(c.name)}</li>`).join("");
  const projects = (data.projects || []).map((p) =>
    `<li>${escapeHtml(p.name)} — ${p.graphify ? "граф есть" : "графа нет"} — ${escapeHtml(p.cwd || "не клонирован")}</li>`
  ).join("");
  const live = (data.live || []).join(", ") || "тихо";
  const orch = (data.orch || []).join(", ") || "тихо";
  $("map").innerHTML = `
    <article><h2>Контур</h2><p class="meta">corp в /opt/corp · проекты в /home/corp/projects · GitHub Issues · Tailscale</p>
      <ul>${checks}</ul></article>
    <article><h2>Сейчас</h2><p>VPS: ${escapeHtml(live)}</p>
      <p>orch: ${escapeHtml(orch)}</p>
      <p>Автоном: ${data.queue_running ? "идёт" : "пауза"}</p></article>
    <article><h2>Проекты</h2><ul>${projects}</ul></article>`;
}

function draftCard(d) {
  const why = d.why ? `<p class="draft-why">${escapeHtml(d.why)}</p>` : "";
  const body = d.body ? `<pre class="draft-body">${escapeHtml(d.body)}</pre>` : "";
  const prd = d.vs_prd ? `<p class="meta">В спеке: ${escapeHtml(d.vs_prd)}</p>` : "";
  const open = d.vs_open ? `<p class="meta">На доске: ${escapeHtml(d.vs_open)}</p>` : "";
  return `<article class="card draft"><header><span>${escapeHtml(d.kind || "build")}</span><span>${escapeHtml(d.label || "")}</span></header>
    <h3>${escapeHtml(d.title)}</h3>
    ${why}${body}${prd}${open}
    <div class="row">
      <button class="btn primary" data-approve="${d.id}">Approve</button>
      <button class="btn" data-skip="${d.id}">Skip</button>
    </div></article>`;
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

async function renderProject() {
  const name = currentFilter();
  if (!isPin(name)) {
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
    $("project-box").innerHTML = `
      <article class="card"><h3>${escapeHtml(s.stage || "")}</h3>
        <p class="meta">open ${s.open || 0} · ready ${s.ready || 0} · P0 ${s.p0 || 0} · ход ${s.in_progress || 0}</p>
        <p class="meta">граф ${escapeHtml(s.graph_age || "нет")} · ${(s.docs || []).join(", ") || "нет спеки"}</p>
      </article>
      ${orchCard(orch, name)}
      ${drafts.map(draftCard).join("") || (researching ? "" : '<p class="meta">Черновиков нет</p>')}`;
    $("project-box").querySelectorAll("[data-approve]").forEach((b) => {
      b.onclick = async () => { await api("/api/draft", { id: b.dataset.approve, action: "approve" }); renderProject(); };
    });
    $("project-box").querySelectorAll("[data-skip]").forEach((b) => {
      b.onclick = async () => { await api("/api/draft", { id: b.dataset.skip, action: "skip" }); renderProject(); };
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
  if (!isPin(name)) return alert("Сначала выберите corp или clarity");
  await api("/api/orchestrate", { project: name });
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
  settingsDirty = true;
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
      return `<label>${role}
        <select data-slot="${p.name}" data-role="${role}" data-k="kind">
          ${["claude", "codex", "grok", "cursor"].map((k) =>
            `<option ${kindName === k ? "selected" : ""} ${catalog[k] && catalog[k].installed === false ? "disabled" : ""}>${k}</option>`).join("")}
        </select>
        ${modelField(kindName, s.model, p.name, role)}
        <select data-slot="${p.name}" data-role="${role}" data-k="effort">
          ${(kind.efforts || []).map((e) => `<option ${s.effort === e ? "selected" : ""}>${e}</option>`).join("")}
        </select>
        ${kind.fast ? `<label>Fast <input type="checkbox" data-slot="${p.name}" data-role="${role}" data-k="fast" ${s.fast ? "checked" : ""}></label>` : ""}
      </label>`;
    }).join("")}</article>`;
  }).join("");
}

$("tab-settings").addEventListener("input", () => { settingsDirty = true; });
$("tab-settings").addEventListener("change", (evt) => {
  settingsDirty = true;
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
    settingsDirty = true;
    renderSettings();
    renderSlots();
  } catch (err) {
    $("catalog-note").textContent = err.message;
  }
};
$("btn-add-repo").onclick = async () => {
  await api("/api/projects/add", { repo: $("add-repo").value.trim() });
  refresh();
  renderRepos();
};
$("btn-create-repo").onclick = async () => {
  await api("/api/projects/create", { name: $("new-repo").value.trim() });
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
        await api("/api/hide", { project: b.dataset.hide });
        refresh();
        renderRepos();
      };
    });
    box.querySelectorAll("[data-archive]").forEach((b) => {
      b.onclick = async () => {
        if (!confirm(`Архивировать ${b.dataset.archive} на GitHub? Репо не удаляется.`)) return;
        await api("/api/archive", { project: b.dataset.archive });
        refresh();
        renderRepos();
      };
    });
    box.querySelectorAll("[data-add]").forEach((b) => {
      b.onclick = async () => {
        await api("/api/projects/add", { repo: b.dataset.add });
        refresh();
        renderRepos();
      };
    });
    box.querySelectorAll("[data-unarchive]").forEach((b) => {
      b.onclick = async () => {
        if (!confirm(`Разархивировать ${b.dataset.unarchive} и вернуть на доску?`)) return;
        await api("/api/unarchive", { repo: b.dataset.unarchive });
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
  await api("/api/settings", { profiles, max_parallel: Number($("max-parallel").value), slots });
  settingsDirty = false;
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
  const data = await api(`/api/console?project=${encodeURIComponent(pick)}`);
  $("console").textContent = data.pane || data.log || "пусто";
  const live = data.live || [];
  const names = [...new Set([...pinNames(), ...live, ...(isPin(f) ? [f, `orch:${f}`] : [])])];
  $("console-project").innerHTML = `<option value="">лог</option>` + names.map((p) =>
    `<option value="${escapeHtml(p)}" ${p === pick ? "selected" : ""}>${escapeHtml(liveLabel(p))}</option>`
  ).join("");
}

async function refresh() {
  if (refreshBusy) return;
  refreshBusy = true;
  try {
    const [board, settings, mapped] = await Promise.all([
      api("/api/board"),
      api("/api/settings"),
      api("/api/map"),
    ]);
    const keepProfiles = settingsDirty ? state.profiles : settings.profiles;
    const keepSlots = settingsDirty ? state.slots : settings.slots;
    state = { ...state, ...board, ...settings, profiles: keepProfiles, slots: keepSlots };
    if (!settingsDirty) state.catalog = settings.catalog || state.catalog;
    renderFilters();
    const running = (mapped.live || [])[0];
    const researching = (mapped.orch || [])[0];
    const q = (settings.queue || []).filter((i) => i.status === "waiting").length;
    $("strip").innerHTML = running
      ? `<i class="pulse"></i><b>VPS · ${escapeHtml(running)}${q ? ` · очередь ${q}` : ""}</b>`
      : researching
        ? `<i class="pulse"></i><b>orch · ${escapeHtml(researching)}</b>`
        : `<i class="pulse"></i><b>${settings.queue_running ? `автоном · ждут ${q}` : "тихо"}</b>`;
    renderBoard();
    renderAuto();
    renderMap(mapped);
    if (!settingsDirty) {
      renderSlots();
      renderSettings();
    }
    if ($("tab-console").classList.contains("on")) pollConsole();
    if ($("tab-project").classList.contains("on")) renderProject();
    if ($("tab-graphs").classList.contains("on")) renderGraphs();
  } catch (err) {
    if (String(err.message).includes("passkey")) {
      $("app").classList.add("hidden");
      $("gate").classList.remove("hidden");
    }
  } finally {
    refreshBusy = false;
  }
}

boot();
setInterval(() => { if (!$("app").classList.contains("hidden")) refresh(); }, 15000);
