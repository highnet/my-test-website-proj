# Guest server

## How it works
Nothing exists yet; the first `server` task creates it. The shape the brief
(`docs/briefs/swarm-dogfood-portfolio.md`) and `PRODUCT.md` call for:

- `server/server.mjs`: a small Node HTTP server, **no dependencies**. It
  serves the built `dist/` and adds JSON endpoints.
- Storage is **local SQLite** through `node:sqlite` (built into Node 22; it
  prints an experimental warning, which is fine). The database file lives
  under a gitignored path such as `data/guest.db`. Never commit a database.
- `npm start` builds and serves the site locally. Nothing is deployed.

Order matters: the **guest counter** first (count home-page views, show the
count), then **guest messages** (post a short message with an optional
name, list newest first).

Measured in `checks` mode by `tests`: `npm test` runs every `*.test.mjs` in
the repository, so end-to-end tests in `server/*.test.mjs` count from the
day they land. They should start the server on a free port with a
temporary database, make real HTTP requests, and shut down cleanly.

## What to try
- Start the server from tests with `port: 0` and a temp-dir database, so
  tests never collide or leave files behind. (concept: `test-end-to-end`)
- Keep the page working without JavaScript: the count and messages render
  server-side or degrade to a plain form post. (concept: `test-end-to-end`)
- Validate and escape every message: length limits, trimmed names, HTML
  escaped on output. (concept: `fail-loud-on-bad-input`)

## What failed, and why
(nothing buried yet)

## Rules of thumb
- Out of scope (the brief): hosting, accounts or login, moderation and spam
  tooling. Do not add them.
- Product data stays in SQLite, never in the swarm's Supabase memory.
- Every endpoint ships with an end-to-end test in the same pull request.
