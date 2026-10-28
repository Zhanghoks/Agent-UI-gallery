/* ProgressRing — source: components/atoms/ProgressRing.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
/** Small progress ring with content in the center — the task-badge from the refs. */
export declare function ProgressRing({ progress, tone, children, size, }: {
    progress: number;
    tone?: "orange" | "green" | "red" | "accent";
    children?: React.ReactNode;
    size?: number;
}): JSX.Element;
