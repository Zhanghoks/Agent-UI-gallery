/* RecordsTable — source: components/primitives/RecordsTable.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
type Strength = "strong" | "weak" | "veryweak" | "none";
export type RecordRow = {
    id: string;
    name: string;
    tags: string[];
    last: string;
    strength: Strength;
    website?: string;
};
export declare function RecordsTable({ rows, fill }: {
    rows?: RecordRow[];
    fill?: boolean;
    variant?: string;
}): JSX.Element;
export {};
