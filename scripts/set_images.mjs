import { readFileSync, writeFileSync } from "node:fs";

const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

// sku -> foto (banco gratuito: Unsplash, licença livre)
export const IMAGES = {
  "DOP-001": U("1600271886742-f049cd451bba"), // suco natural
  "DOP-002": U("1510812431401-41d2bd2722f3"), // vinho
  "DOP-003": U("1495474472287-4d71bcdd2085"), // café
  "DOP-004": U("1554866585-cd94860890b7"), // refrigerante
  "DOP-005": U("1566478989037-eec170784d0b"), // chips
  "DOP-006": U("1499636136210-6f4ee915583e"), // cookies
  "DOP-007": U("1549007994-cb92caebd54b"), // chocolate
  "DOP-008": U("1578849278619-e73505e9610f"), // pipoca
  "DOP-009": U("1578985545062-69928b1d9587"), // bolo de chocolate
  "DOP-010": U("1569718212165-3a8278d5f624"), // ramen
  "DOP-011": U("1559454403-b8fb88521f11"), // pelúcia
  "DOP-012": U("1589924691995-400dc9ecc119"), // cão com petisco
  "DOP-013": U("1530281700549-e82e7bf110d6"), // cachorro
  "DOP-014": U("1568640347023-a616a30bc3bd"), // comedouro cão
  "DOP-015": U("1514228742587-6b1558fcca3d"), // caneca
  "DOP-016": U("1507473885765-e6ed057f782c"), // luminária
  "DOP-017": U("1505693416388-ac5ce068fe85"), // cama
  "DOP-018": U("1522771739844-6a9f6d5f14af"), // quarto/almofadas
  "DOP-019": U("1603006905003-be475563bc59"), // vela
  "DOP-020": U("1485955900006-10f4d324d411"), // planta
  "DOP-021": U("1505740420928-5e560c06d30e"), // fone
  "DOP-022": U("1609091839311-d5365f9ff1c5"), // carregador
  "DOP-023": U("1546868871-7041f2a55e12"), // smartwatch
  "DOP-024": U("1587829741301-dc798b83add3"), // teclado
  "DOP-025": U("1527443224154-c4a3942d3acf"), // setup monitor
  "DOP-026": U("1597872200969-2b65d56bd16b"), // hd/ssd
  "DOP-027": U("1620916566398-39f1143ab7be"), // sérum
  "DOP-028": U("1541643600914-78b084683601"), // perfume
  "DOP-029": U("1571781926291-c477ebfd024b"), // skincare
  "DOP-030": U("1604654894610-df63bc536371"), // unhas
  "DOP-031": U("1517836357463-d25dfeac3438"), // academia pesos
  "DOP-032": U("1538805060514-97d9cc17730c"), // corrida
  "DOP-033": U("1434596922112-19c563067271"), // pular corda
  "DOP-034": U("1602143407151-7111542de6e8"), // garrafa água
  "DOP-035": U("1558060370-d644479cb6f7"), // lego
  "DOP-036": U("1522542550221-31fd19575a2d"), // cartas
  "DOP-037": U("1567653418876-5bb0e566e1c2"), // cubo mágico
  "DOP-038": U("1569529465841-dfecdab7503b"), // dose whiskey
  "DOP-039": U("1544787219-7f47ccb76574"), // chá
  "DOP-040": U("1549465220-1a8b9238cd48"), // presente
};

if (process.argv[1].endsWith("set_images.mjs")) {
  const path = process.argv[2] ?? "data/products.csv";
  const lines = readFileSync(path, "utf8").trim().split(/\r?\n/);
  const header = lines[0].split(",");
  const imgIdx = header.indexOf("image_url");
  const out = [lines[0]];
  let missing = 0;
  for (const line of lines.slice(1)) {
    // troca apenas o campo image_url vazio (entre emoji e tags)
    const sku = line.slice(0, 7);
    const url = IMAGES[sku];
    if (!url) {
      missing++;
      out.push(line);
      continue;
    }
    // reconstrói: encontra posição do campo vazio ",," após o emoji
    const parts = line.split(",");
    // image_url é o 11º campo (índice 10) quando não há vírgulas extras antes;
    // abordagem robusta: substitui ",,<tags>" final? Não — tags variam.
    // Como só image_url está vazio e descrições com vírgula estão entre aspas,
    // fazemos parse simples respeitando aspas:
    const cells = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (c === '"') inQ = false;
        else cur += c;
      } else if (c === '"') inQ = true;
      else if (c === ",") { cells.push(cur); cur = ""; }
      else cur += c;
    }
    cells.push(cur);
    cells[imgIdx] = url;
    out.push(cells.map((c) => (c.includes(",") ? `"${c}"` : c)).join(","));
  }
  writeFileSync(path, out.join("\n") + "\n");
  console.log(`image_url preenchido. Sem mapeamento: ${missing}`);
}
