# Graph Report - corp  (2026-08-23)

## Corpus Check
- 31 files · ~72,740 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1060 nodes · 2825 edges · 46 communities (40 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 46 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2e755730`
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
- renderProject
- memory/README.md
- Corporation operating contract
- Server
- agent-isolation-smoke.sh
- corp-agent-exec
- provision-agent-identity.sh
- sortable.min.js
- die
- api_logic.py
- corp
- setTab
- openSheet
- renderGraphs
- escapeHtml
- council_after_writer
- renderBoard
- tg_upsert_board
- Corporation OS — SPEC
- label_names
- Handoff — first hour
- renderAuto
- handle_tg_callback
- corp
- VPS QA 2026-08-17
- 2026-08-18
- redact_secrets
- overlay_diverges
- 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений
- install.sh
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

## Communities (46 total, 6 thin omitted)

### Community 0 - "have"
Cohesion: 0.12
Nodes (26): allow_funnel_on(), capture_pane(), _cli_identity(), ensure_path(), funnel_enabled_from_text(), have(), _help_text(), launch_agent() (+18 more)

### Community 2 - "load_workshop"
Cohesion: 0.11
Nodes (33): _clear_registry_overlay(), _cursor_mismatch_note(), default_workshop(), draft_by_id(), draft_summaries(), drop_draft(), load_catalog(), load_workshop() (+25 more)

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
Cohesion: 0.06
Nodes (64): agent_home_dir(), agent_identity_ready(), agent_prompt(), agent_user_name(), agent_wrapper_path(), auth_policy_present(), bullet_covered(), bullet_in_code() (+56 more)

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

### Community 12 - "renderProject"
Cohesion: 0.23
Nodes (13): api(), approveDraftIds(), bindDraftBatch(), bindDraftList(), draftBatchBar(), eventKindRu(), orchCard(), phoneNarrow() (+5 more)

### Community 16 - "Corporation operating contract"
Cohesion: 0.29
Nodes (6): Absolute Git preservation, Corporation operating contract, How to work, New projects, Session start, Source of truth

### Community 17 - "Server"
Cohesion: 0.29
Nodes (7): Agents, Deploy live additively, Server, Telegram, Two trees, Who does what, Workshop

### Community 18 - "agent-isolation-smoke.sh"
Cohesion: 0.83
Nodes (3): bad(), pass(), agent-isolation-smoke.sh script

### Community 22 - "sortable.min.js"
Cohesion: 0.12
Nodes (25): a(), b(), Bt(), D(), e(), f(), g(), h() (+17 more)

### Community 23 - "die"
Cohesion: 0.05
Nodes (106): active_projects(), add_existing(), add_labels(), approve_draft(), approve_drafts(), archive_project(), assign_me(), bootstrap() (+98 more)

### Community 25 - "api_logic.py"
Cohesion: 0.12
Nodes (24): BaseException, assert_in_qa(), console_log_for_issue(), contour_fields(), graphify_pin_status(), graphify_summary(), isolation_fallback(), issue_waiting_qa() (+16 more)

### Community 26 - "corp"
Cohesion: 0.05
Nodes (65): agent_argv(), config_dir(), council_analyze_prompt(), council_existing_titles(), council_is_dup(), council_launch_analyzers(), council_norm_title(), council_pick_items() (+57 more)

### Community 27 - "setTab"
Cohesion: 0.38
Nodes (7): autoKicker(), closeMore(), moreTab(), paintDockMore(), setSettingsRoom(), setTab(), toggleMore()

### Community 28 - "openSheet"
Cohesion: 0.12
Nodes (28): applyIssueLink(), applyOptimistic(), bindAutoQueue(), bindBoardSortable(), bindSheetAct(), bindSheetHouse(), cardByIssue(), closeSheet() (+20 more)

### Community 29 - "renderGraphs"
Cohesion: 0.22
Nodes (16): bindGraphDetail(), bindGraphJumps(), bindGraphSearch(), findGroup(), flash(), graphDetailHtml(), graphGalaxyHtml(), graphJumps() (+8 more)

### Community 30 - "escapeHtml"
Cohesion: 0.21
Nodes (18): catalogKind(), contourTreesHtml(), doctorCheckLabel(), doctorChecksHtml(), doctorMeta(), escapeHtml(), fillProfiles(), kindStatus() (+10 more)

### Community 31 - "council_after_writer"
Cohesion: 0.27
Nodes (10): council_abort(), council_after_writer(), council_ff_merge_main(), council_load(), council_mark_phase(), council_qa_verdict(), council_review_prompt(), council_save() (+2 more)

### Community 32 - "renderBoard"
Cohesion: 0.23
Nodes (15): autoTyping(), cardClass(), cardHtml(), cardMatches(), cookieGet(), currentFilter(), draftMatches(), matchesQuery() (+7 more)

### Community 35 - "tg_upsert_board"
Cohesion: 0.15
Nodes (20): rank(), tg_board_buttons(), tg_board_counts(), tg_board_filter(), tg_board_find(), tg_board_open(), tg_board_page_bounds(), tg_board_pick() (+12 more)

### Community 36 - "Corporation OS — SPEC"
Cohesion: 0.20
Nodes (10): Compare shipped vs this spec, Corporation OS — SPEC, Handoff, Lifecycle, Non-goals, Pins vs registry, Planner, UI north star (+2 more)

### Community 37 - "label_names"
Cohesion: 0.11
Nodes (34): _assemble_board(), board_click(), board_key(), board_payload(), cached_research(), _card_waiting_qa(), clear_board_overlay(), close_action() (+26 more)

### Community 39 - "Handoff — first hour"
Cohesion: 0.25
Nodes (8): 1. Tailscale, 2. Passkey, 3. SSH, 4. Two trees, 5. First job = sandbox, not P0, Backup (not git), Handoff — first hour, If you are stuck

### Community 40 - "renderAuto"
Cohesion: 0.15
Nodes (19): autoProject(), autoStatusHtml(), badge(), cookieSet(), draftCard(), goNext(), humanizeError(), humanReason() (+11 more)

### Community 42 - "handle_tg_callback"
Cohesion: 0.14
Nodes (35): council_busy(), council_finish_analyze(), council_issue_body(), council_scope(), council_start(), council_tick(), council_tmux_map(), handle_tg_callback() (+27 more)

### Community 44 - "corp"
Cohesion: 0.67
Nodes (3): corp, Документы, Команды

### Community 50 - "2026-08-18"
Cohesion: 0.14
Nodes (13): 2026-08-18, Decisions, Open questions, Outcome, Outcome, Outcome, Outcome, Outcome (+5 more)

### Community 51 - "redact_secrets"
Cohesion: 0.15
Nodes (20): append_log(), CorpError, redact_secrets(), telegram_loop(), telegram_tick(), tg_bot_auth_ok(), tg_clip(), tg_creds() (+12 more)

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
- **277 isolated node(s):** `backend.sh script`, `PATH`, `PGHOST`, `PGPORT`, `start.sh script` (+272 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Why does `g()` connect `sortable.min.js` to `die`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `2026-08-17` connect `2026-08-17` to `VPS QA 2026-08-17`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `backend.sh script`, `PATH`, `PGHOST` to the rest of the system?**
  _277 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `have` be split into smaller, more focused modules?**
  _Cohesion score 0.11692307692307692 - nodes in this community are weakly interconnected._
- **Should `load_workshop` be split into smaller, more focused modules?**
  _Cohesion score 0.11363636363636363 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.052019044260271555 - nodes in this community are weakly interconnected._