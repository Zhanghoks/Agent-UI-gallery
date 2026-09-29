// Shared by the scripts and the catalog: reading foundry.config.json and
// validating values against it.
import fs from "node:fs";
import path from "node:path";

export const loadConfig = (root) =>
  JSON.parse(fs.readFileSync(path.join(root, "foundry.config.json"), "utf8"));

export const categoryIds = (config) => config.categories.map((c) => c.id);

/** Returns a readable problem description, or null when the category is valid. */
export const categoryProblem = (config, category) =>
  categoryIds(config).includes(category)
    ? null
    : `unknown category "${category}" (known: ${categoryIds(config).join(", ")})`;

/** Problems with the config file itself (each category needs an id and a label). */
export function configProblems(config) {
  if (!Array.isArray(config.categories) || !config.categories.length) {
    return ['foundry.config.json: "categories" must be a non-empty list'];
  }
  return config.categories.flatMap((c, i) =>
    ["id", "label"].filter((k) => typeof c?.[k] !== "string" || !c[k]).map(
      (k) => `foundry.config.json: category #${i + 1} is missing "${k}"`,
    ),
  );
}
