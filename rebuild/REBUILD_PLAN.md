# PORTFOLIO REBUILD — MULTI-PAGE ROUTING + CENTERED SHELL

## Goal

Rebuild the portfolio so it satisfies three requirements that the previous
attempt failed to meet:

1. **Real multi-page routing**, not SPA view-toggling.
   Each section is its own URL: `/en/about`, `/en/resume`, `/en/portfolio`,
   `/en/contact` (and the same under `/pt/`). Browser back/forward, hard
   reload, and shareable links must all work.

2. **Centered shell on desktop**, not edge-glued sidebar.
   The whole layout (sidebar-card + main-column) is wrapped in a single
   container that is `max-width: 1200px; margin: 0 auto`. On wide monitors,
   the empty space lives **outside** the shell, not between the sidebar and
   the screen edge. The sidebar is a **card** sitting next to the main
   column, both inside the centered container.

3. **No duplicated identity blocks.**
   Sidebar shows: name (small), role (mono), nav, EN/PT toggle, Dark/Light
   toggle. Banner shows: avatar, name (large), role, social link buttons,
   and the meta column (EMAIL / LOCATION / STATUS). The two never repeat
   the same field.

## Stack

- React 18 + Vite (already in the repo)
- `react-router-dom` 6.30 (already installed) — uses `<BrowserRouter>`,
  `<Routes>`, `<Route>`, `<NavLink>`, `<Outlet>`, `useParams`,
  `useNavigate`, `useLocation`
- No new dependencies required

## File operations

### CREATE / OVERWRITE

```
src/App.jsx                       # routes (lang + section)
src/main.jsx                      # wraps App in <BrowserRouter>
src/data/content.js               # all EN + PT copy, single source
src/lib/prefs.js                  # useLang + useTheme hooks (URL-driven lang)
src/components/Layout.jsx         # shared shell: sidebar-card + banner + <Outlet/>
src/pages/AboutPage.jsx           # /:lang/about
src/pages/ResumePage.jsx          # /:lang/resume
src/pages/PortfolioPage.jsx       # /:lang/portfolio  (replaces old monolith)
src/pages/ContactPage.jsx         # /:lang/contact
src/styles/global.css             # full rewrite — centered shell layout
index.html                        # remove old font imports
```

### DELETE

```
# The old monolithic PortfolioPage.jsx (lines 788–1717 of front_dump.txt)
# is replaced by the four new page files above. Once the new files compile,
# the old activeView/sectionToggle code is gone with the file.
```

### KEEP UNTOUCHED

```
src/cms/                          # CMS scaffolding (future phase)
src/pages/AdminPage.jsx           # admin UI
src/components/BlockRenderer.jsx
src/components/Sidebar.jsx        # legacy, only referenced by AdminPage if any
src/assets/                       # all certification PNGs, project covers
infra/terraform/modules/cms-core/ # untouched
```

## Routing model

```
/                          → redirect to /<detected-lang>/about
/:lang                     → redirect to /:lang/about
/:lang/about               → AboutPage
/:lang/resume              → ResumePage
/:lang/portfolio           → PortfolioPage
/:lang/contact             → ContactPage
/admin                     → AdminPage (unchanged)
*                          → redirect to /<detected-lang>/about
```

`<detected-lang>` priority:
1. `localStorage.lang` if `'en'` or `'pt'`
2. `navigator.language` startsWith `'pt'` → `'pt'`
3. fallback `'en'`

Language switch via the EN/PT toggle calls `navigate()` to swap the first
URL segment while keeping the second (section). Example: on
`/en/resume`, clicking PT goes to `/pt/resume`. This is implemented in
`src/lib/prefs.js → useLang().setLang`.

The Layout component reads `:lang` with `useParams()`, validates it
against `SUPPORTED_LANGS = ['en', 'pt']`, and exposes it to children via
the same `useLang` hook. Each page re-reads `lang` from the hook — no
prop drilling.

## Layout structure (single source of truth)

```
<div class="page-shell">                       /* full-viewport flex center */
  <div class="layout-wrap">                    /* max-width 1200, grid 280 + 1fr */
    <aside class="sidebar-card">               /* card, NOT edge-glued */
      <div class="sidebar-head">Pablo Costa · Senior Engineer</div>
      <nav class="side-nav"> NavLink × 4 </nav>
      <div class="sidebar-controls">
        <div class="toggle-group">EN | PT</div>
        <div class="toggle-group">Dark | Light</div>
      </div>
    </aside>
    <div class="main-column">
      <header class="profile-banner">
        avatar + name + role + social links | EMAIL / LOCATION / STATUS
      </header>
      <div class="route-nav">                  /* horizontal nav above content */
        pills + toggles (visible on desktop, takes over from sidebar on mobile)
      </div>
      <section class="view-panel" key={pathname}>
        <Outlet />                             /* current page mounts here */
      </section>
    </div>
  </div>
</div>
```

Why the route-nav row exists alongside the sidebar nav: on small screens
the sidebar collapses and hides `.side-nav` + `.sidebar-controls`, and the
route-nav row becomes the only way to navigate. This avoids a hamburger
menu and keeps the navigation visible at all times.

