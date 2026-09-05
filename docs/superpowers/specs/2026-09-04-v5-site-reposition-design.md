# FlyGD Wingman v5 Site Repositioning

## Goal

Reposition `wingman.zoolanders.vip` around FlyGD Wingman v5: an EVE Online wormhole multiboxing toolkit that also uploads fight footage. Correct the homepage, OAuth page, privacy policy, terms, metadata, and project documentation so they match the tagged v5.0.0 application.

The site remains a static Cloudflare Workers Assets project with hand-written HTML and CSS, no build step, no runtime JavaScript, no client-side analytics, and no third-party frontend assets. The Privacy Policy must separately disclose request processing by Cloudflare as the hosting provider and explain the effect of the enabled Workers observability configuration rather than treating infrastructure logging as product analytics.

## Source of truth

Implementation claims must be checked against `/mnt/c/dev/flygd-wingman` at commit `3e8611c3c8750fb0e440297693161797a3d2d8e6`, tagged `v5.0.0`.

Current external facts confirmed by the owner:

- Google OAuth verification is complete. The unverified-app warning must be removed.
- `technical@zoolanders.vip` is the contact for privacy, Google-account, and sensitive data questions. GitHub Issues remains the public bug and feature channel.

Do not state an exact YouTube upload quota. State only that Google API quota is shared across the application's Google Cloud project.

## Product position

The opening product definition is:

> An EVE Online multiboxing toolkit for wormhole space, which also uploads your fight footage to YouTube.

The site assumes EVE fluency. It explains Wingman workflows and boundaries without explaining wormhole terminology.

Three workflows are co-primary:

1. **Previews:** mirror running EVE clients in always-on-top preview windows and switch clients through explicit user input.
2. **Bookmarks:** provide 18 FlyGD wormhole mapping and rolling keybinds, scoped to enabled EVE windows.
3. **Uploading:** review selected fight recordings, play or rename them, stitch compatible clips, upload to YouTube, and optionally post matching combat logs to Discord.

Supporting capabilities follow:

- gamelog alerts and the fleet combat bar;
- Profiles, backups, settings copy, account identification, and formations;
- Skills readiness, plans, and character groups;
- Fittings library, collections, and explicit additive copies;
- centralized EVE character authorization through EVE SSO and ESI;
- guided Wingman updates and optional FightRecorder management.

## Homepage structure

### 1. Command-deck hero

Use an asymmetric hero with concise copy on the left and a current application screenshot on the right. Include:

- category: wormhole multiboxing toolkit;
- an operational headline in the spirit of “Fly more clients. Miss less.”;
- one paragraph covering client awareness, keybinds, and fight footage;
- primary Download action and secondary GitHub action;
- status strip: Windows, v5.0.0/current release, GPL-3.0-only, no FlyGD backend.

Do not reuse the old uploader-first title or description metadata.

### 2. Primary workflows

Present Previews, Bookmarks, and Uploading as three equal workflow bands. Each band should state:

- what the user does;
- what Wingman does;
- one important boundary or operational detail.

Avoid a repeated icon-card grid.

### 3. Client awareness

Group gamelog alerts and the fleet combat bar as observation tools. Explain:

- alerts cover combat start, warp disruption, and decloak conditions;
- foreground-client sound suppression and filtering reduce false interruption;
- the combat bar reads recent local gamelog activity;
- missing logs are shown as missing data;
- Wingman does not automate gameplay or move/resize EVE client windows.

### 4. Fleet preparation

Describe Profiles, Skills, and Fittings as occasional preparation work:

- profile backups precede destructive settings changes where the application supports them;
- Skills compares characters with local plans and training queues;
- Fittings maintains a local curated library and copies selected fits additively;
- Settings → Characters provides shared EVE authorization for Skills and Fittings.

### 5. Fight footage

Retain a complete OBS/YouTube story without presenting it as the whole product:

1. OBS or FightRecorder creates a recording.
2. Wingman notices the completed file.
3. The user selects, reviews, plays, renames, or stitches recordings.
4. The user explicitly uploads selected footage.
5. If a Discord webhook is configured, matching combat logs can post automatically after a successful upload. A separate “Post the last hour” action is also available.

State that core installation is per-user. Qualify the prerequisite claim: WebView2 is required and the installer can bootstrap it; the optional default-selected FightRecorder OBS plugin may require one UAC elevation prompt when installed under Program Files.

### 6. Trust and data boundaries

Provide a concise network map:

