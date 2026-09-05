# FlyGD Wingman - website

The public website for **FlyGD Wingman v5**, a free and open-source Windows
wormhole multiboxing toolkit for EVE Online. It previews and switches every
running client, fires wormhole mapping and rolling keybinds, watches gamelogs
and the fleet combat bar for trouble, helps prepare profiles, skills and
fittings between fights, and uploads the fight footage you select to your own
YouTube channel.

Live at **https://wingman.zoolanders.vip**

| Route | File | Purpose |
|---|---|---|
| `/` | `public/index.html` | Product homepage |
| `/privacy` | `public/privacy.html` | Privacy Policy |
| `/terms` | `public/terms.html` | Terms of Service |
| `/google-oauth` | `public/google-oauth.html` | Minimal application homepage submitted as the "Application home page" in the Google Auth Platform console |
| *(anything else)* | `public/404.html` | Not-found page |

The site also serves the Google OAuth verification requirements: the homepage
and the dedicated `/google-oauth` page explain the single requested scope
(`youtube.upload`), what it is used for, where credentials are stored, and how
to revoke access; the Privacy Policy and Terms are linked from the header and
footer of every page.

## Primary workflows

The homepage is organised around FlyGD Wingman's three equally-important
workflows, plus the fleet-awareness and fleet-preparation features that
support them:

- **Previews**: mirrors every running EVE client into an always-on-top
  preview window and switches which one is active, without resizing or
  moving the game windows.
- **Bookmarks**: 18 FlyGD keybinds place wormhole mapping bookmarks and
  drive rolling from an explicit keypress in an enabled client.
- **Uploading**: reviews, plays, renames or stitches the recordings OBS or
  the optional FightRecorder plugin produced, and uploads the ones you select
  to your own YouTube channel.
- **Client awareness**: watches gamelogs for combat starts, warp disruption
  and decloaks, and keeps a fleet-wide combat bar.
- **Fleet preparation**: Profiles, Skills and Fittings help prepare between
  fights, authorized once per character through EVE SSO.

## What this is built with

Nothing. That is deliberate.

