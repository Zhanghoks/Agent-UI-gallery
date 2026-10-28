# 架构（现状）

本文只描述**现在已经实现的样子**。尚未实现的设计见 [路线图](roadmap.md)，单项决策的来龙去脉见各 ADR，词汇定义见 [术语表](../CONTEXT.md)。

## 目标

一个「画廊」形态的 agent 组件库：每个组件都是可交互的实时 demo，可复制源码，也可通过 shadcn registry 安装到其他项目。新增组件 = 新建一个文件夹。项目 fork 自 Beautiful UI（见 [NOTICE](NOTICE.md)）。

## 分层与依赖方向

```
site     画廊网站外壳（导航、卡片网格、主题）
harness  演示用 agent 聊天与 workflow 控制台，由 gallery 组件拼成
workflow 协议 · reducer · mock 服务端 · 投影（lib/workflow/，与 harness 同层）
   ↓
gallery  组件，一个文件夹一个
   ↓
atoms    atom：被多个组件复用的小构件
   ↓
app/globals.css  设计 token 与基础样式
```

- `harness` 依赖 `gallery`，`gallery` 依赖 `atoms`；反向不允许。
- `site` 与 `harness` 互不依赖，只由 `app/` 里的页面各自引入。画廊右栏直接渲染 harness 与 workflow 控制台，页脚指向 `/?view=harness`；`/harness` 与 `/workflow` 转到对应视图。
- `lib/workflow/` 与 `harness` 同层：可以依赖 gallery 组件的类型，gallery 组件不能依赖它（组件经 registry 分发，不能引用只存在于画廊里的 `lib/`）。见 ADR-0014。
- gallery 组件可以依赖其他 gallery 组件（不能成环），不能依赖 `site`、`harness`。规则与校验见 ADR-0011。

## 目录树

```
foundry.config.json      站点名、registry 地址、命名空间目录、分类列表
app/                     路由：画廊 /、演示 /harness、控制台 /workflow、参照页 /design-systems/<id>、/license；globals.css
  api/mock/workflow/     mock workflow 服务端的 HTTP 路由（ADR-0014）
components/
  atoms/                 atom；atoms.json 声明哪些随 registry 分发
  gallery/<id>/          index.tsx · meta.json · styles.css（可选）
  harness/               Harness.tsx（渲染）· scenarios.tsx（假数据）· WorkflowConsole.tsx（接 mock 服务端）
  site/                  画廊外壳
lib/                     meta 类型、registry 组装、设计系统读取；*.generated.* 为生成文件
  workflow/              protocol.ts 协议 · reducer.ts 事件折叠 · fixtures.ts 事件脚本 ·
                         mock-server.ts 内存服务端 · project.ts 投影 · client.ts 浏览器端 hook
scripts/
  gen.mjs                生成目录（--registry 同时写 public/r）
  new.mjs                生成新组件文件夹
  docs-check.mjs         文档一致性检查
  lib/                   catalog（目录扫描）· scaffold · docs-check · config · naming · emit
  __tests__/             三个测试接缝的测试
public/r/                生成的 shadcn registry（入库）
design-systems/          两份设计系统文件表快照，目录扫描不读这里
docs/                    本文、路线图、ADR、NOTICE、技能配置
CONTEXT.md               术语表
.scratch/                改用 GitHub issues 之前遗留的本地 spec（不再新增）
```

## 数据流：新增一个组件之后

```
components/gallery/my-card/{index.tsx, meta.json}      你只写这里
        │  npm run dev / build → scripts/gen.mjs
        ▼
scripts/lib/catalog.mjs   扫描 → 校验 → 目录 + 分组 + registry
        ├─ lib/gallery.generated.ts      目录与分组（服务端安全） <!-- docs-check-ignore: 生成文件，运行 npm run gen 后才存在 -->
        ├─ lib/demos.generated.tsx       id → Demo 组件映射（客户端） <!-- docs-check-ignore: 生成文件，运行 npm run gen 后才存在 -->
        ├─ app/gallery.generated.css     组件独有样式的 import 汇总 <!-- docs-check-ignore: 生成文件，运行 npm run gen 后才存在 -->
        └─ public/r/*.json               registry（仅 --registry）
```

画廊页面读取生成的目录与分组渲染导航与卡片；registry 供其他项目安装。决策见 ADR-0001、ADR-0002、ADR-0003。

