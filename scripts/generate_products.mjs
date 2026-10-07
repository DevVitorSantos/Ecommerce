// Gera web/src/lib/products.generated.js a partir de data/products.csv.
// Roda automaticamente antes de cada build (prebuild) — o CSV continua
// sendo a fonte da verdade; o .js gerado é o que o bundle usa em produção
// (na Vercel, ler ../data via fs em runtime pode falhar no file-tracing).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const csvPath = join(root, "data", "products.csv");
const outPath = join(root, "web", "src", "lib", "products.generated.js");

function splitLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQ = false;
      else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { out.push(cur); cur = ""; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

const lines = readFileSync(csvPath, "utf8").trim().split(/\r?\n/);
const header = splitLine(lines[0]);
const rows = lines.slice(1).map((line) => {
  const cells = splitLine(line);
  const r = Object.fromEntries(header.map((h, i) => [h, cells[i] ?? ""]));
  return {
    sku: r.sku,
    slug: r.slug,
    name: r.name,
    description: r.description,
    category: r.category,
    price: Number(r.price),
    price_list: Number(r.price_list),
    rating: Number(r.rating),
    sold_fake: Number(r.sold_fake),
    emoji: r.emoji,
    image_url: r.image_url || null,
    tags: r.tags ? r.tags.split("|") : [],
    active: r.active === "1",
  };
});

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `// GERADO por scripts/generate_products.mjs — não editar à mão.\nexport const PRODUCTS = ${JSON.stringify(rows, null, 2)};\n`);
console.log(`OK — ${rows.length} produtos → ${outPath}`);
