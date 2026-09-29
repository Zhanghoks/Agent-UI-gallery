# 架构设计：自有 Agent 组件库（画廊形态）

状态：**步骤 1–6 已实现（见 .scratch/gallery-foundation/spec.md），第 7 步起待评审**（评审通过前不动任何代码）。v2 新增第 8–11 节（组件契约、事件协议、画廊外壳扩展、验证）。
基础：fork 自 Beautiful UI（MIT），保留其画廊交互，改造成可持续扩展的个人组件库。

## 1. 目标与非目标

目标
- 保留画廊的交互：左栏导航、右侧实时可交互 demo、每张卡片可「复制源码 / 查看代码」、深浅色主题。
- **新增一个组件 = 新建一个文件夹**，不需要再改其他文件。
- 现有 21 个组件全部保留，之后逐个替换或删除。
- 后续 agent 项目可以通过 `npx shadcn add <你的域名>/r/xxx.json` 拉取组件。

非目标
- 现在不接真实后端（harness 仍是演示，接线放到第二阶段）。
- 不做 monorepo / npm 发布（ADR-006 里记录了以后再做的条件）。

## 2. 现状：新增组件要改 4 处，且有一处很脆弱

| 位置 | 内容 | 问题 |
| --- | --- | --- |
| `lib/meta.ts` | 标题、说明、依赖 | 元信息 |
| `lib/registry.tsx` | import 组件 + `DEMOS` 映射 | 手写，容易漏 |
| `scripts/build-registry.mjs` | `PRIMITIVES`、`INTERNAL` 再写一遍 | **与 meta.ts 重复，两边会漂移** |
| `app/globals.css` | 靠 **硬编码行号** 切出 sidebar / records 的 CSS | **改动 globals.css 前 3 行就会让 registry 产物错位** |

另外，品牌信息散落在 `layout.tsx`、`page.tsx`、`UseThisHarness.tsx`、`build-registry.mjs`、`package.json`、`public/logo.png` 等处。

## 3. 目标设计

### 3.1 一个组件一个文件夹（ADR-001）

```
components/
  atoms/                  共享小构件（Button、Chip…），不出现在画廊
  gallery/                画廊里的每个组件
    thinking-state/
      index.tsx           默认导出 Demo（就是现在的 ThinkingState.tsx）
      meta.ts             该组件的全部元信息
      styles.css          可选：该组件独有的 CSS
    approval-card/
      ...
  site/                   画廊外壳（Grid、Nav、ThemeToggle…）
```

`meta.ts` 是该组件**唯一**的声明处：

```ts
export default defineComponent({
  id: "approval-card",
  title: "Approval Card",
  caption: "Human-in-the-loop questions the agent asks before acting.",
  category: "agent",            // 用于导航分组
  variants: ["Default"],        // 可选
  deps: ["button", "glide-menu"], // 依赖的 atoms / 其他 gallery 组件
  npm: [],                      // 依赖的 npm 包
  css: "styles.css",            // 可选
});
```

### 3.2 自动生成索引，而不是手写（ADR-002）

`scripts/gen-index.mjs` 扫描 `components/gallery/*/meta.ts`，生成：
- `lib/gallery.generated.ts`：`META` 列表 + 懒加载 `Demo` 映射（取代手写的 `lib/registry.tsx` 与 `lib/meta.ts` 里的列表）
- `public/r/*.json`（`build-registry.mjs` 直接读同一份 meta，不再自己维护列表）

`npm run dev` / `build` 前自动执行；生成文件加入 `.gitignore`。

### 3.3 CSS 按组件拆分（ADR-003）

- 把 `globals.css` 中 sidebar（约 424–505 行）和 records（约 506–1331 行）两大块搬到各自的 `styles.css`。
- `globals.css` 只留 tokens、`@theme`、base、通用 keyframes，并用生成的 `@import` 引入各组件样式。
- registry 直接读 `meta.css`，**删除行号切片逻辑**。
- 这一步是所有后续改动的前提，放在第一批。

