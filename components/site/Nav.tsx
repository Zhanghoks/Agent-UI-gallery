"use client";

import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { META, GROUPS, META_BY_ID } from "@/lib/meta";

/* Component nav — anchors into the list, scrollspy highlights
 * the section in view, and a single pill glides to whichever
 * item the pointer is over (falling back to the active one).
 * Lookup aids: a filter box (title, caption, id, category; Enter
 * jumps to the first match), a count per category, and categories
 * that fold. Filtering only narrows this list — the cards stay put. */

function matches(query: string, haystack: string): boolean {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const text = haystack.toLowerCase();
  return words.every((word) => text.includes(word));
}

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
  const [query, setQuery] = useState("");
  const [folded, setFolded] = useState<Set<string>>(new Set());
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

  const searching = query.trim() !== "";
  /* group id → ids that pass the filter (all of them when the box is empty) */
  const visible = useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const group of GROUPS) {
      result[group.id] = group.ids.filter((id) => {
        if (!searching) return true;
        const m = META_BY_ID[id];
        return matches(query, `${m.title} ${m.caption} ${m.id} ${group.label}`);
      });
    }
    return result;
  }, [query, searching]);
  const shown = GROUPS.reduce((n, g) => n + visible[g.id].length, 0);
  const firstMatch = GROUPS.map((g) => visible[g.id][0]).find(Boolean);

  const toggleFold = (id: string) =>
    setFolded((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  // position the gliding pill on the hovered item, else the active one
  useLayoutEffect(() => {
    const target = itemRefs.current[hovered ?? active];
    if (target) setBox({ top: target.offsetTop, height: target.offsetHeight });
    else setBox(null);
  }, [hovered, active, visible, folded]);

  return (
    <nav aria-label="Components">
      <p className="mb-2 text-[11.5px] text-ink-3">
        Components <span className="tabular-nums">· {searching ? `${shown}/${META.length}` : META.length}</span>
      </p>
      <input
        aria-label="Filter components"
        className="mb-3 w-full rounded-[7px] bg-field px-2.5 py-1.5 text-[12.5px] text-ink outline-none placeholder:text-ink-3"
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setQuery("");
          if (e.key === "Enter" && firstMatch) scrollToId(firstMatch);
        }}
        placeholder="Filter…  e.g. workflow, table"
        type="search"
        value={query}
      />
      {searching && shown === 0 ? <p className="px-2 text-[12px] text-ink-3">No match.</p> : null}
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
        {GROUPS.map((group) => {
          const ids = visible[group.id];
          if (ids.length === 0) return null;
          const isFolded = !searching && folded.has(group.id);
          return (
            <Fragment key={group.id}>
              <li
                role="presentation"
                className="mt-3 mb-1 flex items-center justify-between px-2 text-[11px] font-medium tracking-wide text-ink-3 first:mt-0"
              >
                <a
                  href={`#group-${group.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(`group-${group.id}`);
                  }}
                  className="transition-colors duration-150 hover:text-ink-2"
                >
                  {group.label} <span className="font-normal tabular-nums">{ids.length}</span>
                </a>
                {searching ? null : (
                  <button
                    aria-expanded={!isFolded}
                    aria-label={`${isFolded ? "Expand" : "Collapse"} ${group.label}`}
                    className="grid size-5 place-items-center rounded-full hover:bg-hover hover:text-ink-2"
                    onClick={() => toggleFold(group.id)}
                    type="button"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform ${isFolded ? "-rotate-90" : ""}`}
                      aria-hidden
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                )}
              </li>
              {isFolded
                ? null
                : ids.map((id) => {
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
          );
        })}
      </ul>
      <p className="mb-1 mt-5 px-2 text-[11px] font-medium tracking-wide text-ink-3">Try it live</p>
      <Link className="block rounded-[7px] px-2 py-[5px] text-[12.5px] text-ink-2 hover:bg-hover hover:text-ink" href="/workflow">
        Workflow console
      </Link>
      <Link className="block rounded-[7px] px-2 py-[5px] text-[12.5px] text-ink-2 hover:bg-hover hover:text-ink" href="/harness">
        Agent harness
      </Link>
    </nav>
  );
}
