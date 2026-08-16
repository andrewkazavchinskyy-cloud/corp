#!/usr/bin/env python3
import importlib.machinery
import importlib.util
import json
import multiprocessing
import os
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# Isolate workshop.json so this test never touches a real queue on the machine
# that runs it (the VPS runs this same repo as its live control plane).
os.environ.setdefault("CORP_WORKSHOP_JSON", str(Path(tempfile.gettempdir()) / f"corp-workshop-test-{os.getpid()}.json"))
_loader = importlib.machinery.SourceFileLoader("corpbin", str(ROOT / "bin" / "corp"))
corp = importlib.util.module_from_spec(importlib.util.spec_from_loader(_loader.name, _loader))
_loader.exec_module(corp)


def issue(labels, state="OPEN"):
    return {"state": state, "labels": [{"name": name} for name in labels], "updatedAt": "1"}


def _mp_worker(worker_id: int, iters: int) -> None:
    """Child process body for the corp#39 concurrency regression below."""

    def bump(data: dict) -> None:
        data["test_counter"] = int(data.get("test_counter") or 0) + 1

    for _ in range(iters):
        corp.update_workshop(bump)
    corp.set_queue_status("o/r", worker_id, "done", expect="waiting", touched_by=worker_id)


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
    drafts = [{"project": "corp", "title": "expand board"}]
    assert corp.next_move(cards, drafts, "corp") is None
    empty_ready = [c for c in cards if c["column"] != "ready"]
    assert corp.next_move(empty_ready, drafts, "corp") == {"kind": "drafts", "count": 1, "project": "corp"}
    assert corp.next_move(empty_ready, [], "clarity")["kind"] == "orch"
    backlog_only = [{"project": "corp", "repo": "o/corp", "number": 9, "column": "backlog", "title": "next", "blocked": False}]
    assert corp.next_move(backlog_only, [], "corp")["issue"] == "o/corp#9"
    blocked = [{"project": "corp", "repo": "o/corp", "number": 8, "column": "backlog", "blocked": True}]
    assert corp.next_move(blocked, [], "corp")["kind"] == "orch"
    tmp = Path("/tmp/corp-setup-token-test")
    tmp.write_text("abc123\n")
    assert corp.setup_token_ok("abc123", tmp)
    assert not corp.setup_token_ok("nope", tmp)
    assert not corp.setup_token_ok("", tmp)
    tmp.unlink()
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
- `run_issue()` --calls--> `pulse_loop()`  [INFERRED]
### Community 0 - "main"
Cohesion: 0.12
Nodes (33): active_projects(), board_payload() (+31 more)
"""
    parsed = corp.parse_graph_report(sample)
    assert parsed["nodes"] == 290 and parsed["edges"] == 819 and parsed["communities"] == 16
    assert parsed["hubs"][:2] == ["main", "run"]
    assert parsed["gods"][0] == {"name": "call()", "edges": 18}
    assert parsed["groups"][0]["name"] == "main" and parsed["groups"][0]["size"] == 33
    assert parsed["groups"][0]["nodes"] == ["active_projects()", "board_payload()"]
    assert parsed["bridges"][0]["a"] == "run_issue()" and parsed["bridges"][0]["b"] == "pulse_loop()"

    # Regression corp#38: launch_agent/wait_tmux must surface the agent's
    # real exit code instead of tee's (always 0), and two consecutive runs
    # must land in distinct, unambiguously tied log files.
    if corp.have("tmux"):
        project = f"test-regress-{corp.secrets.token_hex(4)}"
        ok_id = corp.new_run_id()
        code = corp.launch_agent("claude", ["bash", "-c", "exit 0"], Path("/tmp"), project, run_id=ok_id)
        assert code == 0, f"expected exit 0, got {code}"
        fail_id = corp.new_run_id()
        code = corp.launch_agent("claude", ["bash", "-c", "exit 17"], Path("/tmp"), project, run_id=fail_id)
        assert code == 17, f"expected exit 17, got {code}"
        assert ok_id != fail_id
        assert corp.run_log_path(ok_id) != corp.run_log_path(fail_id)
        assert corp.run_log_path(ok_id).is_file() and corp.run_log_path(fail_id).is_file()

    # Regression corp#38: a queue row left `running` by a process that died
    # mid-run must be reconciled deterministically (never left stuck, never
    # silently replayed as success) once its tmux session is confirmed gone.
    # A row whose project still has a live watcher — in-process or a live
    # tmux session — is left untouched and never auto-relaunched.
    data = corp.default_workshop()
    data["queue"] = [
        {"repo": "o/r", "issue": 1, "project": "corp-test-orphan-missing", "status": "running"},
        {"repo": "o/r", "issue": 2, "project": "corp-test-orphan-missing", "status": "waiting"},
    ]
    corp.save_workshop(data)
    changed = corp.reconcile_running(active_projects=set())
    assert [c["issue"] for c in changed] == [1]
    rows = {i["issue"]: i for i in corp.load_workshop()["queue"]}
    assert rows[1]["status"] == "interrupted" and "finished" in rows[1]
    assert rows[2]["status"] == "waiting"

    data["queue"] = [{"repo": "o/r", "issue": 3, "project": "corp-test-orphan-watched", "status": "running"}]
    corp.save_workshop(data)
    assert corp.reconcile_running(active_projects={"corp-test-orphan-watched"}) == []
    assert corp.load_workshop()["queue"][0]["status"] == "running"

    # Regression corp#39: workshop.json is written by the CLI, the web
    # workshop, Telegram, and the orchestrator, each in its own process.
    # update_workshop()/set_queue_status() must serialize real concurrent
    # OS processes (not just threads in one process) so nobody's update is
    # lost and the file is never left half-written.
    workers, iters = 6, 40
    seed = corp.default_workshop()
    seed["test_counter"] = 0
    seed["queue"] = [
        {"repo": "o/r", "issue": w, "project": f"mp-{w}", "status": "waiting"} for w in range(workers)
    ]
    corp.save_workshop(seed)
    ctx = multiprocessing.get_context("fork")
    procs = [ctx.Process(target=_mp_worker, args=(w, iters)) for w in range(workers)]
    for p in procs:
        p.start()
    for p in procs:
        p.join(30)
        assert p.exitcode == 0, f"worker {p.pid} exited {p.exitcode}"
    final = corp.load_workshop()
    assert final["test_counter"] == workers * iters, final["test_counter"]
    rows = {r["issue"]: r for r in final["queue"]}
    for w in range(workers):
        assert rows[w]["status"] == "done" and rows[w]["touched_by"] == w, rows[w]
    assert corp.WORKSHOP_JSON.stat().st_mode & 0o777 == 0o600

    # Regression corp#39: a corrupt workshop.json must fail loudly and must
    # never be silently replaced by defaults, from either the plain reader
    # or the locked update path.
    corp.WORKSHOP_JSON.write_text("{not valid json")
    try:
        corp.load_workshop()
        raise AssertionError("load_workshop should reject corrupt JSON")
    except corp.CorpError:
        pass
    assert corp.WORKSHOP_JSON.read_text() == "{not valid json"
    try:
        corp.update_workshop(lambda data: None)
        raise AssertionError("update_workshop should reject corrupt JSON")
    except corp.CorpError:
        pass
    assert corp.WORKSHOP_JSON.read_text() == "{not valid json"

    print("ok")


if __name__ == "__main__":
    main()
