#!/usr/bin/env bash
# corp#41: run after deploy/provision-agent-identity.sh (as the control-plane
# user, e.g. `corp`) to confirm the boundary actually holds:
#   - the agent identity can write inside the project workspace
#   - the agent identity cannot read control-plane secrets by known path
# Never prints secret contents, only pass/fail.
set -euo pipefail

AGENT_USER="${CORP_AGENT_USER:-corp-agent}"
WORKSPACE="${CORP_WORKSPACE:-/home/corp/projects}"
CONFIG_DIR="${CORP_CONFIG_DIR:-$HOME/.config/corp}"

fail=0
pass() { echo "ok    $1"; }
bad()  { echo "FAIL  $1"; fail=1; }

command -v sudo >/dev/null || { echo "no sudo on this host" >&2; exit 1; }
if ! sudo -n -u "$AGENT_USER" true 2>/dev/null; then
  echo "FAIL  sudo -n -u $AGENT_USER not available -- run provision-agent-identity.sh first" >&2
  exit 1
fi

scratch="$WORKSPACE/.corp-agent-smoke-$$"
if sudo -n -u "$AGENT_USER" bash -c "mkdir -p '$scratch' && echo ok > '$scratch/f' && rm -rf '$scratch'"; then
  pass "agent identity can write inside $WORKSPACE"
else
  bad "agent identity cannot write inside $WORKSPACE"
fi

for secret in "$CONFIG_DIR/env" "$CONFIG_DIR/workshop.json" "$CONFIG_DIR/workshop.db" "$CONFIG_DIR/workshop-setup-token"; do
  if [ ! -e "$secret" ]; then
    echo "skip  $secret (not present)"
    continue
  fi
  if sudo -n -u "$AGENT_USER" test -r "$secret" 2>/dev/null; then
    bad "agent identity CAN read $secret"
  else
    pass "agent identity cannot read $secret"
  fi
done

if [ "$fail" = 0 ]; then
  echo "PASS: agent isolation boundary holds"
else
  echo "FAIL: agent isolation boundary is not intact" >&2
fi
exit "$fail"
