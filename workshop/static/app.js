const $ = (id) => document.getElementById(id);
const titles = {
  board: ["Доска", "GitHub Issues"],
  auto: ["Автоном", "Очередь VPS"],
  project: ["Проект", "Этап"],
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

function cookieGet(name) {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
}
function cookieSet(name, value) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
}
function currentFilter() {
  return cookieGet(FILTER_KEY) || localStorage.getItem(FILTER_KEY) || "all";
}
function setFilter(value) {
  cookieSet(FILTER_KEY, value);
  localStorage.setItem(FILTER_KEY, value);
  lastBoardKey = "";
  renderFilters();
  renderBoard();
  renderAuto();
  if ($("tab-project").classList.contains("on")) renderProject();
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

function visibleCards() {
  const f = currentFilter();
  if (f === "all") return state.cards || [];
  if (f === "p0") return (state.cards || []).filter((c) => (c.labels || []).some((l) => l.name === "P0"));
  if (f === "me") return (state.cards || []).filter((c) => c.runner === "self");
  return (state.cards || []).filter((c) => c.project === f);
}

function renderFilters() {
  const pins = state.pins || [];
  const cur = currentFilter();
  const chips = [["all", "Все"], ...pins.map((p) => [p.name, p.name]), ["p0", "P0"], ["me", "Мои"]];
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
  if (name === "console") pollConsole();
  if (name === "project") renderProject();
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
  $("board").querySelectorAll(".lane").forEach((lane) => {
    Sortable.create(lane, {
      group: "board",
      animation: 150,
      onEnd: async (evt) => {
        const issue = evt.item.dataset.issue;
        const column = evt.to.dataset.col;
        lastBoardKey = "";
        if (column === "in-progress") {
          openSheet(issue);
          refresh();
          return;
        }
        try {
          if (column === "done") await api("/api/close", { issue });
          else await api("/api/move", { issue, column });
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

function openSheet(issue) {
  const card = state.cards.find((c) => issueRef(c) === issue);
  if (!card) return;
  sheetIssue = issue;
  $("sheet-title").textContent = `${card.project} #${card.number}`;
  $("sheet-note").textContent = card.title || "";
  fillProfiles($("sheet-profile"));
  $("sheet").classList.remove("hidden");
  $("scrim").classList.remove("hidden");
}

function closeSheet() {
  $("sheet").classList.add("hidden");
  $("scrim").classList.add("hidden");
}

$("sheet-cancel").onclick = closeSheet;
$("scrim").onclick = closeSheet;
$("sheet-self").onclick = async () => {
  try {
    await api("/api/take", { issue: sheetIssue });
    closeSheet();
    lastBoardKey = "";
    refresh();
  } catch (err) { alert(err.message); }
};
$("sheet-run").onclick = async () => {
  try {
    await api("/api/run", { issue: sheetIssue, profile: $("sheet-profile").value });
    closeSheet();
    lastBoardKey = "";
    refresh();
  } catch (err) { alert(err.message); }
};

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

function renderMap(data) {
  const checks = (data.doctor?.checks || []).map((c) => `<li>${c.ok ? "ok" : "нет"} ${escapeHtml(c.name)}</li>`).join("");
  const projects = (data.projects || []).map((p) =>
    `<li>${escapeHtml(p.name)} — ${p.graphify ? "граф есть" : "графа нет"} — ${escapeHtml(p.cwd || "не клонирован")}</li>`
  ).join("");
  const live = (data.live || []).join(", ") || "тихо";
  $("map").innerHTML = `
    <article><h2>Контур</h2><p class="meta">corp в /opt/corp · проекты в /home/corp/projects · GitHub Issues · Tailscale</p>
      <ul>${checks}</ul></article>
    <article><h2>Сейчас</h2><p>VPS: ${escapeHtml(live)}</p>
      <p>Автоном: ${data.queue_running ? "идёт" : "пауза"}</p></article>
    <article><h2>Проекты</h2><ul>${projects}</ul></article>`;
}

async function renderProject() {
  const name = currentFilter();
  if (name === "all" || name === "p0" || name === "me") {
    $("project-box").innerHTML = '<p class="meta">Выберите проект в шапке</p>';
    return;
  }
  try {
    const data = await api(`/api/project?name=${encodeURIComponent(name)}`);
    const s = data.stage || {};
    const drafts = data.drafts || [];
    $("project-box").innerHTML = `
      <article class="card"><h3>${escapeHtml(s.stage || "")}</h3>
        <p class="meta">open ${s.open || 0} · ready ${s.ready || 0} · P0 ${s.p0 || 0} · ход ${s.in_progress || 0}</p>
        <p class="meta">граф ${escapeHtml(s.graph_age || "нет")} · ${(s.docs || []).join(", ") || "нет спеки"}</p>
        <button class="btn" data-hide="${name}">Скрыть</button>
        <button class="btn" data-archive="${name}">Архивировать продукт</button>
      </article>
      ${drafts.map((d) => `<article class="card"><h3>${escapeHtml(d.title)}</h3>
        <p class="meta">${escapeHtml(d.label)} · ${escapeHtml(d.kind)}</p>
        <button class="btn primary" data-approve="${d.id}">Approve</button>
        <button class="btn" data-skip="${d.id}">Skip</button></article>`).join("") || '<p class="meta">Черновиков нет</p>'}`;
    $("project-box").querySelectorAll("[data-approve]").forEach((b) => {
      b.onclick = async () => { await api("/api/draft", { id: b.dataset.approve, action: "approve" }); renderProject(); };
    });
    $("project-box").querySelectorAll("[data-skip]").forEach((b) => {
      b.onclick = async () => { await api("/api/draft", { id: b.dataset.skip, action: "skip" }); renderProject(); };
    });
    $("project-box").querySelectorAll("[data-hide]").forEach((b) => {
      b.onclick = async () => { await api("/api/hide", { project: b.dataset.hide }); refresh(); };
    });
    $("project-box").querySelectorAll("[data-archive]").forEach((b) => {
      b.onclick = async () => {
        if (!confirm("Архивировать репо на GitHub?")) return;
        await api("/api/archive", { project: b.dataset.archive });
        refresh();
      };
    });
  } catch (err) {
    $("project-box").innerHTML = `<p class="err">${escapeHtml(err.message)}</p>`;
  }
}

$("orch-run").onclick = async () => {
  const name = currentFilter();
  if (name === "all" || name === "p0" || name === "me") return alert("Сначала выберите проект");
  await api("/api/orchestrate", { project: name });
  alert("Оркестратор запущен");
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
  const models = catalogKind(kind).models || [];
  const attrs = slot ? `data-slot="${slot}" data-role="${role}"` : "";
  const select = `<select ${attrs} data-k="model">
            <option value="">auto</option>
            ${optionList(models, selected, selected)}
          </select>`;
  if (models.length) return select;
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
};
$("btn-create-repo").onclick = async () => {
  await api("/api/projects/create", { name: $("new-repo").value.trim() });
  refresh();
};

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

async function pollConsole() {
  const project = $("console-project").value;
  const data = await api(`/api/console?project=${encodeURIComponent(project)}`);
  $("console").textContent = data.pane || data.log || "пусто";
  const live = data.live || [];
  if ($("console-project").options.length !== live.length + 1) {
    $("console-project").innerHTML = `<option value="">лог</option>` + live.map((p) => `<option>${escapeHtml(p)}</option>`).join("");
  }
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
    const q = (settings.queue || []).filter((i) => i.status === "waiting").length;
    $("strip").innerHTML = running
      ? `<i class="pulse"></i><b>VPS · ${escapeHtml(running)}${q ? ` · очередь ${q}` : ""}</b>`
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
