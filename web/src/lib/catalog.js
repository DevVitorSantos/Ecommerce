import { readFileSync } from "node:fs";
import { join } from "node:path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const CSV_PATH = join(process.cwd(), "..", "data", "products.csv");

function splitLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cur += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { out.push(cur); cur = ""; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = splitLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = splitLine(line);
    return Object.fromEntries(header.map((h, i) => [h, cells[i] ?? ""]));
  });
}

function toProduct(row) {
  return {
    sku: row.sku,
    slug: row.slug,
    name: row.name,
    description: row.description,
    category: row.category,
    price: Number(row.price),
    price_list: Number(row.price_list),
    rating: Number(row.rating),
    sold_fake: Number(row.sold_fake),
    emoji: row.emoji,
    image_url: row.image_url || null,
    tags: row.tags ? row.tags.split("|") : [],
    active: row.active === "1",
  };
}

async function fromSupabase() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=*&active=eq.true&order=sku.asc`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }, next: { revalidate: 3600 } },
  );
  if (!res.ok) throw new Error(`supabase ${res.status}`);
  return res.json();
}

function fromCsv() {
  return parseCsv(readFileSync(CSV_PATH, "utf8")).map(toProduct).filter((p) => p.active);
}

let cache = null;

export async function getProducts() {
  if (cache) return cache;
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      cache = await fromSupabase();
      return cache;
    } catch {
      // fallback silencioso para o CSV local (dev / indisponibilidade)
    }
  }
  cache = fromCsv();
  return cache;
}

export async function getProduct(slug) {
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
}

export async function getCategories() {
  const cats = new Set((await getProducts()).map((p) => p.category));
  return [...cats].sort();
}
