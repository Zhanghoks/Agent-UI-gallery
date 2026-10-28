/* FilterTable — source: components/primitives/FilterTable.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
type Status = "todo" | "progress" | "done";
export type TableRow = {
    task: string;
    date: string;
    status: Status;
    owner: string;
};
export type FilterTableLabels = {
    columns: {
        task: string;
        date: string;
        status: string;
        owner: string;
    };
};
export declare function FilterTable({ rows, labels, }?: {
    rows?: TableRow[];
    labels?: FilterTableLabels;
    variant?: string;
}): JSX.Element;
export {};
