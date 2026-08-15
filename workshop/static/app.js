const $ = (id) => document.getElementById(id);
const titles = {
  board: ["Доска", "Задачи"],
  auto: ["Автоном", "Очередь VPS"],
  project: ["Проект", "Этап"],
  map: ["Карта", "Сервер"],
  console: ["Консоль", "Агенты"],
  settings: ["Настройки", "Слоты и CLI"],
};

let state = { cards: [], projects: [], profiles: [], queue: [], queue_running: false, pins: [], slots: {}, catalog: {} };
const FILTER_KEY = "corp_project";
let sheetIssue = "";

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

function currentFilter() {
  return localStorage.getItem(FILTER_KEY) || "all";
}

function visibleCards() {
  const f = currentFilter();
  if (f === "all") return state.cards || [];
  return (state.cards || []).filter((c) => c.project === f);
}

function fillFilter() {
  const pins = state.pins || [];
  const cur = currentFilter();
  $("project-filter").innerHTML = `<option value="all">Все</option>` + pins.map((p) =>
    `<option value="${p.name}" ${p.name === cur ? "selected" : ""}>${p.name}</option>`
  ).join("");
}

function setTab(name) {
  document.querySelectorAll(".tab").forEach((el) => el.classList.toggle("on", el.id === `tab-${name}`));
  document.querySelectorAll("[data-tab]").forEach((el) => el.classList.toggle("on", el.dataset.tab === name));
  $("page-kicker").textContent = titles[name][0];
  $("page-title").textContent = titles[name][1];
  if (name === "console") pollConsole();
  if (name === "project") renderProject();
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
  else if (card.runner && card.runner !== "queued") bits.push(`<span class="badge vps">VPS · ${card.runner}</span>`);
  (card.labels || []).forEach((l) => {
    if (["P0", "P1", "P2"].includes(l.name)) bits.push(`<span class="badge">${l.name}</span>`);
  });
  return bits.join("");
}

