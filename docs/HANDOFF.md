# Handoff — first hour

How a second human (or a new machine) reaches a working workshop without
being mailed secrets. Pair with [`SERVER.md`](../SERVER.md) and
[`docs/SPEC.md`](SPEC.md).

Do not put tokens, cookies, SSH private keys, or `.env` in this file or
in git.

## 1. Tailscale

Host (do not rename; Passkeys bind to this name):

`https://vmi3510874.tailad6484.ts.net`

You must be on the same tailnet. There is no public URL. Do not enable
Funnel.

## 2. Passkey

Two different paths. They are not interchangeable.

| Path | When | Sessions |
| ---- | ---- | -------- |
| **Настройки → add Passkey** | You are already logged in on a device | Adds a key. Does **not** kick other sessions. |
| **`corp workshop-token` then enroll on the gate** | Lost phone, new device, no live session | Recover-token enroll **revokes every session**. Existing Passkeys stay. |

Logout ends this session only. **Выйти везде** revokes every session,
same as recover-token enroll.

Sessions last 7 days. WebAuthn challenges last 5 minutes.

First device on a wiped browser: SSH in, run `corp workshop-token`, open
the hostname, register the Passkey the gate offers. Do not paste the
token into chat, git, or Telegram.

## 3. SSH

`ssh corp-vps` lands as **root**, using the **local machine key** already
on the operator's laptop (ControlMaster is fine). Then become `corp` for
day-to-day CLI:

```bash
ssh corp-vps
corp doctor
```

`/usr/local/bin/corp` is a wrapper: if you are root it `sudo -u corp`
into `/opt/corp/bin/corp`. Do not copy keys onto the VPS from a chat.

Never `git reset --hard`. Never enable the agent-isolation flag unless
the operator asked (`CORP_AGENT_USER` — see
[`docs/AGENT_ISOLATION.md`](AGENT_ISOLATION.md)).

## 4. Two trees

The VPS has two corp checkouts. Mixing them is how live workshop and
writers fight.

| Tree | Owner | Role |
| ---- | ----- | ---- |
| `/opt/corp` | workshop unit | Live code. `uvicorn` `WorkingDirectory=/opt/corp/workshop`. `/usr/local/bin/corp` execs `/opt/corp/bin/corp`. |
| `/home/corp/projects/corp` | writers | Agent checkout (`CORP_WORKSPACE=/home/corp/projects`). Pins clone here. |

Secrets stay in `/home/corp/.config/corp/` (`env`, `workshop.json`,
`workshop.db`) — not in either tree.

Writers commit and push from `/home/corp/projects/corp` (or a Mac
worktree). Live deploy is **additive** onto `/opt/corp` only:

```bash
# on the VPS, after origin/main has the commit
git -C /opt/corp fetch origin
git -C /opt/corp merge --ff-only origin/main
systemctl restart workshop
systemctl status workshop --no-pager
```

If `/opt/corp` has local root-owned edits, stop and keep them. Do not
discard. Do not deploy by copying a dirty writer tree over `/opt/corp`.

Mac / iCloud clones are a third place. The VPS must never write iCloud.

## 5. First job = sandbox, not P0

`corp queue e2e` on a laptop is a **fixture**. It does not file a GitHub
Issue, does not set `queue_running`, and is not this checklist.

Live checklist, **once**, on a disposable sandbox Issue (not a live P0,
not `self`, not `blocked`):

1. Open `https://vmi3510874.tailad6484.ts.net` with a Passkey.
2. Автоном: propose a throwaway draft (not GitHub yet).
3. Approve that draft only.
4. Queue + start **that** sandbox card.
5. Confirm the writer is in `/home/corp/projects/<pin>`, not `/opt/corp`,
   unless the pin *is* corp — then it is the writers tree
   `/home/corp/projects/corp`.
6. QA the result. Build/design must not close the card.
7. Optional failure drill (sandbox only): kill that pin's tmux → see
   retry → Rollback. Never point this at a live P0.

Need-human only for GitHub/auth/`self`/CLI. Pause Автоном if anything
looks aimed at a real P0.

## If you are stuck

- Board empty / English 503: GitHub GraphQL flakes; wait or use REST.
  Do not «fix» by rewriting history.
- Cannot add a Passkey on a new phone: you need a session or a recover
  token. Recover token kicks everyone else — warn them.
- `corp` command as root works; as `corp` it should too via the same
  wrapper path.
- Isolation smoke and `CORP_AGENT_USER` are out of scope for first hour.
