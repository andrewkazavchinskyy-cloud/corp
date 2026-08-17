#!/usr/bin/env bash
# corp#41: one-time (idempotent) root provisioning of the writing-agent OS
# identity. Run as root on the VPS after the control-plane `corp` user and
# workspace already exist. See docs/AGENT_ISOLATION.md for the full picture
# and the rollback path.
#
#   sudo bash deploy/provision-agent-identity.sh
#
set -euo pipefail

[ "$(id -u)" = 0 ] || { echo "run as root: sudo bash $0" >&2; exit 1; }

CONTROL_USER="${CORP_CONTROL_USER:-corp}"
AGENT_USER="${CORP_AGENT_USER:-corp-agent}"
AGENT_HOME="${CORP_AGENT_HOME:-/home/$AGENT_USER}"
WORKSPACE="${CORP_WORKSPACE:-/home/$CONTROL_USER/projects}"
WRITE_GROUP="${CORP_AGENT_WRITE_GROUP:-corp-write}"
WRAPPER_SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/corp-agent-exec"
WRAPPER_DST="/usr/local/sbin/corp-agent-exec"
SUDOERS_DST="/etc/sudoers.d/corp-agent-isolation"

id -u "$CONTROL_USER" >/dev/null 2>&1 || { echo "missing control-plane user: $CONTROL_USER" >&2; exit 1; }
[ -d "$WORKSPACE" ] || { echo "missing workspace: $WORKSPACE" >&2; exit 1; }
[ -f "$WRAPPER_SRC" ] || { echo "missing wrapper source: $WRAPPER_SRC" >&2; exit 1; }

if ! id -u "$AGENT_USER" >/dev/null 2>&1; then
  echo "creating user $AGENT_USER"
  useradd --create-home --home-dir "$AGENT_HOME" --shell /bin/bash "$AGENT_USER"
else
  echo "user $AGENT_USER already exists"
fi

if ! getent group "$WRITE_GROUP" >/dev/null 2>&1; then
  echo "creating group $WRITE_GROUP"
  groupadd "$WRITE_GROUP"
fi
usermod -a -G "$WRITE_GROUP" "$CONTROL_USER"
usermod -a -G "$WRITE_GROUP" "$AGENT_USER"

# Writing agents get write access to project worktrees only, via the shared
# group -- never ownership of, or membership implying access to,
# $CONTROL_USER's actual home (~/.config/corp secrets stay mode 0600, owned
# by $CONTROL_USER, unreadable to a different UID by construction).
echo "granting $WRITE_GROUP write access to $WORKSPACE"
chgrp -R "$WRITE_GROUP" "$WORKSPACE"
chmod -R g+rwX "$WORKSPACE"
find "$WORKSPACE" -type d -exec chmod g+s {} \;

mkdir -p "$AGENT_HOME/.local/bin" "$AGENT_HOME/.config/corp-agent"
touch "$AGENT_HOME/.config/corp-agent/env"
chmod 700 "$AGENT_HOME/.config/corp-agent"
chmod 600 "$AGENT_HOME/.config/corp-agent/env"
chown -R "$AGENT_USER:$AGENT_USER" "$AGENT_HOME"
cat >&2 <<EOF

Adapter credentials (e.g. CURSOR_API_KEY) go in:
  $AGENT_HOME/.config/corp-agent/env  (KEY=value per line, mode 600)
This file belongs to $AGENT_USER only. Never copy control-plane secrets into it.

The agent identity needs its own CLI logins, e.g. as $AGENT_USER:
  curl -fsSL https://claude.ai/install.sh | bash
  claude login   (repeat per adapter you enable)
EOF

install -o root -g root -m 0755 "$WRAPPER_SRC" "$WRAPPER_DST"
echo "installed wrapper: $WRAPPER_DST"

sudoers_line="$CONTROL_USER ALL=($AGENT_USER) NOPASSWD: $WRAPPER_DST"
echo "$sudoers_line" > "$SUDOERS_DST.tmp"
chmod 0440 "$SUDOERS_DST.tmp"
visudo -cf "$SUDOERS_DST.tmp" || { echo "sudoers syntax check failed" >&2; rm -f "$SUDOERS_DST.tmp"; exit 1; }
mv "$SUDOERS_DST.tmp" "$SUDOERS_DST"
echo "installed sudoers rule: $SUDOERS_DST"

cat >&2 <<EOF

Provisioning done. Next:
1. Log in as $AGENT_USER and install/authenticate the agent CLIs you need
   (see above). Only their own \$HOME/.local/bin binaries are runnable
   through the wrapper.
2. On the control-plane user ($CONTROL_USER), export in
   ~/.config/corp/env or the shell that runs the workshop service:
     CORP_AGENT_USER=$AGENT_USER
   (CORP_AGENT_HOME / CORP_AGENT_WRAPPER only needed if you overrode the
   defaults above.)
3. Run: bash deploy/agent-isolation-smoke.sh
4. corp doctor should show "agent identity (corp#41): ok".
EOF
