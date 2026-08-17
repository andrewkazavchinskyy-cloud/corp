# Workshop operating contract

Locked 2026-08-15. Implementation Issues: corp#3–#12.

## Membership

One pin list. Start: **corp**, **clarity**. Inside a pin: all issues.
Other org repos stay in `registry.json`. Board, `cycle`, autonomous, and
orchestrator ignore them. Escape: `corp take owner/repo#n` on the Mac mini.

`workshop: true` on a registry project is the pin.

## Add existing

Only `andrewkazavchinskyy-cloud`. VPS clones to `/home/corp/projects/<name>`
(or `$CORP_WORKSPACE`). Mac mini clones on next `bootstrap`/`pull`.
Never write iCloud from the VPS.

## Create new

Private, `main`. Seed a stranger can run: `docs/SPEC.md` stub (goal,
non-goals, first slice), `AGENTS.md` that finds corp by clone URL
(`gh repo clone andrewkazavchinskyy-cloud/corp`, not iCloud paths),
optional `memory/sessions/`. Workspace path is documented
(`$CORP_WORKSPACE` or the checkout folder). Labels: ready, blocked,
in-progress, self, queued, P0–P2, via:*, design, qa. No first issue.
Graphify after first close. Pin immediately.

## Remove

- Hide: unpin. GitHub stays live.
- Archive product: confirm, `gh repo archive`, unpin.
- Reverse: unarchive + Add. Never delete a repo.

## Access

Settings: add another Passkey while logged in. Logout ends this session.
Выйти везде revokes every session. Recovery-token enroll does the same.
Sessions last 7 days from create; WebAuthn challenges last 5 minutes.
Expired rows are deleted server-side. Cookie max-age matches the session.
Origin is an exact scheme+host+port match. `X-Forwarded-Proto` is trusted
only from loopback (Tailscale Serve). Extra origins: `CORP_WORKSHOP_ORIGINS`.
Lost phone or a new device without a session: `corp workshop-token` on the
VPS, then register a new Passkey on the gate. Existing keys stay.
Sheet: close, ready, backlog, and drop `self` on phone and desktop.
Drag to in-progress is not a move — take or run from the sheet.
Desktop drag uses vendored Sortable in `workshop/static/vendor`. Phone stays
sheet-only. Journal (Ещё): last 7 `memory/sessions/*.md` for the current pin,
plus the in-app event list from `~/.config/corp/workshop-events.jsonl`.

`corp doctor` is fail-closed and does not repair: workshop unit, `/opt/corp`
dirty/behind `origin/main`, the SHA uvicorn should serve, graphify on PATH,
`workshop.db` mode 0600, Tailscale Serve with Funnel off, cursor via
`kind_cli_ok` (not `have("agent")`), isolated vs transitional. Map and
Настройки show the same NOs. Local `corp cycle` without `gh` auth prints
doctor and `run gh auth login` instead of dying first.

## Filter

Header: All / each pin. One choice for Board, Autopilot, Project, Console.
Cookie remembers last choice. First visit = All. Settings and login ignore it.
Orchestrator with All: pick one project first.
Typeahead search filters cards, drafts, and pin chips (title, `repo#n`, project).
Deep-link `?issue=org/repo#n` opens that card on the board.

## Model catalog

Source: binaries on the machine that runs the workshop (VPS).
Probe on Settings open and Refresh. Cache last success. Failure shows stale
cache. Do not invent model names. Missing binary: grey, not selectable.

## Slots

Per pin: Orchestrator, Build, Design, QA. Design/QA default to Build.

## Project tab

Derived stage plus a research snapshot without live orch: SPEC/PRD
present?, gap нет/частично/есть, top unshipped SPEC bullets (or file
presence + open non-ready), dirty/unpushed, graph age. Button
«Разобрать», live research log, detailed drafts, Approve/Skip. Do not
auto-Approve. Map stays infra. Overlay warning: uncommitted registry.

## Graphs

Tab «Графы»: graphify for every cloned project. All = constellation of
orbs. One project = communities, hubs, god-nodes. Not a vis.js dump.
Map stays the server contour.

## Orchestrator

Manual + auto-suggest when the repo has no open ready/in-progress.
Read-only. May run beside a writer. No git writes. Reads the project
PRD/SPEC, what is already shipped, and open issues. Drafts are **new**
follow-ups for spec work that is not shipped and not already a card.
On **corp** (the workshop): also draft functional expansion and maximum
UI/UX of the live app. `workshop/preview.html` is a reference, not a dump.
No spec → one draft «написать SPEC». No new product. GitHub only after
Approve. Batch Approve (selected / all visible) only in the workshop; Skip
stays per card. Drafts: 7 days.
While it runs, the Project tab shows research status and the live log.
Drafts include body, why, vs PRD, and vs open issues for Approve/Skip.

## Design / QA

