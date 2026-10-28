/* GlideMenu — source: components/primitives/GlideMenu.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
type GlideMenuProps = {
    children: ReactNode;
    className?: string;
    highlightClassName?: string;
    rowSelector?: string;
};
/** A single hover layer that glides between interactive menu rows. */
export declare function GlideMenu({ children, className, highlightClassName, rowSelector, }: GlideMenuProps): JSX.Element;
export {};
