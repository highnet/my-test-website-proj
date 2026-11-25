# Generator

## How it works
`scripts/build.mjs` reads `description.md` and writes `dist/index.html` and
`dist/styles.css`. `parse()` turns a small Markdown subset into
`{name, intro, sections[]}`, and `render()` turns that into HTML. Both are
exported and unit-tested in `scripts/build.test.mjs`.

Measured in `checks` mode: `tests` runs `npm test`; `site` runs
`npm run build && npm run check:site`, so any generator change that produces
an invalid page fails there too. No timing noise: checks pass or they don't.

The contract is the pitch: **one description in, a complete portfolio out.**
The person writing `description.md` should never need to touch HTML, CSS or
config to get a professional result.

## What to try
Read `docs/briefs/swarm-dogfood-portfolio.md` and `PRODUCT.md` first: the
description is the single source of the sample person's content.

- Recognise common section shapes (Projects, Experience, Contact) and give
  them richer structure: a project card with title, one-liner and link;
  a dated timeline for experience. (concept: `structure-from-prose`)
- Optional front matter at the top of `description.md` (role, location,
  accent colour, social links) that degrades gracefully when absent.
  (concept: `one-source-of-truth`)
- Images: `![alt](path)` copied into `dist/`, with alt text required.
  (concept: `fail-loud-on-bad-input`)
- Clear, line-numbered errors for descriptions the parser cannot read.
  (concept: `fail-loud-on-bad-input`)

## What failed, and why
(nothing buried yet)

## Rules of thumb
- Keep it dependency-free unless a dependency clearly pays for itself;
  every check runs in a fresh checkout.
- Every new syntax gets a test in `scripts/build.test.mjs` and an example
  in `description.md`.
- Escape everything that comes from the description. No raw HTML pass-through.
