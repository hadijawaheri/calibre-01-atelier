#!/usr/bin/env bash
# Run on the server from the repo root. Stops before the PM2 reload if install or build fails.
# Note: `next build` rewrites .next while the old web process is still running; keep deploys short and off-peak.
set -euo pipefail

git pull --ff-only
corepack enable
pnpm install --frozen-lockfile
# INTERNAL_API_URL is baked into the Next rewrites at build time
INTERNAL_API_URL="http://127.0.0.1:7781" pnpm build
# Production boots with autoIndex off; indexes and schema changes come from versioned migrations
pnpm --filter @kronos/api migrate
pm2 startOrReload infra/ecosystem.config.cjs --update-env
pm2 save
