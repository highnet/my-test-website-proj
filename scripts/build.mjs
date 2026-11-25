#!/usr/bin/env node
// Builds the portfolio site from one description file.
//
//   node scripts/build.mjs [description.md] [outDir]
//
// Seed version written by swarm genesis: it understands a small Markdown
// subset (one "# Name", an intro paragraph, "## Section" headings with
// paragraphs and "- " bullets, **bold**, and bare https links). Growing this
// into a complete generator is the `generator` target's work.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const source = resolve(process.argv[2] ?? "description.md");
const outDir = resolve(process.argv[3] ?? "dist");

const escape = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const inline = (text) =>
  escape(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/(https:\/\/[^\s<]+)/g, '<a href="$1">$1</a>')
    .replace(/([\w.+-]+@[\w-]+\.[\w.-]+)/g, '<a href="mailto:$1">$1</a>');

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";

export function parse(markdown) {
  const doc = { name: "", intro: [], sections: [] };
  let current = null;
  let paragraph = [];
  let list = null;

  const target = () => (current ? current.blocks : doc.intro);
  const flush = () => {
    if (paragraph.length) target().push({ type: "p", text: paragraph.join(" ") });
    if (list) target().push({ type: "ul", items: list });
    paragraph = [];
    list = null;
  };

  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trim();
    if (/^# /.test(line) && !doc.name) {
      flush();
      doc.name = line.slice(2).trim();
    } else if (/^## /.test(line)) {
      flush();
      current = { title: line.slice(3).trim(), blocks: [] };
      doc.sections.push(current);
    } else if (/^[-*] /.test(line)) {
      if (paragraph.length) flush();
      (list ??= []).push(line.slice(2).trim());
    } else if (line === "") {
      flush();
    } else {
      if (list) flush();
      paragraph.push(line);
    }
  }
  flush();
  if (!doc.name) throw new Error(`${source}: the description needs a "# Your name" heading`);
  return doc;
}

const renderBlocks = (blocks) =>
  blocks
    .map((block) =>
      block.type === "p"
        ? `<p>${inline(block.text)}</p>`
        : `<ul>\n${block.items.map((item) => `        <li>${inline(item)}</li>`).join("\n")}\n      </ul>`,
    )
    .join("\n      ");

export function render(doc) {
  const summary = doc.intro.find((block) => block.type === "p")?.text ?? doc.name;
  const nav = doc.sections.map((s) => `<a href="#${slug(s.title)}">${escape(s.title)}</a>`).join("\n        ");
  const sections = doc.sections
    .map((s) => `    <section id="${slug(s.title)}">\n      <h2>${escape(s.title)}</h2>\n      ${renderBlocks(s.blocks)}\n    </section>`)
    .join("\n");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(doc.name)}</title>
  <meta name="description" content="${escape(summary.replace(/\*\*/g, ""))}">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>${escape(doc.name)}</h1>
    ${renderBlocks(doc.intro)}
    <nav aria-label="Sections">
        ${nav}
    </nav>
  </header>
  <main>
${sections}
  </main>
  <footer><p>Built from one description.</p></footer>
</body>
</html>
`;
}

const STYLES = `:root { color-scheme: light dark; --fg: #1b1b1f; --bg: #fafaf8; --accent: #2f5bd3; }
@media (prefers-color-scheme: dark) { :root { --fg: #ececf0; --bg: #141417; --accent: #8aa6ff; } }
* { box-sizing: border-box; }
body { margin: 0 auto; max-width: 44rem; padding: 3rem 1.25rem; font: 1.0625rem/1.6 system-ui, sans-serif; color: var(--fg); background: var(--bg); }
h1 { font-size: 2.5rem; line-height: 1.1; margin: 0 0 .5rem; }
h2 { font-size: 1.25rem; margin: 2.5rem 0 .75rem; }
nav { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem; }
a { color: var(--accent); }
footer { margin-top: 4rem; font-size: .875rem; opacity: .7; }
`;

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const html = render(parse(readFileSync(source, "utf8")));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), html);
  writeFileSync(resolve(outDir, "styles.css"), STYLES);
  console.log(`built ${resolve(outDir, "index.html")} from ${source}`);
}
