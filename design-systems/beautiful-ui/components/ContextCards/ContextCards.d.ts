/* ContextCards — source: components/primitives/ContextCards.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
export type ContextChunk = {
    title: string;
    chars: string;
    body: string;
    source: string;
    badge: string;
    tone: string;
};
export type ContextCardsLabels = {
    header: string;
    count: string;
};
export declare function ContextCards({ chunks, labels, className, }?: {
    /** Accepted for gallery/registry parity; ContextCards has no visual variants. */
    variant?: string;
    chunks?: ContextChunk[];
    labels?: Partial<ContextCardsLabels>;
    className?: string;
}): JSX.Element;
