# Graph Report - corp  (2026-08-23)

## Corpus Check
- 32 files · ~79,944 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1127 nodes · 3015 edges · 61 communities (54 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8257066d`
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
- openSheet
- probe_kind
- memory/README.md
- Corporation operating contract
- Server
- agent-isolation-smoke.sh
- corp-agent-exec
- provision-agent-identity.sh
- die
- sortable.min.js
- handle_tg_callback
- orchestrate
- api_logic.py
- corp
- tmux_alive
- issueRef
- renderGraphs
- escapeHtml
- council_start
- renderAuto
- _probe_isolation_inner
- setTab
- tailscale_status
- Corporation OS — SPEC
- tg_short_ref
- pin_research
- Handoff — first hour
- label_names
- approve_draft
- redact_secrets
- run
- corp
- VPS QA 2026-08-17
- main
- 2026-08-23 — Продолжение циклов улучшений corp
- tg_notify_event
- 2026-08-18
- main
- Path
- paintLocal
- 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений
- install.sh
- run_issue
- backend.sh
- start.sh
- issues_for
- CorpError

## God Nodes (most connected - your core abstractions)
1. `2026-08-17` - 118 edges
2. `2026-08-16` - 57 edges
3. `escapeHtml()` - 35 edges
4. `call()` - 33 edges
5. `renderAuto()` - 29 edges
6. `refresh()` - 24 edges
7. `setTab()` - 22 edges
8. `openSheet()` - 22 edges
9. `renderProject()` - 22 edges
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

### Community 0 - "doctor_payload"
Cohesion: 0.23
Nodes (16): auth_policy_present(), council_deploy_trees(), doctor(), doctor_lines(), doctor_payload(), git_registry_candidates(), git_tree_report(), live_corp_path() (+8 more)

### Community 2 - "load_workshop"
Cohesion: 0.16
Nodes (30): clear_board_overlay(), cmd_queue(), default_workshop(), draft_by_id(), draft_summaries(), drop_draft(), load_catalog(), load_workshop() (+22 more)

### Community 3 - "Harness"
Cohesion: 0.22
Nodes (9): Bootstrap on a new device, Cycle, Graphify, Harness, Memory, Persistent runner, Planner, Research loop (+1 more)

### Community 4 - "app.py"
Cohesion: 0.05
Nodes (109): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+101 more)

### Community 5 - "app.js"
Cohesion: 0.07
Nodes (37): autoDraftChecked, autoUi, b64urlToBuf(), boot(), bufToB64url(), bulkSel, COL_HINT, COLS (+29 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.12
Nodes (16): Access, Add existing, Autopilot, Create new, Design / QA, Filter, Graphs, Locks (+8 more)

### Community 7 - "renderBoard"
Cohesion: 0.14
Nodes (26): autoProject(), cardMatches(), closeSse(), cookieGet(), cookieSet(), currentFilter(), draftMatches(), eventKindRu() (+18 more)

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

### Community 12 - "openSheet"
Cohesion: 0.17
Nodes (19): bindAutoQueue(), bindBoardSortable(), bindSheetAct(), bindSheetHouse(), closeSheet(), colWord(), confirmBox(), githubLink() (+11 more)

### Community 13 - "probe_kind"
Cohesion: 0.24
Nodes (12): _cli_identity(), _cursor_mismatch_note(), ensure_path(), _help_text(), _looks_like_model(), _models_from_json(), _parse_efforts(), _parse_models() (+4 more)

### Community 16 - "Corporation operating contract"
Cohesion: 0.29
Nodes (6): Absolute Git preservation, Corporation operating contract, How to work, New projects, Session start, Source of truth

### Community 17 - "Server"
Cohesion: 0.29
Nodes (7): Agents, Deploy live additively, Server, Telegram, Two trees, Who does what, Workshop

### Community 18 - "agent-isolation-smoke.sh"
Cohesion: 0.83
Nodes (3): bad(), pass(), agent-isolation-smoke.sh script

### Community 21 - "die"
Cohesion: 0.29
Nodes (24): add_labels(), assign_me(), claim(), close_issue(), comment(), die(), drop_self(), get_issue() (+16 more)

### Community 22 - "sortable.min.js"
Cohesion: 0.12
Nodes (25): a(), b(), Bt(), D(), e(), f(), g(), h() (+17 more)

### Community 23 - "handle_tg_callback"
Cohesion: 0.16
Nodes (30): council_busy(), handle_tg_callback(), handle_tg_reply(), handle_tg_text(), push_draft_card(), tg_ask_qa_note(), tg_cmd_abort(), tg_cmd_board() (+22 more)

### Community 24 - "orchestrate"
Cohesion: 0.10
Nodes (25): agent_argv(), config_dir(), council_after_writer(), council_analyze_prompt(), council_ff_merge_main(), council_launch_analyzers(), council_qa_verdict(), council_review_prompt() (+17 more)

### Community 25 - "api_logic.py"
Cohesion: 0.12
Nodes (24): BaseException, assert_in_qa(), console_log_for_issue(), contour_fields(), graphify_pin_status(), graphify_summary(), isolation_fallback(), issue_waiting_qa() (+16 more)

### Community 26 - "corp"
Cohesion: 0.06
Nodes (44): _clear_registry_overlay(), council_is_dup(), council_norm_title(), council_pick_items(), _find_snap_card(), _heartbeat_age_for(), heartbeat_age_from_log(), issue_runs() (+36 more)

### Community 27 - "tmux_alive"
Cohesion: 0.18
Nodes (18): capture_pane(), drain_log_tail(), last_log_lines(), _launch_agent_inner(), log_line_matches_issue(), orch_alive(), orch_session(), orch_status() (+10 more)

### Community 28 - "issueRef"
Cohesion: 0.22
Nodes (14): applyIssueLink(), findCardByIssueParam(), hideSheet(), issueFromUrl(), issueLinkValue(), issueRef(), loadSheetDetail(), openConsole() (+6 more)

### Community 29 - "renderGraphs"
Cohesion: 0.23
Nodes (15): bindGraphDetail(), bindGraphJumps(), bindGraphSearch(), findGroup(), graphDetailHtml(), graphGalaxyHtml(), graphJumps(), graphMatch() (+7 more)

### Community 30 - "escapeHtml"
Cohesion: 0.16
Nodes (22): badge(), cardClass(), cardHtml(), catalogKind(), contourTreesHtml(), doctorCheckLabel(), doctorChecksHtml(), doctorMeta() (+14 more)

### Community 31 - "council_start"
Cohesion: 0.15
Nodes (19): council_abort(), council_enqueue_refs(), council_existing_titles(), council_finish_analyze(), council_issue_body(), council_load(), council_mark_phase(), council_save() (+11 more)

### Community 32 - "renderAuto"
Cohesion: 0.15
Nodes (21): api(), approveDraftIds(), autoStatusHtml(), bindDraftBatch(), bindDraftList(), draftBatchBar(), draftCard(), flash() (+13 more)

### Community 33 - "_probe_isolation_inner"
Cohesion: 0.18
Nodes (17): agent_home_dir(), agent_identity_ready(), agent_user_name(), agent_wrapper_path(), isolation_probe_user(), isolation_secret_paths(), isolation_status(), isolation_wrapper_argv() (+9 more)

### Community 34 - "setTab"
Cohesion: 0.38
Nodes (7): autoKicker(), closeMore(), moreTab(), paintDockMore(), setSettingsRoom(), setTab(), toggleMore()

### Community 35 - "tailscale_status"
Cohesion: 0.50
Nodes (4): allow_funnel_on(), funnel_enabled_from_text(), Funnel ON only from an explicit signal — never a Serve HTTPS URL., tailscale_status()

### Community 36 - "Corporation OS — SPEC"
Cohesion: 0.20
Nodes (10): Compare shipped vs this spec, Corporation OS — SPEC, Handoff, Lifecycle, Non-goals, Pins vs registry, Planner, UI north star (+2 more)

### Community 37 - "tg_short_ref"
Cohesion: 0.17
Nodes (17): tg_board_buttons(), tg_board_counts(), tg_board_filter(), tg_board_find(), tg_board_open(), tg_board_page_bounds(), tg_board_pick(), tg_board_pin_names() (+9 more)

### Community 38 - "pin_research"
Cohesion: 0.21
Nodes (12): bullet_covered(), bullet_in_code(), _code_corpus(), git_worktree_hint(), graph_age_of(), graph_freshness(), _issue_ready(), _norm_words() (+4 more)

### Community 39 - "Handoff — first hour"
Cohesion: 0.25
Nodes (8): 1. Tailscale, 2. Passkey, 3. SSH, 4. Two trees, 5. First job = sandbox, not P0, Backup (not git), Handoff — first hour, If you are stuck

### Community 40 - "label_names"
Cohesion: 0.15
Nodes (27): _assemble_board(), board_click(), board_key(), board_payload(), cached_research(), _card_waiting_qa(), close_action(), collect_issues() (+19 more)

### Community 41 - "approve_draft"
Cohesion: 0.15
Nodes (16): approve_draft(), approve_drafts(), draft_issue_body(), load_registry(), merge_registry(), overlay_active(), overlay_diverges(), pin_owns_repo() (+8 more)

### Community 42 - "redact_secrets"
Cohesion: 0.18
Nodes (21): append_log(), notify(), notify_safe(), redact_secrets(), telegram_loop(), telegram_tick(), tg_bot_auth_ok(), tg_clip() (+13 more)

### Community 43 - "run"
Cohesion: 0.13
Nodes (25): add_existing(), bootstrap(), classify_writer_tree(), _clone_to_workspace(), create_issue_rest(), create_project(), ensure_label(), ensure_seed_labels() (+17 more)

### Community 44 - "corp"
Cohesion: 0.67
Nodes (3): corp, Документы, Команды

### Community 48 - "2026-08-23 — Продолжение циклов улучшений corp"
Cohesion: 0.12
Nodes (15): 2026-08-23 — Продолжение циклов улучшений corp, Далее, Инциденты среды (не код), Итог сессии, Контекст, Разблокировка проекта, Решения, Цикл 1 — #126 TG-пейджер — DONE (+7 more)

### Community 49 - "tg_notify_event"
Cohesion: 0.15
Nodes (21): issue_ref(), need_human(), parse_issue_ref(), pulse_label(), pulse_loop(), queue_action_buttons(), tg_board_card_buttons(), tg_card_labels() (+13 more)

### Community 50 - "2026-08-18"
Cohesion: 0.14
Nodes (13): 2026-08-18, Decisions, Open questions, Outcome, Outcome, Outcome, Outcome, Outcome (+5 more)

### Community 51 - "main"
Cohesion: 0.17
Nodes (20): active_projects(), archive_project(), expand(), graph_detail(), graphs_index(), hide_project(), is_pinned(), main() (+12 more)

### Community 52 - "Path"
Cohesion: 0.22
Nodes (14): agent_prompt(), git_head_commit_time(), _path_is_file(), proc_cwd(), proc_start_time(), setup_token_ok(), uvicorn_matches_live(), uvicorn_process_report() (+6 more)

### Community 53 - "paintLocal"
Cohesion: 0.40
Nodes (6): applyOptimistic(), autoTyping(), cardByIssue(), ensureRunStats(), paintLocal(), patchCard()

### Community 54 - "2026-08-22 — PO-сессия: аудит продукта и циклы улучшений"
Cohesion: 0.18
Nodes (10): 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений, Далее по очереди, Контекст, Открытые вопросы, Пакет Issues (все `ready`, с приоритетами), Решения и находки, Сделано, Цикл 1 — #122 writers ff-only guard — DONE (+2 more)

### Community 55 - "install.sh"
Cohesion: 0.33
Nodes (5): log(), PATH, PGHOST, PGPORT, install.sh script

### Community 56 - "run_issue"
Cohesion: 0.20
Nodes (12): can_promote_to_qa(), council_should_auto_qa(), default_slot(), load_env(), new_run_id(), pick_agent(), _role_prompt(), run_issue() (+4 more)

### Community 59 - "issues_for"
Cohesion: 0.25
Nodes (9): github_issues_disabled(), github_transient(), issues_for(), _issues_via_graphql(), _issues_via_rest(), _normalize_rest_issue(), _parse_issue_list(), _pin_issue_job() (+1 more)

### Community 60 - "CorpError"
Cohesion: 0.25
Nodes (7): _claim_age_for(), claim_sticks(), CorpError, latest_claim_info(), latest_claim_run(), run_from_claim_body(), Exception

## Knowledge Gaps
- **294 isolated node(s):** `backend.sh script`, `PATH`, `PGHOST`, `PGPORT`, `start.sh script` (+289 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `g()` connect `sortable.min.js` to `run`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `backend.sh script`, `PATH`, `PGHOST` to the rest of the system?**
  _294 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.05012285012285012 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06585365853658537 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `renderBoard` be split into smaller, more focused modules?**
  _Cohesion score 0.14153846153846153 - nodes in this community are weakly interconnected._