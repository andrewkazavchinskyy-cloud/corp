# Graph Report - corp  (2026-08-16)

## Corpus Check
- 14 files · ~22,587 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 365 nodes · 975 edges · 16 communities (13 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.56)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `18559ca0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- orchestrate
- die
- load_workshop
- corp
- app.py
- app.js
- Workshop operating contract
- main
- main
- 2026-08-15
- 2026-08-16
- have
- pulse_loop
- CorpError
- memory/README.md

## God Nodes (most connected - your core abstractions)
1. `2026-08-16` - 35 edges
2. `escapeHtml()` - 24 edges
3. `call()` - 20 edges
4. `refresh()` - 17 edges
5. `openSheet()` - 15 edges
6. `Workshop operating contract` - 15 edges
7. `renderProject()` - 13 edges
8. `renderBoard()` - 12 edges
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

## Communities (16 total, 3 thin omitted)

### Community 0 - "orchestrate"
Cohesion: 0.15
Nodes (17): agent_argv(), agent_prompt(), append_log(), config_dir(), expand(), orch_open_lines(), orch_prompt(), orch_spec_rels() (+9 more)

### Community 1 - "die"
Cohesion: 0.21
Nodes (26): add_existing(), add_labels(), assign_me(), claim(), _clone_to_workspace(), close_issue(), comment(), create_project() (+18 more)

### Community 2 - "load_workshop"
Cohesion: 0.16
Nodes (24): approve_draft(), default_workshop(), draft_by_id(), draft_issue_body(), draft_summaries(), drop_draft(), load_catalog(), load_workshop() (+16 more)

### Community 3 - "corp"
Cohesion: 0.15
Nodes (26): board_payload(), collect_issues(), column_of(), default_slot(), _help_text(), is_free_ready(), issues_enabled(), issues_for() (+18 more)

### Community 4 - "app.py"
Cohesion: 0.10
Nodes (58): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+50 more)

### Community 5 - "app.js"
Cohesion: 0.09
Nodes (68): api(), b64urlToBuf(), badge(), bindSheetExits(), boot(), bufToB64url(), buildProfileId(), cardClass() (+60 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.05
Nodes (39): Absolute Git preservation, Corporation operating contract, How to work, New projects, Session start, Source of truth, Access, Add existing (+31 more)

### Community 8 - "main"
Cohesion: 0.17
Nodes (22): active_projects(), archive_project(), cmd_queue(), cycle_payload(), graph_detail(), graphs_index(), hide_project(), is_pinned() (+14 more)

### Community 9 - "2026-08-15"
Cohesion: 0.25
Nodes (7): 2026-08-15, corp#1 — Graphify active projects (VPS session), Decisions, Later, Open questions, Outcome, Request

### Community 10 - "2026-08-16"
Cohesion: 0.06
Nodes (35): 2026-08-16, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions (+27 more)

### Community 11 - "have"
Cohesion: 0.24
Nodes (13): bootstrap(), doctor(), doctor_payload(), ensure_path(), gh_ready(), have(), launch_agent(), load_env() (+5 more)

### Community 12 - "pulse_loop"
Cohesion: 0.25
Nodes (9): capture_pane(), issue_ref(), last_log_lines(), orch_alive(), orch_session(), orch_status(), pulse_label(), pulse_loop() (+1 more)

## Knowledge Gaps
- **81 isolated node(s):** `titles`, `COLS`, `state`, `graphsCache`, `ROLE_RU` (+76 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **What connects `titles`, `COLS`, `state` to the rest of the system?**
  _81 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `orchestrate` be split into smaller, more focused modules?**
  _Cohesion score 0.14705882352941177 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09935710111046171 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `2026-08-16` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._