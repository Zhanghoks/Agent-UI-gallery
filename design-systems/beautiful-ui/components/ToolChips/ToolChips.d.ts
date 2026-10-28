/* ToolChips — source: components/primitives/ToolChips.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
export type ToolDetailLine = {
    text: string;
    tone?: "add";
};
export type ToolStep = {
    icon: string;
    label: string;
    chip: string;
    mono: boolean;
    detailMono: boolean;
    detail: ToolDetailLine[];
};
export type ToolDiff = {
    file: string;
    add: number;
    del: number;
};
export type ToolDiffLine = {
    text: string;
    tone: "add" | "del" | "ctx";
};
export type ToolChipsLabels = {
    header: string;
    more: string;
};
export declare function ToolChips({ steps, diffs, diffLines, labels, className, onOpenChange, onToggleRow, }?: {
    /** Accepted for gallery/registry parity; ToolChips has no visual variants. */
    variant?: string;
    steps?: ToolStep[];
    diffs?: ToolDiff[];
    diffLines?: Record<string, ToolDiffLine[]>;
    labels?: Partial<ToolChipsLabels>;
    className?: string;
    onOpenChange?: (open: boolean) => void;
    onToggleRow?: (label: string, open: boolean) => void;
}): JSX.Element;
