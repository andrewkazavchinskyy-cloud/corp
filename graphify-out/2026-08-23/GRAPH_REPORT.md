# Graph Report - corp  (2026-08-23)

## Corpus Check
- 32 files · ~76,366 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1091 nodes · 2917 edges · 52 communities (46 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `afadde27`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pinned_projects
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
- die
- sortable.min.js
- handle_tg_callback
- tg_status_body
- api_logic.py
- corp
- tg_home_payload
- openSheet
- renderGraphs
- escapeHtml
- council_after_writer
- renderAuto
- Path
- have
- tg_host_lines
- Corporation OS — SPEC
- tg_notify_event
- Handoff — first hour
- tg_screen
- corp
- VPS QA 2026-08-17
- 2026-08-23 — Продолжение циклов улучшений corp
- main
- 2026-08-18
- tg_short_ref
- load_registry
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

## Communities (52 total, 6 thin omitted)

### Community 0 - "pinned_projects"
Cohesion: 0.21
Nodes (15): append_log(), _assemble_board(), board_payload(), cached_research(), draft_summaries(), fetch_github_board(), launch_agent(), maybe_orchestrate() (+7 more)

### Community 2 - "load_workshop"
Cohesion: 0.16
Nodes (23): _clear_registry_overlay(), default_workshop(), draft_by_id(), drop_draft(), load_catalog(), load_workshop(), merge_catalog_row(), new_draft() (+15 more)

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
Cohesion: 0.22
Nodes (16): cardClass(), cardHtml(), cardMatches(), cookieGet(), currentFilter(), draftMatches(), eventKindRu(), matchesQuery() (+8 more)

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
Cohesion: 0.19
Nodes (17): api(), applyOptimistic(), autoTyping(), bindAutoQueue(), bindBoardSortable(), boot(), cardByIssue(), ensureRunStats() (+9 more)

### Community 13 - "run"
Cohesion: 0.19
Nodes (18): add_existing(), approve_draft(), approve_drafts(), classify_writer_tree(), _clone_to_workspace(), create_issue_rest(), create_project(), draft_issue_body() (+10 more)

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
Cohesion: 0.15
Nodes (44): add_labels(), assign_me(), board_click(), board_key(), can_promote_to_qa(), _card_waiting_qa(), claim(), clear_board_overlay() (+36 more)

### Community 22 - "sortable.min.js"
Cohesion: 0.12
Nodes (25): a(), b(), Bt(), D(), e(), f(), g(), h() (+17 more)

### Community 23 - "handle_tg_callback"
Cohesion: 0.32
Nodes (14): handle_tg_callback(), tg_cmd_abort(), tg_cmd_board(), tg_cmd_council(), tg_cmd_drafts(), tg_cmd_go(), tg_cmd_help(), tg_cmd_more() (+6 more)

### Community 24 - "tg_status_body"
Cohesion: 0.15
Nodes (13): tg_cmd_doctor(), tg_cmd_now(), tg_cmd_queue(), tg_cmd_running(), tg_cmd_status(), tg_council_line(), tg_last_queue_error(), tg_now_buttons() (+5 more)

### Community 25 - "api_logic.py"
Cohesion: 0.12
Nodes (24): BaseException, assert_in_qa(), console_log_for_issue(), contour_fields(), graphify_pin_status(), graphify_summary(), isolation_fallback(), issue_waiting_qa() (+16 more)

### Community 26 - "corp"
Cohesion: 0.05
Nodes (58): _claim_age_for(), claim_sticks(), CorpError, council_existing_titles(), council_role_items(), default_slot(), _find_snap_card(), _github_cards() (+50 more)

### Community 27 - "tg_home_payload"
Cohesion: 0.67
Nodes (3): tg_home_payload(), tg_home_text(), tg_reply_keyboard()

### Community 28 - "openSheet"
Cohesion: 0.12
Nodes (27): applyIssueLink(), autoStatusHtml(), bindSheetAct(), bindSheetHouse(), closeSheet(), colWord(), findCardByIssueParam(), githubLink() (+19 more)

### Community 29 - "renderGraphs"
Cohesion: 0.22
Nodes (16): bindGraphDetail(), bindGraphJumps(), bindGraphSearch(), findGroup(), flash(), graphDetailHtml(), graphGalaxyHtml(), graphJumps() (+8 more)

### Community 30 - "escapeHtml"
Cohesion: 0.22
Nodes (16): catalogKind(), contourTreesHtml(), doctorCheckLabel(), doctorChecksHtml(), doctorMeta(), escapeHtml(), fillProfiles(), kindStatus() (+8 more)

### Community 31 - "council_after_writer"
Cohesion: 0.12
Nodes (25): council_abort(), council_after_writer(), council_busy(), council_ff_merge_main(), council_finish_analyze(), council_is_dup(), council_issue_body(), council_load() (+17 more)

### Community 32 - "renderAuto"
Cohesion: 0.12
Nodes (29): approveDraftIds(), autoKicker(), autoProject(), badge(), bindDraftBatch(), bindDraftList(), cookieSet(), draftBatchBar() (+21 more)

### Community 33 - "Path"
Cohesion: 0.05
Nodes (75): agent_argv(), agent_home_dir(), agent_identity_ready(), agent_prompt(), agent_user_name(), agent_wrapper_path(), auth_policy_present(), bullet_covered() (+67 more)

### Community 34 - "have"
Cohesion: 0.09
Nodes (36): allow_funnel_on(), capture_pane(), _cli_identity(), _cursor_mismatch_note(), ensure_path(), funnel_enabled_from_text(), have(), _help_text() (+28 more)

### Community 35 - "tg_host_lines"
Cohesion: 0.67
Nodes (3): tg_host_lines(), tg_server_text(), tg_workshop_up()

### Community 36 - "Corporation OS — SPEC"
Cohesion: 0.20
Nodes (10): Compare shipped vs this spec, Corporation OS — SPEC, Handoff, Lifecycle, Non-goals, Pins vs registry, Planner, UI north star (+2 more)

### Community 38 - "tg_notify_event"
Cohesion: 0.27
Nodes (13): issue_ref(), need_human(), parse_issue_ref(), queue_action_buttons(), tg_board_card_buttons(), tg_card_labels(), tg_cmd_retry(), tg_event_buttons() (+5 more)

### Community 39 - "Handoff — first hour"
Cohesion: 0.25
Nodes (8): 1. Tailscale, 2. Passkey, 3. SSH, 4. Two trees, 5. First job = sandbox, not P0, Backup (not git), Handoff — first hour, If you are stuck

### Community 42 - "tg_screen"
Cohesion: 0.17
Nodes (20): handle_tg_reply(), handle_tg_text(), queue_set_running(), telegram_tick(), tg_ask_qa_note(), tg_cmd_go_yes(), tg_cmd_pause(), tg_do_abort() (+12 more)

### Community 44 - "corp"
Cohesion: 0.67
Nodes (3): corp, Документы, Команды

### Community 48 - "2026-08-23 — Продолжение циклов улучшений corp"
Cohesion: 0.25
Nodes (7): 2026-08-23 — Продолжение циклов улучшений corp, Далее, Инциденты среды (не код), Контекст, Разблокировка проекта, Решения, Цикл 1 — #126 TG-пейджер — DONE

### Community 49 - "main"
Cohesion: 0.13
Nodes (29): active_projects(), archive_project(), bootstrap(), collect_issues(), cycle_payload(), expand(), gh_ready(), graph_detail() (+21 more)

### Community 50 - "2026-08-18"
Cohesion: 0.14
Nodes (13): 2026-08-18, Decisions, Open questions, Outcome, Outcome, Outcome, Outcome, Outcome (+5 more)

### Community 51 - "tg_short_ref"
Cohesion: 0.09
Nodes (39): council_enqueue_refs(), issue_detail(), notify(), notify_safe(), queue_abort(), queue_item(), rank(), record_event() (+31 more)

### Community 52 - "load_registry"
Cohesion: 0.32
Nodes (8): load_registry(), merge_registry(), overlay_active(), overlay_diverges(), True only when overlay adds a project or changes a pin vs git registry., git registry.json is canonical. Overlay is emergency-only. Overlay may add…, _registry_overlay(), registry_status()

### Community 54 - "2026-08-22 — PO-сессия: аудит продукта и циклы улучшений"
Cohesion: 0.18
Nodes (10): 2026-08-22 — PO-сессия: аудит продукта и циклы улучшений, Далее по очереди, Контекст, Открытые вопросы, Пакет Issues (все `ready`, с приоритетами), Решения и находки, Сделано, Цикл 1 — #122 writers ff-only guard — DONE (+2 more)

### Community 55 - "install.sh"
Cohesion: 0.33
Nodes (5): log(), PATH, PGHOST, PGPORT, install.sh script

## Knowledge Gaps
- **283 isolated node(s):** `backend.sh script`, `PATH`, `PGHOST`, `PGPORT`, `start.sh script` (+278 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `load_workshop`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Why does `g()` connect `sortable.min.js` to `run`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `backend.sh script`, `PATH`, `PGHOST` to the rest of the system?**
  _283 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.0509683995922528 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08735632183908046 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `2026-08-16` be split into smaller, more focused modules?**
  _Cohesion score 0.034482758620689655 - nodes in this community are weakly interconnected._