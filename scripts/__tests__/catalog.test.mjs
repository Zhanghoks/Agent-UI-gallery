import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildCatalog } from "../lib/catalog.mjs";
import { loadConfig } from "../lib/config.mjs";
import { scaffoldComponent } from "../lib/scaffold.mjs";

/* The one seam: gallery folders (+ atoms, global css, config) in →
 * catalog entries + registry files out. Fixtures are tiny throwaway repos. */

const CONFIG = {
  name: "Test UI",
  registryName: "testui",
  homepage: "https://example.test",
  registryBaseUrl: "https://example.test/r",
  namespaceDir: "testui",
  categories: [
    { id: "agent", label: "Agent", description: "Things agents do." },
    { id: "data", label: "Data", description: "Things agents show." },
    { id: "empty", label: "Empty", description: "Nothing here yet." },
  ],
};

const GLOBALS = [
  '@import "tailwindcss";',
  '@import "./gallery.generated.css";',
  ":root { --ink: #000; }",
].join("\n");

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function makeRepo({ components = {}, atoms = {}, atomFiles = {} } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "catalog-"));
  write(path.join(root, "app/globals.css"), GLOBALS);
  write(path.join(root, "components/atoms/atoms.json"), JSON.stringify(atoms));
  for (const [file, src] of Object.entries(atomFiles)) {
    write(path.join(root, "components/atoms", file), src);
  }
  for (const [id, c] of Object.entries(components)) {
    const dir = path.join(root, "components/gallery", id);
    if (c.meta !== null) write(path.join(dir, "meta.json"), JSON.stringify(c.meta));
    if (c.index !== null) write(path.join(dir, "index.tsx"), c.index ?? `export default function ${id}() {}`);
    for (const [f, src] of Object.entries(c.files ?? {})) write(path.join(dir, f), src);
  }
  return root;
}

const meta = (id, extra = {}) => ({
  id,
  title: id.toUpperCase(),
  caption: `${id} caption`,
  category: "agent",
  ...extra,
});

const UPSTREAM_IDS = [
  "agent-screen", "approval-card", "chat-composer", "code-block", "context-cards",
  "diff-table", "filter-table", "fine-tune-card", "flowchart", "insight-cards",
  "loading-state", "prompt-bar", "recommendation-card", "records-table", "search",
  "selection-actions", "sidebar-nav", "streaming-text", "task-rows", "thinking-state",
  "tool-chips",
];

const build = (root) => buildCatalog({ root, config: CONFIG });

test("a single component appears in the catalog and the registry", () => {
  const root = makeRepo({ components: { alpha: { meta: meta("alpha", { origin: "upstream" }) } } });
  const { entries, registry } = build(root);

  assert.deepEqual(entries.map((e) => e.id), ["alpha"]);
  assert.equal(entries[0].title, "ALPHA");
  assert.equal(entries[0].origin, "upstream");

  const item = registry.alpha;
  assert.equal(item.type, "registry:component");
  assert.equal(item.description, "alpha caption");
  assert.deepEqual(item.registryDependencies, ["https://example.test/r/foundation.json"]);
  assert.deepEqual(item.files.map((f) => f.path), ["components/gallery/alpha/index.tsx"]);
  assert.match(item.files[0].content, /function alpha/);
  assert.equal(item.dependencies, undefined);

  assert.deepEqual(
    registry.registry.items.map((i) => i.name),
    ["foundation", "alpha"],
  );
  assert.equal(registry.registry.name, "testui");
});

test("origin defaults to own", () => {
  const root = makeRepo({ components: { alpha: { meta: meta("alpha") } } });
  assert.equal(build(root).entries[0].origin, "own");
});

test("entries are ordered by `order`, then id", () => {
  const root = makeRepo({
    components: {
      charlie: { meta: meta("charlie") },
      bravo: { meta: meta("bravo", { order: 20 }) },
      alpha: { meta: meta("alpha", { order: 10 }) },
      delta: { meta: meta("delta") },
    },
  });
  assert.deepEqual(build(root).entries.map((e) => e.id), ["alpha", "bravo", "charlie", "delta"]);
});

