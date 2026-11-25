#!/usr/bin/env node
// Swarm check "site": the built portfolio meets a baseline of quality.
//
//   node scripts/checks/site.mjs [dist]
//
// Exits 0 when every rule holds, 1 otherwise, printing each failure.
// Dependency-free on purpose so it runs anywhere the swarm runs. Rules may be
// added (that is progress); loosening one needs a reason in the pull request.

import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const dist = resolve(process.argv[2] ?? "dist");
const page = resolve(dist, "index.html");
const BUDGET_BYTES = 100 * 1024; // HTML + CSS, before any images

const failures = [];
const fail = (message) => failures.push(message);

if (!existsSync(page)) {
  console.error(`fail: ${page} does not exist; run npm run build first`);
  process.exit(1);
}
const html = readFileSync(page, "utf8");

if (!/^<!doctype html>/i.test(html.trimStart())) fail("missing <!doctype html>");
if (!/<html[^>]*\slang="[a-z-]+"/i.test(html)) fail("<html> has no lang attribute");
if (!/<meta[^>]+charset=/i.test(html)) fail("no charset meta");
if (!/<meta[^>]+name="viewport"/i.test(html)) fail("no viewport meta (page will not be responsive)");
if (!/<title>[^<]+<\/title>/i.test(html)) fail("missing or empty <title>");
if (!/<meta[^>]+name="description"[^>]+content="[^"]+"/i.test(html)) fail("missing meta description");

const h1s = html.match(/<h1[\s>]/gi) ?? [];
if (h1s.length !== 1) fail(`expected exactly one <h1>, found ${h1s.length}`);
if (!/<main[\s>]/i.test(html)) fail("no <main> landmark");

for (const img of html.match(/<img\b[^>]*>/gi) ?? []) {
  if (!/\salt="/i.test(img)) fail(`image without alt text: ${img}`);
}

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const [, anchor] of html.matchAll(/href="#([^"]*)"/g)) {
  if (anchor && !ids.has(anchor)) fail(`link to #${anchor} has no matching id`);
}
for (const [, href] of html.matchAll(/(?:href|src)="([^"#:?]+)"/g)) {
  if (!href.startsWith("/") && !existsSync(resolve(dist, href))) fail(`local asset ${href} is missing from ${dist}`);
}

let bytes = statSync(page).size;
const css = resolve(dist, "styles.css");
if (existsSync(css)) bytes += statSync(css).size;
if (bytes > BUDGET_BYTES) fail(`HTML+CSS is ${bytes} bytes, over the ${BUDGET_BYTES} byte budget`);

if (failures.length) {
  for (const message of failures) console.error(`fail: ${message}`);
  process.exit(1);
}
console.log(`site ok: ${ids.size} anchors, ${bytes} bytes of HTML+CSS`);
