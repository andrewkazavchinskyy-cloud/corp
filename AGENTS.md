# Corporation operating contract

This repository is the portable operating system for the user's projects.
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
- Planner is GitHub Issues. Label `ready` means an agent may take the work. Label `blocked` means skip. Optional tools (Linear, Jira, local boards) are views, not sources of truth.
- Graphify output lives in each repo as `graphify-out/` and is committed (except `cache/`).
- Do not commit credentials, tokens, `.env`, server access data, or global agent contracts.

## Session start

1. Read `HARNESS.md`.
2. Run `./bin/corp cycle` from this repository.
3. If `NEXT` is a `ready` Issue, do that work in the named project checkout.
4. If `NEXT` is `research`, follow the research loop. File or refine Issues. Do not start a new product unless the user asked.

## How to work

- Query `graphify-out/` before broad file reads when it exists.
- Keep changes small. Reuse existing code. Prefer the standard library.
- After meaningful work, update `memory/sessions/` (this repo or the project), commit, and push when practical.
- Record user-visible requests, outcomes, decisions, assumptions, open questions, and links. Never record hidden chain-of-thought or raw tool dumps.

## New projects

- Create the project under the user's GitHub folder, then a private repo on `andrewkazavchinskyy-cloud`, then add it to `registry.json`.
- Do not create extra repos for `src/`, `docs/`, `tests/`, `data/`, or `memory/`.
