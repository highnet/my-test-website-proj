# Brief: Swarm dogfood portfolio

> A dogfood demo of Rallypoint Swarm: a fresh repository goes from pitch to genesis to a running conductor on Rallypoint as shipped, with a small portfolio site as the thing it builds, so every rough edge shows up here before real users hit it.

**Status:** confirmed 2026-11-25 (interview with the operator, "that's right")
**Kind:** other (a test bed for the swarm, with a website as its subject)

## The real challenge
Dogfooding the setup. The point is not the website. The point is that pitch,
genesis, init, plan and the conductor work smoothly on shipped Rallypoint,
and that friction found here (for example the `init` label and empty-repo
bugs) is fixed upstream.

## The picture
After genesis merges, the operator starts the conductor locally with a few
agents, watches the swarm dashboard and the pull requests come in, and notes
each friction point to fix in `highnet/rallypoint`.

## Must have
Functions, in this order:
- A basic portfolio website, generated from one `description.md` by the
  generator (`npm run build` → `dist/`). Get the basic site right first.
- Then a **guest counter**: the site counts visits and shows the count.
- Then **guest messages**: visitors can leave a short message (a guestbook)
  and see the messages others left.
- Counter and messages store their data in **local SQLite**, for testing
  only.
- The swarm dashboard (`swarm-ui/`) stays a **separate** app from the
  product. Product work does not go into the dashboard, and the dashboard
  is not the product.

## Should feel
- Like a professional personal site (the goal statement), even with sample
  content.
- Small and boring to run: one command to build, one to serve locally.

## Must not be
- Deployed or hosted anywhere. Local only.
- Behind guest accounts or a login. Guests post without signing in.
- A moderation system: no admin panel, approvals or spam tooling. Basic
  length limits and escaping only.
- About a real person. The portfolio uses sample content.

## References
| Reference | Keep | Avoid |
|---|---|---|
| Swarm Arena (the worked example in genesis) | A swarm growing a product while the dashboard shows progress | A UI that is the product; here the dashboard is separate |
| Classic web guestbooks and hit counters | The simple idea: count visits, leave a note | Anything needing moderation, accounts or hosting |

## Constraints
- Already decided: the generator from `description.md` stays; SQLite
  locally; swarm memory lives in the local Supabase (separate from product
  data); measure mode `checks`.
- Can't change: the operator's `goal`, `ui.project.name` and `conductor`
  settings in `.rallypoint/swarm.json`.
- Others with a say: none. This is the operator's test repository.

## Success looks like
- The checks stay green: generator tests, the site build and quality check,
  the dashboard build, and, once the counter and messages exist, an
  end-to-end test proving both work against SQLite.
- The conductor runs the plan with little operator help, and the friction
  it hits becomes upstream fixes.

## Open assumptions
- "Guest counter" counts page views of the home page, not unique visitors.
- Serving the counter and messages needs a small local Node server
  (`node:sqlite`, no new dependencies), since `dist/` is static today.
- Messages show newest first, with a name (optional) and the text.

## First step
Make the generated basic site solid (structure, tokens, responsive, a11y
checks), then add the local server with SQLite and the guest counter.
