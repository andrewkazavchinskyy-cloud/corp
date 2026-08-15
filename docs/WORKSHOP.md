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
Button «Разобрать», drafts, Approve/Skip. Map stays infra.

## Orchestrator

Manual + auto-suggest when the repo has no open ready/in-progress.
Read-only. May run beside a writer. No git writes. Gaps vs
SPEC/PRD/SHIP/roadmap/issues/graph only. No spec → one draft «написать SPEC».
GitHub only after Approve. Batch Approve only in the workshop. Drafts: 7 days.

## Design / QA

`design`: preview/docs only, does not close.
`qa`: opt-in. qa-ok → `corp close` + graphify. qa-fail → ready+qa-fail.
No `qa` label: Build closes as today.

## Telegram

Automatic runs only. One chat_id. Immediate: start, closed, failed, N drafts.
Pulse every 15 minutes: `repo#n · minutes · model` + 3 log lines ≤200 chars.
Approve/Skip one issue per tap. Workshop duplicates Approve.

## Locks

One writing runner per repo. Orchestrator may run in parallel.
`self` blocks VPS writers and orchestrator. Different pins may run in parallel.
