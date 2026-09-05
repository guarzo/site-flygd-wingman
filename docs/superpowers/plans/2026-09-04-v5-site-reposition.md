# FlyGD Wingman v5 Site Repositioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the static Wingman website around the shipped v5 EVE wormhole toolkit while correcting its Google OAuth, privacy, terms, metadata, and product documentation.

**Architecture:** Keep the current hand-written static-site architecture: five HTML documents, one shared stylesheet, local images, and zero runtime JavaScript. Add a zero-dependency factual-content checker beside the existing link checker, use a small set of optimized v5 screenshots, and verify production routing through Wrangler rather than assuming the filesystem model proves HTTP behavior.

**Tech Stack:** Semantic HTML, CSS with OKLCH custom properties, Node.js validation scripts, Cloudflare Workers Static Assets/Wrangler, Chromium, html-validate, Axe CLI, Pillow as a one-off image-processing tool.

**Spec:** `docs/superpowers/specs/2026-09-04-v5-site-reposition-design.md`

## Global Constraints

- Product claims must match `/mnt/c/dev/flygd-wingman` commit `3e8611c3c8750fb0e440297693161797a3d2d8e6`, tagged `v5.0.0`.
- The site remains static: no build step, runtime JavaScript, client-side analytics, cookies, external fonts, or third-party frontend assets.
- Preserve `html_handling: "drop-trailing-slash"` and `not_found_handling: "404-page"` in `wrangler.jsonc`.
- Use the approved Command deck direction from `DESIGN.md`: dark app-native purple, real screenshots, opaque surfaces, system fonts, and varied section rhythm.
- Previews, Bookmarks, and Uploading receive equal product weight.
- Assume EVE fluency; explain Wingman rather than EVE terminology.
- The application licence is GPL-3.0-only. Terms must not add restrictions on running, studying, modifying, or redistributing the software.
- Google OAuth is verified and requests only `https://www.googleapis.com/auth/youtube.upload`.
- Do not state an exact YouTube quota; state only that the application project quota is shared.
- `technical@zoolanders.vip` handles privacy, Google-account, security, and sensitive data questions. GitHub Issues handles public bugs and feature requests.
- Preserve disclosure of Cloudflare hosting request processing and distinguish it from product analytics.
- Target WCAG 2.2 AA, semantic headings, keyboard-visible focus, reduced motion, and 65–72ch legal-page measure.
- Do not deploy to production.

---

## File Map

- `public/index.html`: v5 product story, primary workflows, trust summary, metadata, and download conversion.
- `public/privacy.html`: complete v5 data inventory, network destinations, retention, revocation, deletion, and hosting disclosure.
- `public/terms.html`: GPL-compatible terms and accurate third-party/application behavior.
- `public/google-oauth.html`: narrow Google-review surface for the single upload scope.
- `public/404.html`: shared v5 visual shell and navigation.
- `public/styles.css`: complete Command deck design system shared by every page.
- `public/media/*.webp`: optimized screenshot derivatives copied from the approved v5 capture set.
- `public/og.png`: 1200×630 v5 social image.
- `scripts/check-content.mjs`: factual and structural regression assertions by page.
- `scripts/check-links.mjs`: existing route, fragment, and external-link checker; modify only if new markup exposes a real parser gap.
- `.htmlvalidate.json`: explicit semantic validation rules for static pages.
- `package.json`, `package-lock.json`: validation commands and pinned `html-validate` development dependency.
- `README.md`: current product description, source-of-truth policy, screenshot generation note, verification, and deployment guidance.

---

### Task 1: Add factual-content guardrails

**Files:**
- Create: `scripts/check-content.mjs`
- Modify later in Task 6: `package.json`, `package-lock.json`

**Interfaces:**
- Consumes: UTF-8 pages under `public/`.
- Produces: `node scripts/check-content.mjs [page-name...]`, exiting 0 when selected page contracts pass and 1 with one line per failed assertion.

- [ ] **Step 1: Create the page-contract checker with deliberately failing v5 requirements**

