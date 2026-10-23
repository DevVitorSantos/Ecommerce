// Dopamina Ecommerce — seed do catálogo: data/products.csv → Supabase (tabela products).
// Uso (PowerShell):
//   $env:SUPABASE_URL="https://xyz.supabase.co"
//   $env:SUPABASE_SERVICE_KEY="<service_role — NUNCA exponha no frontend>"
//   node scripts/seed_products.mjs
// Sem credenciais: mostra o que faria (dry-run).
import { readFileSync } from "node:fs";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

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

const lines = readFileSync("data/products.csv", "utf8").trim().split(/\r?\n/);
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
    updated_at: r.updated_at || new Date().toISOString().slice(0, 10),
  };
});

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.log(`DRY-RUN: ${rows.length} produtos prontos para upsert (defina SUPABASE_URL + SUPABASE_SERVICE_KEY).`);
  console.log(`Exemplo: ${rows[0].sku} → ${rows[0].name}`);
  process.exit(0);
}

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "resolution=merge-duplicates",
};

let ok = 0;
for (let i = 0; i < rows.length; i += 20) {
  const chunk = rows.slice(i, i + 20);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
    method: "POST",
    headers,
    body: JSON.stringify(chunk),
  });
  if (!res.ok) {
    console.error(`ERRO no lote ${i / 20 + 1}: HTTP ${res.status} — ${await res.text()}`);
    process.exit(1);
  }
  ok += chunk.length;
}
console.log(`OK — ${ok} produtos inseridos/atualizados (upsert por sku).`);
