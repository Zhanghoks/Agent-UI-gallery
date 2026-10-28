/* StatusPill — source: components/atoms/StatusPill.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
declare const statusPillVariants: (props?: {
    tone?: "accent" | "neutral" | "orange" | "green" | "red";
} & { className?: string }) => string;
type Tone = "accent" | "neutral" | "orange" | "green" | "red";
export declare function StatusPill({ tone, children, dot, className, }: {
    tone?: Tone;
    children: React.ReactNode;
    dot?: boolean;
    className?: string;
}): JSX.Element;
export {};
