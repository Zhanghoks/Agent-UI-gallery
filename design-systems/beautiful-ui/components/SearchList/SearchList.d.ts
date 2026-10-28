/* SearchList — source: components/primitives/SearchList.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
export type SearchItem = string;
export type SearchListLabels = {
    placeholder: string;
    ariaLabel: string;
    emptyTitle: string;
    emptyHint: string;
};
export declare function SearchList({ items, labels, }?: {
    items?: SearchItem[];
    labels?: SearchListLabels;
    variant?: string;
}): JSX.Element;
