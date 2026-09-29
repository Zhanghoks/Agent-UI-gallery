import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkDocs } from "../lib/docs-check.mjs";

/* The docs seam: repo root in → list of documentation problems out.
 * Fixtures are tiny throwaway repos with just enough structure. */

const write = (root, file, content = "") => {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), content);
};

const ADR = (n, status = "已采纳") =>
  `# ADR-${n} 标题\n\n状态：${status}\n\n## 背景\n\nx\n\n## 决定\n\nx\n\n## 后果\n\nx\n`;

/** A repo that passes every check; tests break one thing at a time. */
function makeRepo(overrides = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "docs-"));
  const files = {
    "package.json": JSON.stringify({ scripts: { dev: "x", test: "y" } }),
    "README.md": "# Demo\n\n| 命令 | 作用 |\n| --- | --- |\n| `npm run dev` | 开发 |\n| `npm test` | 测试 |\n\n见 `docs/README.md`。\n",
    "CONTEXT.md": "# 术语\n",
    "docs/README.md":
      "# 文档\n\n- [架构](architecture.md)\n- [术语](../CONTEXT.md)\n- [ADR-0001](adr/0001-first.md)\n",
    "docs/architecture.md": "# 架构\n\n目录 `components/gallery/` 与 `scripts/build.mjs`。\n",
    "docs/adr/0001-first.md": ADR("0001"),
    "components/gallery/.keep": "",
    "scripts/build.mjs": "",
    ...overrides,
  };
  for (const [f, c] of Object.entries(files)) if (c !== null) write(root, f, c);
  return root;
}

const check = (root) => checkDocs({ root });
const messages = (problems) => problems.map((p) => `${p.file}:${p.line} ${p.message}`);

test("a consistent repo has no problems", () => {
  assert.deepEqual(check(makeRepo()), []);
});

/* ── referenced paths ── */

test("a missing path is reported with file and line", () => {
  const root = makeRepo({ "docs/architecture.md": "# 架构\n\n第一行\n看 `scripts/gone.mjs`。\n" });
  const [problem, ...rest] = check(root);
  assert.equal(rest.length, 0);
  assert.equal(problem.file, "docs/architecture.md");
  assert.equal(problem.line, 4);
  assert.match(problem.message, /scripts\/gone\.mjs/);
});

test("glob and placeholder paths only need their static prefix to exist", () => {
  const ok = makeRepo({ "docs/architecture.md": "`components/gallery/<id>/index.tsx` 与 `scripts/*.mjs`\n" });
  assert.deepEqual(check(ok), []);
  const bad = makeRepo({ "docs/architecture.md": "`components/nowhere/<id>/index.tsx`\n" });
  assert.equal(check(bad).length, 1);
});

test("paths inside fenced code blocks are not checked", () => {
  const root = makeRepo({ "docs/architecture.md": "```\nscripts/gone.mjs\n`scripts/gone2.mjs`\n```\n" });
  assert.deepEqual(check(root), []);
});

test("a bare file name must exist somewhere in the repo", () => {
  assert.deepEqual(check(makeRepo({ "docs/architecture.md": "见 `build.mjs`。\n" })), []);
  assert.equal(check(makeRepo({ "docs/architecture.md": "见 `old-name.mjs`。\n" })).length, 1);
});

test("the @/ import alias and extension-less paths resolve", () => {
  const root = makeRepo({
    "docs/architecture.md": "`@/lib/utils` 与 `lib/utils`\n",
    "lib/utils.ts": "",
  });
  assert.deepEqual(check(root), []);
});

test("things that are not repo paths are ignored", () => {
  const root = makeRepo({ "docs/architecture.md": "`next/font` `react-dom` `a/b` `npm i glimm` `foo.bar`\n" });
  assert.deepEqual(check(root), []);
});

