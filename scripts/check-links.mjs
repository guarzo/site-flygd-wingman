// Zero-dependency link check for the static site.
// Verifies every internal href resolves to a file that will actually be served
// by Workers Static Assets, and that every #fragment target exists.
// Pass --external to additionally HEAD-check outbound links.

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const SITE = "https://wingman.zoolanders.vip";
const ROOT = resolve(import.meta.dirname, "..", "public");
const pages = readdirSync(ROOT).filter((f) => f.endsWith(".html"));
const problems = [];
const external = new Set();

// Mirror wrangler's html_handling: "drop-trailing-slash".
const resolveAsset = (p) => {
  if (p === "/") return "index.html";
  const clean = p.replace(/^\//, "").replace(/\/$/, "");
  for (const cand of [clean, `${clean}.html`, `${clean}/index.html`]) {
    if (cand && existsSync(join(ROOT, cand))) return cand;
  }
  return null;
};

const idsOf = (file) => {
  const html = readFileSync(join(ROOT, file), "utf8");
  return new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
};

const idCache = new Map();
const ids = (file) => {
  if (!idCache.has(file)) idCache.set(file, idsOf(file));
  return idCache.get(file);
};

for (const page of pages) {
  const html = readFileSync(join(ROOT, page), "utf8");
  const hrefs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);

  for (const href of hrefs) {
    if (/^(mailto:|tel:|data:)/.test(href)) continue;

    if (/^https?:\/\//.test(href)) {
      // Own-origin absolute URLs (canonical, og:url) aren't live until deploy;
      // validate them against the local asset tree instead.
      if (href.startsWith(SITE)) {
        const p2 = href.slice(SITE.length) || "/";
        if (!resolveAsset(p2)) problems.push(`${page}: "${href}" — self-link resolves to nothing`);
      } else {
        external.add(href);
      }
      continue;
    }

    const [path, frag] = href.split("#");

    if (path === "") {
      // same-page fragment
      if (frag && !ids(page).has(frag)) problems.push(`${page}: #${frag} — no such id on this page`);
      continue;
    }

    if (!path.startsWith("/")) {
      problems.push(`${page}: "${href}" — relative link; use root-absolute paths`);
      continue;
    }

    const target = resolveAsset(path);
    if (!target) {
      problems.push(`${page}: "${href}" — no asset serves this path`);
      continue;
    }
    if (frag && !ids(target).has(frag)) {
      problems.push(`${page}: "${href}" — ${target} has no id="${frag}"`);
    }
  }
}

console.log(`Checked ${pages.length} pages: ${pages.join(", ")}`);
console.log(`Internal link problems: ${problems.length}`);
for (const p of problems) console.log(`  FAIL  ${p}`);

console.log(`\nExternal links (${external.size}):`);
for (const u of [...external].sort()) console.log(`  ${u}`);

if (process.argv.includes("--external")) {
  console.log("\nChecking external links...");
  let bad = 0;
  for (const u of external) {
    try {
      let r = await fetch(u, { method: "HEAD", redirect: "follow" });
      if (r.status === 405 || r.status === 403) r = await fetch(u, { redirect: "follow" });
      const ok = r.status < 400;
      if (!ok) bad++;
      console.log(`  ${ok ? "ok  " : "FAIL"} ${r.status} ${u}`);
    } catch (e) {
      bad++;
      console.log(`  FAIL  ${u} — ${e.message}`);
    }
  }
  if (bad) problems.push(`${bad} external link(s) failed`);
}

process.exit(problems.length ? 1 : 0);
