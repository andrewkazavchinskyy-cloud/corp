# Graph Report - corp  (2026-08-23)

## Corpus Check
- 32 files · ~76,221 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1089 nodes · 2907 edges · 52 communities (46 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0fc709e9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- tmux_alive
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
- run
- memory/README.md
- Corporation operating contract
- Server
- agent-isolation-smoke.sh
- corp-agent-exec
- provision-agent-identity.sh
- run_issue
- sortable.min.js
- CorpError
- api_logic.py
- corp
- setTab
- openSheet
- renderGraphs
- escapeHtml
- council_after_writer
- renderAuto
- Path
- have
- Corporation OS — SPEC
- parse_issue_ref
- Handoff — first hour
- tailscale_status
- handle_tg_callback
- corp
- VPS QA 2026-08-17
- 2026-08-23 — Продолжение циклов улучшений corp
- main
- 2026-08-18
- tg_short_ref
- approve_draft
- 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений
- install.sh
- backend.sh
- start.sh
- orchestrate

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

## Communities (52 total, 6 thin omitted)

### Community 0 - "tmux_alive"
Cohesion: 0.24
Nodes (14): capture_pane(), last_log_lines(), _launch_agent_inner(), log_line_matches_issue(), orch_alive(), orch_session(), orch_status(), tg_agent_rows() (+6 more)

### Community 2 - "load_workshop"
Cohesion: 0.10
Nodes (45): _assemble_board(), board_click(), board_key(), board_payload(), cached_research(), _card_waiting_qa(), clear_board_overlay(), council_save() (+37 more)

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

### Community 13 - "run"
Cohesion: 0.24
Nodes (18): add_existing(), assign_me(), classify_writer_tree(), _clone_to_workspace(), create_issue_rest(), create_project(), die(), ensure_label() (+10 more)

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
Nodes (50): add_labels(), agent_prompt(), can_promote_to_qa(), claim(), claim_sticks(), close_action(), close_issue(), collect_issues() (+42 more)

### Community 22 - "sortable.min.js"
Cohesion: 0.12
Nodes (25): a(), b(), Bt(), D(), e(), f(), g(), h() (+17 more)

### Community 23 - "CorpError"
Cohesion: 0.33
Nodes (5): _claim_age_for(), CorpError, latest_claim_info(), run_from_claim_body(), Exception

### Community 25 - "api_logic.py"
Cohesion: 0.12
Nodes (24): BaseException, assert_in_qa(), console_log_for_issue(), contour_fields(), graphify_pin_status(), graphify_summary(), isolation_fallback(), issue_waiting_qa() (+16 more)

### Community 26 - "corp"
Cohesion: 0.06
Nodes (54): _clear_registry_overlay(), council_existing_titles(), council_is_dup(), council_norm_title(), council_pick_items(), github_issues_disabled(), _heartbeat_age_for(), heartbeat_age_from_log() (+46 more)

### Community 27 - "setTab"
Cohesion: 0.32
Nodes (8): autoKicker(), eventKindRu(), moreTab(), paintDockMore(), renderJournal(), renderJournalHtml(), setSettingsRoom(), setTab()

### Community 28 - "openSheet"
Cohesion: 0.14
Nodes (23): applyIssueLink(), autoStatusHtml(), bindSheetAct(), findCardByIssueParam(), githubLink(), hideSheet(), humanizeError(), humanReason() (+15 more)

### Community 29 - "renderGraphs"
Cohesion: 0.22
Nodes (16): bindGraphDetail(), bindGraphJumps(), bindGraphSearch(), findGroup(), flash(), graphDetailHtml(), graphGalaxyHtml(), graphJumps() (+8 more)

### Community 30 - "escapeHtml"
Cohesion: 0.22
Nodes (16): catalogKind(), contourTreesHtml(), doctorCheckLabel(), doctorChecksHtml(), doctorMeta(), escapeHtml(), fillProfiles(), kindStatus() (+8 more)

### Community 31 - "council_after_writer"
Cohesion: 0.11
Nodes (26): append_log(), council_abort(), council_after_writer(), council_busy(), council_enqueue_refs(), council_ff_merge_main(), council_finish_analyze(), council_issue_body() (+18 more)

### Community 32 - "renderAuto"
Cohesion: 0.13
Nodes (24): approveDraftIds(), autoProject(), badge(), bindDraftBatch(), bindDraftList(), cookieSet(), draftBatchBar(), draftCard() (+16 more)

### Community 33 - "Path"
Cohesion: 0.06
Nodes (64): agent_home_dir(), agent_identity_ready(), agent_user_name(), agent_wrapper_path(), auth_policy_present(), bullet_covered(), bullet_in_code(), _code_corpus() (+56 more)

### Community 34 - "have"
Cohesion: 0.14
Nodes (23): _cli_identity(), council_launch_analyzers(), council_writer_kind(), _cursor_mismatch_note(), ensure_path(), have(), _help_text(), kind_cli_ok() (+15 more)

### Community 36 - "Corporation OS — SPEC"
Cohesion: 0.20
Nodes (10): Compare shipped vs this spec, Corporation OS — SPEC, Handoff, Lifecycle, Non-goals, Pins vs registry, Planner, UI north star (+2 more)

### Community 38 - "parse_issue_ref"
Cohesion: 0.39
Nodes (8): parse_issue_ref(), run_next(), tg_event_buttons(), tg_github_issue_url(), tg_need_human_buttons(), tg_parse_issue_arg(), tg_workshop_issue_url(), Namespace

### Community 39 - "Handoff — first hour"
Cohesion: 0.25
Nodes (8): 1. Tailscale, 2. Passkey, 3. SSH, 4. Two trees, 5. First job = sandbox, not P0, Backup (not git), Handoff — first hour, If you are stuck

### Community 40 - "tailscale_status"
Cohesion: 0.50
Nodes (4): allow_funnel_on(), funnel_enabled_from_text(), Funnel ON only from an explicit signal — never a Serve HTTPS URL., tailscale_status()

### Community 42 - "handle_tg_callback"
Cohesion: 0.13
Nodes (35): handle_tg_callback(), handle_tg_reply(), handle_tg_text(), issue_ref(), queue_action_buttons(), queue_set_running(), telegram_tick(), tg_ask_qa_note() (+27 more)

### Community 44 - "corp"
Cohesion: 0.67
Nodes (3): corp, Документы, Команды

### Community 48 - "2026-08-23 — Продолжение циклов улучшений corp"
Cohesion: 0.25
Nodes (7): 2026-08-23 — Продолжение циклов улучшений corp, Далее, Инциденты среды (не код), Контекст, Разблокировка проекта, Решения, Цикл 1 — #126 TG-пейджер — DONE

### Community 49 - "main"
Cohesion: 0.15
Nodes (25): active_projects(), archive_project(), bootstrap(), cycle_payload(), gh_ready(), graph_detail(), graphs_index(), hide_project() (+17 more)

### Community 50 - "2026-08-18"
Cohesion: 0.14
Nodes (13): 2026-08-18, Decisions, Open questions, Outcome, Outcome, Outcome, Outcome, Outcome (+5 more)

### Community 51 - "tg_short_ref"
Cohesion: 0.13
Nodes (29): issue_detail(), issue_runs(), need_human(), notify(), notify_safe(), queue_abort(), queue_item(), reap_orphan_claims() (+21 more)

### Community 52 - "approve_draft"
Cohesion: 0.12
Nodes (20): approve_draft(), approve_drafts(), cmd_queue(), draft_issue_body(), load_registry(), merge_registry(), overlay_active(), overlay_diverges() (+12 more)

### Community 54 - "2026-08-22 — PO-сессия: аудит продукта и циклы улучшений"
Cohesion: 0.18
Nodes (10): 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений, Далее по очереди, Контекст, Открытые вопросы, Пакет Issues (все `ready`, с приоритетами), Решения и находки, Сделано, Цикл 1 — #122 writers ff-only guard — DONE (+2 more)

### Community 55 - "install.sh"
Cohesion: 0.33
Nodes (5): log(), PATH, PGHOST, PGPORT, install.sh script

### Community 59 - "orchestrate"
Cohesion: 0.19
Nodes (14): agent_argv(), config_dir(), council_analyze_prompt(), council_role_brief(), council_role_items(), council_run_role_sync(), council_spawn_role(), orch_gap_payload() (+6 more)

## Knowledge Gaps
- **283 isolated node(s):** `backend.sh script`, `PATH`, `PGHOST`, `PGPORT`, `start.sh script` (+278 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `g()` connect `sortable.min.js` to `run`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `backend.sh script`, `PATH`, `PGHOST` to the rest of the system?**
  _283 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `load_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.10303030303030303 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.0509683995922528 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08735632183908046 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._