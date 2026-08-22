# Graph Report - corp  (2026-08-23)

## Corpus Check
- 32 files · ~75,453 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1085 nodes · 2895 edges · 55 communities (49 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `53725358`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- tmux_alive
- load_workshop
- Harness
- app.py
- app.js
- Workshop operating contract
- pin_research
- Agent isolation (corp#41)
- 2026-08-15
- 2026-08-16
- 2026-08-17
- refresh
- run
- memory/README.md
- Corporation operating contract
- Server
- agent-isolation-smoke.sh
- corp-agent-exec
- provision-agent-identity.sh
- run_issue
- sortable.min.js
- cmd_queue
- _probe_isolation_inner
- api_logic.py
- corp
- setTab
- openSheet
- renderGraphs
- escapeHtml
- council_save
- renderAuto
- Path
- have
- tg_board_text
- Corporation OS — SPEC
- tg_more_buttons
- tg_notify_event
- Handoff — first hour
- tailscale_status
- handle_tg_callback
- corp
- VPS QA 2026-08-17
- 2026-08-23 — Продолжение циклов улучшений corp
- main
- 2026-08-18
- redact_secrets
- approve_draft
- 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений
- install.sh
- backend.sh
- start.sh
- council_after_writer

## God Nodes (most connected - your core abstractions)
1. `2026-08-17` - 118 edges
2. `2026-08-16` - 57 edges
3. `call()` - 31 edges
4. `escapeHtml()` - 31 edges
5. `renderAuto()` - 29 edges
6. `refresh()` - 23 edges
7. `renderProject()` - 22 edges
8. `setTab()` - 21 edges
9. `openSheet()` - 21 edges
10. `api()` - 16 edges

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

## Communities (55 total, 6 thin omitted)

### Community 0 - "tmux_alive"
Cohesion: 0.60
Nodes (6): _launch_agent_inner(), tmux_agent_script(), tmux_alive(), tmux_kill(), tmux_session(), wait_tmux()

### Community 2 - "load_workshop"
Cohesion: 0.12
Nodes (37): _assemble_board(), board_key(), board_payload(), cached_research(), clear_board_overlay(), _clear_registry_overlay(), collect_issues(), draft_by_id() (+29 more)

### Community 3 - "Harness"
Cohesion: 0.22
Nodes (9): Bootstrap on a new device, Cycle, Graphify, Harness, Memory, Persistent runner, Planner, Research loop (+1 more)

### Community 4 - "app.py"
Cohesion: 0.05
Nodes (106): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+98 more)

### Community 5 - "app.js"
Cohesion: 0.09
Nodes (28): applyOptimistic(), autoDraftChecked, autoUi, b64urlToBuf(), bufToB64url(), cardByIssue(), COL_HINT, COLS (+20 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.12
Nodes (16): Access, Add existing, Autopilot, Create new, Design / QA, Filter, Graphs, Locks (+8 more)

### Community 7 - "pin_research"
Cohesion: 0.17
Nodes (16): bullet_covered(), bullet_in_code(), _code_corpus(), doctor(), doctor_lines(), git_worktree_hint(), graph_age_of(), graph_freshness() (+8 more)

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
Nodes (117): 2026-08-17, Assumptions, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions (+109 more)

### Community 12 - "refresh"
Cohesion: 0.17
Nodes (19): api(), approveDraftIds(), bindDraftBatch(), bindDraftList(), boot(), draftBatchBar(), eventKindRu(), orchCard() (+11 more)

### Community 13 - "run"
Cohesion: 0.22
Nodes (20): add_existing(), archive_project(), bootstrap(), classify_writer_tree(), _clone_to_workspace(), create_issue_rest(), create_project(), die() (+12 more)

### Community 16 - "Corporation operating contract"
Cohesion: 0.29
Nodes (6): Absolute Git preservation, Corporation operating contract, How to work, New projects, Session start, Source of truth

### Community 17 - "Server"
Cohesion: 0.29
Nodes (7): Agents, Deploy live additively, Server, Telegram, Two trees, Who does what, Workshop

### Community 18 - "agent-isolation-smoke.sh"
Cohesion: 0.83
Nodes (3): bad(), pass(), agent-isolation-smoke.sh script

### Community 21 - "run_issue"
Cohesion: 0.07
Nodes (65): add_labels(), append_log(), assign_me(), board_click(), can_promote_to_qa(), _card_waiting_qa(), claim(), _claim_age_for() (+57 more)

### Community 22 - "sortable.min.js"
Cohesion: 0.12
Nodes (25): a(), b(), Bt(), D(), e(), f(), g(), h() (+17 more)

### Community 23 - "cmd_queue"
Cohesion: 0.17
Nodes (13): cmd_queue(), default_workshop(), queue_abort(), queue_decision(), queue_item(), queue_rm(), queue_status(), propose → approve → queue → reap → rollback. No gh, tmux, or paid agent. (+5 more)

### Community 24 - "_probe_isolation_inner"
Cohesion: 0.20
Nodes (16): agent_home_dir(), agent_identity_ready(), agent_user_name(), agent_wrapper_path(), isolation_probe_user(), isolation_secret_paths(), isolation_status(), isolation_wrapper_argv() (+8 more)

### Community 25 - "api_logic.py"
Cohesion: 0.12
Nodes (24): BaseException, assert_in_qa(), console_log_for_issue(), contour_fields(), graphify_pin_status(), graphify_summary(), isolation_fallback(), issue_waiting_qa() (+16 more)

### Community 26 - "corp"
Cohesion: 0.05
Nodes (63): capture_pane(), council_existing_titles(), council_is_dup(), council_issue_body(), council_norm_title(), council_pick_items(), council_role_items(), _cursor_mismatch_note() (+55 more)

### Community 27 - "setTab"
Cohesion: 0.38
Nodes (7): autoKicker(), closeMore(), moreTab(), paintDockMore(), setSettingsRoom(), setTab(), toggleMore()

### Community 28 - "openSheet"
Cohesion: 0.11
Nodes (31): applyIssueLink(), autoStatusHtml(), bindAutoQueue(), bindBoardSortable(), bindSheetAct(), bindSheetHouse(), closeSheet(), colWord() (+23 more)

### Community 29 - "renderGraphs"
Cohesion: 0.22
Nodes (16): bindGraphDetail(), bindGraphJumps(), bindGraphSearch(), findGroup(), flash(), graphDetailHtml(), graphGalaxyHtml(), graphJumps() (+8 more)

### Community 30 - "escapeHtml"
Cohesion: 0.16
Nodes (21): badge(), cardClass(), cardHtml(), catalogKind(), contourTreesHtml(), doctorCheckLabel(), doctorChecksHtml(), doctorMeta() (+13 more)

### Community 31 - "council_save"
Cohesion: 0.38
Nodes (7): council_abort(), council_load(), council_mark_phase(), council_save(), council_session(), council_tick(), council_tmux_map()

### Community 32 - "renderAuto"
Cohesion: 0.16
Nodes (25): autoProject(), autoTyping(), cardMatches(), cookieGet(), cookieSet(), currentFilter(), draftMatches(), goNext() (+17 more)

### Community 33 - "Path"
Cohesion: 0.16
Nodes (28): agent_prompt(), auth_policy_present(), council_deploy_trees(), doctor_payload(), git_head_commit_time(), git_registry_candidates(), git_tree_report(), live_corp_path() (+20 more)

### Community 34 - "have"
Cohesion: 0.16
Nodes (20): _cli_identity(), ensure_path(), have(), _help_text(), kind_cli_ok(), load_env(), _looks_like_model(), _models_from_json() (+12 more)

### Community 35 - "tg_board_text"
Cohesion: 0.19
Nodes (13): tg_board_buttons(), tg_board_counts(), tg_board_filter(), tg_board_find(), tg_board_open(), tg_board_page_bounds(), tg_board_pick(), tg_board_pin_names() (+5 more)

### Community 36 - "Corporation OS — SPEC"
Cohesion: 0.20
Nodes (10): Compare shipped vs this spec, Corporation OS — SPEC, Handoff, Lifecycle, Non-goals, Pins vs registry, Planner, UI north star (+2 more)

### Community 37 - "tg_more_buttons"
Cohesion: 0.22
Nodes (9): tg_command_menu(), tg_draft_buttons(), tg_install_commands(), tg_install_menu_button(), tg_menu_button_payload(), tg_more_buttons(), tg_shop_url(), tg_web_app_url() (+1 more)

### Community 38 - "tg_notify_event"
Cohesion: 0.27
Nodes (11): need_human(), parse_issue_ref(), tg_board_card_buttons(), tg_card_labels(), tg_cmd_retry(), tg_event_buttons(), tg_github_issue_url(), tg_need_human_buttons() (+3 more)

### Community 39 - "Handoff — first hour"
Cohesion: 0.25
Nodes (8): 1. Tailscale, 2. Passkey, 3. SSH, 4. Two trees, 5. First job = sandbox, not P0, Backup (not git), Handoff — first hour, If you are stuck

### Community 40 - "tailscale_status"
Cohesion: 0.50
Nodes (4): allow_funnel_on(), funnel_enabled_from_text(), Funnel ON only from an explicit signal — never a Serve HTTPS URL., tailscale_status()

### Community 42 - "handle_tg_callback"
Cohesion: 0.18
Nodes (31): council_busy(), council_finish_analyze(), council_scope(), council_start(), handle_tg_callback(), handle_tg_reply(), handle_tg_text(), queue_set_running() (+23 more)

### Community 44 - "corp"
Cohesion: 0.67
Nodes (3): corp, Документы, Команды

### Community 48 - "2026-08-23 — Продолжение циклов улучшений corp"
Cohesion: 0.25
Nodes (7): 2026-08-23 — Продолжение циклов улучшений corp, Далее, Инциденты среды (не код), Контекст, Разблокировка проекта, Решения, Цикл 1 — #126 TG-пейджер — DONE

### Community 49 - "main"
Cohesion: 0.16
Nodes (20): active_projects(), cycle_payload(), expand(), graph_detail(), graphs_index(), hide_project(), main(), parse_graph_report() (+12 more)

### Community 50 - "2026-08-18"
Cohesion: 0.14
Nodes (13): 2026-08-18, Decisions, Open questions, Outcome, Outcome, Outcome, Outcome, Outcome (+5 more)

### Community 51 - "redact_secrets"
Cohesion: 0.14
Nodes (23): issue_detail(), notify(), notify_safe(), redact_secrets(), sanitize_workshop(), telegram_tick(), tg_bot_auth_ok(), tg_clip() (+15 more)

### Community 52 - "approve_draft"
Cohesion: 0.14
Nodes (16): approve_draft(), approve_drafts(), draft_issue_body(), load_registry(), merge_registry(), overlay_active(), overlay_diverges(), True only when overlay adds a project or changes a pin vs git registry. (+8 more)

### Community 54 - "2026-08-22 — PO-сессия: аудит продукта и циклы улучшений"
Cohesion: 0.18
Nodes (10): 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений, Далее по очереди, Контекст, Открытые вопросы, Пакет Issues (все `ready`, с приоритетами), Решения и находки, Сделано, Цикл 1 — #122 writers ff-only guard — DONE (+2 more)

### Community 55 - "install.sh"
Cohesion: 0.33
Nodes (5): log(), PATH, PGHOST, PGPORT, install.sh script

### Community 59 - "council_after_writer"
Cohesion: 0.16
Nodes (14): agent_argv(), config_dir(), council_after_writer(), council_analyze_prompt(), council_ff_merge_main(), council_launch_analyzers(), council_qa_verdict(), council_review_prompt() (+6 more)

## Knowledge Gaps
- **283 isolated node(s):** `backend.sh script`, `PATH`, `PGHOST`, `PGPORT`, `start.sh script` (+278 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `g()` connect `sortable.min.js` to `run`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `backend.sh script`, `PATH`, `PGHOST` to the rest of the system?**
  _283 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `load_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.11711711711711711 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.05157493942540672 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08602150537634409 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._