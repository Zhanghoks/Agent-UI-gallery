"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { DesignSystem } from "@/lib/design-system";
import { designAnchor } from "@/components/site/design-anchor";

function frameDocument(previewHtml: string, theme: string, css: string, fileBase: string, stylesheets: string[], scripts: string[]): string {
  const assets = [
    `<style>${css}</style>`,
    ...stylesheets.map((file) => `<link rel="stylesheet" href="${fileBase}/${file}">`),
    ...scripts.map((file) => `<script src="${fileBase}/${file}"></script>`),
  ].join("");
  const stripped = previewHtml.replace(/^<!--[\s\S]*?-->\s*/, "");
  const isDocument = /^<!doctype html/i.test(stripped) || /^<html[\s>]/i.test(stripped);
  if (!isDocument) {
    return `<!doctype html><html data-theme="${theme}"><head><meta charset="utf-8">${assets}</head><body style="margin:0">${stripped}</body></html>`;
  }
  let doc = stripped.replace(/<html\b([^>]*)>/i, (_match, attrs: string) => {
    const next = attrs.includes("data-theme=") ? attrs.replace(/data-theme="[^"]*"/, `data-theme="${theme}"`) : ` data-theme="${theme}"${attrs}`;
    return `<html${next}>`;
  });
  if (/<head[^>]*>/i.test(doc)) doc = doc.replace(/<head[^>]*>/i, (match) => `${match}${assets}`);
  else doc = doc.replace(/<html[^>]*>/i, (match) => `${match}<head>${assets}</head>`);
  return doc;
}

function renderReadme(markdown: string): ReactNode[] {
  const blocks = markdown.replace(/\r\n/g, "\n").split(/\n\s*\n/);
  return blocks.map((block, index) => {
    const lines = block.split("\n");
    const heading = /^(#{1,3})\s+(.*)$/.exec(lines[0] ?? "");
    if (heading && lines.length === 1) {
      const Tag = heading[1].length === 1 ? "h2" : heading[1].length === 2 ? "h3" : "h4";
      return (
        <Tag key={index} style={{ margin: "1.1em 0 0.35em", fontSize: heading[1].length === 1 ? "1.25rem" : "1rem" }}>
          {inline(heading[2])}
        </Tag>
      );
    }
    if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
      return (
        <ul key={index} style={{ margin: "0.4em 0", paddingLeft: "1.2em" }}>
          {lines.map((line) => (
            <li key={line}>{inline(line.replace(/^\s*[-*]\s+/, ""))}</li>
          ))}
        </ul>
      );
    }
    if (block.startsWith("```")) {
      const code = lines.slice(1, lines.at(-1) === "```" ? -1 : undefined).join("\n");
      return (
        <pre key={index} style={{ overflow: "auto", padding: "0.75em 1em", fontSize: "12px" }}>
          {code}
        </pre>
      );
    }
    return (
      <p key={index} style={{ margin: "0.45em 0" }}>
        {inline(block.replace(/\n/g, " "))}
      </p>
    );
  });
}

function readSiteTheme(themes: { id: string }[]): string | null {
  if (typeof document === "undefined") return null;
  const id = document.documentElement.classList.contains("dark") ? "dark" : "light";
  return themes.some((theme) => theme.id === id) ? id : null;
}

function writeSiteTheme(id: string) {
  if (id !== "light" && id !== "dark") return;
  const root = document.documentElement;
  root.classList.add("theme-switching");
  root.classList.toggle("dark", id === "dark");
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
  try {
    localStorage.setItem("bui-theme", id);
  } catch {}
}

function inline(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    return part;
  });
}

