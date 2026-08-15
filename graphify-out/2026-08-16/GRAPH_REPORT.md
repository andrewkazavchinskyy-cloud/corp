# Graph Report - corp  (2026-08-15)

## Corpus Check
- 14 files · ~18,483 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 290 nodes · 819 edges · 16 communities (14 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c09220e2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main
- run
- corp
- board_payload
- app.py
- app.js
- Workshop operating contract
- run_issue
- die
- 2026-08-15
- 2026-08-16
- probe_kind
- pulse_loop
- CorpError
- memory/README.md

## God Nodes (most connected - your core abstractions)
1. `call()` - 18 edges
2. `escapeHtml()` - 16 edges
3. `refresh()` - 15 edges
4. `Workshop operating contract` - 13 edges
5. `db()` - 11 edges
6. `openSheet()` - 11 edges
7. `api()` - 10 edges
8. `setTab()` - 9 edges
9. `renderBoard()` - 9 edges
10. `pollConsole()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `run_issue()` --indirect_call--> `pulse_loop()`  [INFERRED]
  bin/corp → bin/corp  _Bridges community 12 → community 7_
- `api_project()` --indirect_call--> `prune_drafts()`  [INFERRED]
  workshop/app.py → bin/corp  _Bridges community 2 → community 4_
- `die()` --calls--> `CorpError`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 13 → community 8_
- `add_existing()` --calls--> `die()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 8 → community 1_
- `agent_argv()` --calls--> `die()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 8 → community 7_

## Import Cycles
- None detected.

## Communities (16 total, 2 thin omitted)

### Community 0 - "main"
Cohesion: 0.12
Nodes (33): active_projects(), agent_prompt(), archive_project(), bootstrap(), cycle_payload(), doctor(), doctor_payload(), ensure_path() (+25 more)

### Community 1 - "run"
Cohesion: 0.26
Nodes (15): add_existing(), add_labels(), assign_me(), claim(), _clone_to_workspace(), comment(), create_project(), ensure_label() (+7 more)

### Community 2 - "corp"
Cohesion: 0.23
Nodes (23): approve_draft(), cmd_queue(), default_workshop(), draft_by_id(), drop_draft(), hide_project(), load_catalog(), load_workshop() (+15 more)

### Community 3 - "board_payload"
Cohesion: 0.29
Nodes (12): board_payload(), collect_issues(), column_of(), is_free_ready(), is_pinned(), issues_enabled(), issues_for(), label_names() (+4 more)

### Community 4 - "app.py"
Cohesion: 0.10
Nodes (56): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+48 more)

### Community 5 - "app.js"
Cohesion: 0.14
Nodes (43): api(), b64urlToBuf(), badge(), boot(), bufToB64url(), cardClass(), cardHtml(), catalogKind() (+35 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.05
Nodes (37): Absolute Git preservation, Corporation operating contract, How to work, New projects, Session start, Source of truth, Add existing, Create new (+29 more)

### Community 7 - "run_issue"
Cohesion: 0.16
Nodes (18): agent_argv(), append_log(), config_dir(), default_slot(), launch_agent(), maybe_orchestrate(), orch_session(), orchestrate() (+10 more)

### Community 8 - "die"
Cohesion: 0.33
Nodes (12): close_issue(), die(), get_issue(), invalidate_board(), move_issue(), pin_write_block(), profile_by_id(), project_by_repo() (+4 more)

### Community 9 - "2026-08-15"
Cohesion: 0.25
Nodes (7): 2026-08-15, corp#1 — Graphify active projects (VPS session), Decisions, Later, Open questions, Outcome, Request

### Community 10 - "2026-08-16"
Cohesion: 0.29
Nodes (6): 2026-08-16, Decisions, Links, Open questions, Outcome, Request

### Community 11 - "probe_kind"
Cohesion: 0.40
Nodes (6): _help_text(), _looks_like_model(), _models_from_json(), _parse_efforts(), _parse_models(), probe_kind()

### Community 12 - "pulse_loop"
Cohesion: 0.40
Nodes (5): issue_ref(), last_log_lines(), pulse_label(), pulse_loop(), Event

## Knowledge Gaps
- **47 isolated node(s):** `titles`, `COLS`, `state`, `Absolute Git preservation`, `Source of truth` (+42 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `corp`?**
  _High betweenness centrality (0.174) - this node is a cross-community bridge._
- **What connects `titles`, `COLS`, `state` to the rest of the system?**
  _47 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `main` be split into smaller, more focused modules?**
  _Cohesion score 0.12477718360071301 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.10275689223057644 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13742071881606766 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._