function cardHtml(card) {
  return `<article class="card" data-issue="${issueRef(card)}" data-col="${card.column}">
    <header><span>${card.project}</span><span>#${card.number}</span></header>
    <h3>${escapeHtml(card.title || "")}</h3>
    <div class="badges">${badge(card)}</div>
  </article>`;
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function renderBoard() {
  const cols = [
    ["backlog", "Backlog"],
    ["ready", "Ready"],
    ["in-progress", "In Progress"],
    ["done", "Done"],
  ];
  $("board").innerHTML = cols.map(([id, label]) => {
    const cards = visibleCards().filter((c) => c.column === id);
    return `<div class="col-wrap"><h2>${label} <span class="count">${cards.length}</span></h2>
      <div class="lane" data-col="${id}">${cards.map(cardHtml).join("")}</div></div>`;
  }).join("");
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

function fillProfiles(select, selected) {
  select.innerHTML = state.profiles.map((p) =>
    `<option value="${p.id}" ${p.id === selected ? "selected" : ""}>${escapeHtml(p.label || p.id)} · ${escapeHtml(p.model || p.kind)}</option>`
  ).join("");
}

function openSheet(issue) {
  const card = state.cards.find((c) => issueRef(c) === issue);
  if (!card) return;
  sheetIssue = issue;
  $("sheet-title").textContent = `${card.project} #${card.number}`;
  fillProfiles($("sheet-profile"));
  $("sheet").classList.remove("hidden");
}

$("sheet-cancel").onclick = () => $("sheet").classList.add("hidden");
$("sheet-self").onclick = async () => {
  try {
    await api("/api/take", { issue: sheetIssue });
    $("sheet").classList.add("hidden");
    refresh();
  } catch (err) { alert(err.message); }
};
$("sheet-run").onclick = async () => {
  try {
    await api("/api/run", { issue: sheetIssue, profile: $("sheet-profile").value });
    $("sheet").classList.add("hidden");
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
    `<article class="card"><header><span>${q.project}</span><span>${q.status}</span></header>
      <h3>#${q.issue} ${escapeHtml(q.title || "")}</h3>
      <p class="meta">${q.profile}</p>
      ${q.status === "waiting" ? `<button data-rm="${q.repo}#${q.issue}">Убрать</button>` : ""}</article>`
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
  const checks = (data.doctor?.checks || []).map((c) => `<li>${c.ok ? "ok" : "нет"} ${c.name}</li>`).join("");
  const projects = (data.projects || []).map((p) =>
    `<li>${p.name} — ${p.graphify ? "граф есть" : "графа нет"} — ${p.cwd || "не клонирован"}</li>`
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
  if (name === "all") {
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
        <button data-hide="${name}">Скрыть</button>
        <button data-archive="${name}">Архивировать продукт</button>
      </article>
      ${drafts.map((d) => `<article class="card"><h3>${escapeHtml(d.title)}</h3>
        <p class="meta">${d.label} · ${d.kind}</p>
        <button data-approve="${d.id}">Approve</button>
        <button data-skip="${d.id}">Skip</button></article>`).join("") || '<p class="meta">Черновиков нет</p>'}`;
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
  if (name === "all") return alert("Сначала выберите проект");
  await api("/api/orchestrate", { project: name });
  alert("Оркестратор запущен");
};

$("project-filter").onchange = () => {
  localStorage.setItem(FILTER_KEY, $("project-filter").value);
  renderBoard();
  renderAuto();
  if ($("tab-project").classList.contains("on")) renderProject();
};

function renderSettings() {
  $("max-parallel").value = state.max_parallel || 3;
  $("profiles").innerHTML = state.profiles.map((p, i) => `
    <article class="card" data-i="${i}">
      <div class="split">
        <label>Имя <input data-k="label" value="${escapeHtml(p.label || "")}"></label>
        <label>Адаптер
          <select data-k="kind">
            ${["claude", "codex", "grok", "cursor"].map((k) =>
              `<option ${p.kind === k ? "selected" : ""}>${k}</option>`).join("")}
          </select>
        </label>
        <label>Модель <input data-k="model" value="${escapeHtml(p.model || "")}"></label>
        <label>Effort <input data-k="effort" value="${escapeHtml(p.effort || "")}"></label>
        <label>Fast <input data-k="fast" type="checkbox" ${p.fast ? "checked" : ""}></label>
      </div>
    </article>`).join("");
}

$("add-profile").onclick = () => {
  state.profiles.push({ id: `p${Date.now()}`, kind: "claude", label: "Новая", model: "sonnet", effort: "high", fast: false });
  renderSettings();
};
function renderSlots() {
  const pins = state.pins || [];
  const catalog = (state.catalog && state.catalog.kinds) || {};
  $("slots").innerHTML = pins.map((p) => {
    const slots = (state.slots || {})[p.name] || {};
    return `<article class="card"><h3>${p.name}</h3>${["orchestrator", "build", "design", "qa"].map((role) => {
      const s = slots[role] || {};
      const kind = catalog[s.kind] || catalog.claude || {};
      const models = kind.models || [];
      const efforts = kind.efforts || [];
      return `<label>${role}
        <select data-slot="${p.name}" data-role="${role}" data-k="kind">
          ${["claude", "codex", "grok", "cursor"].map((k) =>
            `<option ${s.kind === k ? "selected" : ""} ${catalog[k] && !catalog[k].installed ? "disabled" : ""}>${k}</option>`).join("")}
        </select>
        <select data-slot="${p.name}" data-role="${role}" data-k="model">
          <option value="">auto</option>
          ${models.map((m) => `<option ${s.model === m ? "selected" : ""}>${m}</option>`).join("")}
        </select>
        ${efforts.length ? `<select data-slot="${p.name}" data-role="${role}" data-k="effort">
          ${efforts.map((e) => `<option ${s.effort === e ? "selected" : ""}>${e}</option>`).join("")}
        </select>` : ""}
        ${kind.fast ? `<label>Fast <input type="checkbox" data-slot="${p.name}" data-role="${role}" data-k="fast" ${s.fast ? "checked" : ""}></label>` : ""}
      </label>`;
    }).join("")}</article>`;
  }).join("");
}

$("refresh-catalog").onclick = async () => {
  state.catalog = await api("/api/catalog", {});
  renderSlots();
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
  const profiles = [...$("profiles").children].map((card, i) => {
    const prev = state.profiles[i];
    const get = (k) => card.querySelector(`[data-k="${k}"]`);
    return {
      id: prev.id,
      kind: get("kind").value,
      label: get("label").value,
      model: get("model").value,
      effort: get("effort").value,
      fast: get("fast").checked,
    };
  });
  const slots = {};
  document.querySelectorAll("#slots [data-slot]").forEach((el) => {
    const name = el.dataset.slot;
    const role = el.dataset.role;
    slots[name] = slots[name] || {};
    slots[name][role] = slots[name][role] || { kind: "claude", model: "", effort: "high", fast: false };
    if (el.dataset.k === "fast") slots[name][role].fast = el.checked;
    else slots[name][role][el.dataset.k] = el.value;
  });
  await api("/api/settings", { profiles, max_parallel: Number($("max-parallel").value), slots });
  refresh();
};

async function pollConsole() {
  const project = $("console-project").value;
  const data = await api(`/api/console?project=${encodeURIComponent(project)}`);
  $("console").textContent = data.pane || data.log || "пусто";
  const live = data.live || [];
  if ($("console-project").options.length !== live.length + 1) {
    $("console-project").innerHTML = `<option value="">лог</option>` + live.map((p) => `<option>${p}</option>`).join("");
  }
}

async function refresh() {
  try {
    const [board, settings, mapped] = await Promise.all([
      api("/api/board"),
      api("/api/settings"),
      api("/api/map"),
    ]);
    state = { ...state, ...board, ...settings };
    fillFilter();
    renderSlots();
    const running = (mapped.live || [])[0];
    const q = (settings.queue || []).filter((i) => i.status === "waiting").length;
    $("strip").textContent = running
      ? `VPS · ${running}` + (q ? ` · очередь ${q}` : "")
      : (settings.queue_running ? `автоном · ждут ${q}` : "тихо");
    renderBoard();
    renderAuto();
    renderMap(mapped);
    renderSettings();
    if (!$("tab-console").classList.contains("on")) return;
    pollConsole();
  } catch (err) {
    if (String(err.message).includes("passkey")) {
      $("app").classList.add("hidden");
      $("gate").classList.remove("hidden");
    }
  }
}

boot();
setInterval(() => { if (!$("app").classList.contains("hidden")) refresh(); }, 15000);
