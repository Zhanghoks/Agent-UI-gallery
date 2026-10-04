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

/* workflow display — shapes drawn for this set, not taken from an icon package */
export const WorkflowIcon = icon(
  "WorkflowIcon",
  <>
    <circle cx="6" cy="7" r="2" />
    <circle cx="18" cy="7" r="2" />
    <circle cx="12" cy="17" r="2" />
    <path d="M8 7h8M7.2 8.8 11 15M16.8 8.8 13 15" />
  </>,
);
export const TerminalIcon = icon(
  "TerminalIcon",
  <>
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <path d="m8 10 2.4 2L8 14M12.5 14H16" />
  </>,
);
export const FileIcon = icon(
  "FileIcon",
  <>
    <path d="M7 3.5h6.5L18 8V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
    <path d="M13 3.5V8h5" />
  </>,
);
export const MarkdownIcon = icon(
  "MarkdownIcon",
  <>
    <path d="M5 7h8a4 4 0 0 1 0 8H9" />
    <path d="M9 7v11M15 11v7" />
  </>,
);
export const ChartIcon = icon(
  "ChartIcon",
  <>
    <path d="M4 19h16" />
    <path d="M7 16V11M12 16V7M17 16v-5" />
  </>,
);
export const TableIcon = icon(
  "TableIcon",
  <>
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <path d="M4 10h16M10 10v9" />
  </>,
);
export const MetricsIcon = icon(
  "MetricsIcon",
  <>
    <path d="M4 16.5 8.5 11l3.2 3.2L19 6.5" />
    <path d="M14.5 6.5H19V11" />
  </>,
);
export const BoardIcon = icon(
  "BoardIcon",
  <>
    <rect x="3.5" y="4" width="5" height="16" rx="1" />
    <rect x="10" y="4" width="5" height="10" rx="1" />
    <rect x="16.5" y="4" width="4" height="7" rx="1" />
  </>,
);
export const BranchIcon = icon(
  "BranchIcon",
  <>
    <circle cx="7" cy="6" r="2" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="14" r="2" />
    <path d="M7 8v8M9 6h3a5 5 0 0 1 5 5v1" />
  </>,
);
export const ArrowUpRightIcon = icon(
  "ArrowUpRightIcon",
  <>
    <path d="M7 17 17 7" />
    <path d="M9 7h8v8" />
  </>,
);
export const StopIcon = icon("StopIcon", <rect x="7" y="7" width="10" height="10" rx="1.5" />);
export const DiamondIcon = icon("DiamondIcon", <path d="M12 3.5 20.5 12 12 20.5 3.5 12z" />);

/* run, plan and attachment shapes */
export const PlayIcon = icon("PlayIcon", <path d="M8 5.5v13l10.5-6.5z" />);
export const ClockIcon = icon(
  "ClockIcon",
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </>,
);
export const AlertIcon = icon(
  "AlertIcon",
  <>
    <path d="M12 4 21 19.5H3z" />
    <path d="M12 10v4.5M12 17.2v.1" />
  </>,
);
export const PaperclipIcon = icon(
  "PaperclipIcon",
  <path d="m19 11-7 7a4.5 4.5 0 0 1-6.4-6.4l8-8a3 3 0 0 1 4.2 4.2l-8 8a1.5 1.5 0 0 1-2.1-2.1L14 8.5" />,
);
export const LinkIcon = icon(
  "LinkIcon",
  <>
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </>,
);
export const FlagIcon = icon(
  "FlagIcon",
  <>
    <path d="M6 21V4" />
    <path d="M6 5h11l-2.5 3.5L17 12H6" />
  </>,
);
export const ListIcon = icon(
  "ListIcon",
  <>
    <path d="M9.5 7H20M9.5 12H20M9.5 17H20" />
    <path d="M4.5 7h.1M4.5 12h.1M4.5 17h.1" />
  </>,
);
export const UndoIcon = icon(
  "UndoIcon",
  <>
    <path d="M9 7 4.5 11.5 9 16" />
    <path d="M5 11.5h9a5 5 0 0 1 0 10h-2" />
  </>,
);
export const FolderIcon = icon(
  "FolderIcon",
  <path d="M3.5 7a1.5 1.5 0 0 1 1.5-1.5h4l2 2.5h8A1.5 1.5 0 0 1 20.5 9.5V18a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18z" />,
);
export const ShieldIcon = icon(
  "ShieldIcon",
  <>
    <path d="M12 3.5 19 6v5.5c0 4.2-2.9 7.4-7 9-4.1-1.6-7-4.8-7-9V6z" />
    <path d="m9 12 2.2 2.2L15.2 10" />
  </>,
);
