/* InsightCards — source: components/primitives/InsightCards.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
export type CompareSeries = {
    name: string;
    values: number[];
    sub: string;
    tone: "red" | "green";
    dot: string;
    color: string;
    tooltipColor: string;
};
export type AnomalyData = {
    spend: number[];
    usage: number[];
};
export type AllocationSegment = {
    name: string;
    label: string;
    pct: number;
    amount: string;
    cls: string;
    tone: string;
};
export type InsightPage = {
    key: string;
    prose: React.ReactNode;
    Card: React.ComponentType;
    pill: string;
};
export type InsightCardsLabels = {
    /** carousel heading shown before the page count */
    title: string;
};
export declare function InsightCards({ pages, labels, }?: {
    variant?: string;
    pages?: InsightPage[];
    labels?: Partial<InsightCardsLabels>;
}): JSX.Element;
