# FlyGD Wingman — website

The public website for **FlyGD Wingman**, a free and open-source Windows
companion application for OBS Studio.

Live at **https://wingman.zoolanders.vip**

| Route | File | Purpose |
|---|---|---|
| `/` | `public/index.html` | Product homepage |
| `/privacy` | `public/privacy.html` | Privacy Policy |
| `/terms` | `public/terms.html` | Terms of Service |
| `/google-oauth` | `public/google-oauth.html` | Minimal application homepage submitted as the "Application home page" in the Google Auth Platform console |
| *(anything else)* | `public/404.html` | Not-found page |

The site also serves the Google OAuth verification requirements: the homepage
explains the single requested scope (`youtube.upload`), what it is used for,
where credentials are stored, and how to revoke access; the Privacy Policy and
Terms are linked from the header and footer of every page.

## What this is built with

Nothing. That is deliberate.

Hand-written HTML, one stylesheet, and inline SVG. There is **no framework, no
build step, no bundler, and no runtime JavaScript** — the files in `public/`
are exactly what gets served. The only dependency in the project is
[Wrangler](https://developers.cloudflare.com/workers/wrangler/), and that is
used solely to preview and deploy.

There are no cookies, no analytics, no trackers, and no external fonts or
assets, so no consent banner is required.

```
public/
  index.html  privacy.html  terms.html  google-oauth.html  404.html
  styles.css              # the entire design system
  wingman-mark.svg        # original logo mark
  favicon.svg  favicon.ico  apple-touch-icon.png
  og.png                  # Open Graph card (1200×630)
  robots.txt  sitemap.xml
  _headers                # security headers + cache policy
scripts/check-links.mjs   # zero-dependency link checker
wrangler.jsonc            # Cloudflare configuration
```

## Local development

Requires Node.js 20 or newer.

```bash
npm install     # installs wrangler only
npm run dev     # serves on http://localhost:8787
```

`wrangler dev` serves `public/` through the same Workers Static Assets runtime
that Cloudflare uses in production, so local URL behaviour matches the deployed
site exactly — including `/privacy` resolving to `privacy.html` and unknown
paths returning the 404 page with a real 404 status.

Edit a file and refresh. There is nothing to rebuild.

## Build

There is no build step. `public/` is the deployable artifact.

The only generated files are the icons and the Open Graph image, which are
committed to the repository and only need regenerating if the logo or the
wording on the card changes.

## Checks

```bash
npm run check              # internal links + fragment anchors
node scripts/check-links.mjs --external   # also HEAD-checks outbound links
```

The checker mirrors the production routing rules, so a link that passes here
resolves on the deployed site. It exits non-zero on failure and is safe to run
in CI.

There is no test suite; there is no application code to test.

## Deploying to Cloudflare

The site deploys as a **Worker with static assets** (not Cloudflare Pages).
No Worker script is present — `wrangler.jsonc` declares only an `assets`
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

The domain is declared in `wrangler.jsonc`, so it is attached by deploying —
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
misconfiguration — but it is not the address to give Google, because the pages'
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

## Editing content

Each page is a single self-contained HTML file with the header and footer
inlined. There is no templating, so a change to the navigation or footer must
be made in all four HTML files. This is a deliberate trade: four small
duplications in exchange for no build tooling at all. `npm run check` will
catch a link that gets out of step.

`styles.css` holds the whole design system in CSS custom properties at the top.

## Accuracy policy

The homepage and Privacy Policy describe the behaviour of the application as
it is actually implemented in
[elboaf/FlyGD-Wingman](https://github.com/elboaf/FlyGD-Wingman),
verified against the source. In particular the site states that stored OAuth
credentials are **not** encrypted, because they are not.

If the application changes how it handles credentials, network calls, or Google
data, update `public/privacy.html` in the same release — and check the claims
on the homepage's "YouTube uploads & Google permissions" section too.

## Licence

The site content and code are part of the FlyGD Wingman project and released
under the MIT Licence.