## 构建时校验

扫描时一次列出全部问题：必填字段、`id` 与文件夹名一致、分类存在、文件存在、id 唯一、`deps` 与 `npm` 与真实 import 一致、无循环依赖、`atoms/` 文件均已登记、分类配置合法。详见 ADR-0011 与 ADR-0010。

## 配置与分类

`foundry.config.json` 是唯一配置（ADR-0004）。`categories` 是 `{ id, label, description }` 列表，顺序即显示顺序；现有六类 conversation / progress / workflow / collaboration / data / workspace，归类规则见 ADR-0010，`workflow` 的由来见 ADR-0014。同一分类内按 `order` 排序。

## 组件约定

新组件由受控展示层与默认导出的 Demo 组成（ADR-0007），`npm run new` 生成模板。旧的 21 个组件还是定时器驱动，改造计划在路线图。

workflow 分类有六张：`workflow-timeline`（横向时间线与纵向脊线）、`workflow-run-card`（运行中的卡与结束后的收据）、`workflow-artifact`（同一产物的五种密度）、`workflow-workspace-log`（脚本日志）、`workflow-saved-card`（已保存的 workflow）、`workflow-run-history`（运行目录）。启动前确认 `workflow-launch-approval`、升级问题 `workflow-question-card` 与恢复点 `checkpoint-bar` 在 collaboration。从 ZCode 的通用展示件整理来的还有 `plan-card`、`terminal-view`（progress）、`queue-list`、`suggestion-chips`、`attachment-tray`（conversation）、`test-results`、`sources-list`（data）。这些都是 `own`，按参照重画，不含 ZCode 源码（ADR-0014）。`flowchart` 仍是 workspace 里的编排画布。

## workflow 协议与 mock 服务端

`lib/workflow/` 是 workflow 展示的后端契约与参照实现（ADR-0014）：

```
fixtures.ts   事件脚本（5 个 run + 已保存 workflow）
     │
mock-server.ts  按时钟回放脚本；cancel / answer / resume / start 会改脚本
     │            app/api/mock/workflow/*  → HTTP + SSE
     ▼
reducer.ts    reduceRun：事件 → run 状态（快照与流共用）
     │
project.ts    协议状态 → 时间线 / 运行卡 / 产物 / 工作区日志的展示模型
     ▼
client.ts     useRunStream（快照 + 事件）· usePoll · 命令 fetch
```

`/workflow` 页面（`components/harness/WorkflowConsole.tsx`）把已保存卡片、运行历史、运行卡、问题卡、工作区日志和产物索引接到这套服务端上。路由清单与语义见 ADR-0014。

## 命令

命令表以 [README](../README.md) 为准，避免两处维护；`npm run docs:check` 保证文档与仓库一致（ADR-0012）。

## 测试接缝

三条，前两条输入仓库根目录、输出结果，用临时夹具仓库测试；第三条输入一份设计系统目录：

1. 目录扫描 → 目录、分组与 registry（`scripts/lib/catalog.mjs`）；
2. 文档一致性检查 → 问题列表（`scripts/lib/docs-check.mjs`）；
3. 设计系统读取 → 标题、主题、分组与卡片（`lib/design-system.ts`）。参照页只消费这个结果。

不测组件渲染与视觉。

## 画廊与参照页

画廊是组件库。左栏页面切换只有 Gallery、Workflow、Harness，地址是 `/` 与 `/?view=`。`/workflow`、`/harness` 转回 `/?view=`。组件导航只列目录里的组件。设计系统不进这套切换，单独列在它下面，作为离开画廊的入口。

参照页在 `/design-systems/beautiful-ui` 和 `/design-systems/huabu`。左栏是回到画廊的链接、两套系统的切换，以及该快照自己的分组，不用画廊的名称口号。`/?view=beautiful-ui` 与 `/?view=huabu` 转到对应参照页。每张参照页用该快照自己的 token 作主题，不写进 foundation。快照不进目录、不进 registry。见 ADR-0015。

## 占位值与待清理项

库名、registry 地址等占位值，以及上游遗留的未使用文件、音效与开发工具条是否保留等未决事项，统一记录在 [路线图](roadmap.md)。

## 决策记录

全部 ADR 见 [文档索引](README.md)。
