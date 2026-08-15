#!/usr/bin/env python3
import importlib.machinery
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
_loader = importlib.machinery.SourceFileLoader("corpbin", str(ROOT / "bin" / "corp"))
corp = importlib.util.module_from_spec(importlib.util.spec_from_loader(_loader.name, _loader))
_loader.exec_module(corp)


def issue(labels, state="OPEN"):
    return {"state": state, "labels": [{"name": name} for name in labels], "updatedAt": "1"}


def main() -> None:
    repo, number = corp.parse_issue_ref("andrewkazavchinskyy-cloud/clarity#20")
    assert repo == "andrewkazavchinskyy-cloud/clarity" and number == 20
    assert corp.column_of(issue([])) == "backlog"
    assert corp.column_of(issue(["ready"])) == "ready"
    assert corp.column_of(issue(["ready", "queued"])) == "ready"
    assert corp.column_of(issue(["in-progress", "self"])) == "in-progress"
    assert corp.column_of(issue(["ready"], "CLOSED")) == "done"
    assert corp.runner_of(issue(["self"])) == "self"
    assert corp.runner_of(issue(["via:claude"])) == "claude"
    reg = {"labels": {"ready": "ready"}}
    assert corp.is_free_ready(issue(["ready"]), reg)
    assert not corp.is_free_ready(issue(["ready", "queued"]), reg)
    assert not corp.is_free_ready(issue(["ready", "self"]), reg)
    reg2 = {
        "org": "andrewkazavchinskyy-cloud",
        "projects": [
            {"name": "corp", "repo": "andrewkazavchinskyy-cloud/corp", "workshop": True, "status": "active"},
            {"name": "LifeBalance", "repo": "andrewkazavchinskyy-cloud/LifeBalance", "status": "active"},
        ],
    }
    assert [p["name"] for p in corp.pinned_projects(reg2)] == ["corp"]
    assert corp._parse_models("sonnet\nopus\n--help") == ["sonnet", "opus"]
    grok = (
        "You are logged in with grok.com.\n"
        "Default model: grok-4.6\n"
        "Available models:\n"
        "  * grok-4.6 (default)\n"
        "  - grok-4.5\n"
    )
    assert corp._parse_models(grok) == ["grok-4.6", "grok-4.5"]
    help_models = corp._parse_models("Provide an alias (e.g. 'fable', 'opus', or 'sonnet')")
    assert help_models == ["fable", "opus", "sonnet"]
    junk = "--model <model>\nnon-interactive output\n  mcp-server      Start Codex\n"
    assert corp._parse_models(junk) == []
    assert corp._parse_models("choices: 'stream-json' or 'sonnet'") == ["sonnet"]
    assert corp._parse_efforts("Effort (low, medium, high, xhigh, max)") == ["low", "medium", "high", "xhigh", "max"]
    assert corp._parse_efforts("max-turns and prompt-cache") == []
    assert corp.default_slot()["kind"] == "claude"
    blob = json.dumps({
        "models": [
            {"slug": "gpt-5.6-sol", "visibility": "list", "supported_reasoning_levels": [{"effort": "low"}, {"effort": "high"}], "additional_speed_tiers": ["fast"]},
            {"slug": "gpt-daybreak-blue-latest", "visibility": "list"},
            {"slug": "codex-auto-review", "visibility": "hide"},
        ]
    })
    models, efforts, fast = corp._models_from_json(blob)
    assert models == ["gpt-5.6-sol", "gpt-daybreak-blue-latest"]
    assert efforts == ["low", "high"] and fast
    cards = [
        {"project": "corp", "number": 1, "state": "OPEN", "column": "in-progress", "runner": "self"},
        {"project": "corp", "number": 2, "state": "OPEN", "column": "ready", "runner": ""},
        {"project": "clarity", "number": 3, "state": "OPEN", "column": "in-progress", "runner": "claude"},
    ]
    assert corp.write_block_reason(cards, "corp", 2) == "corp is claimed as self"
    assert corp.write_block_reason(cards, "corp", 1) == ""
    assert corp.write_block_reason(cards, "clarity", 9).startswith("VPS")
    assert corp.write_block_reason(cards, "missing") == ""
    kept = corp.merge_catalog_row({"models": ["grok-4.6"], "installed": True}, {"kind": "grok", "installed": True, "models": []})
    assert kept["models"] == ["grok-4.6"] and kept["stale"]
    fresh = corp.merge_catalog_row({}, {"kind": "grok", "installed": True, "models": []})
    assert fresh["models"] == []
    claude = corp.agent_argv("claude", "p", Path("/tmp"), readonly=True)
    assert "--dangerously-skip-permissions" not in claude and "--allowedTools" in claude
    codex = corp.agent_argv("codex", "p", Path("/tmp"), readonly=True)
    assert "read-only" in codex and "--dangerously-bypass-approvals-and-sandbox" not in codex
    try:
        corp.agent_argv("grok", "p", Path("/tmp"), readonly=True)
        raise AssertionError("grok readonly should die")
    except corp.CorpError:
        pass
    assert corp.pulse_label("claude", "") == "auto · claude"
    assert corp.pulse_label("claude", "sonnet") == "sonnet"
    assert corp.parse_json_array('noise [{"title":"x"}] tail') == [{"title": "x"}]
    lines = corp.orch_open_lines(
        [
            {"project": "clarity", "number": 20, "state": "OPEN", "column": "ready", "title": "SHIP-4"},
            {"project": "clarity", "number": 1, "state": "CLOSED", "column": "done", "title": "old"},
            {"project": "corp", "number": 2, "state": "OPEN", "column": "ready", "title": "other"},
        ],
        "clarity",
    )
    assert "#20 [ready] SHIP-4" in lines and "old" not in lines and "other" not in lines
    prompt = corp.orch_prompt(Path("/tmp/clarity"), Path("/tmp/orch.json"), ["docs/SPEC.md"], lines, "clarity")
    assert "docs/SPEC.md" in prompt and "#20" in prompt and "do not duplicate" in prompt.lower()
    assert "vs_prd" in prompt and "vs_open" in prompt
    assert "workshop/static" not in prompt
    built_body = corp.draft_issue_body({
        "title": "t",
        "body": "сделать x",
        "why": "дырка в спеке",
        "vs_prd": "SHIP-4 экран",
        "vs_open": "не дубль #20",
    })
    assert "сделать x" in built_body and "Зачем" in built_body
    assert "SHIP-4" in built_body and "не дубль #20" in built_body
    corp_prompt = corp.orch_prompt(Path("/tmp/corp"), Path("/tmp/orch.json"), ["docs/WORKSHOP.md"], "(none)", "corp")
    assert "workshop/static" in corp_prompt and "preview.html" in corp_prompt
    built = corp.agent_prompt("andrewkazavchinskyy-cloud/corp", 27, "t", "u", ROOT, "corp")
    assert "workshop/static" in built
    sample = """# Graph Report
- 290 nodes · 819 edges · 16 communities
- Built from commit: `c09220e2`
## Community Hubs (Navigation)
- main
- run
## God Nodes
1. `call()` - 18 edges
2. `refresh()` - 15 edges
### Community 0 - "main"
Cohesion: 0.12
Nodes (33): active_projects()
"""
    parsed = corp.parse_graph_report(sample)
    assert parsed["nodes"] == 290 and parsed["edges"] == 819 and parsed["communities"] == 16
    assert parsed["hubs"][:2] == ["main", "run"]
    assert parsed["gods"][0] == {"name": "call()", "edges": 18}
    assert parsed["groups"][0]["name"] == "main" and parsed["groups"][0]["size"] == 33
    print("ok")


if __name__ == "__main__":
    main()
