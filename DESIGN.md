# Design System

## Direction

**Command deck.** The physical scene is an experienced wormhole pilot checking a second monitor in a dim room before or during fleet activity. The site is dark, compact, and operational, but remains a marketing and trust surface rather than a game overlay.

## Theme

Dark only. The background uses subtly purple-tinted near-black neutrals. Surfaces are opaque and clearly separated; blur and glass effects are not part of the visual language.

## Color Strategy

Committed purple, aligned with the current Wingman application.

- Background: purple-tinted near-black.
- Surface: slightly lighter opaque panels and bands.
- Primary accent: Wingman purple for the main action, selected states, and key operational emphasis.
- Link and informational accent: cyan, used sparingly.
- Warning and destructive accent: red.
- Text: warm, purple-tinted near-white with two readable muted levels.

All implementation colors use OKLCH tokens. Text and interactive-state contrast must meet WCAG 2.2 AA.

## Typography

Use the local Windows/system sans stack. Do not add external font requests. Create hierarchy through a committed fluid scale, strong weight contrast, compact heading tracking, and controlled line length.

Monospace is reserved for paths, OAuth scopes, compact status labels, and operational readouts. It is not the default voice.

## Layout

- Maximum content width approximately 1180px with fluid side padding.
- Hero: product stage. Copy sits left; an oversized application screenshot enters from the right, runs past the page gutter, and is clipped by the hero rather than by the page.
- Second fold: a three-panel screenshot strip for Bookmarks, Uploading, and Fittings, placed directly under the hero so real product surfaces arrive before any explanatory prose.
- Primary workflows: three equal horizontal or vertical bands, not repeated icon cards.
- Supporting capabilities: varied editorial rhythm using grouped feature lists, operational readouts, and focused screenshots.
- Trust content: restrained prose and data-boundary rows, optimized for scanning and review.
- Legal pages: 65–72ch reading width with a compact table of contents.

At narrow widths, all compositions linearize without hiding or truncating information. Actions become full width only where needed for comfortable tapping.

## Components

### Header

Compact sticky navigation with the Wingman mark, Toolkit, Fight footage, Trust, Download, and GitHub. Avoid decorative blur.

### Hero

**Product stage.** The application window is the hero, not an illustration beside it. It occupies roughly 60% of the desktop composition and is the first thing the page proves.

- Copy column: product category, a short two-sentence headline set large with tight tracking, one explanatory sentence, Download and GitHub actions.
- A compact monospace status line replaces the four-cell readout: Windows, GPL-3.0-only, no backend, and a link to the current release.
- Screenshot: a real v5 capture, framed with an opaque surface, a purple-tinted border, and a soft drop shadow.
- Atmosphere: a restrained purple radial glow sits behind the screenshot. No 3D tilt, no rasterized text, no entrance animation.
- Stacked below 1000px the order is copy, then the screenshot at full column width; the headline and lede measures widen so the copy uses the page.

### Workflow strip

The second fold is three screenshot panels labelled Bookmarks, Uploading, and Fittings. Each panel is a zoomed CSS crop of a committed screenshot, positioned on that workflow's content rather than on the window title bar, because a whole 1600px capture scaled into a third of the page is unreadable. Panels carry an opaque monospace caption over a bottom scrim, and they stack to one column below 900px with the crop re-tuned so the content stays legible.

### Workflow bands

Each primary workflow gets a number, direct title, short outcome, and selected details. They share prominence but not a generic card template. Screenshots for these workflows live in the workflow strip above rather than repeating inside the bands.

### Operational readouts

Small, static rows communicate boundaries and capabilities. They resemble reliable status summaries, not fictional live telemetry.

### Buttons and links

One purple primary action per section at most. Secondary actions use opaque neutral surfaces and full borders. Links use cyan and remain visibly links.

### Notices

Use full borders or background changes with a clear heading or icon. Do not use a thick colored side stripe.

## Imagery

Use only current screenshots and brand assets from the v5 product repository. Screenshots lead the homepage: the hero capture and the three strip panels are the page's primary visual argument, and no screenshot is repeated further down the page. The approved capture set is `/mnt/c/dev/flygd-wingman/tmp/screens/20260905T034121Z`, whose manifest records product SHA `3e8611c` and 33 successful captures. Select only the few images that clarify the homepage narrative, verify their visible state against v5.0.0, then crop, optimize, and commit local derivatives. Framing and zoom are done in CSS against those committed files, so a crop can be retuned without recutting an asset. Do not load images from the product checkout or GitHub at runtime. Alt text should state the visible workflow, including what a crop actually shows, rather than repeat nearby copy.

## Motion

No runtime JavaScript. Use only brief transform, opacity, and color transitions for hover and focus feedback. Disable nonessential transitions under `prefers-reduced-motion`. Do not add entrance or scroll animations.

## Voice

Plain, specific, and short. Assume EVE fluency. Name Wingman concepts exactly as the application does. Avoid em dashes, inflated adjectives, apology language, and headings repeated in their first sentence.
