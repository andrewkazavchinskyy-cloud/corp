# Graph Report - corp  (2026-08-23)

## Corpus Check
- 32 files · ~75,010 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1081 nodes · 2882 edges · 59 communities (52 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f3e6f75b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- tmux_alive
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
- refresh
- die
- memory/README.md
- Corporation operating contract
- Server
- agent-isolation-smoke.sh
- corp-agent-exec
- provision-agent-identity.sh
- run_issue
- sortable.min.js
- tg_cmd_now
- _probe_isolation_inner
- api_logic.py
- corp
- setTab
- openSheet
- renderGraphs
- escapeHtml
- council_after_writer
- renderBoard
- doctor_payload
- run
- tg_upsert_board
- Corporation OS — SPEC
- council_start
- tg_notify_event
- Handoff — first hour
- renderAuto
- tg_home_payload
- handle_tg_callback
- write
- corp
- VPS QA 2026-08-17
- _github_cards
- 2026-08-23 — Продолжение циклов улучшений corp
- project_dir
- 2026-08-18
- redact_secrets
- load_registry
- tg_screen
- 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений
- install.sh
- backend.sh
- start.sh
- main

## God Nodes (most connected - your core abstractions)
1. `2026-08-17` - 118 edges
2. `2026-08-16` - 57 edges
3. `escapeHtml()` - 31 edges
4. `call()` - 30 edges
5. `renderAuto()` - 29 edges
6. `refresh()` - 23 edges
7. `renderProject()` - 22 edges
8. `setTab()` - 21 edges
9. `openSheet()` - 20 edges
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

## Communities (59 total, 7 thin omitted)

### Community 0 - "tmux_alive"
Cohesion: 0.22
Nodes (15): capture_pane(), last_log_lines(), _launch_agent_inner(), log_line_matches_issue(), orch_alive(), orch_session(), orch_status(), parse_exit_code() (+7 more)

### Community 2 - "load_workshop"
Cohesion: 0.10
Nodes (43): append_log(), board_click(), board_key(), board_payload(), _card_waiting_qa(), clear_board_overlay(), config_dir(), council_save() (+35 more)

### Community 3 - "Harness"
Cohesion: 0.22
Nodes (9): Bootstrap on a new device, Cycle, Graphify, Harness, Memory, Persistent runner, Planner, Research loop (+1 more)

### Community 4 - "app.py"
Cohesion: 0.05
Nodes (105): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+97 more)

