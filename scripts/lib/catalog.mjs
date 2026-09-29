// The catalog seam: gallery folders (+ atoms, global css, config) in →
// catalog entries + shadcn registry files out. Pure reads, no writes.
import fs from "node:fs";
import path from "node:path";

const GALLERY_DIR = "components/gallery";
const ATOMS_DIR = "components/atoms";
const GLOBALS_CSS = "app/globals.css";
const GENERATED_CSS_MARKER = "gallery.generated.css";
const REQUIRED = ["id", "title", "caption", "category"];
const ORIGINS = ["upstream", "own"];

const SCHEMA_ITEM = "https://ui.shadcn.com/schema/registry-item.json";

const read = (root, p) => fs.readFileSync(path.join(root, p), "utf8");
const exists = (root, p) => fs.existsSync(path.join(root, p));
const trimEnd = (s) => s.replace(/\s+$/, "");

/* ── scan ─────────────────────────────────────────────────── */

function scanAtoms(root, errors) {
  const manifest = path.join(ATOMS_DIR, "atoms.json");
  if (!exists(root, manifest)) return [];
  return Object.entries(JSON.parse(read(root, manifest))).flatMap(([id, a]) => {
    const file = `${ATOMS_DIR}/${a.file}`;
    if (!exists(root, file)) {
      errors.push(`atom "${id}": file ${file} does not exist`);
      return [];
    }
    return [{ id, title: a.title ?? id, path: file, npm: a.npm ?? [] }];
  });
}

function scanGallery(root, config, errors) {
  const dir = path.join(root, GALLERY_DIR);
  if (!fs.existsSync(dir)) return [];
  const folders = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const entries = [];
  for (const folder of folders) {
    const base = `${GALLERY_DIR}/${folder}`;
    const metaFile = `${base}/meta.json`;
    if (!exists(root, metaFile)) {
      errors.push(`${folder}: missing meta.json`);
      continue;
    }
    let meta;
    try {
      meta = JSON.parse(read(root, metaFile));
    } catch (e) {
      errors.push(`${folder}: meta.json is not valid JSON (${e.message})`);
      continue;
    }

    const problems = [];
    for (const key of REQUIRED) {
      if (typeof meta[key] !== "string" || !meta[key]) problems.push(`missing required field "${key}"`);
    }
    if (meta.id && meta.id !== folder) problems.push(`folder "${folder}" does not match id "${meta.id}"`);
    if (meta.category && !config.categories.includes(meta.category)) {
      problems.push(`unknown category "${meta.category}" (known: ${config.categories.join(", ")})`);
    }
    if (meta.origin !== undefined && !ORIGINS.includes(meta.origin)) {
      problems.push(`origin must be one of ${ORIGINS.join(", ")}`);
    }
    if (!exists(root, `${base}/index.tsx`)) problems.push("missing index.tsx");
    if (meta.css && !exists(root, `${base}/${meta.css}`)) problems.push(`css file ${meta.css} does not exist`);

    if (problems.length) {
      for (const p of problems) errors.push(`${folder}: ${p}`);
      continue;
    }
    entries.push({
      id: meta.id,
      title: meta.title,
      caption: meta.caption,
      category: meta.category,
      origin: meta.origin ?? "own",
      ...(typeof meta.order === "number" ? { order: meta.order } : {}),
      ...(meta.variants?.length ? { variants: meta.variants } : {}),
      ...(meta.deps?.length ? { deps: meta.deps } : {}),
      ...(meta.npm?.length ? { npm: meta.npm } : {}),
      ...(meta.css ? { css: `${base}/${meta.css}` } : {}),
    });
  }

  return entries.sort(
    (a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || a.id.localeCompare(b.id),
  );
}

function validate(entries, atoms, errors) {
  const seen = new Set();
  for (const id of [...atoms.map((a) => a.id), ...entries.map((e) => e.id)]) {
    if (seen.has(id)) errors.push(`duplicate id "${id}"`);
    seen.add(id);
  }
  for (const e of entries) {
    for (const dep of e.deps ?? []) {
      if (!seen.has(dep) || dep === e.id) errors.push(`${e.id}: dependency "${dep}" does not resolve to an atom or gallery component`);
    }
  }
}

/* ── registry ─────────────────────────────────────────────── */

function buildRegistry({ root, config, entries, atoms }) {
  const { name: siteName, registryName, homepage, registryBaseUrl: base, namespaceDir: ns } = config;
  const foundationDep = `${base}/foundation.json`;
  const importNote = (file) => ` Then add \`@import "./${file}";\` to your app's globals.css.`;
  const out = {};

  const globals = read(root, GLOBALS_CSS)
    .split("\n")
    .filter((line) => !line.includes(GENERATED_CSS_MARKER))
    .join("\n");
  out.foundation = {
    $schema: SCHEMA_ITEM,
    name: "foundation",
    type: "registry:style",
    title: `${siteName} foundation`,
    description:
      "Design tokens (:root/.dark), the @theme mapping, base rules, the primitive-* spacing utilities, and shared keyframes every component needs." +
      importNote(`${ns}/foundation.css`),
    files: [
      {
        path: `app/${ns}/foundation.css`,
        content: globals,
        type: "registry:file",
        target: `app/${ns}/foundation.css`,
      },
    ],
  };

  for (const a of atoms) {
    out[a.id] = {
      $schema: SCHEMA_ITEM,
      name: a.id,
      type: "registry:ui",
      title: a.title,
      description: `Shared building block used by other ${siteName} components.`,
      ...(a.npm.length ? { dependencies: a.npm } : {}),
      registryDependencies: [foundationDep],
      files: [{ path: a.path, content: read(root, a.path), type: "registry:ui", target: a.path }],
    };
  }

  for (const e of entries) {
    const src = `${GALLERY_DIR}/${e.id}/index.tsx`;
    const files = [{ path: src, content: read(root, src), type: "registry:component", target: src }];
    let description = e.caption;
    if (e.css) {
      const target = `app/${ns}/${e.id}.css`;
      files.push({ path: target, content: `${trimEnd(read(root, e.css))}\n`, type: "registry:file", target });
      description += importNote(`${ns}/${e.id}.css`);
    }
    out[e.id] = {
      $schema: SCHEMA_ITEM,
      name: e.id,
      type: "registry:component",
      title: e.title,
      description,
      ...(e.npm?.length ? { dependencies: e.npm } : {}),
      registryDependencies: [foundationDep, ...(e.deps ?? []).map((d) => `${base}/${d}.json`)],
      files,
    };
  }

  out.registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: registryName,
    homepage,
    items: [
      { name: "foundation", type: "registry:style", title: `${siteName} foundation` },
      ...atoms.map((a) => ({ name: a.id, type: "registry:ui", title: a.title })),
      ...entries.map((e) => ({ name: e.id, type: "registry:component", title: e.title })),
    ],
  };
  return out;
}

/* ── public seam ──────────────────────────────────────────── */

export function buildCatalog({ root, config }) {
  const errors = [];
  const atoms = scanAtoms(root, errors);
  const entries = scanGallery(root, config, errors);
  validate(entries, atoms, errors);
  if (errors.length) {
    throw new Error(`Gallery catalog is invalid:\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  }
  return {
    entries,
    atoms,
    cssImports: entries.flatMap((e) => (e.css ? [e.css] : [])),
    registry: buildRegistry({ root, config, entries, atoms }),
  };
}
