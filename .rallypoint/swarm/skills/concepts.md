# Concepts

A **concept** is an idea general enough to try on more than one target:
"reuse work between steps", "spend the time budget instead of stopping
early", "test the risky path first". Concepts are how the swarm learns
across attempts. When an idea gains on one target, the strategist ports it
to the others, and the concepts page shows what carried over.

## Using concepts

- Give every experiment issue a concept id (`concept` in `plan.json`).
- After a merge, the merger records the trial:
  `swarm concept trial <id> --target <t> --outcome gained --delta <d> --ref #<n>`.
- A burial with `--concept <id>` records a `lost` trial automatically.
- Use `neutral` when the change shipped for other reasons but moved
  nothing.

## The concepts

Genesis seeds this list, and the steward refines the descriptions. Add new
ones with `swarm concept add`. Each entry is the id, the name, then one or
two lines on what it is and where it should help.

- `structure-from-prose`, Structure from prose: infer richer structure
  (cards, timelines, link lists) from plain writing instead of asking the
  author for markup. Helps `generator`, and `site` gets better material.
- `one-source-of-truth`, One source of truth: every fact on the page
  (name, links, colours, metadata) comes from `description.md` once and is
  reused everywhere: page, meta tags, Open Graph, the dashboard.
- `fail-loud-on-bad-input`, Fail loud on bad input: reject or clearly
  report what cannot be rendered well (missing alt text, unreadable
  sections) rather than shipping a quietly broken page.
- `design-tokens-first`, Design tokens first: define type scale, spacing
  and colour as variables, then build with them. Helps `site` and `ui`
  look consistent and makes theming a one-line change.
- `measure-what-you-claim`, Measure what you claim: every quality claim
  (accessible, fast, responsive) gets a rule in a check before or with the
  change that claims it.
- `test-end-to-end`, Test end to end: prove a feature through the real
  path (build, serve, HTTP request, rendered page) rather than mocks. Helps
  `server` most, and `site` through the built page.
