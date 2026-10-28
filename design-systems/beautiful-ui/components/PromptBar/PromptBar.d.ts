/* PromptBar — source: components/primitives/PromptBar.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
export declare function PromptBar({ variant, demo, tall, placeholder, onSend, }: {
    variant?: string;
    /** the self-running walkthrough; turn off when embedding in a real surface */
    demo?: boolean;
    /** hero sizing: a multi-line input with controls on their own row */
    tall?: boolean;
    placeholder?: string;
    onSend?: (text: string) => void;
}): JSX.Element;
