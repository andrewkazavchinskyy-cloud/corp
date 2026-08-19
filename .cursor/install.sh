#!/usr/bin/env bash
# Cloud Agent install: prepare the corp harness and the LifeBalance backend.
# Idempotent. Runs after checkout; on build-backed environments it produces the
# baseline snapshot, so all durable, source-derived state is created here.
set -euo pipefail

CORP_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKSPACE="$(dirname "$CORP_ROOT")"
LB_ROOT="$WORKSPACE/LifeBalance"
PGDATA="$HOME/.lifebalance/pgdata"
PGPORT=55432

log() { printf '\n=== %s ===\n' "$1"; }

log "System packages (postgres)"
if ! ls /usr/lib/postgresql/*/bin/initdb >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y postgresql postgresql-contrib
fi
PGBIN="$(ls -d /usr/lib/postgresql/*/bin | sort -V | tail -1)"
echo "postgres bin: $PGBIN"

log "corp tooling (uv + graphify)"
export PATH="$HOME/.local/bin:$PATH"
if ! command -v uv >/dev/null 2>&1; then
  curl -LsSf https://astral.sh/uv/install.sh | sh
fi
if ! command -v graphify >/dev/null 2>&1; then
  "$HOME/.local/bin/uv" tool install graphifyy
fi

log "Ensure LifeBalance repository is present"
if [ ! -d "$LB_ROOT/.git" ]; then
  gh repo clone andrewkazavchinskyy-cloud/LifeBalance "$LB_ROOT"
fi

log "LifeBalance backend dependencies"
cd "$LB_ROOT/backend"
npm ci

log "Backend .env (dev placeholders; real secrets injected via Cursor Secrets)"
if [ ! -f .env ]; then
  cat > .env <<'ENVEOF'
NODE_ENV=development
PORT=3000
APP_BASE_URL=http://localhost:3000
CORS_ALLOWED_ORIGINS=http://localhost:3000
DATABASE_URL=postgresql://lifebalance:lifebalance@127.0.0.1:55432/lifebalance?schema=public
SUPABASE_URL=https://example.supabase.co
SUPABASE_JWKS_URL=https://example.supabase.co/auth/v1/.well-known/jwks.json
SUPABASE_JWT_AUDIENCE=authenticated
SUPABASE_SERVICE_ROLE_KEY=dev-service-role-key-placeholder-0000000000
OPENROUTER_API_KEY=dev-openrouter-api-key-placeholder-0000000000
OPENROUTER_MODEL=anthropic/claude-sonnet-4.6
OPENROUTER_TIMEOUT_MS=30000
ENVEOF
fi

log "Prisma client"
npx prisma generate

log "Postgres cluster ($PGDATA on port $PGPORT)"
if [ ! -f "$PGDATA/PG_VERSION" ]; then
  mkdir -p "$PGDATA"
  "$PGBIN/initdb" -D "$PGDATA" -U postgres \
    --auth-local=trust --auth-host=scram-sha-256 -E UTF8
fi

# Start the cluster just long enough to provision the role/db and apply
# migrations + seed, so all schema is baked into the snapshot. Then stop it;
# per-boot startup is handled by start.sh.
if ! "$PGBIN/pg_ctl" -D "$PGDATA" status >/dev/null 2>&1; then
  "$PGBIN/pg_ctl" -D "$PGDATA" \
    -o "-p $PGPORT -c listen_addresses=127.0.0.1 -k /tmp" \
    -l "$PGDATA/postgres.log" -w start
fi

export PGHOST=/tmp PGPORT="$PGPORT"
"$PGBIN/psql" -U postgres -d postgres -v ON_ERROR_STOP=1 <<'SQL'
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='lifebalance') THEN
    CREATE ROLE lifebalance LOGIN PASSWORD 'lifebalance';
  END IF;
END $$;
SQL
if ! "$PGBIN/psql" -U postgres -d postgres -tAc \
  "SELECT 1 FROM pg_database WHERE datname='lifebalance'" | grep -q 1; then
  "$PGBIN/psql" -U postgres -d postgres -c \
    "CREATE DATABASE lifebalance OWNER lifebalance"
fi

log "Apply migrations + seed"
cd "$LB_ROOT/backend"
npx prisma migrate deploy
npm run prisma:seed

log "Stop provisioning cluster"
"$PGBIN/pg_ctl" -D "$PGDATA" -m fast stop || true

log "Install complete"
