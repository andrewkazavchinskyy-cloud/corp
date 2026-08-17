#!/usr/bin/env python3
"""Workshop UI. Bind 127.0.0.1 only. Secrets stay in ~/.config/corp/."""

from __future__ import annotations

import importlib.machinery
import importlib.util
import json
import os
import secrets
import sqlite3
import threading
import time
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from webauthn import (
    generate_authentication_options,
    generate_registration_options,
    options_to_json,
    verify_authentication_response,
    verify_registration_response,
)
from webauthn.helpers import base64url_to_bytes, bytes_to_base64url
from webauthn.helpers.structs import (
    AuthenticatorSelectionCriteria,
    PublicKeyCredentialDescriptor,
    ResidentKeyRequirement,
    UserVerificationRequirement,
)

from auth_policy import (
    SESSION_TTL_SEC,
    delete_all_sessions,
    extra_origins_from_env,
    is_loopback_host,
    origin_allowed,
    prune_auth_tables,
    session_valid,
    setup_token_file_valid,
    take_challenge,
    trusted_scheme,
)

ROOT = Path(__file__).resolve().parent.parent
STATIC = Path(__file__).resolve().parent / "static"
CONFIG = Path.home() / ".config" / "corp"
DB_PATH = CONFIG / "workshop.db"
TOKEN_PATH = CONFIG / "workshop-setup-token"
COOKIE = "corp_workshop"
USER_ID = b"corp-owner"
USER_NAME = "andrew"

_loader = importlib.machinery.SourceFileLoader("corpbin", str(ROOT / "bin" / "corp"))
corp = importlib.util.module_from_spec(importlib.util.spec_from_loader(_loader.name, _loader))
_loader.exec_module(corp)

LOCK = threading.Lock()
app = FastAPI(title="Мастерская")
app.mount("/static", StaticFiles(directory=STATIC), name="static")


