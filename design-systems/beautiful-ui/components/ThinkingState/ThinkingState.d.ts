/* ThinkingState — source: components/primitives/ThinkingState.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
type Row = {
    primary: string;
    secondary?: string;
    mono?: boolean;
    add?: number;
    del?: number;
    href?: string;
};
export declare function ThinkingState({ variant, onSettled, rows, active, done, icon, }: {
    variant?: string;
    onSettled?: () => void;
    /** override the built-in trace content (keeps the primitive reusable) */
    rows?: Row[];
    active?: string;
    done?: string;
    /** override the header glyph (defaults to the sparkle) */
    icon?: ReactNode;
}): JSX.Element;
export {};
