/** Declared reference snapshots. A folder on disk does not become a page. */
export const DESIGN_SYSTEMS = {
  "beautiful-ui": {
    dir: "design-systems/beautiful-ui",
    label: "Beautiful UI",
    note: "Upstream design system. The gallery components are the copyable source; this page is the reference, not a second copy.",
  },
  huabu: {
    dir: "design-systems/huabu",
    label: "Huabu",
    note: "Static renditions for reference. A gallery component taken from here is redrawn, not copied from these previews.",
  },
} as const;

export type DesignSystemId = keyof typeof DESIGN_SYSTEMS;
