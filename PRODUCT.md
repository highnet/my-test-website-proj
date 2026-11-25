# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML/CSS generated from one Markdown file by a dependency-free
Node script (`scripts/build.mjs`: `description.md` → `dist/`). The guest
counter and guest messages add a small local Node server using `node:sqlite`
(no new dependencies). Local only; there is no deploy target. Source: the
confirmed brief, `docs/briefs/swarm-dogfood-portfolio.md`.

## Users

- **The operator** (primary): runs Rallypoint Swarm on this repository to
  dogfood the setup end to end. They judge the product by whether the swarm
  can grow it smoothly, and note every friction point to fix upstream.
- **A visitor** to the portfolio (the audience the site is written for):
  reads about the sample person, sees the visit count and leaves a short
  message. Visitors are hypothetical; the site only ever runs locally.

## Product Purpose

A test bed for Rallypoint Swarm. The product itself is a personal portfolio
site generated from a single description, first a basic site done well, then
a guest counter, then guest messages. Success is the swarm doing that with
its checks green and little operator help, not the site's reach.

## Positioning

One Markdown description in, a complete portfolio out, grown feature by
feature by an agent swarm rather than hand-built.

## Operating Context

- Built with `npm run build`, checked by `npm test`, `npm run check:site`
  and the dashboard build (the swarm's `checks` measure).
- Grown by the swarm: issues from `plan.json`, one branch and pull request
  per issue, reviewed and merged by other agents.
- The swarm dashboard in `swarm-ui/` is a **separate app**. It shows the
  swarm's progress and is not part of the product.

## Capabilities and Constraints

- Confirmed: generator from `description.md` stays; guest counter; guest
  messages (guestbook); data in local SQLite, for testing only.
- Not in scope: hosting or deployment, guest accounts or login, moderation
  or spam tooling (length limits and escaping only).
- Open (assumed in the brief, confirm when building): the counter counts
  home-page views, not unique visitors; messages show newest first with an
  optional name.

## Evidence on Hand

- `description.md`: sample content for a made-up person, "Alex Example",
  clearly marked as a sample. There is no real person, client, testimonial,
  metric or project to show; future work must not invent any.

## Product Principles

1. The swarm is the point: prefer changes that are small, testable and easy
   for another agent to review.
2. Every feature arrives with a check that proves it (the measure is
   `checks`); a claim without a check is not done.
3. One description is the source of truth for the person's content.
4. Keep it local and boring to run: one command to build, one to serve.

## Accessibility & Inclusion

The site check enforces a baseline (language, viewport, single `h1`,
landmarks, alt text, working anchors). No product-specific standard beyond
that was set.