test("entries are grouped by the category order in the config, then by `order`", () => {
  const root = makeRepo({
    components: {
      alpha: { meta: meta("alpha", { category: "data", order: 10 }) },
      bravo: { meta: meta("bravo", { category: "agent", order: 20 }) },
      charlie: { meta: meta("charlie", { category: "data", order: 30 }) },
      delta: { meta: meta("delta", { category: "agent", order: 40 }) },
    },
  });
  // CONFIG.categories is ["agent", "data"]
  assert.deepEqual(build(root).entries.map((e) => e.id), ["bravo", "delta", "alpha", "charlie"]);
});

test("groups follow the config's category order, carry labels, and skip empty categories", () => {
  const root = makeRepo({
    components: {
      alpha: { meta: meta("alpha", { category: "data", order: 10 }) },
      bravo: { meta: meta("bravo", { category: "agent", order: 20 }) },
      charlie: { meta: meta("charlie", { category: "data", order: 30 }) },
    },
  });
  const { groups } = build(root);
  assert.deepEqual(
    groups.map((g) => [g.id, g.label, g.description, g.entries.map((e) => e.id)]),
    [
      ["agent", "Agent", "Things agents do.", ["bravo"]],
      ["data", "Data", "Things agents show.", ["alpha", "charlie"]],
    ],
  );
});

test("fails when a configured category has no id or label", () => {
  const root = makeRepo({ components: { alpha: { meta: meta("alpha") } } });
  const bad = { ...CONFIG, categories: [{ id: "agent" }] };
  assert.throws(() => buildCatalog({ root, config: bad }), /category.*"label"/i);
});

test("variants and npm dependencies are carried through", () => {
  const root = makeRepo({
    components: { alpha: { meta: meta("alpha", { variants: ["One", "Two"], npm: ["glimm"] }) } },
  });
  const { entries, registry } = build(root);
  assert.deepEqual(entries[0].variants, ["One", "Two"]);
  assert.deepEqual(registry.alpha.dependencies, ["glimm"]);
});

test("an atom dependency is exposed as its own registry item", () => {
  const root = makeRepo({
    atoms: { button: { title: "Button", file: "Button.tsx", npm: ["class-variance-authority"] } },
    atomFiles: { "Button.tsx": "export const Button = 1;" },
    components: { alpha: { meta: meta("alpha", { deps: ["button"] }) } },
  });
  const { registry } = build(root);

  assert.deepEqual(registry.alpha.registryDependencies, [
    "https://example.test/r/foundation.json",
    "https://example.test/r/button.json",
  ]);
  assert.equal(registry.button.type, "registry:ui");
  assert.equal(registry.button.title, "Button");
  assert.deepEqual(registry.button.dependencies, ["class-variance-authority"]);
  assert.deepEqual(registry.button.files.map((f) => f.path), ["components/atoms/Button.tsx"]);
  assert.deepEqual(registry.registry.items.map((i) => i.name), ["foundation", "button", "alpha"]);
});

test("a component may depend on another gallery component", () => {
  const root = makeRepo({
    components: { alpha: { meta: meta("alpha", { deps: ["bravo"] }) }, bravo: { meta: meta("bravo") } },
  });
  assert.ok(build(root).registry.alpha.registryDependencies.includes("https://example.test/r/bravo.json"));
});

test("component css ships as an extra file and is imported by the generated stylesheet", () => {
  const root = makeRepo({
    components: {
      alpha: { meta: meta("alpha", { css: "styles.css" }), files: { "styles.css": ".alpha { color: red; }\n\n" } },
    },
  });
  const { registry, cssImports } = build(root);

  const css = registry.alpha.files.find((f) => f.type === "registry:file");
  assert.equal(css.target, "app/testui/alpha.css");
  assert.equal(css.content, ".alpha { color: red; }\n");
  assert.match(registry.alpha.description, /@import "\.\/testui\/alpha\.css"/);
  assert.deepEqual(cssImports, ["components/gallery/alpha/styles.css"]);
});

