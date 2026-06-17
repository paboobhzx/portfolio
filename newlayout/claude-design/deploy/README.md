# Portfolio redesign v2 — Aditya-inspired card grid

Card-grid filterable portfolio inspired by adityacprtm.dev/portfolio.

## Layout
- **Sidebar (left)**: profile photo placeholder, name, role, social icons, email, location, phone, CV link, "Open to Work" status pulse, languages, certs count
- **Top nav**: About / Portfolio / Resume / Certs / Contact + Search button + EN/PT/DE/ES + Light/Dark toggle
- **Title**: `Portfolio.` (Instrument Serif, accent-orange period)
- **Filter pills**: All 15 · 🚀 Projects 3 · 🏆 Certifications 5 · 💼 Experience 4 · 📦 Archive 3
- **Card grid**: 1 → 2 → 3 → 4 columns responsive

## Cards include
- 3 projects (SuperZAP, COSMOFIT, **SuperDoc**)
- 5 certifications (AWS SAA, DEA, AIF, CLF + Azure AZ-104)
- 4 experience entries (PRODEMGE, Digital Information AG, ENotas, Earlier)
- 3 archive repos (Kuiper, StarMan, Datalake)

## Theming
- Light + dark mode toggle (persisted)
- Theme color tokens via CSS custom properties
- All 4 languages (EN / PT / DE / ES) persisted

## Color palette (light mode)
- Background: `#FFFFFF`
- Elevated surface: `#FAFAFA`
- Sunk: `#F3F4F6`
- Border: `#E5E7EB`
- Border soft: `#F1F2F4`
- Text: `#0D0E12` (matches reference site's theme color)
- Text muted: `#6B7280`
- Accent: `#FF6B35` (warm signal orange)
- OK / status: `#16a34a`

## Color palette (dark mode)
- Background: `#0D0E12`
- Elevated: `#15171D`
- Border: `#25272F`
- Text: `#F5F5F7`

## Type system
- Display: **Instrument Serif** (italic — title "Portfolio.", monograms)
- Body / UI: **Plus Jakarta Sans** (400 / 500 / 600 / 700)
- Mono / labels / codes: **JetBrains Mono** (400 / 500)

## Deploy
Replace your existing `src/pages/index.html` with the one in this zip. Everything is inline — no Tailwind build dependency.

## Notes
- Project deep-dive pages (`project-map-*.html`) NOT updated yet — they still use old theme. Ask in follow-up if you want them ported.
- Avatar placeholder shows an "P" italic monogram. Replace the `.avatar` div with an `<img>` to use a real photo.
- "Verify" links on cert cards are placeholders — wire up your real credly/aws verify URLs.
- CV "Download" link is a placeholder — point at your real PDF.
- CMS-ready: cards have a clear repeating structure with `data-cat` attributes; easy to drive from any headless CMS.
