// End-to-end: build the site into a temp dir, start the real server on a free
// port with a temp SQLite database, make real HTTP requests, shut down.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { request } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { startServer } from "./server.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const work = mkdtempSync(join(tmpdir(), "guest-server-"));
const distDir = join(work, "dist");
const dbPath = join(work, "db", "guest.db");
let app;

before(async () => {
  execFileSync(process.execPath, [join(root, "scripts", "build.mjs"), join(root, "description.md"), distDir], {
    stdio: "ignore",
  });
  app = await startServer({ port: 0, dbPath, distDir });
});

after(async () => {
  await app?.close();
  rmSync(work, { recursive: true, force: true });
});

// fetch() normalises "/../" away, so traversal needs a raw request path.
function rawGet(path) {
  return new Promise((resolveReq, rejectReq) => {
    const req = request({ host: "127.0.0.1", port: app.port, path, method: "GET" }, (res) => {
      res.resume();
      res.on("end", () => resolveReq(res.statusCode));
    });
    req.on("error", rejectReq);
    req.end();
  });
}

test("listens on a free port and opens the SQLite database", () => {
  assert.ok(app.port > 0);
  assert.ok(existsSync(dbPath), "database file is created at dbPath");
  assert.equal(app.db.prepare("SELECT 1 AS ok").get().ok, 1);
});

test("serves the built home page at /", async () => {
  const res = await fetch(`${app.url}/`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /^text\/html/);
  const html = await res.text();
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /<link rel="stylesheet" href="styles.css">/);
});

test("serves /styles.css as CSS", async () => {
  const res = await fetch(`${app.url}/styles.css`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /^text\/css/);
  assert.match(await res.text(), /:root/);
});

test("answers 404 for missing files and refuses to leave dist/", async () => {
  assert.equal((await fetch(`${app.url}/nope.html`)).status, 404);
  assert.equal(await rawGet("/../package.json"), 404);
  assert.equal(await rawGet("/%2e%2e/package.json"), 404);
  assert.equal(await rawGet("/%2e%2e%5cpackage.json"), 404);
});

test("only GET and HEAD are allowed for now", async () => {
  const res = await fetch(`${app.url}/`, { method: "POST", body: "x" });
  assert.equal(res.status, 405);
  assert.equal(res.headers.get("allow"), "GET, HEAD");
  assert.equal((await fetch(`${app.url}/`, { method: "HEAD" })).status, 200);
});

test("close() shuts down cleanly and is idempotent", async () => {
  const other = await startServer({ port: 0, dbPath: join(work, "second.db"), distDir });
  await other.close();
  await other.close();
  await assert.rejects(fetch(`${other.url}/`));
  assert.throws(() => other.db.prepare("SELECT 1"), /not open/i);
});
