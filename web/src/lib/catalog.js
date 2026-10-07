import { PRODUCTS } from "./products.generated.js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function fromSupabase() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=*&active=eq.true&order=sku.asc`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }, next: { revalidate: 3600 } },
  );
  if (!res.ok) throw new Error(`supabase ${res.status}`);
  return res.json();
}

function fromGenerated() {
  return PRODUCTS.filter((p) => p.active);
}

let cache = null;

export async function getProducts() {
  if (cache) return cache;
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      cache = await fromSupabase();
      return cache;
    } catch {
      // fallback silencioso para os dados gerados no build (dev / indisponibilidade)
    }
  }
  cache = fromGenerated();
  return cache;
}

export async function getProduct(slug) {
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
}

export async function getCategories() {
  const cats = new Set((await getProducts()).map((p) => p.category));
  return [...cats].sort();
}
