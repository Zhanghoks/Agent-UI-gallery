import Link from "next/link";

export const PAGE_VIEWS = [
  { id: "gallery", label: "Gallery", href: "/" },
  { id: "workflow", label: "Workflow", href: "/?view=workflow" },
  { id: "harness", label: "Harness", href: "/?view=harness" },
] as const;

export type PageView = (typeof PAGE_VIEWS)[number]["id"];

export function parsePageView(value: string | undefined): PageView {
  const match = PAGE_VIEWS.find((view) => view.id === value);
  return match?.id ?? "gallery";
}

export function PageSwitch({ current }: { current: PageView }) {
  return (
    <nav aria-label="Pages" className="mt-5">
      <p className="mb-1 px-2 text-[11px] font-medium tracking-wide text-ink-3">Pages</p>
      <ul>
        {PAGE_VIEWS.map((view) => {
          const active = view.id === current;
          return (
            <li key={view.id}>
              <Link
                href={view.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center rounded-[7px] px-2 py-[5px] text-[12.5px] transition-colors duration-150 ${
                  active ? "bg-hover font-medium text-ink" : "text-ink-2 hover:bg-hover hover:text-ink"
                }`}
              >
                {view.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
