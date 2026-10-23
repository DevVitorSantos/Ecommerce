// Dopamina Ecommerce — gerador diário de tráfego simulado (Playwright headless).
// Percorre o funil completo em /lanca/<campanha> para alimentar o GA4 de produção
// com sessões multi-toque reais (utm_source/medium/campaign no dataLayer → GTM → GA4).
//
// Uso:
//   node scripts/generate_traffic.mjs
//   node scripts/generate_traffic.mjs --sessions=12 --site=https://www.dopaminaloja.com.br --seed=20261020
//
// Env (fallback dos args): SITE_URL, SESSIONS, CONVERSION_RATE, SEED, HEADFUL, TIMEOUT_MS
//
// Nada é cobrado e nenhum dado real é enviado: nome/e-mail/endereço são fictícios.
// O POST /api/orders pode não persistir (sem Supabase) — o foco é o evento purchase no GA4.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV_PATH = resolve(__dirname, "..", "data", "campaigns.csv");

function arg(name) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : undefined;
}

const SITE_URL = (arg("site") || process.env.SITE_URL || "https://www.dopaminaloja.com.br").replace(/\/+$/, "");
const SESSIONS = Number(arg("sessions") || process.env.SESSIONS || 10);
const CONVERSION_RATE = Number(arg("conversion") || process.env.CONVERSION_RATE || 0.7);
const TIMEOUT_MS = Number(arg("timeout") || process.env.TIMEOUT_MS || 30000);
const HEADFUL = /^(1|true|yes)$/i.test(arg("headful") || process.env.HEADFUL || "");
const SEED = Number(arg("seed") || process.env.SEED || 0);

// Sessões do dia têm variação leve (±20%) para não gerar série perfeitamente plana.
const sessionsToday = Math.max(1, Math.round(SESSIONS * (0.8 + ((mulberry(SEED || Date.now())() + mulberry(SEED + 1)()) / 2) * 0.4)));

// RNG determinístico (permite reproduzir um dia com o mesmo --seed).
function mulberry(seed) {
  let a = (seed >>> 0) || 1;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry(SEED || Date.now());
const pick = (arr) => arr[Math.floor(rng() * arr.length)];

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const cells = [];
    let cur = "";
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (quoted) {
        if (ch === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (ch === '"') {
          quoted = false;
        } else {
          cur += ch;
        }
      } else if (ch === '"') {
        quoted = true;
      } else if (ch === ",") {
        cells.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    cells.push(cur);
    const row = {};
    header.forEach((h, idx) => (row[h] = cells[idx] ?? ""));
    return row;
  });
}

const campaigns = parseCsv(readFileSync(CSV_PATH, "utf8")).filter((c) => c.campaign_id);
const byType = {
  home: campaigns.filter((c) => c.destino_tipo === "home"),
  categoria: campaigns.filter((c) => c.destino_tipo === "categoria"),
  produto: campaigns.filter((c) => c.destino_tipo === "produto"),
};

