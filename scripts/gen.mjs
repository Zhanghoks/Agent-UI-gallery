// Scans components/gallery/* and writes everything derived from it:
//   lib/gallery.generated.ts   catalog data (server-safe)
//   lib/demos.generated.tsx    id → Demo component map (client)
//   app/gallery.generated.css  imports of per-component styles
//   public/r/*.json            shadcn registry            (--registry)
import fs from "node:fs";
import path from "node:path";
import { buildCatalog } from "./lib/catalog.mjs";
import { renderCss, renderDemos, renderMeta } from "./lib/emit.mjs";

const root = process.cwd();
const config = JSON.parse(fs.readFileSync(path.join(root, "foundry.config.json"), "utf8"));
const write = (p, content) => fs.writeFileSync(path.join(root, p), content);

let catalog;
try {
  catalog = buildCatalog({ root, config });
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

write("lib/gallery.generated.ts", renderMeta(catalog));
write("lib/demos.generated.tsx", renderDemos(catalog));
write("app/gallery.generated.css", renderCss(catalog));
console.log(`Generated catalog for ${catalog.entries.length} components.`);

if (process.argv.includes("--registry")) {
  const out = path.join(root, "public", "r");
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  for (const [name, json] of Object.entries(catalog.registry)) {
    fs.writeFileSync(path.join(out, `${name}.json`), JSON.stringify(json, null, 2) + "\n");
  }
  console.log(`Wrote ${Object.keys(catalog.registry).length} registry files to public/r/`);
}
