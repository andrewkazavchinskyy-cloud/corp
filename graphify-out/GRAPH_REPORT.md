# Graph Report - corp  (2026-08-23)

## Corpus Check
- 32 files · ~79,520 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1124 nodes · 3006 edges · 55 communities (48 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b8ae3d99`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- doctor_payload
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
- have
- memory/README.md
- Corporation operating contract
- Server
- agent-isolation-smoke.sh
- corp-agent-exec
- provision-agent-identity.sh
- run
- sortable.min.js
- handle_tg_callback
- orchestrate
- api_logic.py
- corp
- tmux_alive
- openSheet
- renderGraphs
- escapeHtml
- council_after_writer
- renderAuto
- Path
- setTab
- tailscale_status
- Corporation OS — SPEC
- tg_board_text
- pin_research
- Handoff — first hour
- pinned_projects
- load_registry
- redact_secrets
- agent_argv
- corp
- VPS QA 2026-08-17
- main
- 2026-08-23 — Продолжение циклов улучшений corp
- 2026-08-18
- paintLocal
- 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений
- install.sh
- backend.sh
- start.sh

## God Nodes (most connected - your core abstractions)
1. `2026-08-17` - 118 edges
2. `2026-08-16` - 57 edges
3. `escapeHtml()` - 34 edges
4. `call()` - 33 edges
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

## Communities (55 total, 7 thin omitted)

### Community 0 - "doctor_payload"
Cohesion: 0.18
Nodes (20): auth_policy_present(), council_deploy_trees(), doctor_payload(), git_head_commit_time(), git_registry_candidates(), git_tree_report(), live_corp_path(), live_or_root() (+12 more)

### Community 2 - "load_workshop"
Cohesion: 0.11
Nodes (40): _assemble_board(), board_key(), board_payload(), clear_board_overlay(), _clear_registry_overlay(), council_save(), default_workshop(), draft_by_id() (+32 more)

### Community 3 - "Harness"
Cohesion: 0.22
Nodes (9): Bootstrap on a new device, Cycle, Graphify, Harness, Memory, Persistent runner, Planner, Research loop (+1 more)

### Community 4 - "app.py"
Cohesion: 0.05
Nodes (109): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+101 more)

### Community 5 - "app.js"
Cohesion: 0.07
Nodes (37): autoDraftChecked, autoUi, b64urlToBuf(), boot(), bufToB64url(), bulkSel, closeSse(), COL_HINT (+29 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.12
Nodes (16): Access, Add existing, Autopilot, Create new, Design / QA, Filter, Graphs, Locks (+8 more)

### Community 7 - "renderBoard"
Cohesion: 0.20
Nodes (17): badge(), cardClass(), cardHtml(), cardMatches(), cookieGet(), cookieSet(), currentFilter(), draftMatches() (+9 more)

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
Cohesion: 0.24
Nodes (12): bindBoardSortable(), bindSheetHouse(), closeSheet(), colWord(), initNewIssue(), labelGrid(), labelGridValues(), refreshSoon() (+4 more)

### Community 13 - "have"
Cohesion: 0.21
Nodes (16): _cli_identity(), council_launch_analyzers(), council_writer_kind(), ensure_path(), have(), _help_text(), kind_cli_ok(), _looks_like_model() (+8 more)

### Community 16 - "Corporation operating contract"
Cohesion: 0.29
Nodes (6): Absolute Git preservation, Corporation operating contract, How to work, New projects, Session start, Source of truth

### Community 17 - "Server"
Cohesion: 0.29
Nodes (7): Agents, Deploy live additively, Server, Telegram, Two trees, Who does what, Workshop

### Community 18 - "agent-isolation-smoke.sh"
Cohesion: 0.83
Nodes (3): bad(), pass(), agent-isolation-smoke.sh script

### Community 21 - "run"
Cohesion: 0.06
Nodes (107): add_existing(), add_labels(), archive_project(), assign_me(), board_click(), bootstrap(), can_promote_to_qa(), _card_waiting_qa() (+99 more)

### Community 22 - "sortable.min.js"
Cohesion: 0.12
Nodes (25): a(), b(), Bt(), D(), e(), f(), g(), h() (+17 more)

### Community 23 - "handle_tg_callback"
Cohesion: 0.14
Nodes (32): handle_tg_callback(), handle_tg_reply(), handle_tg_text(), push_draft_card(), queue_set_running(), tg_ask_qa_note(), tg_cmd_abort(), tg_cmd_board() (+24 more)

### Community 24 - "orchestrate"
Cohesion: 0.14
Nodes (18): capture_pane(), council_role_items(), last_log_lines(), log_line_matches_issue(), orch_alive(), orch_gap_payload(), orch_open_lines(), orch_prompt() (+10 more)

### Community 25 - "api_logic.py"
Cohesion: 0.12
Nodes (24): BaseException, assert_in_qa(), console_log_for_issue(), contour_fields(), graphify_pin_status(), graphify_summary(), isolation_fallback(), issue_waiting_qa() (+16 more)

### Community 26 - "corp"
Cohesion: 0.05
Nodes (59): _claim_age_for(), council_existing_titles(), council_is_dup(), council_norm_title(), council_pick_items(), _cursor_mismatch_note(), github_issues_disabled(), _heartbeat_age_for() (+51 more)

### Community 27 - "tmux_alive"
Cohesion: 0.39
Nodes (8): drain_log_tail(), _launch_agent_inner(), parse_exit_code(), read_tmux_exit(), tmux_alive(), tmux_kill(), tmux_session(), wait_tmux()

### Community 28 - "openSheet"
Cohesion: 0.13
Nodes (24): applyIssueLink(), autoStatusHtml(), bindSheetAct(), findCardByIssueParam(), githubLink(), hideSheet(), humanizeError(), humanReason() (+16 more)

### Community 29 - "renderGraphs"
Cohesion: 0.22
Nodes (16): bindGraphDetail(), bindGraphJumps(), bindGraphSearch(), findGroup(), flash(), graphDetailHtml(), graphGalaxyHtml(), graphJumps() (+8 more)

### Community 30 - "escapeHtml"
Cohesion: 0.21
Nodes (18): catalogKind(), contourTreesHtml(), doctorCheckLabel(), doctorChecksHtml(), doctorMeta(), escapeHtml(), fillProfiles(), kindStatus() (+10 more)

### Community 31 - "council_after_writer"
Cohesion: 0.16
Nodes (19): council_abort(), council_after_writer(), council_busy(), council_ff_merge_main(), council_finish_analyze(), council_issue_body(), council_load(), council_mark_phase() (+11 more)

### Community 32 - "renderAuto"
Cohesion: 0.13
Nodes (28): api(), approveDraftIds(), autoProject(), bindAutoQueue(), bindDraftBatch(), bindDraftList(), draftBatchBar(), draftCard() (+20 more)

### Community 33 - "Path"
Cohesion: 0.18
Nodes (21): agent_home_dir(), agent_identity_ready(), agent_prompt(), agent_user_name(), agent_wrapper_path(), isolation_probe_user(), isolation_secret_paths(), isolation_status() (+13 more)

### Community 34 - "setTab"
Cohesion: 0.38
Nodes (7): autoKicker(), closeMore(), moreTab(), paintDockMore(), setSettingsRoom(), setTab(), toggleMore()

### Community 35 - "tailscale_status"
Cohesion: 0.50
Nodes (4): allow_funnel_on(), funnel_enabled_from_text(), Funnel ON only from an explicit signal — never a Serve HTTPS URL., tailscale_status()

### Community 36 - "Corporation OS — SPEC"
Cohesion: 0.20
Nodes (10): Compare shipped vs this spec, Corporation OS — SPEC, Handoff, Lifecycle, Non-goals, Pins vs registry, Planner, UI north star (+2 more)

### Community 37 - "tg_board_text"
Cohesion: 0.15
Nodes (17): rank(), tg_board_buttons(), tg_board_card_buttons(), tg_board_counts(), tg_board_filter(), tg_board_find(), tg_board_open(), tg_board_page_bounds() (+9 more)

### Community 38 - "pin_research"
Cohesion: 0.17
Nodes (16): bullet_covered(), bullet_in_code(), _code_corpus(), doctor(), doctor_lines(), git_worktree_hint(), graph_age_of(), graph_freshness() (+8 more)

### Community 39 - "Handoff — first hour"
Cohesion: 0.25
Nodes (8): 1. Tailscale, 2. Passkey, 3. SSH, 4. Two trees, 5. First job = sandbox, not P0, Backup (not git), Handoff — first hour, If you are stuck

### Community 40 - "pinned_projects"
Cohesion: 0.22
Nodes (13): active_projects(), cached_research(), collect_issues(), council_scope(), graph_detail(), graphs_index(), is_pinned(), issues_enabled() (+5 more)

### Community 41 - "load_registry"
Cohesion: 0.24
Nodes (10): load_registry(), merge_registry(), overlay_active(), overlay_diverges(), queue_status(), True only when overlay adds a project or changes a pin vs git registry., git registry.json is canonical. Overlay is emergency-only. Overlay may add…, _registry_overlay() (+2 more)

### Community 42 - "redact_secrets"
Cohesion: 0.10
Nodes (32): append_log(), approve_draft(), approve_drafts(), CorpError, draft_issue_body(), issue_detail(), launch_agent(), notify() (+24 more)

### Community 43 - "agent_argv"
Cohesion: 0.32
Nodes (8): agent_argv(), config_dir(), council_analyze_prompt(), council_role_brief(), council_run_role_sync(), council_spawn_role(), tmux_agent_script(), workshop_token()

### Community 44 - "corp"
Cohesion: 0.67
Nodes (3): corp, Документы, Команды

### Community 48 - "2026-08-23 — Продолжение циклов улучшений corp"
Cohesion: 0.12
Nodes (15): 2026-08-23 — Продолжение циклов улучшений corp, Далее, Инциденты среды (не код), Итог сессии, Контекст, Разблокировка проекта, Решения, Цикл 1 — #126 TG-пейджер — DONE (+7 more)

### Community 50 - "2026-08-18"
Cohesion: 0.14
Nodes (13): 2026-08-18, Decisions, Open questions, Outcome, Outcome, Outcome, Outcome, Outcome (+5 more)

### Community 53 - "paintLocal"
Cohesion: 0.40
Nodes (6): applyOptimistic(), autoTyping(), cardByIssue(), ensureRunStats(), paintLocal(), patchCard()

### Community 54 - "2026-08-22 — PO-сессия: аудит продукта и циклы улучшений"
Cohesion: 0.18
Nodes (10): 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений, Далее по очереди, Контекст, Открытые вопросы, Пакет Issues (все `ready`, с приоритетами), Решения и находки, Сделано, Цикл 1 — #122 writers ff-only guard — DONE (+2 more)

### Community 55 - "install.sh"
Cohesion: 0.33
Nodes (5): log(), PATH, PGHOST, PGPORT, install.sh script

## Knowledge Gaps
- **294 isolated node(s):** `backend.sh script`, `PATH`, `PGHOST`, `PGPORT`, `start.sh script` (+289 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **Why does `g()` connect `sortable.min.js` to `run`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `backend.sh script`, `PATH`, `PGHOST` to the rest of the system?**
  _294 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `load_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.1076923076923077 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.05012285012285012 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06794871794871794 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._