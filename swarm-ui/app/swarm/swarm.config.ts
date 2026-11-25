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
    "tagline": "Build a complete personal portfolio website from a single description."
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
