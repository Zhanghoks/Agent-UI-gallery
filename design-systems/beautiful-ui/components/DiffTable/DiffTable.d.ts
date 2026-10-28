/* DiffTable — source: components/primitives/DiffTable.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
export type DiffRow = {
    key: string;
    id: string;
    dept: string;
    email: string;
    removed: boolean;
};
export declare function DiffTable({ rows, }?: {
    rows?: DiffRow[];
    variant?: string;
}): JSX.Element;
