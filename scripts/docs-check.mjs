// npm run docs:check — fails when the docs drift from the repository.
import { checkDocs } from "./lib/docs-check.mjs";

const problems = checkDocs({ root: process.cwd() });
if (problems.length) {
  console.error(`Docs are inconsistent with the repository:\n${problems.map((p) => `  - ${p.file}:${p.line}  ${p.message}`).join("\n")}`);
  process.exit(1);
}
console.log("Docs are consistent.");