Implement a page-selectable checker. Keep requirements as literal, reviewable phrases rather than a general HTML parser:

```js
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..", "public");
const contracts = {
  index: {
    must: [
      "wormhole multiboxing toolkit",
      "id=\"toolkit\"",
      "id=\"fight-footage\"",
      "id=\"trust\"",
      "Previews",
      "Bookmarks",
      "Uploading",
      "GPL-3.0-only",
      "technical@zoolanders.vip",
    ],
    mustNot: ["MIT Licence", "Google hasn’t verified", "100 uploads per day"],
  },
  privacy: {
    must: [
      "%LOCALAPPDATA%\\FlyGD Wingman\\",
      "%LOCALAPPDATA%\\OBSYouTubeUploader\\",
      "links.json",
      "esi-fittings.read_fittings.v1",
      "esi-fittings.write_fittings.v1",
      "esi-skills.read_skills.v1",
      "esi-skills.read_skillqueue.v1",
      "Windows DPAPI",
      "Cloudflare",
      "technical@zoolanders.vip",
    ],
    mustNot: ["100 uploads per day", "verification is still in progress", "two destinations, and only two"],
  },
  terms: {
    must: ["GPL-3.0-only", "EVE SSO", "ESI", "GitHub", "WebView2"],
    mustNot: ["MIT Licence", "must not script", "must not modify", "does not interact with the game client"],
  },
  "google-oauth": {
    must: ["youtube.upload", "verified", "Privacy Policy", "Terms of Service"],
    mustNot: ["unverified", "100 uploads per day"],
  },
  404: {
    must: ["FlyGD Wingman", "Privacy Policy", "Terms of Service"],
    mustNot: [],
  },
};

const selected = process.argv.slice(2);
const names = selected.length ? selected : Object.keys(contracts);
const failures = [];

for (const name of names) {
  const contract = contracts[name];
  if (!contract) {
    failures.push(`${name}: unknown page contract`);
    continue;
  }
  const html = readFileSync(resolve(ROOT, `${name}.html`), "utf8");
  for (const text of contract.must) {
    if (!html.includes(text)) failures.push(`${name}: missing ${JSON.stringify(text)}`);
  }
  for (const text of contract.mustNot) {
    if (html.includes(text)) failures.push(`${name}: stale ${JSON.stringify(text)}`);
  }
}

for (const failure of failures) console.error(`FAIL ${failure}`);
console.log(`Checked ${names.length} content contract(s); failures: ${failures.length}`);
process.exit(failures.length ? 1 : 0);
```

- [ ] **Step 2: Run each future page contract and record the expected red baseline**

Run:

```bash
node scripts/check-content.mjs index
node scripts/check-content.mjs privacy
node scripts/check-content.mjs terms
node scripts/check-content.mjs google-oauth
```

Expected: each command exits 1 and reports the v5 requirements missing from the current uploader-era pages. `node scripts/check-content.mjs 404` may already pass.

- [ ] **Step 3: Verify the checker rejects an unknown contract cleanly**

Run:

```bash
node scripts/check-content.mjs missing-page
```

Expected: exit 1 with `missing-page: unknown page contract`; no stack trace.

- [ ] **Step 4: Commit the guardrail without wiring it into the passing default check yet**

```bash
git add scripts/check-content.mjs
git commit -m "test: guard Wingman v5 site claims"
```

The default `npm run check` stays green until all page contracts are implemented in Task 6.

---

### Task 2: Prepare current product imagery

**Files:**
- Create: `public/media/wingman-previews.webp`
- Create: `public/media/wingman-bookmarks.webp`
- Create: `public/media/wingman-uploader.webp`
- Create: `public/media/wingman-fittings.webp`

**Interfaces:**
- Consumes: approved captures in `/mnt/c/dev/flygd-wingman/tmp/screens/20260905T034121Z`.
- Produces: local, browser-ready WebP assets no wider than 1600px, referenced later by root-absolute `/media/...` URLs.

