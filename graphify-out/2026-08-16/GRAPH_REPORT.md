# Graph Report - corp  (2026-08-16)

## Corpus Check
- 19 files · ~31,489 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 485 nodes · 1301 edges · 19 communities (16 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.53)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `59cc904f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- die
- README.md
- corp
- Harness
- app.py
- app.js
- Workshop operating contract
- Agent isolation (corp#41)
- 2026-08-15
- 2026-08-16
- 2026-08-17
- board_payload
- memory/README.md
- Corporation operating contract
- Server
- agent-isolation-smoke.sh
- corp-agent-exec
- provision-agent-identity.sh

## God Nodes (most connected - your core abstractions)
1. `2026-08-16` - 57 edges
2. `escapeHtml()` - 27 edges
3. `call()` - 22 edges
4. `refresh()` - 18 edges
5. `renderGraphs()` - 16 edges
6. `Workshop operating contract` - 16 edges
7. `openSheet()` - 15 edges
8. `renderAuto()` - 15 edges
9. `setTab()` - 13 edges
10. `renderProject()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `run_issue()` --indirect_call--> `pulse_loop()`  [INFERRED]
  bin/corp → bin/corp  _Bridges community 2 → community 0_
- `api_project()` --indirect_call--> `prune_drafts()`  [INFERRED]
  workshop/app.py → bin/corp  _Bridges community 2 → community 4_
- `issues_for()` --calls--> `die()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 0 → community 12_
- `draft_summaries()` --calls--> `pinned_projects()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 12 → community 2_

## Import Cycles
- None detected.

## Communities (19 total, 3 thin omitted)

### Community 0 - "die"
Cohesion: 0.08
Nodes (66): active_projects(), add_existing(), add_labels(), agent_argv(), archive_project(), assign_me(), bootstrap(), claim() (+58 more)

### Community 1 - "README.md"
Cohesion: 0.25
Nodes (3): corp, Документы, Команды

### Community 2 - "corp"
Cohesion: 0.06
Nodes (99): agent_home_dir(), agent_identity_ready(), agent_prompt(), agent_user_name(), agent_wrapper_path(), append_log(), approve_draft(), capture_pane() (+91 more)

### Community 3 - "Harness"
Cohesion: 0.22
Nodes (9): Bootstrap on a new device, Cycle, Graphify, Harness, Memory, Persistent runner, Planner, Research loop (+1 more)

### Community 4 - "app.py"
Cohesion: 0.10
Nodes (61): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+53 more)

### Community 5 - "app.js"
Cohesion: 0.06
Nodes (90): api(), autoProject(), autoTyping(), autoUi, b64urlToBuf(), badge(), bindAutoQueue(), bindGraphDetail() (+82 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.12
Nodes (16): Access, Add existing, Autopilot, Create new, Design / QA, Filter, Graphs, Locks (+8 more)

### Community 8 - "Agent isolation (corp#41)"
Cohesion: 0.29
Nodes (7): Agent isolation (corp#41), Model, Provisioning (root, once per VPS), Risk / staged rollout, Rollback, Smoke check, Two modes in `bin/corp`

### Community 9 - "2026-08-15"
Cohesion: 0.25
Nodes (7): 2026-08-15, corp#1 — Graphify active projects (VPS session), Decisions, Later, Open questions, Outcome, Request

### Community 10 - "2026-08-16"
Cohesion: 0.03
Nodes (57): 2026-08-16, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions (+49 more)

### Community 11 - "2026-08-17"
Cohesion: 0.17
Nodes (11): 2026-08-17, Broken / follow-up, Decisions, Decisions, Links, Open questions, Outcome, Outcome (+3 more)

### Community 12 - "board_payload"
Cohesion: 0.20
Nodes (18): board_payload(), collect_issues(), column_of(), is_free_ready(), issue_eligibility(), issues_enabled(), issues_for(), label_names() (+10 more)

### Community 16 - "Corporation operating contract"
Cohesion: 0.33
Nodes (6): Absolute Git preservation, Corporation operating contract, How to work, New projects, Session start, Source of truth

### Community 17 - "Server"
Cohesion: 0.33
Nodes (6): Agents, Layout, Server, Telegram, Who does what, Workshop

### Community 18 - "agent-isolation-smoke.sh"
Cohesion: 0.83
Nodes (3): bad(), pass(), agent-isolation-smoke.sh script

## Knowledge Gaps
- **122 isolated node(s):** `provision-agent-identity.sh script`, `titles`, `COLS`, `state`, `graphsCache` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `corp`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **What connects `provision-agent-identity.sh script`, `titles`, `COLS` to the rest of the system?**
  _122 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `die` be split into smaller, more focused modules?**
  _Cohesion score 0.0845771144278607 - nodes in this community are weakly interconnected._
- **Should `corp` be split into smaller, more focused modules?**
  _Cohesion score 0.057464569986410405 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09518773135906927 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06428237494156147 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._