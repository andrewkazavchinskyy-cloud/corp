# Graph Report - corp  (2026-08-16)

## Corpus Check
- 14 files · ~23,207 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 379 nodes · 1013 edges · 17 communities (14 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.56)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d88e4ad6`
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
- run_issue
- board_payload
- CorpError
- memory/README.md
- project_dir

## God Nodes (most connected - your core abstractions)
1. `2026-08-16` - 39 edges
2. `escapeHtml()` - 25 edges
3. `call()` - 20 edges
4. `refresh()` - 17 edges
5. `renderGraphs()` - 16 edges
6. `openSheet()` - 15 edges
7. `Workshop operating contract` - 15 edges
8. `renderProject()` - 13 edges
9. `setTab()` - 12 edges
10. `renderBoard()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `Path`  [INFERRED]
  workshop/test_logic.py →   _Bridges community 0 → community 7_
- `run_issue()` --indirect_call--> `pulse_loop()`  [INFERRED]
  bin/corp → bin/corp  _Bridges community 2 → community 11_
- `api_project()` --indirect_call--> `prune_drafts()`  [INFERRED]
  workshop/app.py → bin/corp  _Bridges community 2 → community 4_
- `die()` --calls--> `CorpError`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 13 → community 1_
- `agent_argv()` --calls--> `die()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 1 → community 0_

## Import Cycles
- None detected.

## Communities (17 total, 3 thin omitted)

### Community 0 - "orchestrate"
Cohesion: 0.16
Nodes (16): agent_argv(), agent_prompt(), append_log(), config_dir(), expand(), maybe_orchestrate(), orch_open_lines(), orch_prompt() (+8 more)

### Community 1 - "die"
Cohesion: 0.20
Nodes (25): add_existing(), add_labels(), assign_me(), claim(), _clone_to_workspace(), close_issue(), comment(), create_project() (+17 more)

### Community 2 - "load_workshop"
Cohesion: 0.12
Nodes (28): capture_pane(), default_workshop(), draft_by_id(), drop_draft(), last_log_lines(), load_catalog(), load_workshop(), merge_catalog_row() (+20 more)

### Community 3 - "corp"
Cohesion: 0.20
Nodes (15): approve_draft(), draft_issue_body(), _help_text(), is_free_ready(), load_registry(), _looks_like_model(), _models_from_json(), _parse_efforts() (+7 more)

### Community 4 - "app.py"
Cohesion: 0.10
Nodes (58): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+50 more)

### Community 5 - "app.js"
Cohesion: 0.08
Nodes (78): api(), b64urlToBuf(), badge(), bindGraphDetail(), bindGraphJumps(), bindGraphSearch(), bindSheetExits(), boot() (+70 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.05
Nodes (39): Absolute Git preservation, Corporation operating contract, How to work, New projects, Session start, Source of truth, Access, Add existing (+31 more)

### Community 8 - "main"
Cohesion: 0.26
Nodes (14): archive_project(), cmd_queue(), cycle_payload(), hide_project(), main(), parse_issue_ref(), project_by_name(), project_stage() (+6 more)

### Community 9 - "2026-08-15"
Cohesion: 0.25
Nodes (7): 2026-08-15, corp#1 — Graphify active projects (VPS session), Decisions, Later, Open questions, Outcome, Request

### Community 10 - "2026-08-16"
Cohesion: 0.05
Nodes (39): 2026-08-16, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions (+31 more)

### Community 11 - "run_issue"
Cohesion: 0.18
Nodes (18): default_slot(), doctor(), doctor_payload(), ensure_path(), gh_ready(), have(), issue_ref(), launch_agent() (+10 more)

### Community 12 - "board_payload"
Cohesion: 0.35
Nodes (11): board_payload(), collect_issues(), column_of(), draft_summaries(), issues_enabled(), issues_for(), label_names(), pinned_projects() (+3 more)

### Community 16 - "project_dir"
Cohesion: 0.33
Nodes (10): active_projects(), bootstrap(), graph_detail(), graphs_index(), is_pinned(), parse_graph_report(), project_dir(), pull_projects() (+2 more)

## Knowledge Gaps
- **85 isolated node(s):** `titles`, `COLS`, `state`, `graphsCache`, `ROLE_RU` (+80 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **What connects `titles`, `COLS`, `state` to the rest of the system?**
  _85 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `load_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09935710111046171 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07721518987341772 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `2026-08-16` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._