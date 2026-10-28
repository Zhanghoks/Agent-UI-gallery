/* SelectionActions — source: components/primitives/SelectionActions.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
export type SelectionText = {
    lead: string;
    original: string;
    rewrite: string;
};
export type SelectionAction = {
    id: string;
    icon: ReactNode;
    action?: string;
    busyLabel?: string;
};
export type SelectionActionSet = {
    primary: SelectionAction[];
    more: SelectionAction[];
};
export type SelectionActionsLabels = {
    keep: string;
    discard: string;
    placeholder: string;
};
export type SelectionActionsProps = {
    /** Accepted for gallery/registry parity; not used by this bar. */
    variant?: string;
    /** The passage shown above the bar. */
    text?: Partial<SelectionText>;
    /** The AI actions offered in the bar. */
    actions?: SelectionActionSet;
    /** Prominent copy strings. */
    labels?: Partial<SelectionActionsLabels>;
    /** Called with the action name whenever an edit is run. */
    onAction?: (action: string) => void;
};
export declare function SelectionActions({ text: textProp, actions, labels, onAction, }?: SelectionActionsProps): JSX.Element;
