# Agent UI Gallery

给 agent 的项目说明。只写规则和入口，细节在 `docs/architecture.md`、`CONTEXT.md`、`docs/adr/`，不在这里重复。

## 这个项目是什么

我（维护者）个人的 agent 前端组件库，以「画廊」形式展示：每个组件是可交互的 demo，源码可复制。项目 fork 自 Beautiful UI（MIT），技术栈 Next.js 15 · React 19 · Tailwind v4 · TypeScript。

- **用途**：我的其他项目**直接复制组件源码**来用；shadcn registry（`public/r/`）只是备用。
- **读者场景**：你可能被要求「读这个库，像拼积木一样搭前端」。见下一节。
- **许可**：本库是 MIT。参照其他项目（如 ZCode，Apache-2.0）时只**重画**，不拷贝它们的源码（ADR-0005、ADR-0014）。
- **未确定的占位值**：库名、registry 地址、logo。不要把它们当成定案写进文档（路线图第 7 项）。

## 用这个库搭前端

1. 找组件：`lib/gallery.generated.ts` 是目录（id、标题、一句话、分类、变体、依赖），按分类分六组：conversation / progress / workflow / collaboration / data / workspace。归类规则见 ADR-0010。
2. 读组件：`components/gallery/<id>/index.tsx`。**具名导出的是受控组件和它的 `Props`，用这个**；默认导出的 `Demo` 只是画廊里的演示，别在产品里用（ADR-0007）。旧的 21 个上游组件还是定时器驱动，尚未受控化。
3. 一起复制：`meta.json` 的 `deps`（atoms、`icons`、其他组件）、`npm`（npm 包）、`css`（组件独有样式），以及 `app/globals.css` 里的 token 与基础样式。
4. 文案走 `labels` props，图标只用 `components/atoms/Icons.tsx`。
5. 要接 workflow 后端：协议、事件与路由见 `lib/workflow/protocol.ts` 和 ADR-0014；`/workflow` 页面是端到端的参照用法。

## 开发流程

1. **从 `main` 开分支**，不直接在 `main` 提交。分支名 `<前缀>/<短横线主题>`，前缀同提交前缀（`feat/`、`fix/`、`docs/`、`refactor/`、`chore/`）。
2. **改完先跑检查**，全过再往下：
   - `npm test`（含文档一致性检查）
   - `npx tsc --noEmit`
   - `npm run build`（会重新生成 registry）
3. **改了组件、`meta.json` 或分类，提交前跑 `npm run registry`**，生成文件和源码放在同一个提交里，不单独提交生成文件。不要手改 `*.generated.*` 与 `public/r/`。
4. **review**：检查通过后用 `code-review` 技能看一遍，把结果摆给我，**我说通过才提交**。没有我的确认，不提交、不推送、不合并。
5. **提交**：`type: 英文一行`，`type` 取 `feat` / `fix` / `docs` / `refactor` / `chore`。一个可独立回退的主题一个提交；需要解释原因时才写正文。
6. **我确认后**：推送分支，用 `pr` 技能写 PR 描述并 `gh pr create`；有对应 issue 时写 `Closes #n`。
7. **合并**：`gh pr merge <n> --rebase`，保留按主题拆开的提交，历史保持直线。合并后 `git checkout main && git pull --ff-only`，再删除本地分支。

## 新增一个组件

- 先 `npm run new -- <id> --category <分类>` 生成模板；细则见 README「新增一个组件」。
- 受控组件加默认导出的 Demo，`origin: "own"`。
- `meta.json` 的 `deps` / `npm` 必须与 `index.tsx` 里真实的 import 一致，构建会校验。
- gallery 组件不能依赖 `site`、`harness`、`lib/workflow`（组件靠 registry 分发，引用不到它们）。组件之间可以依赖，不能成环。
- 只被一个组件用的小构件写在那个组件里；被两个以上复用且没有 agent 语义的才进 `components/atoms/`（ADR-0011）。
- 分类看「它主要承担的工作」，不看外观（ADR-0010）。某类超过约 8 个就复审，不要默默塞进去。

## 文档、ADR 与 issue

- 现状只写在 `docs/architecture.md`，未实现的写在 `docs/roadmap.md`，词汇在 `CONTEXT.md`。用词以术语表为准。
- 结构或约定变了（新分类、新分层、协议变化）：**同一个 PR 里**补 ADR（固定结构：状态 / 背景 / 决定 / 后果 / 备选），并更新 `docs/README.md` 的索引。`npm run docs:check` 会检查。
- issue 在 GitHub（`gh`，见 `docs/agents/issue-tracker.md`）。新功能、缺陷、跨多个文件的重构先开 issue；单文件文档修改、依赖升级、生成文件刷新不开。

## 不要做

- 不直接在 `main` 提交；不在我确认通过前提交、推送或合并。
- 不拷贝 ZCode 或其他项目的源码进来。
- 不让 gallery 组件依赖 `lib/workflow`、`site`、`harness`。
- 不手改 `*.generated.*`、`public/r/`。
- 不为了过检查而放宽校验或删测试；检查失败就如实报告。
- 不引入第三方图标包；缺的图标在自有图标集里重画（ADR-0013）。

## Agent skills

### Issue tracker

Issues and specs live as GitHub issues on `Zhanghoks/Agent-UI-gallery` (use the `gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
