/* Chip — source: components/atoms/Chip.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
/** Monospace token chip — for code values like `updated_at`. */
export declare function Chip({ children, tone, className, }: {
    children: React.ReactNode;
    tone?: "neutral" | "accent" | "orange";
    className?: string;
}): JSX.Element;
