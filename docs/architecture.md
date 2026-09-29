# 架构（现状）

本文只描述**现在已经实现的样子**。尚未实现的设计见 [路线图](roadmap.md)，单项决策的来龙去脉见各 ADR，词汇定义见 [术语表](../CONTEXT.md)。

## 目标

一个「画廊」形态的 agent 组件库：每个组件都是可交互的实时 demo，可复制源码，也可通过 shadcn registry 安装到其他项目。新增组件 = 新建一个文件夹。项目 fork 自 Beautiful UI（见 [NOTICE](NOTICE.md)）。

## 分层与依赖方向

```
site     画廊网站外壳（导航、卡片网格、主题）
harness  演示用 agent 聊天，由 gallery 组件拼成
   ↓
gallery  组件，一个文件夹一个（21 个，均为上游）
   ↓
atoms    共享小构件（6 个）
   ↓
app/globals.css  设计 token 与基础样式
```

- `harness` 依赖 `gallery`，`gallery` 依赖 `atoms`；反向不允许。
- `site` 与 `harness` 互不依赖，只由 `app/` 里的页面各自引入，共同联系是画廊页脚指向 `/harness` 的链接。
- gallery 组件可以依赖其他 gallery 组件（不能成环），不能依赖 `site`、`harness`。规则与校验见 ADR-0011。

## 目录树

```
foundry.config.json      站点名、registry 地址、命名空间目录、分类列表
app/                     路由：画廊 /、演示 /harness、/license；globals.css
components/
  atoms/                 共享小构件；atoms.json 声明哪些随 registry 分发
  gallery/<id>/          index.tsx · meta.json · styles.css（可选）
  harness/               Harness.tsx（渲染）· scenarios.tsx（假数据）
  site/                  画廊外壳
lib/                     meta 类型、registry 组装；*.generated.* 为生成文件
scripts/
  gen.mjs                生成目录（--registry 同时写 public/r）
  new.mjs                生成新组件文件夹
  docs-check.mjs         文档一致性检查
  lib/                   catalog（目录扫描）· scaffold · docs-check · config · naming · emit
  __tests__/             两个测试接缝的测试
public/r/                生成的 shadcn registry（入库）
docs/                    本文、路线图、ADR、NOTICE、技能配置
CONTEXT.md               术语表
.scratch/                本地 issue tracker：spec 与 ticket
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

`foundry.config.json` 是唯一配置（ADR-0004）。`categories` 是 `{ id, label, description }` 列表，顺序即显示顺序；现有五类 conversation / progress / collaboration / data / workspace，归类规则见 ADR-0010。同一分类内按 `order` 排序。

## 组件约定

新组件由受控展示层与默认导出的 Demo 组成（ADR-0007），`npm run new` 生成模板。旧的 21 个组件还是定时器驱动，改造计划在路线图。

## 命令

命令表以 [README](../README.md) 为准，避免两处维护；`npm run docs:check` 保证文档与仓库一致（ADR-0012）。

## 测试接缝

只有两个，均输入仓库根目录、输出结果，用临时夹具仓库测试：

1. 目录扫描 → 目录、分组与 registry（`scripts/lib/catalog.mjs`）；
2. 文档一致性检查 → 问题列表（`scripts/lib/docs-check.mjs`）。

不测组件渲染与视觉。

## 占位值

- 库名 `Agent UI Gallery`、registry 地址 `http://localhost:3000`：占位，确定后只改配置。
- 站点没有自己的 logo 与 favicon。

## 已知待清理项

- `components/site/Foundations.tsx`、`components/site/ChatExperience.tsx` 是上游遗留，没有任何地方引用；`components/site/Chip.tsx`、`components/site/TextRow.tsx`、`components/site/StatusPill.tsx` 只被前者使用。
- `sidebar-nav` 依赖商业图标库 `@central-icons-react`，安装时有 license 检查（README 有说明）；是否替换未定。
- 交互音效与开发工具条（`agentation`）是否保留未定。

## 决策记录

全部 ADR 见 [文档索引](README.md)。
