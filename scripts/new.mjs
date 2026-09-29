// npm run new -- <id> [--category agent] [--title "My Card"]
import fs from "node:fs";
import path from "node:path";
import { scaffoldComponent } from "./lib/scaffold.mjs";

const root = process.cwd();
const config = JSON.parse(fs.readFileSync(path.join(root, "foundry.config.json"), "utf8"));
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};

try {
  const id = args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
  const dir = scaffoldComponent({ root, config, id, category: flag("category"), title: flag("title") });
  console.log(`Created ${path.relative(root, dir)}/ — edit index.tsx and meta.json, then \`npm run dev\`.`);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
