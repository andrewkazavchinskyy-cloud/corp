# Graph Report - corp  (2026-08-16)

## Corpus Check
- 14 files · ~20,704 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 321 nodes · 891 edges · 16 communities (13 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `12b3fa59`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- project_dir
- die
- load_workshop
- queue_add
- app.py
- app.js
- Workshop operating contract
- corp
- main
- 2026-08-15
- 2026-08-16
- run_issue
- main
- CorpError
- memory/README.md

## God Nodes (most connected - your core abstractions)
1. `escapeHtml()` - 22 edges
2. `call()` - 20 edges
3. `refresh()` - 16 edges
4. `Workshop operating contract` - 14 edges
5. `db()` - 11 edges
6. `api()` - 11 edges
7. `openSheet()` - 11 edges
8. `renderProject()` - 11 edges
9. `2026-08-16` - 11 edges
10. `setTab()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `Path`  [INFERRED]
  workshop/test_logic.py →   _Bridges community 0 → community 12_
- `run_issue()` --indirect_call--> `pulse_loop()`  [INFERRED]
  bin/corp → bin/corp  _Bridges community 7 → community 11_
- `api_project()` --indirect_call--> `prune_drafts()`  [INFERRED]
  workshop/app.py → bin/corp  _Bridges community 2 → community 4_
- `die()` --calls--> `CorpError`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 13 → community 1_
- `agent_argv()` --calls--> `die()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 1 → community 0_

## Import Cycles
- None detected.

## Communities (16 total, 3 thin omitted)

### Community 0 - "project_dir"
Cohesion: 0.21
Nodes (16): active_projects(), agent_argv(), agent_prompt(), bootstrap(), expand(), graph_detail(), graphs_index(), is_pinned() (+8 more)

### Community 1 - "die"
Cohesion: 0.20
Nodes (25): add_existing(), add_labels(), archive_project(), assign_me(), claim(), _clone_to_workspace(), close_issue(), comment() (+17 more)

### Community 2 - "load_workshop"
Cohesion: 0.17
Nodes (22): approve_draft(), default_workshop(), draft_by_id(), draft_issue_body(), drop_draft(), load_catalog(), load_workshop(), merge_catalog_row() (+14 more)

### Community 3 - "queue_add"
Cohesion: 0.23
Nodes (15): board_payload(), collect_issues(), column_of(), is_free_ready(), issues_enabled(), issues_for(), label_names(), pin_write_block() (+7 more)

### Community 4 - "app.py"
Cohesion: 0.10
Nodes (58): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+50 more)

### Community 5 - "app.js"
Cohesion: 0.11
Nodes (53): api(), b64urlToBuf(), badge(), boot(), bufToB64url(), cardClass(), cardHtml(), catalogKind() (+45 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.05
Nodes (38): Absolute Git preservation, Corporation operating contract, How to work, New projects, Session start, Source of truth, Add existing, Create new (+30 more)

### Community 7 - "corp"
Cohesion: 0.13
Nodes (31): append_log(), capture_pane(), config_dir(), default_slot(), _help_text(), issue_ref(), last_log_lines(), load_registry() (+23 more)

### Community 8 - "main"
Cohesion: 0.27
Nodes (13): cmd_queue(), cycle_payload(), hide_project(), main(), parse_issue_ref(), profile_by_id(), project_by_name(), project_stage() (+5 more)

### Community 9 - "2026-08-15"
Cohesion: 0.25
Nodes (7): 2026-08-15, corp#1 — Graphify active projects (VPS session), Decisions, Later, Open questions, Outcome, Request

### Community 10 - "2026-08-16"
Cohesion: 0.17
Nodes (11): 2026-08-16, Decisions, Decisions, Links, Links, Open questions, Open questions, Outcome (+3 more)

### Community 11 - "run_issue"
Cohesion: 0.27
Nodes (13): doctor(), doctor_payload(), ensure_path(), gh_ready(), have(), launch_agent(), load_env(), pick_agent() (+5 more)

## Knowledge Gaps
- **54 isolated node(s):** `titles`, `COLS`, `state`, `graphsCache`, `Absolute Git preservation` (+49 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **What connects `titles`, `COLS`, `state` to the rest of the system?**
  _54 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.09935710111046171 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11180992313067785 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `corp` be split into smaller, more focused modules?**
  _Cohesion score 0.12701612903225806 - nodes in this community are weakly interconnected._