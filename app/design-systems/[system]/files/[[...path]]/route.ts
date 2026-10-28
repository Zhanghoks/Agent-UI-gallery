import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { DESIGN_SYSTEMS, type DesignSystemId } from "@/lib/design-systems";

const TYPES: Record<string, string> = {
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".json": "application/json",
  ".md": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

function isSystem(id: string): id is DesignSystemId {
  return id in DESIGN_SYSTEMS;
}

export async function GET(_request: Request, context: { params: Promise<{ system: string; path?: string[] }> }) {
  const { system, path: parts = [] } = await context.params;
  if (!isSystem(system) || parts.length === 0 || parts.some((part) => part === ".." || part.startsWith("."))) {
    return new Response("Not found", { status: 404 });
  }
  const root = path.join(process.cwd(), DESIGN_SYSTEMS[system].dir);
  const target = path.resolve(root, ...parts);
  if (target !== root && !target.startsWith(root + path.sep)) return new Response("Not found", { status: 404 });
  try {
    const info = await stat(target);
    if (!info.isFile()) return new Response("Not found", { status: 404 });
    const body = await readFile(target);
    const type = TYPES[path.extname(target).toLowerCase()] ?? "application/octet-stream";
    return new Response(body, { headers: { "Content-Type": type, "Cache-Control": "public, max-age=3600" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
