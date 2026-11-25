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
    "tagline": "A portfolio website, built from one description."
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
      "description": "scripts/build.mjs: turns the single description.md into the site. Owns what a description can express (sections, projects, links, images, metadata) and how forgiving the parser is."
    },
    {
      "id": "site",
      "name": "Portfolio site",
      "color": "#2f855a",
      "description": "The built portfolio in dist/: layout, typography, theming, responsiveness, accessibility and performance of the page a visitor sees."
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
