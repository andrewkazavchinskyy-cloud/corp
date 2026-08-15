# Harness

One loop. Any machine. Any agent that can run a shell and `gh`.

```mermaid
flowchart TD
  start[Clone corp and bootstrap] --> cycle[bin/corp cycle]
  cycle --> ready{ready Issue exists?}
  ready -->|yes| take[Take highest-priority ready Issue]
  take --> work[Work in that repo]
  work --> graph[Update graphify-out if structure changed]
  graph --> memory[Update memory and push]
  memory --> cycle
  ready -->|no| research[Research loop]
  research --> prd[PRD or SPEC vs shipped]
  research --> bugs[Open bugs and failing checks]
  research --> wip[Unfinished branches and drafts]
  prd --> file[File or refine ready Issues]
  bugs --> file
  wip --> file
  file --> cycle
```

## Bootstrap on a new device

Needs: `git`, `gh` logged in, Python 3, network.

```bash
gh repo clone andrewkazavchinskyy-cloud/corp
cd corp
./bin/corp bootstrap
./bin/corp cycle
```

Then open this folder in Cursor, Codex, Claude, Copilot, or Grok. The agent
reads `AGENTS.md` and this file. No extra subscription is required for the
loop itself.

`bootstrap` clones missing **active** repos from `registry.json`, pulls
existing checkouts, and installs Graphify when `uv` is available. It does not
start daemons.

## Cycle

```bash
./bin/corp cycle
./bin/corp cycle --json
./bin/corp cycle --write   # memory/next.local.md, gitignored
```

Priority:

1. Open Issues with label `ready` and without `blocked`, across active repos.
2. Sort `P0`, then `P1`, then `P2`, then recency.
3. If none, print a research report instead of inventing work.

An agent must not skip a `ready` Issue to start a nicer idea.

## Research loop

Use when `cycle` returns `mode: research`.

For each **active** project:

1. Read `graphify-out/GRAPH_REPORT.md` if present, else `README.md` and any
   `docs/PRD.md`, `docs/SPEC.md`, `docs/SHIP.md`, `docs/roadmap.md`, `STATE.md`.
2. Ask: what is already specified enough to implement? What is shipped vs the
   spec? What bugs or failing checks are open? What branches are unfinished?
3. File GitHub Issues with label `ready` only for work that is concrete and
   unblocked. Use `blocked` plus a reason if it is not.
4. Stop after a small batch (a few Issues). Do not generate a fake backlog.

Do not implement during research unless the user said to take the first
ready item immediately after filing it.

## Graphify

Per project, after clone or after a structural change:

```bash
# once per machine
uv tool install graphifyy && graphify install

cd <project>
graphify .
graphify cursor install    # Cursor: .cursor/rules/graphify.mdc
graphify hook install      # optional post-commit AST refresh
```

Commit `graphify-out/graph.json`, `GRAPH_REPORT.md`, and `graph.html`.
Do not commit `graphify-out/cache/`.

Query before fishing through files:

```bash
graphify query "where is the billing path?"
graphify explain SomeType
graphify path Foo Bar
```

## Planner

GitHub Issues are the planner because `gh` works on every device and every
agent subscription.

| Label    | Meaning                                      |
| -------- | -------------------------------------------- |
| `ready`  | An agent may take this now                   |
| `blocked`| Skip until the blocker is named and cleared  |
| `P0` `P1` `P2` | Priority                             |
| `bug` `prd` `research` | Optional type                  |

Linear or Jira can be added later as a synced view. Do not make them required.
If you want Linear later, keep GitHub Issues canonical and sync one way.

## Persistent runner

Do not start this unless the user asks.

On the always-on Mac mini, `launchd/com.corp.cycle.plist.example` refreshes
`memory/next.local.md`. It does not spawn an agent.

To actually execute work unattended, the user must name the CLI (`codex exec`,
Cursor agent, Claude) and approve a LaunchAgent or VPS unit. Until then, a
human (or an interactive agent) runs `./bin/corp cycle` and does the Issue.

## Memory

- Corp-level notes: `memory/sessions/YYYY-MM-DD.md`
- Project-level notes: that repo's `memory/` if it has one
- Record outcomes, decisions, assumptions, open questions, Issue links
- Never record secrets or hidden chain-of-thought
