import fs from "node:fs";
import path from "node:path";

export type Theme = { id: string; name: string };

export type DesignToken = {
  name: string;
  values: Record<string, string>;
  usage: string;
};

export type DesignCard = {
  name: string;
  summary: string;
  group: string;
  previewHtml: string;
  height: number;
};

export type DesignSystem = {
  ok: boolean;
  problems: string[];
  title: string;
  namespace: string;
  readme: string;
  themes: Theme[];
  color: DesignToken[];
  families: { id: string; tokens: DesignToken[] }[];
  typeFamilies: { name: string; stack: string }[];
  typeStyles: { group: string; name: string; fontSize: string; lineHeight: string; fontWeight: string }[];
  groups: { name: string; cards: DesignCard[] }[];
  cover: { previewHtml: string; height: number } | null;
  assets: { group: string; file: string }[];
  scripts: string[];
  stylesheets: string[];
};

const SKIP_KEYS = new Set(["name", "version", "meta", "type"]);

export function cssName(name: string): string {
  return name.replace(/\./g, "-");
}

export function firstSentence(readme: string): string {
  const body = readme.replace(/^\uFEFF/, "").replace(/^#\s+[^\n]*\n+/, "");
  const para = body
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s+/g, " ").trim())
    .find((block) => block && !block.startsWith("#") && !block.startsWith("<!--"));
  if (!para) return "";
  const match = para.match(/^[\s\S]*?[.。](?:\s|$)/);
  return (match ? match[0] : para).trim();
}

function readText(file: string): string | null {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return null;
  }
}

function themeMap(value: unknown, themes: string[]): Record<string, string> | null {
  const first = themes[0];
  if (!first) return null;
  if (typeof value === "string") {
    return Object.fromEntries(themes.map((id) => [id, value]));
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const fallback = [record[first], ...themes.map((id) => record[id])].find((item) => typeof item === "string");
  if (typeof fallback !== "string") return null;
  return Object.fromEntries(themes.map((id) => [id, typeof record[id] === "string" ? (record[id] as string) : fallback]));
}

function tokenList(raw: unknown, themes: string[]): DesignToken[] | null {
  if (!raw || typeof raw !== "object" || !Array.isArray((raw as { tokens?: unknown }).tokens)) return null;
  const tokens: DesignToken[] = [];
  for (const entry of (raw as { tokens: unknown[] }).tokens) {
    if (!entry || typeof entry !== "object") continue;
    const item = entry as { name?: unknown; value?: unknown; usage?: unknown };
    if (typeof item.name !== "string") continue;
    const values = themeMap(item.value, themes);
    if (!values) continue;
    tokens.push({ name: item.name, values, usage: typeof item.usage === "string" ? item.usage : "" });
  }
  return tokens;
}

function markerOf(previewHtml: string): { group: string; height: number } {
  const line = previewHtml.split("\n", 1)[0] ?? "";
  const group = /group="([^"]*)"/.exec(line)?.[1] ?? "";
  const parsed = Number(/height=(\d+)/.exec(line)?.[1] ?? 120);
  const height = Number.isFinite(parsed) ? Math.min(400, Math.max(40, parsed)) : 120;
  return { group, height };
}

function readCards(dir: string): Pick<DesignSystem, "groups" | "cover"> {
  const compDir = path.join(dir, "components");
  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(compDir, { withFileTypes: true });
  } catch {
    return { groups: [], cover: null };
  }
  const names = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  const grouped = new Map<string, DesignCard[]>();
  let cover: DesignSystem["cover"] = null;
  for (const name of names) {
    const previewHtml = readText(path.join(compDir, name, "preview.html"));
    if (previewHtml == null) continue;
    const { group, height } = markerOf(previewHtml);
    if (name === "Cover") {
      cover = { previewHtml, height };
      continue;
    }
    const readme = readText(path.join(compDir, name, "README.md")) ?? "";
    const groupName = group || "Ungrouped";
    const card: DesignCard = { name, summary: firstSentence(readme), group: groupName, previewHtml, height };
    grouped.set(groupName, [...(grouped.get(groupName) ?? []), card]);
  }
  return {
    groups: [...grouped.entries()].map(([name, cards]) => ({ name, cards })),
    cover,
  };
}

function cssValue(raw: string): string {
  const alias = raw.match(/^\{([A-Za-z0-9][A-Za-z0-9_.-]{0,63})\}$/);
  return alias ? `var(--${cssName(alias[1])})` : raw;
}

function varies(values: Record<string, string>, themes: string[]): boolean {
  return new Set(themes.map((id) => values[id])).size > 1;
}

function decl(name: string, raw: string): string {
  return `  --${cssName(name)}: ${cssValue(raw)};`;
}

/** CSS custom properties. `page` scopes them to `.ds-page`; `frame` scopes them to the preview document. */
export function tokenCss(system: DesignSystem, target: "page" | "frame"): string {
  const themes = system.themes.map((theme) => theme.id);
  if (themes.length === 0) return "";
  const base = target === "page" ? ".ds-page" : ":root";
  const shared: string[] = [];
  for (const family of system.typeFamilies) shared.push(`  --font-${cssName(family.name)}: ${family.stack};`);
  for (const family of system.families) {
    for (const token of family.tokens) {
      if (varies(token.values, themes)) continue;
      const value = token.values[themes[0]];
      if (value) shared.push(decl(token.name, value));
    }
  }
  const blocks = [`${base} {\n${shared.join("\n")}\n}`];
  for (const theme of themes) {
    const lines: string[] = [];
    for (const token of system.color) {
      const value = token.values[theme];
      if (value) lines.push(decl(token.name, value));
    }
    for (const family of system.families) {
      for (const token of family.tokens) {
        if (!varies(token.values, themes)) continue;
        const value = token.values[theme];
        if (value) lines.push(decl(token.name, value));
      }
    }
    const selector = target === "page" ? `.ds-page[data-theme="${theme}"]` : theme === themes[0] ? `:root, [data-theme="${theme}"]` : `[data-theme="${theme}"]`;
    blocks.push(`${selector} {\n${lines.join("\n")}\n}`);
  }
  return blocks.join("\n");
}

