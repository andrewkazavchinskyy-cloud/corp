# Graph Report - corp  (2026-08-17)

## Corpus Check
- 25 files · ~64,090 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 940 nodes · 2533 edges · 47 communities (42 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a7ed7de6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- die
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
- pinned_projects
- memory/README.md
- Corporation operating contract
- Server
- agent-isolation-smoke.sh
- corp-agent-exec
- provision-agent-identity.sh
- handle_tg_callback
- sortable.min.js
- run_issue
- main
- api_logic.py
- corp
- renderProject
- openSheet
- renderGraphs
- escapeHtml
- council_finish_analyze
- renderBoard
- _probe_isolation_inner
- probe_kind
- tg_short_ref
- Corporation OS — SPEC
- load_registry
- have
- Handoff — first hour
- renderAuto
- refresh
- main
- spec_gaps
- corp
- VPS QA 2026-08-17

## God Nodes (most connected - your core abstractions)
1. `2026-08-17` - 99 edges
2. `2026-08-16` - 57 edges
3. `escapeHtml()` - 31 edges
4. `call()` - 29 edges
5. `renderAuto()` - 28 edges
6. `setTab()` - 22 edges
7. `openSheet()` - 21 edges
8. `renderProject()` - 21 edges
9. `refresh()` - 21 edges
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

## Communities (47 total, 5 thin omitted)

### Community 0 - "die"
Cohesion: 0.19
Nodes (21): add_existing(), assign_me(), _clone_to_workspace(), CorpError, create_issue_rest(), create_project(), die(), ensure_label() (+13 more)

### Community 2 - "load_workshop"
Cohesion: 0.10
Nodes (37): approve_draft(), approve_drafts(), _clear_registry_overlay(), council_start(), default_workshop(), draft_by_id(), draft_issue_body(), draft_summaries() (+29 more)

### Community 3 - "Harness"
Cohesion: 0.22
Nodes (9): Bootstrap on a new device, Cycle, Graphify, Harness, Memory, Persistent runner, Planner, Research loop (+1 more)

### Community 4 - "app.py"
Cohesion: 0.06
Nodes (101): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+93 more)