test("the foundation is the global css without the generated-import line", () => {
  const root = makeRepo({ components: { alpha: { meta: meta("alpha") } } });
  const foundation = build(root).registry.foundation;
  assert.equal(foundation.title, "Test UI foundation");
  assert.equal(foundation.files[0].target, "app/testui/foundation.css");
  assert.equal(foundation.files[0].content, '@import "tailwindcss";\n:root { --ink: #000; }');
});

test("removing a component folder removes it from the catalog and registry", () => {
  const root = makeRepo({ components: { alpha: { meta: meta("alpha") }, bravo: { meta: meta("bravo") } } });
  fs.rmSync(path.join(root, "components/gallery/bravo"), { recursive: true });
  const { entries, registry } = build(root);
  assert.deepEqual(entries.map((e) => e.id), ["alpha"]);
  assert.equal(registry.bravo, undefined);
  assert.deepEqual(registry.registry.items.map((i) => i.name), ["foundation", "alpha"]);
});

/* ── validation: every problem fails the build with a readable message ── */

function assertFails(components, pattern, extra = {}) {
  const root = makeRepo({ components, ...extra });
  assert.throws(() => build(root), pattern);
}

test("fails on a duplicate id across atoms and gallery components", () => {
  assertFails({ button: { meta: meta("button") } }, /duplicate id "button"/i, {
    atoms: { button: { title: "Button", file: "Button.tsx" } },
    atomFiles: { "Button.tsx": "x" },
  });
});

test("fails when a dependency cannot be resolved", () => {
  assertFails({ alpha: { meta: meta("alpha", { deps: ["ghost"] }) } }, /alpha.*dependency "ghost"/i);
});

test("fails when the declared css file is missing", () => {
  assertFails({ alpha: { meta: meta("alpha", { css: "styles.css" }) } }, /alpha.*styles\.css/i);
});

test("fails when a required field is missing", () => {
  const { caption, ...incomplete } = meta("alpha");
  assertFails({ alpha: { meta: incomplete } }, /alpha.*"caption"/i);
});

test("fails on an unknown category", () => {
  assertFails({ alpha: { meta: meta("alpha", { category: "nope" }) } }, /alpha.*category "nope"/i);
});

test("fails when the id does not match the folder name", () => {
  assertFails({ alpha: { meta: meta("other") } }, /folder "alpha".*id "other"/i);
});

test("fails when index.tsx is missing", () => {
  assertFails({ alpha: { meta: meta("alpha"), index: null } }, /alpha.*index\.tsx/i);
});

test("reports every problem at once", () => {
  const root = makeRepo({
    components: {
      alpha: { meta: meta("alpha", { category: "nope" }) },
      bravo: { meta: meta("bravo", { deps: ["ghost"] }) },
    },
  });
  assert.throws(
    () => build(root),
    (err) => /alpha/.test(err.message) && /bravo/.test(err.message),
  );
});

/* ── scaffolding: a new component must be valid the moment it is created ── */

test("a scaffolded component shows up in the catalog and registry", () => {
  const root = makeRepo({ components: { alpha: { meta: meta("alpha", { order: 10 }) } } });
  scaffoldComponent({ root, config: CONFIG, id: "my-card", category: "data" });

  const { entries, registry } = build(root);
  const created = entries.find((e) => e.id === "my-card");
  assert.equal(created.title, "My Card");
  assert.equal(created.category, "data");
  assert.equal(created.origin, "own");
  assert.equal(created.order, 20); // after the highest existing order
  assert.ok(registry["my-card"]);
  assert.match(registry["my-card"].files[0].content, /export default function MyCardDemo/);
});