## CSS — what fixes the "estourado" problem

The previous CSS had:

```css
.layout-wrap {
  grid-template-columns: 300px 1fr;   /* no max-width — full bleed */
}
.sidebar { position: sticky; ... }     /* glued to viewport edge */
```

On a 22"+ monitor this stretches the main column to 1500+ px and the
sidebar lives at the screen's far left. The new CSS is:

```css
.page-shell {
  min-height: 100vh;
  padding: 40px 24px;
  display: flex;
  justify-content: center;             /* CENTER the shell on the viewport */
}

.layout-wrap {
  width: 100%;
  max-width: 1200px;                   /* HARD cap so nothing stretches */
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.sidebar-card {
  position: sticky;
  top: 24px;
  /* visually a card, same elevation as the main column — NOT a panel
     glued to the viewport edge. */
}
```

On a 1920×1080 monitor: ~360px empty on each side of the centered
1200px shell. On 1440px: ~120px each side. On 1200px: full width.
Below 960px: collapses to single column with sidebar as a top card.

## Identity de-duplication — what goes where

```
SIDEBAR-CARD (.sidebar-card):
  - "Pablo Costa" (small, top of card)
  - "Senior Engineer" (mono, subtitle)
  - Nav: About / Resume / Portfolio / Contact
  - EN | PT toggle
  - Dark | Light toggle

BANNER (.profile-banner):
  - Avatar (96px, gradient border)
  - "Pablo Costa" (large, serif-feel display)
  - "Senior Engineer" (regular)
  - LinkedIn / GitHub mono pill links
  - EMAIL block:    label "EMAIL"    + pablobhz@gmail.com
  - LOCATION block: label "LOCATION" + Belo Horizonte, BR
  - STATUS block:   label "STATUS"   + green dot + "Open to Work"

ROUTE-NAV (.route-nav):
  - Pills mirroring the sidebar nav (used everywhere, but on mobile is the only nav)
  - EN | PT toggle (same)
  - Dark | Light toggle (same)
```

The name appears twice ON PURPOSE: small in the sidebar (an identifier
within the navigation card) and large in the banner (the page hero).
That is the vCard template pattern. The fields that must NOT repeat are:
**email, location, status, CV link, avatar** — those live only in the
banner.

## Validation checklist

After the agent runs, manually verify each:

- [ ] `npm run build` exits 0
- [ ] `npm run dev` opens at `http://localhost:5173/` and immediately
      redirects to `/en/about` (or `/pt/about` if browser is PT)
- [ ] URL `/en/resume` typed directly into the browser loads the Resume
      page (not a 404)
- [ ] Browser **back** button moves from Resume to About
- [ ] Clicking PT on `/en/resume` navigates to `/pt/resume` and the
      content visibly switches to Portuguese, banner included
- [ ] On a 1920px-wide screen, the shell is centered with equal empty
      space on left and right (≈360px each)
- [ ] Sidebar is a rounded card, NOT a panel touching the left edge
- [ ] Email, Location, Status appear ONLY in the banner — not in the
      sidebar
- [ ] Avatar appears ONLY in the banner — not in the sidebar
- [ ] Dark/Light toggle: clicking flips the theme on every element,
      and a page reload preserves the choice
- [ ] At width ≤960px the sidebar nav hides and the route-nav row
      below the banner takes over
- [ ] At width ≤560px banner stacks vertically (avatar on top)
- [ ] Resume page: "Load more" button reveals the remaining
      experience/education entries; "Show less" collapses back
- [ ] Portfolio page: filter pills (All / Certifications / Projects /
      Badges) with live counts; clicking filters the grid
- [ ] Contact page: form submission opens the user's mail client with
      `mailto:pablobhz@gmail.com` and the subject + body pre-filled

## Infra — Amplify SPA rewrites

Hosting is AWS Amplify (per `infra/terraform/environments/prod/main.tf`).
The `amplify-static-site` module already supports SPA rewrites via
`enable_spa_rewrites`. **You must pass `enable_spa_rewrites = true`** in
the `module "portfolio"` block, otherwise hard-loading `/pt/resume`
returns 404.

See `infra/amplify-spa-rewrite.tf.snippet` for the exact edit.

After editing:

```sh
cd infra/terraform/environments/prod
terraform plan
terraform apply
```

Verify with:

```sh
curl -I https://portfolio.pablobhz.cloud/pt/resume
# → HTTP 200 (rewritten to /index.html), not 404
```

## Notes

- The current banner uses a placeholder "P" letter inside the avatar
  square. Replace `<span class="avatar-letter">P</span>` with
  `<img src={PROFILE.avatar} alt={PROFILE.name} />` and drop
  `Pablo-Profile.jpeg` at `public/profile.jpeg` to ship the real photo.
- Certification artwork is intentionally placeholder gradients
  (cover-1 to cover-10). When you have the badges, swap the JSX in
  `PortfolioPage.jsx` from a colored `<div>` to an `<img>` with the file
  from `src/assets/certifications/`.
- The CMS migration (future phase) only needs to replace the body of
  `src/data/content.js` with an API fetch — the shape stays the same.
