export type Meta = {
  id: string;
  title: string;
  caption: string;
  /** navigation group — one of `categories` in foundry.config.json */
  category: string;
  /** "upstream" = carried over from Beautiful UI, "own" = added here */
  origin: "upstream" | "own";
  variants?: string[];
  /** ids of atoms / other gallery components this one imports — copy these too */
  deps?: string[];
  /** npm packages the component imports — install these */
  npm?: string[];
};

/* Both are generated from components/gallery/*\/meta.json (npm run gen). */
export { META, INTERNAL } from "./gallery.generated";
