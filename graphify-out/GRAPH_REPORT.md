# Graph Report - corp  (2026-08-23)

## Corpus Check
- 32 files · ~73,213 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1068 nodes · 2833 edges · 59 communities (51 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 46 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9ca0870e`
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
- run_issue
- die
- memory/README.md
- Corporation operating contract
- Server
- agent-isolation-smoke.sh
- corp-agent-exec
- provision-agent-identity.sh
- close_issue
- sortable.min.js
- main
- _probe_isolation_inner
- api_logic.py
- corp
- setTab
- openSheet
- renderGraphs
- escapeHtml
- council_start
- renderBoard
- pin_research
- probe_kind
- tg_board_text
- Corporation OS — SPEC
- label_names
- tg_notify_event
- Handoff — first hour
- renderAuto
- config_dir
- handle_tg_callback
- write
- corp
- VPS QA 2026-08-17
- issues_for
- 2026-08-23 — Продолжение циклов улучшений corp
- tailscale_status
- 2026-08-18
- redact_secrets
- approve_draft
- CorpError
- 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений
- install.sh
- main
- backend.sh
- start.sh

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

## Communities (59 total, 8 thin omitted)

### Community 0 - "have"
Cohesion: 0.19
Nodes (18): capture_pane(), gh_ready(), have(), launch_agent(), orch_alive(), orch_session(), orch_status(), parse_exit_code() (+10 more)

### Community 2 - "load_workshop"
Cohesion: 0.13
Nodes (33): clear_board_overlay(), cmd_queue(), default_workshop(), draft_by_id(), draft_summaries(), drop_draft(), load_catalog(), load_workshop() (+25 more)

### Community 3 - "Harness"
Cohesion: 0.22
Nodes (9): Bootstrap on a new device, Cycle, Graphify, Harness, Memory, Persistent runner, Planner, Research loop (+1 more)

### Community 4 - "app.py"
Cohesion: 0.05
Nodes (105): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+97 more)

### Community 5 - "app.js"
Cohesion: 0.08
Nodes (29): autoDraftChecked, autoUi, b64urlToBuf(), boot(), bufToB64url(), COL_HINT, COLS, graphsCache (+21 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.12
Nodes (16): Access, Add existing, Autopilot, Create new, Design / QA, Filter, Graphs, Locks (+8 more)

### Community 7 - "Path"
Cohesion: 0.14
Nodes (31): agent_prompt(), auth_policy_present(), council_deploy_trees(), council_review_prompt(), doctor_payload(), git_head_commit_time(), git_registry_candidates(), git_tree_report() (+23 more)

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

### Community 12 - "run_issue"
Cohesion: 0.14
Nodes (21): agent_argv(), can_promote_to_qa(), council_after_writer(), council_ff_merge_main(), council_qa_verdict(), council_should_auto_qa(), council_writer_kind(), default_slot() (+13 more)

### Community 13 - "die"
Cohesion: 0.23
Nodes (19): add_existing(), archive_project(), assign_me(), classify_writer_tree(), _clone_to_workspace(), create_issue_rest(), create_project(), die() (+11 more)

### Community 16 - "Corporation operating contract"
Cohesion: 0.29
Nodes (6): Absolute Git preservation, Corporation operating contract, How to work, New projects, Session start, Source of truth

### Community 17 - "Server"
Cohesion: 0.29
Nodes (7): Agents, Deploy live additively, Server, Telegram, Two trees, Who does what, Workshop

### Community 18 - "agent-isolation-smoke.sh"
Cohesion: 0.83
Nodes (3): bad(), pass(), agent-isolation-smoke.sh script

### Community 21 - "close_issue"
Cohesion: 0.36
Nodes (17): add_labels(), claim(), close_issue(), comment(), drop_self(), get_issue(), invalidate_board(), move_issue() (+9 more)

### Community 22 - "sortable.min.js"
Cohesion: 0.12
Nodes (25): a(), b(), Bt(), D(), e(), f(), g(), h() (+17 more)

### Community 23 - "main"
Cohesion: 0.11
Nodes (31): active_projects(), bootstrap(), cached_research(), cycle_payload(), expand(), graph_detail(), graphs_index(), hide_project() (+23 more)

### Community 24 - "_probe_isolation_inner"
Cohesion: 0.20
Nodes (16): agent_home_dir(), agent_identity_ready(), agent_user_name(), agent_wrapper_path(), isolation_probe_user(), isolation_secret_paths(), isolation_status(), isolation_wrapper_argv() (+8 more)

### Community 25 - "api_logic.py"
Cohesion: 0.12
Nodes (24): BaseException, assert_in_qa(), console_log_for_issue(), contour_fields(), graphify_pin_status(), graphify_summary(), isolation_fallback(), issue_waiting_qa() (+16 more)

### Community 26 - "corp"
Cohesion: 0.07
Nodes (36): _clear_registry_overlay(), council_is_dup(), council_norm_title(), council_pick_items(), _cursor_mismatch_note(), _find_snap_card(), local_board_card(), _paint_card() (+28 more)

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
Cohesion: 0.21
Nodes (18): catalogKind(), contourTreesHtml(), doctorCheckLabel(), doctorChecksHtml(), doctorMeta(), escapeHtml(), fillProfiles(), kindStatus() (+10 more)

### Community 31 - "council_start"
Cohesion: 0.14
Nodes (20): council_abort(), council_enqueue_refs(), council_existing_titles(), council_finish_analyze(), council_issue_body(), council_load(), council_mark_phase(), council_save() (+12 more)

### Community 32 - "renderBoard"
Cohesion: 0.23
Nodes (15): autoTyping(), cardClass(), cardHtml(), cardMatches(), cookieGet(), currentFilter(), draftMatches(), matchesQuery() (+7 more)

### Community 33 - "pin_research"
Cohesion: 0.17
Nodes (16): bullet_covered(), bullet_in_code(), _code_corpus(), doctor(), doctor_lines(), git_worktree_hint(), graph_age_of(), graph_freshness() (+8 more)

### Community 34 - "probe_kind"
Cohesion: 0.27
Nodes (11): _cli_identity(), ensure_path(), _help_text(), _looks_like_model(), _models_from_json(), _parse_efforts(), _parse_models(), _probe_cli_identity() (+3 more)

### Community 35 - "tg_board_text"
Cohesion: 0.17
Nodes (16): tg_board_buttons(), tg_board_card_buttons(), tg_board_counts(), tg_board_filter(), tg_board_find(), tg_board_open(), tg_board_page_bounds(), tg_board_pick() (+8 more)

### Community 36 - "Corporation OS — SPEC"
Cohesion: 0.20
Nodes (10): Compare shipped vs this spec, Corporation OS — SPEC, Handoff, Lifecycle, Non-goals, Pins vs registry, Planner, UI north star (+2 more)

### Community 37 - "label_names"
Cohesion: 0.19
Nodes (23): _assemble_board(), board_click(), board_key(), board_payload(), _card_waiting_qa(), close_action(), collect_issues(), column_of() (+15 more)

### Community 38 - "tg_notify_event"
Cohesion: 0.27
Nodes (11): need_human(), parse_issue_ref(), tg_card(), tg_cmd_retry(), tg_event_buttons(), tg_need_human_buttons(), tg_notify_event(), tg_parse_issue_arg() (+3 more)

### Community 39 - "Handoff — first hour"
Cohesion: 0.25
Nodes (8): 1. Tailscale, 2. Passkey, 3. SSH, 4. Two trees, 5. First job = sandbox, not P0, Backup (not git), Handoff — first hour, If you are stuck

### Community 40 - "renderAuto"
Cohesion: 0.13
Nodes (28): api(), approveDraftIds(), autoProject(), badge(), bindDraftBatch(), bindDraftList(), cookieSet(), draftBatchBar() (+20 more)

### Community 41 - "config_dir"
Cohesion: 0.22
Nodes (10): config_dir(), council_analyze_prompt(), council_launch_analyzers(), council_role_brief(), council_role_items(), council_run_role_sync(), council_spawn_role(), parse_json_array() (+2 more)

### Community 42 - "handle_tg_callback"
Cohesion: 0.15
Nodes (33): council_busy(), handle_tg_callback(), handle_tg_reply(), handle_tg_text(), issue_ref(), queue_action_buttons(), queue_set_running(), tg_ask_qa_note() (+25 more)

### Community 43 - "write"
Cohesion: 0.27
Nodes (10): applyOptimistic(), bindBoardSortable(), bindSheetHouse(), cardByIssue(), closeSheet(), colWord(), patchCard(), refreshSoon() (+2 more)

### Community 44 - "corp"
Cohesion: 0.67
Nodes (3): corp, Документы, Команды

### Community 47 - "issues_for"
Cohesion: 0.25
Nodes (9): github_issues_disabled(), github_transient(), issues_for(), _issues_via_graphql(), _issues_via_rest(), _normalize_rest_issue(), _parse_issue_list(), _pin_issue_job() (+1 more)

### Community 48 - "2026-08-23 — Продолжение циклов улучшений corp"
Cohesion: 0.25
Nodes (7): 2026-08-23 — Продолжение циклов улучшений corp, Далее, Инциденты среды (не код), Контекст, Разблокировка проекта, Решения, Цикл 1 — #126 TG-пейджер — DONE

### Community 49 - "tailscale_status"
Cohesion: 0.50
Nodes (4): allow_funnel_on(), funnel_enabled_from_text(), Funnel ON only from an explicit signal — never a Serve HTTPS URL., tailscale_status()

### Community 50 - "2026-08-18"
Cohesion: 0.14
Nodes (13): 2026-08-18, Decisions, Open questions, Outcome, Outcome, Outcome, Outcome, Outcome (+5 more)

### Community 51 - "redact_secrets"
Cohesion: 0.17
Nodes (22): append_log(), maybe_refresh_board(), notify(), notify_safe(), redact_secrets(), telegram_loop(), telegram_tick(), tg_bot_auth_ok() (+14 more)

### Community 52 - "approve_draft"
Cohesion: 0.14
Nodes (17): approve_draft(), approve_drafts(), draft_issue_body(), load_registry(), merge_registry(), overlay_active(), overlay_diverges(), pin_owns_repo() (+9 more)

### Community 54 - "2026-08-22 — PO-сессия: аудит продукта и циклы улучшений"
Cohesion: 0.18
Nodes (10): 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений, Далее по очереди, Контекст, Открытые вопросы, Пакет Issues (все `ready`, с приоритетами), Решения и находки, Сделано, Цикл 1 — #122 writers ff-only guard — DONE (+2 more)

### Community 55 - "install.sh"
Cohesion: 0.33
Nodes (5): log(), PATH, PGHOST, PGPORT, install.sh script

## Knowledge Gaps
- **283 isolated node(s):** `backend.sh script`, `PATH`, `PGHOST`, `PGPORT`, `start.sh script` (+278 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Why does `g()` connect `sortable.min.js` to `die`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `2026-08-17` connect `2026-08-17` to `VPS QA 2026-08-17`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `backend.sh script`, `PATH`, `PGHOST` to the rest of the system?**
  _283 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `load_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.1268939393939394 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.052019044260271555 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08266129032258064 - nodes in this community are weakly interconnected._