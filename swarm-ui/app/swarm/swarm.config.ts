/**
 * Swarm UI configuration for My Test Website Proj. This file is PROJECT-OWNED:
 * edit freely. Rallypoint wrote it once, from .rallypoint/swarm.json, and never
 * overwrites it (regenerate on purpose with: npx rallypoint swarm ui-config --force).
 *
 * It holds every project-specific word, colour and route the swarm pages print.
 * The field-by-field mapping is documented at the top of ./_lib/config-types.ts.
 */
import {
  DEFAULT_NAV,
  DEFAULT_VOCABULARY,
  type SwarmConfig,
} from "./_lib/config-types";

export const swarmConfig: SwarmConfig = {
  project: {
    "name": "My Test Website Proj",
    "tagline": "A swarm-built portfolio: one description in, a site with a guest counter and guestbook out."
  },
  goal: {
    "title": "Make a cool website",
    "statement": "like a proffesional website"
  },
  measure: {
    "mode": "checks",
    "label": "Checks",
    "unit": "",
    "direction": "higher"
  },
  targets: [
    {
      "id": "generator",
      "name": "Generator",
      "color": "#b7791f",
      "description": "scripts/build.mjs: turns the single description.md into the static site in dist/. Owns what a description can express and how forgiving the parser is."
    },
    {
      "id": "site",
      "name": "Portfolio site",
      "color": "#2f855a",
      "description": "The page a visitor sees: layout, typography, theming, responsiveness and accessibility of the generated site. Basic site first."
    },
    {
      "id": "server",
      "name": "Guest server",
      "color": "#9b2c6f",
      "description": "A small local Node server (node:sqlite, no dependencies) that serves dist/ and adds the guest counter, then guest messages, with end-to-end tests. Local only."
    },
    {
      "id": "ui",
      "name": "UI",
      "color": "#2f5bd3",
      "description": "The swarm's own frontend, grown from the Rallypoint scaffold."
    }
  ],
  vocabulary: { ...DEFAULT_VOCABULARY, ...{
    "shipped": "shipped",
    "buried": "buried",
    "version": "version"
  } },
  nav: [...DEFAULT_NAV],
  theme: {
    cssVars: {},
  },
};
