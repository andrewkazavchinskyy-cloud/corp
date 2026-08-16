# Graph Report - corp  (2026-08-16)

## Corpus Check
- 20 files · ~34,005 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 527 nodes · 1417 edges · 20 communities (16 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.53)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `74024cb2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- die
- README.md
- corp
- Harness
- app.py
- app.js
- Workshop operating contract
- Path
- Agent isolation (corp#41)
- 2026-08-15
- 2026-08-16
- 2026-08-17
- CorpError
- memory/README.md
- Corporation operating contract
- Server
- agent-isolation-smoke.sh
- corp-agent-exec
- provision-agent-identity.sh

## God Nodes (most connected - your core abstractions)
1. `2026-08-16` - 57 edges
2. `escapeHtml()` - 27 edges
3. `call()` - 22 edges
4. `2026-08-17` - 21 edges
5. `refresh()` - 18 edges
6. `renderGraphs()` - 16 edges
7. `Workshop operating contract` - 16 edges
8. `openSheet()` - 15 edges
9. `renderAuto()` - 15 edges
10. `db()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `request_scheme()` --calls--> `is_loopback_host()`  [EXTRACTED]
  workshop/app.py → workshop/auth_policy.py
- `request_scheme()` --calls--> `trusted_scheme()`  [EXTRACTED]
  workshop/app.py → workshop/auth_policy.py
- `session_ok()` --calls--> `prune_auth_tables()`  [EXTRACTED]
  workshop/app.py → workshop/auth_policy.py
- `session_ok()` --calls--> `session_valid()`  [EXTRACTED]
  workshop/app.py → workshop/auth_policy.py
- `revoke_sessions()` --calls--> `delete_all_sessions()`  [EXTRACTED]
  workshop/app.py → workshop/auth_policy.py

## Import Cycles
- None detected.

## Communities (20 total, 4 thin omitted)

### Community 0 - "die"
Cohesion: 0.08
Nodes (76): active_projects(), add_existing(), add_labels(), agent_argv(), archive_project(), assign_me(), board_payload(), bootstrap() (+68 more)

### Community 1 - "README.md"
Cohesion: 0.25
Nodes (3): corp, Документы, Команды

### Community 2 - "corp"
Cohesion: 0.06
Nodes (99): append_log(), approve_draft(), capture_pane(), _cli_identity(), cmd_queue(), config_dir(), _cursor_mismatch_note(), default_workshop() (+91 more)

### Community 3 - "Harness"
Cohesion: 0.22
Nodes (9): Bootstrap on a new device, Cycle, Graphify, Harness, Memory, Persistent runner, Planner, Research loop (+1 more)

### Community 4 - "app.py"
Cohesion: 0.07
Nodes (81): Connection, FileResponse, get, JSONResponse, middleware, on_event, post, Request (+73 more)

### Community 5 - "app.js"
Cohesion: 0.06
Nodes (90): api(), autoProject(), autoTyping(), autoUi, b64urlToBuf(), badge(), bindAutoQueue(), bindGraphDetail() (+82 more)

### Community 6 - "Workshop operating contract"
Cohesion: 0.12
Nodes (16): Access, Add existing, Autopilot, Create new, Design / QA, Filter, Graphs, Locks (+8 more)

### Community 7 - "Path"
Cohesion: 0.16
Nodes (16): agent_home_dir(), agent_identity_ready(), agent_prompt(), agent_user_name(), agent_wrapper_path(), expand(), orch_prompt(), orch_spec_rels() (+8 more)

### Community 8 - "Agent isolation (corp#41)"
Cohesion: 0.29
Nodes (7): Agent isolation (corp#41), Model, Provisioning (root, once per VPS), Risk / staged rollout, Rollback, Smoke check, Two modes in `bin/corp`

### Community 9 - "2026-08-15"
Cohesion: 0.25
Nodes (7): 2026-08-15, corp#1 — Graphify active projects (VPS session), Decisions, Later, Open questions, Outcome, Request

### Community 10 - "2026-08-16"
Cohesion: 0.03
Nodes (57): 2026-08-16, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions, Decisions (+49 more)

### Community 11 - "2026-08-17"
Cohesion: 0.09
Nodes (22): 2026-08-17, Broken / follow-up, Decisions, Decisions, Decisions, Decisions, Decisions, Links (+14 more)

### Community 16 - "Corporation operating contract"
Cohesion: 0.33
Nodes (6): Absolute Git preservation, Corporation operating contract, How to work, New projects, Session start, Source of truth

### Community 17 - "Server"
Cohesion: 0.33
Nodes (6): Agents, Layout, Server, Telegram, Who does what, Workshop

### Community 18 - "agent-isolation-smoke.sh"
Cohesion: 0.83
Nodes (3): bad(), pass(), agent-isolation-smoke.sh script

## Knowledge Gaps
- **133 isolated node(s):** `provision-agent-identity.sh script`, `titles`, `COLS`, `state`, `graphsCache` (+128 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api_project()` connect `app.py` to `corp`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **What connects `provision-agent-identity.sh script`, `titles`, `COLS` to the rest of the system?**
  _133 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `die` be split into smaller, more focused modules?**
  _Cohesion score 0.07964912280701754 - nodes in this community are weakly interconnected._
- **Should `corp` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `app.py` be split into smaller, more focused modules?**
  _Cohesion score 0.07140758154569497 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06428237494156147 - nodes in this community are weakly interconnected._
- **Should `Workshop operating contract` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._