- [ ] **Step 1: Reconfirm screenshot provenance and visible states**

Run:

```bash
python - <<'PY'
import json
from pathlib import Path
p = Path('/mnt/c/dev/flygd-wingman/tmp/screens/20260905T034121Z/manifest.json')
data = json.loads(p.read_text())
assert data['sha'] == '3e8611c'
assert data['failed'] == []
for name in ['01-uploader.png', '07-settings-bookmarks.png', '08-settings-previews.png', '23-fittings.png']:
    assert (p.parent / name).is_file(), name
print('screenshot provenance ok')
PY
```

Expected: `screenshot provenance ok`. Open the four files and confirm they show Uploader, Bookmarks, Previews, and Fittings respectively without transient failure dialogs or exposed real credentials.

- [ ] **Step 2: Generate optimized local derivatives**

Run from the site worktree using the product repository's Pillow-capable environment:

```bash
mkdir -p public/media
cd /mnt/c/dev/flygd-wingman
uv run python - <<'PY'
from pathlib import Path
from PIL import Image

src = Path('/mnt/c/dev/flygd-wingman/tmp/screens/20260905T034121Z')
dst = Path('/home/tng/workspace/site-flygd-wingman/.worktrees/v5-site-reposition/public/media')
files = {
    '01-uploader.png': 'wingman-uploader.webp',
    '07-settings-bookmarks.png': 'wingman-bookmarks.webp',
    '08-settings-previews.png': 'wingman-previews.webp',
    '23-fittings.png': 'wingman-fittings.webp',
}
for source_name, target_name in files.items():
    image = Image.open(src / source_name).convert('RGB')
    image.thumbnail((1600, 1000), Image.Resampling.LANCZOS)
    image.save(dst / target_name, 'WEBP', quality=82, method=6)
PY
```

- [ ] **Step 3: Verify dimensions, format, and payload**

Run:

```bash
file public/media/*.webp
du -ch public/media/*.webp
```

Expected: four valid WebP files, each at most 1600px wide, with a combined payload below 1.2MB. If the payload exceeds the limit, regenerate at quality 76 before proceeding.

- [ ] **Step 4: Commit the image set**

```bash
git add public/media
git commit -m "assets: add current Wingman v5 screenshots"
```

---

### Task 3: Build the Command deck homepage

**Files:**
- Rewrite: `public/index.html`
- Rewrite: `public/styles.css`

**Interfaces:**
- Consumes: `/media/wingman-previews.webp`, `/media/wingman-bookmarks.webp`, `/media/wingman-uploader.webp`, `/media/wingman-fittings.webp`.
- Produces: stable homepage anchors `#toolkit`, `#awareness`, `#fleet-prep`, `#fight-footage`, `#trust`, and `#download`; shared classes used by legal and OAuth pages.

- [ ] **Step 1: Run the homepage contract to preserve the red state**

```bash
node scripts/check-content.mjs index
```

Expected: FAIL on the missing v5 positioning, section anchors, GPL licence, and contact address.

- [ ] **Step 2: Replace the shared CSS tokens and layout primitives**

Rewrite `public/styles.css` around these tokens and shared primitives, preserving `.legal`, `.legal-body`, `.toc`, `.kv`, `.path`, `.skip`, `.site-head`, and `.site-foot` support for existing pages:

```css
:root {
  color-scheme: dark;
  --ground: oklch(0.14 0.018 306);
  --surface: oklch(0.19 0.024 306);
  --surface-raised: oklch(0.235 0.032 306);
  --line: oklch(0.34 0.035 306);
  --line-strong: oklch(0.47 0.055 306);
  --ink: oklch(0.95 0.012 306);
  --ink-dim: oklch(0.76 0.025 306);
  --ink-faint: oklch(0.64 0.028 306);
  --accent: oklch(0.65 0.22 306);
  --accent-strong: oklch(0.56 0.24 306);
  --link: oklch(0.79 0.12 210);
  --danger: oklch(0.68 0.19 24);
  --page: 1180px;
  --prose: 70ch;
  --radius: 8px;
  --sans: system-ui, -apple-system, "Segoe UI", sans-serif;
  --mono: ui-monospace, "Cascadia Code", Consolas, monospace;
}
```

