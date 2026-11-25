# UI

## How it works
`swarm-ui/` is the swarm's own Next.js dashboard, scaffolded by
`rallypoint add swarm-dashboard`. Project-specific words, colours and nav
live in `swarm-ui/app/swarm/swarm.config.ts` (project-owned). The pages
under `swarm-ui/app/swarm/` read swarm memory from Supabase through the
env vars in `swarm-ui/.env.example`.

Measured in `checks` mode by `ui-build`:
`npm --prefix swarm-ui ci && npm --prefix swarm-ui run build`. A change
that breaks the type-check or the production build fails.

## What to try
- A landing page at `/` that shows the current built portfolio next to the
  swarm's progress, so the product and its makers sit side by side.
  (concept: `show-the-product`)
- Target pages for `generator` and `site` that link each shipped version
  to a screenshot or the built page. (concept: `show-the-product`)
- Theme variables in `swarm.config.ts` matched to the portfolio's tokens.
  (concept: `design-tokens-first`)

## What failed, and why
(nothing buried yet)

## Rules of thumb
- Keep `swarm.config.ts` the single place for project words and colours.
- Never put the swarm secret in the UI or its env; it reads with the anon key.
- Run `npm --prefix swarm-ui run build` before opening a PR.
