# Graph Report - corp  (2026-08-23)

## Corpus Check
- 32 files · ~73,905 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1073 nodes · 2850 edges · 60 communities (53 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 46 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f306ad51`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- launch_agent
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
- orchestrate
- die
- memory/README.md
- Corporation operating contract
- Server
- agent-isolation-smoke.sh
- corp-agent-exec
- provision-agent-identity.sh
- run_issue
- sortable.min.js
- main
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
- have
- tg_board_text
- Corporation OS — SPEC
- label_names
- issue_ref
- Handoff — first hour
- renderAuto
- pin_research
- handle_tg_callback
- write
- corp
- VPS QA 2026-08-17
- issues_for
- 2026-08-23 — Продолжение циклов улучшений corp
- project_dir
- 2026-08-18
- redact_secrets
- load_registry
- CorpError
- 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений
- install.sh
- tailscale_status
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

## Communities (60 total, 7 thin omitted)

### Community 0 - "launch_agent"
Cohesion: 0.19
Nodes (17): capture_pane(), council_spawn_role(), launch_agent(), orch_alive(), orch_session(), orch_status(), queue_rm(), tg_agent_rows() (+9 more)

### Community 2 - "load_workshop"
Cohesion: 0.11
Nodes (35): approve_draft(), approve_drafts(), clear_board_overlay(), _clear_registry_overlay(), _cursor_mismatch_note(), default_workshop(), draft_by_id(), draft_issue_body() (+27 more)

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
Cohesion: 0.15
Nodes (21): agent_argv(), agent_prompt(), council_analyze_prompt(), council_role_brief(), council_run_role_sync(), git_head_commit_time(), load_events(), _path_is_file() (+13 more)

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

### Community 12 - "orchestrate"
Cohesion: 0.14
Nodes (16): config_dir(), council_role_items(), last_log_lines(), log_line_matches_issue(), new_draft(), orch_gap_payload(), orch_open_lines(), orch_spec_rels() (+8 more)

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

### Community 21 - "run_issue"
Cohesion: 0.17
Nodes (33): add_labels(), can_promote_to_qa(), claim(), close_issue(), comment(), council_should_auto_qa(), drop_self(), get_issue() (+25 more)

### Community 22 - "sortable.min.js"
Cohesion: 0.12
Nodes (25): a(), b(), Bt(), D(), e(), f(), g(), h() (+17 more)

### Community 23 - "main"
Cohesion: 0.25
Nodes (11): cmd_queue(), hide_project(), main(), maybe_orchestrate(), profile_by_id(), project_by_name(), project_stage(), run_next() (+3 more)

### Community 24 - "_probe_isolation_inner"
Cohesion: 0.20
Nodes (16): agent_home_dir(), agent_identity_ready(), agent_user_name(), agent_wrapper_path(), isolation_probe_user(), isolation_secret_paths(), isolation_status(), isolation_wrapper_argv() (+8 more)

### Community 25 - "api_logic.py"
Cohesion: 0.12
Nodes (24): BaseException, assert_in_qa(), console_log_for_issue(), contour_fields(), graphify_pin_status(), graphify_summary(), isolation_fallback(), issue_waiting_qa() (+16 more)

### Community 26 - "corp"
Cohesion: 0.06
Nodes (41): active_projects(), council_is_dup(), council_norm_title(), council_pick_items(), graph_detail(), graphs_index(), is_pinned(), orch_prompt() (+33 more)

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
Cohesion: 0.11
Nodes (27): council_abort(), council_after_writer(), council_busy(), council_existing_titles(), council_ff_merge_main(), council_finish_analyze(), council_issue_body(), council_launch_analyzers() (+19 more)

### Community 32 - "renderBoard"
Cohesion: 0.23
Nodes (15): autoTyping(), cardClass(), cardHtml(), cardMatches(), cookieGet(), currentFilter(), draftMatches(), matchesQuery() (+7 more)

### Community 33 - "doctor_payload"
Cohesion: 0.27
Nodes (15): auth_policy_present(), council_deploy_trees(), doctor(), doctor_lines(), doctor_payload(), git_registry_candidates(), git_tree_report(), graph_freshness() (+7 more)

### Community 34 - "have"
Cohesion: 0.19
Nodes (18): bootstrap(), _cli_identity(), ensure_path(), gh_ready(), have(), _help_text(), kind_cli_ok(), load_env() (+10 more)

### Community 35 - "tg_board_text"
Cohesion: 0.20
Nodes (14): tg_board_buttons(), tg_board_counts(), tg_board_filter(), tg_board_find(), tg_board_open(), tg_board_page_bounds(), tg_board_pick(), tg_board_pin_names() (+6 more)

### Community 36 - "Corporation OS — SPEC"
Cohesion: 0.20
Nodes (10): Compare shipped vs this spec, Corporation OS — SPEC, Handoff, Lifecycle, Non-goals, Pins vs registry, Planner, UI north star (+2 more)

### Community 37 - "label_names"
Cohesion: 0.14
Nodes (28): _assemble_board(), board_click(), board_key(), board_payload(), cached_research(), _card_waiting_qa(), close_action(), collect_issues() (+20 more)

### Community 38 - "issue_ref"
Cohesion: 0.26
Nodes (12): council_enqueue_refs(), issue_ref(), parse_issue_ref(), queue_action_buttons(), tg_board_card_buttons(), tg_card_labels(), tg_cmd_retry(), tg_event_buttons() (+4 more)

### Community 39 - "Handoff — first hour"
Cohesion: 0.25
Nodes (8): 1. Tailscale, 2. Passkey, 3. SSH, 4. Two trees, 5. First job = sandbox, not P0, Backup (not git), Handoff — first hour, If you are stuck

### Community 40 - "renderAuto"
Cohesion: 0.13
Nodes (28): api(), approveDraftIds(), autoProject(), badge(), bindDraftBatch(), bindDraftList(), cookieSet(), draftBatchBar() (+20 more)

### Community 41 - "pin_research"
Cohesion: 0.22
Nodes (11): bullet_covered(), bullet_in_code(), _code_corpus(), git_worktree_hint(), graph_age_of(), _issue_ready(), _norm_words(), pin_research() (+3 more)

### Community 42 - "handle_tg_callback"
Cohesion: 0.19
Nodes (26): handle_tg_callback(), handle_tg_reply(), handle_tg_text(), queue_set_running(), tg_ask_qa_note(), tg_cmd_abort(), tg_cmd_board(), tg_cmd_council() (+18 more)

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

### Community 49 - "project_dir"
Cohesion: 0.22
Nodes (10): cycle_payload(), expand(), is_free_ready(), project_dir(), project_seed_files(), session_notes(), split_ready(), status() (+2 more)

### Community 50 - "2026-08-18"
Cohesion: 0.14
Nodes (13): 2026-08-18, Decisions, Open questions, Outcome, Outcome, Outcome, Outcome, Outcome (+5 more)

### Community 51 - "redact_secrets"
Cohesion: 0.18
Nodes (21): append_log(), notify(), notify_safe(), redact_secrets(), telegram_loop(), telegram_tick(), tg_bot_auth_ok(), tg_clip() (+13 more)

### Community 52 - "load_registry"
Cohesion: 0.20
Nodes (12): load_registry(), merge_registry(), overlay_active(), overlay_diverges(), queue_status(), True only when overlay adds a project or changes a pin vs git registry., git registry.json is canonical. Overlay is emergency-only. Overlay may add…, _registry_overlay() (+4 more)

### Community 53 - "CorpError"
Cohesion: 0.33
Nodes (5): claim_sticks(), CorpError, latest_claim_run(), run_from_claim_body(), Exception

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
- **283 isolated node(s):** `backend.sh script`, `PATH`, `PGHOST`, `PGPORT`, `start.sh script` (+278 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `g()` connect `sortable.min.js` to `die`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `backend.sh script`, `PATH`, `PGHOST` to the rest of the system?**
  _283 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `load_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.11092436974789915 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.052019044260271555 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08266129032258064 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._