Required layout classes:

```css
.hero-grid { display:grid; grid-template-columns:minmax(0,.88fr) minmax(420px,1.12fr); align-items:center; }
.workflow-list { border-block:1px solid var(--line); }
.workflow { display:grid; grid-template-columns:4rem minmax(0,.8fr) minmax(0,1.2fr); }
.readout-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); }
.feature-split { display:grid; grid-template-columns:minmax(0,1fr) minmax(320px,.9fr); }
@media (max-width: 800px) {
  .hero-grid, .feature-split, .workflow { grid-template-columns:1fr; }
}
```

Use only transform, opacity, color, border-color, and background-color transitions. Include a `prefers-reduced-motion: reduce` rule. Do not add thick side-stripe notices, gradient text, glass blur, or identical icon-card grids.

- [ ] **Step 3: Rewrite homepage metadata and hero**

In `public/index.html`:

- set the title and description around the wormhole multiboxing toolkit;
- update Open Graph and JSON-LD descriptions;
- set `license` to `https://www.gnu.org/licenses/gpl-3.0.html`;
- use a hero `<div class="hero-grid">` with category, headline, one paragraph, Download/GitHub actions, and `/media/wingman-previews.webp`;
- add width and height attributes to every screenshot `<img>` to reserve layout space;
- use truthful alt text such as `Wingman Previews settings showing enabled EVE characters and client-switching controls`.

The hero must remain understandable if the image fails to load.

- [ ] **Step 4: Implement the three equal workflow bands**

Create `<section id="toolkit">` with exactly three direct `.workflow` children:

```html
<article class="workflow">
  <span class="workflow-number" aria-hidden="true">01</span>
  <div><p class="eyebrow">Previews</p><h2>Keep every client in view</h2></div>
  <div><p>...</p><ul class="compact-list">...</ul></div>
</article>
```

Repeat the complete structure for Bookmarks (`02`) and Uploading (`03`). Give each workflow its own concrete boundary: previews mirror and activate but do not resize EVE windows; bookmark actions execute only from explicit keypresses in enabled clients; uploading sends only selected recordings after the user starts it.

- [ ] **Step 5: Add awareness, fleet preparation, footage, trust, and download sections**

Implement these anchors and content:

- `#awareness`: gamelog alerts plus fleet DPS/EWAR bar, including missing-log and non-automation boundaries;
- `#fleet-prep`: Profiles, Skills, Fittings, and centralized Characters authorization, using `/media/wingman-fittings.webp`;
- `#fight-footage`: OBS/FightRecorder to selected YouTube upload, with `/media/wingman-uploader.webp` and accurate automatic post-upload Discord behavior;
- `#trust`: static network-destination rows for Google, CCP, GitHub, Discord, Microsoft, and FlyGD, plus prominent Privacy and Terms links;
- `#download`: Windows release call to action, GPL-3.0-only, per-user core installation, WebView2 prerequisite, possible FightRecorder UAC prompt, and unsigned-build warning.

Use `technical@zoolanders.vip` only for sensitive support and GitHub Issues for public support.

- [ ] **Step 6: Update shared navigation and footer on the homepage**

Header links must be Toolkit, Fight footage, Trust, Download, and GitHub. Footer must include Home, Privacy Policy, Terms of Service, GitHub, public Support, and the sensitive-contact email. Preserve the skip link as the first focusable element.

- [ ] **Step 7: Run focused homepage checks**

```bash
node scripts/check-content.mjs index
npm run check
```

Expected: both PASS; `check-links.mjs` resolves every new image and fragment.

- [ ] **Step 8: Commit the homepage and shared visual system**

```bash
git add public/index.html public/styles.css
git commit -m "feat: reposition homepage around Wingman v5"
```

---

### Task 4: Rewrite the v5 Privacy Policy

