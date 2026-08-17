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

Workspace for product checkouts is `$CORP_WORKSPACE` if set, else the parent
of this clone when that folder is named `Github`, `Developer`, `repos`,
`src`, or `code`, else `corp/projects/`. Find corp by clone URL
(`gh repo clone andrewkazavchinskyy-cloud/corp`), not an iCloud path.

**Registry rule:** git `registry.json` is canonical. `workshop.json`
`registry` overlay is emergency-only (git file not writable). Overlay may
add local-only projects and explicit pins. It must not delete git projects
or silently drop pins. Workshop Settings/Map show `uncommitted registry`
while the overlay is live.

## Cycle

```bash
./bin/corp cycle
./bin/corp cycle --json
./bin/corp cycle --write   # memory/next.local.md, gitignored
```

Priority:

1. Open Issues with label `ready` and without `blocked`, across active repos.
2. Sort `P0`, then `P1`, then `P2`, then recency.
3. If none, print a research report instead of inventing work. Per pin:
   SPEC/PRD present?, gap `нет` / `частично` / `есть`, top unshipped SPEC
   bullets (or file presence + open non-ready issues), dirty/unpushed,
   graph age. Do not auto-Approve. Do not mint a fake backlog.

An agent must not skip a `ready` Issue to start a nicer idea.

## Research loop

Use when `cycle` returns `mode: research`.

For each **active** project:

1. Read the `cycle` research rows (SPEC/PRD, unshipped bullets, git hint,
   graph age). Then `graphify-out/GRAPH_REPORT.md` if present, else
   `README.md` and any `docs/PRD.md`, `docs/SPEC.md`, `docs/SHIP.md`,
   `docs/roadmap.md`, `STATE.md`.
2. Ask: what is already specified enough to implement? What is shipped vs the
   spec? What bugs or failing checks are open? What branches are unfinished?
3. File GitHub Issues with label `ready` only for work that is concrete and
   unblocked. Use `blocked` plus a reason if it is not.
4. Stop after a small batch (a few Issues). Do not generate a fake backlog.
   Do not auto-Approve workshop drafts.

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

After every Issue close (`corp close`, workshop Done, or a VPS agent that
closed the Issue) run `graphify update .` in that product repo and push.
Do not rebuild the graph at the start of every session.

Query before fishing through files:

```bash
graphify query "where is the billing path?"
graphify explain SomeType
graphify path Foo Bar
```

## Planner

GitHub Issues are the planner because `gh` works on every device and every
agent subscription.

| Label | Meaning |
| ----- | ------- |
| `ready` | Specified. May be taken. |
| `queued` | In the VPS autonomous queue. `cycle` skips. |
| `in-progress` + `self` | You on the Mac mini or Grok Build. VPS must not start it. |
| `in-progress` + `via:claude` / `via:codex` / `via:grok` / `via:cursor` | VPS runner |
| `blocked` | Skip until the blocker is named |
| `P0` `P1` `P2` | Priority |
| `design` | Design artifacts; still must pass QA |
| `qa` | Issue kind: the work itself is QA |
| `in-qa` | In the QA column. Gate after build/design. QA closes on pass. |
| `qa-fail` | QA returned the card to ready with fixes |
| `bug` `prd` `research` | Optional type |

Claim before the first edit: `corp take --issue owner/repo#n` (you) or a
workshop / `corp run --issue` launch (VPS). `cycle` is a list. It skips
`in-progress`, `self`, and `queued`. Do not grab NEXT if you already named
another Issue.

Linear or Jira can be added later as a synced view. Do not make them required.

## Workshop and runners

The Mac mini is for you and interactive agents. The VPS is for unattended
CLI and the autonomous queue. See `SERVER.md` and `docs/WORKSHOP.md`.

```bash
./bin/corp doctor
./bin/corp take --issue owner/repo#n
./bin/corp run --issue owner/repo#n --agent claude
./bin/corp close --issue owner/repo#n
./bin/corp board --json
./bin/corp queue add --issue owner/repo#n --profile claude
./bin/corp workshop-token
```

Secrets live in `~/.config/corp/env` and `workshop.json`, never in git.

## Persistent runner

The workshop systemd unit binds `127.0.0.1:8787`. Tailscale Serve publishes
HTTPS on the tailnet only. Do not enable Funnel. The Mac mini LaunchAgent
only refreshes `memory/next.local.md`. It does not spawn an agent.

## Memory

- Corp-level notes: `memory/sessions/YYYY-MM-DD.md`
- Project-level notes: that repo's `memory/` if it has one
- Record outcomes, decisions, assumptions, open questions, Issue links
- Never record secrets or hidden chain-of-thought
