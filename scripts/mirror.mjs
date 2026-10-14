#!/usr/bin/env node
// Builds a copy of the site for hosting on a second GitHub Pages address
// (for example https://<org>.github.io), for devices that block the main domain.
//
//   node scripts/mirror.mjs [output-dir]     default output: ../milezero-mirror
//
// The copy has no CNAME (so GitHub serves it at its own github.io address instead of
// redirecting to the custom domain) and asks search engines not to index it.
// It must live at the ROOT of its address (a repo named <owner>.github.io), because the
// pages use root-relative links such as /assets/css/site.css.

import { cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(process.argv[2] || join(root, "..", "milezero-mirror"));

// Repo-only files that don't belong on the published mirror.
const SKIP = new Set([
  ".git", ".github", ".claude", ".wrangler", "node_modules",
  "CNAME", "CONTENT.md", "README.md", "package.json", "wrangler.jsonc",
  ".assetsignore", "site.config.json", "src", "scripts",
]);

if (out === root || out.startsWith(root + "/")) {
  console.error("Output directory must be outside the repo.");
  process.exit(1);
}
if (existsSync(out)) {
  // Keep an existing .git so the output can be a working clone of the mirror repo.
  for (const name of readdirSync(out)) if (name !== ".git") rmSync(join(out, name), { recursive: true, force: true });
} else {
  mkdirSync(out, { recursive: true });
}

for (const name of readdirSync(root)) {
  if (SKIP.has(name)) continue;
  cpSync(join(root, name), join(out, name), { recursive: true });
}
writeFileSync(join(out, ".nojekyll"), "");

// Add noindex to every page so the mirror doesn't compete with the main site in search.
const NOINDEX = '<meta name="robots" content="noindex">';
let pages = 0;
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === ".git") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith(".html")) {
      const html = readFileSync(p, "utf8");
      if (!html.includes(NOINDEX) && html.includes("<head>")) {
        writeFileSync(p, html.replace("<head>", `<head>\n${NOINDEX}`));
        pages++;
      }
    }
  }
})(out);

console.log(`Mirror written to ${out} (${pages} pages marked noindex, no CNAME).`);
