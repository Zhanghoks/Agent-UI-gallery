/* SegmentedControl — source: components/atoms/SegmentedControl.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
/** Segmented control — equal-width segments, sliding thumb. */
export declare function SegmentedControl<T extends string>({ options, value, onChange, className, }: {
    options: readonly T[];
    value: T;
    onChange: (v: T) => void;
    className?: string;
}): JSX.Element;
