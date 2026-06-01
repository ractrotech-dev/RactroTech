#!/usr/bin/env bash
# Scan tracked source for accidental secret commits. Run: npm run security:check-secrets
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

PATTERNS=(
  'sk_live_[a-zA-Z0-9]+'
  'sk_test_[a-zA-Z0-9]+'
  'SUPABASE_SERVICE_ROLE_KEY\s*=\s*[^x\n]'
  'service_role\.[a-zA-Z0-9_-]{20,}'
  'BEGIN (RSA |OPENSSH )?PRIVATE KEY'
  'postgresql://[^:]+:[^@]+@'
  'GITHUB_OAUTH_CLIENT_SECRET\s*=\s*[^x\n]'
  'GOOGLE_OAUTH_CLIENT_SECRET\s*=\s*[^x\n]'
  'STRIPE_SECRET_KEY\s*=\s*sk_'
)

EXCLUDES=(
  '--glob' '!.env.example'
  '--glob' '!**/*.md'
  '--glob' '!scripts/security/check-secrets.sh'
  '--glob' '!.agents/**'
)

FOUND=0

for pattern in "${PATTERNS[@]}"; do
  if rg -n "${EXCLUDES[@]}" "$pattern" . 2>/dev/null; then
    FOUND=1
  fi
done

# Fail if server-only env names appear with NEXT_PUBLIC_ prefix
if rg -n 'NEXT_PUBLIC_(STRIPE_SECRET|SUPABASE_SERVICE|DATABASE_URL|DIRECT_URL|RESEND_API)' . "${EXCLUDES[@]}" 2>/dev/null; then
  echo "ERROR: Server secret exposed via NEXT_PUBLIC_ prefix."
  FOUND=1
fi

if [[ "$FOUND" -eq 1 ]]; then
  echo ""
  echo "Secret scan failed. Remove credentials from source; use environment variables only."
  exit 1
fi

echo "Secret scan passed."
