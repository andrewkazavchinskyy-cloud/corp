# Graph Report - corp  (2026-08-23)

## Corpus Check
- 32 files · ~77,790 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1102 nodes · 2933 edges · 61 communities (54 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1d671cbb`
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
- refresh
- have
- memory/README.md
- Corporation operating contract
- Server
- agent-isolation-smoke.sh
- corp-agent-exec
- provision-agent-identity.sh
- run_issue
- sortable.min.js
- handle_tg_callback
- Path
- api_logic.py
- corp
- tmux_alive
- openSheet
- renderGraphs
- escapeHtml
- council_start
- renderAuto
- doctor_payload
- tg_status_body
- label_names
- Corporation OS — SPEC
- tg_short_ref
- issue_ref
- Handoff — first hour
- pinned_projects
- setTab
- redact_secrets
- pin_research
- corp
- VPS QA 2026-08-17
- CorpError
- 2026-08-23 — Продолжение циклов улучшений corp
- main
- 2026-08-18
- tg_upsert_board
- load_registry
- cmd_queue
- 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений
- install.sh
- tailscale_status
- backend.sh
- start.sh
- tg_home_payload
- main

## God Nodes (most connected - your core abstractions)
1. `2026-08-17` - 118 edges
2. `2026-08-16` - 57 edges
3. `escapeHtml()` - 32 edges
4. `call()` - 31 edges
5. `renderAuto()` - 29 edges
6. `refresh()` - 23 edges
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

## Communities (61 total, 7 thin omitted)

### Community 0 - "run"
Cohesion: 0.19
Nodes (22): add_existing(), approve_draft(), approve_drafts(), archive_project(), classify_writer_tree(), _clone_to_workspace(), create_issue_rest(), create_project() (+14 more)

### Community 2 - "load_workshop"
Cohesion: 0.13
Nodes (33): board_payload(), clear_board_overlay(), _clear_registry_overlay(), council_save(), default_workshop(), draft_by_id(), draft_summaries(), drop_draft() (+25 more)

### Community 3 - "Harness"
Cohesion: 0.22
Nodes (9): Bootstrap on a new device, Cycle, Graphify, Harness, Memory, Persistent runner, Planner, Research loop (+1 more)

### Community 4 - "app.py"
Cohesion: 0.05
Nodes (107): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+99 more)

### Community 5 - "app.js"
Cohesion: 0.09
Nodes (27): autoDraftChecked, autoUi, b64urlToBuf(), bufToB64url(), closeMore(), COL_HINT, COLS, graphsCache (+19 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.12
Nodes (16): Access, Add existing, Autopilot, Create new, Design / QA, Filter, Graphs, Locks (+8 more)

### Community 7 - "renderBoard"
Cohesion: 0.27
Nodes (13): cardClass(), cardHtml(), cardMatches(), cookieGet(), currentFilter(), draftMatches(), matchesQuery(), nextCardHtml() (+5 more)

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
Cohesion: 0.15
Nodes (21): api(), applyOptimistic(), autoTyping(), bindAutoQueue(), bindBoardSortable(), bindSheetHouse(), boot(), cardByIssue() (+13 more)

### Community 13 - "have"
Cohesion: 0.15
Nodes (22): bootstrap(), _cli_identity(), council_launch_analyzers(), council_writer_kind(), _cursor_mismatch_note(), ensure_path(), gh_ready(), have() (+14 more)

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
Nodes (29): add_labels(), assign_me(), can_promote_to_qa(), claim(), claim_sticks(), close_issue(), comment(), council_should_auto_qa() (+21 more)

### Community 22 - "sortable.min.js"
Cohesion: 0.12
Nodes (25): a(), b(), Bt(), D(), e(), f(), g(), h() (+17 more)

### Community 23 - "handle_tg_callback"
Cohesion: 0.26
Nodes (16): handle_tg_callback(), tg_cmd_abort(), tg_cmd_board(), tg_cmd_council(), tg_cmd_drafts(), tg_cmd_go(), tg_cmd_help(), tg_cmd_more() (+8 more)

### Community 24 - "Path"
Cohesion: 0.11
Nodes (35): agent_argv(), agent_home_dir(), agent_identity_ready(), agent_prompt(), agent_user_name(), agent_wrapper_path(), config_dir(), council_after_writer() (+27 more)

### Community 25 - "api_logic.py"
Cohesion: 0.12
Nodes (24): BaseException, assert_in_qa(), console_log_for_issue(), contour_fields(), graphify_pin_status(), graphify_summary(), isolation_fallback(), issue_waiting_qa() (+16 more)

### Community 26 - "corp"
Cohesion: 0.07
Nodes (40): council_existing_titles(), council_is_dup(), council_norm_title(), council_pick_items(), council_role_items(), github_issues_disabled(), github_transient(), _heartbeat_age_for() (+32 more)

### Community 27 - "tmux_alive"
Cohesion: 0.16
Nodes (19): capture_pane(), council_abort(), council_session(), drain_log_tail(), last_log_lines(), _launch_agent_inner(), log_line_matches_issue(), orch_alive() (+11 more)

### Community 28 - "openSheet"
Cohesion: 0.14
Nodes (23): applyIssueLink(), autoStatusHtml(), bindSheetAct(), findCardByIssueParam(), githubLink(), hideSheet(), humanizeError(), humanReason() (+15 more)

### Community 29 - "renderGraphs"
Cohesion: 0.22
Nodes (16): bindGraphDetail(), bindGraphJumps(), bindGraphSearch(), findGroup(), flash(), graphDetailHtml(), graphGalaxyHtml(), graphJumps() (+8 more)

### Community 30 - "escapeHtml"
Cohesion: 0.22
Nodes (16): catalogKind(), contourTreesHtml(), doctorCheckLabel(), doctorChecksHtml(), doctorMeta(), escapeHtml(), fillProfiles(), kindStatus() (+8 more)

### Community 31 - "council_start"
Cohesion: 0.24
Nodes (12): council_busy(), council_finish_analyze(), council_issue_body(), council_scope(), council_start(), council_tick(), council_tmux_map(), reap_orphan_claims() (+4 more)

### Community 32 - "renderAuto"
Cohesion: 0.13
Nodes (24): approveDraftIds(), autoProject(), badge(), bindDraftBatch(), bindDraftList(), cookieSet(), draftBatchBar(), draftCard() (+16 more)

### Community 33 - "doctor_payload"
Cohesion: 0.13
Nodes (27): auth_policy_present(), council_deploy_trees(), doctor(), doctor_lines(), doctor_payload(), git_head_commit_time(), git_registry_candidates(), git_tree_report() (+19 more)

### Community 34 - "tg_status_body"
Cohesion: 0.29
Nodes (7): tg_council_line(), tg_council_phase_ru(), tg_last_queue_error(), tg_live_names(), tg_server_ok(), tg_status_body(), tg_writer_line()

### Community 35 - "label_names"
Cohesion: 0.21
Nodes (17): board_click(), _card_waiting_qa(), close_action(), column_of(), default_slot(), _github_cards(), is_sandbox_card(), issue_eligibility() (+9 more)

### Community 36 - "Corporation OS — SPEC"
Cohesion: 0.20
Nodes (10): Compare shipped vs this spec, Corporation OS — SPEC, Handoff, Lifecycle, Non-goals, Pins vs registry, Planner, UI north star (+2 more)

### Community 37 - "tg_short_ref"
Cohesion: 0.20
Nodes (18): handle_tg_reply(), handle_tg_text(), queue_set_running(), tg_ask_qa_note(), tg_card(), tg_cmd_go_yes(), tg_cmd_pause(), tg_do_abort() (+10 more)

### Community 38 - "issue_ref"
Cohesion: 0.11
Nodes (20): council_enqueue_refs(), issue_ref(), pulse_label(), pulse_loop(), queue_action_buttons(), tg_board_card_buttons(), tg_card_labels(), tg_cmd_doctor() (+12 more)

### Community 39 - "Handoff — first hour"
Cohesion: 0.25
Nodes (8): 1. Tailscale, 2. Passkey, 3. SSH, 4. Two trees, 5. First job = sandbox, not P0, Backup (not git), Handoff — first hour, If you are stuck

### Community 40 - "pinned_projects"
Cohesion: 0.23
Nodes (12): _assemble_board(), board_key(), cached_research(), collect_issues(), _find_snap_card(), issues_enabled(), local_board_card(), _paint_card() (+4 more)

### Community 41 - "setTab"
Cohesion: 0.32
Nodes (8): autoKicker(), eventKindRu(), moreTab(), paintDockMore(), renderJournal(), renderJournalHtml(), setSettingsRoom(), setTab()

### Community 42 - "redact_secrets"
Cohesion: 0.17
Nodes (18): append_log(), issue_detail(), need_human(), push_draft_card(), redact_secrets(), telegram_loop(), telegram_tick(), tg_clip() (+10 more)

### Community 43 - "pin_research"
Cohesion: 0.22
Nodes (11): bullet_covered(), bullet_in_code(), _code_corpus(), git_worktree_hint(), graph_age_of(), _issue_ready(), _norm_words(), pin_research() (+3 more)

### Community 44 - "corp"
Cohesion: 0.67
Nodes (3): corp, Документы, Команды

### Community 47 - "CorpError"
Cohesion: 0.33
Nodes (5): _claim_age_for(), CorpError, latest_claim_info(), run_from_claim_body(), Exception

### Community 48 - "2026-08-23 — Продолжение циклов улучшений corp"
Cohesion: 0.12
Nodes (15): 2026-08-23 — Продолжение циклов улучшений corp, Далее, Инциденты среды (не код), Итог сессии, Контекст, Разблокировка проекта, Решения, Цикл 1 — #126 TG-пейджер — DONE (+7 more)

### Community 49 - "main"
Cohesion: 0.11
Nodes (31): active_projects(), cycle_payload(), expand(), graph_detail(), graphs_index(), hide_project(), is_free_ready(), is_pinned() (+23 more)

### Community 50 - "2026-08-18"
Cohesion: 0.14
Nodes (13): 2026-08-18, Decisions, Open questions, Outcome, Outcome, Outcome, Outcome, Outcome (+5 more)

### Community 51 - "tg_upsert_board"
Cohesion: 0.15
Nodes (22): notify(), notify_safe(), tg_board_buttons(), tg_board_counts(), tg_board_filter(), tg_board_find(), tg_board_open(), tg_board_page_bounds() (+14 more)

### Community 52 - "load_registry"
Cohesion: 0.32
Nodes (8): load_registry(), merge_registry(), overlay_active(), overlay_diverges(), True only when overlay adds a project or changes a pin vs git registry., git registry.json is canonical. Overlay is emergency-only. Overlay may add…, _registry_overlay(), registry_status()

### Community 53 - "cmd_queue"
Cohesion: 0.33
Nodes (6): cmd_queue(), pin_write_block(), queue_status(), vps_owns_project(), write_block_reason(), Namespace

### Community 54 - "2026-08-22 — PO-сессия: аудит продукта и циклы улучшений"
Cohesion: 0.18
Nodes (10): 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений, Далее по очереди, Контекст, Открытые вопросы, Пакет Issues (все `ready`, с приоритетами), Решения и находки, Сделано, Цикл 1 — #122 writers ff-only guard — DONE (+2 more)

### Community 55 - "install.sh"
Cohesion: 0.33
Nodes (5): log(), PATH, PGHOST, PGPORT, install.sh script

### Community 56 - "tailscale_status"
Cohesion: 0.50
Nodes (4): allow_funnel_on(), funnel_enabled_from_text(), Funnel ON only from an explicit signal — never a Serve HTTPS URL., tailscale_status()

### Community 59 - "tg_home_payload"
Cohesion: 0.67
Nodes (3): tg_home_payload(), tg_home_text(), tg_reply_keyboard()

## Knowledge Gaps
- **291 isolated node(s):** `backend.sh script`, `PATH`, `PGHOST`, `PGPORT`, `start.sh script` (+286 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `g()` connect `sortable.min.js` to `run`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `backend.sh script`, `PATH`, `PGHOST` to the rest of the system?**
  _291 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `load_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.13446969696969696 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.0509683995922528 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08735632183908046 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._