const empty = (): DesignSystem => ({
  ok: false,
  problems: [],
  title: "",
  namespace: "",
  readme: "",
  themes: [],
  color: [],
  families: [],
  typeFamilies: [],
  typeStyles: [],
  groups: [],
  cover: null,
  assets: [],
  scripts: [],
  stylesheets: [],
});

export function readDesignSystem(dir: string): DesignSystem {
  const result = empty();
  const indexText = readText(path.join(dir, "design-system.json"));
  if (indexText == null) {
    result.problems.push("missing design-system.json");
    return result;
  }
  let index: {
    title?: unknown;
    namespace?: unknown;
    libraries?: { file?: unknown }[];
    assetGroups?: Record<string, { order?: unknown; files?: Record<string, unknown> }>;
  };
  try {
    index = JSON.parse(indexText);
  } catch {
    result.problems.push("design-system.json is not an index");
    return result;
  }
  result.title = typeof index.title === "string" ? index.title : "";
  result.namespace = typeof index.namespace === "string" ? index.namespace : "";
  result.readme = readText(path.join(dir, "README.md")) ?? "";

  const tokensText = readText(path.join(dir, "tokens.json"));
  let tokens: Record<string, unknown> | null = null;
  if (tokensText == null) result.problems.push("missing tokens.json");
  else {
    try {
      tokens = JSON.parse(tokensText) as Record<string, unknown>;
    } catch {
      result.problems.push("tokens.json is not JSON");
    }
  }

  const colorRaw = tokens?.color;
  const themesOk =
    !!colorRaw &&
    typeof colorRaw === "object" &&
    Array.isArray((colorRaw as { themes?: unknown }).themes) &&
    Array.isArray((colorRaw as { tokens?: unknown }).tokens);
  if (!themesOk) {
    result.problems.push("tokens.json color is not a list");
  } else {
    const color = colorRaw as { themes: { id?: unknown; name?: unknown }[] };
    result.themes = color.themes
      .filter((theme) => theme && typeof theme.id === "string")
      .map((theme) => ({ id: theme.id as string, name: typeof theme.name === "string" ? theme.name : (theme.id as string) }));
    result.color = tokenList(colorRaw, result.themes.map((theme) => theme.id)) ?? [];
  }

  if (tokens) {
    for (const [key, value] of Object.entries(tokens)) {
      if (SKIP_KEYS.has(key) || key === "color") continue;
      if (!value || typeof value !== "object" || Array.isArray(value)) continue;
      const list = tokenList(value, result.themes.map((theme) => theme.id));
      if (!list) {
        result.problems.push(`tokens.json ${key} is not a list`);
        continue;
      }
      if (result.themes.length > 0) result.families.push({ id: key, tokens: list });
    }
    const type = tokens.type;
    if (type && typeof type === "object" && !Array.isArray(type)) {
      const families = (type as { families?: unknown }).families;
      if (families && typeof families === "object" && !Array.isArray(families)) {
        result.typeFamilies = Object.entries(families as Record<string, unknown>)
          .filter((entry): entry is [string, string] => typeof entry[1] === "string")
          .map(([name, stack]) => ({ name, stack }));
      }
      const groups = (type as { groups?: unknown }).groups;
      if (Array.isArray(groups)) {
        for (const group of groups) {
          if (!group || typeof group !== "object") continue;
          const groupName = typeof (group as { name?: unknown }).name === "string" ? (group as { name: string }).name : "";
          const styles = (group as { styles?: unknown }).styles;
          if (!Array.isArray(styles)) continue;
          for (const style of styles) {
            if (!style || typeof style !== "object") continue;
            const item = style as { name?: unknown; fontSize?: unknown; lineHeight?: unknown; fontWeight?: unknown };
            if (typeof item.name !== "string") continue;
            result.typeStyles.push({
              group: groupName,
              name: item.name,
              fontSize: typeof item.fontSize === "string" ? item.fontSize : String(item.fontSize ?? ""),
              lineHeight: typeof item.lineHeight === "string" ? item.lineHeight : String(item.lineHeight ?? ""),
              fontWeight: item.fontWeight == null ? "" : String(item.fontWeight),
            });
          }
        }
      }
    }
  }

  const cards = readCards(dir);
  result.groups = cards.groups;
  result.cover = cards.cover;

  const assetGroups = index.assetGroups ?? {};
  for (const [group, record] of Object.entries(assetGroups)) {
    const names = Array.isArray(record?.order)
      ? record.order.filter((name): name is string => typeof name === "string")
      : Object.keys(record?.files ?? {});
    for (const name of names) result.assets.push({ group, file: `assets/${group}/${name}` });
  }

  const libraryFiles = (index.libraries ?? []).map((lib) => lib?.file).filter((file): file is string => typeof file === "string");
  result.scripts = libraryFiles.filter((file) => fs.existsSync(path.join(dir, file)));
  if (fs.existsSync(path.join(dir, "components/bundle.js"))) result.scripts.push("components/bundle.js");
  if (fs.existsSync(path.join(dir, "components/bundle.css"))) result.stylesheets.push("components/bundle.css");

  result.ok = result.problems.length === 0;
  return result;
}
