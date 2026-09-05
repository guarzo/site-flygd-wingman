import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..", "public");

// Stale claims from the pre-v5 site. They are banned on every page, so a
// future edit cannot reintroduce one on a page whose own contract forgot it.
// The old application/data-directory name survives only in the Privacy
// Policy's documented legacy migration and clean-slate instructions.
const bannedEverywhere = [
  "MIT Licence",
  "unverified",
  "100 uploads",
  "only two",
  "no update check",
  "OBS-YouTube-Uploader-Setup",
  "OBSYouTubeUploader",
];
const bannedExceptions = { privacy: ["OBSYouTubeUploader"] };

const contracts = {
  index: {
    must: [
      "wormhole multiboxing toolkit",
      "id=\"toolkit\"",
      "id=\"fight-footage\"",
      "id=\"trust\"",
      // The three workflow bands, not the header navigation words: each
      // band must keep its label and its heading below the section h2.
      "<p class=\"eyebrow\">Previews</p><h3>",
      "<p class=\"eyebrow\">Bookmarks</p><h3>",
      "<p class=\"eyebrow\">Uploading</p><h3>",
      "GPL-3.0-only",
      "technical@zoolanders.vip",
    ],
    mustNot: ["Google hasn’t verified"],
  },
  privacy: {
    must: [
      "%LOCALAPPDATA%\\FlyGD Wingman\\",
      "%LOCALAPPDATA%\\OBSYouTubeUploader\\",
      "links.json",
      "esi-fittings.read_fittings.v1",
      "esi-fittings.write_fittings.v1",
      "esi-skills.read_skills.v1",
      "esi-skills.read_skillqueue.v1",
      "Windows DPAPI",
      "Cloudflare",
      "technical@zoolanders.vip",
    ],
    mustNot: ["verification is still in progress"],
  },
  terms: {
    must: ["GPL-3.0-only", "EVE SSO", "ESI", "GitHub", "WebView2"],
    mustNot: ["must not script", "must not modify", "does not interact with the game client"],
  },
  "google-oauth": {
    must: ["youtube.upload", "verified", "Privacy Policy", "Terms of Service"],
    mustNot: [],
  },
  404: {
    must: ["FlyGD Wingman", "Privacy Policy", "Terms of Service"],
    mustNot: [],
  },
};

const selected = process.argv.slice(2);
const names = selected.length ? selected : Object.keys(contracts);
const failures = [];

for (const name of names) {
  const contract = contracts[name];
  if (!contract) {
    failures.push(`${name}: unknown page contract`);
    continue;
  }
  const file = resolve(ROOT, `${name}.html`);
  let html;
  try {
    html = readFileSync(file, "utf8");
  } catch (error) {
    // A missing or unreadable page is a check failure, not a crash: report it
    // alongside the other findings instead of aborting with a stack trace.
    failures.push(`${name}: cannot read ${file} (${error.code ?? error.message})`);
    continue;
  }
  for (const text of contract.must) {
    if (!html.includes(text)) failures.push(`${name}: missing ${JSON.stringify(text)}`);
  }
  const lower = html.toLowerCase();
  const allowed = bannedExceptions[name] ?? [];
  for (const text of [...contract.mustNot, ...bannedEverywhere]) {
    if (allowed.includes(text)) continue;
    if (lower.includes(text.toLowerCase())) failures.push(`${name}: stale ${JSON.stringify(text)}`);
  }
}

// Headers are not page-scoped, so they are checked on every run: the media
// cache rule and the clickjacking directive have both regressed before.
const headersFile = resolve(ROOT, "_headers");
let headers;
try {
  headers = readFileSync(headersFile, "utf8");
} catch (error) {
  failures.push(`_headers: cannot read ${headersFile} (${error.code ?? error.message})`);
}
if (headers !== undefined) {
  if (!/^\/media\/\*\r?\n\s+Cache-Control:\s*public, max-age=\d+/m.test(headers)) {
    failures.push("_headers: missing /media/* Cache-Control rule");
  }
  if (!headers.includes("frame-ancestors 'none'")) {
    failures.push("_headers: missing frame-ancestors 'none' in the Content-Security-Policy");
  }
}

for (const failure of failures) console.error(`FAIL ${failure}`);
console.log(
  `Checked ${names.length} content contract(s) and _headers; failures: ${failures.length}`,
);
process.exit(failures.length ? 1 : 0);
