# Graph Report - corp  (2026-08-15)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 33 nodes · 99 edges · 5 communities
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `411ac320`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main
- bootstrap
- corp
- collect_issues
- project_dir

## God Nodes (most connected - your core abstractions)

## Surprising Connections (you probably didn't know these)
- `bootstrap()` --calls--> `die()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 0 → community 1_
- `cycle_payload()` --calls--> `die()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 0 → community 2_
- `main()` --calls--> `status()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 0 → community 4_
- `bootstrap()` --calls--> `active_projects()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 1 → community 2_
- `bootstrap()` --calls--> `project_dir()`  [EXTRACTED]
  bin/corp → bin/corp  _Bridges community 1 → community 4_

## Import Cycles
- None detected.

## Communities (5 total, 0 thin omitted)

### Community 0 - "main"
Cohesion: 0.40
Nodes (10): agent_argv(), die(), load_env(), load_registry(), main(), notify(), pick_agent(), render() (+2 more)

### Community 1 - "bootstrap"
Cohesion: 0.43
Nodes (7): bootstrap(), doctor(), gh_ready(), have(), pull_projects(), run(), CompletedProcess

### Community 2 - "corp"
Cohesion: 0.60
Nodes (5): active_projects(), cycle_payload(), project_by_name(), research_report(), split_ready()

### Community 3 - "collect_issues"
Cohesion: 0.50
Nodes (5): collect_issues(), issues_enabled(), issues_for(), label_names(), rank()

### Community 4 - "project_dir"
Cohesion: 0.70
Nodes (5): expand(), project_dir(), status(), workspace(), Path

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._