**Files:**
- Rewrite: `public/privacy.html`

**Interfaces:**
- Consumes: shared legal styles and footer from Task 3.
- Produces: stable policy anchors for overview, website hosting, local access, Google, EVE, Discord, GitHub/updates, storage, transmission, retention, revocation, deletion, security, changes, and contact.

- [ ] **Step 1: Run the privacy contract and retain the failures**

```bash
node scripts/check-content.mjs privacy
```

Expected: FAIL on current data paths, EVE scopes, `links.json`, DPAPI, and contact details.

- [ ] **Step 2: Rewrite the policy outline and metadata**

Use “Last updated 4 September 2026” and this semantic section order:

```html
<h2 id="overview">1. Overview</h2>
<h2 id="website">2. This website and Cloudflare</h2>
<h2 id="local-access">3. Local files and application access</h2>
<h2 id="google">4. Google and YouTube</h2>
<h2 id="eve">5. EVE SSO and ESI</h2>
<h2 id="discord">6. Discord and combat logs</h2>
<h2 id="updates">7. GitHub and updates</h2>
<h2 id="storage">8. Local storage and credential protection</h2>
<h2 id="transmission">9. Network destinations and sharing</h2>
<h2 id="retention">10. Retention</h2>
<h2 id="revoking">11. Revoking connected accounts</h2>
<h2 id="deleting">12. Deleting local data</h2>
<h2 id="security">13. Security</h2>
<h2 id="changes">14. Changes</h2>
<h2 id="contact">15. Contact</h2>
```

Update the table of contents to exactly match these anchors.

- [ ] **Step 3: Implement complete Google data and lifecycle disclosure**

State all of the following explicitly:

- single `youtube.upload` scope and `videos.insert` use;
- verified application status without describing an old warning bypass;
- plaintext `%LOCALAPPDATA%\FlyGD Wingman\token.json`;
- stored last-upload channel ID and title in settings;
- recording-path to YouTube-URL history in `links.json`;
- no automatic pruning of `links.json`;
- shared project quota without a numeric limit;
- revoking Google access invalidates credentials but does not delete local files or uploaded videos;
- deleting local files does not revoke Google access or delete YouTube videos.

Preserve the Google API Services User Data Policy Limited Use statement and links to Google Privacy Policy, YouTube Terms, and Google permissions management.

- [ ] **Step 4: Implement complete EVE data and credential disclosure**

List the exact four scopes from the spec. Explain PKCE, the loopback callback on `127.0.0.1`, no EVE client secret, DPAPI-protected refresh credentials, and explicit additive fitting writes.

Describe stored EVE categories rather than every filename: identity/authorization metadata; skill and queue state; plans and groups; fittings and collections; profile, preview, bookmark, and EVE-settings state/backups.

- [ ] **Step 5: Implement Discord, GitHub, hosting, and local-data disclosure**

State:

- a configured webhook is plaintext in settings;
- matching combat logs can post after a successful video upload, while “Post the last hour” is explicit;
- GitHub receives one Wingman release check per startup and user-initiated installer/FightRecorder requests;
- Cloudflare may process standard request data, including IP addresses, to serve and protect the site;
- Cloudflare processes ordinary hosting requests. Matching static assets are served without invoking Worker code; `observability.enabled` governs persisted Worker invocation logs and does not add browser analytics. Explain that distinction without claiming Cloudflare processes no request data;
- the application has no FlyGD backend, usage analytics, or crash reporting.

Do not say the application has only two network destinations or no update check.

- [ ] **Step 6: Implement retention, migration, revocation, and clean-slate instructions**

