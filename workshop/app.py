#!/usr/bin/env python3
"""Workshop UI. Bind 127.0.0.1 only. Secrets stay in ~/.config/corp/."""

from __future__ import annotations

import importlib.machinery
import importlib.util
import json
import os
import secrets
import sqlite3
import subprocess
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


def session_ok(request: Request) -> bool:
    token = request.cookies.get(COOKIE)
    if not token:
        return False
    with db() as conn:
        row = conn.execute("SELECT token FROM sessions WHERE token=?", (token,)).fetchone()
    return bool(row)


def set_session(response: JSONResponse) -> None:
    token = secrets.token_urlsafe(32)
    with db() as conn:
        conn.execute("INSERT INTO sessions(token, created) VALUES(?, ?)", (token, time.time()))
        conn.commit()
    response.set_cookie(COOKIE, token, httponly=True, samesite="lax", secure=True, path="/")


def host_parts(request: Request) -> tuple[str, str]:
    host = (request.headers.get("host") or "localhost").split(":")[0]
    proto = request.headers.get("x-forwarded-proto") or request.url.scheme
    origin = request.headers.get("origin") or f"{proto}://{request.headers.get('host')}"
    return host, origin


def require_auth(request: Request) -> None:
    if not session_ok(request):
        raise HTTPException(401, "passkey required")


def call(fn, *args, **kwargs):
    try:
        return fn(*args, **kwargs)
    except corp.CorpError as exc:
        raise HTTPException(400, str(exc)) from exc


def check_origin(request: Request) -> None:
    if request.method in {"GET", "HEAD", "OPTIONS"}:
        return
    host, origin = host_parts(request)
    if origin and host not in origin:
        raise HTTPException(403, "bad origin")


@app.middleware("http")
async def gate(request: Request, call_next):
    path = request.url.path
    if path.startswith("/api/") and not path.startswith("/api/auth/"):
        if not session_ok(request):
            return JSONResponse({"error": "passkey required"}, status_code=401)
        check_origin(request)
    return await call_next(request)


@app.get("/")
def index() -> FileResponse:
    return FileResponse(STATIC / "index.html")


@app.get("/api/auth/status")
def auth_status(request: Request) -> dict:
    return {"ok": session_ok(request), "has_passkey": cred_count() > 0}


@app.post("/api/auth/register/options")
async def register_options(request: Request) -> JSONResponse:
    body = await request.json()
    token = (body.get("token") or "").strip()
    if cred_count() == 0:
        expected = TOKEN_PATH.read_text().strip() if TOKEN_PATH.is_file() else ""
        if not expected or not secrets.compare_digest(token, expected):
            raise HTTPException(403, "setup token required")
    elif not session_ok(request):
        raise HTTPException(401, "passkey required")
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
    with db() as conn:
        conn.execute(
            "INSERT OR REPLACE INTO challenges(token, kind, challenge, created) VALUES(?,?,?,?)",
            (chal, "reg", options.challenge, time.time()),
        )
        conn.commit()
    payload = json.loads(options_to_json(options))
    resp = JSONResponse({"options": payload, "challenge": chal})
    return resp


