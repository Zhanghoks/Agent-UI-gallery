/* TextRow — source: components/atoms/TextRow.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
/** Label-left / value-right row — the workhorse of every card in the refs. */
export declare function TextRow({ label, value, meta, className, }: {
    label: React.ReactNode;
    value: React.ReactNode;
    meta?: React.ReactNode;
    className?: string;
}): JSX.Element;