def db() -> sqlite3.Connection:
    CONFIG.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS credentials (
            id INTEGER PRIMARY KEY,
            cred_id TEXT UNIQUE,
            public_key BLOB,
            sign_count INTEGER
        );
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            created REAL
        );
        CREATE TABLE IF NOT EXISTS challenges (
            token TEXT PRIMARY KEY,
            kind TEXT,
            challenge BLOB,
            created REAL
        );
        """
    )
    return conn


def cred_count() -> int:
    with db() as conn:
        return conn.execute("SELECT COUNT(*) FROM credentials").fetchone()[0]


def client_host(request: Request) -> str:
    if request.client and request.client.host:
        return request.client.host
    return ""


def request_scheme(request: Request) -> str:
    return trusted_scheme(
        request.url.scheme,
        request.headers.get("x-forwarded-proto"),
        is_loopback_host(client_host(request)),
    )


def session_ok(request: Request) -> bool:
    token = request.cookies.get(COOKIE)
    if not token:
        return False
    now = time.time()
    with db() as conn:
        prune_auth_tables(conn, now)
        row = conn.execute("SELECT token, created FROM sessions WHERE token=?", (token,)).fetchone()
        conn.commit()
    return bool(row) and session_valid(row["created"], now)


def set_session(response: JSONResponse) -> None:
    token = secrets.token_urlsafe(32)
    with db() as conn:
        conn.execute("INSERT INTO sessions(token, created) VALUES(?, ?)", (token, time.time()))
        conn.commit()
    response.set_cookie(
        COOKIE,
        token,
        max_age=SESSION_TTL_SEC,
        httponly=True,
        samesite="lax",
        secure=True,
        path="/",
    )


def revoke_sessions() -> None:
    with db() as conn:
        delete_all_sessions(conn)
        conn.commit()


def accept_setup_token(token: str) -> bool:
    if not TOKEN_PATH.is_file():
        return False
    if not setup_token_file_valid(TOKEN_PATH, time.time()):
        try:
            TOKEN_PATH.unlink()
        except OSError:
            pass
        return False
    return corp.setup_token_ok(token)


def consume_challenge(token: str, kinds: tuple[str, ...]) -> tuple[bytes, str] | None:
    now = time.time()
    with db() as conn:
        prune_auth_tables(conn, now)
        taken = take_challenge(conn, token, kinds, now)
        conn.commit()
    return taken


def host_parts(request: Request) -> tuple[str, str]:
    host_header = request.headers.get("host") or "localhost"
    host = host_header.split(":")[0]
    proto = request_scheme(request)
    origin = request.headers.get("origin") or f"{proto}://{host_header}"
    return host, origin


def require_auth(request: Request) -> None:
    if not session_ok(request):
        raise HTTPException(401, "passkey required")


def call(fn, *args, **kwargs):
    try:
        return fn(*args, **kwargs)
    except corp.CorpError as exc:
        msg = str(exc)
        if corp.github_transient(msg):
            raise HTTPException(503, "GitHub временно не отвечает. Обнови через пару секунд.") from exc
        raise HTTPException(400, msg) from exc


def check_origin(request: Request) -> None:
    if request.method in {"GET", "HEAD", "OPTIONS"}:
        return
    origin = (request.headers.get("origin") or "").strip()
    host_header = request.headers.get("host") or "localhost"
    if not origin_allowed(origin, host_header, request_scheme(request), extra_origins_from_env()):
        raise HTTPException(403, "bad origin")


@app.middleware("http")
async def gate(request: Request, call_next):
    path = request.url.path
    if path.startswith("/api/"):
        if path.startswith("/api/auth/"):
            if request.method not in {"GET", "HEAD", "OPTIONS"}:
                try:
                    check_origin(request)
                except HTTPException as exc:
                    return JSONResponse({"error": exc.detail}, status_code=exc.status_code)
            return await call_next(request)
        if not session_ok(request):
            return JSONResponse({"error": "passkey required"}, status_code=401)
        try:
            check_origin(request)
        except HTTPException as exc:
            return JSONResponse({"error": exc.detail}, status_code=exc.status_code)
    response = await call_next(request)
    if path == "/" or path.endswith("/index.html"):
        response.headers["Referrer-Policy"] = "no-referrer"
    return response


@app.get("/")
def index() -> FileResponse:
    return FileResponse(STATIC / "index.html", headers={"Referrer-Policy": "no-referrer"})


@app.get("/api/auth/status")
def auth_status(request: Request) -> dict:
    return {"ok": session_ok(request), "has_passkey": cred_count() > 0}


@app.post("/api/auth/register/options")
async def register_options(request: Request) -> JSONResponse:
    body = await request.json()
    token = (body.get("token") or "").strip()
    recover = False
    if cred_count() == 0:
        if not accept_setup_token(token):
            raise HTTPException(403, "setup token required")
    elif not session_ok(request):
        if not accept_setup_token(token):
            raise HTTPException(401, "passkey or recover token required")
        recover = True
    rp_id, _ = host_parts(request)
    options = generate_registration_options(
        rp_id=rp_id,
        rp_name="Мастерская",
        user_name=USER_NAME,
        user_id=USER_ID,
        authenticator_selection=AuthenticatorSelectionCriteria(
            resident_key=ResidentKeyRequirement.REQUIRED,
            user_verification=UserVerificationRequirement.PREFERRED,
        ),
    )
    chal = secrets.token_urlsafe(16)
    kind = "reg-recover" if recover else "reg"
    now = time.time()
    with db() as conn:
        prune_auth_tables(conn, now)
        conn.execute(
            "INSERT OR REPLACE INTO challenges(token, kind, challenge, created) VALUES(?,?,?,?)",
            (chal, kind, options.challenge, now),
        )
        conn.commit()
    payload = json.loads(options_to_json(options))
    resp = JSONResponse({"options": payload, "challenge": chal})
    return resp


@app.post("/api/auth/register/verify")
async def register_verify(request: Request) -> JSONResponse:
    body = await request.json()
    rp_id, origin = host_parts(request)
    taken = consume_challenge(body.get("challenge") or "", ("reg", "reg-recover"))
    if not taken:
        raise HTTPException(400, "challenge expired")
    challenge, kind = taken
    try:
        verification = verify_registration_response(
            credential=body.get("credential"),
            expected_challenge=challenge,
            expected_rp_id=rp_id,
            expected_origin=origin,
            require_user_verification=False,
        )
    except Exception as exc:
        raise HTTPException(400, str(exc)) from exc
    with db() as conn:
        conn.execute(
            "INSERT INTO credentials(cred_id, public_key, sign_count) VALUES(?,?,?)",
            (
                bytes_to_base64url(verification.credential_id),
                verification.credential_public_key,
                verification.sign_count,
            ),
        )
        conn.commit()
    if TOKEN_PATH.is_file() and cred_count() > 0:
        TOKEN_PATH.unlink()
    if kind == "reg-recover":
        revoke_sessions()
    resp = JSONResponse({"ok": True})
    set_session(resp)
    return resp


@app.post("/api/auth/login/options")
def login_options(request: Request) -> JSONResponse:
    rp_id, _ = host_parts(request)
    with db() as conn:
        rows = conn.execute("SELECT cred_id FROM credentials").fetchall()
    if not rows:
        raise HTTPException(400, "no passkey yet")
    options = generate_authentication_options(
        rp_id=rp_id,
        allow_credentials=[
            PublicKeyCredentialDescriptor(id=base64url_to_bytes(row["cred_id"])) for row in rows
        ],
        user_verification=UserVerificationRequirement.PREFERRED,
    )
    chal = secrets.token_urlsafe(16)
    now = time.time()
    with db() as conn:
        prune_auth_tables(conn, now)
        conn.execute(
            "INSERT OR REPLACE INTO challenges(token, kind, challenge, created) VALUES(?,?,?,?)",
            (chal, "auth", options.challenge, now),
        )
        conn.commit()
    return JSONResponse({"options": json.loads(options_to_json(options)), "challenge": chal})


@app.post("/api/auth/login/verify")
async def login_verify(request: Request) -> JSONResponse:
    body = await request.json()
    rp_id, origin = host_parts(request)
    cred = body.get("credential") or {}
    cred_id = cred.get("id")
    taken = consume_challenge(body.get("challenge") or "", ("auth",))
    if not taken:
        raise HTTPException(400, "challenge expired")
    challenge, _kind = taken
    with db() as conn:
        stored = conn.execute("SELECT * FROM credentials WHERE cred_id=?", (cred_id,)).fetchone()
    if not stored:
        raise HTTPException(400, "unknown passkey")
    try:
        verification = verify_authentication_response(
            credential=cred,
            expected_challenge=challenge,
            expected_rp_id=rp_id,
            expected_origin=origin,
            credential_public_key=stored["public_key"],
            credential_current_sign_count=stored["sign_count"],
            require_user_verification=False,
        )
    except Exception as exc:
        raise HTTPException(400, str(exc)) from exc
    with db() as conn:
        conn.execute(
            "UPDATE credentials SET sign_count=? WHERE cred_id=?",
            (verification.new_sign_count, cred_id),
        )
        conn.commit()
    resp = JSONResponse({"ok": True})
    set_session(resp)
    return resp


@app.post("/api/auth/logout")
def logout(request: Request) -> JSONResponse:
    token = request.cookies.get(COOKIE)
    if token:
        with db() as conn:
            conn.execute("DELETE FROM sessions WHERE token=?", (token,))
            conn.commit()
    resp = JSONResponse({"ok": True})
    resp.delete_cookie(COOKIE, path="/")
    return resp


@app.post("/api/auth/logout-all")
def logout_all(request: Request) -> JSONResponse:
    require_auth(request)
    revoke_sessions()
    resp = JSONResponse({"ok": True, "revoked": True})
    resp.delete_cookie(COOKIE, path="/")
    return resp


@app.get("/api/board")
def api_board() -> dict:
    corp.load_env()
    return call(corp.board_payload, corp.load_registry())


@app.get("/api/map")
def api_map() -> dict:
    corp.load_env()
    reg = corp.load_registry()
    live = []
    orch = []
    for project in corp.active_projects(reg):
        if corp.tmux_alive(project["name"]):
            live.append(project["name"])
        if corp.orch_alive(project["name"]):
            orch.append(project["name"])
    workshop = corp.load_workshop()
    status = corp.registry_status()
    return {
        "doctor": corp.doctor_payload(),
        "projects": corp.research_report(reg),
        "live": live,
        "orch": orch,
        "queue_running": workshop.get("queue_running"),
        "queue": workshop.get("queue"),
        "uncommitted_registry": status["uncommitted_registry"],
        "registry_source": "overlay" if status["uncommitted_registry"] else "git",
    }


@app.get("/api/graphs")
def api_graphs() -> dict:
    corp.load_env()
    return {"projects": call(corp.graphs_index, corp.load_registry())}


@app.get("/api/graphs/view")
def api_graph_view(name: str) -> dict:
    corp.load_env()
    return call(corp.graph_detail, corp.load_registry(), name)


@app.get("/api/settings")
def api_settings(probe: bool = False) -> dict:
    if probe:
        try:
            corp.probe_catalog()
        except Exception:
            pass
    data = corp.load_workshop()
    data["catalog"] = corp.load_catalog()
    data["pins"] = [{"name": p["name"], "repo": p.get("repo")} for p in corp.pinned_projects(corp.load_registry())]
    data["slots"] = {p["name"]: corp.slots_for(p["name"]) for p in corp.pinned_projects(corp.load_registry())}
    status = corp.registry_status()
    data["uncommitted_registry"] = status["uncommitted_registry"]
    data["registry_source"] = "overlay" if status["uncommitted_registry"] else "git"
    data["doctor"] = corp.doctor_payload()
    return data


@app.post("/api/settings")
async def api_settings_save(request: Request) -> dict:
    body = await request.json()
    with LOCK:
        data = corp.load_workshop()
        if "profiles" in body:
            data["profiles"] = body["profiles"]
        if "max_parallel" in body:
            data["max_parallel"] = max(1, min(3, int(body["max_parallel"])))
        if "auto_queue_on_approve" in body:
            data["auto_queue_on_approve"] = bool(body["auto_queue_on_approve"])
        if "queue_retries" in body:
            data["queue_retries"] = max(0, min(5, int(body["queue_retries"])))
        if "slots" in body and isinstance(body["slots"], dict):
            data["slots"] = body["slots"]
        corp.save_workshop(data)
    return api_settings()


@app.post("/api/catalog")
def api_catalog() -> dict:
    return call(corp.probe_catalog)


@app.post("/api/pin")
async def api_pin(request: Request) -> dict:
    body = await request.json()
    return call(corp.set_pin, corp.load_registry(), body.get("project") or "", True)


@app.post("/api/hide")
async def api_hide(request: Request) -> dict:
    body = await request.json()
    return call(corp.hide_project, corp.load_registry(), body.get("project") or "")


@app.post("/api/archive")
async def api_archive(request: Request) -> dict:
    body = await request.json()
    return call(corp.archive_project, corp.load_registry(), body.get("project") or "")


@app.get("/api/repos")
def api_repos() -> dict:
    return {"repos": call(corp.org_repos, corp.load_registry())}


@app.post("/api/unarchive")
async def api_unarchive(request: Request) -> dict:
    body = await request.json()
    return call(corp.unarchive_project, corp.load_registry(), body.get("repo") or body.get("project") or "")


@app.post("/api/projects/add")
async def api_projects_add(request: Request) -> dict:
    body = await request.json()
    return call(corp.add_existing, corp.load_registry(), body.get("repo") or "")


@app.post("/api/projects/create")
async def api_projects_create(request: Request) -> dict:
    body = await request.json()
    return call(corp.create_project, corp.load_registry(), body.get("name") or "")


@app.get("/api/project")
def api_project(name: str) -> dict:
    prune = getattr(corp, "prune_drafts", None)
    if prune:
        prune()
    stage = call(corp.project_stage, corp.load_registry(), name)
    drafts = [d for d in corp.load_workshop().get("drafts") or [] if d.get("repo") == stage.get("repo")]
    return {
        "stage": stage,
        "drafts": drafts,
        "slots": corp.slots_for(name),
        "orch": corp.orch_status(name),
    }


@app.post("/api/orchestrate")
async def api_orchestrate(request: Request) -> dict:
    body = await request.json()
    reg = corp.load_registry()
    repo = body.get("repo") or ""
    if not repo:
        project = corp.project_by_name(reg, body.get("project") or "")
        repo = project.get("repo") or ""
    else:
        project = corp.project_by_repo(reg, repo)
    if corp.orch_alive(project["name"]):
        return {"ok": True, "started": False}
    threading.Thread(target=lambda: corp.orchestrate(reg, repo), daemon=True).start()
    return {"ok": True, "started": True}


@app.post("/api/draft")
async def api_draft(request: Request) -> dict:
    body = await request.json()
    action = body.get("action") or ""
    draft_id = body.get("id") or ""
    if action == "propose":
        return call(
            corp.propose_draft,
            corp.load_registry(),
            body.get("project") or "",
            body.get("title") or "",
            body.get("body") or "",
            body.get("label") or "ready",
        )
    if action == "approve":
        return call(corp.approve_draft, draft_id)
    if action == "skip":
        return call(corp.skip_draft, draft_id)
    raise HTTPException(400, "action must be propose|approve|skip")


@app.post("/api/take")
async def api_take(request: Request) -> dict:
    body = await request.json()
    repo, number = call(corp.parse_issue_ref, body.get("issue") or "")
    return call(corp.take_issue, corp.load_registry(), repo, number)


@app.post("/api/move")
async def api_move(request: Request) -> dict:
    body = await request.json()
    repo, number = call(corp.parse_issue_ref, body.get("issue") or "")
    return call(corp.move_issue, corp.load_registry(), repo, number, body.get("column") or "")


@app.post("/api/close")
async def api_close(request: Request) -> dict:
    body = await request.json()
    repo, number = call(corp.parse_issue_ref, body.get("issue") or "")
    return call(
        corp.close_issue,
        corp.load_registry(),
        repo,
        number,
        force=bool(body.get("force")),
        fail=bool(body.get("fail") or body.get("verdict") == "fail"),
        note=body.get("note") or "",
    )


@app.post("/api/run")
async def api_run(request: Request) -> dict:
    body = await request.json()
    repo, number = call(corp.parse_issue_ref, body.get("issue") or "")
    profile_id = body.get("profile") or ""
    kind = body.get("agent") or ""
    model = body.get("model") or ""
    effort = body.get("effort") or ""
    fast = bool(body.get("fast"))
    if body.get("override") and profile_id:
        profile = call(corp.profile_by_id, profile_id)
        kind = kind or profile.get("kind") or ""
        model = model or profile.get("model") or ""
        effort = effort or profile.get("effort") or ""
        fast = fast or bool(profile.get("fast"))
    threading.Thread(
        target=_run_job,
        args=(repo, number, kind, model, effort, fast),
        daemon=True,
    ).start()
    issue = call(corp.get_issue, repo, number)
    project = call(corp.project_by_repo, corp.load_registry(), repo)
    role, slot = corp.slot_for_issue(project["name"], issue)
    return {"ok": True, "started": True, "role": role, "slot": {"kind": slot.get("kind"), "model": slot.get("model")}}


def _run_job(repo: str, number: int, kind: str, model: str, effort: str, fast: bool) -> None:
    try:
        corp.run_issue(corp.load_registry(), repo, number, kind, model=model, effort=effort, fast=fast)
    except SystemExit as exc:
        corp.append_log(f"run aborted: {exc}\n")
    except Exception as exc:
        corp.append_log(f"run failed: {exc}\n")


@app.post("/api/queue/add")
async def api_queue_add(request: Request) -> dict:
    body = await request.json()
    refs = body.get("issues") or []
    if body.get("issue"):
        refs = [body.get("issue"), *refs]
    if not refs:
        raise HTTPException(400, "issue required")
    profile = body.get("profile") or ""
    model = body.get("model") or ""
    effort = body.get("effort") or ""
    fast = body.get("fast")
    added = []
    with LOCK:
        reg = corp.load_registry()
        for raw in refs:
            repo, number = call(corp.parse_issue_ref, raw)
            row = call(
                corp.queue_add,
                reg,
                repo,
                number,
                body.get("profiles", {}).get(raw) or profile,
                model,
                effort,
                fast,
                body.get("kind") or "",
            )
            added.append(f"{repo}#{number}")
    return {"ok": True, "added": added, "queue": (row or {}).get("queue")}


@app.post("/api/queue/rm")
async def api_queue_rm(request: Request) -> dict:
    body = await request.json()
    repo, number = call(corp.parse_issue_ref, body.get("issue") or "")
    with LOCK:
        return call(corp.queue_rm, repo, number)


@app.post("/api/queue/retry")
async def api_queue_retry(request: Request) -> dict:
    body = await request.json()
    repo, number = call(corp.parse_issue_ref, body.get("issue") or "")
    with LOCK:
        return call(corp.queue_retry, repo, number)


@app.post("/api/queue/abort")
async def api_queue_abort(request: Request) -> dict:
    body = await request.json()
    repo, number = call(corp.parse_issue_ref, body.get("issue") or "")
    with LOCK:
        return call(corp.queue_abort, repo, number)


@app.post("/api/queue/start")
def api_queue_start() -> dict:
    with LOCK:
        return corp.queue_set_running(True)


@app.post("/api/queue/pause")
def api_queue_pause() -> dict:
    with LOCK:
        return corp.queue_set_running(False)


@app.get("/api/queue")
def api_queue() -> dict:
    return corp.queue_status()


@app.get("/api/console")
def api_console(project: str = "", issue: str = "") -> dict:
    log = ""
    if issue:
        log = corp.last_log_lines(80, prefix=issue)
        if log == "тишина":
            log = ""
    elif corp.RUN_LOG.is_file():
        log = corp.RUN_LOG.read_text()[-20000:]
    pane = ""
    kind = "log"
    if not issue:
        if project.startswith("orch:"):
            name = project.split(":", 1)[1]
            pane = corp.capture_pane(corp.orch_session(name), 80)
            kind = "orch"
        elif project and corp.tmux_alive(project):
            pane = corp.capture_pane(corp.tmux_session(project), 80)
            kind = "run"
        elif project and corp.orch_alive(project):
            pane = corp.capture_pane(corp.orch_session(project), 80)
            kind = "orch"
    live = []
    for p in corp.active_projects(corp.load_registry()):
        if corp.tmux_alive(p["name"]):
            live.append(p["name"])
        if corp.orch_alive(p["name"]):
            live.append(f"orch:{p['name']}")
    err = ""
    if issue and not pane and not log:
        data = corp.load_workshop()
        for item in data.get("queue") or []:
            if f"{item.get('repo')}#{item.get('issue')}" == issue:
                err = item.get("last_error") or ""
                break
    return {"log": log, "pane": pane, "live": live, "kind": kind, "issue": issue, "last_error": err}


@app.get("/api/console/stream")
def api_console_stream(project: str = "") -> StreamingResponse:
    def gen():
        while True:
            payload = api_console(project)
            yield f"data: {json.dumps(payload)}\n\n"
            time.sleep(2)

    return StreamingResponse(gen(), media_type="text/event-stream")


def _notify_queue_event(event: dict) -> None:
    item = event.get("item") or {}
    repo = item.get("repo") or ""
    number = item.get("issue")
    ref = corp.tg_short_ref(repo, number)
    key = corp.issue_ref(repo, number) if repo and number not in (None, "") else ref
    if event.get("kind") == "closed":
        corp.tg_notify_event("closed", ref, "закрыл", action_ref=key)
    else:
        corp.tg_notify_event("hung", ref, "завис", "перезапуск", action_ref=key)


def queue_tick() -> None:
    with LOCK:
      with corp.workshop_lock():
        data = corp.load_workshop()
        events = corp.reap_queue(data)
        if events:
            corp.save_workshop(data)
            corp.invalidate_board()
        for event in events:
            _notify_queue_event(event)
        if not data.get("queue_running"):
            return
        running_projects = {
            item["project"]
            for item in data["queue"]
            if item.get("status") == "running" or corp.tmux_alive(item.get("project") or "")
        }
        cap = max(1, min(3, int(data.get("max_parallel") or 3)))
        for item in data["queue"]:
            if item.get("status") != "waiting":
                continue
            if float(item.get("retry_after") or 0) > time.time():
                item["last_error"] = item.get("last_error") or "пауза перед повтором"
                continue
            project = item["project"]
            if project in running_projects:
                item["last_error"] = f"{project} уже занят"
                continue
            if len(running_projects) >= cap:
                item["last_error"] = "ждёт свободный слот"
                break
            try:
                issue = corp.get_issue(item["repo"], item["issue"])
            except Exception as exc:
                item["last_error"] = str(exc)
                if not item.get("alerted"):
                    item["alerted"] = True
                    corp.need_human(f"{corp.tg_short_ref(item['repo'], item['issue'])} · нет GitHub")
                    corp.save_workshop(data)
                continue
            names = corp.label_names(issue)
            if "self" in names or "blocked" in names:
                item["status"] = "skipped"
                item["last_error"] = "self" if "self" in names else "blocked"
                corp.remove_labels(item["repo"], item["issue"], ["queued"])
                continue
            blocked = corp.pin_write_block(corp.load_registry(), project, except_issue=item["issue"])
            if blocked:
                item["last_error"] = blocked
                if "self" in blocked and not item.get("alerted"):
                    item["alerted"] = True
                    corp.need_human(f"{corp.tg_short_ref(item['repo'], item['issue'])} · пин self")
                    corp.save_workshop(data)
                continue
            profile = next((p for p in data["profiles"] if p["id"] == item.get("profile")), None)
            if not profile:
                if item.get("kind"):
                    profile = {"id": "", "kind": item.get("kind"), "model": item.get("model") or ""}
                else:
                    item["status"] = "failed"
                    item["last_error"] = "нет модели"
                    corp.need_human(f"{corp.tg_short_ref(item['repo'], item['issue'])} · нет модели")
                    continue
            item["status"] = "running"
            item["started_at"] = time.time()
            item["attempts"] = int(item.get("attempts") or 0) + 1
            item["last_error"] = ""
            running_projects.add(project)
            corp.save_workshop(data)
            threading.Thread(target=_queue_job, args=(item, profile), daemon=True).start()
            return


def _queue_job(item: dict, profile: dict) -> None:
    repo, number = item["repo"], item["issue"]
    model = item.get("model") or profile.get("model") or ""
    effort = item.get("effort") or profile.get("effort") or ""
    fast = profile.get("fast")
    if item.get("fast") is not None:
        fast = bool(item.get("fast"))
    try:
        result = corp.run_issue(
            corp.load_registry(),
            repo,
            number,
            item.get("kind") or "",
            model=model,
            effort=effort,
            fast=bool(fast),
        )
        status = "done" if result.get("ok") else "failed"
        error = "" if result.get("ok") else (result.get("error") or ("не закрыл ишью" if result.get("incomplete") else "упал"))
    except Exception as exc:
        status = "failed"
        error = str(exc)
        try:
            corp.release_runner(repo, number)
        except Exception:
            pass
    with LOCK:
        with corp.workshop_lock():
            data = corp.load_workshop()
            retries = int(data.get("queue_retries") or corp.QUEUE_MAX_ATTEMPTS)
            for row in data["queue"]:
                if row["repo"] == repo and row["issue"] == number and row.get("status") == "running":
                    attempts = int(row.get("attempts") or 1)
                    row["last_error"] = error
                    if status == "done":
                        row["status"] = "done"
                    elif data.get("queue_running"):
                        row["status"] = "waiting"
                        if attempts < retries:
                            corp.tg_notify_event(
                                "fail",
                                corp.tg_short_ref(repo, number),
                                corp.tg_clip(error, 40),
                                "сам перезапускаю",
                                action_ref=corp.issue_ref(repo, number),
                            )
                        else:
                            row["attempts"] = 0
                            row["retry_after"] = time.time() + corp.RETRY_COOLDOWN_SEC
                            corp.tg_notify_event(
                                "fail",
                                corp.tg_short_ref(repo, number),
                                corp.tg_clip(error, 40),
                                "пауза 10 мин",
                                action_ref=corp.issue_ref(repo, number),
                            )
                    else:
                        row["status"] = "failed"
                        corp.tg_notify_event(
                            "fail",
                            corp.tg_short_ref(repo, number),
                            corp.tg_clip(error or "упал", 40),
                            "очередь на паузе",
                            action_ref=corp.issue_ref(repo, number),
                        )
            corp.save_workshop(data)


def queue_loop() -> None:
    while True:
        try:
            queue_tick()
            corp.telegram_tick()
        except Exception as exc:
            corp.append_log(f"queue: {exc}\n")
        time.sleep(4)


@app.on_event("startup")
def startup() -> None:
    db().close()
    corp.load_workshop()
    try:
        corp.tg_install_commands()
    except Exception:
        pass
    threading.Thread(target=queue_loop, daemon=True).start()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=int(os.environ.get("CORP_WORKSHOP_PORT", "8787")))