- **Google/YouTube:** desktop OAuth, token refresh, and selected video uploads.
- **CCP:** EVE SSO authorization and ESI reads or explicit fitting writes.
- **GitHub:** one automatic Wingman release check per startup; explicit Wingman and FightRecorder release downloads/checks.
- **Discord:** configured webhook posts only.
- **Microsoft:** WebView2 bootstrap download during installation when the runtime is absent.
- **FlyGD:** no backend receives credentials, videos, EVE data, or usage events.

Distinguish “no analytics, crash reporting, or usage telemetry” from the shipped update check and local gamelog telemetry package.

### 7. Open source and support

State that the application is GPL-3.0-only. Link Download, Repository, Releases, Issues, and `mailto:technical@zoolanders.vip`. Do not claim the marketing site has a separate MIT licence.

## Navigation

Homepage header:

- Toolkit
- Fight footage
- Trust
- Download
- GitHub

Privacy Policy and Terms remain clearly available from the trust section and every page footer. Legal and OAuth pages use a compact navigation that does not obscure their review purpose.

## Visual direction

Use the approved **Command deck** direction recorded in `DESIGN.md`:

- dark, app-native purple palette;
- current application screenshots;
- compact operational readouts;
- asymmetric hero;
- varied section rhythm rather than identical cards;
- system fonts and no external requests;
- CSS-only feedback with reduced-motion support.

The approved screenshot source is `/mnt/c/dev/flygd-wingman/tmp/screens/20260905T034121Z`. Its manifest records product SHA `3e8611c` and 33 successful captures. Prefer a small, purposeful set from:

- `01-uploader.png` for fight footage;
- `07-settings-bookmarks.png` for bookmark keybinds;
- `08-settings-previews.png` or `10-settings-previews-table.png` for previews;
- `16-settings-alerts.png` for client awareness;
- `19-profiles.png`, `22-skills.png`, and `23-fittings.png` for fleet preparation.

Inspect each selected source image against the tagged application before copying it into `public/`. Crop and optimize committed derivatives for the layout; do not ship all 33 captures or reference files outside the site repository at runtime.

Update the Open Graph image if its uploader-first wording or old palette no longer matches the page. Preserve existing icon formats unless the product logo source shows that they are stale.

## Privacy Policy changes

Rewrite the policy around v5 data handling.

### Google and YouTube

- Scope remains `https://www.googleapis.com/auth/youtube.upload` only.
- Google token remains plaintext JSON under `%LOCALAPPDATA%\FlyGD Wingman\token.json` for a normal v5 installation.
- Uploads use `videos.insert` only after explicit selection and upload action.
- Wingman stores the last uploaded channel ID and channel title in settings, and stores recording-path to YouTube-URL history in `links.json` so completed links remain available in the recording list.
- `links.json` is retained locally without automatic pruning. Explain that removing Google access does not delete this local history, and deleting local history does not revoke Google access or remove uploaded videos from YouTube.
- Include clear instructions for revoking Wingman's Google access and separately deleting local Google tokens, channel metadata, and upload-link history.
- Remove the unverified-app warning.
- Explain shared project quota without an exact number.

### EVE SSO and ESI

Disclose the four requested scopes:

- `esi-fittings.read_fittings.v1`
- `esi-fittings.write_fittings.v1`
- `esi-skills.read_skills.v1`
- `esi-skills.read_skillqueue.v1`

Explain the local PKCE loopback flow at `127.0.0.1`, the absence of a client secret in this public-client flow, and explicit additive fitting writes.

List relevant stored EVE data at a useful category level:

- character identity and authorization metadata;
- DPAPI-protected EVE refresh credentials;
- skill, queue, attributes, plan, and group state;
- fittings, collections, descriptions, and copy evidence;
- local profile, preview, bookmark, and EVE-settings backups.

