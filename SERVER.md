# Server

Work happens in two places. GitHub Issues is the board. Telegram is status.
The workshop is the phone/desktop remote. Do not add Linear.

## Who does what

- **Mac mini:** you, Cursor, Codex, Claude, Grok CLI, Grok Build in the browser.
  Claim with `corp take` or the workshop button **Я сам**.
- **VPS:** unattended Claude / Codex / Grok / Cursor CLI. One-shot from the
  board or the **Автоном** queue (one project at a time, different projects
  in parallel, max 3).
- **GitHub:** source of truth. Labels are columns. The workshop does not
  store the backlog.

## Layout

- Corp repo: `/opt/corp`
- Project checkouts: `/home/corp/projects`
- Secrets: `/home/corp/.config/corp/env`, `workshop.json`, `workshop.db`
- Workshop: `127.0.0.1:8787`, user `corp`
- HTTPS: `tailscale serve` on `https://<machine>.<tailnet>.ts.net` (no Funnel)

```bash
ssh corp-vps
corp doctor
corp cycle
corp take --issue owner/repo#n
corp run --issue owner/repo#n --agent claude
```

## Workshop

```bash
sudo systemctl status workshop
corp workshop-token
```

The unit PATH must include `/home/corp/.local/bin` so Claude/Codex/Grok/`agent`
are visible. If `registry.json` is not writable by `corp`, pins and new
repos persist in `~/.config/corp/workshop.json`.

Open the Tailscale hostname, register the first Passkey with the token,
then use the board. Lost phone: run `corp workshop-token` again and
register a new key on the gate. Autopilot, console, and settings sit
behind the same login.

Do not rename the Tailscale machine: Passkeys bind to that hostname.

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