Explain automatic migration from `%LOCALAPPDATA%\OBSYouTubeUploader\` to `%LOCALAPPDATA%\FlyGD Wingman\`. If rename fails with an OS error, the legacy directory remains active; there is no migration choice prompt.

Clean-slate steps must say:

1. Exit Wingman.
2. Revoke Google and EVE access separately if desired.
3. Delete `%LOCALAPPDATA%\FlyGD Wingman\`.
4. If the active location is unknown or migration failed, also delete `%LOCALAPPDATA%\OBSYouTubeUploader\`.
5. Understand that recordings outside those folders and already-uploaded YouTube videos are unaffected.

- [ ] **Step 7: Run focused privacy checks**

```bash
node scripts/check-content.mjs privacy
npm run check
```

Expected: both PASS. Manually search the policy for `only two`, `no automatic update check`, application-wide `not encrypted`, and numeric quota claims; each must be absent.

- [ ] **Step 8: Commit the policy**

```bash
git add public/privacy.html
git commit -m "docs: align privacy policy with Wingman v5"
```

---

### Task 5: Correct Terms, OAuth review page, and shared secondary pages

**Files:**
- Rewrite: `public/terms.html`
- Rewrite: `public/google-oauth.html`
- Modify: `public/404.html`

**Interfaces:**
- Consumes: shared site shell and legal styles from Task 3.
- Produces: GPL-compatible terms, verified Google OAuth disclosure, and consistent secondary-page navigation.

- [ ] **Step 1: Run the Terms and OAuth contracts**

```bash
node scripts/check-content.mjs terms google-oauth 404
```

Expected: Terms and OAuth FAIL on stale licence/product/verification claims; 404 may pass before visual updates.

- [ ] **Step 2: Rewrite Terms without restricting GPL rights**

Use “Last updated 4 September 2026.” Cover product purpose, GPL-3.0-only, user content/account responsibilities, third-party providers, availability, warranties, liability, changes, and contacts.

Delete the current `No automated uploading` restriction in full. Replace it with non-contractual product behavior in the product-description section:

```html
<p>The official Wingman build acts on explicit user input. It can mirror and activate EVE clients, send a configured bookmark keybind when the user presses it, read local files, and use authorized ESI operations. It does not make gameplay decisions or operate clients without user input. This description does not limit the rights to run, study, modify, or redistribute the software granted by GPL-3.0-only.</p>
```

Do not use “must not script,” “must not modify,” or equivalent additional software-use restrictions. User obligations may still require lawful content and compliance with each external service's own terms.

- [ ] **Step 3: Correct third-party and credential provisions**

Add accurate sections for Google/YouTube, CCP EVE SSO/ESI, Discord, GitHub release services, Microsoft WebView2, OBS Studio, and optional FightRecorder. Distinguish plaintext Google tokens and Discord webhook from DPAPI-protected EVE refresh credentials. Correct all remaining MIT references, including the availability/forking section.

- [ ] **Step 4: Rewrite the OAuth review page around the single Google purpose**

Keep this page short. It must state:

- Wingman is primarily an EVE wormhole multiboxing toolkit with an independent fight-footage uploader;
- EVE tools do not require a Google account or use Google data;
- the sole scope is `https://www.googleapis.com/auth/youtube.upload`;
- it is used only for explicit uploads through `videos.insert`;
- verification is complete;
- credentials and upload history are stored locally as described in Privacy;
- Privacy Policy and Terms links are immediately visible.

Do not include instructions for bypassing an unverified warning.

- [ ] **Step 5: Align secondary-page header, footer, and 404 shell**

Use the compact secondary navigation on Terms, OAuth, and 404: Home, Privacy Policy, Terms, and GitHub where space permits. Add `technical@zoolanders.vip` to legal footers and preserve trademark disclaimers. Update inline logo colors or replace repeated inline marks with `/wingman-mark.svg` if that asset is updated consistently.

- [ ] **Step 6: Run focused page checks**

```bash
node scripts/check-content.mjs terms google-oauth 404
npm run check
```

Expected: all PASS. Also run:

```bash
rg -n "MIT Licence|must not script|must not modify|unverified|does not interact with the game client" public
```

Expected: no matches.

- [ ] **Step 7: Commit secondary pages**

```bash
git add public/terms.html public/google-oauth.html public/404.html
git commit -m "docs: correct Wingman v5 legal and OAuth pages"
```

---

