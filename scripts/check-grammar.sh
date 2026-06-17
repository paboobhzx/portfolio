#!/bin/bash
# Grammar verification via OpenAI GPT-4o
# Usage: OPENAI_API_KEY=sk-... ./scripts/check-grammar.sh
set -e
cd "$(dirname "$0")/.."
OPENAI_API_KEY="${OPENAI_API_KEY}" node scripts/check-grammar.mjs