test("scaffolding refuses an existing id, a bad id, or an unknown category", () => {
  const root = makeRepo({ components: { alpha: { meta: meta("alpha") } } });
  assert.throws(() => scaffoldComponent({ root, config: CONFIG, id: "alpha" }), /already exists/);
  assert.throws(() => scaffoldComponent({ root, config: CONFIG, id: "Not Kebab" }), /kebab-case/);
  assert.throws(() => scaffoldComponent({ root, config: CONFIG, id: "x", category: "nope" }), /category "nope"/);
});

/* ── declared dependencies must match what the source really imports ── */

const BUTTON = {
  atoms: { button: { title: "Button", file: "Button.tsx" } },
  atomFiles: { "Button.tsx": "export const Button = 1;" },
};
const withImports = (...lines) => lines.join("\n") + "\nexport default function x() {}\n";

test("fails when a component imports a registered atom it does not list in deps", () => {
  assertFails(
    { alpha: { meta: meta("alpha"), index: withImports('import { Button } from "@/components/atoms/Button";') } },
    /alpha.*imports atom "button".*deps/i,
    BUTTON,
  );
});

test("passes when the imported atom is listed in deps", () => {
  const root = makeRepo({
    ...BUTTON,
    components: {
      alpha: { meta: meta("alpha", { deps: ["button"] }), index: withImports('import { Button } from "@/components/atoms/Button";') },
    },
  });
  assert.doesNotThrow(() => build(root));
});

test("fails when a component imports an atom file that is not registered", () => {
  assertFails(
    { alpha: { meta: meta("alpha"), index: withImports('import Chip from "@/components/atoms/Chip";') } },
    /alpha.*atoms\/Chip.*not registered/i,
    { atomFiles: { "Chip.tsx": "export default 1;" } },
  );
});

test("fails when a component imports another gallery component it does not list in deps", () => {
  assertFails(
    {
      alpha: { meta: meta("alpha"), index: withImports('import Bravo from "@/components/gallery/bravo";') },
      bravo: { meta: meta("bravo") },
    },
    /alpha.*imports "bravo".*deps/i,
  );
});

test("fails when a component imports an npm package it does not list in npm", () => {
  assertFails(
    { alpha: { meta: meta("alpha"), index: withImports('import { motion } from "motion/react";', 'import { useState } from "react";') } },
    /alpha.*package "motion".*npm/i,
  );
});

test("scoped packages and sub-paths resolve to the package name", () => {
  const root = makeRepo({
    components: {
      alpha: {
        meta: meta("alpha", { npm: ["@scope/icons", "glimm"] }),
        index: withImports('import A from "@scope/icons/IconA";', 'import g from "glimm/dist/x";', 'import { createPortal } from "react-dom";'),
      },
    },
  });
  assert.doesNotThrow(() => build(root));
});

test("fails when an atom imports a package missing from its npm list", () => {
  assertFails({}, /atom "button".*package "clsx"/i, {
    atoms: { button: { title: "Button", file: "Button.tsx" } },
    atomFiles: { "Button.tsx": 'import clsx from "clsx";\nexport const Button = clsx;' },
  });
});

test("fails on a dependency cycle between gallery components", () => {
  assertFails(
    {
      alpha: { meta: meta("alpha", { deps: ["bravo"] }), index: withImports('import B from "@/components/gallery/bravo";') },
      bravo: { meta: meta("bravo", { deps: ["alpha"] }), index: withImports('import A from "@/components/gallery/alpha";') },
    },
    /cycle.*alpha.*bravo.*alpha/i,
  );
});

test("fails when a file in atoms/ is not registered in atoms.json", () => {
  assertFails({}, /atoms\/Stray\.tsx.*not registered/i, { atomFiles: { "Stray.tsx": "export default 1;" } });
});

/* ── the real repository ── */

test("the real gallery scans cleanly and still contains the 21 upstream components", () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const config = loadConfig(root);
  const { entries } = buildCatalog({ root, config });
  assert.equal(new Set(entries.map((e) => e.id)).size, entries.length);
  const upstream = entries.filter((e) => e.origin === "upstream").map((e) => e.id).sort();
  assert.deepEqual(upstream, UPSTREAM_IDS);
});
