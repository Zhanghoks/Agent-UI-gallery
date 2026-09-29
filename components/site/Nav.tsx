"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { META, GROUPS, META_BY_ID } from "@/lib/meta";

/* Component nav — anchors into the list, scrollspy highlights
 * the section in view, and a single pill glides to whichever
 * item the pointer is over (falling back to the active one). */

/* a group header (#group-<id>) counts as its first component being in view */
const FIRST_IN_GROUP: Record<string, string> = Object.fromEntries(
  GROUPS.map((g) => [`group-${g.id}`, g.ids[0]]),
);

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Nav() {
  const [active, setActive] = useState(META[0].id);
  const [hovered, setHovered] = useState<string | null>(null);
  const [box, setBox] = useState<{ top: number; height: number } | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(FIRST_IN_GROUP[e.target.id] ?? e.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    [...META.map((m) => m.id), ...Object.keys(FIRST_IN_GROUP)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // position the gliding pill on the hovered item, else the active one
  useLayoutEffect(() => {
    const target = itemRefs.current[hovered ?? active];
    if (target) setBox({ top: target.offsetTop, height: target.offsetHeight });
  }, [hovered, active]);

  return (
    <nav aria-label="Components">
      <p className="mb-2 text-[11.5px] text-ink-3">Components</p>
      <ul
        ref={listRef}
        onMouseLeave={() => setHovered(null)}
        className="relative flex flex-col"
      >
        {/* single gliding highlight */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 rounded-[7px] bg-hover"
          style={{
            top: box?.top ?? 0,
            height: box?.height ?? 0,
            opacity: box ? 1 : 0,
            transition:
              "top 220ms cubic-bezier(0.23,1,0.32,1), height 220ms cubic-bezier(0.23,1,0.32,1), opacity 150ms ease",
          }}
        />
        {GROUPS.map((group) => (
          <Fragment key={group.id}>
            <li
              role="presentation"
              className="mt-3 mb-1 px-2 text-[11px] font-medium tracking-wide text-ink-3 first:mt-0"
            >
              <a
                href={`#group-${group.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(`group-${group.id}`);
                }}
                className="transition-colors duration-150 hover:text-ink-2"
              >
                {group.label}
              </a>
            </li>
            {group.ids.map((id) => {
              const m = META_BY_ID[id];
              return (
                <li
                  key={m.id}
                  ref={(el) => {
                    itemRefs.current[m.id] = el;
                  }}
                >
                  <a
                    href={`#${m.id}`}
                    onMouseEnter={() => setHovered(m.id)}
                    onFocus={() => setHovered(m.id)}
                    onBlur={() => setHovered(null)}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(m.id);
                    }}
                    className={`relative z-10 flex items-center rounded-[7px] px-2 py-[5px]
                      text-[12.5px] transition-colors duration-150
                      ${active === m.id ? "font-medium text-ink" : "text-ink-2 hover:text-ink"}`}
                  >
                    {m.title}
                  </a>
                </li>
              );
            })}
          </Fragment>
        ))}
      </ul>
    </nav>
  );
}
