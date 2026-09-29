// Creates a new gallery component folder that is valid from the first save.
import fs from "node:fs";
import path from "node:path";
import { buildCatalog } from "./catalog.mjs";
import { categoryProblem } from "./config.mjs";
import { pascalCase, titleCase } from "./naming.mjs";

const template = (name, title) => `"use client";

import { useEffect, useState } from "react";

export type ${name}Props = {
  status: "running" | "done" | "error";
  title: string;
};

/* Controlled view — everything it shows comes from props, so it can be driven
 * by real agent events. Keep animation and fake data out of it. */
export function ${name}({ status, title }: ${name}Props) {
  return (
    <div className="w-full max-w-[420px] rounded-card bg-surface p-4 shadow-card">
      <p className="text-[13px] font-medium text-ink">{title}</p>
      <p className="mt-1 text-[12px] text-ink-2">{status}</p>
    </div>
  );
}

/* Gallery demo — the default export. Drives the controlled view with fake,
 * timed data so the card in the gallery feels alive. */
export default function ${name}Demo({ variant }: { variant?: string }) {
  const [status, setStatus] = useState<${name}Props["status"]>("running");
  useEffect(() => {
    const t = setTimeout(() => setStatus("done"), 1800);
    return () => clearTimeout(t);
  }, []);
  return <${name} status={status} title={variant ?? "${title}"} />;
}
`;

export function scaffoldComponent({ root, config, id, category, title }) {
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(id ?? "")) {
    throw new Error(`"${id}" is not a valid id — use kebab-case (e.g. my-card)`);
  }
  category ??= config.categories[0];
  const categoryError = categoryProblem(config, category);
  if (categoryError) throw new Error(categoryError);
  const dir = path.join(root, "components", "gallery", id);
  if (fs.existsSync(dir)) throw new Error(`component "${id}" already exists`);

  const { entries, atoms } = buildCatalog({ root, config });
  if (atoms.some((a) => a.id === id)) throw new Error(`component "${id}" already exists as an atom`);
  const order = Math.max(0, ...entries.map((e) => e.order ?? 0)) + 10;

  const name = pascalCase(id);
  const meta = {
    id,
    title: title ?? titleCase(id),
    caption: "Describe what this component shows.",
    category,
    order,
    origin: "own",
  };
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify(meta, null, 2) + "\n");
  fs.writeFileSync(path.join(dir, "index.tsx"), template(name, meta.title));
  return dir;
}
