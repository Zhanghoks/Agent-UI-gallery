/* ChatComposer — source: components/primitives/ChatComposer.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
export type ChatMessage = {
    label: string;
    sub: string;
    time: string;
    body: string;
};
export type ChatComposerLabels = {
    /** the pre-filled prompt shown in the first user bubble */
    initialPrompt: string;
    /** composer input placeholder */
    placeholder: string;
};
export declare function ChatComposer({ messages, suggestions, labels, onSend, }?: {
    variant?: string;
    /** scripted agent replies revealed in sequence after the user sends */
    messages?: ChatMessage[];
    /** header chips (tabs) for switching context */
    suggestions?: string[];
    /** prominent copy strings */
    labels?: Partial<ChatComposerLabels>;
    /** fired with the trimmed prompt text when the user sends */
    onSend?: (text: string) => void;
}): JSX.Element;