Hand-written HTML, one stylesheet, and inline SVG. There is **no framework, no
build step, no bundler, and no runtime JavaScript** - the files in `public/`
are exactly what gets served. This is unchanged from earlier versions of the
site: only the product content, metadata and imagery describe v5. The only
dependencies in the project are
[Wrangler](https://developers.cloudflare.com/workers/wrangler/), used to
preview and deploy, and [html-validate](https://html-validate.org/), used by
`npm run check` to catch HTML defects locally.

There are no cookies, no analytics, no trackers, and no external fonts or
assets, so no consent banner is required.

```
public/
  index.html  privacy.html  terms.html  google-oauth.html  404.html
  styles.css              # the entire design system
  wingman-mark.png        # 64px brand mark (header/footer), from the app icon
  favicon.ico  apple-touch-icon.png
  og.png                  # Open Graph card (1200×630)
  media/                  # product screenshots used on the homepage
  robots.txt  sitemap.xml
  _headers                # security headers + cache policy
scripts/check-links.mjs   # zero-dependency link checker
scripts/check-content.mjs # zero-dependency page-content contract checker
wrangler.jsonc            # Cloudflare configuration
```

### `public/media/`

The homepage screenshots in `public/media/` (`wingman-previews.webp`,
`wingman-bookmarks.webp`, `wingman-fittings.webp`, `wingman-uploader.webp`)
are WEBP derivatives of PNG captures taken directly from the v5.0.0 build of
[elboaf/FlyGD-Wingman](https://github.com/elboaf/FlyGD-Wingman), converted to
RGB, thumbnailed to a maximum width of 1600px, and re-encoded at WEBP
quality 82. The source screenshots are not committed to this repository; if
you need to regenerate a derivative, recapture the corresponding screen from
a current release build and repeat that conversion with Pillow. There is no
committed script that automates this end to end, since it only needs to run
on the rare occasion a screenshot goes stale.

### Icons and the Open Graph card

Every brand asset is derived from the icon the v5 application actually ships,
`wingman/assets/app.ico` in
[elboaf/FlyGD-Wingman](https://github.com/elboaf/FlyGD-Wingman) (a 7-frame ICO,
16–256px). `public/favicon.ico` is that file byte-for-byte;
`public/apple-touch-icon.png` (180×180) and `public/wingman-mark.png` (64×64,
shown at 26px in the header and 22px in the footer) are Pillow LANCZOS
resizes of its 256px frame, keeping the icon's transparency. There is no SVG
favicon or SVG mark: the shipped icon is a raster illustration, so an SVG
derivative could only be an inaccurate redraw of it.

The Open Graph card (`public/og.png`) was produced the same way as the
screenshots: a one-off Pillow script rendered the Command deck palette
(`--ground`, `--surface`, `--line`, `--accent`, `--ink`, `--ink-dim`,
`--ink-faint`, converted from OKLCH to sRGB) with the same 256px icon frame
scaled to 132px on a 1200×630 canvas, using local system fonts (Inter for
display type, DejaVu Sans Mono for the domain line). That script is not
committed; regenerating the card only requires reproducing a 1200×630 PNG
with the current icon, category, and tagline, checked at both full size and
thumbnail size for legibility.

Regenerate all four assets whenever the application's icon changes.

## Local development

Requires **Node.js 22.22.0 or newer (or 24.8.0 or newer)**, the exact range
`html-validate` 11.13.0 needs to run `npm run check:html`. This supersedes the
lower Node 20.11 floor that `scripts/check-content.mjs` alone would need for
`import.meta.dirname`.

```bash
npm install     # installs wrangler and html-validate
npm run dev     # serves on http://localhost:8787
```

`wrangler dev` serves `public/` through the same Workers Static Assets runtime
that Cloudflare uses in production, so local URL behaviour matches the deployed
site exactly, including `/privacy` resolving to `privacy.html` and unknown
paths returning the 404 page with a real 404 status.

Edit a file and refresh. There is nothing to rebuild.

## Build

There is no build step. `public/` is the deployable artifact.

The only generated files are the icons, the homepage screenshots and the
Open Graph image, which are committed to the repository and only need
regenerating if the product's UI, the logo, or the wording on the card
changes.

## Checks

```bash
npm run check              # the complete fast local gate (links + content + HTML)
npm run check:links        # internal links + fragment anchors
npm run check:content      # page-content contracts (licence, scopes, stale claims)
npm run check:html         # html-validate against public/*.html
node scripts/check-links.mjs --external   # also HEAD-checks outbound links (optional)
```

`check:links` mirrors the production routing rules, so a link that passes
here resolves on the deployed site. `check:content` guards specific factual
claims (the GPL-3.0-only licence, the exact OAuth and ESI scopes, the three
workflow headings, stale wording that must never reappear on any page) against
each page's actual text, and additionally asserts the `/media/*` cache rule
and the `frame-ancestors 'none'` directive in `public/_headers`.
`check:html` runs [html-validate](https://html-validate.org/) with the
project's `.htmlvalidate.json` config, extending `html-validate:recommended`
with stricter accessible-name and inline-style rules. All three exit non-zero
on failure and are safe to run in CI. The external-link check is optional
because some providers block automated `HEAD` requests from this kind of
environment; a failure there should be verified manually rather than treated
as a broken link on faith.

There is no test suite; there is no application code in this repository to
test.

## Deploying to Cloudflare

The site deploys as a **Worker with static assets** (not Cloudflare Pages).
No Worker script is present; `wrangler.jsonc` declares only an `assets`
directory, so Cloudflare serves the files directly from its edge without
invoking any compute.

```bash
npx wrangler login          # once, in a browser
npm run deploy:dry-run      # validate configuration without deploying
npm run deploy              # publish
```

The first `deploy` creates a Worker named `flygd-wingman-site` and gives it a
`*.workers.dev` URL. Verify the site there before attaching the real domain.

### Routing configuration

```jsonc
"assets": {
  "directory": "./public",
  "html_handling": "drop-trailing-slash",
  "not_found_handling": "404-page"
}
```

- `drop-trailing-slash` makes `/privacy` serve `privacy.html`, and redirects
  `/privacy/` to `/privacy`. Each page is therefore reachable at exactly one
  URL, matching its `<link rel="canonical">`. This matters for Google OAuth
  verification, where the privacy policy URL you register must resolve
  directly.
- `404-page` serves `public/404.html` with a genuine 404 status for unknown
  paths. (Do **not** change this to `single-page-application`; that would make
  every mistyped URL return HTTP 200.)

### Custom domain: wingman.zoolanders.vip

The domain is declared in `wrangler.jsonc`, so it is attached by deploying,
there is nothing to click:

```jsonc
"routes": [
  { "pattern": "wingman.zoolanders.vip", "custom_domain": true }
]
```

`npm run deploy` creates the proxied DNS record in the `zoolanders.vip` zone and
orders the TLS certificate automatically. No CNAME or A record should be created
by hand; a pre-existing record for that hostname blocks the attachment and must
be deleted first.

This assumes `zoolanders.vip` is a zone in the **same** Cloudflare account as the
Worker. If the deploy fails to attach the domain, that is almost always why.

The equivalent dashboard route, if you prefer it: **Workers & Pages** →
`flygd-wingman-site` → **Settings → Domains & Routes → Add → Custom domain**.

Every Worker also keeps a `*.workers.dev` URL. That is expected, not a
misconfiguration, but it is not the address to give Google, because the pages'
`canonical` and `og:url` tags point at `wingman.zoolanders.vip`.

Certificate issuance usually completes within a few minutes; until it does,
the hostname may briefly serve a TLS warning.

### DNS and configuration assumptions

- `zoolanders.vip` is managed by Cloudflare DNS in the same account as the Worker.
- No other Worker route or DNS record already claims `wingman.zoolanders.vip`.
- HTTPS is handled by Cloudflare's universal certificate. Set SSL/TLS mode to
  **Full (strict)** if it is not already, and enable **Always Use HTTPS** on
  the zone.
- The `Strict-Transport-Security` header in `public/_headers` applies to
  subdomains. Only keep it if every host under `zoolanders.vip` serves HTTPS.
- The project enables Workers observability (`observability.enabled` in
  `wrangler.jsonc`). That governs Cloudflare's own operational logging of
  Worker invocations for this account; it adds no script, cookie or analytics
  to a visitor's browser. Matching static assets are served without invoking
  Worker code at all, as documented on `/privacy`.

## Editing content

Each page is a single self-contained HTML file with the header and footer
inlined. There is no templating, so a change to the navigation or footer must
be made in all five HTML files. This is a deliberate trade: duplication in
exchange for no build tooling at all. `npm run check` will catch a link or a
factual claim that gets out of step.

`styles.css` holds the whole design system in CSS custom properties at the top.

## Accuracy policy

The homepage, Privacy Policy, Terms of Service and the `/google-oauth` page
describe the behaviour of the application as it is actually implemented in
[elboaf/FlyGD-Wingman](https://github.com/elboaf/FlyGD-Wingman). Every product
claim on this site has been verified against **v5.0.0**. In particular the
site states that stored Google OAuth tokens and any Discord webhook URL are
**not** encrypted, because they are not, while EVE refresh credentials are
protected with Windows DPAPI, because they are.

The application's current per-user data folder is
`%LOCALAPPDATA%\FlyGD Wingman\`; see
[wingman.zoolanders.vip/privacy#storage](https://wingman.zoolanders.vip/privacy#storage)
for exactly what lives there and how credential protection differs by file.
The current release installer follows the naming pattern
`FlyGD-Wingman-Setup-<version>.exe`, for example `FlyGD-Wingman-Setup-5.0.0.exe`.

Product claims are release-specific and go stale as the application changes.
**Every release that changes data handling, network calls, requested scopes,
stored credentials, or product behaviour described here must be re-audited
against this site before the release ships** - update `public/privacy.html`,
`public/terms.html`, `public/google-oauth.html` and the relevant homepage
sections in the same pass, and re-run `npm run check` afterwards.

## Support and contact

Public bug reports and feature requests go to the project's
[GitHub Issues](https://github.com/elboaf/FlyGD-Wingman/issues). For anything
sensitive - account access, privacy, or a security report - email
**technical@zoolanders.vip** directly rather than filing a public issue.

## Licence

The FlyGD Wingman application is free software released under the
**GNU General Public License, version 3 only (GPL-3.0-only)**; the full
licence text accompanies the source in the
[project repository](https://github.com/elboaf/FlyGD-Wingman). This website's
own HTML, CSS and supporting files are part of the same project and carry no
separate licence grant beyond that repository's terms; the site is not
separately licensed under any other terms.