### Community 5 - "app.js"
Cohesion: 0.09
Nodes (25): autoDraftChecked, autoUi, b64urlToBuf(), bufToB64url(), COL_HINT, COLS, graphsCache, HOME_TABS (+17 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.12
Nodes (16): Access, Add existing, Autopilot, Create new, Design / QA, Filter, Graphs, Locks (+8 more)

### Community 7 - "Path"
Cohesion: 0.13
Nodes (25): agent_argv(), bullet_covered(), bullet_in_code(), _code_corpus(), council_analyze_prompt(), council_launch_analyzers(), council_role_brief(), council_run_role_sync() (+17 more)

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

### Community 13 - "die"
Cohesion: 0.19
Nodes (21): add_existing(), archive_project(), _clear_registry_overlay(), _clone_to_workspace(), cmd_queue(), create_project(), die(), ensure_seed_labels() (+13 more)

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
Cohesion: 0.16
Nodes (38): add_labels(), assign_me(), claim(), claim_sticks(), close_action(), close_issue(), column_of(), comment() (+30 more)

### Community 22 - "sortable.min.js"
Cohesion: 0.12
Nodes (25): a(), b(), Bt(), D(), e(), f(), g(), h() (+17 more)

### Community 23 - "tg_cmd_now"
Cohesion: 0.40
Nodes (5): tg_cmd_doctor(), tg_cmd_now(), tg_cmd_queue(), tg_cmd_running(), tg_cmd_status()

### Community 24 - "_probe_isolation_inner"
Cohesion: 0.23
Nodes (14): agent_home_dir(), agent_identity_ready(), agent_user_name(), agent_wrapper_path(), isolation_probe_user(), isolation_secret_paths(), isolation_status(), isolation_wrapper_argv() (+6 more)

### Community 25 - "api_logic.py"
Cohesion: 0.12
Nodes (24): BaseException, assert_in_qa(), console_log_for_issue(), contour_fields(), graphify_pin_status(), graphify_summary(), isolation_fallback(), issue_waiting_qa() (+16 more)

### Community 26 - "corp"
Cohesion: 0.06
Nodes (53): agent_prompt(), approve_draft(), approve_drafts(), can_promote_to_qa(), council_enqueue_refs(), council_finish_analyze(), council_is_dup(), council_issue_body() (+45 more)

### Community 27 - "setTab"
Cohesion: 0.38
Nodes (7): autoKicker(), closeMore(), moreTab(), paintDockMore(), setSettingsRoom(), setTab(), toggleMore()

### Community 28 - "openSheet"
Cohesion: 0.15
Nodes (22): applyIssueLink(), autoStatusHtml(), bindAutoQueue(), bindSheetAct(), findCardByIssueParam(), githubLink(), hideSheet(), humanizeError() (+14 more)

### Community 29 - "renderGraphs"
Cohesion: 0.22
Nodes (16): bindGraphDetail(), bindGraphJumps(), bindGraphSearch(), findGroup(), flash(), graphDetailHtml(), graphGalaxyHtml(), graphJumps() (+8 more)

### Community 30 - "escapeHtml"
Cohesion: 0.22
Nodes (16): catalogKind(), contourTreesHtml(), doctorCheckLabel(), doctorChecksHtml(), doctorMeta(), escapeHtml(), fillProfiles(), kindStatus() (+8 more)

### Community 31 - "council_after_writer"
Cohesion: 0.18
Nodes (14): council_abort(), council_after_writer(), council_ff_merge_main(), council_load(), council_mark_phase(), council_qa_verdict(), council_review_prompt(), council_session() (+6 more)

### Community 32 - "renderBoard"
Cohesion: 0.23
Nodes (15): autoTyping(), cardClass(), cardHtml(), cardMatches(), cookieGet(), currentFilter(), draftMatches(), matchesQuery() (+7 more)

### Community 33 - "doctor_payload"
Cohesion: 0.15
Nodes (25): auth_policy_present(), council_deploy_trees(), doctor(), doctor_lines(), doctor_payload(), git_head_commit_time(), git_registry_candidates(), git_tree_report() (+17 more)

### Community 34 - "run"
Cohesion: 0.11
Nodes (29): allow_funnel_on(), classify_writer_tree(), _cli_identity(), _cursor_mismatch_note(), ensure_path(), funnel_enabled_from_text(), have(), _help_text() (+21 more)

### Community 35 - "tg_upsert_board"
Cohesion: 0.22
Nodes (15): tg_board_buttons(), tg_board_counts(), tg_board_filter(), tg_board_find(), tg_board_open(), tg_board_page_bounds(), tg_board_pick(), tg_board_pin_names() (+7 more)

### Community 36 - "Corporation OS — SPEC"
Cohesion: 0.20
Nodes (10): Compare shipped vs this spec, Corporation OS — SPEC, Handoff, Lifecycle, Non-goals, Pins vs registry, Planner, UI north star (+2 more)

### Community 37 - "council_start"
Cohesion: 0.15
Nodes (20): _assemble_board(), cached_research(), collect_issues(), council_scope(), council_start(), cycle_payload(), draft_summaries(), graph_detail() (+12 more)

### Community 38 - "tg_notify_event"
Cohesion: 0.15
Nodes (20): issue_ref(), need_human(), parse_issue_ref(), pulse_label(), pulse_loop(), queue_action_buttons(), sync_writer_tree(), tg_board_card_buttons() (+12 more)

### Community 39 - "Handoff — first hour"
Cohesion: 0.25
Nodes (8): 1. Tailscale, 2. Passkey, 3. SSH, 4. Two trees, 5. First job = sandbox, not P0, Backup (not git), Handoff — first hour, If you are stuck

### Community 40 - "renderAuto"
Cohesion: 0.20
Nodes (15): autoProject(), badge(), cookieSet(), draftCard(), goNext(), isDisposable(), isPin(), liveLabel() (+7 more)

### Community 41 - "tg_home_payload"
Cohesion: 0.67
Nodes (3): tg_home_payload(), tg_home_text(), tg_reply_keyboard()

### Community 42 - "handle_tg_callback"
Cohesion: 0.26
Nodes (17): council_busy(), handle_tg_callback(), tg_cmd_abort(), tg_cmd_board(), tg_cmd_council(), tg_cmd_drafts(), tg_cmd_go(), tg_cmd_help() (+9 more)

### Community 43 - "write"
Cohesion: 0.27
Nodes (10): applyOptimistic(), bindBoardSortable(), bindSheetHouse(), cardByIssue(), closeSheet(), colWord(), patchCard(), refreshSoon() (+2 more)

### Community 44 - "corp"
Cohesion: 0.67
Nodes (3): corp, Документы, Команды

### Community 47 - "_github_cards"
Cohesion: 0.12
Nodes (17): _claim_age_for(), CorpError, council_existing_titles(), _github_cards(), github_issues_disabled(), github_transient(), issues_enabled(), issues_for() (+9 more)

### Community 48 - "2026-08-23 — Продолжение циклов улучшений corp"
Cohesion: 0.25
Nodes (7): 2026-08-23 — Продолжение циклов улучшений corp, Далее, Инциденты среды (не код), Контекст, Разблокировка проекта, Решения, Цикл 1 — #126 TG-пейджер — DONE

### Community 49 - "project_dir"
Cohesion: 0.23
Nodes (12): active_projects(), bootstrap(), expand(), gh_ready(), graphs_index(), parse_graph_report(), project_dir(), project_seed_files() (+4 more)

### Community 50 - "2026-08-18"
Cohesion: 0.14
Nodes (13): 2026-08-18, Decisions, Open questions, Outcome, Outcome, Outcome, Outcome, Outcome (+5 more)

### Community 51 - "redact_secrets"
Cohesion: 0.20
Nodes (15): notify(), notify_safe(), redact_secrets(), session_notes(), telegram_loop(), tg_bot_auth_ok(), tg_command_menu(), tg_creds() (+7 more)

### Community 52 - "load_registry"
Cohesion: 0.28
Nodes (9): load_registry(), merge_registry(), overlay_active(), overlay_diverges(), True only when overlay adds a project or changes a pin vs git registry., git registry.json is canonical. Overlay is emergency-only. Overlay may add…, _registry_overlay(), registry_status() (+1 more)

### Community 53 - "tg_screen"
Cohesion: 0.19
Nodes (19): handle_tg_reply(), handle_tg_text(), queue_set_running(), telegram_tick(), tg_ask_qa_note(), tg_cmd_go_yes(), tg_cmd_pause(), tg_do_abort() (+11 more)

### Community 54 - "2026-08-22 — PO-сессия: аудит продукта и циклы улучшений"
Cohesion: 0.18
Nodes (10): 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений, Далее по очереди, Контекст, Открытые вопросы, Пакет Issues (все `ready`, с приоритетами), Решения и находки, Сделано, Цикл 1 — #122 writers ff-only guard — DONE (+2 more)

### Community 55 - "install.sh"
Cohesion: 0.33
Nodes (5): log(), PATH, PGHOST, PGPORT, install.sh script

## Knowledge Gaps
- **283 isolated node(s):** `backend.sh script`, `PATH`, `PGHOST`, `PGPORT`, `start.sh script` (+278 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `g()` connect `sortable.min.js` to `run`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `backend.sh script`, `PATH`, `PGHOST` to the rest of the system?**
  _283 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `load_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.09856035437430787 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.052019044260271555 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08994708994708994 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._