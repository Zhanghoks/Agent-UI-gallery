import { META } from "./gallery.generated";

export type Meta = {
  id: string;
  title: string;
  caption: string;
  /** id of a category in foundry.config.json */
  category: string;
  /** "upstream" = carried over from Beautiful UI, "own" = added here */
  origin: "upstream" | "own";
  variants?: string[];
  /** ids of atoms / other gallery components this one imports — copy these too */
  deps?: string[];
  /** npm packages the component imports — install these */
  npm?: string[];
};

/** A non-empty category, in config order, with the ids of its components (in display order). */
export type Group = { id: string; label: string; description: string; ids: string[] };

/* All generated from components/gallery/*\/meta.json (npm run gen). */
export { META, GROUPS, INTERNAL } from "./gallery.generated";

/** id → entry, for rendering GROUPS (which list ids only). */
export const META_BY_ID: Record<string, Meta> = Object.fromEntries(META.map((m) => [m.id, m]));
