import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Grid } from "@/components/site/Grid";
import { Nav } from "@/components/site/Nav";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { META } from "@/lib/meta";
import config from "@/foundry.config.json";

/* Sources are read at build time (static export) so every card
 * can offer its own copy-paste-able file. */
function readSources(): Record<string, string> {
  const dir = path.join(process.cwd(), "components", "gallery");
  return Object.fromEntries(
    META.map((entry) => [
      entry.id,
      fs.readFileSync(path.join(dir, entry.id, "index.tsx"), "utf8"),
    ]),
  );
}

export default function Home() {
  const sources = readSources();

  return (
    <main className="relative mx-auto max-w-[960px] bg-page shadow-[0_0_0_1px_var(--line)]">
      <div className="lg:grid lg:grid-cols-[288px_minmax(0,1fr)]">
        {/* left rail — the system, then the component nav */}
        <aside className="flex flex-col border-b border-dashed border-line px-5 pt-12 pb-6 sm:px-7 sm:pt-16 sm:pb-7 lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden lg:border-r lg:border-b-0 lg:pt-[clamp(2.5rem,8vh,5rem)]">
          <div className="shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold tracking-[-0.01em] text-ink">{config.name}</span>
              <ThemeToggle />
            </div>

            <h1 className="mt-12 text-[21px] leading-snug font-semibold tracking-[-0.02em] text-ink text-balance lg:mt-[clamp(1.5rem,5vh,3rem)]">
              {config.tagline}
            </h1>
          </div>

          <div className="relative mt-7 hidden border-t border-dashed border-line pt-6 lg:block lg:min-h-0 lg:flex-1 lg:overflow-hidden lg:pt-0">
            <div className="component-nav-scroll lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:pt-6 lg:pb-16">
              <Nav />
            </div>
          </div>

        </aside>

        {/* right — the components, then the signup at the end of the scroll */}
        <div className="min-w-0">
          <Grid sources={sources} />

          {/* footer — lives in the scroll column so the sticky rail is untouched */}
          <footer className="flex items-center justify-between gap-4 border-t border-dashed border-line px-5 py-6 sm:px-8">
            <span className="text-[12px] text-ink-3">© 2026 {config.name}</span>
            <span className="flex items-center gap-4">
              <Link
                href="/harness"
                className="text-[12px] text-ink-3 transition-colors duration-150 hover:text-ink"
              >
                {config.harnessName}
              </Link>
              <Link
                href="/license"
                className="text-[12px] text-ink-3 transition-colors duration-150 hover:text-ink"
              >
                MIT License
              </Link>
            </span>
          </footer>
        </div>
      </div>
    </main>
  );
}
