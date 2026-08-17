# Graph Report - corp  (2026-08-17)

## Corpus Check
- 25 files · ~63,061 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 924 nodes · 2491 edges · 46 communities (41 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `30214b63`
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
- launch_agent
- memory/README.md
- Corporation operating contract
- Server
- agent-isolation-smoke.sh
- corp-agent-exec
- provision-agent-identity.sh
- handle_tg_callback
- sortable.min.js
- queue_add
- board_payload
- api_logic.py
- corp
- refresh
- openSheet
- renderGraphs
- escapeHtml
- run_issue
- currentFilter
- renderAuto
- run
- tg_short_ref
- Corporation OS — SPEC
- approve_draft
- tg_cmd_now
- Handoff — first hour
- setTab
- agent_argv
- main
- corp
- VPS QA 2026-08-17

## God Nodes (most connected - your core abstractions)
1. `2026-08-17` - 97 edges
2. `2026-08-16` - 57 edges
3. `escapeHtml()` - 31 edges
4. `call()` - 29 edges
5. `renderAuto()` - 26 edges
6. `setTab()` - 22 edges
7. `openSheet()` - 21 edges
8. `refresh()` - 21 edges
9. `renderProject()` - 20 edges
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

## Communities (46 total, 5 thin omitted)

### Community 0 - "die"
Cohesion: 0.14
Nodes (27): add_existing(), archive_project(), _clone_to_workspace(), CorpError, create_project(), die(), ensure_path(), ensure_seed_labels() (+19 more)

### Community 2 - "load_workshop"
Cohesion: 0.13
Nodes (30): _clear_registry_overlay(), cmd_queue(), default_workshop(), draft_by_id(), draft_summaries(), drop_draft(), load_catalog(), load_workshop() (+22 more)

### Community 3 - "Harness"
Cohesion: 0.22
Nodes (9): Bootstrap on a new device, Cycle, Graphify, Harness, Memory, Persistent runner, Planner, Research loop (+1 more)

### Community 4 - "app.py"
Cohesion: 0.06
Nodes (101): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+93 more)

