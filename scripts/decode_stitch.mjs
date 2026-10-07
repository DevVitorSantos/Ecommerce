import { readFileSync, writeFileSync } from "node:fs";

const src = process.argv[2];
const raw = readFileSync(src, "utf8");
const j = JSON.parse(raw);
const screens = j.screens || j;

for (const id of process.argv.slice(3)) {
  const s = screens.find((x) => (x.name || "").endsWith("/" + id));
  if (!s) {
    console.log(id, "NOT FOUND");
    continue;
  }
  const url = s.htmlCode && s.htmlCode.downloadUrl ? s.htmlCode.downloadUrl : "";
  const m = url.match(/^data:text\/html;base64,(.*)$/s);
  if (!m) {
    console.log(id, "no base64 html, url prefix:", url.slice(0, 80));
    continue;
  }
  const html = Buffer.from(m[1], "base64").toString("utf8");
  const out = `${process.env.TEMP || "/tmp"}/stitch-${id}.html`;
  writeFileSync(out, html);
  console.log(id, "OK", html.length, "chars ->", out);
}
