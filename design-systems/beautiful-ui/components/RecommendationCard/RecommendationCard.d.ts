/* RecommendationCard — source: components/primitives/RecommendationCard.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
export type RecommendationOption = {
    key: string;
    body: React.ReactNode;
    short: string;
    signal: number;
    tone: string;
    label: string;
    cta: string;
    ctaVariant: ButtonVariant;
};
export type RecommendationLabels = {
    title: string;
    alternatives: string;
    otherOptions: string;
    accepted: string;
};
export declare function RecommendationCard({ options, labels, }?: {
    options?: RecommendationOption[];
    labels?: Partial<RecommendationLabels>;
    variant?: string;
}): JSX.Element;
