# Corporation OS — SPEC

Minimal product spec for **corp**: a transferable operating system for one
operator's software projects. Not a company, not a SaaS.

`project_stage` and the research loop look here first
(`docs/SPEC.md`, then `docs/PRD.md`). If this file is missing, stage is
«нет спеки» and the orchestrator drafts one card: «написать SPEC».

Locked operating details live in [`HARNESS.md`](../HARNESS.md),
[`docs/WORKSHOP.md`](WORKSHOP.md), [`SERVER.md`](../SERVER.md), and
[`docs/HANDOFF.md`](HANDOFF.md). This file is the north star those
contracts implement.

## Who this is for

- **One operator** today. They hold the GitHub org, the Tailscale tailnet,
  and the first Passkey. They work from a Mac (Cursor / Codex / Claude /
  Grok) and from a phone through the workshop.
- **A second human later.** Handoff means that person can reach the same
  workshop on the same tailnet, add their own Passkey, and run a sandbox
  job without being given secrets from git. It does not mean a second
  tenant, a second company, or a shared inbox of credentials.
- **Agents** (any tool that can run a shell and `gh`) follow `AGENTS.md`
  and `HARNESS.md` after clone. They do not invent a new product.

Access is Tailscale + Passkey only. See [Handoff](#handoff).

## What the product is

A portable control plane in one Git repo:

| Piece | Job |
| ----- | --- |
| GitHub Issues | Planner and board. Source of truth. |
| `registry.json` | Every org project the corporation knows. |
| Pins (`workshop: true`) | The short list the board, `cycle`, Автоном, and orchestrator see. |
| Workshop | Phone/desktop remote on the VPS. Does not store the backlog. |
| `bin/corp` | Cycle, take, run, queue, doctor, workshop-token. |
| Graphify | Per-repo map, refreshed after an Issue is closed. |

Work happens on two machines: the Mac (interactive, `self`) and the VPS
(unattended CLI + Автоном). Telegram is status and short remote control,
not the board.

## Pins vs registry

- **Registry** lists every project (`status: active` or `paused`).
- **Pin** is `workshop: true` on a registry row. Start: **corp**, **clarity**.
- Board, `cycle`, Автоном, and orchestrator **ignore unpinned** repos.
- Escape hatch: `corp take owner/repo#n` on the Mac, even if unpinned.
- Hide = unpin. Archive = `gh repo archive` + unpin. Never delete a repo.

## Planner

GitHub Issues are the planner because `gh` works on every device and every
agent subscription. Linear / Jira may mirror later. They are not required.

| Label | Meaning |
| ----- | ------- |
| `ready` | Specified. May be taken. |
| `queued` | In the VPS Автоном queue. `cycle` skips. |
| `in-progress` + `self` | Human or interactive agent. VPS must not start it. |
| `in-progress` + `via:*` | VPS writer. |
| `in-qa` | After build/design. QA closes on pass. |
| `qa-fail` | QA sent the card back to `ready`. |
| `blocked` | Skip until the blocker is named. |
| `P0` `P1` `P2` | Priority. |

## Lifecycle

Every card, local or VPS:

**draft → approve → queue → build/design → QA → done**

1. **Draft.** Orchestrator (read-only) or Автоном «предложить» writes a
   draft **outside GitHub**. No spec → one draft «написать SPEC». Drafts
   die after 7 days.
2. **Approve.** A human (workshop or Telegram) turns a draft into a
   GitHub Issue. Batch Approve only in the workshop. Skip discards.
3. **Queue.** Автоном or `corp queue add` labels `ready` + `queued` and
   may start a writer. One writing runner per pin. `self` blocks VPS
   writers. Different pins may run in parallel (max 3).
4. **Build / design.** Push, then move to QA (`in-qa`). They must not
   close the Issue.
5. **QA.** Pass = Done + `graphify update`. Fail = `ready` + `qa-fail`
   and a fix comment. Drag to Done from ready/ход also goes to QA, not
   close.

Автоном is three steps on that tab: propose (not GitHub) → Approve →
queue + start. It is not «open SSH and run Cursor on the VPS».

First live job for a new person or a new machine is a **disposable
sandbox** card, never a live P0. Local `corp queue e2e` is a fixture; it
does not file Issues or start the real queue.

## Handoff

Handoff is operational, not corporate:

1. Join the tailnet. Hostname:
   `https://vmi3510874.tailad6484.ts.net` (do not rename; Passkeys bind
   to it). No Funnel.
2. First device: `corp workshop-token` on the VPS, then register a
   Passkey on the gate. Later devices: add a Passkey in **Настройки**
   while logged in (does not kick other sessions). Recover-token enroll
   **does** revoke every session.
3. SSH is `root` via the local machine key (`ssh corp-vps`). Do not put
   keys, tokens, or `.env` in git.
4. First job = sandbox, not P0. See [`docs/HANDOFF.md`](HANDOFF.md).

Two trees on the VPS — do not mix them:

| Tree | Who | What |
| ---- | --- | ---- |
| `/opt/corp` | uvicorn + `/usr/local/bin/corp` | Live workshop. Deploy additively (`git pull --ff-only`, restart unit). |
| `/home/corp/projects/corp` | Writing agents | Checkout they edit. `CORP_WORKSPACE`. |

## UI north star

Phone dock and the product shape:

**Доска · Автоном · Проект · Ещё**

| Tab | Job |
| --- | --- |
| **Доска** | GitHub columns: backlog · ready · ход · QA · done. |
| **Автоном** | The three-step queue. Pause, retry, rollback. |
| **Проект** | Derived stage (SPEC?, P0, ready, ход, graph age), «Разобрать», drafts. |
| **Ещё** | Консоль, Графы, Настройки, Map. Secondary, not a fifth peer tab. |

Desktop may show the secondary surfaces in a rail. Map stays infra
(server contour), not a vis.js dump. `workshop/preview.html` is a
reference, not a dump.

Shipped `origin/main` still paints six peer dock buttons
(Доска / Автоном / Проект / Графы / Консоль / Настройки). Closing that
gap is UI work, not a reason to skip this spec.

## Non-goals

- No new company, legal entity, or «we are hiring» surface.
- No billing, plans, seats, or usage meters.
- No multi-tenant / multi-org workshop.
- No Tailscale Funnel. HTTPS stays on the tailnet.
- No new product invented by research or Автоном. File follow-ups
  against this spec (or a project's own SPEC/PRD) only.
- No Telegram rewrite here (that is corp#56).
- No Linear as source of truth.
- No deleting repos or rewriting Git history.

## Compare shipped vs this spec

Another agent should be able to:

1. Confirm `docs/SPEC.md` exists (this file). `project_stage` for corp
   must not be «нет спеки» for lack of a spec.
2. Read `HARNESS.md` + `docs/WORKSHOP.md` for the locked loop and QA gate.
3. Read `docs/HANDOFF.md` + `SERVER.md` for the two trees and first hour.
4. Diff the live workshop tabs against **Доска · Автоном · Проект · Ещё**.
5. Open only **new** Issues for gaps that are not already on the board.
   Slate from research stays unlabeled `ready` until the operator approves.
