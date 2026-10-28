/* SidebarNav — source: components/primitives/SidebarNav.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
export type SidebarRecent = {
    id: string;
    label: string;
    prompt?: string;
};
type SidebarNavProps = {
    activeTitle?: string | null;
    className?: string;
    fill?: boolean;
    onNewChat?: () => void;
    onPick?: (id: string, label: string, prompt?: string) => void;
    /** controlled primary-nav selection (e.g. "home" | "invite") */
    activeNav?: string;
    onNavigate?: (key: string) => void;
    /** footer call-to-action — defaults to the demo "Upgrade" button */
    footerLabel?: string;
    footerIcon?: ReactNode;
    onFooterClick?: () => void;
    recents?: SidebarRecent[];
    variant?: string;
};
export declare function SidebarNav({ activeTitle, className, fill, onNewChat, onPick, activeNav, onNavigate, footerLabel, footerIcon, onFooterClick, recents, }: SidebarNavProps): JSX.Element;
export {};
