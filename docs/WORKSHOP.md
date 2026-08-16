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

Private, `main`. README + short AGENTS.md pointing at corp. Labels:
ready, blocked, in-progress, self, queued, P0–P2, via:*, design, qa.
No first issue. Graphify after first close. Pin immediately.

## Remove

- Hide: unpin. GitHub stays live.
- Archive product: confirm, `gh repo archive`, unpin.
- Reverse: unarchive + Add. Never delete a repo.

## Access

Settings: add another Passkey while logged in. Logout ends the session.
Lost phone or a new device without a session: `corp workshop-token` on the
VPS, then register a new Passkey on the gate. Existing keys stay.
Sheet: close, ready, backlog, and drop `self` on phone and desktop.
Drag to in-progress is not a move — take or run from the sheet.

## Filter

Header: All / each pin. One choice for Board, Autopilot, Project, Console.
Cookie remembers last choice. First visit = All. Settings and login ignore it.
Orchestrator with All: pick one project first.

## Model catalog

Source: binaries on the machine that runs the workshop (VPS).
Probe on Settings open and Refresh. Cache last success. Failure shows stale
cache. Do not invent model names. Missing binary: grey, not selectable.

## Slots

Per pin: Orchestrator, Build, Design, QA. Design/QA default to Build.

## Project tab

Derived stage only (SPEC?, open/ready/P0, in-progress, graph age).
Button «Разобрать», live research log, detailed drafts, Approve/Skip.
Map stays infra.

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
Approve. Batch Approve only in the workshop. Drafts: 7 days.
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

Automatic runs only. One chat_id. Immediate: start, closed, failed, incomplete,
hung, retry, N drafts, and «нужно твоё действие» (GitHub/auth/pin/CLI).
Pulse every 15 minutes: `repo#n · minutes · model` + 3 log lines ≤200 chars.
Buttons: Approve/Skip drafts; Перезапустить / Откатить / Снять a queue card.
Commands: /start /status /queue /running /doctor /board /drafts /go /pause
/retry #n /abort #n. Persistent reply keyboard: Сейчас, Очередь, Бежит,
Сервер, Доска, Черновики, Автоном, Пауза. Aliases work as typed text.
Workshop duplicates those actions.

## Autopilot

Three steps on the Автоном tab: propose a draft (not GitHub), Approve, then
queue + start. Per-card profile when enqueueing many. Failed/hung cards show
the error, Restart, Rollback (kill tmux, labels back to ready), Console.
`wait_tmux` ending is not success unless QA closed the Issue. Reap recovers
`running` without tmux and `done` that left the card open. Agent crashes
requeue themselves with the error on the card and in Telegram. After the
retry cap, a 10-minute pause, then another try. Need-human only for
GitHub/auth/self/CLI.

## Locks

One writing runner per repo. Orchestrator may run in parallel.
`self` blocks VPS writers and orchestrator. Different pins may run in parallel.
