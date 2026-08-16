# Graph Report - corp  (2026-08-16)

## Corpus Check
- 19 files · ~30,671 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 473 nodes · 1283 edges · 21 communities (16 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.53)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d75c7972`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- corp
- README.md
- load_workshop
- Harness
- app.py
- app.js
- Workshop operating contract
- main
- Agent isolation (corp#41)
- 2026-08-15
- 2026-08-16
- 2026-08-17
- board_payload
- CorpError
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
4. `refresh()` - 17 edges
5. `renderGraphs()` - 16 edges
6. `Workshop operating contract` - 16 edges
7. `openSheet()` - 15 edges
8. `renderAuto()` - 14 edges
9. `setTab()` - 13 edges
10. `renderProject()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `Path`  [INFERRED]
  workshop/test_logic.py →   _Bridges community 0 → community 7_
- `run_issue()` --indirect_call--> `pulse_loop()`  [INFERRED]
  bin/corp → bin/corp  _Bridges community 2 → community 0_
- `api_project()` --indirect_call--> `prune_drafts()`  [INFERRED]
  workshop/app.py → bin/corp  _Bridges community 2 → community 4_
- `die()` --calls--> `CorpError`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 13 → community 0_
- `issues_for()` --calls--> `die()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 0 → community 12_

## Import Cycles
- None detected.

## Communities (21 total, 5 thin omitted)

### Community 0 - "corp"
Cohesion: 0.07
Nodes (112): active_projects(), add_existing(), add_labels(), agent_argv(), agent_home_dir(), agent_identity_ready(), agent_prompt(), agent_user_name() (+104 more)

### Community 1 - "README.md"
Cohesion: 0.25
Nodes (3): corp, Документы, Команды

### Community 2 - "load_workshop"
Cohesion: 0.07
Nodes (51): capture_pane(), default_workshop(), drop_draft(), handle_tg_text(), issue_ref(), last_log_lines(), load_catalog(), load_registry() (+43 more)

### Community 3 - "Harness"
Cohesion: 0.22
Nodes (9): Bootstrap on a new device, Cycle, Graphify, Harness, Memory, Persistent runner, Planner, Research loop (+1 more)

### Community 4 - "app.py"
Cohesion: 0.10
Nodes (61): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+53 more)

### Community 5 - "app.js"
Cohesion: 0.07
Nodes (84): api(), autoProject(), b64urlToBuf(), badge(), bindGraphDetail(), bindGraphJumps(), bindGraphSearch(), bindSheetExits() (+76 more)

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
Cohesion: 0.29
Nodes (6): 2026-08-17, Decisions, Links, Open questions, Outcome, Request

### Community 12 - "board_payload"
Cohesion: 0.24
Nodes (16): board_payload(), collect_issues(), column_of(), draft_summaries(), issue_eligibility(), issues_enabled(), issues_for(), label_names() (+8 more)

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
- **116 isolated node(s):** `provision-agent-identity.sh script`, `titles`, `COLS`, `state`, `graphsCache` (+111 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **What connects `provision-agent-identity.sh script`, `titles`, `COLS` to the rest of the system?**
  _116 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `corp` be split into smaller, more focused modules?**
  _Cohesion score 0.06536252134761683 - nodes in this community are weakly interconnected._
- **Should `load_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.07372549019607844 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09518773135906927 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07168262653898769 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._