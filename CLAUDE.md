# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static multi-page portfolio site (vanilla HTML + Tailwind CSS) deployed to AWS Amplify via Terraform. Domain: `pablobhz.cloud` with Cloudflare DNS.

## Commands

```bash
# Build static site (cleans dist/, copies HTML+JS, compiles Tailwind)
npm run build

# Preview locally on port 4173 (must build first)
npm run dev:preview

# Terraform (from infra/terraform/environments/prod/)
export TF_VAR_github_token='...'
terraform init
terraform plan -var 'github_repository=https://github.com/paboobhzx/pablobhz-portfolio' -var 'domain_name=pablobhz.cloud'
terraform apply
```

## Architecture

**No framework** — plain HTML pages + Tailwind CSS + vanilla JS (ES modules). No React, no bundler, no SSR.

### Build Pipeline

`scripts/build.mjs` (Node.js ESM):
1. Removes `dist/`
2. Copies `src/pages/*.html` → `dist/`
3. Copies `src/assets/` → `dist/assets/`
4. Runs Tailwind CLI to produce `dist/assets/styles.css` (minified)

`scripts/serve-dist.mjs` — simple HTTP server for `dist/` with MIME handling.

### i18n System

Custom runtime in `src/assets/i18n.js`. Each HTML page embeds its own translation dictionary as `window.__I18N__` with `en` and `pt` keys.

- `data-i18n="key"` → sets `textContent`
- `data-i18n-html="key"` → sets `innerHTML`
- Language persisted in `localStorage` key `pablobhz_lang`
- Toggle via `.lang-btn[data-lang="en|pt"]` buttons

### Infrastructure (Terraform)

- **Module:** `infra/terraform/modules/amplify-static-site/` — creates Amplify app, branch, and domain association
- **Environment:** `infra/terraform/environments/prod/` — instantiates the module
- GitHub PAT stored in Terraform state (sensitive) — state must never be committed
- Amplify build spec in `amplify.yml` at repo root

### Deployment Flow

`git push main` → Amplify auto-builds → `npm ci && npm run build` → serves `dist/` via CloudFront. DNS via Cloudflare CNAME flattening.

## Design System

Defined in `stitch_portf_lio_t_cnico_premium/architectural_logic/DESIGN.md`. Key rules:
- Dark editorial aesthetic with tonal layering (no 1px solid borders, use background color shifts)
- Glassmorphism: 60% opacity + 12px blur for floating elements
- Tech badges use `rounded-sm` (microchip aesthetic), never pill-shaped
- Custom Tailwind palette: `ink-*` (backgrounds), `slatey-*` (text), `accent-*` (cyan/teal highlights)

## Conventions

- Multi-page static site: each page is a standalone HTML file in `src/pages/`
- No SPA rewrites — if adding a new page at `/foo`, create `src/pages/foo.html` (build copies it to `dist/foo.html`)
- Translations are inline per page (not a shared JSON file) — when editing text, update both `en` and `pt` in `window.__I18N__`
- Tailwind content paths scan `src/pages/**/*.html` and `src/assets/**/*.js`
