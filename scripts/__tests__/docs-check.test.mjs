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
  `# ADR-${n} 标题\n\n状态：${status}\n\n## 背景\n\nx\n\n## 决定\n\nx\n\n## 后果\n\nx\n\n## 备选\n\nx\n`;

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

test("a superseded ADR must name its replacement", () => {
  const ok = makeRepo({ "docs/adr/0001-first.md": ADR("0001", "已被取代（见 ADR-0002）") });
  assert.deepEqual(check(ok), []);
  const bare = makeRepo({ "docs/adr/0001-first.md": ADR("0001", "已被取代") });
  assert.match(check(bare)[0].message, /状态/);
});

test("the status line must be exactly one of the allowed values", () => {
  const root = makeRepo({ "docs/adr/0001-first.md": ADR("0001", "已采纳（部分）") });
  assert.match(check(root)[0].message, /状态/);
});

test("an ADR heading needs a title after the number", () => {
  const root = makeRepo({ "docs/adr/0001-first.md": ADR("0001").replace("# ADR-0001 标题", "# ADR-0001") });
  assert.match(check(root)[0].message, /title|标题/);
});

test("an ADR heading number must match the file name", () => {
  const root = makeRepo({ "docs/adr/0001-first.md": ADR("0002") });
  assert.match(check(root)[0].message, /0001/);
});

test("an ADR file name must start with a four digit number", () => {
  const root = makeRepo({ "docs/adr/1-first.md": ADR("0001") });
  assert.ok(check(root).some((p) => /four digit|四位/.test(p.message)));
});

test("an ADR must have background, decision, consequences and alternatives sections", () => {
  const root = makeRepo({ "docs/adr/0001-first.md": "# ADR-0001 标题\n\n状态：已采纳\n\n## 决定\n\nx\n" });
  const text = messages(check(root)).join("\n");
  assert.match(text, /背景/);
  assert.match(text, /后果/);
  assert.match(text, /备选/);
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

test("the index must link to an ADR, not just mention its file name", () => {
  const root = makeRepo({ "docs/README.md": "# 文档\n\n[架构](architecture.md) [术语](../CONTEXT.md)\n提到 adr/0001-first.md 但没有链接\n" });
  assert.match(check(root)[0].message, /0001-first\.md/);
});

test("a missing docs index is reported", () => {
  const root = makeRepo({ "docs/README.md": null });
  assert.ok(check(root).some((p) => /index/.test(p.message)));
});

/* ── markdown links and path suffixes ── */

test("relative markdown links must resolve from the document's folder", () => {
  const ok = makeRepo({ "docs/architecture.md": "见 [ADR](adr/0001-first.md#top) 与 [外链](https://x.test/a) 与 [锚点](#top)\n" });
  assert.deepEqual(check(ok), []);
  const bad = makeRepo({ "docs/architecture.md": "见 [坏链接](adr/gone.md)\n" });
  const [problem] = check(bad);
  assert.equal(problem.line, 1);
  assert.match(problem.message, /adr\/gone\.md/);
});

test("line and anchor suffixes and a leading ./ do not hide a missing path", () => {
  const ok = makeRepo({ "docs/architecture.md": "`scripts/build.mjs:12` `scripts/build.mjs#L3` `./scripts/build.mjs`\n" });
  assert.deepEqual(check(ok), []);
  const bad = makeRepo({ "docs/architecture.md": "`scripts/gone.mjs:12` `./scripts/gone2.mjs`\n" });
  assert.equal(check(bad).length, 2);
});

test("a file path under a directory that does not exist is reported", () => {
  const root = makeRepo({ "docs/architecture.md": "`scirpts/build.mjs`\n" });
  assert.equal(check(root).length, 1);
});

/* ── README command table ── */

test("a script mentioned only in prose does not count as documented", () => {
  const root = makeRepo({
    "package.json": JSON.stringify({ scripts: { dev: "x", test: "y", extra: "z" } }),
    "README.md": "# Demo\n\n| 命令 | 作用 |\n| --- | --- |\n| `npm run dev` | 开发 |\n| `npm test` | 测试 |\n\n也可以 `npm run extra`。\n见 `docs/README.md`。\n",
  });
  assert.match(check(root)[0].message, /extra/);
});

test("builtin scripts such as npm start are matched too", () => {
  const root = makeRepo({
    "package.json": JSON.stringify({ scripts: { dev: "x", test: "y", start: "z" } }),
    "README.md": "# Demo\n\n| `npm run dev` | 开发 |\n| `npm test` | 测试 |\n| `npm start` | 启动 |\n见 `docs/README.md`。\n",
  });
  assert.deepEqual(check(root), []);
});

test("a missing README is reported", () => {
  const root = makeRepo({ "README.md": null });
  assert.ok(check(root).some((p) => p.file === "README.md"));
});

/* ── exemptions ── */

test("a marker on the previous line does not exempt when that line has other content", () => {
  const root = makeRepo({
    "docs/architecture.md": "曾叫 `old-name.mjs` <!-- docs-check-ignore: 沿革 -->\n又提到 `other-old.mjs`\n",
  });
  assert.equal(check(root).length, 1);
});

/* ── exemptions (continued) ── */

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