function slugify(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const FIRST = ["Ana", "Bruno", "Carla", "Diego", "Elisa", "Felipe", "Gabi", "Hugo", "Iara", "Joao", "Kelly", "Lucas", "Marina", "Nando", "Olivia", "Paula", "Rafa", "Sofia", "Tati", "Vitor"];
const LAST = ["Silva", "Souza", "Costa", "Rocha", "Alves", "Lima", "Moraes", "Pereira", "Dias", "Freitas"];
const STREETS = ["Rua da Ilusao", "Av. do Placebo", "Travessa do Impulso", "Alameda Dopamina", "Rua do Carrinho"];
const CITIES = ["Sao Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Recife", "Porto Alegre"];
const PAYMENTS = ["cartao-fantasia", "pix-de-mentira", "boleto-invisivel"];

// Espelha a leitura de client_id/session_id do app: window.gtag('get', GA4_ID, 'client_id'|'session_id').
async function gaGet(page, field) {
  return page.evaluate((f) => new Promise((resolve) => {
    try {
      const findId = () => {
        const scripts = Array.from(document.querySelectorAll("script[src]"));
        for (const s of scripts) {
          const m = s.src.match(/[?&]id=(G-[A-Z0-9]+)/i);
          if (m) return m[1];
        }
        return null;
      };
      const id = findId() || window.__GA4_ID__;
      if (typeof window.gtag !== "function" || !id) return resolve(null);
      const t = setTimeout(() => resolve(null), 1500);
      window.gtag("get", id, f, (v) => { clearTimeout(t); resolve(v || null); });
    } catch {
      resolve(null);
    }
  }), field);
}

async function acceptConsent(page) {
  const selectors = [
    '[data-testid="cookie-accept"]',
    '#cookie-accept',
    '[data-cy="cookie-accept"]',
    '#onetrust-accept-btn-handler',
    'button:has-text("Aceitar todos")',
    'button:has-text("Aceitar")',
    'button:has-text("Aceito")',
  ];
  for (const sel of selectors) {
    try {
      const btn = await page.$(sel);
      if (btn && (await btn.isVisible())) {
        await btn.click();
        await page.waitForTimeout(250);
        return;
      }
    } catch {}
  }
}

async function oneSession(context, seq) {
  const homeCamp = pick(byType.home);
  const catCamp = pick(byType.categoria);
  const prodCamp = pick(byType.produto);
  const buys = rng() < CONVERSION_RATE;
  // Abandono em ponto variável: 30% desistem no carrinho, o resto vai até o fim.
  const abandonAtCart = !buys && rng() < 0.5;

  const page = await context.newPage();
  page.setDefaultTimeout(TIMEOUT_MS);
  const events = [];
  page.on("console", () => {});
  await page.addInitScript(() => {
    const key = "__dl_rec";
    const wrap = () => {
      const dl = (window.dataLayer = window.dataLayer || []);
      if (dl.__wrapped) return;
      dl.__wrapped = true;
      const push = dl.push.bind(dl);
      dl.push = function () {
        const args = Array.prototype.slice.call(arguments);
        let rec = [];
        try { rec = JSON.parse(sessionStorage.getItem(key) || "[]"); } catch {}
        for (let i = 0; i < args.length; i++) {
          const a = args[i];
          if (a && typeof a === "object" && a.event) rec.push(a.event);
        }
        try { sessionStorage.setItem(key, JSON.stringify(rec)); } catch {}
        return push.apply(null, args);
      };
    };
    wrap();
    const iv = setInterval(() => { wrap(); if (window.dataLayer && window.dataLayer.__wrapped) clearInterval(iv); }, 10);
    setTimeout(() => clearInterval(iv), 4000);
  });

  const result = { seq, buys, abandonAtCart, final: "", clicked: false, wentCheckout: false, purchase: false, client_id: null };
  try {
    await page.goto(`${SITE_URL}/`, { waitUntil: "load" });
    await acceptConsent(page);

    await page.goto(`${SITE_URL}/lanca/${homeCamp.campaign_id}`, { waitUntil: "load" });
    await page.waitForTimeout(200);

    await page.goto(`${SITE_URL}/lanca/${catCamp.campaign_id}`, { waitUntil: "load" });
    await page.waitForTimeout(300);
    const card = await page.$('a[href^="/produto/"]');
    if (card) {
      await card.click();
      result.clicked = true;
      await page.waitForFunction(() => window.location.pathname.indexOf("/produto/") === 0, { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(250);
    }
    const add1 = await page.$('[data-testid="add-to-cart"]');
    if (add1) { await add1.click().catch(() => {}); await page.waitForTimeout(200); }

    await page.goto(`${SITE_URL}/lanca/${prodCamp.campaign_id}`, { waitUntil: "load" });
    await page.waitForTimeout(250);
    const add2 = await page.$('[data-testid="add-to-cart"]');
    if (add2) { await add2.click().catch(() => {}); await page.waitForTimeout(200); }

    await page.goto(`${SITE_URL}/carrinho`, { waitUntil: "load" });
    await page.waitForTimeout(250);

    if (!abandonAtCart) {
      const go = await page.$('[data-testid="go-checkout"]');
      if (go) {
        await go.click();
        result.wentCheckout = true;
        await page.waitForFunction(() => window.location.pathname === "/checkout", { timeout: 10000 }).catch(() => {});
        await page.waitForTimeout(300);
      }
      const name = `${pick(FIRST)} ${pick(LAST)}`;
      const email = `bot${seq}.${Date.now()}@dopamina.test`;
      await page.fill('[data-testid="field-name"]', name).catch(() => {});
      await page.fill('[data-testid="field-email"]', email).catch(() => {});
      if (buys) {
        await page.click('[data-testid="checkout-next"]').catch(() => {});
        await page.waitForTimeout(150);
        await page.fill('[data-testid="field-address"]', `${pick(STREETS)}, ${100 + Math.floor(rng() * 900)}`).catch(() => {});
        await page.selectOption('[data-testid="field-payment"]', pick(PAYMENTS)).catch(() => {});
        await page.click('[data-testid="checkout-next"]').catch(() => {});
        await page.waitForTimeout(150);
        await page.click('[data-testid="checkout-next"]').catch(() => {});
        await page.waitForTimeout(150);
        await page.click('[data-testid="checkout-finish"]').catch(() => {});
        await page.waitForFunction(() => window.location.pathname === "/confirmacao", { timeout: 10000 }).catch(() => {});
        await page.waitForTimeout(200);
      }
    }

    result.final = page.url().replace(SITE_URL, "");
    try {
      const rec = await page.evaluate(() => JSON.parse(sessionStorage.getItem("__dl_rec") || "[]"));
      events.push(...rec.filter((e) => e.indexOf("gtm.") !== 0));
    } catch {}
    result.client_id = await gaGet(page, "client_id");
  } catch (err) {
    result.error = err.message;
  } finally {
    await page.close().catch(() => {});
  }

  result.events = events;
  result.purchase = events.includes("purchase");
  return result;
}

async function main() {
  console.log(`[traffic] site=${SITE_URL} sessions=${sessionsToday} conversion=${CONVERSION_RATE} seed=${SEED || "time"}`);
  const browser = await chromium.launch({ headless: !HEADFUL });
  const results = [];
  for (let i = 0; i < sessionsToday; i++) {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      locale: "pt-BR",
      viewport: { width: 1366, height: 900 },
    });
    const r = await oneSession(context, i + 1);
    await context.close().catch(() => {});
    results.push(r);
    const tag = r.purchase ? "PURCHASE" : r.wentCheckout ? "abandonou no checkout" : r.abandonAtCart ? "abandonou no carrinho" : "sem compra";
    console.log(`[traffic] sessao ${i + 1}/${sessionsToday} — ${tag} — ${r.final || r.error || "?"}`);
  }
  await browser.close();

  const count = (name) => results.reduce((n, r) => n + (r.events.includes(name) ? 1 : 0), 0);
  const summary = {
    sessions: results.length,
    purchases: count("purchase"),
    view_item_list: count("view_item_list"),
    select_item: count("select_item"),
    view_item: count("view_item"),
    add_to_cart: count("add_to_cart"),
    view_cart: count("view_cart"),
    begin_checkout: count("begin_checkout"),
    add_shipping_info: count("add_shipping_info"),
    add_payment_info: count("add_payment_info"),
    errors: results.filter((r) => r.error).length,
  };
  console.log("[traffic] resumo:", JSON.stringify(summary));
  if (summary.errors > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error("[traffic] falha fatal:", err);
  process.exit(1);
});
