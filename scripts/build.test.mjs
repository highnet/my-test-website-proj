// Swarm check "generator": node --test scripts/
import assert from "node:assert/strict";
import { test } from "node:test";
import { parse, render } from "./build.mjs";

const sample = `# Sam Sample

Writes software.

## Projects

- **One**: first thing
- Two

## Contact

- Email: sam@example.com
`;

test("parse reads the name, intro and sections", () => {
  const doc = parse(sample);
  assert.equal(doc.name, "Sam Sample");
  assert.deepEqual(doc.intro, [{ type: "p", text: "Writes software." }]);
  assert.deepEqual(doc.sections.map((s) => s.title), ["Projects", "Contact"]);
  assert.deepEqual(doc.sections[0].blocks[0], { type: "ul", items: ["**One**: first thing", "Two"] });
});

test("parse requires a name heading", () => {
  assert.throws(() => parse("## Only a section\n"), /needs a "# Your name" heading/);
});

test("render escapes HTML and links sections", () => {
  const html = render(parse("# A <b>&</b>\n\n## Work & play\n\nHi\n"));
  assert.match(html, /<title>A &lt;b&gt;&amp;&lt;\/b&gt;<\/title>/);
  assert.match(html, /<a href="#work-play">Work &amp; play<\/a>/);
  assert.match(html, /<section id="work-play">/);
});

test("render turns emails into mailto links", () => {
  assert.match(render(parse(sample)), /<a href="mailto:sam@example.com">sam@example.com<\/a>/);
});
