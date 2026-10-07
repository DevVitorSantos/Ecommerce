import { IMAGES } from "./set_images.mjs";

const entries = Object.entries(IMAGES);
let bad = 0;

for (const [sku, url] of entries) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 20000);
    const res = await fetch(url, { signal: ctrl.signal, redirect: "follow" });
    clearTimeout(t);
    const ct = res.headers.get("content-type") || "";
    const ok = res.ok && ct.startsWith("image/");
    if (!ok) bad++;
    console.log(`${ok ? "OK  " : "FAIL"} ${sku} ${res.status} ${ct} ${url.slice(0, 60)}`);
  } catch (e) {
    bad++;
    console.log(`FAIL ${sku} ERROR ${e.cause?.code || e.message}`);
  }
}
console.log(`\n${bad === 0 ? "TODAS OK" : bad + " FALHAS"} — ${entries.length} urls`);
process.exit(bad === 0 ? 0 : 1);
