# Agent isolation (corp#41)

Writing agents (`--dangerously-skip-permissions` and equivalents) used to
run as the same OS user as the workshop control plane, inheriting its
environment and full filesystem access -- including Telegram token,
`workshop.json`, `workshop.db`, and session state, all readable by known
absolute path. This doc is the fix and the runbook for it.

## Model

- **Control plane**: the existing `corp` OS user. Runs the workshop
  service, holds `~/.config/corp/{env,workshop.json,workshop.db,...}`.
  Unchanged.
- **Agent identity**: a separate, unprivileged OS user (`corp-agent` by
  default) that writing-agent CLI processes actually run as. Its own
  `$HOME`, its own CLI logins (`claude login` etc.), its own adapter
  credentials. It can write inside `CORP_WORKSPACE` (project checkouts)
  and nothing else the control plane cares about.
- A UID boundary is what makes secrets unreadable, not a `$HOME` change --
  same-UID processes always get owner permissions regardless of env vars.
  See corp#41 for why a prompt-level or `$HOME`-only boundary does not count.

## Two modes in `bin/corp`

`launch_agent()` always routes the agent CLI invocation through
`wrap_isolated()`:

- **Isolated** (`CORP_AGENT_USER` set, wrapper installed, `sudo -n -u
  $CORP_AGENT_USER true` succeeds): the command runs as the agent identity
  through the fixed root-owned wrapper (`corp-agent-exec`), with a strict
  env allowlist and a forced separate `$HOME`. This is the real boundary.
- **Transitional** (default, nothing provisioned yet): the command still
  runs as the control-plane user, but `TELEGRAM_BOT_TOKEN` /
  `TELEGRAM_CHAT_ID` are stripped from its env (`env -i` plus an
  allowlist-by-subtraction). This closes the env-vector leak immediately
  but **does not** stop the agent from reading `~/.config/corp/*` by
  absolute path -- that requires provisioning the isolated mode below.

`corp doctor` reports which mode is active.

## Provisioning (root, once per VPS)

```bash
cd /opt/corp   # control-plane checkout
sudo bash deploy/provision-agent-identity.sh
```

This is idempotent. It:

1. Creates the `corp-agent` user and a shared `corp-write` group; adds
   both `corp` and `corp-agent` to it.
2. Group-enables write access to `CORP_WORKSPACE` only (`chgrp -R`,
   `chmod g+rwX`, `g+s` on directories so new files inherit the group).
   Never touches `~/.config/corp` -- that stays mode 0600/0700, owned by
   `corp`, and is therefore already unreadable to `corp-agent` by
   construction; no extra denial rule needed.
3. Creates `corp-agent`'s adapter credential file at
   `/home/corp-agent/.config/corp-agent/env` (mode 600, owned by
   `corp-agent`) for things like `CURSOR_API_KEY`. Never copy
   control-plane secrets into it.
4. Installs `deploy/corp-agent-exec` to `/usr/local/sbin/corp-agent-exec`,
   root-owned, mode 0755 -- **outside** any agent-writable repo, because
   `/opt/corp` itself is writable by `corp` (writing agents edit it when
   the target project is `corp`) and a root-owned wrapper is the thing
   that makes the sudoers rule below safe from an agent editing its way to
   a wider grant.
5. Installs a narrow sudoers drop-in:
   `corp ALL=(corp-agent) NOPASSWD: /usr/local/sbin/corp-agent-exec`.
   The wrapper itself (not sudoers) validates the destination directory
   (must be under `CORP_WORKSPACE`) and the binary (must be one of the
   agent identity's own installed CLIs) before exec'ing anything.

Then, by hand, as `corp-agent`:

```bash
sudo -u corp-agent -H bash
curl -fsSL https://claude.ai/install.sh | bash
claude login   # and/or codex, grok, cursor's `agent` login
```

And on the control-plane side, add to `~/.config/corp/env`:

```
CORP_AGENT_USER=corp-agent
```

Restart the workshop service so it picks up the new env, then verify:

```bash
bash deploy/agent-isolation-smoke.sh
corp doctor   # "agent identity (corp#41): ok"
```

## Smoke check

`deploy/agent-isolation-smoke.sh` asserts, as the control-plane user:

- the agent identity **can** write inside `CORP_WORKSPACE`
- the agent identity **cannot** read `~/.config/corp/{env,workshop.json,
  workshop.db,workshop-setup-token}`

It never prints secret contents, only pass/fail per path.

## Rollback

Isolation is opt-in via `CORP_AGENT_USER`. Unset it (or remove the line
from `~/.config/corp/env`) and restart the workshop service to fall back
to transitional mode immediately -- no data to migrate back, since agent
identity state (`$HOME`, CLI logins, adapter env) is entirely separate
from control-plane state. To fully remove the identity: `userdel -r
corp-agent`, `groupdel corp-write` (after `chgrp` back if desired), delete
`/etc/sudoers.d/corp-agent-isolation` and `/usr/local/sbin/corp-agent-exec`.

## Risk / staged rollout

Before relying on this in production, inventory which adapter credentials
the agent identity actually needs (today: `CURSOR_API_KEY` only, and only
if Cursor CLI is used) -- do not copy every control-plane credential into
the new profile. Do not commit real credential values anywhere, including
GitHub issues.