### 3.4 站点配置与品牌集中（ADR-004、ADR-005）

新增 `foundry.config.ts`：站点名、logo、标语、registry `baseUrl`、命名空间目录（现为 `beautifui`）、页脚链接。`layout.tsx`、`page.tsx`、`build-registry.mjs` 都只读它。

去除：Turbo 推广块（`Built by Turbo`、`Book a call`、`turbo-flourish.png`）、邮件订阅（`EmailCapture`、`EmailNudge`、`api/subscribe`）、PostHog、`InteractionSounds`（待你决定）。
保留：`LICENSE` 里的原作者版权声明（MIT 要求），并在 `docs/NOTICE.md` 注明来源。

### 3.5 Harness

`IceCreamHarness.tsx`（1062 行）拆成：
- `harness/scenarios.ts`：演示数据（可整体替换）
- `harness/Harness.tsx`：只负责渲染
- 第二阶段再按 README 的 seam 表接真实 agent（SSE / AI SDK）。

## 4. 目标目录树

```
Agent-UI-gallery/
  docs/                 architecture.md、adr/、NOTICE.md
  app/                  layout、page（画廊）、harness、license、globals.css（仅 tokens/base）
  components/
    atoms/  gallery/<id>/{index.tsx,meta.ts,styles.css?}  site/  harness/
  lib/                  utils.ts、define.ts（defineComponent 类型）、gallery.generated.ts
  scripts/              gen-index.mjs、build-registry.mjs、new-component.mjs
  foundry.config.ts
  public/r/             生成产物
```

## 5. 新增组件的流程（目标态）

```
npm run new my-agent-card      # 生成 gallery/my-agent-card/{index.tsx,meta.ts}
# 编辑 index.tsx，dev 里立刻出现在画廊与导航
npm run build                  # 自动生成 public/r/my-agent-card.json
```

## 6. 迁移步骤（评审通过后按序执行，每步可单独验证）

1. 初始化 git，做一次基线提交（当前目录不是 git 仓库）。
2. CSS 拆分（3.3），验证 `public/r/*.json` 与迁移前逐字节一致。
3. 引入 `defineComponent` + `gen-index`；把 21 个组件移入 `gallery/<id>/`（纯搬移，不改逻辑）。
4. `build-registry.mjs` 改为读 meta；对比产物。
5. `foundry.config.ts` + 去品牌 / 去 Turbo / 去订阅。
6. Harness 拆分。
7. `npm run new` 脚手架。
8. 之后：逐个替换 / 新增自己的组件。

## 7. 待你决定（v1）

- 命名：库的名字、registry 域名（没有域名可先用 Vercel 预览地址或本地 `http://localhost:3000/r`）。
- 导航分组：是否按 `category` 分组（建议：`agent` / `data` / `input` / `layout`）。
- 付费图标库 `@central-icons-react`：是否替换为 `iconoir-react`（已在依赖里）以免 license 检查。
- 声音（`InteractionSounds`）和 `agentation` 开发工具是否保留。

## 8. 组件契约：从「演示」到「可驱动」（ADR-007）

读代码得到的事实：现有组件已经是「数据从 props 进、默认值是演示数据」（如 `ToolChips` 的 `steps/diffs/labels`，`ThinkingState` 的 `rows/active/done`）。
缺口在**状态**：`ThinkingState` 用内部 `useSequence(STAGES)` 定时器自己走完「思考→展开→完成」，`onSettled` 只是回调。真实 agent 的状态来自事件流，定时器无法被外部驱动。

约定（新组件必须遵守，旧组件在被替换/使用时逐个补齐）：

| 层 | 目录 | 规则 |
| --- | --- | --- |
| atoms | `components/atoms` | 无业务语义，纯视觉，不进画廊 |
| gallery 组件 | `components/gallery/<id>` | **受控优先**：状态由 props 决定（如 `status: "running" \| "done" \| "error"`、`items`）；导出 `Props` 类型 |
| demo 包装 | 同文件夹 `demo.tsx` | 用定时器/假数据驱动上面的受控组件，仅供画廊与 harness 演示 |

