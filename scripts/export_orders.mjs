// Dopamina Ecommerce — export diário Supabase → BigQuery bronze + CSV no git.
// Uso: node scripts/export_orders.mjs [--date=YYYY-MM-DD]  (padrão: ontem, UTC)
// Sem credenciais ele só gera os CSVs; com GCP configurado faz também o load no BigQuery.
// Env: SUPABASE_URL, SUPABASE_SERVICE_KEY (ou anon), BQ_PROJECT, BQ_DATASET (default: Dopamina_Ecommerce_Bronze).
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BQ_PROJECT = process.env.BQ_PROJECT;
const BQ_DATASET = process.env.BQ_DATASET || "Dopamina_Ecommerce_Bronze";

const argDate = process.argv.find((a) => a.startsWith("--date="));
const day = argDate ? argDate.split("=")[1] : yesterday();

function yesterday() {
  const d = new Date(Date.now() - 86400000);
  return d.toISOString().slice(0, 10);
}

function toCsv(rows, columns) {
  const esc = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [columns.join(","), ...rows.map((r) => columns.map((c) => esc(r[c])).join(","))].join("\n") + "\n";
}

async function fetchTable(table, orderCol) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?select=*&order=${orderCol}.asc`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
  );
  if (!res.ok) throw new Error(`${table}: HTTP ${res.status} — ${await res.text()}`);
  return res.json();
}

const ORDER_COLS = [
  "order_id", "code", "user_id", "user_pseudo_id", "session_id", "created_at",
  "value_simulated", "items_count", "coupon", "utm_source", "utm_medium",
  "utm_campaign", "utm_content", "referrer", "landing_page", "platform",
  "checkout_ms", "status",
];
const ITEM_COLS = ["id", "order_id", "sku", "name", "category", "price", "qty"];

const ORDER_SCHEMA = [
  "order_id:STRING,code:STRING,user_id:STRING,user_pseudo_id:STRING,session_id:STRING",
  "created_at:TIMESTAMP,value_simulated:FLOAT,items_count:INTEGER,coupon:STRING",
  "utm_source:STRING,utm_medium:STRING,utm_campaign:STRING,utm_content:STRING",
  "referrer:STRING,landing_page:STRING,platform:STRING,checkout_ms:INTEGER,status:STRING",
].join(",");
const ITEM_SCHEMA = "id:INTEGER,order_id:STRING,sku:STRING,name:STRING,category:STRING,price:FLOAT,qty:INTEGER";

function bqLoad(table, file, schema) {
  // Schema explícito: --autodetect quebra com CSV só-cabeçalho (0 linhas = HTTP 400).
  // bq CLI vem do setup-gcloud na Action; localmente exige `gcloud auth login`.
  execFileSync(
    "bq",
    ["load", "--source_format=CSV", "--skip_leading_rows=1", "--replace",
      `--schema=${schema}`,
      `${BQ_PROJECT}:${BQ_DATASET}.${table}`, file],
    { stdio: "inherit" },
  );
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log("SKIP: sem SUPABASE_URL/SUPABASE_SERVICE_KEY — nada a exportar (modo simulado).");
    return;
  }
  mkdirSync("exports", { recursive: true });
  const orders = await fetchTable("orders", "created_at");
  const items = await fetchTable("order_items", "id");
  const ordersFile = `exports/orders_${day}.csv`;
  const itemsFile = `exports/order_items_${day}.csv`;
  writeFileSync(ordersFile, toCsv(orders, ORDER_COLS));
  writeFileSync(itemsFile, toCsv(items, ITEM_COLS));
  console.log(`CSV: ${orders.length} pedidos → ${ordersFile}; ${items.length} itens → ${itemsFile}`);

  if (!BQ_PROJECT) {
    console.log("SKIP BigQuery: sem BQ_PROJECT — CSVs no git são o backup.");
    return;
  }
  try {
    bqLoad("orders", ordersFile, ORDER_SCHEMA);
    bqLoad("order_items", itemsFile, ITEM_SCHEMA);
    console.log(`BigQuery: ${BQ_PROJECT}.${BQ_DATASET}.orders(.order_items) atualizados (--replace).`);
  } catch (e) {
    if (process.env.CI) {
      console.error("ERRO BigQuery:", e.message);
      process.exit(1);
    }
    console.log("AVISO: `bq` falhou (sem auth/CLI?) — CSVs já salvos, load pendente.");
  }
}

main().catch((e) => {
  console.error("ERRO:", e.message);
  process.exit(1);
});
