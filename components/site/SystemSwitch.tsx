import Link from "next/link";
import { DESIGN_SYSTEMS, type DesignSystemId } from "@/lib/design-systems";

export function SystemSwitch({ current }: { current?: DesignSystemId }) {
  return (
    <nav aria-label="Design systems" className="mt-4">
      <p className="mb-1 px-2 text-[11px] font-medium tracking-wide text-ink-3">Design systems</p>
      <ul>
        {(Object.keys(DESIGN_SYSTEMS) as DesignSystemId[]).map((id) => {
          const active = id === current;
          return (
            <li key={id}>
              <Link
                href={`/design-systems/${id}`}
                aria-current={active ? "page" : undefined}
                className={`flex items-center rounded-[7px] px-2 py-[5px] text-[12.5px] transition-colors duration-150 ${
                  active ? "bg-hover font-medium text-ink" : "text-ink-2 hover:bg-hover hover:text-ink"
                }`}
              >
                {DESIGN_SYSTEMS[id].label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