即：**组件 = 受控的展示层（可接真实事件）+ 独立的 Demo（画廊里看到的动画）**。画廊展示 Demo，registry 分发的是受控组件（附带 Demo 作为示例文件）。这样同一个卡片既好看又能接后端。

`meta.ts` 增加 `demo: "./demo"` 与可选 `propsType` 名，用于代码视图标注「Props」。

## 9. Agent 事件协议与渲染映射（ADR-008）

目的：把 README 里「Demo seam → 替换为」那张表，变成代码里的一个契约，而不是散文。

```
lib/protocol.ts            // 与后端无关的 UI 消息部件（parts）
  type Part =
    | { type: "text";     id; text; done }                 → StreamingText
    | { type: "thinking"; id; status; rows }               → ThinkingState
    | { type: "tool";     id; status; name; input; output }→ ToolChips
    | { type: "approval"; id; questions; state }           → ApprovalCard
    | { type: "context";  id; chunks }                     → ContextCards
    | { type: "task";     id; rows }                       → TaskRows
    | { type: "data";     id; kind: "records"|"diff"; ... }→ RecordsTable / DiffTable
components/harness/renderers.tsx   // Part.type → 组件 的映射表（可被覆盖）
```

- 协议只描述「界面要显示什么」，**不绑定** AI SDK / pi / OpenAI Agents SDK；`adapters/` 下每个后端写一个把自家事件转成 `Part` 的适配器。
- 自有组件 = 加一种 `Part` + 在 `renderers` 里注册一行。
- 因为你要把它作为 agent-foundry 的 UI 基座，协议文件是最该稳定的一层，放第二阶段最先做，并单独评审。

## 10. 画廊外壳的扩展点（ADR-009）

保留现有交互（左栏导航、卡片内变体切换 `SegmentedControl`、复制/看代码、深浅色），并按以下方向留扩展位，**都不改变现有观感**：

1. **分类导航**：`meta.category` 驱动 `Nav` 分组，新增分类只需改 `foundry.config.ts` 的分类列表。
2. **深链接**：卡片 `id` 已作为锚点；增加 `?variant=` 便于分享具体变体。
3. **状态预览条**（可选）：受控组件在卡片上多一个「状态」切换（running / done / error），用受控 props 直接展示各状态，替代只能等定时器。
4. **来源标记**：`meta.origin: "upstream" | "own"`，导航里区分「上游保留」与「自己新增」，方便逐步替换时看进度。
5. **代码视图**：已能展示源码 + 依赖清单（`INTERNAL`/`npm`），改为读 meta 自动生成，不再单独维护 `INTERNAL`。

## 11. 验证策略（保证「纯搬移」真的没变）

- registry 快照：迁移前先跑一次 `build`，把 `public/r/` 存为基线；步骤 2、3、4 之后逐文件 diff，必须一致（组件路径变更处除外并列清单）。
- 类型检查 + `next build` 每步必过。
- 画廊页 smoke：一个脚本请求 `/`、`/harness`，断言 21 个 `id` 锚点都存在。
- `meta` 校验：`gen-index` 检查 id 唯一、`deps` 都能解析、`css` 文件存在，出错即失败。

## 12. 修订后的迁移顺序

1. git init + 基线提交 + registry 基线快照
2. CSS 拆分（ADR-003）
3. 文件夹化 + gen-index + build-registry 读 meta（ADR-001/002）
4. foundry.config + 去品牌（ADR-004/005）
5. Harness 拆分（数据与渲染分离）
6. `npm run new` 脚手架（生成受控组件 + demo 模板，ADR-007）
7. **协议与渲染映射（ADR-008），单独评审后再做**
8. 画廊扩展点（ADR-009）按需增量加入
9. 逐个替换 / 新增自有组件
