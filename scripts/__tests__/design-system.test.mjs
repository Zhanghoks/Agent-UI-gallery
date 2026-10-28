import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readDesignSystem, tokenCss } from "../../lib/design-system.ts";

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function index(extra = {}) {
  return JSON.stringify({
    v: 3,
    layout: "files",
    title: "Fixture",
    namespace: "Fixture",
    libraries: [],
    ...extra,
  });
}

function systemDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "design-system-"));
}

test("cards, summaries, cover, and both theme values come from the file table", () => {
  const dir = systemDir();
  write(path.join(dir, "design-system.json"), index());
  write(
    path.join(dir, "tokens.json"),
    JSON.stringify({
      color: {
        themes: [
          { id: "light", name: "Light" },
          { id: "dark", name: "Dark" },
        ],
        tokens: [
          { name: "page", value: { light: "#fff", dark: "#111" }, usage: "Ground." },
        ],
      },
      spacing: {
        tokens: [
          { name: "space-0.5", value: "2px", usage: "Tight gap." },
          { name: "diff", value: { light: "{page}", dark: "#000" }, usage: "Alias in light." },
        ],
      },
    }),
  );
  write(
    path.join(dir, "components/Button/README.md"),
    "# Button\n\nPill-shaped action button with six variants and three sizes. The app's core button.\n",
  );
  write(
    path.join(dir, "components/Button/preview.html"),
    '<!-- @dsCard group="Atoms" height=153 -->\n<div>Button</div>\n',
  );
  write(
    path.join(dir, "components/Note/README.md"),
    "A quiet note for the canvas.\n",
  );
  write(
    path.join(dir, "components/Note/preview.html"),
    '<!-- @dsCard group="Nodes" height=80 -->\n<div>Note</div>\n',
  );
  write(path.join(dir, "components/Cover/preview.html"), "<!-- @dsCard height=288 -->\n<div>Cover</div>\n");

  const result = readDesignSystem(dir);
  assert.equal(result.ok, true);
  assert.equal(result.title, "Fixture");
  assert.deepEqual(
    result.groups.map((group) => [group.name, group.cards.map((card) => card.name)]),
    [
      ["Atoms", ["Button"]],
      ["Nodes", ["Note"]],
    ],
  );
  assert.equal(result.groups[0].cards[0].summary, "Pill-shaped action button with six variants and three sizes.");
  assert.equal(result.cover?.previewHtml.includes("Cover"), true);
  assert.equal(result.groups.some((group) => group.cards.some((card) => card.name === "Cover")), false);
  assert.deepEqual(result.color[0].values, { light: "#fff", dark: "#111" });
  const css = tokenCss(result, "frame");
  assert.match(css, /--space-0-5:\s*2px/);
  assert.match(css, /--diff:\s*var\(--page\)/);
  assert.match(css, /--diff:\s*#000/);
});

test("a missing index and a map-shaped token file are problems, not an empty theme", () => {
  const missing = systemDir();
  write(path.join(missing, "tokens.json"), JSON.stringify({ color: { themes: [], tokens: [] } }));
  const missingResult = readDesignSystem(missing);
  assert.equal(missingResult.ok, false);
  assert.deepEqual(missingResult.problems, ["missing design-system.json"]);
  assert.deepEqual(missingResult.color, []);
  assert.deepEqual(missingResult.themes, []);

  const mapped = systemDir();
  write(path.join(mapped, "design-system.json"), index({ title: "Mapped" }));
  write(path.join(mapped, "tokens.json"), JSON.stringify({ color: { brand: { $value: "#f00" } } }));
  const mappedResult = readDesignSystem(mapped);
  assert.equal(mappedResult.ok, false);
  assert.ok(mappedResult.problems.some((problem) => problem.includes("not a list")));
  assert.deepEqual(mappedResult.color, []);
  assert.deepEqual(mappedResult.themes, []);
});

test("a bundle system and a static system stay independent across two reads", () => {
  const live = systemDir();
  write(
    path.join(live, "design-system.json"),
    index({
      title: "Live",
      libraries: [{ name: "react", version: "19", file: "components/lib/react.js" }],
    }),
  );
  write(
    path.join(live, "tokens.json"),
    JSON.stringify({ color: { themes: [{ id: "light", name: "Light" }], tokens: [{ name: "ink", value: "#111" }] } }),
  );
  write(path.join(live, "components/lib/react.js"), "window.React = {};\n");
  write(path.join(live, "components/bundle.js"), "var Live = {};\n");
  write(path.join(live, "components/bundle.css"), ".x{}\n");
  write(path.join(live, "components/Button/preview.html"), '<!-- @dsCard group="Atoms" height=40 -->\n<div></div>\n');

  const still = systemDir();
  write(path.join(still, "design-system.json"), index({ title: "Still", libraries: [] }));
  write(
    path.join(still, "tokens.json"),
    JSON.stringify({ color: { themes: [{ id: "light", name: "Light" }], tokens: [{ name: "ink", value: "#222" }] } }),
  );
  write(path.join(still, "components/Button/preview.html"), '<!-- @dsCard group="Controls" height=40 -->\n<button></button>\n');

  const liveResult = readDesignSystem(live);
  const stillResult = readDesignSystem(still);
  assert.deepEqual(liveResult.scripts, ["components/lib/react.js", "components/bundle.js"]);
  assert.deepEqual(liveResult.stylesheets, ["components/bundle.css"]);
  assert.deepEqual(stillResult.scripts, []);
  assert.deepEqual(stillResult.stylesheets, []);
  assert.equal(readDesignSystem(live).scripts[0], "components/lib/react.js");
  assert.equal(stillResult.title, "Still");
  assert.equal(liveResult.title, "Live");
});
