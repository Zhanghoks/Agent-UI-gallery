import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { DevToolbar } from "@/components/site/DevToolbar";
import { InteractionSounds } from "@/components/site/InteractionSounds";
import { ThemeSync } from "@/components/site/ThemeSync";
import config from "@/foundry.config.json";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
});

export const metadata: Metadata = {
  title: `${config.name} — ${config.tagline}`,
  description: config.description,
};

const themeScript = `(function(){try{var t=localStorage.getItem("bui-theme");document.documentElement.classList.toggle("dark",t!=="light")}catch(e){document.documentElement.classList.add("dark")}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${mono.variable} font-sans`}>
        <ThemeSync />
        <InteractionSounds />
        {children}
        <DevToolbar />
      </body>
    </html>
  );
}
