#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

npx prisma migrate deploy --schema=prisma/schema.prisma
exec node main.js
