#!/usr/bin/env python3
import importlib.machinery
import importlib.util
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
    print("ok")


if __name__ == "__main__":
    main()
