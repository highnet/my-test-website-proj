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

**The dashboard is separate from the product** (the brief). It shows the
swarm's progress; it is not the portfolio and must not embed or rebuild it.

## What to try
- A clear home at `/` that says what this swarm is building and links to
  the targets, results and board.
- Target pages that make each target's latest checks result easy to read.
  (concept: `measure-what-you-claim`)
- Theme variables in `swarm.config.ts` so the dashboard has its own
  consistent look. (concept: `design-tokens-first`)

Every UI task ends with `/impeccable critique` on the pages it touched,
fixing every P0/P1 before refereeing.

## What failed, and why
(nothing buried yet)

## Rules of thumb
- Keep `swarm.config.ts` the single place for project words and colours.
- Never put the swarm secret in the UI or its env; it reads with the anon key.
- Run `npm --prefix swarm-ui run build` before opening a PR.
