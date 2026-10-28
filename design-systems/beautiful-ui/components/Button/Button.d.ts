/* Button — source: components/atoms/Button.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
export declare const buttonVariants: (props?: {
    variant?: "primary" | "secondary" | "ghost" | "accent" | "success" | "quiet";
    size?: "xs" | "sm" | "md";
} & { className?: string }) => string;
export type ButtonVariant = NonNullable<{ variant?: "primary" | "secondary" | "ghost" | "accent" | "success" | "quiet"; size?: "xs" | "sm" | "md" }["variant"]>;
export declare function Button({ variant, size, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "accent" | "success" | "quiet"; size?: "xs" | "sm" | "md" }): JSX.Element;
