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
- Hero: asymmetric split, copy left and a real application screenshot entering from the right.
- Primary workflows: three equal horizontal or vertical bands, not repeated icon cards.
- Supporting capabilities: varied editorial rhythm using grouped feature lists, operational readouts, and focused screenshots.
- Trust content: restrained prose and data-boundary rows, optimized for scanning and review.
- Legal pages: 65–72ch reading width with a compact table of contents.

At narrow widths, all compositions linearize without hiding or truncating information. Actions become full width only where needed for comfortable tapping.

## Components

### Header

Compact sticky navigation with the Wingman mark, Toolkit, Fight footage, Trust, Download, and GitHub. Avoid decorative blur.

### Hero

Product category, concise operational headline, one explanatory paragraph, Download and GitHub actions, a real v5 screenshot, and a four-item status strip for Windows, GPL-3.0-only, local-first operation, and current release.

### Workflow bands

Each primary workflow gets a number, direct title, short outcome, selected details, and optional screenshot crop. They share prominence but not a generic card template.

### Operational readouts

Small, static rows communicate boundaries and capabilities. They resemble reliable status summaries, not fictional live telemetry.

### Buttons and links

One purple primary action per section at most. Secondary actions use opaque neutral surfaces and full borders. Links use cyan and remain visibly links.

### Notices

Use full borders or background changes with a clear heading or icon. Do not use a thick colored side stripe.

## Imagery

Use only current screenshots and brand assets from the v5 product repository. Optimize and commit them locally. Alt text should state the visible workflow rather than repeat nearby copy.

## Motion

No runtime JavaScript. Use only brief transform, opacity, and color transitions for hover and focus feedback. Disable nonessential transitions under `prefers-reduced-motion`. Do not add entrance or scroll animations.

## Voice

Plain, specific, and short. Assume EVE fluency. Name Wingman concepts exactly as the application does. Avoid em dashes, inflated adjectives, apology language, and headings repeated in their first sentence.