@app.post("/api/auth/register/verify")
async def register_verify(request: Request) -> JSONResponse:
    body = await request.json()
    rp_id, origin = host_parts(request)
    with db() as conn:
        row = conn.execute(
            "SELECT challenge FROM challenges WHERE token=? AND kind='reg'",
            (body.get("challenge"),),
        ).fetchone()
    if not row:
        raise HTTPException(400, "challenge expired")
    try:
        verification = verify_registration_response(
            credential=body.get("credential"),
            expected_challenge=row["challenge"],
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
        conn.execute("DELETE FROM challenges WHERE token=?", (body.get("challenge"),))
        conn.commit()
    if TOKEN_PATH.is_file() and cred_count() > 0:
        TOKEN_PATH.unlink()
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
    with db() as conn:
        conn.execute(
            "INSERT OR REPLACE INTO challenges(token, kind, challenge, created) VALUES(?,?,?,?)",
            (chal, "auth", options.challenge, time.time()),
        )
        conn.commit()
    return JSONResponse({"options": json.loads(options_to_json(options)), "challenge": chal})


@app.post("/api/auth/login/verify")
async def login_verify(request: Request) -> JSONResponse:
    body = await request.json()
    rp_id, origin = host_parts(request)
    cred = body.get("credential") or {}
    cred_id = cred.get("id")
    with db() as conn:
        chal = conn.execute(
            "SELECT challenge FROM challenges WHERE token=? AND kind='auth'",
            (body.get("challenge"),),
        ).fetchone()
        stored = conn.execute("SELECT * FROM credentials WHERE cred_id=?", (cred_id,)).fetchone()
    if not chal or not stored:
        raise HTTPException(400, "unknown passkey")
    try:
        verification = verify_authentication_response(
            credential=cred,
            expected_challenge=chal["challenge"],
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
        conn.execute("DELETE FROM challenges WHERE token=?", (body.get("challenge"),))
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


@app.get("/api/board")
def api_board() -> dict:
    corp.load_env()
    return call(corp.board_payload, corp.load_registry())


@app.get("/api/map")
def api_map() -> dict:
    corp.load_env()
    reg = corp.load_registry()
    live = []
    for project in corp.active_projects(reg):
        if corp.tmux_alive(project["name"]):
            live.append(project["name"])
    workshop = corp.load_workshop()
    return {
        "doctor": corp.doctor_payload(),
        "projects": corp.research_report(reg),
        "live": live,
        "queue_running": workshop.get("queue_running"),
        "queue": workshop.get("queue"),
    }


@app.get("/api/settings")
def api_settings() -> dict:
    data = corp.load_workshop()
    data["catalog"] = corp.load_catalog()
    data["pins"] = [{"name": p["name"], "repo": p.get("repo")} for p in corp.pinned_projects(corp.load_registry())]
    data["slots"] = {p["name"]: corp.slots_for(p["name"]) for p in corp.pinned_projects(corp.load_registry())}
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
    return {"stage": stage, "drafts": drafts, "slots": corp.slots_for(name)}


@app.post("/api/orchestrate")
async def api_orchestrate(request: Request) -> dict:
    body = await request.json()
    repo = body.get("repo") or ""
    if not repo:
        project = corp.project_by_name(corp.load_registry(), body.get("project") or "")
        repo = project.get("repo") or ""
    threading.Thread(target=lambda: corp.orchestrate(corp.load_registry(), repo), daemon=True).start()
    return {"ok": True, "started": True}


@app.post("/api/draft")
async def api_draft(request: Request) -> dict:
    body = await request.json()
    action = body.get("action") or ""
    draft_id = body.get("id") or ""
    if action == "approve":
        return call(corp.approve_draft, draft_id)
    if action == "skip":
        return call(corp.skip_draft, draft_id)
    raise HTTPException(400, "action must be approve|skip")


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
    return call(corp.close_issue, corp.load_registry(), repo, number)


@app.post("/api/run")
async def api_run(request: Request) -> dict:
    body = await request.json()
    repo, number = call(corp.parse_issue_ref, body.get("issue") or "")
    profile_id = body.get("profile") or ""
    kind = body.get("agent") or ""
    model = body.get("model") or ""
    effort = body.get("effort") or ""
    fast = bool(body.get("fast"))
    if profile_id:
        profile = call(corp.profile_by_id, profile_id)
        kind = kind or profile.get("kind") or ""
        model = model or profile.get("model") or ""
        effort = effort or profile.get("effort") or ""
        fast = fast or bool(profile.get("fast"))
    if not kind:
        raise HTTPException(400, "pick a profile")
    threading.Thread(
        target=_run_job,
        args=(repo, number, kind, model, effort, fast),
        daemon=True,
    ).start()
    return {"ok": True, "started": True}


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
    repo, number = call(corp.parse_issue_ref, body.get("issue") or "")
    return call(corp.queue_add, corp.load_registry(), repo, number, body.get("profile") or "")


@app.post("/api/queue/rm")
async def api_queue_rm(request: Request) -> dict:
    body = await request.json()
    repo, number = call(corp.parse_issue_ref, body.get("issue") or "")
    return call(corp.queue_rm, repo, number)


@app.post("/api/queue/start")
def api_queue_start() -> dict:
    return corp.queue_set_running(True)


@app.post("/api/queue/pause")
def api_queue_pause() -> dict:
    return corp.queue_set_running(False)


@app.get("/api/queue")
def api_queue() -> dict:
    return corp.queue_status()


@app.get("/api/console")
def api_console(project: str = "") -> dict:
    log = ""
    if corp.RUN_LOG.is_file():
        log = corp.RUN_LOG.read_text()[-20000:]
    pane = ""
    if project and corp.tmux_alive(project):
        proc = subprocess.run(
            ["tmux", "capture-pane", "-pt", corp.tmux_session(project), "-S", "-80"],
            text=True,
            capture_output=True,
        )
        pane = proc.stdout
    live = [p["name"] for p in corp.active_projects(corp.load_registry()) if corp.tmux_alive(p["name"])]
    return {"log": log, "pane": pane, "live": live}


@app.get("/api/console/stream")
def api_console_stream(project: str = "") -> StreamingResponse:
    def gen():
        while True:
            payload = api_console(project)
            yield f"data: {json.dumps(payload)}\n\n"
            time.sleep(2)

    return StreamingResponse(gen(), media_type="text/event-stream")


def queue_tick() -> None:
    with LOCK:
        data = corp.load_workshop()
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
            project = item["project"]
            if project in running_projects:
                continue
            if len(running_projects) >= cap:
                break
            issue = corp.get_issue(item["repo"], item["issue"])
            if "self" in corp.label_names(issue):
                item["status"] = "skipped"
                corp.remove_labels(item["repo"], item["issue"], ["queued"])
                continue
            profile = next((p for p in data["profiles"] if p["id"] == item["profile"]), None)
            if not profile:
                item["status"] = "failed"
                continue
            item["status"] = "running"
            running_projects.add(project)
            corp.save_workshop(data)
            threading.Thread(target=_queue_job, args=(item["repo"], item["issue"], profile), daemon=True).start()
            return


def _queue_job(repo: str, number: int, profile: dict) -> None:
    try:
        result = corp.run_issue(
            corp.load_registry(),
            repo,
            number,
            profile.get("kind") or "claude",
            model=profile.get("model") or "",
            effort=profile.get("effort") or "",
            fast=bool(profile.get("fast")),
        )
        status = "done" if result.get("ok") else "failed"
    except Exception:
        status = "failed"
    with LOCK:
        data = corp.load_workshop()
        for item in data["queue"]:
            if item["repo"] == repo and item["issue"] == number and item.get("status") == "running":
                item["status"] = status
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
    threading.Thread(target=queue_loop, daemon=True).start()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=int(os.environ.get("CORP_WORKSHOP_PORT", "8787")))
