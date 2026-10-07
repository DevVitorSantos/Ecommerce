import { readFileSync } from "node:fs";

const h = readFileSync(process.argv[2], "utf8");
const clean = (s) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

// header
const header = h.match(/<header[\s\S]*?<\/header>/);
console.log("=== HEADER (text) ===");
if (header) console.log(clean(header[0]).slice(0, 600));

// nav categories
console.log("\n=== NAV LINKS ===");
const navs = [...h.matchAll(/<nav[\s\S]*?<\/nav>/g)];
navs.slice(0, 2).forEach((n, i) => console.log(`nav${i}:`, clean(n[0]).slice(0, 300)));

// hero
console.log("\n=== HERO (first 1200 chars of text) ===");
const hero = h.match(/<h1[\s\S]*?<\/h1>/);
if (hero) {
  const start = Math.max(0, h.indexOf(hero[0]) - 200);
  console.log(clean(h.slice(start, h.indexOf(hero[0]) + 1500)).slice(0, 1200));
}

// product card sample
console.log("\n=== PRODUCT CARD (html snippet) ===");
const card = h.match(/<article[\s\S]{0,2500}?R\$[\s\S]{0,800}?<\/(article|div)>/);
if (card) console.log(card[0].slice(0, 2000));

// badges
console.log("\n=== BADGES / PILLS ===");
const pills = [...h.matchAll(/>(Oferta|Novo|Top Vendas|Frete Grátis|-?\d+% OFF|Em estoque|Últimas unidades)[^<]{0,20}</g)];
console.log([...new Set(pills.map((m) => m[0].replace(/[><]/g, "").trim()))].slice(0, 15).join(" | "));

// footer
console.log("\n=== FOOTER (text) ===");
const footer = h.match(/<footer[\s\S]*?<\/footer>/);
if (footer) console.log(clean(footer[0]).slice(0, 900));

// tailwind config colors
console.log("\n=== TAILWIND CONFIG ===");
const cfg = h.match(/tailwind\.config\s*=\s*(\{[\s\S]{0,2500}?colors[\s\S]{0,3000}?\}\s*\}\s*\})/);
if (cfg) console.log(cfg[1].slice(0, 1500));
