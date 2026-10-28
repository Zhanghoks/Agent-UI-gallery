"use client";

import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { designAnchor } from "@/components/site/design-anchor";

export type DesignSystemNavGroup = { name: string; cards: string[] };

function matches(query: string, haystack: string): boolean {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const text = haystack.toLowerCase();
  return words.every((word) => text.includes(word));
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

export function DesignSystemNav({
  title,
  prefix,
  groups,
}: {
  title: string;
  prefix: string;
  groups: DesignSystemNavGroup[];
}) {
  const total = groups.reduce((count, group) => count + group.cards.length, 0);
  const [active, setActive] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [box, setBox] = useState<{ top: number; height: number } | null>(null);
  const [query, setQuery] = useState("");
  const [folded, setFolded] = useState<Set<string>>(new Set());
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const searching = query.trim() !== "";
  const visible = useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const group of groups) {
      result[group.name] = group.cards.filter((name) => !searching || matches(query, `${name} ${group.name}`));
    }
    return result;
  }, [groups, query, searching]);
  const shown = groups.reduce((count, group) => count + visible[group.name].length, 0);
  const firstMatch = groups.map((group) => visible[group.name][0]).find(Boolean);

  useEffect(() => {
    const root = document.querySelector("[data-view-scroll]");
    const firstOf = Object.fromEntries(
      groups
        .filter((group) => group.cards[0])
        .map((group) => [designAnchor(prefix, `group-${group.name}`), designAnchor(prefix, group.cards[0])]),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(firstOf[entry.target.id] ?? entry.target.id);
      },
      { root: root instanceof Element ? root : null, rootMargin: "-20% 0px -70% 0px" },
    );
    for (const group of groups) {
      for (const id of [designAnchor(prefix, `group-${group.name}`), ...group.cards.map((name) => designAnchor(prefix, name))]) {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      }
    }
    return () => observer.disconnect();
  }, [groups, prefix]);

  useLayoutEffect(() => {
    const target = itemRefs.current[hovered ?? active];
    if (target) setBox({ top: target.offsetTop, height: target.offsetHeight });
    else setBox(null);
  }, [hovered, active, visible, folded]);

  const toggleFold = (name: string) =>
    setFolded((current) => {
      const next = new Set(current);
      if (!next.delete(name)) next.add(name);
      return next;
    });

  return (
    <nav aria-label={title}>
      <p className="mb-2 text-[11.5px] text-ink-3">
        {title} <span className="tabular-nums">· {searching ? `${shown}/${total}` : total}</span>
      </p>
      <input
        aria-label={`Filter ${title}`}
        className="mb-3 w-full rounded-[7px] bg-field px-2.5 py-1.5 text-[12.5px] text-ink outline-none placeholder:text-ink-3"
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setQuery("");
          if (event.key === "Enter" && firstMatch) scrollToId(designAnchor(prefix, firstMatch));
        }}
        placeholder="Filter…"
        type="search"
        value={query}
      />
      {searching && shown === 0 ? <p className="px-2 text-[12px] text-ink-3">No match.</p> : null}
      <ul onMouseLeave={() => setHovered(null)} className="relative flex flex-col">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 rounded-[7px] bg-hover"
          style={{
            top: box?.top ?? 0,
            height: box?.height ?? 0,
            opacity: box ? 1 : 0,
            transition: "top 220ms cubic-bezier(0.23,1,0.32,1), height 220ms cubic-bezier(0.23,1,0.32,1), opacity 150ms ease",
          }}
        />
        {groups.map((group) => {
          const cards = visible[group.name];
          if (cards.length === 0) return null;
          const isFolded = !searching && folded.has(group.name);
          const groupId = designAnchor(prefix, `group-${group.name}`);
          return (
            <Fragment key={group.name}>
              <li role="presentation" className="mt-3 mb-1 flex items-center justify-between px-2 text-[11px] font-medium tracking-wide text-ink-3 first:mt-0">
                <a
                  href={`#${groupId}`}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToId(groupId);
                  }}
                  className="transition-colors duration-150 hover:text-ink-2"
                >
                  {group.name} <span className="font-normal tabular-nums">{cards.length}</span>
                </a>
                {searching ? null : (
                  <button
                    aria-expanded={!isFolded}
                    aria-label={`${isFolded ? "Expand" : "Collapse"} ${group.name}`}
                    className="grid size-5 place-items-center rounded-full hover:bg-hover hover:text-ink-2"
                    onClick={() => toggleFold(group.name)}
                    type="button"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isFolded ? "-rotate-90" : ""}`} aria-hidden>
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                )}
              </li>
              {isFolded
                ? null
                : cards.map((name) => {
                    const id = designAnchor(prefix, name);
                    return (
                      <li
                        key={name}
                        ref={(element) => {
                          itemRefs.current[id] = element;
                        }}
                      >
                        <a
                          href={`#${id}`}
                          onMouseEnter={() => setHovered(id)}
                          onFocus={() => setHovered(id)}
                          onBlur={() => setHovered(null)}
                          onClick={(event) => {
                            event.preventDefault();
                            setActive(id);
                            scrollToId(id);
                          }}
                          className={`relative z-10 flex items-center rounded-[7px] px-2 py-[5px] text-[12.5px] transition-colors duration-150 ${active === id ? "font-medium text-ink" : "text-ink-2 hover:text-ink"}`}
                        >
                          {name}
                        </a>
                      </li>
                    );
                  })}
            </Fragment>
          );
        })}
      </ul>
    </nav>
  );
}
