# Graph Report - corp  (2026-08-23)

## Corpus Check
- 32 files · ~79,352 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1123 nodes · 3004 edges · 53 communities (47 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c2730689`
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
- orchestrate
- api_logic.py
- corp
- tmux_alive
- openSheet
- renderGraphs
- escapeHtml
- council_start
- renderAuto
- Path
- setTab
- tailscale_status
- Corporation OS — SPEC
- parse_issue_ref
- Handoff — first hour
- pinned_projects
- issues_for
- tg_short_ref
- corp
- VPS QA 2026-08-17
- 2026-08-23 — Продолжение циклов улучшений corp
- main
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

## Communities (53 total, 6 thin omitted)

### Community 0 - "run"
Cohesion: 0.24
Nodes (18): add_existing(), classify_writer_tree(), _clone_to_workspace(), create_issue_rest(), create_project(), die(), ensure_label(), ensure_seed_labels() (+10 more)

### Community 2 - "load_workshop"
Cohesion: 0.09
Nodes (42): approve_draft(), approve_drafts(), clear_board_overlay(), _clear_registry_overlay(), _cursor_mismatch_note(), default_workshop(), draft_by_id(), draft_issue_body() (+34 more)

### Community 3 - "Harness"
Cohesion: 0.22
Nodes (9): Bootstrap on a new device, Cycle, Graphify, Harness, Memory, Persistent runner, Planner, Research loop (+1 more)

### Community 4 - "app.py"
Cohesion: 0.05
Nodes (109): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+101 more)

### Community 5 - "app.js"
Cohesion: 0.07
Nodes (33): autoDraftChecked, autoUi, b64urlToBuf(), bufToB64url(), bulkSel, closeSse(), COL_HINT, COLS (+25 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.12
Nodes (16): Access, Add existing, Autopilot, Create new, Design / QA, Filter, Graphs, Locks (+8 more)

### Community 7 - "renderBoard"
Cohesion: 0.17
Nodes (23): autoProject(), cardMatches(), cookieGet(), cookieSet(), currentFilter(), draftMatches(), eventKindRu(), goNext() (+15 more)

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
Cohesion: 0.16
Nodes (21): api(), bindBoardSortable(), bindSheetHouse(), boot(), closeSheet(), colWord(), initBulk(), initNewIssue() (+13 more)

### Community 13 - "have"
Cohesion: 0.21
Nodes (17): _cli_identity(), council_launch_analyzers(), council_writer_kind(), ensure_path(), have(), _help_text(), kind_cli_ok(), load_env() (+9 more)

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
Cohesion: 0.10
Nodes (52): add_labels(), agent_prompt(), assign_me(), can_promote_to_qa(), claim(), claim_sticks(), cmd_queue(), column_of() (+44 more)

### Community 22 - "sortable.min.js"
Cohesion: 0.12
Nodes (25): a(), b(), Bt(), D(), e(), f(), g(), h() (+17 more)

### Community 23 - "handle_tg_callback"
Cohesion: 0.17
Nodes (28): handle_tg_callback(), handle_tg_reply(), handle_tg_text(), queue_set_running(), tg_ask_qa_note(), tg_cmd_abort(), tg_cmd_board(), tg_cmd_council() (+20 more)

### Community 24 - "orchestrate"
Cohesion: 0.20
Nodes (10): council_role_items(), orch_gap_payload(), orch_open_lines(), orch_prompt(), orch_spec_rels(), orch_workshop_extra(), orchestrate(), parse_json_array() (+2 more)

### Community 25 - "api_logic.py"
Cohesion: 0.12
Nodes (24): BaseException, assert_in_qa(), console_log_for_issue(), contour_fields(), graphify_pin_status(), graphify_summary(), isolation_fallback(), issue_waiting_qa() (+16 more)

### Community 26 - "corp"
Cohesion: 0.05
Nodes (56): _claim_age_for(), CorpError, council_is_dup(), council_norm_title(), council_pick_items(), _heartbeat_age_for(), heartbeat_age_from_log(), is_free_ready() (+48 more)

### Community 27 - "tmux_alive"
Cohesion: 0.18
Nodes (18): capture_pane(), drain_log_tail(), last_log_lines(), _launch_agent_inner(), log_line_matches_issue(), orch_alive(), orch_session(), orch_status() (+10 more)

### Community 28 - "openSheet"
Cohesion: 0.14
Nodes (24): applyIssueLink(), autoStatusHtml(), bindAutoQueue(), bindSheetAct(), findCardByIssueParam(), githubLink(), hideSheet(), humanizeError() (+16 more)

### Community 29 - "renderGraphs"
Cohesion: 0.22
Nodes (16): bindGraphDetail(), bindGraphJumps(), bindGraphSearch(), findGroup(), flash(), graphDetailHtml(), graphGalaxyHtml(), graphJumps() (+8 more)

### Community 30 - "escapeHtml"
Cohesion: 0.18
Nodes (19): badge(), cardClass(), cardHtml(), catalogKind(), contourTreesHtml(), doctorCheckLabel(), doctorChecksHtml(), doctorMeta() (+11 more)

### Community 31 - "council_start"
Cohesion: 0.10
Nodes (29): council_abort(), council_busy(), council_enqueue_refs(), council_finish_analyze(), council_issue_body(), council_load(), council_mark_phase(), council_save() (+21 more)

### Community 32 - "renderAuto"
Cohesion: 0.19
Nodes (15): approveDraftIds(), bindDraftBatch(), bindDraftList(), draftBatchBar(), draftCard(), isDisposable(), orchCard(), parseModelPick() (+7 more)

### Community 33 - "Path"
Cohesion: 0.06
Nodes (71): agent_argv(), agent_home_dir(), agent_identity_ready(), agent_user_name(), agent_wrapper_path(), auth_policy_present(), bullet_covered(), bullet_in_code() (+63 more)

### Community 34 - "setTab"
Cohesion: 0.38
Nodes (7): autoKicker(), closeMore(), moreTab(), paintDockMore(), setSettingsRoom(), setTab(), toggleMore()

### Community 35 - "tailscale_status"
Cohesion: 0.50
Nodes (4): allow_funnel_on(), funnel_enabled_from_text(), Funnel ON only from an explicit signal — never a Serve HTTPS URL., tailscale_status()

### Community 36 - "Corporation OS — SPEC"
Cohesion: 0.20
Nodes (10): Compare shipped vs this spec, Corporation OS — SPEC, Handoff, Lifecycle, Non-goals, Pins vs registry, Planner, UI north star (+2 more)

### Community 38 - "parse_issue_ref"
Cohesion: 0.25
Nodes (11): parse_issue_ref(), profile_by_id(), run_next(), tg_event_buttons(), tg_github_issue_url(), tg_need_human_buttons(), tg_parse_issue_arg(), tg_web_app_url() (+3 more)

### Community 39 - "Handoff — first hour"
Cohesion: 0.25
Nodes (8): 1. Tailscale, 2. Passkey, 3. SSH, 4. Two trees, 5. First job = sandbox, not P0, Backup (not git), Handoff — first hour, If you are stuck

### Community 40 - "pinned_projects"
Cohesion: 0.14
Nodes (23): _assemble_board(), board_click(), board_key(), board_payload(), cached_research(), _card_waiting_qa(), collect_issues(), council_scope() (+15 more)

### Community 41 - "issues_for"
Cohesion: 0.33
Nodes (7): council_existing_titles(), github_issues_disabled(), issues_for(), _issues_via_graphql(), _issues_via_rest(), _normalize_rest_issue(), _parse_issue_list()

### Community 42 - "tg_short_ref"
Cohesion: 0.12
Nodes (33): append_log(), close_action(), close_issue(), issue_detail(), issue_runs(), need_human(), notify(), notify_safe() (+25 more)

### Community 44 - "corp"
Cohesion: 0.67
Nodes (3): corp, Документы, Команды

### Community 48 - "2026-08-23 — Продолжение циклов улучшений corp"
Cohesion: 0.12
Nodes (15): 2026-08-23 — Продолжение циклов улучшений corp, Далее, Инциденты среды (не код), Итог сессии, Контекст, Разблокировка проекта, Решения, Цикл 1 — #126 TG-пейджер — DONE (+7 more)

### Community 49 - "main"
Cohesion: 0.16
Nodes (23): active_projects(), archive_project(), bootstrap(), cycle_payload(), expand(), gh_ready(), graph_detail(), graphs_index() (+15 more)

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
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Why does `g()` connect `sortable.min.js` to `run`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `backend.sh script`, `PATH`, `PGHOST` to the rest of the system?**
  _294 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `load_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.08943089430894309 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.05012285012285012 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._