### Community 5 - "app.js"
Cohesion: 0.09
Nodes (24): applyIssueLink(), autoDraftChecked, autoUi, b64urlToBuf(), bufToB64url(), COL_HINT, COLS, graphsCache (+16 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.12
Nodes (16): Access, Add existing, Autopilot, Create new, Design / QA, Filter, Graphs, Locks (+8 more)

### Community 7 - "Path"
Cohesion: 0.10
Nodes (45): agent_home_dir(), agent_identity_ready(), agent_user_name(), agent_wrapper_path(), auth_policy_present(), council_deploy_trees(), doctor(), doctor_lines() (+37 more)

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
Nodes (96): 2026-08-17, Assumptions, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions (+88 more)

### Community 12 - "project_dir"
Cohesion: 0.17
Nodes (16): active_projects(), cycle_payload(), expand(), graph_detail(), graphs_index(), is_free_ready(), is_pinned(), parse_graph_report() (+8 more)

### Community 13 - "launch_agent"
Cohesion: 0.21
Nodes (15): capture_pane(), council_scope(), launch_agent(), orch_alive(), orch_session(), orch_status(), pinned_projects(), tg_agent_rows() (+7 more)

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
Cohesion: 0.17
Nodes (26): close_action(), council_busy(), handle_tg_callback(), handle_tg_text(), notify_safe(), tg_board_buttons(), tg_card_labels(), tg_cmd_abort() (+18 more)

### Community 22 - "sortable.min.js"
Cohesion: 0.13
Nodes (27): a(), b(), Bt(), D(), e(), f(), g(), h() (+19 more)

### Community 23 - "queue_add"
Cohesion: 0.26
Nodes (19): add_labels(), assign_me(), claim(), comment(), drop_self(), get_issue(), _gh_ok(), invalidate_board() (+11 more)

### Community 24 - "board_payload"
Cohesion: 0.14
Nodes (23): board_payload(), collect_issues(), column_of(), github_issues_disabled(), github_transient(), issue_eligibility(), issues_enabled(), issues_for() (+15 more)

### Community 25 - "api_logic.py"
Cohesion: 0.12
Nodes (24): BaseException, assert_in_qa(), console_log_for_issue(), contour_fields(), graphify_pin_status(), graphify_summary(), isolation_fallback(), issue_waiting_qa() (+16 more)

### Community 26 - "corp"
Cohesion: 0.08
Nodes (37): bullet_covered(), council_is_dup(), council_norm_title(), council_pick_items(), council_role_items(), default_slot(), git_worktree_hint(), graph_age_of() (+29 more)

### Community 27 - "refresh"
Cohesion: 0.15
Nodes (22): api(), approveDraftIds(), autoTyping(), bindAutoQueue(), bindDraftBatch(), bindDraftList(), boot(), draftBatchBar() (+14 more)

### Community 28 - "openSheet"
Cohesion: 0.16
Nodes (21): autoStatusHtml(), bindBoardSortable(), bindSheetAct(), bindSheetHouse(), closeSheet(), colWord(), findCardByIssueParam(), githubLink() (+13 more)

### Community 29 - "renderGraphs"
Cohesion: 0.22
Nodes (16): bindGraphDetail(), bindGraphJumps(), bindGraphSearch(), findGroup(), flash(), graphDetailHtml(), graphGalaxyHtml(), graphJumps() (+8 more)

### Community 30 - "escapeHtml"
Cohesion: 0.22
Nodes (16): catalogKind(), contourTreesHtml(), doctorCheckLabel(), doctorChecksHtml(), doctorMeta(), escapeHtml(), fillProfiles(), kindStatus() (+8 more)

### Community 31 - "run_issue"
Cohesion: 0.09
Nodes (38): agent_prompt(), append_log(), can_promote_to_qa(), close_issue(), council_abort(), council_after_writer(), council_enqueue_refs(), council_existing_titles() (+30 more)

### Community 32 - "currentFilter"
Cohesion: 0.24
Nodes (14): badge(), cardClass(), cardHtml(), cardMatches(), cookieGet(), currentFilter(), draftMatches(), matchesQuery() (+6 more)

### Community 33 - "renderAuto"
Cohesion: 0.26
Nodes (12): autoProject(), cookieSet(), goNext(), isPin(), liveLabel(), parseModelPick(), phoneNarrow(), pinNames() (+4 more)

### Community 34 - "run"
Cohesion: 0.11
Nodes (31): allow_funnel_on(), bootstrap(), _cli_identity(), create_issue_rest(), _cursor_mismatch_note(), ensure_label(), funnel_enabled_from_text(), gh_ready() (+23 more)

### Community 35 - "tg_short_ref"
Cohesion: 0.12
Nodes (25): handle_tg_reply(), need_human(), notify(), redact_secrets(), telegram_tick(), tg_ask_qa_note(), tg_board_text(), tg_card() (+17 more)

### Community 36 - "Corporation OS — SPEC"
Cohesion: 0.20
Nodes (10): Compare shipped vs this spec, Corporation OS — SPEC, Handoff, Lifecycle, Non-goals, Pins vs registry, Planner, UI north star (+2 more)

### Community 37 - "approve_draft"
Cohesion: 0.25
Nodes (8): approve_draft(), approve_drafts(), draft_issue_body(), load_registry(), merge_registry(), queue_status(), git registry.json is canonical. Overlay is emergency-only. Overlay may add…, tg_cmd_council_yes()

### Community 38 - "tg_cmd_now"
Cohesion: 0.22
Nodes (9): tg_cmd_doctor(), tg_cmd_now(), tg_cmd_queue(), tg_cmd_running(), tg_cmd_status(), tg_council_line(), tg_council_phase_ru(), tg_last_queue_error() (+1 more)

### Community 39 - "Handoff — first hour"
Cohesion: 0.25
Nodes (8): 1. Tailscale, 2. Passkey, 3. SSH, 4. Two trees, 5. First job = sandbox, not P0, Backup (not git), Handoff — first hour, If you are stuck

### Community 40 - "setTab"
Cohesion: 0.38
Nodes (7): autoKicker(), closeMore(), moreTab(), paintDockMore(), setSettingsRoom(), setTab(), toggleMore()

### Community 41 - "agent_argv"
Cohesion: 0.47
Nodes (6): agent_argv(), config_dir(), council_analyze_prompt(), council_role_brief(), council_run_role_sync(), council_spawn_role()

### Community 44 - "corp"
Cohesion: 0.67
Nodes (3): corp, Документы, Команды

## Knowledge Gaps
- **231 isolated node(s):** `provision-agent-identity.sh script`, `titles`, `COLS`, `COL_HINT`, `HOME_TABS` (+226 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Why does `2026-08-17` connect `2026-08-17` to `VPS QA 2026-08-17`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `provision-agent-identity.sh script`, `titles`, `COLS` to the rest of the system?**
  _231 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `die` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `load_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.1310344827586207 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.058442794593565585 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09116809116809117 - nodes in this community are weakly interconnected._