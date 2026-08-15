# Server

Work happens on the VPS. GitHub Issues is the board. Telegram is status.
Do not add Linear unless you want a second source of truth.

## Layout

- Corp repo: `/opt/corp`
- Project checkouts: `/root/projects`
- Secrets: `/root/.config/corp/env` (not in git)

```bash
ssh corp-vps
cd /opt/corp
./bin/corp doctor
./bin/corp cycle
./bin/corp run
```

## First login on the VPS

```bash
gh auth login -h github.com -p https -w
claude
codex
grok
```

Then:

```bash
cd /opt/corp
./bin/corp bootstrap
```

## Telegram

1. In Telegram open `@BotFather` → `/newbot` → name it, e.g. `corp-status`.
2. Put the token in `/root/.config/corp/env` as `TELEGRAM_BOT_TOKEN`.
3. Message the bot, then get your chat id (`@userinfobot` or `getUpdates`).
4. Set `TELEGRAM_CHAT_ID`.
5. Test: `./bin/corp notify 'corp is up'`

`./bin/corp run` sends start and finish messages for the current `ready` Issue.

## Board

https://github.com/andrewkazavchinskyy-cloud/corp/issues

Label `ready` to launch. That is the external task manager. GitHub Projects can sit on top later. Linear is optional and must stay a mirror.

## Agents

Install on the VPS (already attempted during bootstrap):

```bash
curl -fsSL https://claude.ai/install.sh | bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
curl -fsSL https://x.ai/cli/install.sh | bash
```

`CORP_AGENT` picks one. Empty means first installed of claude, codex, grok.
