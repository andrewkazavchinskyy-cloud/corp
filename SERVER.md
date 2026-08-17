# Server

Work happens in two places. GitHub Issues is the board. Telegram is status.
The workshop is the phone/desktop remote. Do not add Linear.

First hour for a second human: [`docs/HANDOFF.md`](docs/HANDOFF.md).
Product north star: [`docs/SPEC.md`](docs/SPEC.md).

## Who does what

- **Mac mini:** you, Cursor, Codex, Claude, Grok CLI, Grok Build in the browser.
  Claim with `corp take` or the workshop button **Я сам**.
- **VPS:** unattended Claude / Codex / Grok / Cursor CLI. One-shot from the
  board or the **Автоном** queue (one project at a time, different projects
  in parallel, max 3).
- **GitHub:** source of truth. Labels are columns. The workshop does not
  store the backlog.

SSH to the VPS is **root** via the local machine key (`ssh corp-vps`).
`/usr/local/bin/corp` then `sudo -u corp` into the live tree. Do not put
keys or tokens in git.

## Two trees

Do not treat these as one checkout.

| Path | Process | Who writes |
| ---- | ------- | ---------- |
| `/opt/corp` | `uvicorn` (workshop unit, cwd `/opt/corp/workshop`) and `/usr/local/bin/corp` → `/opt/corp/bin/corp` | Operator, additive deploy only |
| `/home/corp/projects/<name>` | Writing agents (`CORP_WORKSPACE`) | VPS runners. Corp pin = `/home/corp/projects/corp` |

```bash
ssh corp-vps
corp doctor
corp cycle
corp take --issue owner/repo#n
corp run --issue owner/repo#n --agent claude
```

Secrets: `/home/corp/.config/corp/env`, `workshop.json`, `workshop.db`.
Workshop bind: `127.0.0.1:8787`, user `corp`.

### Deploy live additively

Writers push from `/home/corp/projects/corp` (or a Mac worktree) to
`origin`. Then fast-forward `/opt/corp` and restart. Never
`reset --hard`. Never copy a dirty tree over live.

```bash
git -C /opt/corp fetch origin
git -C /opt/corp merge --ff-only origin/main
systemctl restart workshop
```

If `/opt/corp` has local edits, stop and keep them.

## Workshop

HTTPS is Tailscale Serve only (no Funnel):

`https://vmi3510874.tailad6484.ts.net`

Do not rename that machine: Passkeys bind to the hostname.

```bash
sudo systemctl status workshop
corp workshop-token
```

The unit PATH must include `/home/corp/.local/bin` so Claude/Codex/Grok/`agent`
are visible. If `registry.json` is not writable by `corp`, pins and new
repos persist in `~/.config/corp/workshop.json`.

**Passkey:** add another key in Настройки while logged in — other
sessions stay. Recover-token enroll (`corp workshop-token` on the gate)
revokes every session. Lost phone: recover token, then register a new
key. Existing keys stay. Autopilot, console, and settings sit behind the
same login.

First live Автоном job is a **sandbox** card, not a P0. See
[`docs/HANDOFF.md`](docs/HANDOFF.md).

## Telegram

1. In Telegram open `@BotFather` → `/newbot`.
2. Put the token in `/home/corp/.config/corp/env` as `TELEGRAM_BOT_TOKEN`.
3. Set `TELEGRAM_CHAT_ID`.
4. Test: `corp notify 'corp is up'`

`corp run` sends start and finish messages.

## Agents

```bash
curl -fsSL https://claude.ai/install.sh | bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
curl -fsSL https://x.ai/cli/install.sh | bash
```

Cursor CLI is optional (`agent`). Put `CURSOR_API_KEY` in env if you launch
it from the workshop. Profiles (model, effort, fast) live in workshop
settings, not in git.

Writing agents run under a separate unprivileged OS identity once
provisioned (`corp-agent`), so a same-UID read of control-plane secrets by
known path is not possible. Until provisioned they still run as `corp`
with Telegram credentials stripped from their env only. See
[`docs/AGENT_ISOLATION.md`](docs/AGENT_ISOLATION.md). Do not flip
`CORP_AGENT_USER` during a first-hour handoff.