### Task 6: Finish metadata, social image, documentation, and validation wiring

**Files:**
- Modify: `public/index.html`, `public/privacy.html`, `public/terms.html`, `public/google-oauth.html`, `public/404.html`
- Replace: `public/og.png`
- Modify: `README.md`
- Create: `.htmlvalidate.json`
- Modify: `package.json`, `package-lock.json`

**Interfaces:**
- Consumes: all completed page content and visual tokens.
- Produces: `npm run check` as the complete fast local gate: links, factual contracts, and HTML validation.

- [ ] **Step 1: Install and configure deterministic HTML validation**

Run:

```bash
npm install --save-dev html-validate
```

Create `.htmlvalidate.json`:

```json
{
  "extends": ["html-validate:recommended"],
  "rules": {
    "long-title": "off",
    "no-inline-style": "error",
    "wcag/h30": "error",
    "wcag/h32": "error",
    "wcag/h37": "error"
  }
}
```

If the installed version rejects an unavailable rule name, remove only that unavailable rule and retain `html-validate:recommended`; do not disable document validity, duplicate IDs, heading structure, or accessible-name checks.

- [ ] **Step 2: Wire complete package checks**

Set scripts in `package.json` to:

```json
{
  "scripts": {
    "dev": "wrangler dev",
    "check:links": "node scripts/check-links.mjs",
    "check:content": "node scripts/check-content.mjs",
    "check:html": "html-validate \"public/*.html\"",
    "check": "npm run check:links && npm run check:content && npm run check:html",
    "deploy": "wrangler deploy",
    "deploy:dry-run": "wrangler deploy --dry-run"
  }
}
```

Run `npm run check`; fix page semantics rather than suppressing valid errors.

- [ ] **Step 3: Complete metadata consistency**

For every page, verify title, description, canonical URL, theme color, Open Graph title/description/url/image, image dimensions, image alt, and Twitter card. Homepage JSON-LD must describe the v5 EVE toolkit, Windows operation, free availability, GPL-3.0 licence, current download URL, Privacy Policy, and Terms.

Use root-absolute internal URLs and retain the two Google site-verification tags on the homepage.

- [ ] **Step 4: Regenerate the Open Graph image**

Create a 1200×630 image using the Command deck palette, Wingman mark, category `WORMHOLE MULTIBOXING TOOLKIT`, product name, and concise line `Previews · Bookmarks · Fight footage`. Use Pillow from the product environment, local system fonts, and no screenshot containing account names or credentials.

Verify:

```bash
file public/og.png
```

Expected: PNG, exactly 1200×630. Open it at 100% and thumbnail size to check text remains legible and safely inside social-card crop margins.

- [ ] **Step 5: Rewrite project documentation**

Update `README.md` to cover:

- v5 product identity and primary workflows;
- unchanged static architecture;
- `public/media/` and the source screenshot set;
- `npm run check` and optional external-link check;
- current Cloudflare hosting/observability disclosure;
- GPL-3.0-only application licence without claiming a separate site MIT licence;
- product claims verified against v5.0.0 and mandatory re-audit for each release;
- current local paths, installer naming, and sensitive/public support channels.

Preserve accurate Wrangler routing and deployment instructions.

- [ ] **Step 6: Run the complete fast gate and stale-claim audit**

```bash
npm run check
node scripts/check-links.mjs --external
rg -n "MIT|unverified|100 uploads|only two|no update check|OBS-YouTube-Uploader-Setup" public README.md
rg -n "OBSYouTubeUploader" public README.md
```

Expected:

- all local checks pass;
- external links return successful statuses, or any provider blocking HEAD/automation is manually verified and reported;
- the first stale-claim search returns no matches;
- `OBSYouTubeUploader` appears only in the Privacy Policy's migration and clean-slate instructions.

- [ ] **Step 7: Commit metadata and tooling**

```bash
git add .htmlvalidate.json package.json package-lock.json public README.md scripts/check-content.mjs
git commit -m "chore: validate and document the v5 site"
```

---

