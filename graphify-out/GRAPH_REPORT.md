# Graph Report - corp  (2026-08-22)

## Corpus Check
- 31 files · ~72,135 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1056 nodes · 2800 edges · 59 communities (51 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 46 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4c80ebbb`
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
- main
- launch_agent
- memory/README.md
- Corporation operating contract
- Server
- agent-isolation-smoke.sh
- corp-agent-exec
- provision-agent-identity.sh
- _probe_isolation_inner
- sortable.min.js
- die
- config_dir
- api_logic.py
- corp
- setTab
- openSheet
- renderGraphs
- escapeHtml
- council_after_writer
- renderBoard
- CorpError
- main
- tg_short_ref
- Corporation OS — SPEC
- label_names
- tg_notify_event
- Handoff — first hour
- renderAuto
- write
- handle_tg_callback
- tg_screen
- corp
- VPS QA 2026-08-17
- orchestrate
- run
- pin_research
- 2026-08-18
- redact_secrets
- approve_draft
- notify
- 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений
- install.sh
- tailscale_status
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
Cohesion: 0.20
Nodes (15): _cli_identity(), _cursor_mismatch_note(), ensure_path(), have(), _help_text(), _looks_like_model(), _models_from_json(), _parse_efforts() (+7 more)

### Community 2 - "load_workshop"
Cohesion: 0.14
Nodes (31): clear_board_overlay(), cmd_queue(), council_save(), default_workshop(), draft_by_id(), draft_summaries(), drop_draft(), fetch_github_board() (+23 more)

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
Cohesion: 0.16
Nodes (27): agent_prompt(), auth_policy_present(), council_deploy_trees(), doctor_payload(), git_head_commit_time(), git_registry_candidates(), git_tree_report(), live_corp_path() (+19 more)

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

### Community 12 - "main"
Cohesion: 0.11
Nodes (33): active_projects(), archive_project(), bootstrap(), cached_research(), _clear_registry_overlay(), collect_issues(), council_existing_titles(), council_launch_analyzers() (+25 more)

### Community 13 - "launch_agent"
Cohesion: 0.33
Nodes (11): capture_pane(), launch_agent(), orch_alive(), orch_session(), orch_status(), tg_agent_rows(), tmux_alive(), tmux_has() (+3 more)

### Community 16 - "Corporation operating contract"
Cohesion: 0.29
Nodes (6): Absolute Git preservation, Corporation operating contract, How to work, New projects, Session start, Source of truth

### Community 17 - "Server"
Cohesion: 0.29
Nodes (7): Agents, Deploy live additively, Server, Telegram, Two trees, Who does what, Workshop

### Community 18 - "agent-isolation-smoke.sh"
Cohesion: 0.83
Nodes (3): bad(), pass(), agent-isolation-smoke.sh script

### Community 21 - "_probe_isolation_inner"
Cohesion: 0.20
Nodes (16): agent_home_dir(), agent_identity_ready(), agent_user_name(), agent_wrapper_path(), isolation_probe_user(), isolation_secret_paths(), isolation_status(), isolation_wrapper_argv() (+8 more)

### Community 22 - "sortable.min.js"
Cohesion: 0.12
Nodes (25): a(), b(), Bt(), D(), e(), f(), g(), h() (+17 more)

### Community 23 - "die"
Cohesion: 0.20
Nodes (30): add_labels(), assign_me(), can_promote_to_qa(), claim(), close_issue(), comment(), council_should_auto_qa(), die() (+22 more)

### Community 24 - "config_dir"
Cohesion: 0.33
Nodes (7): config_dir(), council_analyze_prompt(), council_role_brief(), council_run_role_sync(), council_spawn_role(), tmux_agent_script(), workshop_token()

### Community 25 - "api_logic.py"
Cohesion: 0.12
Nodes (24): BaseException, assert_in_qa(), console_log_for_issue(), contour_fields(), graphify_pin_status(), graphify_summary(), isolation_fallback(), issue_waiting_qa() (+16 more)

### Community 26 - "corp"
Cohesion: 0.07
Nodes (36): council_is_dup(), council_norm_title(), council_pick_items(), council_role_items(), _issues_via_graphql(), _issues_via_rest(), _normalize_rest_issue(), orch_prompt() (+28 more)

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

### Community 31 - "council_after_writer"
Cohesion: 0.17
Nodes (15): council_abort(), council_after_writer(), council_enqueue_refs(), council_ff_merge_main(), council_finish_analyze(), council_issue_body(), council_load(), council_mark_phase() (+7 more)

### Community 32 - "renderBoard"
Cohesion: 0.23
Nodes (15): autoTyping(), cardClass(), cardHtml(), cardMatches(), cookieGet(), currentFilter(), draftMatches(), matchesQuery() (+7 more)

### Community 35 - "tg_short_ref"
Cohesion: 0.20
Nodes (17): notify_safe(), tg_board_buttons(), tg_board_counts(), tg_board_filter(), tg_board_find(), tg_board_open(), tg_board_page_bounds(), tg_board_pick() (+9 more)

### Community 36 - "Corporation OS — SPEC"
Cohesion: 0.20
Nodes (10): Compare shipped vs this spec, Corporation OS — SPEC, Handoff, Lifecycle, Non-goals, Pins vs registry, Planner, UI north star (+2 more)

### Community 37 - "label_names"
Cohesion: 0.12
Nodes (28): _assemble_board(), board_click(), board_key(), _card_waiting_qa(), close_action(), column_of(), _find_snap_card(), _github_cards() (+20 more)

### Community 38 - "tg_notify_event"
Cohesion: 0.16
Nodes (19): issue_ref(), need_human(), parse_issue_ref(), queue_action_buttons(), tg_board_card_buttons(), tg_card_labels(), tg_cmd_retry(), tg_event_buttons() (+11 more)

### Community 39 - "Handoff — first hour"
Cohesion: 0.25
Nodes (8): 1. Tailscale, 2. Passkey, 3. SSH, 4. Two trees, 5. First job = sandbox, not P0, Backup (not git), Handoff — first hour, If you are stuck

### Community 40 - "renderAuto"
Cohesion: 0.13
Nodes (28): api(), approveDraftIds(), autoProject(), badge(), bindDraftBatch(), bindDraftList(), cookieSet(), draftBatchBar() (+20 more)

### Community 41 - "write"
Cohesion: 0.27
Nodes (10): applyOptimistic(), bindBoardSortable(), bindSheetHouse(), cardByIssue(), closeSheet(), colWord(), patchCard(), refreshSoon() (+2 more)

### Community 42 - "handle_tg_callback"
Cohesion: 0.24
Nodes (18): council_busy(), handle_tg_callback(), tg_cmd_abort(), tg_cmd_board(), tg_cmd_council(), tg_cmd_drafts(), tg_cmd_go(), tg_cmd_more() (+10 more)

### Community 43 - "tg_screen"
Cohesion: 0.21
Nodes (18): handle_tg_reply(), handle_tg_text(), queue_set_running(), telegram_tick(), tg_ask_qa_note(), tg_cmd_go_yes(), tg_cmd_help(), tg_cmd_pause() (+10 more)

### Community 44 - "corp"
Cohesion: 0.67
Nodes (3): corp, Документы, Команды

### Community 47 - "orchestrate"
Cohesion: 0.15
Nodes (17): agent_argv(), append_log(), board_payload(), default_slot(), kind_cli_ok(), maybe_orchestrate(), new_draft(), orch_gap_payload() (+9 more)

### Community 48 - "run"
Cohesion: 0.22
Nodes (16): add_existing(), classify_writer_tree(), _clone_to_workspace(), create_issue_rest(), create_project(), ensure_label(), ensure_seed_labels(), org_name() (+8 more)

### Community 49 - "pin_research"
Cohesion: 0.17
Nodes (16): bullet_covered(), bullet_in_code(), _code_corpus(), doctor(), doctor_lines(), git_worktree_hint(), graph_age_of(), graph_freshness() (+8 more)

### Community 50 - "2026-08-18"
Cohesion: 0.14
Nodes (13): 2026-08-18, Decisions, Open questions, Outcome, Outcome, Outcome, Outcome, Outcome (+5 more)

### Community 51 - "redact_secrets"
Cohesion: 0.17
Nodes (13): last_log_lines(), load_events(), log_line_matches_issue(), redact_secrets(), session_notes(), tg_card(), tg_clip(), tg_drafts_text() (+5 more)

### Community 52 - "approve_draft"
Cohesion: 0.20
Nodes (12): approve_draft(), approve_drafts(), draft_issue_body(), load_registry(), merge_registry(), overlay_active(), overlay_diverges(), True only when overlay adds a project or changes a pin vs git registry. (+4 more)

### Community 53 - "notify"
Cohesion: 0.24
Nodes (11): notify(), telegram_loop(), tg_command_menu(), tg_creds(), tg_edit_message(), tg_edit_status(), tg_install_commands(), tg_install_menu_button() (+3 more)

### Community 54 - "2026-08-22 — PO-сессия: аудит продукта и циклы улучшений"
Cohesion: 0.18
Nodes (10): 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений, Далее по очереди, Контекст, Открытые вопросы, Пакет Issues (все `ready`, с приоритетами), Решения и находки, Сделано, Цикл 1 — #122 writers ff-only guard — DONE (+2 more)

### Community 55 - "install.sh"
Cohesion: 0.33
Nodes (5): log(), PATH, PGHOST, PGPORT, install.sh script

### Community 56 - "tailscale_status"
Cohesion: 0.50
Nodes (4): allow_funnel_on(), funnel_enabled_from_text(), Funnel ON only from an explicit signal — never a Serve HTTPS URL., tailscale_status()

## Knowledge Gaps
- **277 isolated node(s):** `backend.sh script`, `PATH`, `PGHOST`, `PGPORT`, `start.sh script` (+272 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Why does `g()` connect `sortable.min.js` to `run`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `backend.sh script`, `PATH`, `PGHOST` to the rest of the system?**
  _277 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `load_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.14408602150537633 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.052019044260271555 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08266129032258064 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._