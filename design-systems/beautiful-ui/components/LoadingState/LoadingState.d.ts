/* LoadingState — source: components/primitives/LoadingState.tsx */
import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
export declare function LoadingState({ label, variant, 
/** the meme feed for the Surfer variant; hosted on Vercel Blob so it plays in
 *  production (the local /public/subway-surfers.mp4 stays gitignored).
 *  Heavily compressed (288px, 20fps, no audio → ~265 KB, from 1.1 MB) to keep
 *  Blob data transfer down. */
videoSrc, }: {
    label?: string;
    variant?: string;
    videoSrc?: string;
}): JSX.Element;
