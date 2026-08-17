# Graph Report - corp  (2026-08-17)

## Corpus Check
- 25 files · ~62,410 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 916 nodes · 2483 edges · 47 communities (42 shown, 5 thin omitted)
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
- CorpError
- orchestrate
- memory/README.md
- Corporation operating contract
- Server
- agent-isolation-smoke.sh
- corp-agent-exec
- provision-agent-identity.sh
- handle_tg_callback
- sortable.min.js
- run_issue
- queue_add
- api_logic.py
- corp
- refresh
- openSheet
- renderGraphs
- escapeHtml
- council_after_writer
- currentFilter
- renderAuto
- probe_kind
- notify
- Corporation OS — SPEC
- redact_secrets
- tg_cmd_now
- Handoff — first hour
- setTab
- overlay_diverges
- tailscale_status
- council_is_dup
- corp
- VPS QA 2026-08-17

## God Nodes (most connected - your core abstractions)
1. `2026-08-17` - 89 edges
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

## Communities (47 total, 5 thin omitted)

### Community 0 - "die"
Cohesion: 0.09
Nodes (50): active_projects(), add_existing(), approve_draft(), approve_drafts(), archive_project(), bootstrap(), _clone_to_workspace(), cmd_queue() (+42 more)

### Community 2 - "load_workshop"
Cohesion: 0.12
Nodes (28): _clear_registry_overlay(), _cursor_mismatch_note(), default_workshop(), draft_by_id(), draft_summaries(), drop_draft(), load_catalog(), load_workshop() (+20 more)

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
Cohesion: 0.07
Nodes (56): agent_home_dir(), agent_identity_ready(), agent_user_name(), agent_wrapper_path(), auth_policy_present(), bullet_covered(), council_deploy_trees(), doctor() (+48 more)

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
Nodes (88): 2026-08-17, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions (+80 more)

### Community 13 - "orchestrate"
Cohesion: 0.08
Nodes (41): agent_argv(), append_log(), capture_pane(), config_dir(), council_analyze_prompt(), council_existing_titles(), council_launch_analyzers(), council_role_brief() (+33 more)

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
Cohesion: 0.13
Nodes (39): council_busy(), handle_tg_callback(), handle_tg_reply(), handle_tg_text(), issue_ref(), notify_safe(), pulse_loop(), telegram_tick() (+31 more)

### Community 22 - "sortable.min.js"
Cohesion: 0.13
Nodes (27): a(), b(), Bt(), D(), e(), f(), g(), h() (+19 more)

### Community 23 - "run_issue"
Cohesion: 0.15
Nodes (31): add_labels(), agent_prompt(), assign_me(), can_promote_to_qa(), claim(), close_action(), close_issue(), comment() (+23 more)

### Community 24 - "queue_add"
Cohesion: 0.13
Nodes (29): board_payload(), collect_issues(), column_of(), cycle_payload(), drop_self(), github_issues_disabled(), github_transient(), is_free_ready() (+21 more)

### Community 25 - "api_logic.py"
Cohesion: 0.12
Nodes (24): BaseException, assert_in_qa(), console_log_for_issue(), contour_fields(), graphify_pin_status(), graphify_summary(), isolation_fallback(), issue_waiting_qa() (+16 more)

### Community 26 - "corp"
Cohesion: 0.10
Nodes (16): parse_exit_code(), queue_action_buttons(), queue_decision(), read_tmux_exit(), reap_queue(), tg_board_open(), tg_card_labels(), tg_cmd_drafts() (+8 more)

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

### Community 31 - "council_after_writer"
Cohesion: 0.19
Nodes (15): council_abort(), council_after_writer(), council_enqueue_refs(), council_ff_merge_main(), council_finish_analyze(), council_issue_body(), council_load(), council_mark_phase() (+7 more)

### Community 32 - "currentFilter"
Cohesion: 0.24
Nodes (14): badge(), cardClass(), cardHtml(), cardMatches(), cookieGet(), currentFilter(), draftMatches(), matchesQuery() (+6 more)

### Community 33 - "renderAuto"
Cohesion: 0.26
Nodes (12): autoProject(), cookieSet(), goNext(), isPin(), liveLabel(), parseModelPick(), phoneNarrow(), pinNames() (+4 more)

### Community 34 - "probe_kind"
Cohesion: 0.31
Nodes (10): _cli_identity(), _help_text(), _looks_like_model(), _models_from_json(), _parse_efforts(), _parse_models(), _probe_cli_identity(), probe_kind() (+2 more)

### Community 35 - "notify"
Cohesion: 0.24
Nodes (10): ensure_path(), load_env(), notify(), tg_command_menu(), tg_creds(), tg_install_commands(), tg_install_menu_button(), tg_menu_button_payload() (+2 more)

### Community 36 - "Corporation OS — SPEC"
Cohesion: 0.20
Nodes (10): Compare shipped vs this spec, Corporation OS — SPEC, Handoff, Lifecycle, Non-goals, Pins vs registry, Planner, UI north star (+2 more)

### Community 37 - "redact_secrets"
Cohesion: 0.22
Nodes (9): last_log_lines(), load_events(), log_line_matches_issue(), redact_secrets(), sanitize_workshop(), session_notes(), tg_iso_line(), tg_pulse_card() (+1 more)

### Community 38 - "tg_cmd_now"
Cohesion: 0.22
Nodes (9): tg_cmd_doctor(), tg_cmd_now(), tg_cmd_queue(), tg_cmd_running(), tg_cmd_status(), tg_council_line(), tg_council_phase_ru(), tg_last_queue_error() (+1 more)

### Community 39 - "Handoff — first hour"
Cohesion: 0.25
Nodes (8): 1. Tailscale, 2. Passkey, 3. SSH, 4. Two trees, 5. First job = sandbox, not P0, Backup (not git), Handoff — first hour, If you are stuck

### Community 40 - "setTab"
Cohesion: 0.38
Nodes (7): autoKicker(), closeMore(), moreTab(), paintDockMore(), setSettingsRoom(), setTab(), toggleMore()

### Community 41 - "overlay_diverges"
Cohesion: 0.50
Nodes (5): overlay_active(), overlay_diverges(), True only when overlay adds a project or changes a pin vs git registry., _registry_overlay(), registry_status()

### Community 42 - "tailscale_status"
Cohesion: 0.50
Nodes (4): allow_funnel_on(), funnel_enabled_from_text(), Funnel ON only from an explicit signal — never a Serve HTTPS URL., tailscale_status()

### Community 43 - "council_is_dup"
Cohesion: 0.67
Nodes (3): council_is_dup(), council_norm_title(), council_pick_items()

### Community 44 - "corp"
Cohesion: 0.67
Nodes (3): corp, Документы, Команды

## Knowledge Gaps
- **223 isolated node(s):** `provision-agent-identity.sh script`, `titles`, `COLS`, `COL_HINT`, `HOME_TABS` (+218 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `2026-08-17` connect `2026-08-17` to `VPS QA 2026-08-17`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `provision-agent-identity.sh script`, `titles`, `COLS` to the rest of the system?**
  _223 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `die` be split into smaller, more focused modules?**
  _Cohesion score 0.09061224489795919 - nodes in this community are weakly interconnected._
- **Should `load_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.12433862433862433 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.058442794593565585 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09116809116809117 - nodes in this community are weakly interconnected._