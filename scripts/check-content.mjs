import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..", "public");
const contracts = {
  index: {
    must: [
      "wormhole multiboxing toolkit",
      "id=\"toolkit\"",
      "id=\"fight-footage\"",
      "id=\"trust\"",
      "Previews",
      "Bookmarks",
      "Uploading",
      "GPL-3.0-only",
      "technical@zoolanders.vip",
    ],
    mustNot: ["MIT Licence", "Google hasn’t verified", "100 uploads per day"],
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
    mustNot: ["100 uploads per day", "verification is still in progress", "two destinations, and only two"],
  },
  terms: {
    must: ["GPL-3.0-only", "EVE SSO", "ESI", "GitHub", "WebView2"],
    mustNot: ["MIT Licence", "must not script", "must not modify", "does not interact with the game client"],
  },
  "google-oauth": {
    must: ["youtube.upload", "verified", "Privacy Policy", "Terms of Service"],
    mustNot: ["unverified", "100 uploads per day"],
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
  const html = readFileSync(resolve(ROOT, `${name}.html`), "utf8");
  for (const text of contract.must) {
    if (!html.includes(text)) failures.push(`${name}: missing ${JSON.stringify(text)}`);
  }
  for (const text of contract.mustNot) {
    if (html.includes(text)) failures.push(`${name}: stale ${JSON.stringify(text)}`);
  }
}

for (const failure of failures) console.error(`FAIL ${failure}`);
console.log(`Checked ${names.length} content contract(s); failures: ${failures.length}`);
process.exit(failures.length ? 1 : 0);
