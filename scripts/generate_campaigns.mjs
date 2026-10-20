// Gera web/src/lib/campaigns.generated.js a partir de data/campaigns.csv.
// Roda automaticamente antes de cada build (prebuild) — o CSV continua
// sendo a fonte da verdade (coluna `hipotese` exigida pelo PERGUNTAS.md §3).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const csvPath = join(root, "data", "campaigns.csv");
const outPath = join(root, "web", "src", "lib", "campaigns.generated.js");

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
const map = {};
for (const line of lines.slice(1)) {
  const cells = splitLine(line);
  const r = Object.fromEntries(header.map((h, i) => [h, cells[i] ?? ""]));
  if (!r.campaign_id) throw new Error(`campanha sem campaign_id: ${line}`);
  if (!["home", "categoria", "produto"].includes(r.destino_tipo)) {
    throw new Error(`destino_tipo inválido em ${r.campaign_id}: ${r.destino_tipo}`);
  }
  if (r.destino_tipo !== "home" && !r.destino) {
    throw new Error(`${r.campaign_id}: destino_tipo ${r.destino_tipo} exige destino (slug)`);
  }
  if (map[r.campaign_id]) throw new Error(`campaign_id duplicado: ${r.campaign_id}`);
  map[r.campaign_id] = {
    destino_tipo: r.destino_tipo,
    destino: r.destino || null,
    source: r.source,
    medium: r.medium,
    content: r.content || null,
    utm_term: r.utm_term || null,
    label: r.label,
    hipotese: r.hipotese,
    pergunta: r.pergunta,
  };
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `// GERADO por scripts/generate_campaigns.mjs — não editar à mão.\nexport const CAMPAIGNS = ${JSON.stringify(map, null, 2)};\n`);
console.log(`OK — ${Object.keys(map).length} campanhas → ${outPath}`);
