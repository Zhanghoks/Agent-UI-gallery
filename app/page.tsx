import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Grid } from "@/components/site/Grid";
import { Nav } from "@/components/site/Nav";
import { PageSwitch, parsePageView } from "@/components/site/PageSwitch";
import { SystemSwitch } from "@/components/site/SystemSwitch";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import Harness from "@/components/harness/Harness";
import WorkflowConsole from "@/components/harness/WorkflowConsole";
import { DESIGN_SYSTEMS, type DesignSystemId } from "@/lib/design-systems";
import { META } from "@/lib/meta";
import config from "@/foundry.config.json";

function readSources(): Record<string, string> {
  const dir = path.join(process.cwd(), "components", "gallery");
  return Object.fromEntries(
    META.map((entry) => [
      entry.id,
      fs.readFileSync(path.join(dir, entry.id, "index.tsx"), "utf8"),
    ]),
  );
}

function isDesignSystem(view: string | undefined): view is DesignSystemId {
  return !!view && view in DESIGN_SYSTEMS;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}): Promise<Metadata> {
  const requested = (await searchParams).view;
  if (isDesignSystem(requested)) return {};
  const view = parsePageView(requested);
  if (view === "gallery") return {};
  const title = view === "workflow" ? "Workflow console" : config.harnessName;
  return { title: `${title} — ${config.name}` };
}

export default async function Home({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const requested = (await searchParams).view;
  if (isDesignSystem(requested)) redirect(`/design-systems/${requested}`);
  const view = parsePageView(requested);
  const sources = view === "gallery" ? readSources() : null;
  const wide = view !== "gallery";

  return (
    <main className={`relative mx-auto bg-page shadow-[0_0_0_1px_var(--line)] ${wide ? "max-w-none lg:h-[100dvh] lg:overflow-hidden" : "max-w-[960px]"}`}>
      <div className={`lg:grid lg:grid-cols-[288px_minmax(0,1fr)] ${wide ? "lg:h-full" : ""}`}>
        <aside className="flex flex-col border-b border-dashed border-line px-5 pt-12 pb-6 sm:px-7 sm:pt-16 sm:pb-7 lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden lg:border-r lg:border-b-0 lg:pt-[clamp(2.5rem,8vh,5rem)]">
          <div className="shrink-0">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-[13px] font-semibold tracking-[-0.01em] text-ink">
                {config.name}
              </Link>
              <ThemeToggle />
            </div>

            <PageSwitch current={view} />
            <SystemSwitch />

            <h1 className="mt-8 text-[21px] leading-snug font-semibold tracking-[-0.02em] text-ink text-balance">
              {config.tagline}
            </h1>
          </div>

          {view === "gallery" ? (
            <div className="relative mt-7 hidden border-t border-dashed border-line pt-6 lg:block lg:min-h-0 lg:flex-1 lg:overflow-hidden lg:pt-0">
              <div className="component-nav-scroll lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:pt-6 lg:pb-16">
                <Nav />
              </div>
            </div>
          ) : null}
        </aside>

        <div className={wide ? "min-w-0 lg:h-full lg:min-h-0 lg:overflow-auto" : "min-w-0"} data-view-scroll={wide ? "" : undefined}>
          {view === "gallery" && sources ? (
            <>
              <Grid sources={sources} />
              <footer className="flex items-center justify-between gap-4 border-t border-dashed border-line px-5 py-6 sm:px-8">
                <span className="text-[12px] text-ink-3">© 2026 {config.name}</span>
                <span className="flex items-center gap-4">
                  <Link href="/?view=harness" className="text-[12px] text-ink-3 transition-colors duration-150 hover:text-ink">
                    {config.harnessName}
                  </Link>
                  <Link href="/license" className="text-[12px] text-ink-3 transition-colors duration-150 hover:text-ink">
                    MIT License
                  </Link>
                </span>
              </footer>
            </>
          ) : null}
          {view === "workflow" ? <WorkflowConsole /> : null}
          {view === "harness" ? <Harness /> : null}
        </div>
      </div>
    </main>
  );
}
