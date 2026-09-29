// The catalog seam: gallery folders (+ atoms, global css, config) in →
// catalog entries + shadcn registry files out. Pure reads, no writes.
import fs from "node:fs";
import path from "node:path";
import { categoryProblem } from "./config.mjs";

const GALLERY_DIR = "components/gallery";
const ATOMS_DIR = "components/atoms";
const GLOBALS_CSS = "app/globals.css";
const GENERATED_CSS_MARKER = "gallery.generated.css";
const REQUIRED = ["id", "title", "caption", "category"];
const ORIGINS = ["upstream", "own"];
/* optional list-valued meta fields, copied only when non-empty */
const LIST_FIELDS = ["variants", "deps", "npm"];
/* entry fields the generated client catalog does not need */
export const BUILD_ONLY_FIELDS = ["css", "order"];

const SCHEMA_ITEM = "https://ui.shadcn.com/schema/registry-item.json";

const read = (root, p) => fs.readFileSync(path.join(root, p), "utf8");
const exists = (root, p) => fs.existsSync(path.join(root, p));
const trimEnd = (s) => s.replace(/\s+$/, "");

/* ── scan ─────────────────────────────────────────────────── */

function scanAtoms(root, errors) {
  const manifest = path.join(ATOMS_DIR, "atoms.json");
  if (!exists(root, manifest)) return [];
  const registered = JSON.parse(read(root, manifest));

  const registeredFiles = new Set(Object.values(registered).map((a) => a.file));
  const atomsDir = path.join(root, ATOMS_DIR);
  for (const file of fs.readdirSync(atomsDir).filter((f) => /\.tsx?$/.test(f))) {
    if (!registeredFiles.has(file)) {
      errors.push(`${ATOMS_DIR}/${file} is not registered in atoms.json (register it, or move it out of atoms/)`);
    }
  }

  return Object.entries(registered).flatMap(([id, a]) => {
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
    const categoryError = meta.category && categoryProblem(config, meta.category);
    if (categoryError) problems.push(categoryError);
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
      ...Object.fromEntries(LIST_FIELDS.filter((f) => meta[f]?.length).map((f) => [f, meta[f]])),
      ...(meta.css ? { css: `${base}/${meta.css}` } : {}),
    });
  }

  const rank = (e) => config.categories.indexOf(e.category);
  return entries.sort(
    (a, b) =>
      rank(a) - rank(b) ||
      (a.order ?? Infinity) - (b.order ?? Infinity) ||
      a.id.localeCompare(b.id),
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

/* ── declared dependencies must match the real imports ───── */

const PEER_PACKAGES = new Set(["react", "react-dom", "next"]);
/* Static imports/re-exports start a line and have no quote before the specifier;
 * anchoring like this keeps prose and code samples inside strings from matching. */
const STATIC_IMPORT_RE =
  /^[ \t]*(?:import\s*(?:[^"'`;]*?\bfrom\s*)?|export\b[^"'`;]*?\bfrom\s*)["']([^"']+)["']/gm;
const DYNAMIC_IMPORT_RE = /\bimport\(\s*["']([^"']+)["']\s*\)/g;

const importsOf = (source) =>
  [STATIC_IMPORT_RE, DYNAMIC_IMPORT_RE].flatMap((re) => [...source.matchAll(re)].map((m) => m[1]));
const packageName = (spec) => spec.split("/").slice(0, spec.startsWith("@") ? 2 : 1).join("/");

/* sorts every import of `source` into atoms, gallery components and npm packages */
function classifyImports(source, atoms) {
  const found = { atoms: new Set(), gallery: new Set(), unregisteredAtoms: new Set(), layering: new Set(), packages: new Set() };
  const atomByFile = new Map(atoms.map((a) => [path.basename(a.path).replace(/\.tsx?$/, ""), a.id]));
  for (const spec of importsOf(source)) {
    let m;
    if ((m = spec.match(/^@\/components\/atoms\/([^/]+)/))) {
      const id = atomByFile.get(m[1]);
      if (id) found.atoms.add(id);
      else found.unregisteredAtoms.add(m[1]);
    } else if ((m = spec.match(/^@\/components\/gallery\/([^/]+)/))) {
      found.gallery.add(m[1]);
    } else if (/^@\/components\/(site|harness)\b/.test(spec)) {
      found.layering.add(spec);
    } else if (!spec.startsWith(".") && !spec.startsWith("@/")) {
      const pkg = packageName(spec);
      if (!PEER_PACKAGES.has(pkg)) found.packages.add(pkg);
    }
  }
  return found;
}

function checkImports(root, entries, atoms, errors) {
  for (const e of entries) {
    const found = classifyImports(read(root, `${GALLERY_DIR}/${e.id}/index.tsx`), atoms);
    const deps = new Set(e.deps ?? []);
    const npm = new Set(e.npm ?? []);
    for (const id of found.atoms) {
      if (!deps.has(id)) errors.push(`${e.id}: imports atom "${id}" but does not list it in deps`);
    }
    for (const file of found.unregisteredAtoms) {
      errors.push(`${e.id}: imports ${ATOMS_DIR}/${file}, which is not registered in atoms.json`);
    }
    for (const id of found.gallery) {
      if (!deps.has(id)) errors.push(`${e.id}: imports "${id}" (${GALLERY_DIR}/${id}) but does not list it in deps`);
    }
    for (const spec of found.layering) errors.push(`${e.id}: imports ${spec} — gallery components must not depend on site/harness`);
    for (const pkg of found.packages) {
      if (!npm.has(pkg)) errors.push(`${e.id}: imports package "${pkg}" but does not list it in npm`);
    }
  }
  for (const a of atoms) {
    const found = classifyImports(read(root, a.path), atoms);
    for (const pkg of found.packages) {
      if (!a.npm.includes(pkg)) errors.push(`atom "${a.id}": imports package "${pkg}" but does not list it in npm`);
    }
  }
}

function findCycle(entries) {
  const deps = new Map(entries.map((e) => [e.id, (e.deps ?? []).filter((d) => entries.some((x) => x.id === d))]));
  const state = new Map(); // id → "visiting" | "done"
  const visit = (id, trail) => {
    if (state.get(id) === "done") return null;
    if (state.get(id) === "visiting") return [...trail.slice(trail.indexOf(id)), id];
    state.set(id, "visiting");
    for (const dep of deps.get(id)) {
      const cycle = visit(dep, [...trail, id]);
      if (cycle) return cycle;
    }
    state.set(id, "done");
    return null;
  };
  for (const id of deps.keys()) {
    const cycle = visit(id, []);
    if (cycle) return cycle;
  }
  return null;
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
  checkImports(root, entries, atoms, errors);
  const cycle = findCycle(entries);
  if (cycle) errors.push(`dependency cycle: ${cycle.join(" → ")}`);
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
