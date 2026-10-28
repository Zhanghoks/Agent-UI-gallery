import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DesignSystemNav } from "@/components/site/DesignSystemNav";
import { DesignSystemView } from "@/components/site/DesignSystemView";
import { SystemSwitch } from "@/components/site/SystemSwitch";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { readDesignSystem, tokenCss } from "@/lib/design-system";
import { DESIGN_SYSTEMS, type DesignSystemId } from "@/lib/design-systems";

function isSystem(id: string): id is DesignSystemId {
  return id in DESIGN_SYSTEMS;
}

export function generateStaticParams() {
  return Object.keys(DESIGN_SYSTEMS).map((system) => ({ system }));
}

export async function generateMetadata({ params }: { params: Promise<{ system: string }> }): Promise<Metadata> {
  const { system } = await params;
  if (!isSystem(system)) return {};
  const data = readDesignSystem(path.join(process.cwd(), DESIGN_SYSTEMS[system].dir));
  return { title: `${data.title || DESIGN_SYSTEMS[system].label}`, description: DESIGN_SYSTEMS[system].note };
}

export default async function DesignSystemPage({ params }: { params: Promise<{ system: string }> }) {
  const { system } = await params;
  if (!isSystem(system)) notFound();
  const design = readDesignSystem(path.join(process.cwd(), DESIGN_SYSTEMS[system].dir));

  return (
    <main className="relative mx-auto max-w-none bg-page shadow-[0_0_0_1px_var(--line)] lg:h-[100dvh] lg:overflow-hidden">
      <div className="lg:grid lg:h-full lg:grid-cols-[288px_minmax(0,1fr)]">
        <aside className="flex flex-col border-b border-dashed border-line px-5 pt-12 pb-6 sm:px-7 sm:pt-16 sm:pb-7 lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden lg:border-r lg:border-b-0 lg:pt-[clamp(2.5rem,8vh,5rem)]">
          <div className="shrink-0">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-[13px] font-medium text-ink-2 transition-colors duration-150 hover:text-ink">
                Gallery
              </Link>
              <ThemeToggle />
            </div>
            <SystemSwitch current={system} />
          </div>
          <div className="relative mt-7 hidden border-t border-dashed border-line pt-6 lg:block lg:min-h-0 lg:flex-1 lg:overflow-hidden lg:pt-0">
            <div className="component-nav-scroll lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:pt-6 lg:pb-16">
              <DesignSystemNav
                groups={design.groups.map((group) => ({ name: group.name, cards: group.cards.map((card) => card.name) }))}
                prefix={system}
                title={design.title || DESIGN_SYSTEMS[system].label}
              />
            </div>
          </div>
        </aside>
        <div className="min-w-0 lg:h-full lg:min-h-0 lg:overflow-auto" data-view-scroll="">
          <DesignSystemView
            anchorPrefix={system}
            fileBase={`/design-systems/${system}/files`}
            frameCss={tokenCss(design, "frame")}
            note={DESIGN_SYSTEMS[system].note}
            pageCss={tokenCss(design, "page")}
            system={design}
          />
        </div>
      </div>
    </main>
  );
}
