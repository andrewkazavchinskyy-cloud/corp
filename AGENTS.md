# Corporation operating contract

This repository is the portable operating system for the user's projects.
Workshop contract: `docs/WORKSHOP.md`.
Any coding agent — Cursor, Codex, Claude, Copilot, Grok, or a raw CLI — must
follow this file and `HARNESS.md` after clone. Local overlays
(`~/.cursor/AGENTS.md`, `~/.codex/AGENTS.md`) may add product-specific routing.
They must not weaken the Git preservation boundary.

## Absolute Git preservation

- Never delete a local or remote Git repository, `.git` directory, mirror, fork, or backup.
- Never delete, discard, orphan, hide, or rewrite existing commits or published history.
- Never force-push, hard-reset away commits, destructively rebase/filter history, prune recoverable commits, or delete a branch/tag that is the only durable reference to commits.
- Prefer additive commits, reverts, new branches, and archival.
- Stop and explain if a request conflicts with this policy.

## Source of truth

- GitHub is canonical for code, Issues, decisions, roadmap, and safe project memory.
- git `registry.json` is canonical for projects. `workshop.json` overlay is
  emergency-only and must surface as uncommitted registry. Do not silently drop pins.
- Planner is GitHub Issues. Label `ready` means work may be claimed. `self` means the human has it. `queued` is the VPS autonomous queue. `in-progress` plus `via:*` is a VPS runner. `blocked` means skip. Optional tools (Linear, Jira, local boards) are views, not sources of truth.
- Graphify output lives in each product repo as `graphify-out/` and is committed (except `cache/`). Refresh with `graphify update` after an Issue is closed.
- Do not commit credentials, tokens, `.env`, server access data, or global agent contracts.

## Session start

1. Read `HARNESS.md`.
2. Run `./bin/corp cycle` from this repository. It is a list, not an order to steal the global head of queue.
3. If the user already named an Issue, or an Issue is labeled `self`, work that. Claim with `corp take` before the first edit.
4. Skip `in-progress`, `self`, and `queued` Issues you do not own. Do not start a VPS run on a `self` card.
5. If `NEXT` is `research` and nothing is claimed, follow the research loop. Do not start a new product unless the user asked.

## How to work

- If `graphify-out/GRAPH_REPORT.md` exists, read it, then `graphify query` for this Issue before broad file reads.
- Keep changes small. Reuse existing code. Prefer the standard library.
- On corp, workshop work expands useful function and pushes `workshop/static`
  UI/UX on phone and desktop. `workshop/preview.html` is a reference, not a dump.
- After meaningful work, update `memory/sessions/` (this repo or the project), commit, and push when practical.
- Record user-visible requests, outcomes, decisions, assumptions, open questions, and links. Never record hidden chain-of-thought or raw tool dumps.

## New projects

- Create the project under the user's GitHub folder, then a private repo on `andrewkazavchinskyy-cloud`, then add it to `registry.json`.
- `create_project` seeds `docs/SPEC.md`, `AGENTS.md` (clone URL for corp, not
  iCloud paths), and optional `memory/sessions/`. No first GitHub Issue.
  Workspace is `$CORP_WORKSPACE` or the documented checkout folder.
- Do not create extra repos for `src/`, `docs/`, `tests/`, `data/`, or `memory/`.
