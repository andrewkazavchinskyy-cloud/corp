"""Passkey session/challenge policy. Stdlib only — imported by workshop and tests."""

from __future__ import annotations

import os
from urllib.parse import urlparse

SESSION_TTL_SEC = 7 * 24 * 3600
CHALLENGE_TTL_SEC = 5 * 60
LOCAL_HOSTS = frozenset({"localhost", "127.0.0.1", "::1"})


def extra_origins_from_env(raw: str | None = None) -> list[str]:
    text = raw if raw is not None else os.environ.get("CORP_WORKSHOP_ORIGINS", "")
    return [part.strip() for part in (text or "").split(",") if part.strip()]


def trusted_scheme(url_scheme: str, forwarded_proto: str | None, loopback: bool) -> str:
    proto = (forwarded_proto or "").strip().lower()
    if loopback and proto in {"http", "https"}:
        return proto
    scheme = (url_scheme or "").strip().lower()
    return scheme if scheme in {"http", "https"} else "http"


def is_loopback_host(host: str) -> bool:
    return (host or "").strip().lower().split("%")[0] in LOCAL_HOSTS


def normalize_origin(origin: str) -> tuple[str, str, int] | None:
    raw = (origin or "").strip()
    if not raw or "://" not in raw:
        return None
    parsed = urlparse(raw)
    scheme = (parsed.scheme or "").lower()
    host = (parsed.hostname or "").lower()
    if scheme not in {"http", "https"} or not host:
        return None
    if parsed.username or parsed.password:
        return None
    if parsed.path not in {"", "/"} or parsed.query or parsed.fragment:
        return None
    port = parsed.port
    if port is None:
        port = 443 if scheme == "https" else 80
    return scheme, host, int(port)


def host_header_origin(host_header: str, scheme: str) -> tuple[str, str, int] | None:
    header = (host_header or "").strip()
    if not header:
        return None
    return normalize_origin(f"{scheme}://{header}")


def allowed_origin_parts(
    host_header: str,
    scheme: str,
    extras: list[str] | tuple[str, ...] = (),
) -> set[tuple[str, str, int]]:
    allowed: set[tuple[str, str, int]] = set()
    request_origin = host_header_origin(host_header, scheme)
    if request_origin:
        allowed.add(request_origin)
    port = request_origin[2] if request_origin else (443 if scheme == "https" else 80)
    for host in ("localhost", "127.0.0.1"):
        allowed.add((scheme, host, port))
    for extra in extras:
        part = normalize_origin(extra)
        if part:
            allowed.add(part)
    return allowed


def origin_allowed(
    origin: str,
    host_header: str,
    scheme: str,
    extras: list[str] | tuple[str, ...] = (),
) -> bool:
    got = normalize_origin(origin)
    if not got:
        return False
    return got in allowed_origin_parts(host_header, scheme, extras)


def within_ttl(created: float, now: float, ttl: int) -> bool:
    try:
        age = float(now) - float(created)
    except (TypeError, ValueError):
        return False
    return float(created) > 0 and 0 <= age <= ttl


def session_valid(created: float, now: float, ttl: int = SESSION_TTL_SEC) -> bool:
    return within_ttl(created, now, ttl)


def challenge_valid(created: float, now: float, ttl: int = CHALLENGE_TTL_SEC) -> bool:
    return within_ttl(created, now, ttl)


def prune_auth_tables(
    conn,
    now: float,
    session_ttl: int = SESSION_TTL_SEC,
    challenge_ttl: int = CHALLENGE_TTL_SEC,
) -> None:
    conn.execute("DELETE FROM sessions WHERE created < ?", (now - session_ttl,))
    conn.execute("DELETE FROM challenges WHERE created < ?", (now - challenge_ttl,))


def _row_field(row, key: str, index: int):
    if row is None:
        return None
    try:
        return row[key]
    except (KeyError, TypeError, IndexError):
        return row[index]


def take_challenge(
    conn,
    token: str,
    kinds: tuple[str, ...] | list[str],
    now: float,
    ttl: int = CHALLENGE_TTL_SEC,
) -> tuple[bytes, str] | None:
    if not token or not kinds:
        return None
    placeholders = ",".join("?" * len(kinds))
    row = conn.execute(
        f"SELECT token, kind, challenge, created FROM challenges WHERE token=? AND kind IN ({placeholders})",
        (token, *kinds),
    ).fetchone()
    conn.execute("DELETE FROM challenges WHERE token=?", (token,))
    if not row:
        return None
    created = _row_field(row, "created", 3)
    if not challenge_valid(created, now, ttl):
        return None
    challenge = _row_field(row, "challenge", 2)
    kind = _row_field(row, "kind", 1)
    if challenge is None or not kind:
        return None
    return challenge, str(kind)


def delete_all_sessions(conn) -> int:
    cur = conn.execute("DELETE FROM sessions")
    return int(cur.rowcount or 0)
