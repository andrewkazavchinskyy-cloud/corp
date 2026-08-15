# Graph Report - corp  (2026-08-16)

## Corpus Check
- 14 files · ~22,168 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 354 nodes · 954 edges · 15 communities (12 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d6a623cb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- orchestrate
- die
- corp
- board_payload
- app.py
- app.js
- Workshop operating contract
- main
- main
- 2026-08-15
- 2026-08-16
- launch_agent
- CorpError
- memory/README.md

## God Nodes (most connected - your core abstractions)
1. `2026-08-16` - 31 edges
2. `escapeHtml()` - 24 edges
3. `call()` - 20 edges
4. `refresh()` - 17 edges
5. `Workshop operating contract` - 15 edges
6. `openSheet()` - 13 edges
7. `renderBoard()` - 12 edges
8. `renderProject()` - 12 edges
9. `db()` - 11 edges
10. `setTab()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `Path`  [INFERRED]
  workshop/test_logic.py →   _Bridges community 0 → community 7_
- `run_issue()` --indirect_call--> `pulse_loop()`  [INFERRED]
  bin/corp → bin/corp  _Bridges community 12 → community 1_
- `api_project()` --indirect_call--> `prune_drafts()`  [INFERRED]
  workshop/app.py → bin/corp  _Bridges community 2 → community 4_
- `die()` --calls--> `CorpError`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 13 → community 1_
- `agent_argv()` --calls--> `die()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 1 → community 0_

## Import Cycles
- None detected.

## Communities (15 total, 3 thin omitted)

### Community 0 - "orchestrate"
Cohesion: 0.12
Nodes (26): active_projects(), agent_argv(), agent_prompt(), append_log(), config_dir(), expand(), graph_detail(), graphs_index() (+18 more)

### Community 1 - "die"
Cohesion: 0.22
Nodes (24): add_existing(), add_labels(), assign_me(), claim(), _clone_to_workspace(), close_issue(), comment(), create_project() (+16 more)

### Community 2 - "corp"
Cohesion: 0.15
Nodes (33): approve_draft(), default_slot(), default_workshop(), draft_by_id(), draft_issue_body(), drop_draft(), _help_text(), load_catalog() (+25 more)

### Community 3 - "board_payload"
Cohesion: 0.18
Nodes (18): board_payload(), collect_issues(), column_of(), draft_summaries(), is_free_ready(), issue_ref(), issues_enabled(), issues_for() (+10 more)

### Community 4 - "app.py"
Cohesion: 0.10
Nodes (58): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+50 more)

### Community 5 - "app.js"
Cohesion: 0.10
Nodes (62): api(), b64urlToBuf(), badge(), bindSheetExits(), boot(), bufToB64url(), cardClass(), cardHtml() (+54 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.05
Nodes (39): Absolute Git preservation, Corporation operating contract, How to work, New projects, Session start, Source of truth, Access, Add existing (+31 more)

### Community 8 - "main"
Cohesion: 0.16
Nodes (23): archive_project(), bootstrap(), cmd_queue(), cycle_payload(), doctor(), doctor_payload(), ensure_path(), gh_ready() (+15 more)

### Community 9 - "2026-08-15"
Cohesion: 0.25
Nodes (7): 2026-08-15, corp#1 — Graphify active projects (VPS session), Decisions, Later, Open questions, Outcome, Request

### Community 10 - "2026-08-16"
Cohesion: 0.06
Nodes (31): 2026-08-16, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions, Links (+23 more)

### Community 12 - "launch_agent"
Cohesion: 0.21
Nodes (13): capture_pane(), last_log_lines(), launch_agent(), orch_alive(), orch_session(), orch_status(), pulse_label(), pulse_loop() (+5 more)

## Knowledge Gaps
- **75 isolated node(s):** `titles`, `COLS`, `state`, `graphsCache`, `Absolute Git preservation` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `corp`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **What connects `titles`, `COLS`, `state` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `orchestrate` be split into smaller, more focused modules?**
  _Cohesion score 0.11692307692307692 - nodes in this community are weakly interconnected._
- **Should `corp` be split into smaller, more focused modules?**
  _Cohesion score 0.14789915966386555 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09935710111046171 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09882232462877624 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._