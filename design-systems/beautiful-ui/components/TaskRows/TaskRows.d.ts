/* TaskRows — source: components/primitives/TaskRows.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
export type TaskDetail = {
    label: string;
    meta: string;
};
export type TaskRow = {
    key: string;
    label: string;
    amount: string;
    status: "done" | "running" | "sequence";
    step?: number;
    details: TaskDetail[];
};
export type TaskRowsLabels = {
    completed: string;
    failed: string;
};
export declare function TaskRows({ variant, rows, labels, className, onToggleRow, }: {
    variant?: string;
    rows?: TaskRow[];
    labels?: Partial<TaskRowsLabels>;
    className?: string;
    onToggleRow?: (key: string, open: boolean) => void;
}): JSX.Element;
