"""Workshop API helpers. Call corp functions; no FastAPI."""

from __future__ import annotations

import os
from urllib.parse import quote

DEFAULT_WORKSHOP_HOST = "vmi3510874.tailad6484.ts.net"


def log_line_matches_issue(line: str, issue: str) -> bool:
    prefix = (issue or "").strip()
    if not prefix:
        return False
    start = 0
    while True:
        idx = line.find(prefix, start)
        if idx < 0:
            return False
        end = idx + len(prefix)
        if end >= len(line) or not line[end].isdigit():
            return True
        start = idx + 1


def console_log_for_issue(corp, issue: str, n: int = 80) -> str:
    ref = (issue or "").strip()
    if not ref:
        return ""
    path = corp.RUN_LOG
    if not path.is_file():
        return ""
    matched = []
    for raw in path.read_text(errors="replace").splitlines():
        line = raw.rstrip()
        if line and log_line_matches_issue(line, ref):
            matched.append(corp.redact_secrets(line[:2000]))
    if not matched:
        return ""
    return "\n".join(matched[-max(1, int(n)):])


def redact_rows(corp, rows: list, *keys: str) -> list:
    out = []
    for row in rows or []:
        item = dict(row)
        for key in keys:
            if key in item:
                item[key] = corp.redact_secrets(str(item.get(key) or ""))
        out.append(item)
    return out


def journal_notes(corp, reg: dict, pin: str, limit: int = 7) -> list[dict]:
    return redact_rows(corp, corp.session_notes(reg, pin, limit), "text")


def journal_events(corp, limit: int = 40) -> list[dict]:
    rows = corp.load_events(max(1, min(80, int(limit or 40))))
    return redact_rows(corp, rows, "text", "ref")


def workshop_host() -> str:
    return (os.environ.get("CORP_WORKSHOP_HOST") or DEFAULT_WORKSHOP_HOST).strip()


def workshop_issue_ref(repo: str, number: int) -> str:
    return f"{repo}#{int(number)}"


def workshop_issue_href(repo: str, number: int) -> str:
    return f"https://{workshop_host()}/?issue={quote(workshop_issue_ref(repo, number), safe='')}"


def with_issue_link(payload: dict, repo: str, number: int) -> dict:
    out = dict(payload or {})
    out["issue_ref"] = workshop_issue_ref(repo, number)
    out["issue_href"] = workshop_issue_href(repo, number)
    return out


def isolation_fallback(exc: BaseException) -> dict:
    reason = f"isolation probe failed: {exc}"
    return {
        "mode": "transitional",
        "isolated": False,
        "armed": False,
        "ready_to_arm": False,
        "wrapper_ok": False,
        "workspace_ok": False,
        "secrets_denied": False,
        "clis": {},
        "blockers": [reason],
        "reason": reason,
    }


def safe_doctor(corp) -> dict:
    try:
        iso = corp.probe_isolation()
    except Exception as exc:
        iso = isolation_fallback(exc)
    try:
        return corp.doctor_payload(isolation=iso)
    except Exception as exc:
        live = "/opt/corp"
        try:
            live = str(corp.live_corp_path())
        except Exception:
            pass
        return {
            "corp": str(getattr(corp, "ROOT", "")),
            "workspace": "",
            "live": live,
            "isolation": "transitional",
            "isolation_reason": str(exc),
            "isolation_blockers": [str(exc)],
            "checks": [],
        }


def trees_from_doctor(doctor: dict) -> dict:
    data = doctor or {}
    trees = {
        "live": data.get("live") or "/opt/corp",
        "live_sha": data.get("live_sha") or "",
        "live_dirty": data.get("live_dirty"),
        "live_behind": data.get("live_behind"),
        "writers": data.get("workspace") or data.get("writers") or "",
        "control": data.get("corp") or "",
        "uvicorn_sha": data.get("uvicorn_sha") or "",
    }
    extra = data.get("trees")
    if isinstance(extra, dict):
        trees.update(extra)
    for key in ("writers_sha", "writers_tree", "live_tree", "control_tree", "writers_dirty"):
        if key in data:
            trees[key] = data[key]
    return trees


def graphify_pin_status(corp, project: dict) -> dict:
    dest = corp.project_dir(project)
    age = corp.graph_age_of(dest)
    report = dest / "graphify-out" / "GRAPH_REPORT.md" if dest else None
    commit = ""
    head = ""
    stale = True
    if report is not None and report.is_file():
        parsed = corp.parse_graph_report(report.read_text(errors="replace"))
        commit = parsed.get("fresh") or ""
        try:
            head = (corp.run(["git", "-C", str(dest), "rev-parse", "HEAD"], check=False, timeout=8).stdout or "").strip()
        except Exception:
            head = ""
        if commit and head:
            stale = not (head.startswith(commit) or commit.startswith(head[: min(12, len(head) or 12)]))
        else:
            stale = True
    return {
        "name": project.get("name"),
        "repo": project.get("repo"),
        "graph_age": age,
        "graphify_stale": stale,
        "graph_commit": commit,
        "head": head[:12] if head else "",
        "refreshed": age,
    }


