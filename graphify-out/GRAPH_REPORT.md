# Graph Report - corp  (2026-08-23)

## Corpus Check
- 32 files · ~77,240 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1101 nodes · 2929 edges · 54 communities (48 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9e92b8cd`
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
- die
- sortable.min.js
- handle_tg_callback
- tg_cmd_now
- api_logic.py
- corp
- cmd_queue
- openSheet
- renderGraphs
- escapeHtml
- council_after_writer
- renderAuto
- Path
- label_names
- Corporation OS — SPEC
- push_draft_card
- tg_short_ref
- Handoff — first hour
- pinned_projects
- setTab
- redact_secrets
- corp
- VPS QA 2026-08-17
- 2026-08-23 — Продолжение циклов улучшений corp
- main
- 2026-08-18
- tg_board_text
- overlay_diverges
- 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений
- install.sh
- backend.sh
- start.sh

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

## Communities (54 total, 6 thin omitted)

### Community 0 - "run"
Cohesion: 0.13
Nodes (23): add_existing(), allow_funnel_on(), approve_draft(), approve_drafts(), classify_writer_tree(), _clone_to_workspace(), create_issue_rest(), create_project() (+15 more)

### Community 2 - "load_workshop"
Cohesion: 0.16
Nodes (27): clear_board_overlay(), council_save(), draft_by_id(), drop_draft(), load_workshop(), new_draft(), prune_drafts(), queue_rm() (+19 more)

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
Cohesion: 0.13
Nodes (24): _cli_identity(), council_writer_kind(), _cursor_mismatch_note(), ensure_path(), have(), _help_text(), kind_cli_ok(), load_catalog() (+16 more)

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
Cohesion: 0.21
Nodes (31): add_labels(), agent_prompt(), assign_me(), can_promote_to_qa(), claim(), claim_sticks(), close_issue(), comment() (+23 more)

### Community 22 - "sortable.min.js"
Cohesion: 0.12
Nodes (25): a(), b(), Bt(), D(), e(), f(), g(), h() (+17 more)

### Community 23 - "handle_tg_callback"
Cohesion: 0.18
Nodes (25): handle_tg_callback(), queue_set_running(), tg_cmd_abort(), tg_cmd_board(), tg_cmd_council(), tg_cmd_drafts(), tg_cmd_go(), tg_cmd_go_yes() (+17 more)

### Community 24 - "tg_cmd_now"
Cohesion: 0.40
Nodes (5): tg_cmd_doctor(), tg_cmd_now(), tg_cmd_queue(), tg_cmd_running(), tg_cmd_status()

### Community 25 - "api_logic.py"
Cohesion: 0.12
Nodes (24): BaseException, assert_in_qa(), console_log_for_issue(), contour_fields(), graphify_pin_status(), graphify_summary(), isolation_fallback(), issue_waiting_qa() (+16 more)

### Community 26 - "corp"
Cohesion: 0.06
Nodes (56): capture_pane(), _claim_age_for(), council_is_dup(), council_norm_title(), council_pick_items(), council_role_items(), default_slot(), _heartbeat_age_for() (+48 more)

### Community 27 - "cmd_queue"
Cohesion: 0.20
Nodes (11): cmd_queue(), default_workshop(), queue_abort(), queue_decision(), queue_item(), queue_status(), propose → approve → queue → reap → rollback. No gh, tmux, or paid agent., reap_queue() (+3 more)

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
Cohesion: 0.12
Nodes (24): council_abort(), council_after_writer(), council_busy(), council_existing_titles(), council_ff_merge_main(), council_finish_analyze(), council_issue_body(), council_load() (+16 more)

### Community 32 - "renderAuto"
Cohesion: 0.13
Nodes (24): approveDraftIds(), autoProject(), badge(), bindDraftBatch(), bindDraftList(), cookieSet(), draftBatchBar(), draftCard() (+16 more)

### Community 33 - "Path"
Cohesion: 0.06
Nodes (72): agent_argv(), agent_home_dir(), agent_identity_ready(), agent_user_name(), agent_wrapper_path(), auth_policy_present(), bullet_covered(), bullet_in_code() (+64 more)

### Community 35 - "label_names"
Cohesion: 0.09
Nodes (30): board_click(), _card_waiting_qa(), close_action(), collect_issues(), column_of(), CorpError, _find_snap_card(), _github_cards() (+22 more)

### Community 36 - "Corporation OS — SPEC"
Cohesion: 0.20
Nodes (10): Compare shipped vs this spec, Corporation OS — SPEC, Handoff, Lifecycle, Non-goals, Pins vs registry, Planner, UI north star (+2 more)

### Community 37 - "push_draft_card"
Cohesion: 0.40
Nodes (5): push_draft_card(), tg_draft_buttons(), tg_draft_card_text(), tg_more_buttons(), tg_shop_url()

### Community 38 - "tg_short_ref"
Cohesion: 0.15
Nodes (21): council_enqueue_refs(), issue_ref(), issue_runs(), need_human(), parse_issue_ref(), queue_action_buttons(), reap_orphan_claims(), tg_board_card_buttons() (+13 more)

### Community 39 - "Handoff — first hour"
Cohesion: 0.25
Nodes (8): 1. Tailscale, 2. Passkey, 3. SSH, 4. Two trees, 5. First job = sandbox, not P0, Backup (not git), Handoff — first hour, If you are stuck

### Community 40 - "pinned_projects"
Cohesion: 0.29
Nodes (12): _assemble_board(), board_key(), board_payload(), cached_research(), draft_summaries(), fetch_github_board(), local_board_card(), maybe_refresh_board() (+4 more)

### Community 41 - "setTab"
Cohesion: 0.32
Nodes (8): autoKicker(), eventKindRu(), moreTab(), paintDockMore(), renderJournal(), renderJournalHtml(), setSettingsRoom(), setTab()

### Community 42 - "redact_secrets"
Cohesion: 0.16
Nodes (24): append_log(), handle_tg_reply(), handle_tg_text(), notify(), notify_safe(), redact_secrets(), telegram_loop(), telegram_tick() (+16 more)

### Community 44 - "corp"
Cohesion: 0.67
Nodes (3): corp, Документы, Команды

### Community 48 - "2026-08-23 — Продолжение циклов улучшений corp"
Cohesion: 0.12
Nodes (15): 2026-08-23 — Продолжение циклов улучшений corp, Далее, Инциденты среды (не код), Итог сессии, Контекст, Разблокировка проекта, Решения, Цикл 1 — #126 TG-пейджер — DONE (+7 more)

### Community 49 - "main"
Cohesion: 0.12
Nodes (29): active_projects(), archive_project(), bootstrap(), _clear_registry_overlay(), cycle_payload(), expand(), gh_ready(), graph_detail() (+21 more)

### Community 50 - "2026-08-18"
Cohesion: 0.14
Nodes (13): 2026-08-18, Decisions, Open questions, Outcome, Outcome, Outcome, Outcome, Outcome (+5 more)

### Community 51 - "tg_board_text"
Cohesion: 0.20
Nodes (14): tg_board_buttons(), tg_board_counts(), tg_board_filter(), tg_board_find(), tg_board_open(), tg_board_page_bounds(), tg_board_pick(), tg_board_pin_names() (+6 more)

### Community 52 - "overlay_diverges"
Cohesion: 0.50
Nodes (5): overlay_active(), overlay_diverges(), True only when overlay adds a project or changes a pin vs git registry., _registry_overlay(), registry_status()

### Community 54 - "2026-08-22 — PO-сессия: аудит продукта и циклы улучшений"
Cohesion: 0.18
Nodes (10): 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений, Далее по очереди, Контекст, Открытые вопросы, Пакет Issues (все `ready`, с приоритетами), Решения и находки, Сделано, Цикл 1 — #122 writers ff-only guard — DONE (+2 more)

### Community 55 - "install.sh"
Cohesion: 0.33
Nodes (5): log(), PATH, PGHOST, PGPORT, install.sh script

## Knowledge Gaps
- **291 isolated node(s):** `backend.sh script`, `PATH`, `PGHOST`, `PGPORT`, `start.sh script` (+286 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `g()` connect `sortable.min.js` to `run`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `backend.sh script`, `PATH`, `PGHOST` to the rest of the system?**
  _291 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `run` be split into smaller, more focused modules?**
  _Cohesion score 0.13438735177865613 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.0509683995922528 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08735632183908046 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._