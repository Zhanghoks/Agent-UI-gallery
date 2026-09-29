import type { ReactNode, SVGProps } from "react";

/* ─────────────────────────────────────────────────────────
 * ICONS
 * The library's own icon set — plain inline SVG, no icon package.
 * 24×24 grid, 2px round strokes, `currentColor`, so an icon takes
 * the color and (via `size`) the size of the text around it.
 * Add a new one with `icon("Name", <path … />)`.
 * ───────────────────────────────────────────────────────── */

export type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  /** width and height in px (default 16) */
  size?: number;
};

function icon(name: string, shapes: ReactNode) {
  function Icon({ size = 16, ...props }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        {...props}
      >
        {shapes}
      </svg>
    );
  }
  Icon.displayName = name;
  return Icon;
}

/* navigation & chrome */
export const HomeIcon = icon(
  "HomeIcon",
  <>
    <path d="M4 11.5 12 4.5l8 7" />
    <path d="M6 10.5V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8.5" />
    <path d="M10 20v-5h4v5" />
  </>,
);
export const SearchIcon = icon(
  "SearchIcon",
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </>,
);
export const SettingsIcon = icon(
  "SettingsIcon",
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M6 18l1.6-1.6M16.4 7.6 18 6" />
  </>,
);
export const PanelLeftIcon = icon(
  "PanelLeftIcon",
  <>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M9 4v16" />
    <path d="m15.5 10-2 2 2 2" />
  </>,
);
export const LogOutIcon = icon(
  "LogOutIcon",
  <>
    <path d="M10 4h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-8" />
    <path d="M4 12h10M4 12l3-3M4 12l3 3" />
  </>,
);

/* actions */
export const PlusIcon = icon("PlusIcon", <path d="M12 5v14M5 12h14" />);
export const CloseIcon = icon("CloseIcon", <path d="m7 7 10 10M17 7 7 17" />);
export const CheckIcon = icon("CheckIcon", <path d="m5.5 12.5 4.5 4.5L19 7.5" />);
export const EditIcon = icon(
  "EditIcon",
  <>
    <path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5" />
    <path d="M18.4 3.6a1.9 1.9 0 0 1 2.7 2.7L12 15.4l-3.6.7.7-3.6z" />
  </>,
);
export const RefreshIcon = icon(
  "RefreshIcon",
  <>
    <path d="M20 12a8 8 0 1 1-2.6-5.9" />
    <path d="M20 4v4.5h-4.5" />
  </>,
);
export const ArrowUpIcon = icon("ArrowUpIcon", <path d="M12 19V5M6 11l6-6 6 6" />);

/* arrows */
export const ChevronDownIcon = icon("ChevronDownIcon", <path d="m8 10 4 4 4-4" />);
export const ChevronRightIcon = icon("ChevronRightIcon", <path d="m9 6 6 6-6 6" />);

/* people & brand */
export const UserAddIcon = icon(
  "UserAddIcon",
  <>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <path d="M19 8v6M16 11h6" />
  </>,
);
export const PopsicleIcon = icon(
  "PopsicleIcon",
  <>
    <path d="M7 7a5 5 0 0 1 10 0v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7z" />
    <path d="M10.5 16v4a1.5 1.5 0 0 0 3 0v-4" />
    <path d="M7 11.5c1.6-1.2 3.2 0 5 0s3.4-1.2 5 0" />
  </>,
);

/* agent tools */
export const HelpBubbleIcon = icon(
  "HelpBubbleIcon",
  <>
    <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
    <path d="M10 9.5a2 2 0 1 1 2.6 1.9c-.4.2-.6.5-.6 1M12 14h.01" />
  </>,
);
export const SparkIcon = icon("SparkIcon", <path d="m12 3 2 6 6 3-6 3-2 6-2-6-6-3 6-3z" />);
export const ScissorsIcon = icon(
  "ScissorsIcon",
  <>
    <circle cx="6" cy="6.5" r="2.5" />
    <circle cx="6" cy="17.5" r="2.5" />
    <path d="M8.2 8 20 18M8.2 16 20 6" />
  </>,
);
export const SmileIcon = icon(
  "SmileIcon",
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 14a4 4 0 0 0 7 0M9 9.5h.01M15 9.5h.01" />
  </>,
);
export const TextBoxIcon = icon(
  "TextBoxIcon",
  <>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 9h10M7 13h10M7 17h6" />
  </>,
);
