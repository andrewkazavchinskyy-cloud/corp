# Graph Report - corp  (2026-08-17)

## Corpus Check
- 25 files · ~66,017 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 966 nodes · 2595 edges · 43 communities (37 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aa49855a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- have
- load_workshop
- Harness
- app.py
- app.js
- Workshop operating contract
- Path
- Agent isolation (corp#41)
- 2026-08-15
- 2026-08-16
- 2026-08-17
- project_dir
- launch_agent
- memory/README.md
- Corporation operating contract
- Server
- agent-isolation-smoke.sh
- corp-agent-exec
- provision-agent-identity.sh
- _probe_isolation_inner
- sortable.min.js
- die
- agent_argv
- api_logic.py
- corp
- setTab
- openSheet
- renderGraphs
- escapeHtml
- council_after_writer
- renderBoard
- CorpError
- main
- tg_board_text
- Corporation OS — SPEC
- Handoff — first hour
- renderAuto
- refresh
- corp
- VPS QA 2026-08-17

## God Nodes (most connected - your core abstractions)
1. `2026-08-17` - 110 edges
2. `2026-08-16` - 57 edges
3. `escapeHtml()` - 31 edges
4. `call()` - 29 edges
5. `renderAuto()` - 28 edges
6. `refresh()` - 23 edges
7. `renderProject()` - 22 edges
8. `setTab()` - 21 edges
9. `openSheet()` - 21 edges
10. `renderGraphs()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `request_scheme()` --calls--> `is_loopback_host()`  [EXTRACTED]
  workshop/app.py → workshop/auth_policy.py
- `request_scheme()` --calls--> `trusted_scheme()`  [EXTRACTED]
  workshop/app.py → workshop/auth_policy.py
- `session_ok()` --calls--> `prune_auth_tables()`  [EXTRACTED]
  workshop/app.py → workshop/auth_policy.py
- `session_ok()` --calls--> `session_valid()`  [EXTRACTED]
  workshop/app.py → workshop/auth_policy.py
- `telegram_ok()` --calls--> `init_data_from_headers()`  [EXTRACTED]
  workshop/app.py → workshop/auth_policy.py

## Import Cycles
- None detected.

## Communities (43 total, 6 thin omitted)

### Community 0 - "have"
Cohesion: 0.13
Nodes (24): allow_funnel_on(), bootstrap(), _cli_identity(), _cursor_mismatch_note(), ensure_path(), funnel_enabled_from_text(), gh_ready(), have() (+16 more)

### Community 2 - "load_workshop"
Cohesion: 0.06
Nodes (67): _clear_registry_overlay(), council_busy(), council_existing_titles(), council_start(), default_workshop(), draft_summaries(), drop_draft(), handle_tg_reply() (+59 more)

### Community 3 - "Harness"
Cohesion: 0.22
Nodes (9): Bootstrap on a new device, Cycle, Graphify, Harness, Memory, Persistent runner, Planner, Research loop (+1 more)

### Community 4 - "app.py"
Cohesion: 0.06
Nodes (101): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+93 more)

### Community 5 - "app.js"
Cohesion: 0.09
Nodes (25): autoDraftChecked, autoUi, b64urlToBuf(), bufToB64url(), COL_HINT, COLS, graphsCache, HOME_TABS (+17 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.12
Nodes (16): Access, Add existing, Autopilot, Create new, Design / QA, Filter, Graphs, Locks (+8 more)

### Community 7 - "Path"
Cohesion: 0.11
Nodes (39): agent_prompt(), auth_policy_present(), council_deploy_trees(), doctor(), doctor_lines(), doctor_payload(), git_head_commit_time(), git_registry_candidates() (+31 more)

### Community 8 - "Agent isolation (corp#41)"
Cohesion: 0.25
Nodes (8): Agent isolation (corp#41), Model, Provisioning (root, once per VPS), Remaining blockers (do not arm), Risk / staged rollout, Rollback, Smoke check, Two modes in `bin/corp`

### Community 9 - "2026-08-15"
Cohesion: 0.25
Nodes (7): 2026-08-15, corp#1 — Graphify active projects (VPS session), Decisions, Later, Open questions, Outcome, Request

### Community 10 - "2026-08-16"
Cohesion: 0.03
Nodes (57): 2026-08-16, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions (+49 more)

### Community 11 - "2026-08-17"
Cohesion: 0.02
Nodes (109): 2026-08-17, Assumptions, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions (+101 more)

### Community 12 - "project_dir"
Cohesion: 0.16
Nodes (18): active_projects(), collect_issues(), cycle_payload(), expand(), graph_detail(), graphs_index(), is_free_ready(), is_pinned() (+10 more)

### Community 13 - "launch_agent"
Cohesion: 0.19
Nodes (17): capture_pane(), council_scope(), launch_agent(), orch_alive(), orch_session(), orch_status(), parse_exit_code(), pinned_projects() (+9 more)

### Community 16 - "Corporation operating contract"
Cohesion: 0.29
Nodes (6): Absolute Git preservation, Corporation operating contract, How to work, New projects, Session start, Source of truth

### Community 17 - "Server"
Cohesion: 0.29
Nodes (7): Agents, Deploy live additively, Server, Telegram, Two trees, Who does what, Workshop

### Community 18 - "agent-isolation-smoke.sh"
Cohesion: 0.83
Nodes (3): bad(), pass(), agent-isolation-smoke.sh script

### Community 21 - "_probe_isolation_inner"
Cohesion: 0.20
Nodes (16): agent_home_dir(), agent_identity_ready(), agent_user_name(), agent_wrapper_path(), isolation_probe_user(), isolation_secret_paths(), isolation_status(), isolation_wrapper_argv() (+8 more)

### Community 22 - "sortable.min.js"
Cohesion: 0.12
Nodes (25): a(), b(), Bt(), D(), e(), f(), g(), h() (+17 more)

### Community 23 - "die"
Cohesion: 0.06
Nodes (111): add_existing(), add_labels(), approve_draft(), approve_drafts(), archive_project(), assign_me(), board_payload(), can_promote_to_qa() (+103 more)

### Community 24 - "agent_argv"
Cohesion: 0.24
Nodes (10): agent_argv(), config_dir(), council_analyze_prompt(), council_role_brief(), council_role_items(), council_run_role_sync(), council_spawn_role(), parse_json_array() (+2 more)

### Community 25 - "api_logic.py"
Cohesion: 0.12
Nodes (24): BaseException, assert_in_qa(), console_log_for_issue(), contour_fields(), graphify_pin_status(), graphify_summary(), isolation_fallback(), issue_waiting_qa() (+16 more)

### Community 26 - "corp"
Cohesion: 0.07
Nodes (38): bullet_covered(), council_is_dup(), council_norm_title(), council_pick_items(), github_issues_disabled(), github_transient(), issues_for(), _issues_via_graphql() (+30 more)

### Community 27 - "setTab"
Cohesion: 0.38
Nodes (7): autoKicker(), closeMore(), moreTab(), paintDockMore(), setSettingsRoom(), setTab(), toggleMore()

### Community 28 - "openSheet"
Cohesion: 0.16
Nodes (21): applyIssueLink(), autoStatusHtml(), bindSheetAct(), findCardByIssueParam(), githubLink(), hideSheet(), humanizeError(), humanReason() (+13 more)

### Community 29 - "renderGraphs"
Cohesion: 0.22
Nodes (16): bindGraphDetail(), bindGraphJumps(), bindGraphSearch(), findGroup(), flash(), graphDetailHtml(), graphGalaxyHtml(), graphJumps() (+8 more)

### Community 30 - "escapeHtml"
Cohesion: 0.22
Nodes (16): catalogKind(), contourTreesHtml(), doctorCheckLabel(), doctorChecksHtml(), doctorMeta(), escapeHtml(), fillProfiles(), kindStatus() (+8 more)

### Community 31 - "council_after_writer"
Cohesion: 0.14
Nodes (20): append_log(), council_abort(), council_after_writer(), council_enqueue_refs(), council_ff_merge_main(), council_finish_analyze(), council_issue_body(), council_launch_analyzers() (+12 more)

### Community 32 - "renderBoard"
Cohesion: 0.24
Nodes (14): badge(), cardClass(), cardHtml(), cardMatches(), cookieGet(), currentFilter(), draftMatches(), matchesQuery() (+6 more)

### Community 35 - "tg_board_text"
Cohesion: 0.18
Nodes (15): tg_board_buttons(), tg_board_counts(), tg_board_filter(), tg_board_find(), tg_board_open(), tg_board_page_bounds(), tg_board_pick(), tg_board_pin_names() (+7 more)

### Community 36 - "Corporation OS — SPEC"
Cohesion: 0.20
Nodes (10): Compare shipped vs this spec, Corporation OS — SPEC, Handoff, Lifecycle, Non-goals, Pins vs registry, Planner, UI north star (+2 more)

### Community 39 - "Handoff — first hour"
Cohesion: 0.25
Nodes (8): 1. Tailscale, 2. Passkey, 3. SSH, 4. Two trees, 5. First job = sandbox, not P0, Backup (not git), Handoff — first hour, If you are stuck

### Community 40 - "renderAuto"
Cohesion: 0.13
Nodes (26): approveDraftIds(), autoProject(), bindDraftBatch(), bindDraftList(), cookieSet(), draftBatchBar(), draftCard(), eventKindRu() (+18 more)

### Community 41 - "refresh"
Cohesion: 0.23
Nodes (14): api(), autoTyping(), bindAutoQueue(), bindBoardSortable(), bindSheetHouse(), boot(), closeSheet(), colWord() (+6 more)

### Community 44 - "corp"
Cohesion: 0.67
Nodes (3): corp, Документы, Команды

## Knowledge Gaps
- **244 isolated node(s):** `provision-agent-identity.sh script`, `titles`, `COLS`, `COL_HINT`, `HOME_TABS` (+239 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `2026-08-17` connect `2026-08-17` to `VPS QA 2026-08-17`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `provision-agent-identity.sh script`, `titles`, `COLS` to the rest of the system?**
  _244 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `have` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._
- **Should `load_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.06377204884667571 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.058442794593565585 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08994708994708994 - nodes in this community are weakly interconnected._