Avoid a brittle exhaustive filename list in prose. Provide the current application data directory and explain that migration from `%LOCALAPPDATA%\OBSYouTubeUploader\` is automatic. If the directory rename fails with an operating-system error, Wingman continues using the legacy directory instead; there is no migration consent prompt.

### Discord, GitHub, local files, and deletion

- Discord webhook remains plaintext in settings.
- Explain automatic post-upload combat-log behavior and the explicit last-hour action.
- Explain GitHub update checks and explicit downloads.
- Keep recording deletion warnings and add that Wingman can rename selected recordings.
- Give current clean-slate instructions that first tell the user to exit Wingman, then remove the active `%LOCALAPPDATA%\FlyGD Wingman\` directory. Where automatic migration failed, the active directory may remain `%LOCALAPPDATA%\OBSYouTubeUploader\`; removing both locations is the safe clean-slate instruction when the active location is unknown.
- Preserve disclosure that Cloudflare may process ordinary web request information, including IP addresses, as the site's hosting provider. Determine and describe what the enabled Workers observability setting records for this assets-only deployment, or disable it before publishing a broader no-logging claim.
- Direct sensitive requests to `technical@zoolanders.vip`.

## Terms changes

- Replace MIT terms with accurate GPL-3.0-only language and link to the repository licence.
- Describe Wingman as an EVE multiboxing toolkit with fight-footage uploading.
- Remove the false claim that Wingman never interacts with EVE clients or servers.
- Remove the existing prohibition on scripting, automating, modifying, or driving the application. It imposes an additional use restriction that is incompatible with the rights granted by GPL-3.0-only.
- State the automation boundary only as a description of the official build: Wingman responds to explicit user input, mirrors/activates clients, reads local files, and uses authorized ESI, but does not automate gameplay. Do not turn that shipped-product description into a contractual restriction on running, studying, modifying, or redistributing GPL software.
- Add Google/YouTube, CCP EVE SSO/ESI, Discord, GitHub, Microsoft WebView2, OBS, and FightRecorder to relevant third-party provisions.
- Correct installation and credential-security language.
- Use the sensitive-support email and public issue tracker for their distinct purposes.

## Google OAuth page

Keep the page narrowly optimized for OAuth review:

- update the general product description to match v5;
- retain the exact single Google scope and its upload-only purpose;
- state that EVE features are independent and do not use Google data;
- remove all unverified-app instructions;
- link prominently to Privacy Policy, Terms, and the main site.

## Project documentation and metadata

Update:

- page titles and descriptions;
- Open Graph and structured SoftwareApplication data;
- site README product description, accuracy policy, licence language, and editing guidance;
- any stale installer naming or network-destination claims;
- policy “last updated” dates.

The README should state that product claims are verified against v5.0.0 and should be rechecked for each product release.

## Error and edge behavior

- All navigation remains usable without JavaScript.
- Long scopes, paths, and URLs wrap without horizontal scrolling.
- Screenshot failure does not hide the product name, download action, or workflow explanation.
- Narrow layouts retain every workflow and trust disclosure.
- Focus indicators remain visible against all surfaces.
- The existing static 404 behavior and canonical URLs remain unchanged.

## Verification

1. Run `npm run check` for internal links and fragment anchors.
2. Run `node scripts/check-links.mjs --external` for outbound links.
3. Run `npm run deploy:dry-run` to validate Workers Assets configuration.
4. Run `npx html-validate "public/*.html"` with a checked-in minimal configuration if the default rules conflict with intentional static markup; no validation errors may remain.
5. Start `wrangler dev`, then assert over HTTP that `/` and `/privacy` return 200, `/privacy/` redirects to `/privacy`, and an unknown route returns the custom page with status 404. Also verify the declared security and cache headers on representative HTML and image responses.
6. Inspect every page in Chromium at 1440×900, 840×625, and 390×844 CSS pixels. At each width, check horizontal overflow, readable hierarchy, image cropping, path/scope wrapping, and persistent access to Privacy Policy and Terms.
7. Run an automated accessibility pass with Axe or Lighthouse against the local homepage, OAuth page, Privacy Policy, Terms, and 404 page. Then manually verify keyboard order, skip navigation, visible focus, meaningful screenshot alternatives, and the `prefers-reduced-motion: reduce` rendering. Measure text and focus-indicator contrast against WCAG 2.2 AA thresholds.
8. Search all site text for stale claims: `MIT`, `unverified`, `100 uploads`, `only two`, `no update check`, and the old installer name. `OBSYouTubeUploader` is permitted only in the Privacy Policy's documented legacy migration and clean-slate instructions; treat every other occurrence as stale.
9. Re-audit factual claims against the tagged v5.0.0 repository before completion, including stored Google-derived metadata, retention, revocation versus deletion, EVE credential protection, network destinations, and GPL rights.

## Out of scope

- Changes to the Wingman application.
- New product features or roadmap claims.
- Analytics, cookies, consent banners, or third-party frontend dependencies.
- Runtime JavaScript or a site framework.
- Creating or publishing a GitHub repository for this site.
- Deploying to production without a separate explicit request.
