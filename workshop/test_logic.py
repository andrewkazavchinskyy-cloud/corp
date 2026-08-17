#!/usr/bin/env python3
import importlib.machinery
import importlib.util
import json
import os
import sqlite3
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
_loader = importlib.machinery.SourceFileLoader("corpbin", str(ROOT / "bin" / "corp"))
corp = importlib.util.module_from_spec(importlib.util.spec_from_loader(_loader.name, _loader))
_loader.exec_module(corp)
_auth_loader = importlib.machinery.SourceFileLoader("auth_policy", str(ROOT / "workshop" / "auth_policy.py"))
auth = importlib.util.module_from_spec(importlib.util.spec_from_loader(_auth_loader.name, _auth_loader))
_auth_loader.exec_module(auth)


def issue(labels, state="OPEN"):
    return {"state": state, "labels": [{"name": name} for name in labels], "updatedAt": "1"}


def main() -> None:
    repo, number = corp.parse_issue_ref("andrewkazavchinskyy-cloud/clarity#20")
    assert repo == "andrewkazavchinskyy-cloud/clarity" and number == 20
    assert corp.column_of(issue([])) == "backlog"
    assert corp.column_of(issue(["ready"])) == "ready"
    assert corp.column_of(issue(["ready", "queued"])) == "ready"
    assert corp.column_of(issue(["in-progress", "self"])) == "in-progress"
    assert corp.column_of(issue(["qa"])) == "backlog"
    assert corp.column_of(issue(["in-qa"])) == "qa"
    assert corp.column_of(issue(["in-qa", "in-progress", "via:claude"])) == "qa"
    assert corp.column_of(issue(["ready", "qa"])) == "ready"
    assert corp.column_of(issue(["ready", "qa-fail"])) == "ready"
    assert corp.column_of(issue(["ready"], "CLOSED")) == "done"
    assert corp.slot_for_issue("corp", issue(["design"]))[0] == "design"
    assert corp.slot_for_issue("corp", issue(["in-qa", "design"]))[0] == "qa"
    assert corp.slot_for_issue("corp", issue(["design", "qa-fail"]))[0] == "design"
    assert corp.runner_of(issue(["self"])) == "self"
    assert corp.runner_of(issue(["via:claude"])) == "claude"
    reg = {"labels": {"ready": "ready"}}
    assert corp.is_free_ready(issue(["ready"]), reg)
    assert not corp.is_free_ready(issue(["ready", "queued"]), reg)
    assert not corp.is_free_ready(issue(["ready", "self"]), reg)
    assert not corp.is_free_ready(issue(["ready", "in-qa"]), reg)
    assert not corp.is_free_ready(issue(["in-qa"]), reg)
    assert corp.is_free_ready(issue(["ready", "qa-fail"]), reg)
    assert corp.is_free_ready(issue(["ready", "in-qa", "qa-fail"]), reg)
    after_abort = set(["in-qa", "in-progress", "via:claude"])
    remove, add = corp.release_labels(after_abort)
    leftover = (after_abort - set(remove)) | set(add)
    assert "in-qa" in leftover and "ready" not in leftover
    assert not corp.is_free_ready(issue(list(leftover)), reg)
    crashed = set(["in-progress", "via:claude"])
    remove, add = corp.release_labels(crashed)
    ready_again = (crashed - set(remove)) | set(add)
    assert "ready" in ready_again and corp.is_free_ready(issue(list(ready_again)), reg)
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
    qa_cards = [{"project": "corp", "number": 4, "state": "OPEN", "column": "qa", "runner": "queued"}]
    assert corp.write_block_reason(qa_cards, "corp", 9).startswith("VPS")
    qa_idle = [{"project": "corp", "number": 4, "state": "OPEN", "column": "qa", "runner": ""}]
    assert corp.write_block_reason(qa_idle, "corp", 9) == "corp is in QA"
    assert corp.write_block_reason(qa_idle, "corp", 4) == ""
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
    created = tmp.stat().st_mtime
    assert corp.setup_token_ok("abc123", tmp)
    assert not corp.setup_token_ok("nope", tmp)
    assert not corp.setup_token_ok("", tmp)
    assert corp.setup_token_ok("abc123", tmp, now=created + 60)
    assert not corp.setup_token_ok("abc123", tmp, now=created + corp.SETUP_TOKEN_TTL_SEC + 1)
    tmp.unlink()
    kept = corp.merge_catalog_row({"models": ["grok-4.6"], "installed": True}, {"kind": "grok", "installed": True, "models": []})
    assert kept["models"] == ["grok-4.6"] and kept["stale"]
    fresh = corp.merge_catalog_row({}, {"kind": "grok", "installed": True, "models": []})
    assert fresh["models"] == []
    grok_help = "Grok Build TUI\n\nUsage: agent [OPTIONS] [PROMPT] [COMMAND]\n"
    assert corp._cli_identity(grok_help, "grok 1.0.4 (d846eb93d9) [stable]", "/root/.grok/downloads/grok-linux-x86_64") == "grok"
    cursor_help = "Cursor Agent\n\nUsage: agent [options] [command]\nhttps://cursor.com\n"
    assert corp._cli_identity(cursor_help, "2026.1.0", "/usr/local/bin/agent") == "cursor"
    assert corp._cli_identity("", "", "/home/corp/.local/bin/agent") == ""
    assert corp._cursor_mismatch_note("grok") == "agent — это Grok, не Cursor Agent"
    dropped = corp.merge_catalog_row(
        {"kind": "cursor", "installed": True, "models": ["grok-4.6", "grok-4.5"], "identity": "grok"},
        {"kind": "cursor", "installed": False, "models": [], "identity": "grok", "note": "agent — это Grok, не Cursor Agent"},
    )
    assert dropped["installed"] is False and dropped["models"] == []
    no_stale_grok = corp.merge_catalog_row(
        {"kind": "cursor", "installed": True, "models": ["grok-4.6"]},
        {"kind": "cursor", "installed": True, "models": [], "identity": "cursor"},
    )
    assert no_stale_grok["models"] == []
    cursor_keep = corp.merge_catalog_row(
        {"kind": "cursor", "installed": True, "models": ["composer-2"], "identity": "cursor"},
        {"kind": "cursor", "installed": True, "models": [], "identity": "cursor"},
    )
    assert cursor_keep["models"] == ["composer-2"] and cursor_keep["stale"]
    wired = {"probed_at": "t", "kinds": {"cursor": {"kind": "cursor", "installed": True, "models": ["grok-4.6", "grok-4.5"]}}}
    fixed = corp.sanitize_catalog(wired, cursor_ok=False)
    assert fixed["kinds"]["cursor"]["installed"] is False and fixed["kinds"]["cursor"]["models"] == []
    assert "Grok" in fixed["kinds"]["cursor"]["note"]
    kept_real = corp.sanitize_catalog(wired, cursor_ok=True)
    assert kept_real["kinds"]["cursor"]["models"] == ["grok-4.6", "grok-4.5"]
    claude = corp.agent_argv("claude", "p", Path("/tmp"), readonly=True)
    assert "--dangerously-skip-permissions" not in claude and "--allowedTools" in claude
    codex = corp.agent_argv("codex", "p", Path("/tmp"), readonly=True)
    assert "read-only" in codex and "--dangerously-bypass-approvals-and-sandbox" not in codex
    try:
        corp.agent_argv("grok", "p", Path("/tmp"), readonly=True)
        raise AssertionError("grok readonly should die")
    except corp.CorpError:
        pass
    try:
        corp.agent_argv("cursor", "p", Path("/tmp"))
        raise AssertionError("cursor should die without Cursor Agent")
    except corp.CorpError as exc:
        assert "cursor" in str(exc).lower()
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
    ghost = {
        "status": "done",
        "attempts": 1,
        "started_at": 1,
        "labels": [],
    }
    claimed = {"state": "OPEN", "labels": [{"name": "in-progress"}, {"name": "via:claude"}]}
    open_free = {"state": "OPEN", "labels": [{"name": "ready"}]}
    assert corp.queue_decision(ghost, now=100, tmux_on=False, issue=open_free, max_attempts=2) == "fail"
    assert corp.queue_decision(ghost, now=100, tmux_on=False, issue=claimed, max_attempts=2) == "retry"
    qa_open = {"state": "OPEN", "labels": [{"name": "in-qa"}]}
    assert corp.queue_decision(ghost, now=100, tmux_on=False, issue=qa_open, max_attempts=2) == "retry"
    ghost["attempts"] = 2
    assert corp.queue_decision(ghost, now=100, tmux_on=False, issue=claimed, max_attempts=2) == "fail"
    running = {"status": "running", "attempts": 1, "started_at": 1}
    assert corp.queue_decision(running, now=10, tmux_on=False, issue=None, stale_sec=90) == "keep"
    assert corp.queue_decision(running, now=200, tmux_on=False, issue=None, stale_sec=90) == "retry"
    assert corp.queue_decision(running, now=200, tmux_on=True, issue=None) == "keep"
    closed = {"state": "CLOSED", "labels": []}
    assert corp.queue_decision(running, now=200, tmux_on=False, issue=closed) == "closed"
    waiting = {"status": "waiting", "attempts": 0, "started_at": 0}
    assert corp.queue_decision(waiting, now=200, tmux_on=False, issue=None) == "keep"
    fail_open = {"state": "OPEN", "labels": [{"name": "qa-fail"}, {"name": "ready"}]}
    ghost["attempts"] = 1
    assert corp.queue_decision(ghost, now=100, tmux_on=False, issue=fail_open, max_attempts=2) == "retry"
    assert corp.tg_parse_command("/status") == ("status", "")
    assert corp.tg_parse_command("/retry #41") == ("retry", "#41")
    assert corp.tg_parse_command("/retry@corpbot 41") == ("retry", "41")
    assert corp.tg_parse_command("очередь") == ("queue", "")
    assert corp.tg_parse_command("черновики") == ("drafts", "")
    assert corp.tg_parse_command("retry 41") == ("retry", "41")
    assert corp.tg_parse_command("непонятно") == ("", "")
    assert corp.tg_parse_command("Сейчас") == ("status", "")
    assert corp.tg_parse_command("Бежит") == ("running", "")
    assert corp.tg_parse_command("Агенты") == ("running", "")
    assert corp.tg_parse_command("Старт") == ("go", "")
    assert corp.tg_parse_command("Автоном ▶") == ("go", "")
    assert corp.tg_parse_command("/agents") == ("agents", "")
    keys = [btn["text"] for row in corp.tg_reply_keyboard() for btn in row]
    assert keys == ["Статус", "Очередь", "Агенты", "Сервер", "Доска", "Черновики", "Старт", "Пауза"]
    assert "Автоном ▶" not in keys
    assert corp.tg_menu_buttons() == []
    assert corp.tg_short_ref("andrewkazavchinskyy-cloud/corp", 56) == "corp#56"
    assert corp.tg_card("corp#56", "старт", "claude") == "corp#56 · старт · claude"
    assert "\n" not in corp.tg_card("corp#56", "упал", "Очередь+")
    assert "http" not in corp.tg_card("corp#56", "старт", "claude")
    status = corp.tg_status_text(queue_on=False, writer="тихо", server_ok=True, drafts=2)
    assert status == "Очередь: пауза\nПишет: тихо\nСервер: ок\nЧерновики: 2"
    queue_text = corp.tg_queue_text(
        [
            {"status": "running", "repo": "andrewkazavchinskyy-cloud/corp", "issue": 56, "title": "Telegram rewrite"},
            {"status": "waiting", "repo": "andrewkazavchinskyy-cloud/corp", "issue": 57, "title": "next one"},
            {"status": "waiting", "repo": "andrewkazavchinskyy-cloud/clarity", "issue": 2, "title": "x"},
            {"status": "waiting", "repo": "andrewkazavchinskyy-cloud/clarity", "issue": 3, "title": "y"},
            {"status": "waiting", "repo": "andrewkazavchinskyy-cloud/clarity", "issue": 4, "title": "hidden"},
            {"status": "done", "repo": "andrewkazavchinskyy-cloud/corp", "issue": 1, "title": "old history"},
            {"status": "failed", "repo": "andrewkazavchinskyy-cloud/corp", "issue": 9, "title": "boom"},
        ],
        paused=True,
    )
    assert queue_text.startswith("Очередь · пауза")
    assert "Бежит" in queue_text and "corp#56" in queue_text
    assert "Дальше" in queue_text
    assert "corp#57" in queue_text and "clarity#2" in queue_text and "clarity#3" in queue_text
    assert "clarity#4" not in queue_text
    assert "old history" not in queue_text
    assert "Упали: 1" in queue_text
    assert corp.tg_agents_text([{"name": "corp", "kind": "tmux", "issue": "#56"}, {"name": "clarity", "kind": "orch"}]) == (
        "Агенты\ncorp · tmux · #56\nclarity · orch"
    )
    assert corp.tg_agents_text([]) == "Агенты\nтихо"
    server = corp.tg_server_text(load=0.21, disk_free_gb=42.2, workshop_up=True, queue_on=False)
    assert server == "нагрузка 0.21\nдиск 42 ГБ\nworkshop: ок\nочередь: пауза"
    board_cards = [
        {"column": "backlog", "repo": "o/corp", "number": 1, "title": "a", "labels": ["P2"]},
        {"column": "ready", "repo": "o/corp", "number": 2, "title": "b", "labels": [{"name": "P0"}]},
        {"column": "in-progress", "repo": "o/clarity", "number": 3, "title": "c", "labels": []},
        {"column": "qa", "repo": "o/corp", "number": 4, "title": "d", "labels": ["P0"]},
        {"column": "done", "repo": "o/corp", "number": 5, "title": "e", "labels": ["P0"], "state": "CLOSED"},
        {"column": "ready", "repo": "o/corp", "number": 6, "title": "wall of text " * 20, "labels": []},
    ]
    board = corp.tg_board_text(board_cards)
    assert board.startswith("Бэклог 1 · Готово 2 · Ход 1 · QA 1 · Закрыто 1")
    assert "P0" in board and "corp#2" in board and "corp#4" in board
    assert "corp#5" not in board and "wall of text" not in board
    assert board.count("\n") <= 7
    drafts_text = corp.tg_drafts_text(
        [{"id": "d1", "project": "corp", "title": "First"}, {"id": "d2", "project": "clarity", "title": "Second"}]
    )
    assert drafts_text == "Черновики: 2\ncorp · First"
    assert corp.tg_draft_buttons([{"id": "d1"}, {"id": "d2"}]) == [
        [{"text": "Approve", "callback_data": "a:d1"}, {"text": "Skip", "callback_data": "s:d1"}]
    ]
    assert corp.tg_pulse_text("o/corp", 56, 15, "same", "same") is None
    assert corp.tg_pulse_text("o/corp", 56, 15, "new", "") is None
    assert corp.tg_pulse_text("o/corp", 56, 45, "new", "old") == "corp#56 · 45 мин · пишет"
    ev = corp.tg_event_buttons("start", url="https://github.com/o/corp/issues/56", ref="o/corp#56")
    assert [btn["text"] for btn in ev[0]] == ["Открыть", "Пауза"]
    fail_btns = corp.tg_event_buttons("fail", url="https://example", ref="o/corp#56")
    assert [btn["text"] for btn in fail_btns[0]] == ["Открыть", "Очередь+"]
    corp.tg_reset_dedup()
    assert corp.tg_should_send("start:corp#56", now=100)
    assert not corp.tg_should_send("start:corp#56", now=110)
    assert corp.tg_should_send("start:corp#56", now=200)
    assert corp.tg_ru_count(1, "черновик", "черновика", "черновиков") == "1 черновик"
    assert corp.tg_ru_count(3, "черновик", "черновика", "черновиков") == "3 черновика"
    assert corp.tg_ru_count(5, "черновик", "черновика", "черновиков") == "5 черновиков"
    repo, number = corp.tg_parse_issue_arg("#41")
    assert number == 41 and repo.endswith("/corp")
    repo = "andrewkazavchinskyy-cloud/corp"
    assert corp.issue_eligibility(reg2, repo, 1, issue([], "CLOSED"), cards=[]) == f"{repo}#1 закрыта"
    assert "blocked" in corp.issue_eligibility(reg2, repo, 1, issue(["blocked"]), cards=[])
    assert "self" in corp.issue_eligibility(reg2, repo, 1, issue(["self"]), cards=[])
    assert "self" in corp.issue_eligibility(reg2, repo, 2, issue(["ready"]), cards=cards)
    free = [{"project": "corp", "number": 9, "state": "OPEN", "column": "ready", "runner": ""}]
    assert corp.issue_eligibility(reg2, repo, 9, issue(["ready"]), cards=free) == ""
    assert "QA" in corp.issue_eligibility(reg2, repo, 1, issue(["in-qa"]), cards=[])
    assert "QA" in corp.issue_eligibility(reg2, repo, 1, issue(["ready", "in-qa"]), cards=[])
    assert corp.issue_eligibility(reg2, repo, 1, issue(["in-qa"]), cards=[], allow_in_qa=True) == ""
    assert corp.close_action(issue(["ready"])) == "send-to-qa"
    assert corp.close_action(issue(["in-qa"])) == "close"
    assert corp.close_action(issue(["ready"]), force=True) == "close"
    assert corp.close_action(issue(["in-qa"]), fail=True) == "reject"
    assert corp.close_action(issue(["ready"]), fail=True) == "not-qa"
    assert corp.can_promote_to_qa(0, issue(["ready"]))
    assert not corp.can_promote_to_qa(1, issue(["ready"]))
    assert not corp.can_promote_to_qa(0, issue(["ready"], "CLOSED"))
    assert corp.parse_exit_code("noise\nandrewkazavchinskyy-cloud/corp#59 EXIT:9\n") == 9
    assert corp.parse_exit_code("corp#1 EXIT:0\ncorp#1 EXIT:3\n", "corp#1") == 3
    assert corp.parse_exit_code("no code here") is None
    assert corp.read_tmux_exit("", "") == 1
    assert corp.read_tmux_exit("", "pane EXIT:4") == 4
    script = corp.tmux_agent_script(Path("/tmp/dest"), "false 2>&1", "corp#59")
    assert "set -o pipefail" in script and "EXIT:$?" in script
    class _Gone:
        returncode = 1
    old_run = corp.run
    old_log = corp.RUN_LOG
    tmp = Path(tempfile.mkdtemp(prefix="corp-tmux-")) / "run.log"
    tmp.write_text("andrewkazavchinskyy-cloud/corp#59 EXIT:9\n")
    try:
        corp.RUN_LOG = tmp
        corp.run = lambda *a, **k: _Gone()
        assert corp.wait_tmux("corp", "andrewkazavchinskyy-cloud/corp#59") == 9
        tmp.write_text("killed, no exit line\n")
        assert corp.wait_tmux("corp") == 1
    finally:
        corp.run = old_run
        corp.RUN_LOG = old_log
    added = []
    old_get = corp.get_issue
    old_add = corp.add_labels
    old_remove = corp.remove_labels
    old_inv = corp.invalidate_board
    old_notify = corp.notify_safe
    try:
        corp.get_issue = lambda repo, number: issue(["ready"])
        corp.add_labels = lambda *a, **k: added.append(("add", a, k))
        corp.remove_labels = lambda *a, **k: added.append(("rm", a, k))
        corp.invalidate_board = lambda: None
        corp.notify_safe = lambda *a, **k: None
        busy = [{"project": "corp", "number": 4, "state": "OPEN", "column": "qa", "runner": ""}]
        try:
            corp.send_to_qa(reg2, repo, 9, enqueue=False, cards=busy)
            raise AssertionError("second in-qa should die")
        except corp.CorpError as exc:
            assert "QA" in str(exc)
        sent = corp.send_to_qa(
            reg2,
            repo,
            9,
            enqueue=False,
            cards=[{"project": "corp", "number": 9, "state": "OPEN", "column": "ready", "runner": ""}],
        )
        assert sent["queued"] is False and sent["column"] == "qa"
        assert any(row[0] == "add" and "in-qa" in row[1][2] for row in added)
        old_pin = corp.pin_write_block
        corp.pin_write_block = lambda *a, **k: ""
        try:
            routed = corp.close_issue(reg2, repo, 9)
            assert routed.get("column") == "qa" and not routed.get("closed")
        finally:
            corp.pin_write_block = old_pin
    finally:
        corp.get_issue = old_get
        corp.add_labels = old_add
        corp.remove_labels = old_remove
        corp.invalidate_board = old_inv
        corp.notify_safe = old_notify
    class _Proc:
        def __init__(self, code, err="", out="[]"):
            self.returncode = code
            self.stderr = err
            self.stdout = out
    old_run = corp.run
    try:
        corp.run = lambda *a, **k: _Proc(1, "HTTP 401: Bad credentials")
        raised = False
        try:
            corp.issues_for("o/r")
        except corp.CorpError:
            raised = True
        assert raised
        corp.run = lambda *a, **k: _Proc(1, "Issues are disabled for this repo")
        assert corp.issues_for("o/r") == []
        corp.run = lambda *a, **k: _Proc(0, out="[]")
        assert corp.issues_for("o/r") == []
        assert corp.github_transient("HTTP 503: No server is currently available")
        assert not corp.github_transient("HTTP 401: Bad credentials")
        sleeps = []
        old_sleep = corp.time.sleep
        corp.time.sleep = lambda s: sleeps.append(s)
        n = {"i": 0}
        def flaky(*a, **k):
            n["i"] += 1
            if n["i"] < 3:
                return _Proc(1, "HTTP 503: No server is currently available")
            return _Proc(0, out='[{"number":1,"title":"x","url":"","labels":[],"updatedAt":"","state":"OPEN"}]')
        corp.run = flaky
        assert corp.issues_for("o/r")[0]["number"] == 1
        assert sleeps
        def gql_down(*a, **k):
            cmd = a[0]
            if len(cmd) > 1 and cmd[1] == "issue":
                return _Proc(1, "HTTP 503: No server is currently available")
            return _Proc(0, out='[{"number":2,"title":"y","html_url":"u","labels":[{"name":"ready"}],"updated_at":"t","state":"open","closed_at":null}]')
        corp.run = gql_down
        rest = corp.issues_for("o/r")
        assert rest[0]["number"] == 2 and rest[0]["state"] == "OPEN"
        corp.time.sleep = old_sleep
    finally:
        corp.run = old_run
    old_token = os.environ.get("TELEGRAM_BOT_TOKEN")
    old_agent_user = os.environ.get("CORP_AGENT_USER")
    old_agent_home = os.environ.get("CORP_AGENT_HOME")
    old_agent_wrap = os.environ.get("CORP_AGENT_WRAPPER")
    os.environ["TELEGRAM_BOT_TOKEN"] = "secret-token"
    os.environ.pop("CORP_AGENT_USER", None)
    try:
        wrapped = corp.wrap_isolated(["claude", "-p", "x"], Path("/tmp"))
        assert wrapped[0] == "env"
        assert not any("TELEGRAM_BOT_TOKEN" in part for part in wrapped)
        assert any(part.startswith("PATH=") for part in wrapped)
        assert "true" not in wrapped
        argv = corp.isolation_wrapper_argv()
        assert argv[:3] == ["sudo", "-n", "-u"]
        assert argv[-1] == "--probe"
        assert "true" not in argv
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            wrapper = root / "corp-agent-exec"
            wrapper.write_text("#!/bin/sh\n")
            wrapper.chmod(0o755)
            home = root / "agent-home"
            claude = home / ".local" / "bin" / "claude"
            claude.parent.mkdir(parents=True)
            claude.write_text("#!/bin/sh\n")
            claude.chmod(0o755)
            user_home = root / "corp-home"
            ws = user_home / "projects"
            cfg = user_home / ".config" / "corp"
            cfg.mkdir(parents=True)
            ws.mkdir()
            os.chmod(user_home, 0o751)
            os.chmod(user_home / ".config", 0o700)
            os.chmod(cfg, 0o700)
            os.chmod(ws, 0o750)
            (cfg / "env").write_text("X=1\n")
            os.chmod(cfg / "env", 0o600)
            os.environ["CORP_AGENT_WRAPPER"] = str(wrapper)
            os.environ["CORP_AGENT_HOME"] = str(home)
            seen = []

            def fake_run(cmd):
                seen.append(cmd)
                assert cmd[-1] == "--probe"
                assert "true" not in cmd
                return _Proc(0)

            report = corp.probe_isolation(run_cmd=fake_run, dest_workspace=ws, config=cfg)
            assert report["mode"] == "ready-to-arm"
            assert report["ready_to_arm"] and not report["isolated"] and not report["armed"]
            assert report["wrapper_ok"] and report["workspace_ok"] and report["secrets_denied"]
            assert report["clis"]["claude"]
            assert "CORP_AGENT_USER unset" in report["blockers"]
            assert "CLIs not installed under that UID" not in report["blockers"]
            assert seen and seen[0][-1] == "--probe"
            doctor = corp.doctor_payload(isolation=report)
            assert doctor["isolation"]["mode"] == "ready-to-arm"
            assert not any(row["name"] == "agent identity isolated" and row["ok"] for row in doctor["checks"])
            os.chmod(ws, 0o775)
            claude.unlink()
            dirty = corp.probe_isolation(run_cmd=fake_run, dest_workspace=ws, config=cfg)
            assert dirty["mode"] == "transitional"
            assert not dirty["ready_to_arm"]
            assert "workspace is world-readable" in dirty["blockers"]
            assert "CLIs not installed under that UID" in dirty["blockers"]
            dest = ws / "corp"
            dest.mkdir()
            os.environ["CORP_AGENT_USER"] = "corp-agent"
            isolated = corp.wrap_isolated(["claude", "-p", "x"], dest)
            assert isolated[:4] == ["sudo", "-n", "-u", "corp-agent"]
            assert isolated[4] == str(wrapper)
            assert isolated[5] == str(dest.resolve())
            assert isolated[6] == str(claude)
            assert isolated[7:] == ["-p", "x"]
            assert "true" not in isolated
            os.environ.pop("CORP_AGENT_USER", None)
            os.environ["CORP_AGENT_WRAPPER"] = str(root / "missing-wrapper")
            os.environ["CORP_AGENT_USER"] = "corp-agent"
            fallback = corp.wrap_isolated(["claude", "-p", "x"], dest)
            assert fallback[0] == "env"
            os.environ.pop("CORP_AGENT_USER", None)
    finally:
        if old_token is None:
            os.environ.pop("TELEGRAM_BOT_TOKEN", None)
        else:
            os.environ["TELEGRAM_BOT_TOKEN"] = old_token
        if old_agent_user is None:
            os.environ.pop("CORP_AGENT_USER", None)
        else:
            os.environ["CORP_AGENT_USER"] = old_agent_user
        if old_agent_home is None:
            os.environ.pop("CORP_AGENT_HOME", None)
        else:
            os.environ["CORP_AGENT_HOME"] = old_agent_home
        if old_agent_wrap is None:
            os.environ.pop("CORP_AGENT_WRAPPER", None)
        else:
            os.environ["CORP_AGENT_WRAPPER"] = old_agent_wrap
    now = 1_000_000.0
    assert auth.session_valid(now - 10, now)
    assert not auth.session_valid(now - auth.SESSION_TTL_SEC - 1, now)
    assert auth.challenge_valid(now - 60, now)
    assert not auth.challenge_valid(now - auth.CHALLENGE_TTL_SEC - 1, now)
    assert auth.SETUP_TOKEN_TTL_SEC == corp.SETUP_TOKEN_TTL_SEC == 30 * 60
    assert auth.setup_token_valid(now - 60, now)
    assert not auth.setup_token_valid(now - auth.SETUP_TOKEN_TTL_SEC - 1, now)
    with tempfile.TemporaryDirectory() as raw:
        token_file = Path(raw) / "workshop-setup-token"
        token_file.write_text("secret\n")
        os.utime(token_file, (now - 60, now - 60))
        assert auth.setup_token_file_valid(token_file, now)
        os.utime(token_file, (now - auth.SETUP_TOKEN_TTL_SEC - 5, now - auth.SETUP_TOKEN_TTL_SEC - 5))
        assert not auth.setup_token_file_valid(token_file, now)
    index_html = (ROOT / "workshop" / "static" / "index.html").read_text()
    assert 'name="referrer"' in index_html and "no-referrer" in index_html
    assert "history.replaceState" in (ROOT / "workshop" / "static" / "app.js").read_text()
    app_src = (ROOT / "workshop" / "app.py").read_text()
    assert "Referrer-Policy" in app_src
    assert 'kind == "reg-recover"' in app_src and "revoke_sessions()" in app_src
    assert auth.trusted_scheme("http", "https", True) == "https"
    assert auth.trusted_scheme("http", "https", False) == "http"
    assert auth.origin_allowed("https://corp.example.ts.net", "corp.example.ts.net", "https")
    assert not auth.origin_allowed("https://corp.example.ts.net.evil.com", "corp.example.ts.net", "https")
    assert not auth.origin_allowed("https://evil.com", "corp.example.ts.net", "https")
    assert not auth.origin_allowed("https://corp.example.ts.net.evil.com", "corp.example.ts.net.evil.com", "http")
    assert auth.origin_allowed("http://127.0.0.1:8787", "127.0.0.1:8787", "http")
    assert auth.origin_allowed("http://localhost:8787", "127.0.0.1:8787", "http")
    assert not auth.origin_allowed("http://127.0.0.1:8787/extra", "127.0.0.1:8787", "http")
    assert auth.origin_allowed(
        "https://extra.example",
        "127.0.0.1:8787",
        "http",
        ["https://extra.example"],
    )
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    conn.executescript(
        """
        CREATE TABLE sessions (token TEXT PRIMARY KEY, created REAL);
        CREATE TABLE challenges (token TEXT PRIMARY KEY, kind TEXT, challenge BLOB, created REAL);
        """
    )
    conn.execute("INSERT INTO sessions(token, created) VALUES('old', ?)", (now - auth.SESSION_TTL_SEC - 5,))
    conn.execute("INSERT INTO sessions(token, created) VALUES('live', ?)", (now - 10,))
    conn.execute(
        "INSERT INTO challenges(token, kind, challenge, created) VALUES('fresh', 'auth', ?, ?)",
        (b"chal", now - 10),
    )
    conn.execute(
        "INSERT INTO challenges(token, kind, challenge, created) VALUES('stale', 'auth', ?, ?)",
        (b"old", now - auth.CHALLENGE_TTL_SEC - 5),
    )
    auth.prune_auth_tables(conn, now)
    tokens = {row["token"] for row in conn.execute("SELECT token FROM sessions")}
    assert tokens == {"live"}
    first = auth.take_challenge(conn, "fresh", ("auth",), now)
    assert first == (b"chal", "auth")
    assert auth.take_challenge(conn, "fresh", ("auth",), now) is None
    assert auth.take_challenge(conn, "stale", ("auth",), now) is None
    conn.execute("INSERT INTO sessions(token, created) VALUES('other', ?)", (now,))
    assert auth.delete_all_sessions(conn) >= 1
    assert conn.execute("SELECT COUNT(*) FROM sessions").fetchone()[0] == 0
    spec_text = (
        "## Goal\n"
        "- Ship the billing path for invoices\n"
        "- Keep the workshop phone dock\n"
    )
    spec_issues = [{"title": "Keep the workshop phone dock", "state": "OPEN", "column": "ready"}]
    gaps = corp.spec_gaps(spec_text, spec_issues)
    assert any("billing" in item.lower() for item in gaps)
    assert not any("phone dock" in item.lower() for item in gaps)
    fixture = Path(tempfile.mkdtemp(prefix="corp-research-"))
    (fixture / "docs").mkdir()
    (fixture / "docs" / "SPEC.md").write_text(spec_text)
    (fixture / ".git").mkdir()
    (fixture / ".git" / "HEAD").write_text("ref: refs/heads/main\n")
    research_reg = {
        "research_files": ["docs/SPEC.md", "docs/PRD.md"],
        "projects": [
            {
                "name": "demo",
                "repo": "o/demo",
                "workshop": True,
                "status": "active",
                "roots": [str(fixture)],
            }
        ],
    }
    report = corp.research_report(
        research_reg,
        issues=[
            {
                "title": "Keep the workshop phone dock",
                "project": "demo",
                "repo": "o/demo",
                "number": 2,
                "state": "OPEN",
                "column": "ready",
            }
        ],
    )
    assert report[0]["spec_present"] and not report[0]["prd_present"]
    assert report[0]["gap"] == "частично"
    assert any("billing" in item.lower() for item in report[0]["unshipped"])
    git_reg = {
        "projects": [
            {"name": "corp", "repo": "o/corp", "workshop": True, "status": "active"},
            {"name": "LifeBalance", "repo": "o/lb", "status": "active"},
        ]
    }
    merged = corp.merge_registry(
        git_reg,
        {
            "pins": {"LifeBalance": True},
            "projects": [{"name": "ghost", "repo": "o/ghost", "workshop": True, "status": "active"}],
        },
    )
    pinned_names = [p["name"] for p in corp.pinned_projects(merged)]
    assert pinned_names == ["corp", "LifeBalance", "ghost"]
    shadowed = corp.merge_registry(
        git_reg,
        {"projects": [{"name": "corp", "repo": "o/corp", "workshop": False, "status": "active"}]},
    )
    assert corp.is_pinned(corp.project_by_name(shadowed, "corp"))
    seed_dir = Path(tempfile.mkdtemp(prefix="corp-seed-"))
    written = corp.write_project_seed(seed_dir, "demo", workspace_path="/tmp/workspace")
    assert "docs/SPEC.md" in written and "AGENTS.md" in written
    agents_text = (seed_dir / "AGENTS.md").read_text()
    spec_stub = (seed_dir / "docs" / "SPEC.md").read_text()
    assert "gh repo clone andrewkazavchinskyy-cloud/corp" in agents_text
    assert "https://github.com/andrewkazavchinskyy-cloud/corp" in agents_text
    assert "/tmp/workspace" in agents_text
    assert "iCloud" in agents_text
    assert (seed_dir / "memory" / "sessions" / ".gitkeep").is_file()
    assert "hello world" not in spec_stub.lower()
    assert "First slice" in spec_stub
    live = corp.WORKSHOP_JSON
    before = live.read_text() if live.is_file() else None
    report = corp.run_autopilot_e2e()
    after = live.read_text() if live.is_file() else None
    assert before == after
    assert report["ok"] and report["queue_running"] is False
    assert report["drafts_after_approve"] == 0
    assert report["reap_events"] and report["reap_events"][0]["kind"] == "retry"
    assert report["queue_after_reap"][0]["status"] == "waiting"
    assert report["queue_after_rollback"] == []
    assert report["killed"] == ["corp"]
    assert ("andrewkazavchinskyy-cloud/corp", 0) in report["released"]
    assert "[redacted]" in corp.redact_secrets("Authorization: Bearer abcdefghijklmnop")
    assert "[redacted]" in corp.redact_secrets("token=ghp_abcdefghijklmnopqrstuvwxyz1234")
    assert "[redacted]" in corp.redact_secrets("123456789:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    assert corp.redact_secrets("hello") == "hello"
    assert "sk-" not in corp.redact_secrets("need_human token=sk-abcdefghijklmnopqrstuvwxyz1234567890")
    assert "[redacted]" in corp.tg_clip("Authorization: Bearer abcdefghijklmnop", 80)
    assert corp.pin_owns_repo("andrewkazavchinskyy-cloud/corp", reg2)
    assert not corp.pin_owns_repo("andrewkazavchinskyy-cloud/LifeBalance", reg2)
    db = Path(tempfile.mkdtemp(prefix="corp-db-")) / "workshop.db"
    db.write_text("")
    os.chmod(db, 0o644)
    assert not corp.workshop_db_mode_ok(db)
    os.chmod(db, 0o600)
    assert corp.workshop_db_mode_ok(db)
    corp._isolation_cache = None
    old_user = os.environ.get("CORP_AGENT_USER")
    os.environ.pop("CORP_AGENT_USER", None)
    try:
        iso = corp.isolation_status()
        assert iso["mode"] == "transitional" and iso["ok"] is False
    finally:
        if old_user is None:
            os.environ.pop("CORP_AGENT_USER", None)
        else:
            os.environ["CORP_AGENT_USER"] = old_user
        corp._isolation_cache = None
    old_gh = corp.gh_ready
    corp.gh_ready = lambda: False
    try:
        payload = corp.cycle_payload({"org": "andrewkazavchinskyy-cloud", "projects": []})
        assert payload["mode"] == "auth"
        assert payload["instruction"] == "run gh auth login"
        text = corp.render(payload)
        assert "run gh auth login" in text and "uvicorn should serve" in text
        names = [c["name"] for c in payload["doctor"]["checks"]]
        for need in (
            "workshop unit",
            "live /opt/corp clean",
            "live /opt/corp at origin/main",
            "auth_policy",
            "workshop.db 0600",
            "graphify",
            "tailscale serve",
            "tailscale funnel off",
            "cursor",
            "agent isolation",
        ):
            assert need in names
        assert payload["doctor"]["isolation"] in {"isolated", "transitional"}
    finally:
        corp.gh_ready = old_gh
    old_ok = corp.kind_cli_ok
    corp.kind_cli_ok = lambda kind: False
    try:
        assert next(c["ok"] for c in corp.doctor_payload()["checks"] if c["name"] == "cursor") is False
    finally:
        corp.kind_cli_ok = old_ok
    abort_tmp = Path(tempfile.mkdtemp(prefix="corp-abort-")) / "workshop.json"
    killed, released, notes = [], [], []
    with corp.workshop_json_override(abort_tmp):
        corp.save_workshop(corp.default_workshop())
        idle = corp.queue_abort(
            "andrewkazavchinskyy-cloud/clarity",
            99,
            kill=lambda name: killed.append(name),
            release=lambda repo, number: released.append((repo, number)),
            notify=lambda *a, **k: notes.append(a),
        )
        assert idle["aborted"] is False and killed == [] and released == [] and notes == []
        data = corp.load_workshop()
        data["queue"] = [
            {
                "repo": "andrewkazavchinskyy-cloud/corp",
                "issue": 1,
                "project": "corp",
                "status": "running",
                "last_error": "Authorization: Bearer supersecrettokenvalue",
            },
            {
                "repo": "andrewkazavchinskyy-cloud/corp",
                "issue": 2,
                "project": "corp",
                "status": "waiting",
                "last_error": "",
            },
        ]
        corp.save_workshop(data)
        loaded = corp.load_workshop()
        assert "supersecret" not in (loaded["queue"][0]["last_error"] or "")
        assert "[redacted]" in loaded["queue"][0]["last_error"]
        other = corp.queue_abort(
            "andrewkazavchinskyy-cloud/corp",
            2,
            kill=lambda name: killed.append(name),
            release=lambda repo, number: released.append((repo, number)),
            notify=lambda *a, **k: notes.append(a),
        )
        assert other["aborted"] is True and killed == []
        assert ("andrewkazavchinskyy-cloud/corp", 2) in released
        running = corp.queue_abort(
            "andrewkazavchinskyy-cloud/corp",
            1,
            kill=lambda name: killed.append(name),
            release=lambda repo, number: released.append((repo, number)),
            notify=lambda *a, **k: notes.append(a),
        )
        assert running["aborted"] is True and killed == ["corp"]
    print("ok")


if __name__ == "__main__":
    main()
