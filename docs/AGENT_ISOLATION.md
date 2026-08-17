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

- **Isolated** (`CORP_AGENT_USER` set and the wrapper file present): the
  command runs as the agent identity through the fixed root-owned wrapper
  (`corp-agent-exec`), with a strict env allowlist and a forced separate
  `$HOME`. This is the real boundary. The hop is always
  `sudo -n -u $CORP_AGENT_USER /usr/local/sbin/corp-agent-exec …` — never
  `sudo -n -u $CORP_AGENT_USER true`. Sudoers only allows the wrapper;
  `true` either fails (as `corp`) or falsely succeeds (as root).
- **Transitional** (default, `CORP_AGENT_USER` unset): the command still
  runs as the control-plane user, but `TELEGRAM_BOT_TOKEN` /
  `TELEGRAM_CHAT_ID` are stripped from its env (`env -i` plus an
  allowlist-by-subtraction). This closes the env-vector leak immediately
  but **does not** stop the agent from reading `~/.config/corp/*` by
  absolute path -- that requires arming isolated mode below.

`probe_isolation()` / `corp doctor` report three states honestly:

| Mode | Meaning |
| --- | --- |
| `transitional` | Flag off. Writers share the control-plane UID. May still be missing wrapper, workspace perms, or CLIs. |
| `ready-to-arm` | Wrapper `--probe` passes, workspace is traversable and not world-readable, secrets denied, `claude` or `agent` exists under the agent UID. Flag still off. |
| `isolated` | Flag on **and** the probe is complete. Doctor `ok` only here. |

Do not set `CORP_AGENT_USER` until doctor says `ready-to-arm`. A provisioned
UID with an empty `~/.local/bin` is still `transitional`. Doctor does not
flip the flag or provision.

## Provisioning (root, once per VPS)

```bash
cd /opt/corp   # control-plane checkout
sudo bash deploy/provision-agent-identity.sh
```

This is idempotent. It:

1. Creates the `corp-agent` user and a shared `corp-write` group; adds
   both `corp` and `corp-agent` to it.
2. Makes the control-plane home traversable (`chmod o+x` on `/home/corp`)
   so `corp-agent` can reach `CORP_WORKSPACE`, then group-enables write
   access to that workspace only (`chgrp -R`, `g+rwX`, `g+s`, **`o-rwx`**
   so it is not world-readable). Tightens `~/.config` and `~/.config/corp`
   to `0700` without opening them to the agent UID. Never grants
   `corp-agent` a path into secrets.
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

Do **not** add `CORP_AGENT_USER` yet. Remaining blocker after a typical
provision: the agent UID has no CLI binaries or logins
(`/home/corp-agent/.local/bin` is empty). Arming the flag before that
breaks writers and does not close secrets.

When `corp doctor` reports `ready-to-arm`, add to `~/.config/corp/env`:

```
CORP_AGENT_USER=corp-agent
```

Restart the workshop service so it picks up the new env, then verify:

```bash
bash deploy/agent-isolation-smoke.sh
corp doctor   # isolation: isolated — "ok  agent identity isolated"
```

## Smoke check

`deploy/agent-isolation-smoke.sh` runs one hop as the control-plane user:

```bash
sudo -n -u corp-agent /usr/local/sbin/corp-agent-exec --probe
```

The wrapper itself asserts: workspace writable, workspace not
world-readable, `~/.config/corp` not open, known secret files unreadable.
It never prints secret contents. It never uses `sudo -n -u corp-agent true`.

## Remaining blockers (do not arm)

On the live VPS after #41 provision and before this card's provision
re-run:

- `/home/corp` is `750` — `corp-agent` is not in group `corp`, so it
  cannot traverse to `/home/corp/projects`. Re-run provision (`o+x` on
  the home, `0700` on `~/.config` / `~/.config/corp`).
- `/home/corp/projects` is `2775` (world-readable). Provision sets `2750`.
- `/home/corp-agent/.local/bin` is empty. Install and log in `claude` /
  `agent` (and any other adapter) **as corp-agent**. Doctor stays
  `transitional` until those binaries exist.
- `CORP_AGENT_USER` must stay unset until doctor says `ready-to-arm`.

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