### Task 7: Verify production behavior and presentation

**Files:**
- Modify only if verification finds a defect: `public/*.html`, `public/styles.css`, `scripts/*.mjs`, `.htmlvalidate.json`, `README.md`

**Interfaces:**
- Consumes: complete static site from Tasks 1–6.
- Produces: recorded evidence that local routes, headers, responsive layouts, and accessibility meet the approved specification.

- [ ] **Step 1: Validate the Cloudflare deployment bundle**

Load the `wrangler` and `cloudflare` skills before running Wrangler commands, then run:

```bash
npm run deploy:dry-run
```

Expected: successful dry-run with the static assets directory recognized and no configuration errors.

- [ ] **Step 2: Exercise real Wrangler HTTP routing**

Start `npm run dev` on `http://127.0.0.1:8787`, then run:

```bash
for path in / /privacy /terms /google-oauth; do
  test "$(curl -sS -o /dev/null -w '%{http_code}' "http://127.0.0.1:8787$path")" = 200
done
test "$(curl -sS -o /dev/null -w '%{http_code}' http://127.0.0.1:8787/not-a-route)" = 404
curl -sSI http://127.0.0.1:8787/privacy/ | rg -i '^location: /privacy\r?$'
curl -sSI http://127.0.0.1:8787/ | rg -i 'content-security-policy|x-content-type-options|referrer-policy'
curl -sSI http://127.0.0.1:8787/media/wingman-previews.webp | rg -i 'cache-control'
```

Expected: canonical pages 200, unknown route 404, trailing-slash redirect points to `/privacy`, declared security headers are present, and media receives the configured cache policy.

- [ ] **Step 3: Run automated accessibility checks**

With Wrangler still running:

```bash
for path in / /privacy /terms /google-oauth /not-a-route; do
  npx --yes @axe-core/cli "http://127.0.0.1:8787$path" \
    --chrome-path=/usr/bin/google-chrome --exit
done
```

Expected: zero Axe violations on every page. Fix violations in source; do not add blanket exclusions.

- [ ] **Step 4: Inspect responsive layouts in a browser**

Load the `browser-tools` skill. Inspect all five page types at exactly:

- 1440×900 CSS px;
- 840×625 CSS px;
- 390×844 CSS px.

At each width verify no horizontal overflow, no clipped navigation or actions, readable screenshot crops, 65–72ch legal measure, visible Privacy/Terms links, and wrapped scopes/paths. On the homepage verify the three primary workflows retain equal prominence and the hero still communicates without its image.

- [ ] **Step 5: Verify keyboard and reduced-motion behavior**

Using the browser, tab from the top of every page. Confirm the skip link appears and reaches `<main>`, focus is visible on every interactive element, focus order follows reading order, and no hidden element receives focus. Emulate `prefers-reduced-motion: reduce` and confirm nonessential transitions collapse to effectively zero duration.

- [ ] **Step 6: Measure contrast and inspect screenshot alternatives**

Use browser computed styles or a WCAG contrast calculator to verify normal text at 4.5:1 or better and focus/state boundaries at 3:1 or better on every surface token. Disable images and confirm surrounding copy still identifies Wingman, Download, and each workflow; inspect every image's alt text for a useful description rather than nearby-copy repetition.

- [ ] **Step 7: Re-run factual and final-diff review**

```bash
npm run check
node scripts/check-links.mjs --external
git diff --check
git status --short
git diff 3880dd3 --stat
git diff 3880dd3 -- public README.md package.json scripts .htmlvalidate.json
```

Compare the final diff with the spec. Check for placeholders, dead CSS, hidden sections, debug output, accidental external assets, stale uploader-first metadata, and claims not supported by v5.0.0.

- [ ] **Step 8: Commit verification fixes if needed**

If verification changed files:

```bash
git add public README.md package.json package-lock.json scripts .htmlvalidate.json
git commit -m "fix: resolve v5 site verification findings"
```

If verification changed nothing, record the exact commands and outcomes in the completion report without creating an empty commit.
