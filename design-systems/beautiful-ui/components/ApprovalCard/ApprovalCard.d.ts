/* ApprovalCard — source: components/primitives/ApprovalCard.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
export type ApprovalQuestion = {
    q: string;
    type: "radio" | "check";
    options: string[];
};
export type ApprovalLabels = {
    skip: string;
    continue: string;
    send: string;
    customPlaceholder: string;
    sentMessage: string;
};
export declare function ApprovalCard({ questions, labels, onSubmitted, onAnswerChange, resettable, }?: {
    questions?: ApprovalQuestion[];
    labels?: Partial<ApprovalLabels>;
    onSubmitted?: (answers: Record<number, number[]>) => void;
    onAnswerChange?: (questionIndex: number, answer: number[]) => void;
    resettable?: boolean;
    variant?: string;
}): JSX.Element;