export function DesignSystemView({
  system,
  pageCss,
  frameCss,
  note,
  fileBase,
  anchorPrefix,
}: {
  system: DesignSystem;
  pageCss: string;
  frameCss: string;
  note: string;
  fileBase: string;
  anchorPrefix?: string;
}) {
  const fallback = system.themes[0]?.id ?? "light";
  const [active, setActive] = useState(fallback);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const sync = () => {
      const next = readSiteTheme(system.themes);
      if (next) setActive(next);
    };
    sync();
    setSynced(true);
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [system.themes]);

  const preview = useMemo(() => {
    return (html: string) => frameDocument(html, active, frameCss, fileBase, system.stylesheets, system.scripts);
  }, [active, frameCss, fileBase, system.scripts, system.stylesheets]);

  useEffect(() => {
    if (!anchorPrefix) return;
    const scroll = () => {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!id.startsWith(`${anchorPrefix}-`)) return;
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    };
    const frame = requestAnimationFrame(scroll);
    window.addEventListener("hashchange", scroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", scroll);
    };
  }, [anchorPrefix]);

  const anchor = (name: string) => (anchorPrefix ? designAnchor(anchorPrefix, name) : name.replace(/\s+/g, "-"));

  return (
    <div
      className="ds-page"
      data-theme={synced ? active : undefined}
      style={{
        minHeight: "100vh",
        background: "var(--page, var(--bg-default))",
        color: "var(--ink, var(--fg-default))",
        fontFamily: "var(--font-sans, ui-sans-serif, system-ui, sans-serif)",
      }}
    >
      <style>{pageCss}</style>
      <div style={{ margin: "0 auto", maxWidth: 880, padding: "28px 24px 80px" }}>
        <header>
          <h1 style={{ margin: 0, fontSize: 28, letterSpacing: "-0.02em" }}>{system.title || "Design system"}</h1>
          <p style={{ margin: "10px 0 0", maxWidth: 62 * 8, fontSize: 14, lineHeight: 1.5, opacity: 0.8 }}>{note}</p>
          {system.themes.length > 0 ? (
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              {system.themes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={synced && item.id === active}
                  onClick={() => {
                    setActive(item.id);
                    writeSiteTheme(item.id);
                  }}
                  style={{
                    border: "1px solid var(--line, var(--edge-default, currentColor))",
                    background: synced && item.id === active ? "var(--ink, var(--fg-default))" : "transparent",
                    color: synced && item.id === active ? "var(--page, var(--bg-default))" : "inherit",
                    borderRadius: 999,
                    padding: "4px 12px",
                    font: "inherit",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          ) : null}
        </header>

        {system.problems.length > 0 ? (
          <ul style={{ marginTop: 24 }}>
            {system.problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        ) : null}

        {system.color.length > 0 ? (
          <section style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>Color</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {system.color.map((token) => {
                return (
                  <div key={token.name} title={`${token.name}: ${token.usage}`} style={{ width: 88 }}>
                    <div style={{ height: 36, borderRadius: 8, background: `var(--${token.name.replace(/\./g, "-")})`, outline: "1px solid color-mix(in oklab, currentColor 16%, transparent)" }} />
                    <div style={{ marginTop: 4, fontSize: 11, lineHeight: 1.3 }}>{token.name}</div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        <details style={{ marginTop: 28 }}>
          <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Tokens and type</summary>
          <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.5 }}>
            {system.families.map((family) => (
              <div key={family.id} style={{ marginTop: 12 }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 13 }}>{family.id}</h3>
                <ul style={{ margin: 0, paddingLeft: "1.1em" }}>
                  {family.tokens.map((token) => (
                    <li key={token.name}>
                      <code>{token.name}</code> {token.values[active]} — {token.usage}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {system.typeStyles.length > 0 ? (
              <div style={{ marginTop: 12 }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 13 }}>type</h3>
                <ul style={{ margin: 0, paddingLeft: "1.1em" }}>
                  {system.typeStyles.map((style) => (
                    <li key={`${style.group}-${style.name}`}>
                      {style.group} / {style.name} — {style.fontSize} / {style.lineHeight}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </details>

        {system.readme ? (
          <details open style={{ marginTop: 28 }}>
            <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Brand book</summary>
            <article style={{ maxWidth: 68 * 8, fontSize: 15, lineHeight: 1.6 }}>{renderReadme(system.readme)}</article>
          </details>
        ) : null}

        {system.assets.length > 0 ? (
          <section style={{ display: "flex", gap: 16, marginTop: 28, flexWrap: "wrap" }}>
            {system.assets.map((asset) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={asset.file} alt={asset.file} src={`${fileBase}/${asset.file}`} style={{ maxHeight: 72, maxWidth: 240 }} />
            ))}
          </section>
        ) : null}

        {system.cover ? (
          synced ? (
            <iframe
              title="Cover"
              sandbox="allow-scripts"
              style={{ width: "100%", height: system.cover.height, marginTop: 28, border: 0, background: "transparent" }}
              srcDoc={preview(system.cover.previewHtml)}
            />
          ) : (
            <div style={{ height: system.cover.height, marginTop: 28 }} />
          )
        ) : null}

        <nav style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginTop: 32, fontSize: 13 }}>
          {system.groups.map((group) => (
            <a key={group.name} href={`#${anchor(`group-${group.name}`)}`}>
              {group.name}
              <span style={{ opacity: 0.6 }}> {group.cards.length}</span>
            </a>
          ))}
        </nav>

        {system.groups.map((group) => (
          <section key={group.name} id={anchor(`group-${group.name}`)} style={{ marginTop: 36, scrollMarginTop: 24 }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 18 }}>{group.name}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {group.cards.map((card) => (
                <article key={card.name} id={anchor(card.name)} style={{ scrollMarginTop: 24 }}>
                  <h3 style={{ margin: 0, fontSize: 15 }}>{card.name}</h3>
                  {card.summary ? <p style={{ margin: "4px 0 10px", fontSize: 13, opacity: 0.75 }}>{card.summary}</p> : null}
                  {synced ? (
                    <iframe
                      title={card.name}
                      sandbox="allow-scripts"
                      loading="lazy"
                      style={{ width: "100%", height: card.height, border: 0, background: "transparent" }}
                      srcDoc={preview(card.previewHtml)}
                    />
                  ) : (
                    <div style={{ height: card.height }} />
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
