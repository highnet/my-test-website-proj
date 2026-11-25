#!/usr/bin/env node
// The local guest server: serves the built site in dist/ and owns the guest
// SQLite database. Local only, no dependencies.
//
//   node server/server.mjs            (PORT, HOST, GUEST_DB, DIST_DIR override)
//   npm start                         (builds first, then serves)
//
// The guest counter and guest messages build on `startServer`; this file only
// lays the base: static files plus an open database.

import { mkdirSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export const DEFAULT_DB_PATH = resolve(root, "data", "guest.db");
export const DEFAULT_DIST_DIR = resolve(root, "dist");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

function send(res, status, body, type = "text/plain; charset=utf-8", head = false) {
  res.writeHead(status, { "content-type": type, "content-length": Buffer.byteLength(body) });
  res.end(head ? undefined : body);
}

// Maps a request path to a file inside distDir, or null when it would escape it.
function resolveStatic(distDir, pathname) {
  const target = resolve(distDir, "." + pathname);
  const rel = relative(distDir, target);
  if (rel.startsWith("..") || isAbsolute(rel) || rel.split(sep).includes("..")) return null;
  return target;
}

async function serveStatic(distDir, req, res) {
  const head = req.method === "HEAD";
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    return send(res, 400, "Bad request\n", undefined, head);
  }
  if (pathname.includes("\0")) return send(res, 400, "Bad request\n", undefined, head);

  let file = resolveStatic(distDir, pathname);
  if (!file) return send(res, 404, "Not found\n", undefined, head);
  try {
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    const body = await readFile(file);
    res.writeHead(200, {
      "content-type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream",
      "content-length": body.length,
    });
    res.end(head ? undefined : body);
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR" || error.code === "EISDIR") {
      return send(res, 404, "Not found\n", undefined, head);
    }
    throw error;
  }
}

export function openDatabase(dbPath = DEFAULT_DB_PATH) {
  if (dbPath !== ":memory:") mkdirSync(dirname(dbPath), { recursive: true });
  return new DatabaseSync(dbPath);
}

/**
 * Starts the guest server. Resolves once it is listening.
 * @param {{ port?: number, host?: string, dbPath?: string, distDir?: string }} [options]
 * @returns {Promise<{ url: string, port: number, db: DatabaseSync, server: import("node:http").Server, close: () => Promise<void> }>}
 */
export async function startServer({
  port = 3000,
  host = "127.0.0.1",
  dbPath = DEFAULT_DB_PATH,
  distDir = DEFAULT_DIST_DIR,
} = {}) {
  const dist = resolve(distDir);
  const db = openDatabase(dbPath);

  const server = createServer((req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.setHeader("allow", "GET, HEAD");
      return send(res, 405, "Method not allowed\n");
    }
    serveStatic(dist, req, res).catch((error) => {
      console.error(error);
      if (!res.headersSent) send(res, 500, "Internal server error\n");
      else res.destroy();
    });
  });

  try {
    await new Promise((resolveListen, rejectListen) => {
      server.once("error", rejectListen);
      server.listen(port, host, () => {
        server.off("error", rejectListen);
        resolveListen();
      });
    });
  } catch (error) {
    db.close();
    throw error;
  }

  const actualPort = server.address().port;
  let closed = false;
  return {
    url: `http://${host.includes(":") ? `[${host}]` : host}:${actualPort}`,
    port: actualPort,
    db,
    server,
    async close() {
      if (closed) return;
      closed = true;
      await new Promise((resolveClose) => {
        server.close(() => resolveClose());
        server.closeAllConnections();
      });
      db.close();
    },
  };
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const distDir = process.env.DIST_DIR ? resolve(process.env.DIST_DIR) : DEFAULT_DIST_DIR;
  const dbPath = process.env.GUEST_DB ? resolve(process.env.GUEST_DB) : DEFAULT_DB_PATH;
  const app = await startServer({
    port: Number(process.env.PORT ?? 3000),
    host: process.env.HOST ?? "127.0.0.1",
    dbPath,
    distDir,
  });
  console.log(`serving ${distDir} at ${app.url} (database ${dbPath})`);
  const stop = () => app.close().then(() => process.exit(0));
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
}
