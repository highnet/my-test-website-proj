# Portfolio site

## How it works
The site is what `npm run build` writes to `dist/`: today one `index.html`
plus `styles.css` (the CSS lives in `STYLES` in `scripts/build.mjs`). Open
`dist/index.html` in a browser to look at it.

Measured in `checks` mode by `site`: `npm run build && npm run check:site`.
`scripts/checks/site.mjs` enforces doctype, `lang`, charset, viewport,
title, meta description, exactly one `<h1>`, a `<main>` landmark, alt text
on every image, in-page anchors that resolve, local assets that exist, and
a 100 KB HTML+CSS budget. Adding a rule is progress; loosening one needs a
reason in the pull request.

"Professional" (the goal statement) means it looks deliberate on a phone
and a desktop, in light and dark, and a stranger can find the person's
work and contact in seconds.

## What to try
- A real visual identity: type scale, spacing rhythm, an accent colour the
  description can set. (concept: `design-tokens-first`)
- Responsive layout for project cards; check at 375 px and 1280 px.
  (concept: `design-tokens-first`)
- Extend `check:site` with contrast checks on the token colours and a
  heading-order rule. (concept: `measure-what-you-claim`)
- Open Graph and favicon so shared links look finished.
  (concept: `one-source-of-truth`)

## What failed, and why
(nothing buried yet)

## Rules of thumb
- No JavaScript is needed for a portfolio page; add it only for a clear win.
- Every claim about accessibility or performance needs a check that
  enforces it.
- Keep the sample `description.md` rendering well: it is the demo.
