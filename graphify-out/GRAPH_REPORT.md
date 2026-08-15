# Graph Report - corp  (2026-08-16)

## Corpus Check
- 14 files · ~24,474 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 400 nodes · 1057 edges · 16 communities (14 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.56)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dfa2214f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Path
- die
- load_workshop
- corp
- app.py
- app.js
- Workshop operating contract
- run_next
- main
- 2026-08-15
- 2026-08-16
- run_issue
- board_payload
- CorpError
- memory/README.md

## God Nodes (most connected - your core abstractions)
1. `2026-08-16` - 44 edges
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
- `run_issue()` --indirect_call--> `pulse_loop()`  [INFERRED]
  bin/corp → bin/corp  _Bridges community 3 → community 11_
- `api_project()` --indirect_call--> `prune_drafts()`  [INFERRED]
  workshop/app.py → bin/corp  _Bridges community 2 → community 4_
- `die()` --calls--> `CorpError`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 13 → community 1_
- `agent_argv()` --calls--> `die()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 1 → community 11_
- `approve_draft()` --calls--> `die()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 1 → community 2_

## Import Cycles
- None detected.

## Communities (16 total, 2 thin omitted)

### Community 0 - "Path"
Cohesion: 0.13
Nodes (21): agent_prompt(), append_log(), config_dir(), expand(), launch_agent(), load_runs(), orch_spec_rels(), record_run() (+13 more)

### Community 1 - "die"
Cohesion: 0.23
Nodes (22): add_existing(), add_labels(), assign_me(), claim(), _clone_to_workspace(), close_issue(), comment(), create_project() (+14 more)

### Community 2 - "load_workshop"
Cohesion: 0.14
Nodes (27): approve_draft(), default_workshop(), draft_by_id(), draft_issue_body(), draft_summaries(), drop_draft(), load_catalog(), load_workshop() (+19 more)

### Community 3 - "corp"
Cohesion: 0.15
Nodes (22): capture_pane(), _help_text(), is_free_ready(), issue_ref(), last_log_lines(), load_registry(), _looks_like_model(), _models_from_json() (+14 more)

### Community 4 - "app.py"
Cohesion: 0.10
Nodes (60): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+52 more)

### Community 5 - "app.js"
Cohesion: 0.07
Nodes (82): api(), b64urlToBuf(), badge(), bindGraphDetail(), bindGraphJumps(), bindGraphSearch(), bindSheetExits(), boot() (+74 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.04
Nodes (40): Absolute Git preservation, Corporation operating contract, How to work, New projects, Session start, Source of truth, Access, Add existing (+32 more)

### Community 7 - "run_next"
Cohesion: 0.33
Nodes (7): cmd_queue(), parse_issue_ref(), profile_by_id(), queue_status(), render(), run_next(), Namespace

### Community 8 - "main"
Cohesion: 0.18
Nodes (20): active_projects(), archive_project(), cycle_payload(), doctor(), graph_detail(), graphs_index(), hide_project(), is_pinned() (+12 more)

### Community 9 - "2026-08-15"
Cohesion: 0.25
Nodes (7): 2026-08-15, corp#1 — Graphify active projects (VPS session), Decisions, Later, Open questions, Outcome, Request

### Community 10 - "2026-08-16"
Cohesion: 0.04
Nodes (44): 2026-08-16, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions (+36 more)

### Community 11 - "run_issue"
Cohesion: 0.20
Nodes (16): agent_argv(), bootstrap(), default_slot(), doctor_payload(), ensure_path(), gh_ready(), have(), load_env() (+8 more)

### Community 12 - "board_payload"
Cohesion: 0.28
Nodes (13): board_payload(), collect_issues(), column_of(), issues_enabled(), issues_for(), label_names(), pin_write_block(), pinned_projects() (+5 more)

## Knowledge Gaps
- **93 isolated node(s):** `titles`, `COLS`, `state`, `graphsCache`, `ROLE_RU` (+88 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **What connects `titles`, `COLS`, `state` to the rest of the system?**
  _93 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Path` be split into smaller, more focused modules?**
  _Cohesion score 0.1341991341991342 - nodes in this community are weakly interconnected._
- **Should `load_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.1396011396011396 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09562841530054644 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07200229489386116 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._