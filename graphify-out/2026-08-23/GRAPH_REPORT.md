# Graph Report - corp  (2026-08-23)

## Corpus Check
- 32 files · ~78,077 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1106 nodes · 2945 edges · 60 communities (53 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `edba4222`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- run
- load_workshop
- Harness
- app.py
- app.js
- Workshop operating contract
- renderBoard
- Agent isolation (corp#41)
- 2026-08-15
- 2026-08-16
- 2026-08-17
- write
- Path
- memory/README.md
- Corporation operating contract
- Server
- agent-isolation-smoke.sh
- corp-agent-exec
- provision-agent-identity.sh
- run_issue
- sortable.min.js
- handle_tg_callback
- _probe_isolation_inner
- api_logic.py
- corp
- have
- openSheet
- renderGraphs
- escapeHtml
- council_after_writer
- renderAuto
- doctor_payload
- live_corp_path
- telegram_tick
- Corporation OS — SPEC
- tg_screen
- tg_notify_event
- Handoff — first hour
- pinned_projects
- issues_for
- redact_secrets
- pin_research
- corp
- VPS QA 2026-08-17
- CorpError
- 2026-08-23 — Продолжение циклов улучшений corp
- project_dir
- 2026-08-18
- tg_upsert_board
- load_registry
- paintLocal
- 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений
- install.sh
- push_draft_card
- backend.sh
- start.sh
- main

## God Nodes (most connected - your core abstractions)
1. `2026-08-17` - 118 edges
2. `2026-08-16` - 57 edges
3. `escapeHtml()` - 32 edges
4. `call()` - 31 edges
5. `renderAuto()` - 29 edges
6. `refresh()` - 24 edges
7. `setTab()` - 22 edges
8. `renderProject()` - 22 edges
9. `openSheet()` - 21 edges
10. `api()` - 17 edges

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

## Communities (60 total, 7 thin omitted)

### Community 0 - "run"
Cohesion: 0.13
Nodes (31): add_existing(), archive_project(), assign_me(), classify_writer_tree(), _clear_registry_overlay(), _clone_to_workspace(), create_issue_rest(), create_project() (+23 more)

### Community 2 - "load_workshop"
Cohesion: 0.12
Nodes (37): approve_draft(), approve_drafts(), clear_board_overlay(), cmd_queue(), council_save(), default_workshop(), draft_by_id(), draft_issue_body() (+29 more)

### Community 3 - "Harness"
Cohesion: 0.22
Nodes (9): Bootstrap on a new device, Cycle, Graphify, Harness, Memory, Persistent runner, Planner, Research loop (+1 more)

### Community 4 - "app.py"
Cohesion: 0.05
Nodes (107): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+99 more)

### Community 5 - "app.js"
Cohesion: 0.08
Nodes (32): autoDraftChecked, autoUi, b64urlToBuf(), boot(), bufToB64url(), closeMore(), closeSse(), COL_HINT (+24 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.12
Nodes (16): Access, Add existing, Autopilot, Create new, Design / QA, Filter, Graphs, Locks (+8 more)

### Community 7 - "renderBoard"
Cohesion: 0.19
Nodes (20): autoProject(), cardMatches(), cookieGet(), cookieSet(), currentFilter(), draftMatches(), goNext(), isPin() (+12 more)

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

### Community 12 - "write"
Cohesion: 0.38
Nodes (7): bindBoardSortable(), bindSheetHouse(), closeSheet(), colWord(), refreshSoon(), sheetWrite(), write()

### Community 13 - "Path"
Cohesion: 0.20
Nodes (16): agent_argv(), agent_prompt(), auth_policy_present(), config_dir(), council_analyze_prompt(), council_launch_analyzers(), council_role_brief(), council_run_role_sync() (+8 more)

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
Cohesion: 0.18
Nodes (36): add_labels(), claim(), claim_sticks(), close_action(), close_issue(), column_of(), comment(), drop_self() (+28 more)

### Community 22 - "sortable.min.js"
Cohesion: 0.12
Nodes (25): a(), b(), Bt(), D(), e(), f(), g(), h() (+17 more)

### Community 23 - "handle_tg_callback"
Cohesion: 0.32
Nodes (14): handle_tg_callback(), tg_cmd_abort(), tg_cmd_board(), tg_cmd_council(), tg_cmd_drafts(), tg_cmd_go(), tg_cmd_help(), tg_cmd_more() (+6 more)

### Community 24 - "_probe_isolation_inner"
Cohesion: 0.20
Nodes (16): agent_home_dir(), agent_identity_ready(), agent_user_name(), agent_wrapper_path(), isolation_probe_user(), isolation_secret_paths(), isolation_status(), isolation_wrapper_argv() (+8 more)

### Community 25 - "api_logic.py"
Cohesion: 0.12
Nodes (24): BaseException, assert_in_qa(), console_log_for_issue(), contour_fields(), graphify_pin_status(), graphify_summary(), isolation_fallback(), issue_waiting_qa() (+16 more)

### Community 26 - "corp"
Cohesion: 0.05
Nodes (52): append_log(), can_promote_to_qa(), council_is_dup(), council_norm_title(), council_pick_items(), council_role_items(), council_should_auto_qa(), default_slot() (+44 more)

### Community 27 - "have"
Cohesion: 0.08
Nodes (39): allow_funnel_on(), capture_pane(), _cli_identity(), council_writer_kind(), _cursor_mismatch_note(), drain_log_tail(), ensure_path(), funnel_enabled_from_text() (+31 more)

### Community 28 - "openSheet"
Cohesion: 0.14
Nodes (23): applyIssueLink(), autoStatusHtml(), bindSheetAct(), findCardByIssueParam(), githubLink(), hideSheet(), humanizeError(), humanReason() (+15 more)

### Community 29 - "renderGraphs"
Cohesion: 0.22
Nodes (16): bindGraphDetail(), bindGraphJumps(), bindGraphSearch(), findGroup(), flash(), graphDetailHtml(), graphGalaxyHtml(), graphJumps() (+8 more)

### Community 30 - "escapeHtml"
Cohesion: 0.17
Nodes (21): badge(), cardClass(), cardHtml(), catalogKind(), contourTreesHtml(), doctorCheckLabel(), doctorChecksHtml(), doctorMeta() (+13 more)

### Community 31 - "council_after_writer"
Cohesion: 0.17
Nodes (18): council_abort(), council_after_writer(), council_busy(), council_ff_merge_main(), council_finish_analyze(), council_issue_body(), council_load(), council_mark_phase() (+10 more)

### Community 32 - "renderAuto"
Cohesion: 0.13
Nodes (27): api(), approveDraftIds(), autoKicker(), bindAutoQueue(), bindDraftBatch(), bindDraftList(), draftBatchBar(), draftCard() (+19 more)

### Community 33 - "doctor_payload"
Cohesion: 0.16
Nodes (17): doctor(), doctor_lines(), doctor_payload(), issue_runs(), load_events(), render(), run_stats(), _short_sha() (+9 more)

### Community 34 - "live_corp_path"
Cohesion: 0.26
Nodes (12): council_deploy_trees(), git_head_commit_time(), git_registry_candidates(), git_tree_report(), live_corp_path(), proc_cwd(), proc_start_time(), two_trees_report() (+4 more)

### Community 35 - "telegram_tick"
Cohesion: 0.31
Nodes (11): handle_tg_reply(), handle_tg_text(), telegram_tick(), tg_ask_qa_note(), tg_home_buttons(), tg_menu_buttons(), tg_norm_slash(), tg_parse_command() (+3 more)

### Community 36 - "Corporation OS — SPEC"
Cohesion: 0.20
Nodes (10): Compare shipped vs this spec, Corporation OS — SPEC, Handoff, Lifecycle, Non-goals, Pins vs registry, Planner, UI north star (+2 more)

### Community 37 - "tg_screen"
Cohesion: 0.20
Nodes (11): queue_set_running(), tg_cmd_go_yes(), tg_cmd_pause(), tg_do_abort(), tg_help_text(), tg_home_payload(), tg_home_text(), tg_html() (+3 more)

### Community 38 - "tg_notify_event"
Cohesion: 0.20
Nodes (16): council_enqueue_refs(), issue_ref(), need_human(), parse_issue_ref(), queue_action_buttons(), tg_board_card_buttons(), tg_card(), tg_card_labels() (+8 more)

### Community 39 - "Handoff — first hour"
Cohesion: 0.25
Nodes (8): 1. Tailscale, 2. Passkey, 3. SSH, 4. Two trees, 5. First job = sandbox, not P0, Backup (not git), Handoff — first hour, If you are stuck

### Community 40 - "pinned_projects"
Cohesion: 0.16
Nodes (21): _assemble_board(), board_click(), board_key(), board_payload(), cached_research(), _card_waiting_qa(), collect_issues(), council_scope() (+13 more)

### Community 41 - "issues_for"
Cohesion: 0.25
Nodes (9): council_existing_titles(), github_issues_disabled(), github_transient(), issues_for(), _issues_via_graphql(), _issues_via_rest(), _normalize_rest_issue(), _parse_issue_list() (+1 more)

### Community 42 - "redact_secrets"
Cohesion: 0.21
Nodes (16): notify(), notify_safe(), redact_secrets(), telegram_loop(), tg_bot_auth_ok(), tg_clip(), tg_creds(), _tg_degrade() (+8 more)

### Community 43 - "pin_research"
Cohesion: 0.24
Nodes (11): bullet_covered(), bullet_in_code(), _code_corpus(), git_worktree_hint(), graph_age_of(), graph_freshness(), _issue_ready(), _norm_words() (+3 more)

### Community 44 - "corp"
Cohesion: 0.67
Nodes (3): corp, Документы, Команды

### Community 47 - "CorpError"
Cohesion: 0.33
Nodes (5): _claim_age_for(), CorpError, latest_claim_info(), run_from_claim_body(), Exception

### Community 48 - "2026-08-23 — Продолжение циклов улучшений corp"
Cohesion: 0.12
Nodes (15): 2026-08-23 — Продолжение циклов улучшений corp, Далее, Инциденты среды (не код), Итог сессии, Контекст, Разблокировка проекта, Решения, Цикл 1 — #126 TG-пейджер — DONE (+7 more)

### Community 49 - "project_dir"
Cohesion: 0.18
Nodes (17): active_projects(), bootstrap(), cycle_payload(), expand(), gh_ready(), graph_detail(), graphs_index(), is_pinned() (+9 more)

### Community 50 - "2026-08-18"
Cohesion: 0.14
Nodes (13): 2026-08-18, Decisions, Open questions, Outcome, Outcome, Outcome, Outcome, Outcome (+5 more)

### Community 51 - "tg_upsert_board"
Cohesion: 0.22
Nodes (15): tg_board_buttons(), tg_board_counts(), tg_board_filter(), tg_board_find(), tg_board_open(), tg_board_page_bounds(), tg_board_pick(), tg_board_pin_names() (+7 more)

### Community 52 - "load_registry"
Cohesion: 0.18
Nodes (13): load_registry(), merge_registry(), overlay_active(), overlay_diverges(), True only when overlay adds a project or changes a pin vs git registry., git registry.json is canonical. Overlay is emergency-only. Overlay may add…, _registry_overlay(), registry_status() (+5 more)

### Community 53 - "paintLocal"
Cohesion: 0.40
Nodes (6): applyOptimistic(), autoTyping(), cardByIssue(), ensureRunStats(), paintLocal(), patchCard()

### Community 54 - "2026-08-22 — PO-сессия: аудит продукта и циклы улучшений"
Cohesion: 0.18
Nodes (10): 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений, Далее по очереди, Контекст, Открытые вопросы, Пакет Issues (все `ready`, с приоритетами), Решения и находки, Сделано, Цикл 1 — #122 writers ff-only guard — DONE (+2 more)

### Community 55 - "install.sh"
Cohesion: 0.33
Nodes (5): log(), PATH, PGHOST, PGPORT, install.sh script

### Community 56 - "push_draft_card"
Cohesion: 0.50
Nodes (4): push_draft_card(), tg_draft_buttons(), tg_draft_card_text(), tg_more_buttons()

## Knowledge Gaps
- **291 isolated node(s):** `backend.sh script`, `PATH`, `PGHOST`, `PGPORT`, `start.sh script` (+286 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `g()` connect `sortable.min.js` to `run`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `backend.sh script`, `PATH`, `PGHOST` to the rest of the system?**
  _291 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `run` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `load_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.11861861861861862 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.0509683995922528 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07899159663865546 - nodes in this community are weakly interconnected._