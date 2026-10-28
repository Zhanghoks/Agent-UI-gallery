export function designAnchor(prefix: string, name: string): string {
  return `${prefix}-${name.trim().replace(/\s+/g, "-")}`;
}
