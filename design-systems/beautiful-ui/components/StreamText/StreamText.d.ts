/* StreamText — source: components/atoms/StreamText.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
export declare function StreamText({ text, charsPerTick, tickMs, blurTail, caret, className, onProgress, onDone, }: {
    text: string;
    /** characters revealed per tick — higher is faster */
    charsPerTick?: number;
    /** interval between reveals, ms */
    tickMs?: number;
    /** how many trailing characters carry the soft blur edge */
    blurTail?: number;
    /** render the caret (solid while streaming, blinks once idle) */
    caret?: boolean;
    className?: string;
    /** fires each tick — useful for re-anchoring UI to reflowing text */
    onProgress?: () => void;
    /** fires once the full string is shown */
    onDone?: () => void;
}): JSX.Element;
