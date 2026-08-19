#!/usr/bin/env bash
# Cloud Agent start: bring up the Postgres daemon LifeBalance needs.
# Runs on every boot. Idempotent: a no-op if the cluster is already running.
set -euo pipefail

PGDATA="$HOME/.lifebalance/pgdata"
PGPORT=55432
PGBIN="$(ls -d /usr/lib/postgresql/*/bin | sort -V | tail -1)"

if "$PGBIN/pg_ctl" -D "$PGDATA" status >/dev/null 2>&1; then
  echo "Postgres already running on port $PGPORT"
else
  "$PGBIN/pg_ctl" -D "$PGDATA" \
    -o "-p $PGPORT -c listen_addresses=127.0.0.1 -k /tmp" \
    -l "$PGDATA/postgres.log" -w start
fi

# Readiness probe so dependent services start against a live database.
for _ in $(seq 1 30); do
  if "$PGBIN/pg_isready" -h 127.0.0.1 -p "$PGPORT" -q; then
    echo "Postgres ready on 127.0.0.1:$PGPORT"
    exit 0
  fi
  sleep 1
done

echo "Postgres did not become ready on port $PGPORT" >&2
exit 1
