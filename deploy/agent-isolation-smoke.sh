#!/usr/bin/env bash
# corp#41 / corp#60: run after deploy/provision-agent-identity.sh (as the
# control-plane user, e.g. `corp`) to confirm the boundary actually holds.
# The only sudo hop is the root-owned wrapper --probe. Never
# `sudo -n -u $AGENT_USER true` (or bash/test): sudoers does not allow them,
# and as root they falsely succeed.
# Never prints secret contents, only pass/fail.
set -euo pipefail

AGENT_USER="${CORP_AGENT_USER:-corp-agent}"
WRAPPER="${CORP_AGENT_WRAPPER:-/usr/local/sbin/corp-agent-exec}"

fail=0
pass() { echo "ok    $1"; }
bad()  { echo "FAIL  $1"; fail=1; }

command -v sudo >/dev/null || { echo "no sudo on this host" >&2; exit 1; }
[ -x "$WRAPPER" ] || { echo "FAIL  wrapper missing: $WRAPPER" >&2; exit 1; }

if sudo -n -u "$AGENT_USER" "$WRAPPER" --probe; then
  pass "wrapper --probe (workspace writable, not world-readable, secrets denied)"
else
  bad "wrapper --probe failed — isolated mode cannot engage"
fi

if [ "$fail" = 0 ]; then
  echo "PASS: agent isolation boundary holds"
else
  echo "FAIL: agent isolation boundary is not intact" >&2
fi
exit "$fail"