### Community 5 - "app.js"
Cohesion: 0.09
Nodes (26): autoDraftChecked, autoUi, b64urlToBuf(), bufToB64url(), closeMore(), COL_HINT, COLS, graphsCache (+18 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.12
Nodes (16): Access, Add existing, Autopilot, Create new, Design / QA, Filter, Graphs, Locks (+8 more)

### Community 7 - "Path"
Cohesion: 0.11
Nodes (34): agent_argv(), auth_policy_present(), council_after_writer(), council_analyze_prompt(), council_deploy_trees(), council_ff_merge_main(), council_launch_analyzers(), council_qa_verdict() (+26 more)

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
Nodes (98): 2026-08-17, Assumptions, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions (+90 more)

### Community 12 - "project_dir"
Cohesion: 0.20
Nodes (16): active_projects(), bootstrap(), cycle_payload(), expand(), gh_ready(), graph_detail(), graphs_index(), is_pinned() (+8 more)

### Community 13 - "pinned_projects"
Cohesion: 0.22
Nodes (11): capture_pane(), council_scope(), last_log_lines(), log_line_matches_issue(), orch_alive(), orch_session(), orch_status(), pinned_projects() (+3 more)

### Community 16 - "Corporation operating contract"
Cohesion: 0.29
Nodes (6): Absolute Git preservation, Corporation operating contract, How to work, New projects, Session start, Source of truth

### Community 17 - "Server"
Cohesion: 0.29
Nodes (7): Agents, Deploy live additively, Server, Telegram, Two trees, Who does what, Workshop

### Community 18 - "agent-isolation-smoke.sh"
Cohesion: 0.83
Nodes (3): bad(), pass(), agent-isolation-smoke.sh script

### Community 21 - "handle_tg_callback"
Cohesion: 0.15
Nodes (31): council_busy(), handle_tg_callback(), handle_tg_reply(), handle_tg_text(), notify_safe(), queue_set_running(), telegram_tick(), tg_ask_qa_note() (+23 more)

### Community 22 - "sortable.min.js"
Cohesion: 0.12
Nodes (25): a(), b(), Bt(), D(), e(), f(), g(), h() (+17 more)

### Community 23 - "run_issue"
Cohesion: 0.11
Nodes (47): add_labels(), agent_prompt(), board_payload(), can_promote_to_qa(), claim(), close_action(), close_issue(), cmd_queue() (+39 more)

### Community 24 - "main"
Cohesion: 0.18
Nodes (21): archive_project(), doctor(), doctor_lines(), doctor_payload(), git_tree_report(), git_worktree_hint(), graph_age_of(), graph_freshness() (+13 more)

### Community 25 - "api_logic.py"
Cohesion: 0.12
Nodes (24): BaseException, assert_in_qa(), console_log_for_issue(), contour_fields(), graphify_pin_status(), graphify_summary(), isolation_fallback(), issue_waiting_qa() (+16 more)

### Community 26 - "corp"
Cohesion: 0.06
Nodes (49): config_dir(), council_existing_titles(), council_is_dup(), council_norm_title(), council_pick_items(), council_role_items(), default_slot(), github_issues_disabled() (+41 more)

### Community 27 - "renderProject"
Cohesion: 0.23
Nodes (13): cardMatches(), draftBatchBar(), draftMatches(), eventKindRu(), matchesQuery(), orchCard(), phoneNarrow(), renderFilters() (+5 more)

### Community 28 - "openSheet"
Cohesion: 0.13
Nodes (25): applyIssueLink(), autoStatusHtml(), bindBoardSortable(), bindSheetAct(), bindSheetHouse(), closeSheet(), colWord(), findCardByIssueParam() (+17 more)

### Community 29 - "renderGraphs"
Cohesion: 0.22
Nodes (16): bindGraphDetail(), bindGraphJumps(), bindGraphSearch(), findGroup(), flash(), graphDetailHtml(), graphGalaxyHtml(), graphJumps() (+8 more)

### Community 30 - "escapeHtml"
Cohesion: 0.18
Nodes (19): badge(), catalogKind(), contourTreesHtml(), doctorCheckLabel(), doctorChecksHtml(), doctorMeta(), draftCard(), escapeHtml() (+11 more)

### Community 31 - "council_finish_analyze"
Cohesion: 0.19
Nodes (14): append_log(), council_abort(), council_enqueue_refs(), council_finish_analyze(), council_issue_body(), council_load(), council_mark_phase(), council_save() (+6 more)

### Community 32 - "renderBoard"
Cohesion: 0.20
Nodes (17): autoProject(), cardClass(), cardHtml(), cookieGet(), cookieSet(), currentFilter(), goNext(), isPin() (+9 more)

### Community 33 - "_probe_isolation_inner"
Cohesion: 0.20
Nodes (16): agent_home_dir(), agent_identity_ready(), agent_user_name(), agent_wrapper_path(), isolation_probe_user(), isolation_secret_paths(), isolation_status(), isolation_wrapper_argv() (+8 more)

### Community 34 - "probe_kind"
Cohesion: 0.22
Nodes (14): _cli_identity(), _cursor_mismatch_note(), ensure_path(), _help_text(), kind_cli_ok(), _looks_like_model(), _models_from_json(), _parse_efforts() (+6 more)

### Community 35 - "tg_short_ref"
Cohesion: 0.11
Nodes (27): issue_ref(), load_events(), need_human(), queue_action_buttons(), redact_secrets(), sanitize_workshop(), tg_board_buttons(), tg_board_open() (+19 more)

### Community 36 - "Corporation OS — SPEC"
Cohesion: 0.20
Nodes (10): Compare shipped vs this spec, Corporation OS — SPEC, Handoff, Lifecycle, Non-goals, Pins vs registry, Planner, UI north star (+2 more)

### Community 37 - "load_registry"
Cohesion: 0.32
Nodes (8): load_registry(), merge_registry(), overlay_active(), overlay_diverges(), True only when overlay adds a project or changes a pin vs git registry., git registry.json is canonical. Overlay is emergency-only. Overlay may add…, _registry_overlay(), registry_status()

### Community 38 - "have"
Cohesion: 0.24
Nodes (13): allow_funnel_on(), funnel_enabled_from_text(), have(), launch_agent(), Funnel ON only from an explicit signal — never a Serve HTTPS URL., tailscale_status(), tmux_alive(), tmux_has() (+5 more)

### Community 39 - "Handoff — first hour"
Cohesion: 0.25
Nodes (8): 1. Tailscale, 2. Passkey, 3. SSH, 4. Two trees, 5. First job = sandbox, not P0, Backup (not git), Handoff — first hour, If you are stuck

### Community 40 - "renderAuto"
Cohesion: 0.23
Nodes (16): api(), approveDraftIds(), autoKicker(), bindAutoQueue(), bindDraftBatch(), bindDraftList(), moreTab(), paintDockMore() (+8 more)

### Community 41 - "refresh"
Cohesion: 0.40
Nodes (6): autoTyping(), boot(), refresh(), setupTokenFromUrl(), showApp(), showGate()

### Community 43 - "spec_gaps"
Cohesion: 0.50
Nodes (4): bullet_covered(), _norm_words(), spec_bullets(), spec_gaps()

### Community 44 - "corp"
Cohesion: 0.67
Nodes (3): corp, Документы, Команды

## Knowledge Gaps
- **233 isolated node(s):** `provision-agent-identity.sh script`, `titles`, `COLS`, `COL_HINT`, `HOME_TABS` (+228 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `2026-08-17` connect `2026-08-17` to `VPS QA 2026-08-17`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `provision-agent-identity.sh script`, `titles`, `COLS` to the rest of the system?**
  _233 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `load_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.1036036036036036 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.058442794593565585 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08866995073891626 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._