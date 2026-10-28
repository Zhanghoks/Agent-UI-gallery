/* Flowchart — source: components/primitives/Flowchart.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
export type StepNode = {
    id: string;
    row: number;
    x: number;
    w: number;
    kind?: {
        label: string;
        hue: string;
    };
    hue?: string;
    title?: string;
    caption?: string;
    condition?: boolean;
};
export declare function Flowchart({ steps }?: {
    steps?: StepNode[];
    variant?: string;
}): JSX.Element;
