# Graph Report - corp  (2026-08-16)

## Corpus Check
- 14 files · ~21,121 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 334 nodes · 907 edges · 16 communities (14 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `74e2b729`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- project_dir
- die
- load_workshop
- board_payload
- app.py
- app.js
- Workshop operating contract
- corp
- main
- 2026-08-15
- 2026-08-16
- have
- run_issue
- CorpError
- memory/README.md

## God Nodes (most connected - your core abstractions)
1. `escapeHtml()` - 22 edges
2. `2026-08-16` - 21 edges
3. `call()` - 20 edges
4. `refresh()` - 15 edges
5. `Workshop operating contract` - 15 edges
6. `api()` - 12 edges
7. `openSheet()` - 12 edges
8. `db()` - 11 edges
9. `renderProject()` - 11 edges
10. `setTab()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `api_project()` --indirect_call--> `prune_drafts()`  [INFERRED]
  workshop/app.py → bin/corp  _Bridges community 2 → community 4_
- `die()` --calls--> `CorpError`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 13 → community 1_
- `agent_argv()` --calls--> `die()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 1 → community 0_
- `archive_project()` --calls--> `die()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 1 → community 8_
- `bootstrap()` --calls--> `die()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 1 → community 11_

## Import Cycles
- None detected.

## Communities (16 total, 2 thin omitted)

### Community 0 - "project_dir"
Cohesion: 0.15
Nodes (19): active_projects(), agent_argv(), agent_prompt(), expand(), graph_detail(), graphs_index(), is_pinned(), orch_prompt() (+11 more)

### Community 1 - "die"
Cohesion: 0.19
Nodes (25): add_existing(), add_labels(), approve_draft(), assign_me(), claim(), _clone_to_workspace(), close_issue(), comment() (+17 more)

### Community 2 - "load_workshop"
Cohesion: 0.24
Nodes (16): default_workshop(), draft_by_id(), drop_draft(), load_workshop(), new_draft(), profile_by_id(), prune_drafts(), queue_add() (+8 more)

### Community 3 - "board_payload"
Cohesion: 0.31
Nodes (11): board_payload(), collect_issues(), column_of(), is_free_ready(), issues_enabled(), issues_for(), label_names(), pinned_projects() (+3 more)

### Community 4 - "app.py"
Cohesion: 0.10
Nodes (58): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+50 more)

### Community 5 - "app.js"
Cohesion: 0.11
Nodes (55): api(), b64urlToBuf(), badge(), bindSheetExits(), boot(), bufToB64url(), cardClass(), cardHtml() (+47 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.05
Nodes (39): Absolute Git preservation, Corporation operating contract, How to work, New projects, Session start, Source of truth, Access, Add existing (+31 more)

### Community 7 - "corp"
Cohesion: 0.14
Nodes (28): append_log(), capture_pane(), config_dir(), _help_text(), last_log_lines(), load_catalog(), load_registry(), _looks_like_model() (+20 more)

### Community 8 - "main"
Cohesion: 0.26
Nodes (14): archive_project(), cmd_queue(), cycle_payload(), hide_project(), main(), parse_issue_ref(), project_by_name(), project_stage() (+6 more)

### Community 9 - "2026-08-15"
Cohesion: 0.25
Nodes (7): 2026-08-15, corp#1 — Graphify active projects (VPS session), Decisions, Later, Open questions, Outcome, Request

### Community 10 - "2026-08-16"
Cohesion: 0.09
Nodes (21): 2026-08-16, Decisions, Decisions, Decisions, Decisions, Links, Links, Links (+13 more)

### Community 11 - "have"
Cohesion: 0.27
Nodes (11): bootstrap(), doctor(), doctor_payload(), ensure_path(), gh_ready(), have(), load_env(), notify() (+3 more)

### Community 12 - "run_issue"
Cohesion: 0.23
Nodes (13): default_slot(), issue_ref(), launch_agent(), notify_safe(), pulse_label(), pulse_loop(), run_issue(), slot_for_issue() (+5 more)

## Knowledge Gaps
- **65 isolated node(s):** `titles`, `COLS`, `state`, `graphsCache`, `Absolute Git preservation` (+60 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.149) - this node is a cross-community bridge._
- **What connects `titles`, `COLS`, `state` to the rest of the system?**
  _65 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `project_dir` be split into smaller, more focused modules?**
  _Cohesion score 0.14736842105263157 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09935710111046171 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10714285714285714 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `corp` be split into smaller, more focused modules?**
  _Cohesion score 0.14039408866995073 - nodes in this community are weakly interconnected._