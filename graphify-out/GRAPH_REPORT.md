# Graph Report - corp  (2026-08-16)

## Corpus Check
- 14 files · ~25,565 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 415 nodes · 1070 edges · 16 communities (14 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6673ca2f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- corp
- die
- update_workshop
- pulse_loop
- app.py
- app.js
- Workshop operating contract
- main
- project_dir
- 2026-08-15
- 2026-08-16
- main
- run_issue
- CorpError
- memory/README.md

## God Nodes (most connected - your core abstractions)
1. `2026-08-16` - 49 edges
2. `escapeHtml()` - 26 edges
3. `call()` - 20 edges
4. `refresh()` - 17 edges
5. `renderGraphs()` - 16 edges
6. `Workshop operating contract` - 16 edges
7. `openSheet()` - 15 edges
8. `renderProject()` - 13 edges
9. `setTab()` - 12 edges
10. `renderBoard()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `Path`  [INFERRED]
  workshop/test_logic.py →   _Bridges community 0 → community 7_
- `run_issue()` --indirect_call--> `pulse_loop()`  [INFERRED]
  bin/corp → bin/corp  _Bridges community 3 → community 12_
- `api_project()` --indirect_call--> `prune_drafts()`  [INFERRED]
  workshop/app.py → bin/corp  _Bridges community 2 → community 4_
- `die()` --calls--> `CorpError`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 13 → community 1_
- `agent_argv()` --calls--> `die()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 1 → community 8_

## Import Cycles
- None detected.

## Communities (16 total, 2 thin omitted)

### Community 0 - "corp"
Cohesion: 0.13
Nodes (31): agent_prompt(), append_log(), config_dir(), expand(), _help_text(), is_free_ready(), launch_agent(), load_registry() (+23 more)

### Community 1 - "die"
Cohesion: 0.19
Nodes (25): add_existing(), add_labels(), archive_project(), assign_me(), claim(), _clone_to_workspace(), close_issue(), comment() (+17 more)

### Community 2 - "update_workshop"
Cohesion: 0.09
Nodes (32): approve_draft(), default_workshop(), draft_by_id(), draft_issue_body(), drop_draft(), load_catalog(), load_workshop(), merge_catalog_row() (+24 more)

### Community 3 - "pulse_loop"
Cohesion: 0.28
Nodes (9): capture_pane(), last_log_lines(), orch_alive(), orch_session(), orch_status(), pulse_label(), pulse_loop(), tmux_has() (+1 more)

### Community 4 - "app.py"
Cohesion: 0.10
Nodes (60): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+52 more)

### Community 5 - "app.js"
Cohesion: 0.07
Nodes (82): api(), b64urlToBuf(), badge(), bindGraphDetail(), bindGraphJumps(), bindGraphSearch(), bindSheetExits(), boot() (+74 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.04
Nodes (40): Absolute Git preservation, Corporation operating contract, How to work, New projects, Session start, Source of truth, Access, Add existing (+32 more)

### Community 7 - "main"
Cohesion: 0.60
Nodes (4): issue(), main(), _mp_worker(), Child process body for the corp#39 concurrency regression below.

### Community 8 - "project_dir"
Cohesion: 0.22
Nodes (14): active_projects(), agent_argv(), cycle_payload(), draft_summaries(), graph_detail(), graphs_index(), is_pinned(), parse_graph_report() (+6 more)

### Community 9 - "2026-08-15"
Cohesion: 0.25
Nodes (7): 2026-08-15, corp#1 — Graphify active projects (VPS session), Decisions, Later, Open questions, Outcome, Request

### Community 10 - "2026-08-16"
Cohesion: 0.04
Nodes (49): 2026-08-16, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions (+41 more)

### Community 11 - "main"
Cohesion: 0.20
Nodes (18): bootstrap(), cmd_queue(), doctor(), doctor_payload(), ensure_path(), gh_ready(), have(), hide_project() (+10 more)

### Community 12 - "run_issue"
Cohesion: 0.15
Nodes (25): board_payload(), collect_issues(), column_of(), default_slot(), issue_ref(), issues_enabled(), issues_for(), label_names() (+17 more)

## Knowledge Gaps
- **98 isolated node(s):** `titles`, `COLS`, `state`, `graphsCache`, `ROLE_RU` (+93 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `update_workshop`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **What connects `titles`, `COLS`, `state` to the rest of the system?**
  _98 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `corp` be split into smaller, more focused modules?**
  _Cohesion score 0.12878787878787878 - nodes in this community are weakly interconnected._
- **Should `update_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.09274193548387097 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09562841530054644 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07200229489386116 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._