test("docs/agents is tool-generated: its references are not checked, but it must be indexed", () => {
  const root = makeRepo({ "docs/agents/domain.md": "见 `CONTEXT-MAP.md` 和 `scripts/gone.mjs`\n" });
  const problems = check(root);
  assert.equal(problems.length, 1);
  assert.match(problems[0].message, /agents\/domain\.md/);
});

/* ── npm commands ── */

test("a documented npm script that does not exist is reported", () => {
  const root = makeRepo({ "docs/architecture.md": "运行 `npm run ghost`。\n" });
  const [problem] = check(root);
  assert.match(problem.message, /npm run ghost/);
});

test("npm run with trailing arguments is matched by script name", () => {
  const root = makeRepo({ "docs/architecture.md": "`npm run dev -- --port 3001`\n" });
  assert.deepEqual(check(root), []);
});

test("every package script must appear in the README", () => {
  const root = makeRepo({
    "package.json": JSON.stringify({ scripts: { dev: "x", test: "y", secret: "z" } }),
  });
  assert.deepEqual(messages(check(root)).length, 1);
  assert.match(check(root)[0].message, /secret/);
  assert.equal(check(root)[0].file, "README.md");
});

/* ── ADRs ── */

test("an ADR without a valid status is reported", () => {
  const missing = makeRepo({ "docs/adr/0001-first.md": ADR("0001").replace("状态：已采纳\n\n", "") });
  assert.match(check(missing)[0].message, /状态/);
  const invalid = makeRepo({ "docs/adr/0001-first.md": ADR("0001", "草稿") });
  assert.match(check(invalid)[0].message, /状态/);
});

test("a superseded ADR may point to its replacement", () => {
  const root = makeRepo({ "docs/adr/0001-first.md": ADR("0001", "已被取代（见 ADR-0002）") });
  assert.deepEqual(check(root), []);
});

test("an ADR heading number must match the file name", () => {
  const root = makeRepo({ "docs/adr/0001-first.md": ADR("0002") });
  assert.match(check(root)[0].message, /0001/);
});

test("an ADR file name must start with a four digit number", () => {
  const root = makeRepo({ "docs/adr/1-first.md": ADR("0001") });
  assert.ok(check(root).some((p) => /four digit|四位/.test(p.message)));
});

test("an ADR must have background, decision and consequences sections", () => {
  const root = makeRepo({ "docs/adr/0001-first.md": "# ADR-0001 标题\n\n状态：已采纳\n\n## 决定\n\nx\n" });
  const text = messages(check(root)).join("\n");
  assert.match(text, /背景/);
  assert.match(text, /后果/);
});

/* ── index ── */

test("the docs index must list every ADR and doc", () => {
  const root = makeRepo({
    "docs/adr/0002-second.md": ADR("0002"),
    "docs/notes.md": "# 笔记\n",
  });
  const text = messages(check(root)).join("\n");
  assert.match(text, /0002-second\.md/);
  assert.match(text, /notes\.md/);
  assert.equal(check(root).every((p) => p.file === "docs/README.md"), true);
});

/* ── exemptions ── */

test("an ignore marker with a reason exempts the code span on the same line", () => {
  const root = makeRepo({
    "docs/architecture.md": "曾叫 `old-name.mjs` <!-- docs-check-ignore: 沿革说明 -->\n",
  });
  assert.deepEqual(check(root), []);
});

test("an ignore marker on the previous line also exempts", () => {
  const root = makeRepo({
    "docs/architecture.md": "<!-- docs-check-ignore: 生成文件 -->\n`lib/gallery.generated.ts`\n",
  });
  assert.deepEqual(check(root), []);
});

test("an ignore marker without a reason is itself a problem", () => {
  const root = makeRepo({ "docs/architecture.md": "`old-name.mjs` <!-- docs-check-ignore: -->\n" });
  assert.ok(check(root).some((p) => /reason|原因/.test(p.message)));
});

/* ── the real repository ── */

test("the real repository's docs are consistent", () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  assert.deepEqual(messages(check(root)), []);
});
