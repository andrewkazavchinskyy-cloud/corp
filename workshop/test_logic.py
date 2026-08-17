#!/usr/bin/env python3
import importlib.machinery
import importlib.util
import inspect
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
_api_loader = importlib.machinery.SourceFileLoader("api_logic", str(ROOT / "workshop" / "api_logic.py"))
api_logic = importlib.util.module_from_spec(importlib.util.spec_from_loader(_api_loader.name, _api_loader))
_api_loader.exec_module(api_logic)


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
    assert corp.slot_for_issue("corp", issue(["qa"]))[0] == "build"
    assert corp.slot_for_issue("corp", issue(["ready", "qa"]))[0] == "build"
    assert api_logic.run_role_for_issue(corp, "corp", issue(["ready", "qa"]))[0] == "build"
    assert api_logic.run_role_for_issue(corp, "corp", issue(["in-qa"]))[0] == "qa"
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
    assert "--ask-for-approval" not in codex
    assert "-C" in codex and "/tmp" in codex
    assert "--color" in codex
    coded = corp.agent_argv("codex", "p", Path("/tmp"), readonly=True, last_message=Path("/tmp/orch.json"))
    assert "-o" in coded and "/tmp/orch.json" in coded
    assert corp.strip_log_prefix("orch clarity [{\"title\":\"x\"}]", "orch clarity") == "[{\"title\":\"x\"}]"
    assert corp.parse_json_array(corp.strip_log_prefix("orch clarity [{\"title\":\"x\"}]\norch clarity tail", "orch clarity")) == [{"title": "x"}]
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
    assert corp.strip_ansi("\x1b[1;37m[]\x1b[m") == "[]"
    assert corp._parse_issue_list("o/r", "\x1b[1;37m[]\x1b[m") == []
    plain_issues = '[{"number": 1, "title": "x"}]'
    assert corp._parse_issue_list("o/r", f"\x1b[1;37m{plain_issues}\x1b[m") == corp._parse_issue_list("o/r", plain_issues)
    assert corp.is_sandbox_card({"title": "песочница первого часа", "labels": []})
    assert corp.is_sandbox_card(issue(["sandbox"]))
    assert not corp.is_sandbox_card(issue(["ready"]))
    human = corp.tg_need_human_buttons("andrewkazavchinskyy-cloud/corp#56", url="https://example/card")
    assert [btn["text"] for btn in human[0]][:3] == ["Пауза", "Повторить", "Доска"]
    assert not any(btn.get("text") == "Открыть карточку" for btn in human[0])
    assert all(len((btn.get("callback_data") or "").encode()) <= 64 for btn in human[0] if "callback_data" in btn)
    need = corp.tg_need_human_text("corp#56", "нет модели")
    assert need.startswith("<b>Нужно тебя</b>") and "corp#56" in need and "нет модели" in need
    assert "Дальше:" in need
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
    with tempfile.TemporaryDirectory() as tmp:
        dest = Path(tmp)
        (dest / "docs").mkdir()
        (dest / "docs" / "SPEC.md").write_text("spec")
        (dest / "docs" / "DESIGN.md").write_text("design")
        rels = corp.orch_spec_rels(dest, ["docs/SPEC.md"])
        assert "docs/SPEC.md" in rels and "docs/DESIGN.md" in rels
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
    assert corp.tg_parse_command("/status") == ("now", "")
    assert corp.tg_parse_command("/сейчас") == ("now", "")
    assert corp.tg_parse_command("/retry #41") == ("retry", "#41")
    assert corp.tg_parse_command("/retry@corpbot 41") == ("retry", "41")
    assert corp.tg_parse_command("очередь") == ("now", "")
    assert corp.tg_parse_command("черновики") == ("more", "")
    assert corp.tg_parse_command("retry 41") == ("retry", "41")
    assert corp.tg_parse_command("непонятно") == ("", "")
    assert corp.tg_parse_command("Сейчас") == ("now", "")
    assert corp.tg_parse_command("Бежит") == ("now", "")
    assert corp.tg_parse_command("Агенты") == ("now", "")
    assert corp.tg_parse_command("Старт") == ("go", "")
    assert corp.tg_parse_command("Автоном ▶") == ("go", "")
    assert corp.tg_parse_command("/agents") == ("now", "")
    assert corp.tg_parse_command("/цикл") == ("council", "")
    assert corp.tg_parse_command("/improve") == ("council", "")
    assert corp.tg_parse_command("/цикл@corpbot") == ("council", "")
    assert corp.tg_parse_command("цикл") == ("council", "")
    assert corp.tg_parse_command("improve") == ("council", "")
    assert corp.tg_parse_command("команда") == ("council", "")
    assert corp.tg_parse_command("Ещё") == ("more", "")
    assert corp.tg_parse_command("/доска") == ("board", "")
    assert corp.tg_parse_command("/пауза") == ("pause", "")
    assert corp.tg_parse_command("/помощь") == ("help", "")
    assert corp.tg_parse_command("/abort") == ("abort", "")
    assert corp.tg_parse_command("/help") == ("help", "")
    help_text = corp.tg_help_text()
    assert help_text.startswith("<b>Помощь</b>")
    assert "Сейчас" in help_text and "Доска" in help_text and "Цикл" in help_text
    assert "/status /queue" not in help_text
    home_text, home_kb = corp.tg_home_payload()
    assert home_text.startswith("<b>Мастерская</b>")
    assert all(name in home_text for name in ("Сейчас", "Доска", "Цикл", "Ещё"))
    assert "Дальше:" in home_text
    assert home_kb == corp.tg_reply_keyboard()
    start_src = inspect.getsource(corp.tg_cmd_start)
    assert start_src.count("tg_send") == 1 and start_src.count("notify_safe") == 0
    assert "Кнопки внизу" not in start_src
    assert "tg_install_commands" not in start_src
    tick_src = inspect.getsource(corp.telegram_tick)
    assert "timeout={wait}" in tick_src
    assert "answerCallbackQuery" in tick_src
    assert tick_src.find("answerCallbackQuery") < tick_src.find("handle_tg_callback")
    loop_src = inspect.getsource(corp.telegram_loop)
    assert "telegram_tick(long_poll=True)" in loop_src
    assert "deleteWebhook" in loop_src
    assert "probe_isolation" not in inspect.getsource(corp.tg_status_body)
    menu = corp.tg_command_menu()
    assert len(menu) <= 6
    assert [row["command"] for row in menu] == ["start", "сейчас", "доска", "цикл", "пауза", "помощь"]
    keys = [btn["text"] for row in corp.tg_reply_keyboard() for btn in row]
    assert keys == ["Сейчас", "Доска", "Цикл", "Ещё"]
    assert "Автоном ▶" not in keys and "Статус" not in keys
    home = corp.tg_menu_buttons()
    assert [btn["text"] for row in home for btn in row] == ["Сейчас", "Доска", "Цикл", "Ещё"]
    assert all("callback_data" in btn for row in home for btn in row)
    assert corp.tg_needs_confirm("council") and corp.tg_needs_confirm("abort") and corp.tg_needs_confirm("go")
    assert not corp.tg_needs_confirm("pause")
    yes_no = corp.tg_confirm_buttons("!y")
    assert [btn["text"] for btn in yes_no[0]] == ["Да", "Нет"]
    assert "вызов" not in corp.tg_confirm_text("council").lower()
    confirm = corp.tg_confirm_text("council")
    assert confirm.startswith("<b>Цикл</b>") and "Дальше:" in confirm and "Да" in [b["text"] for b in corp.tg_confirm_buttons("!y")[0]]
    assert corp.tg_iso_line("transitional") == "Изоляция ещё настраивается. Мастерская работает."
    assert "авария" not in corp.tg_iso_line("transitional").lower()
    assert corp.tg_menu_button_payload("https://vmi3510874.tailad6484.ts.net/tg")["type"] == "web_app"
    assert corp.tg_menu_button_payload("https://example.com/tg")["type"] == "commands"
    assert corp.tg_short_ref("andrewkazavchinskyy-cloud/corp", 56) == "corp#56"
    assert corp.tg_card("corp#56", "старт", "claude") == "corp#56 · старт · claude"
    assert "\n" not in corp.tg_card("corp#56", "упал", "Очередь+")
    assert "http" not in corp.tg_card("corp#56", "старт", "claude")
    status = corp.tg_status_text(queue_on=False, writer="тихо", server_ok=True, drafts=2)
    assert status.startswith("<b>Сейчас</b>")
    assert "Очередь: пауза" in status and "Пишет: тихо" in status
    assert "Цикл: не идёт" in status
    assert "Черновики: 2" in status
    assert "Изоляция" not in status
    assert "Дальше:" in status
    assert corp.tg_html("a <b>x</b> & y") == "a &lt;b&gt;x&lt;/b&gt; &amp; y"
    dirty_title = corp.tg_screen("Доска", ["fix <b>bold</b> & copy"], "открой")
    assert "&lt;b&gt;bold&lt;/b&gt; &amp; copy" in dirty_title
    assert "fix <b>bold</b>" not in dirty_title
    dirty = corp.tg_pulse_card(
        queue_on=False,
        writer="тихо",
        last_error="token=ghp_abcdefghijklmnopqrstuvwxyz1234",
        iso_mode="transitional",
    )
    assert "ghp_" not in dirty and "[redacted]" in dirty
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
    assert board.startswith("<b>Доска</b>")
    assert "Готово 2 · Ход 1 · QA 1" in board
    assert "corp#2" in board and "corp#4" in board
    assert "corp#5" not in board
    assert board.count("wall of text") <= 3
    assert "в corp пусто — смени фильтр или открой цикл" in corp.tg_board_text([], project="corp")
    assert "на доске пусто — смени фильтр или открой цикл" in corp.tg_board_text([])
    picked = corp.tg_board_pick(board_cards)
    assert len(picked) <= 5
    assert picked[0]["column"] == "qa"
    assert [c["number"] for c in corp.tg_board_filter(board_cards, "clarity")] == [3]
    assert {c["number"] for c in corp.tg_board_filter(board_cards, "corp")} == {1, 2, 4, 6}
    assert 5 not in [c["number"] for c in corp.tg_board_filter(board_cards, "")]
    assert corp.tg_board_text(board_cards, project="clarity").startswith("<b>Доска · clarity</b>")
    assert "Готово 0 · Ход 1 · QA 0" in corp.tg_board_text(board_cards, project="clarity")
    assert corp.tg_html("a <b>x</b> & y") == "a &lt;b&gt;x&lt;/b&gt; &amp; y"
    dirty_board = corp.tg_board_text(
        [{"column": "ready", "repo": "o/corp", "number": 8, "title": "fix <b>bold</b> & copy", "labels": []}]
    )
    assert "&lt;b&gt;bold&lt;/b&gt; &amp; copy" in dirty_board
    assert "fix <b>bold</b>" not in dirty_board
    assert "<b>Доска</b>" in dirty_board
    page, pages = corp.tg_board_page_bounds(13, 0, 6)
    assert page == 1 and pages == 3
    page, pages = corp.tg_board_page_bounds(13, 99, 6)
    assert page == 3 and pages == 3
    page, pages = corp.tg_board_page_bounds(0, 5, 6)
    assert page == 1 and pages == 1
    many = [{"column": "ready", "repo": "o/corp", "number": n, "title": f"t{n}", "labels": []} for n in range(1, 14)]
    slice1, page, pages = corp.tg_board_slice(many, 2, 6)
    assert page == 2 and pages == 3 and [c["number"] for c in slice1] == [7, 8, 9, 10, 11, 12]
    pins = [{"name": "corp"}, {"name": "clarity"}]
    list_btns = corp.tg_board_buttons(board_cards, pins=pins)
    list_cbs = [b["callback_data"] for row in list_btns for b in row if "callback_data" in b]
    list_txt = [b["text"] for row in list_btns for b in row]
    assert "b:f:" in list_cbs and "b:f:corp" in list_cbs and "b:f:clarity" in list_cbs
    assert "· Все" in list_txt and "corp" in list_txt
    assert all(c.startswith("b:") for c in list_cbs)
    assert not any(c.startswith(("t:", "d:", "u:", "qap:", "qaf:", "m:")) for c in list_cbs)
    assert all(len(c.encode()) <= 64 for c in list_cbs)
    corp_only = corp.tg_board_buttons(board_cards, project="corp", pins=[{"name": "corp"}])
    corp_txt = [b["text"] for row in corp_only for b in row]
    corp_cbs = [b["callback_data"] for row in corp_only for b in row if "callback_data" in b]
    assert "· corp" in corp_txt and "Все" in corp_txt
    assert "b:f:corp" in corp_cbs
    paged = corp.tg_board_buttons(many, page=2, pins=[{"name": "corp"}])
    page_cbs = [b["callback_data"] for row in paged for b in row if "callback_data" in b]
    page_txt = [b["text"] for row in paged for b in row]
    assert "b:p:1" in page_cbs and "b:p:2" in page_cbs and "b:p:3" in page_cbs
    assert "2/3" in page_txt
    assert all(len(c.encode()) <= 64 for c in page_cbs)
    assert len(corp.tg_board_text(many).encode()) <= 4096
    qa_btns = corp.tg_board_buttons(board_cards, open_ref="corp#4")
    qa_cbs = [b["callback_data"] for row in qa_btns for b in row if "callback_data" in b]
    assert any(c.startswith("qap:") for c in qa_cbs) and any(c.startswith("qaf:") for c in qa_cbs)
    assert "b:b" in qa_cbs
    assert all(len(c.encode()) <= 64 for c in qa_cbs)
    take_btns = corp.tg_board_buttons(board_cards, open_ref="corp#2")
    take_cbs = [b["callback_data"] for row in take_btns for b in row if "callback_data" in b]
    assert any(c.startswith("t:") for c in take_cbs) and any(c.startswith("u:") for c in take_cbs)
    assert not any(c.startswith(("qap:", "qaf:", "m:")) for c in take_cbs)
    card_view = corp.tg_board_text(board_cards, open_ref="corp#4")
    assert card_view.startswith("<b>Доска · corp#4</b>")
    assert "QA" in card_view
    drafts_text = corp.tg_drafts_text(
        [{"id": "d1", "project": "corp", "title": "First"}, {"id": "d2", "project": "clarity", "title": "Second"}]
    )
    assert drafts_text == "Черновики: 2\ncorp · First\nclarity · Second"
    assert corp.tg_draft_buttons([{"id": "d1"}, {"id": "d2"}]) == [
        [{"text": "Принять", "callback_data": "a:d1"}, {"text": "Пропустить", "callback_data": "s:d1"}]
    ]
    more = corp.tg_more_text({
        "queue_running": False,
        "queue": [],
        "drafts": [{"id": "d1", "project": "corp", "title": "First"}],
        "council": {},
    })
    assert more.startswith("<b>Ещё</b>") and "corp · First" in more and "Дальше:" in more
    more_cbs = [b["callback_data"] for row in corp.tg_more_buttons({
        "queue_running": False,
        "queue": [{"status": "waiting", "repo": "o/corp", "issue": 1}],
        "drafts": [{"id": "d1"}],
        "council": {},
    }) for b in row if "callback_data" in b]
    assert all(len(c.encode()) <= 64 for c in more_cbs)
    assert "?g" in more_cbs and "a:d1" in more_cbs
    assert corp.tg_pulse_text("o/corp", 56, 15, "same", "same") is None
    assert corp.tg_pulse_text("o/corp", 56, 15, "new", "") is None
    assert corp.tg_pulse_text("o/corp", 56, 45, "new", "old") == "corp#56 · 45 мин · пишет"
    ev = corp.tg_event_buttons("start", url="https://github.com/o/corp/issues/56", ref="o/corp#56")
    ev_txt = [btn["text"] for btn in ev[0]]
    assert "Пауза" in ev_txt and "Открыть карточку" not in ev_txt
    fail_btns = corp.tg_event_buttons("fail", url="https://example", ref="o/corp#56")
    fail_txt = [btn["text"] for btn in fail_btns[0]]
    assert "Повторить" in fail_txt and "Открыть карточку" not in fail_txt
    shop_btns = corp.tg_event_buttons("fail", url="https://vmi.tailad6484.ts.net/?issue=o/corp#56", ref="o/corp#56")
    assert "Мастерская" in [btn["text"] for btn in shop_btns[0]] and "Повторить" in [btn["text"] for btn in shop_btns[0]]
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
            assert doctor["isolation"] == "ready-to-arm"
            assert "CORP_AGENT_USER unset" in doctor["isolation_reason"]
            assert "CORP_AGENT_USER unset" in doctor["isolation_blockers"]
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
    import hashlib
    import hmac
    from urllib.parse import urlencode

    def sign_init_data(fields: dict, token: str) -> str:
        pairs = [(key, str(value)) for key, value in fields.items() if key != "hash"]
        data_check = "\n".join(f"{key}={value}" for key, value in sorted(pairs))
        secret = hmac.new(b"WebAppData", token.encode(), hashlib.sha256).digest()
        digest = hmac.new(secret, data_check.encode(), hashlib.sha256).hexdigest()
        return urlencode(pairs + [("hash", digest)])

    token = "test-bot-token"
    chat = "4242"
    user = json.dumps({"id": 4242, "first_name": "Andrei"}, separators=(",", ":"))
    good = sign_init_data({"auth_date": str(int(now)), "query_id": "AA", "user": user}, token)
    assert auth.telegram_init_data_ok(good, token, chat, now)
    assert auth.init_data_from_headers({"X-Telegram-Init-Data": good}) == good
    assert auth.init_data_from_headers({"Authorization": "tma " + good}) == good
    assert auth.init_data_from_headers({"cookie": "corp_workshop=nope"}) == ""
    assert not auth.telegram_init_data_ok("", token, chat, now)
    assert not auth.telegram_init_data_ok(good, "", chat, now)
    assert not auth.telegram_init_data_ok(good, token, "", now)
    assert not auth.telegram_init_data_ok(good, "other-token", chat, now)
    assert not auth.telegram_init_data_ok(good, token, "9999", now)
    stale = sign_init_data(
        {"auth_date": str(int(now - auth.INITDATA_TTL_SEC - 5)), "user": user},
        token,
    )
    assert not auth.telegram_init_data_ok(stale, token, chat, now)
    future = sign_init_data({"auth_date": str(int(now + 30)), "user": user}, token)
    assert not auth.telegram_init_data_ok(future, token, chat, now)
    tampered = good[:-2] + ("0" if good[-2] != "0" else "1") + good[-1]
    assert not auth.telegram_init_data_ok(tampered, token, chat, now)
    assert auth.telegram_init_data_ok(
        good, token, chat, now, tailscale_login="andrei@tailscale", tailscale_expected="andrei@tailscale"
    )
    assert not auth.telegram_init_data_ok(
        good, token, chat, now, tailscale_login="other@tailscale", tailscale_expected="andrei@tailscale"
    )
    assert not auth.telegram_init_data_ok(
        good, token, chat, now, tailscale_login="", tailscale_expected="andrei@tailscale"
    )
    assert auth.telegram_init_data_ok(good, token, chat, now, tailscale_expected="")
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
            "agent identity isolated",
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
    assert corp.text_matches("", "x")
    assert corp.text_matches("corp#63", "title", "andrewkazavchinskyy-cloud/corp#63")
    assert not corp.text_matches("clarity", "corp#1")
    ev = Path(tempfile.mkdtemp(prefix="corp-ev-")) / "events.jsonl"
    corp.record_event("take", "corp#63", "взял", path=ev, now=10)
    corp.record_event("login", "", "token=secret", path=ev, now=11)
    rows = corp.load_events(10, path=ev)
    assert rows[0]["kind"] == "login" and rows[0]["text"] == "[redacted]"
    assert rows[1]["kind"] == "take" and rows[1]["ref"] == "corp#63"
    memdir = Path(tempfile.mkdtemp(prefix="corp-mem-"))
    sess = memdir / "memory" / "sessions"
    sess.mkdir(parents=True)
    for i, name in enumerate(["2026-08-10.md", "2026-08-16.md", "2026-08-17.md"]):
        path = sess / name
        path.write_text(f"# {name}\n")
        os.utime(path, (1_000_000 + i, 1_000_000 + i))
    old_dir = corp.project_dir
    corp.project_dir = lambda _project: memdir
    try:
        notes = corp.session_notes(reg2, "corp", 2)
        assert [n["name"] for n in notes] == ["2026-08-17.md", "2026-08-16.md"]
        assert corp.session_notes(reg2, "all") == []
    finally:
        corp.project_dir = old_dir
    running_alive = {"status": "running", "attempts": 1, "started_at": 1}
    assert corp.queue_decision(running_alive, now=200, tmux_on=True, issue=None) == "keep"
    assert corp.queue_decision(running_alive, now=1 + corp.QUEUE_HUNG_SEC + 1, tmux_on=True, issue=None) == "hung"
    assert corp.queue_job_outcome(True, 1, 2, True)["status"] == "done"
    assert corp.queue_job_outcome(False, 1, 2, True)["event"] == "retry"
    assert corp.queue_job_outcome(False, 2, 2, True)["event"] == "stop"
    assert corp.queue_job_outcome(False, 1, 2, True, hung=True)["event"] == "hung"
    class _Alive:
        returncode = 0
    killed = []
    old_run = corp.run
    old_kill = corp.tmux_kill
    try:
        corp.run = lambda *a, **k: _Alive()
        corp.tmux_kill = lambda name: killed.append(name)
        assert corp.wait_tmux("corp", hung_sec=0) == 124
        assert killed == ["corp"]
    finally:
        corp.run = old_run
        corp.tmux_kill = old_kill
    hung_item = {
        "status": "running",
        "attempts": 1,
        "started_at": 1,
        "repo": "o/corp",
        "issue": 1,
        "project": "corp",
    }
    hung_data = {"queue": [hung_item], "queue_running": True, "queue_retries": 2, "queue_hung_sec": 10}
    killed = []
    hung_events = corp.reap_queue(
        hung_data,
        now=20,
        tmux=lambda _name: True,
        fetch_issue=lambda *_a: claimed,
        release=lambda *_a: None,
        kill=lambda name: killed.append(name),
    )
    assert hung_events[0]["kind"] == "hung" and hung_data["queue_running"] is False and killed == ["corp"]
    ghost_fail = {
        "status": "done",
        "attempts": 2,
        "started_at": 1,
        "repo": "o/corp",
        "issue": 1,
        "project": "corp",
    }
    fail_data = {"queue": [ghost_fail], "queue_running": True, "queue_retries": 2}
    stop_events = corp.reap_queue(
        fail_data,
        now=100,
        tmux=lambda _name: False,
        fetch_issue=lambda *_a: claimed,
        release=lambda *_a: None,
    )
    assert stop_events[0]["kind"] == "stop" and fail_data["queue"][0]["status"] == "failed"
    approved = []
    old_approve = corp.approve_draft
    try:
        corp.approve_draft = lambda did: approved.append(did) or {"ok": True, "id": did}
        out = corp.approve_drafts(["a", "b"])
        assert approved == ["a", "b"] and out["ok"]
        def flaky(did):
            if did == "b":
                raise corp.CorpError("boom")
            return {"ok": True, "id": did}
        corp.approve_draft = flaky
        partial = corp.approve_drafts(["a", "b", "c"])
        assert partial["ok"] is False
        assert [row["id"] for row in partial["approved"]] == ["a", "c"]
        assert partial["errors"][0]["id"] == "b" and "boom" in partial["errors"][0]["error"]
    finally:
        corp.approve_draft = old_approve
    old_log = corp.RUN_LOG
    log_tmp = Path(tempfile.mkdtemp(prefix="corp-console-")) / "run.log"
    log_tmp.write_text(
        "andrewkazavchinskyy-cloud/corp#38 via claude\n"
        "andrewkazavchinskyy-cloud/corp#18 leftover\n"
        "noise without a tag\n"
    )
    try:
        corp.RUN_LOG = log_tmp
        assert "corp#38" in corp.last_log_lines(80, prefix="andrewkazavchinskyy-cloud/corp#38")
        assert corp.last_log_lines(80, prefix="andrewkazavchinskyy-cloud/corp#1") == "тишина"
        assert corp.last_log_lines(80, prefix="andrewkazavchinskyy-cloud/corp#99999") == "тишина"
        assert "corp#18" not in corp.last_log_lines(80, prefix="andrewkazavchinskyy-cloud/corp#1")
        leaked = api_logic.console_log_for_issue(corp, "andrewkazavchinskyy-cloud/corp#1")
        missing = api_logic.console_log_for_issue(corp, "andrewkazavchinskyy-cloud/corp#99999")
        owned = api_logic.console_log_for_issue(corp, "andrewkazavchinskyy-cloud/corp#38")
        assert leaked == "" and missing == ""
        assert "corp#38" in owned and "corp#18" not in owned
    finally:
        corp.RUN_LOG = old_log
    ev2 = Path(tempfile.mkdtemp(prefix="corp-ev2-")) / "events.jsonl"
    ev2.write_text(
        json.dumps({"t": 1, "kind": "fail", "ref": "corp#1", "text": "runner died ghp_abcdefghijklmnopqrstuvwxyz1234"})
        + "\n"
    )
    hidden = corp.load_events(10, path=ev2)
    assert hidden[0]["kind"] == "fail"
    assert "ghp_" not in hidden[0]["text"] and "[redacted]" in hidden[0]["text"]
    journal = api_logic.journal_events(corp)
    assert isinstance(journal, list)
    memdir = Path(tempfile.mkdtemp(prefix="corp-mem2-"))
    sess = memdir / "memory" / "sessions"
    sess.mkdir(parents=True)
    secret_note = sess / "2026-08-17.md"
    secret_note.write_text("token=ghp_abcdefghijklmnopqrstuvwxyz1234\nbot 123456789:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n")
    old_dir = corp.project_dir
    corp.project_dir = lambda _project: memdir
    try:
        notes = corp.session_notes(reg2, "corp", 2)
        blob = notes[0]["text"]
        assert "ghp_" not in blob and "AAH" not in blob and "[redacted]" in blob
        wrapped = api_logic.journal_notes(corp, reg2, "corp", 2)
        assert "ghp_" not in wrapped[0]["text"]
    finally:
        corp.project_dir = old_dir
    href = api_logic.workshop_issue_href("andrewkazavchinskyy-cloud/corp", 86)
    assert "issue=" in href and "andrewkazavchinskyy-cloud%2Fcorp%2386" in href
    assert api_logic.workshop_issue_ref("andrewkazavchinskyy-cloud/corp", 86) == "andrewkazavchinskyy-cloud/corp#86"
    try:
        api_logic.require_qa_note(corp, "   ")
        raise AssertionError("empty QA note should die")
    except corp.CorpError as exc:
        assert "правк" in str(exc)
    assert api_logic.require_qa_note(corp, "поправь кнопку") == "поправь кнопку"
    rejected = []
    moved = []
    old_get = corp.get_issue
    old_reject = corp.reject_qa
    old_close = corp.close_issue
    old_send = corp.send_to_qa
    old_move = corp.move_issue
    try:
        corp.get_issue = lambda repo, number: issue(["in-qa"])
        corp.reject_qa = lambda *a, **k: rejected.append((a, k)) or {"ok": True, "qa_fail": True, "column": "ready"}
        corp.close_issue = lambda *a, **k: {"ok": True, "closed": True, "graph": "graph pushed"}
        corp.send_to_qa = lambda *a, **k: moved.append(k) or {"ok": True, "column": "qa", "queued": k.get("enqueue")}
        corp.move_issue = lambda *a, **k: {"ok": True, "column": a[3]}
        fail_move = api_logic.workshop_move(corp, reg2, repo, 9, "ready", "сломан лист")
        assert fail_move["qa_fail"] and rejected
        try:
            api_logic.workshop_move(corp, reg2, repo, 9, "ready", "")
            raise AssertionError("QA to ready without note should die")
        except corp.CorpError:
            pass
        passed = api_logic.workshop_move(corp, reg2, repo, 9, "done")
        assert passed.get("closed")
        sent = api_logic.workshop_move(corp, reg2, repo, 1, "qa")
        assert sent.get("queued") is False
        corp.get_issue = lambda repo, number: issue(["ready"])
        to_qa = api_logic.workshop_move(corp, reg2, repo, 1, "done")
        assert to_qa.get("queued") is False
        closed = api_logic.workshop_close(corp, reg2, repo, 9, fail=False)
        assert closed.get("graphify") == "graph pushed" and closed.get("graphify_stale") is False
        try:
            api_logic.workshop_close(corp, reg2, repo, 9, fail=True, note="")
            raise AssertionError("close fail without note should die")
        except corp.CorpError:
            pass
    finally:
        corp.get_issue = old_get
        corp.reject_qa = old_reject
        corp.close_issue = old_close
        corp.send_to_qa = old_send
        corp.move_issue = old_move
    dropped = []
    old_get = corp.get_issue
    old_rm = corp.remove_labels
    old_inv = corp.invalidate_board
    try:
        corp.get_issue = lambda repo, number: issue(["in-progress", "self"])
        corp.remove_labels = lambda repo, number, labels: dropped.append(labels)
        corp.invalidate_board = lambda: None
        out = api_logic.drop_self(corp, repo, 83)
        assert out["dropped"] is True and out["column"] == "in-progress"
        assert dropped == [["self"]]
        corp.get_issue = lambda repo, number: issue(["ready"])
        idle = api_logic.drop_self(corp, repo, 83)
        assert idle["dropped"] is False and idle["column"] == "ready"
    finally:
        corp.get_issue = old_get
        corp.remove_labels = old_rm
        corp.invalidate_board = old_inv
    old_draft = corp.draft_by_id
    old_approve = corp.approve_drafts
    try:
        corp.draft_by_id = lambda did: {"id": did, "repo": "andrewkazavchinskyy-cloud/LifeBalance"}
        corp.approve_drafts = lambda ids: {"ok": True, "approved": ids, "errors": []}
        gated = api_logic.approve_drafts_checked(corp, ["x"], reg2)
        assert gated["ok"] is False and gated["approved"] == []
        assert "пин" in gated["errors"][0]["error"]
        corp.draft_by_id = lambda did: {"id": did, "repo": "andrewkazavchinskyy-cloud/corp"}
        def one_fail(ids):
            return {"ok": False, "approved": [{"id": ids[0]}], "errors": [{"id": ids[1], "error": "gh down"}]}
        corp.approve_drafts = one_fail
        mixed = api_logic.approve_drafts_checked(corp, ["ok", "bad"], reg2)
        assert mixed["ok"] is False and mixed["errors"][0]["id"] == "bad"
    finally:
        corp.draft_by_id = old_draft
        corp.approve_drafts = old_approve
    trees = api_logic.trees_from_doctor(
        {"corp": "/opt/corp", "workspace": "/home/corp/projects", "live": "/opt/corp", "live_sha": "abc", "trees": {"writers": "/home/corp/projects/corp"}}
    )
    assert trees["live"] == "/opt/corp" and trees["writers"] == "/home/corp/projects/corp"
    old_probe = corp.probe_isolation
    old_doc = corp.doctor_payload
    try:
        def boom():
            raise PermissionError("EACCES /home/corp-agent/.local/bin/claude")
        corp.probe_isolation = boom
        corp.doctor_payload = lambda isolation=None: {"isolation": (isolation or {}).get("mode"), "isolation_blockers": (isolation or {}).get("blockers") or [], "live": "/opt/corp", "workspace": "/home/corp/projects", "corp": "/opt/corp"}
        doctor = api_logic.safe_doctor(corp)
        assert doctor["isolation"] == "transitional"
        assert any("EACCES" in row or "probe failed" in row for row in doctor["isolation_blockers"])
        contour = api_logic.contour_fields(corp, reg2)
        assert contour["trees"]["live"] == "/opt/corp"
        assert "graphify_stale" in contour
    finally:
        corp.probe_isolation = old_probe
        corp.doctor_payload = old_doc
    waiting = issue(["in-qa"])
    try:
        api_logic.assert_in_qa(corp, repo, 85, issue(["ready"]))
        raise AssertionError("ready is not a QA slot")
    except corp.CorpError:
        pass
    assert api_logic.assert_in_qa(corp, repo, 85, waiting) == waiting
    app_src = (ROOT / "workshop" / "app.py").read_text()
    assert "corp.telegram_tick()" not in app_src
    assert "threading.Thread(target=telegram_loop" in app_src
    assert "/api/self/drop" in app_src and "/api/qa/start" in app_src
    assert "/api/council" in app_src
    assert '@app.get("/tg")' in app_src and '@app.get("/mini")' in app_src
    assert "telegram_ok" in app_src and "telegram_init_data_ok" in app_src
    assert 'X-Telegram-Init-Data' in (ROOT / "workshop" / "static" / "tg.html").read_text()
    assert "passkey required" in app_src
    assert "require_auth(request)" in app_src
    tg_html = (ROOT / "workshop" / "static" / "tg.html").read_text()
    assert "telegram-web-app.js" in tg_html and "themeParams" in tg_html
    assert "MainButton" in tg_html and "safe-area-inset" in tg_html
    assert "preview.html" not in tg_html
    assert "tg.initData" in tg_html and "tgFetch" in tg_html
    assert "passkey" in tg_html.lower()
    assert "Дальше:" in tg_html and "очередь и кто пишет" in tg_html
    assert "на доске пусто" in tg_html
    assert "Команда" in (ROOT / "workshop" / "static" / "app.js").read_text()
    assert "approve_drafts_checked" in app_src and "console_log_for_issue" in app_src
    closed_only = [{"title": "Ship the billing path for invoices", "state": "CLOSED"}]
    assert not any("billing" in item.lower() for item in corp.spec_gaps(spec_text, closed_only))
    assert any("billing" in item.lower() for item in corp.spec_gaps(spec_text, []))
    git_reg = {
        "projects": [
            {"name": "corp", "repo": "o/corp", "workshop": True, "status": "active"},
            {"name": "LifeBalance", "repo": "o/lb", "workshop": False, "status": "active"},
        ]
    }
    mirror = {
        "pins": {"corp": True, "LifeBalance": False},
        "projects": [dict(p) for p in git_reg["projects"]],
    }
    assert not corp.overlay_diverges(mirror, git_reg)
    assert corp.overlay_diverges({"pins": {"corp": True, "LifeBalance": True}}, git_reg)
    assert corp.overlay_diverges({"projects": [{"name": "ghost", "repo": "o/ghost", "workshop": True}]}, git_reg)
    serve_like = "https://vmi3510874.tailad6484.ts.net (tailnet only)\n"
    assert corp.funnel_enabled_from_text(serve_like) is False
    assert corp.funnel_enabled_from_text("Funnel is enabled\nhttps://public.example") is True
    assert corp.allow_funnel_on({"TCP": {}, "Web": {}}) is False
    assert corp.allow_funnel_on({"AllowFunnel": {"443": True}}) is True
    class _TS:
        def __init__(self, out, code=0):
            self.stdout = out
            self.stderr = ""
            self.returncode = code
    old_run = corp.run
    old_have = corp.have
    try:
        corp.have = lambda cmd: cmd == "tailscale" or old_have(cmd)
        def ts_run(cmd, **k):
            if list(cmd)[:3] == ["tailscale", "serve", "status"]:
                return _TS('{"TCP":{},"Web":{"https://x.ts.net":{}}}')
            if list(cmd)[:3] == ["tailscale", "funnel", "status"]:
                return _TS(serve_like)
            return old_run(cmd, **k)
        corp.run = ts_run
        ts = corp.tailscale_status()
        assert ts["serve"] is True and ts["funnel"] is False
        corp.have = lambda cmd: False
        missing = corp.tailscale_status()
        assert missing["serve"] is False and missing["funnel"] is True
    finally:
        corp.run = old_run
        corp.have = old_have
    real_is_file = Path.is_file
    def boom_cli(self):
        if self.name in corp.ISOLATION_CLIS:
            raise PermissionError(13, "Permission denied", str(self))
        return real_is_file(self)
    Path.is_file = boom_cli
    try:
        denied = corp.probe_isolation(run_cmd=lambda cmd: _Proc(0), dest_workspace=Path(tempfile.mkdtemp()), config=Path(tempfile.mkdtemp()))
        assert denied["mode"] == "transitional"
        assert any("CLIs not installed" in b for b in denied["blockers"])
        iso_denied = corp.isolation_status()
        assert iso_denied["mode"] == "transitional" and iso_denied["ok"] is False
    finally:
        Path.is_file = real_is_file
    old_get = corp.get_issue
    old_add = corp.add_labels
    old_comment = corp.comment
    old_inv = corp.invalidate_board
    try:
        corp.add_labels = lambda *a, **k: None
        corp.comment = lambda *a, **k: None
        corp.invalidate_board = lambda: None
        corp.get_issue = lambda repo, number: {**issue(["ready", "P0", "sandbox"]), "title": "песочница"}
        try:
            corp.queue_add(reg2, "andrewkazavchinskyy-cloud/corp", 9, "claude")
            raise AssertionError("sandbox P0 should die")
        except corp.CorpError as exc:
            assert "P0" in str(exc) or "sandbox" in str(exc).lower()
        corp.get_issue = lambda repo, number: issue(["in-progress", "via:claude"])
        try:
            corp.queue_add(reg2, "andrewkazavchinskyy-cloud/corp", 9, "claude")
            raise AssertionError("in-progress should die")
        except corp.CorpError as exc:
            assert "in-progress" in str(exc)
        corp.get_issue = lambda repo, number: issue(["in-qa"])
        try:
            corp.queue_add(reg2, "andrewkazavchinskyy-cloud/corp", 9, "claude")
            raise AssertionError("in-qa should die")
        except corp.CorpError as exc:
            assert "QA" in str(exc)
        added, errors = corp.council_enqueue_refs(
            reg2,
            [("andrewkazavchinskyy-cloud/corp", 9)],
            enqueue=lambda repo, number: corp.queue_add(reg2, repo, number, "grok", kind="grok"),
        )
        assert added == [] and errors and "QA" in errors[0]
    finally:
        corp.get_issue = old_get
        corp.add_labels = old_add
        corp.comment = old_comment
        corp.invalidate_board = old_inv
    try:
        corp.propose_draft(reg2, "over-under-dice", "x", "y")
        raise AssertionError("unpinned name should die")
    except corp.CorpError:
        pass
    old_draft = corp.draft_by_id
    try:
        corp.draft_by_id = lambda _id: {
            "id": "x",
            "repo": "andrewkazavchinskyy-cloud/LifeBalance",
            "title": "nope",
            "body": "",
            "label": "ready",
            "kind": "build",
        }
        try:
            corp.approve_draft("x")
            raise AssertionError("unpinned approve should die")
        except corp.CorpError as exc:
            assert "pin" in str(exc).lower() or "pinned" in str(exc)
    finally:
        corp.draft_by_id = old_draft
    old_url = os.environ.get("CORP_WORKSHOP_URL")
    os.environ["CORP_WORKSHOP_URL"] = "https://vmi3510874.tailad6484.ts.net"
    try:
        btns = corp.tg_event_buttons("to_qa", url="https://github.com/o/r/issues/1", ref="o/r#1")
        flat = [b for row in btns for b in row]
        assert any("?issue=" in (b.get("url") or "") for b in flat)
        assert not any(str(b.get("callback_data") or "").startswith("qa:") for b in flat)
        assert any(str(b.get("callback_data") or "").startswith("qap:") for b in flat)
        assert any(b.get("text") == "QA прошёл" for b in flat)
        sent = []
        notes = []
        old_send = corp.send_to_qa
        old_note = corp.notify_safe
        old_get = corp.get_issue
        old_close = corp.close_issue
        try:
            corp.send_to_qa = lambda *a, **k: sent.append("send")
            corp.close_issue = lambda *a, **k: sent.append("close")
            corp.notify_safe = lambda *a, **k: notes.append(a[0] if a else "")
            corp.handle_tg_callback("qa:andrewkazavchinskyy-cloud/corp#1")
            assert sent == []
            corp.get_issue = lambda repo, number: {"state": "OPEN", "labels": [{"name": "ready"}]}
            corp.handle_tg_callback("qap:andrewkazavchinskyy-cloud/corp#1")
            assert "close" not in sent and "send" not in sent
            assert any("не в колонке QA" in str(n) for n in notes)
            notes.clear()
            corp.handle_tg_callback("?y")
            assert any("подтверди запуск" in str(n) for n in notes)
            assert any(
                btn.get("text") == "Да"
                for row in (corp.tg_confirm_buttons("!y") or [])
                for btn in row
            )
        finally:
            corp.send_to_qa = old_send
            corp.notify_safe = old_note
            corp.get_issue = old_get
            corp.close_issue = old_close
    finally:
        if old_url is None:
            os.environ.pop("CORP_WORKSHOP_URL", None)
        else:
            os.environ["CORP_WORKSHOP_URL"] = old_url
    assert corp.uvicorn_matches_live(
        live_path=Path("/opt/corp"),
        live_head="abc",
        live_commit_time=100,
        pid=9,
        cwd="/opt/corp/workshop",
        start_time=50,
    )["ok"] is False
    assert corp.uvicorn_matches_live(
        live_path=Path("/opt/corp"),
        live_head="abc",
        live_commit_time=100,
        pid=9,
        cwd="/opt/corp/workshop",
        start_time=150,
    )["ok"] is True
    old_home = os.environ.get("CORP_HOME")
    service = Path(tempfile.mkdtemp(prefix="corp-svc-"))
    svc_db = service / ".config" / "corp" / "workshop.db"
    svc_db.parent.mkdir(parents=True)
    svc_db.write_text("")
    os.chmod(svc_db, 0o600)
    os.environ["CORP_HOME"] = str(service)
    try:
        assert corp.workshop_db_mode_ok()
        assert corp.workshop_service_db() == svc_db
    finally:
        if old_home is None:
            os.environ.pop("CORP_HOME", None)
        else:
            os.environ["CORP_HOME"] = old_home
    assert corp.log_line_matches_issue("andrewkazavchinskyy-cloud/corp#9 EXIT:0", "andrewkazavchinskyy-cloud/corp#9")
    assert not corp.log_line_matches_issue("andrewkazavchinskyy-cloud/corp#90 EXIT:0", "andrewkazavchinskyy-cloud/corp#9")
    seed = corp.project_seed_files("demo")
    assert "file ready Issues as the first action" in seed["docs/SPEC.md"]
    assert "workshop drafts" in seed["docs/SPEC.md"]
    old_gh = corp.gh_ready
    old_collect = corp.collect_issues
    corp.gh_ready = lambda: True
    corp.collect_issues = lambda *a, **k: []
    try:
        research = corp.cycle_payload({"org": "o", "projects": []})
        assert research["mode"] == "research"
        assert "workshop drafts" in research["instruction"]
        assert "Do not file GitHub ready Issues" in research["instruction"]
        assert "Do not auto-Approve" in research["instruction"]
        assert "writers" in corp.render(research).lower() or "live" in corp.render(research)
    finally:
        corp.gh_ready = old_gh
        corp.collect_issues = old_collect
    pins = {
        "org": "andrewkazavchinskyy-cloud",
        "projects": [
            {"name": "corp", "repo": "andrewkazavchinskyy-cloud/corp", "workshop": True, "status": "active"},
            {"name": "clarity", "repo": "andrewkazavchinskyy-cloud/clarity", "workshop": True, "status": "active"},
            {"name": "LifeBalance", "repo": "andrewkazavchinskyy-cloud/LifeBalance", "status": "active"},
        ],
    }
    assert corp.council_scope(pins, "") == "corp"
    assert corp.council_scope(pins, "all") == "corp"
    assert corp.council_scope(pins, "clarity") == "clarity"
    assert corp.council_scope(pins, "LifeBalance") == "corp"
    assert corp.council_scope(pins, "nope") == "corp"
    picked = corp.council_pick_items([{"title": f"t{i}"} for i in range(5)], [], cap=3)
    assert [item["title"] for item in picked] == ["t0", "t1", "t2"]
    picked = corp.council_pick_items(
        [{"title": "Foo"}, {"title": "foo"}, {"title": "Bar"}],
        ["Foo already"],
        cap=3,
    )
    assert [item["title"] for item in picked] == ["Bar"]
    assert corp.council_is_dup("Doctor lying", ["doctor lying on map"])
    assert not corp.council_is_dup("New a11y floor", ["doctor lying"])
    assert corp.council_qa_verdict("looks good\nVERDICT: PASS") == "pass"
    assert corp.council_qa_verdict("nope\nVERDICT: FAIL a11y") == "fail"
    assert corp.council_qa_verdict("") == "fail"
    assert corp.council_should_auto_qa({"ready", "council", "qa"})
    assert not corp.council_should_auto_qa({"ready", "qa"})
    assert "force" not in corp.council_ff_merge_main.__code__.co_names
    assert "tmux" in corp.council_abort.__code__.co_names or "killed" in corp.council_abort.__code__.co_varnames
    pulse = corp.tg_council_text({"status": "analyze", "project": "corp", "filed": []})
    assert pulse.startswith("<b>Цикл</b>") and "смотрит мастерскую" in pulse and "QA" in pulse
    assert "Дальше:" in pulse
    council_tmp = Path(tempfile.mkdtemp(prefix="corp-council-")) / "workshop.json"
    notes = []
    launched = []
    old_titles = corp.council_existing_titles
    try:
        corp.council_existing_titles = lambda *a, **k: ["already open"]
        with corp.workshop_json_override(council_tmp):
            corp.save_workshop(corp.default_workshop())
            started = corp.council_start(
                pins,
                "clarity",
                launch=lambda *a, **k: launched.append(a[1]["project"]),
                notify=lambda text, **k: notes.append(text),
                kind_ok=lambda k: k == "grok",
                tmux_on={role: False for role in corp.COUNCIL_ROLES},
            )
            assert started["project"] == "clarity" and started["status"] == "analyze"
            assert launched == ["clarity"]
            try:
                corp.council_start(
                    pins,
                    "corp",
                    launch=lambda *a, **k: None,
                    notify=lambda *a, **k: None,
                    kind_ok=lambda k: k == "grok",
                    tmux_on={role: False for role in corp.COUNCIL_ROLES},
                )
                raise AssertionError("second council should die")
            except corp.CorpError as exc:
                assert "уже" in str(exc)
            filed = []
            finished = corp.council_finish_analyze(
                pins,
                corp.council_load(),
                load_role_items=lambda role: [
                    {"title": f"{role} one", "body": "x", "acceptance": "ok"},
                    {"title": f"{role} two", "body": "y"},
                    {"title": f"{role} three", "body": "z"},
                    {"title": f"{role} four", "body": "skip"},
                ],
                file_issue=lambda repo, title, body, role: filed.append((role, title)) or {
                    "number": len(filed),
                    "repo": repo,
                },
                enqueue=lambda repo, number: None,
                start_queue=lambda: notes.append("queue-on"),
                notify=lambda text, **k: notes.append(text),
            )
            assert len(finished["filed"]) == 9
            assert all(role in {item[0] for item in filed} for role in corp.COUNCIL_ROLES)
            assert "queue-on" in notes
            assert "Завели 9" in corp.tg_council_text(corp.council_load())
    finally:
        corp.council_existing_titles = old_titles
    print("ok")


if __name__ == "__main__":
    main()