Every card, VPS or local, goes **build or design → QA → Done**.
Build and design must not close. After they push, the card moves to the
QA column (`in-qa` label). QA pass closes the issue (Done + graphify).
QA fail: `ready` + `qa-fail`, comment with fixes, automatic rework, then
QA again. Design is the same gate. Board columns:
backlog · ready · ход · QA · done.
Drag to Done from ready/ход sends the card to QA, not close.

## Telegram

Remote control + pager. One chat_id allowlist. Russian chrome. English only for
product names (Claude, GitHub) and issue titles.
`/abort` and `queue_abort` no-op unless that issue is in the queue. They
do not kill another pin's runner. Pulse, `last_error`, and need-human
redact token-like substrings. Isolation `transitional` is not an outage.

Home is four jobs: **Сейчас · Доска · Цикл · Ещё**. `/start` and the persistent
keyboard (or Menu Button) open that home. Slash menu is at most six commands:
`/start` домой, `/сейчас` пульс, `/доска` карточки, `/цикл` команда QA/PM/дизайн,
`/пауза` стоп очереди, `/помощь` один экран. Old aliases (`/status` `/queue`
`/running` `/doctor` `/go` `/abort` `/improve` `/help`, Старт, Автоном)
still work and map into those four jobs. They are hidden from the command menu.

- Сейчас: очередь, кто пишет, цикл, последняя ошибка (redacted), одна строка «дальше».
- Доска: до пяти карточек. Кнопки: открыть / я сам / в очередь / на QA.
  На колонке QA: QA прошёл / QA не принял (непринятие просит заметку).
- Цикл: одно подтверждение Да/Нет, затем прогресс, не список команд.
- Ещё: пауза или продолжить автоном (продолжить — Да/Нет), откатить карточку
  в очереди, стоп цикла, помощь, открыть мастерскую. Черновики: Принять / Пропустить.

Dangerous actions (цикл, откатить, продолжить автоном, стоп цикла) ask Да / Нет.
`QA прошёл` closes only when the card is in the QA column. Otherwise the bot
says so and offers «На QA». Готово = колонка `ready`, not closed.

Immediate cards: start, closed, failed, hung, retry, drafts, need-human.
Shape: what happened + what to do next. Pulse every 15 minutes only if the log
changed. Dedup identical events.

Mini App lives at Workshop `/tg` (alias `/mini`): Telegram WebView chrome
(`telegram-web-app.js`, themeParams, MainButton, safe-area). Not a dump of
`preview.html`. Menu Button `web_app` is the Tailscale `/tg` URL only if
Telegram accepts it. If not, Menu Button stays `commands`. Do not enable Funnel.
If the WebView has a Passkey session, the shell can read the board; otherwise
it deep-links jobs back to the bot (`?start=now|board|cycle|more`).

`/цикл` and `/improve` (same) start a council after confirm: three Grok agents
(QA, PM, Design) file up to 3 Issues each (`council` + role), then the existing
queue takes them on Grok. After a council writer succeeds, automated Grok QA
reviews the diff vs `origin/main`. Pass → ff-merge to `main` and additive deploy
of `/opt/corp` + writers. Fail → `qa-fail`, no merge. Human QA buttons stay for
non-council cards. This command is an explicit auto-take exception to
«research writes drafts only». Автоном **Команда** hits the same
`corp council` / `POST /api/council`. Scope is the current pin if it is a real
project, else corp. Cap 9. Dedup open issues + drafts.
«Остановить цикл» kills `corp-council-*` tmux after confirm. `/abort` of a
queued card still does not kill another pin's runner.

## Autopilot

Three steps on the Автоном tab: propose a draft (not GitHub), Approve, then
queue + start. Per-card profile when enqueueing many. Failed/hung cards show
the error, Restart, Rollback (kill tmux, labels back to ready), Console.
Pause shows **Продолжить** (resume the queue, not a new enqueue).
`waiting` with an error has Restart. Stuck `in-qa` cards appear on Автоном.
`wait_tmux` ending is not success unless QA closed the Issue. A live tmux
past the hung timeout is killed, the queue stops, and the human is paged.
Reap recovers `running` without tmux and `done` that left the card open.
Agent crashes requeue themselves with the error on the card and in Telegram.
After the retry cap the queue stops and pages the human. Need-human also for
GitHub/auth/self/CLI.

Local E2E (no paid agent, no live P0): `corp queue e2e` writes a throwaway
`workshop.json`, proposes a draft, approves it locally, reaps a hung
runner, then rollbacks. It must not set `queue_running` or call `gh`.
Manual VPS checklist, only on a sandbox card: propose → Approve → queue →
kill that pin's tmux → see retry → Rollback. Never point this at a live P0.

## Locks

One writing runner per repo. Orchestrator may run in parallel.
`self` blocks VPS writers and orchestrator. Different pins may run in parallel.
