import { readFileSync } from "node:fs";

const path = process.argv[2] ?? "data/products.csv";
const s = readFileSync(path, "utf8");
const lines = s.trim().split(/\r?\n/);

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

const header = splitLine(lines[0]);
let ok = true;
const skus = new Set();
lines.slice(1).forEach((l, i) => {
  const f = splitLine(l);
  if (f.length !== header.length) { console.log(`line ${i + 2}: ${f.length} fields (expected ${header.length})`); ok = false; }
  if (skus.has(f[0])) { console.log(`line ${i + 2}: duplicate sku ${f[0]}`); ok = false; }
  skus.add(f[0]);
  const price = Number(f[5]);
  const priceList = Number(f[6]);
  if (!(price > 0) || !(priceList >= price)) { console.log(`line ${i + 2}: bad price ${f[5]}/${f[6]}`); ok = false; }
  if (f[12] !== "0" && f[12] !== "1") { console.log(`line ${i + 2}: bad active=${JSON.stringify(f[12])}`); ok = false; }
});
console.log(`${ok ? "OK" : "FAIL"} — ${lines.length - 1} rows, ${header.length} cols`);
process.exit(ok ? 0 : 1);