def graphify_summary(corp, reg: dict) -> dict:
    pins = [graphify_pin_status(corp, project) for project in corp.pinned_projects(reg)]
    return {
        "graphify": pins,
        "graphify_stale": any(row.get("graphify_stale") for row in pins),
    }


def contour_fields(corp, reg: dict) -> dict:
    doctor = safe_doctor(corp)
    if isinstance(doctor.get("graphify_stale"), bool) or doctor.get("graphify"):
        graph = {
            "graphify": doctor.get("graphify") or [],
            "graphify_stale": bool(doctor.get("graphify_stale")),
        }
        if not graph["graphify"]:
            graph = graphify_summary(corp, reg)
            if "graphify_stale" in doctor:
                graph["graphify_stale"] = bool(doctor.get("graphify_stale"))
    else:
        graph = graphify_summary(corp, reg)
    return {
        "doctor": doctor,
        "trees": trees_from_doctor(doctor),
        **graph,
    }


def require_pin_repo(corp, repo: str, reg: dict) -> None:
    if not corp.pin_owns_repo(repo or "", reg):
        raise corp.CorpError("репозиторий не в пинах")


def approve_drafts_checked(corp, ids: list[str], reg: dict) -> dict:
    pending = []
    errors = []
    for did in ids:
        if not did:
            continue
        try:
            draft = corp.draft_by_id(did)
        except corp.CorpError as exc:
            errors.append({"id": did, "error": str(exc)})
            continue
        if not corp.pin_owns_repo(draft.get("repo") or "", reg):
            errors.append({"id": did, "error": "репозиторий не в пинах"})
            continue
        pending.append(did)
    approved = []
    if pending:
        result = corp.approve_drafts(pending)
        approved = result.get("approved") or []
        errors.extend(result.get("errors") or [])
    return {"ok": not errors, "approved": approved, "errors": errors}


def propose_checked(corp, reg: dict, project_name: str, title: str, body: str, label: str) -> dict:
    project = corp.project_by_name(reg, project_name)
    require_pin_repo(corp, project.get("repo") or "", reg)
    return corp.propose_draft(reg, project_name, title, body, label)


def require_qa_note(corp, note: str) -> str:
    text = (note or "").strip()
    if not text:
        raise corp.CorpError("нужен комментарий с правками")
    return text


def issue_waiting_qa(corp, issue: dict) -> bool:
    names = corp.label_names(issue)
    return "in-qa" in names and "qa-fail" not in names


def run_role_for_issue(corp, name: str, issue: dict) -> tuple[str, dict]:
    names = corp.label_names(issue)
    slots = corp.slots_for(name)
    if "in-qa" in names and "qa-fail" not in names:
        return "qa", slots["qa"]
    if "design" in names:
        return "design", slots["design"]
    return "build", slots["build"]


def drop_self(corp, repo: str, number: int) -> dict:
    issue = corp.get_issue(repo, number)
    names = corp.label_names(issue)
    column = corp.column_of(issue)
    if "self" not in names:
        return {"ok": True, "dropped": False, "repo": repo, "issue": number, "column": column}
    corp.remove_labels(repo, number, ["self"])
    corp.invalidate_board()
    try:
        latest = corp.get_issue(repo, number)
    except Exception:
        labels = [item for item in (issue.get("labels") or []) if (item.get("name") if isinstance(item, dict) else item) != "self"]
        latest = {**issue, "labels": labels}
    return {
        "ok": True,
        "dropped": True,
        "repo": repo,
        "issue": number,
        "column": corp.column_of(latest),
        "labels": sorted(corp.label_names(latest)),
    }


def workshop_move(corp, reg: dict, repo: str, number: int, column: str, note: str = "") -> dict:
    if column not in {"backlog", "ready", "in-progress", "qa", "done"}:
        raise corp.CorpError("column must be backlog|ready|in-progress|qa|done")
    issue = corp.get_issue(repo, number)
    waiting = issue_waiting_qa(corp, issue)
    if column == "ready" and waiting:
        return corp.reject_qa(reg, repo, number, require_qa_note(corp, note))
    if column == "done" and waiting:
        return corp.close_issue(reg, repo, number, force=False, fail=False)
    if column in {"done", "qa"}:
        return corp.send_to_qa(reg, repo, number, enqueue=False)
    return corp.move_issue(reg, repo, number, column)


def workshop_close(corp, reg: dict, repo: str, number: int, force: bool = False, fail: bool = False, note: str = "") -> dict:
    if fail:
        text = require_qa_note(corp, note)
        return corp.close_issue(reg, repo, number, force=force, fail=True, note=text)
    result = corp.close_issue(reg, repo, number, force=force, fail=False, note=note or "")
    graph = result.get("graph") or ""
    if result.get("closed"):
        result["graphify"] = graph
        result["graphify_stale"] = graph not in {"graph pushed", "graph unchanged"}
    return result


def assert_in_qa(corp, repo: str, number: int, issue: dict | None = None) -> dict:
    card = issue or corp.get_issue(repo, number)
    if not issue_waiting_qa(corp, card):
        raise corp.CorpError(f"{repo}#{number} не на QA")
    return card
