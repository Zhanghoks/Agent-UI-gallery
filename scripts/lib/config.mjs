// Shared by the scripts and the catalog: reading foundry.config.json and
// validating values against it.
import fs from "node:fs";
import path from "node:path";

export const loadConfig = (root) =>
  JSON.parse(fs.readFileSync(path.join(root, "foundry.config.json"), "utf8"));

/** Returns a readable problem description, or null when the category is valid. */
export const categoryProblem = (config, category) =>
  config.categories.includes(category)
    ? null
    : `unknown category "${category}" (known: ${config.categories.join(", ")})`;
