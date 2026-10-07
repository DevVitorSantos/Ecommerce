import { readFileSync } from "node:fs";

const file = process.argv[2];
const h = readFileSync(file, "utf8");

console.log("=== HEADINGS ===");
const heads = [...h.matchAll(/<(h1|h2|h3)[^>]*>(.*?)<\/\1>/gs)].map(
  (m) => `${m[1]}: ${m[2].replace(/<[^>]+>/g, "").trim().slice(0, 90)}`
);
console.log(heads.slice(0, 40).join("\n"));

console.log("\n=== HEADER/NAV TEXT ===");
const header = h.match(/<header[\s\S]{0,6000}?<\/header>/);
if (header) {
  const links = [...header[0].matchAll(/<a[^>]*>(.*?)<\/a>/gs)]
    .map((m) => m[1].replace(/<[^>]+>/g, "").trim())
    .filter(Boolean);
  console.log([...new Set(links)].slice(0, 30).join(" | "));
}

console.log("\n=== FOOTER COLUMNS ===");
const footer = h.match(/<footer[\s\S]*$/);
if (footer) {
  const fh = [...footer[0].matchAll(/<(h[2-4]|p)[^>]*>(.*?)<\/\1>/gs)]
    .map((m) => m[2].replace(/<[^>]+>/g, "").trim().slice(0, 70))
    .filter(Boolean);
  console.log([...new Set(fh)].slice(0, 25).join(" | "));
}

console.log("\n=== BODY CLASSES (first) ===");
const bodyCls = h.match(/<body[^>]*class="([^"]{0,200})/);
console.log(bodyCls ? bodyCls[1] : "n/a");
