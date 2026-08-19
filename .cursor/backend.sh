#!/usr/bin/env bash
# Cloud Agent terminal: run the LifeBalance NestJS API in watch mode.
set -euo pipefail

CORP_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKSPACE="$(dirname "$CORP_ROOT")"
PGBIN="$(ls -d /usr/lib/postgresql/*/bin | sort -V | tail -1)"

LB_ROOT=""
for cand in "$WORKSPACE/LifeBalance" /agent/repos/LifeBalance "$HOME/LifeBalance"; do
  if [ -d "$cand/.git" ]; then LB_ROOT="$cand"; break; fi
done
if [ -z "$LB_ROOT" ]; then
  echo "LifeBalance checkout not found" >&2
  exit 1
fi

# Wait for the database that start.sh brings up.
for _ in $(seq 1 60); do
  "$PGBIN/pg_isready" -h 127.0.0.1 -p 55432 -q && break
  sleep 1
done

cd "$LB_ROOT/backend"
exec npm run start:dev
