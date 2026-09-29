Status: resolved

# Spec：可扩展的自有 Agent 组件库（画廊基座）

设计依据：`docs/architecture.md`（v2）与 `docs/adr/001`–`009`。本 spec 覆盖迁移步骤 1–6（基座重构）；事件协议与画廊扩展点见「Out of Scope」。

## Problem Statement

我想在 Beautiful UI（MIT，画廊形态）的基础上开发自己的 agent 组件库，并且非常喜欢它的画廊交互。但现状不利于持续扩展：新增一个组件要同时改元信息、手写的画廊索引、registry 构建脚本三处，且构建脚本里的组件列表是另抄一份，容易漂移；registry 构建还靠硬编码行号从全局样式里切出组件样式，改动全局样式就会悄悄出错；品牌信息（名称、logo、域名、Turbo 推广、订阅、统计）散落各处，仓库也还不是 git 仓库，没有基线可对比。

## Solution

把库改造成「一个组件一个文件夹」的结构：每个组件的代码、元信息、独有样式放在一起，画廊目录和 shadcn registry 都由扫描这些文件夹自动生成。新增组件只需新建一个文件夹（可用脚手架命令生成），画廊里立刻出现，构建时自动产出对应的 registry 文件。现有 21 个组件全部保留、纯搬移；画廊的交互与观感保持不变；品牌集中到一个配置；去除对方的推广、订阅与统计；保留原作者的 MIT 版权声明与来源说明。

## User Stories

1. As a 组件作者，I want 新建一个文件夹就能新增一个组件，so that 我不必再修改多处列表
2. As a 组件作者，I want 用一条命令生成带元信息与 demo 模板的新组件，so that 起步成本最低
3. As a 组件作者，I want 在组件元信息里声明标题、说明、分类、变体、内部依赖和 npm 依赖，so that 这些信息只写一次
4. As a 组件作者，I want 组件独有的样式放在自己的文件夹里，so that 我不需要编辑全局样式
5. As a 组件作者，I want 元信息写错时（id 重复、依赖找不到、样式文件缺失）构建立刻失败并指出原因，so that 问题在提交前暴露
6. As a 组件作者，I want 新组件出现在画廊导航与卡片网格中，so that 我能立即看到并交互
7. As a 组件作者，I want 删除一个组件文件夹后它从画廊和 registry 中一并消失，so that 不留下悬空引用
8. As a 画廊访问者，I want 保持现有的左栏导航、卡片内变体切换、复制源码、查看代码和深浅色主题，so that 体验不因重构而退化
9. As a 画廊访问者，I want 导航能按分类分组，so that 组件变多后仍好找
10. As a 画廊访问者，I want 每个卡片的代码视图列出它依赖的内部组件与 npm 包，so that 我知道复制时还需要什么
11. As a 使用者，I want 通过 shadcn CLI 从我自己的 registry 地址安装单个组件，so that 我的其他 agent 项目能复用
12. As a 使用者，I want 安装一个组件时自动带上其内部依赖、npm 依赖和它独有的样式，so that 装完即可用
13. As a 使用者，I want registry 只包含基础样式与该组件需要的样式，so that 不必引入整份全局样式表里我不需要的部分
14. As a 维护者，I want 重构前后的 registry 产物可逐个对比，so that 我能确认「纯搬移」没有改变行为
15. As a 维护者，I want 全局样式只保留设计 token、主题映射、基础规则和通用动画，so that 它稳定且易读
16. As a 维护者，I want 站点名称、logo、标语、registry 基础地址、命名空间目录、页脚链接集中在一个配置，so that 改名或换域名只改一处
17. As a 维护者，I want 移除 Turbo 的推广块、预约链接、其 logo 与装饰图，so that 站点是我自己的品牌
18. As a 维护者，I want 移除邮件订阅、订阅接口与统计，so that 没有我不需要的外部服务依赖
19. As a 维护者，I want 保留原作者的 MIT 版权声明并有来源说明文档，so that 使用合规
20. As a 维护者，I want 付费图标库的依赖可以被替换为免费图标库（待定项），so that 安装不需要商业许可证密钥
21. As a 维护者，I want 演示用 harness 的数据与渲染分离，so that 之后替换为真实 agent 时不用改渲染
22. As a 维护者，I want 每个组件都有 `origin` 标记（上游保留 / 自有），so that 我能看到逐步替换的进度
23. As a 维护者，I want 仓库是 git 仓库并有迁移前的基线提交与基线产物，so that 每一步都可回滚、可比对
24. As a 维护者，I want 生成的索引文件不入库并在 dev/build 前自动生成，so that 不会出现过期的生成物
25. As a 维护者，I want 类型检查与生产构建在每个迁移步骤后都通过，so that 仓库始终可用
26. As a 之后的开发者，I want 旧组件保持原样可用，直到被实际使用或替换时才补成受控形态，so that 迁移范围可控

## Implementation Decisions

- **组件文件夹**：每个画廊组件一个文件夹，含默认导出的组件、`meta`（通过 `defineComponent` 声明）、可选的独有样式。共享小构件保留为独立的 atoms 层，不出现在画廊。
- **meta 字段**：id、title、caption、category、variants（可选）、deps（内部依赖）、npm、css（可选）、origin（upstream/own，现有 21 个均为 upstream）。分类列表由站点配置提供，建议 agent / data / input / layout。
- **目录生成**：一个扫描步骤读取所有 meta，产出画廊目录（含按组件懒加载的 Demo 映射）；registry 构建读取同一份目录，不再自维护组件列表与内部依赖表。两者共用同一函数（见 Testing Decisions 的唯一接缝）。dev 与 build 之前自动运行；生成物加入忽略列表。
- **校验**：扫描时检查 id 唯一、deps 可解析（指向 atoms 或其他画廊组件）、css 文件存在、必填字段齐全；任一失败即以明确信息退出。
- **样式拆分**：把全局样式中 sidebar、records 两大块拆到各自组件的独有样式；全局样式只保留 token（`:root`/`.dark`）、`@theme` 映射、基础规则、通用 keyframes，并通过生成的 import 引入组件样式。registry 直接读 `meta.css`，删除行号切片逻辑。拆分必须在其他改动之前完成，并保证 registry 产物与基线一致。
- **registry 输出**：沿用 shadcn registry 格式；foundation 条目 + 每个内部依赖条目 + 每个组件条目 + 索引。组件条目声明 `registryDependencies`、`dependencies`（npm）与 `files`（含独有样式及其 import 提示）。基础地址与命名空间目录取自站点配置。
- **站点配置**：一个配置模块提供站点名、logo、标语、registry 基础地址、命名空间目录、页脚链接、分类列表；布局、首页、registry 构建只读它。
- **去品牌**：移除 Turbo 推广/预约、其 logo 与装饰图、邮件订阅组件与接口、统计接入；`LICENSE` 保留原版权声明并追加自己的；新增来源说明文档。「Built by」等文案改为读配置。
- **Harness 拆分**：演示数据（场景表）与渲染分离；仅做拆分，不接后端。
- **脚手架**：`new` 命令生成新组件文件夹（组件模板、meta 模板、demo 模板），遵循 ADR-007 的「受控组件 + Demo」约定。
- **画廊外壳**：不改变现有交互与布局；导航按 category 分组；代码视图的依赖清单改为读 meta 生成。
- **纯搬移原则**：21 个现有组件仅移动位置、更新 import，不改行为；ADR-007 的受控化在这些组件被实际使用时再做。
- **开放项（默认值，若用户未反对即采用）**：图标库先保持不变并在文档标注；音效与 `agentation` 先保留；库名与 registry 域名先用占位配置，后续一处修改。

## Testing Decisions

- **好测试的标准**：只断言外部可观察行为——给定一组组件文件夹，产出的画廊目录与 registry 文件是什么；不断言内部实现（扫描顺序、中间数据结构、样式切分的具体方法）。
- **唯一接缝**：「目录扫描 → 画廊目录 + registry 文件」这条流水线，封装为一个函数：输入画廊目录（及站点配置），输出目录条目与 registry 文件集合。
- **被测内容**：
  - 对最小夹具目录：单个组件、带内部依赖、带独有样式、带 npm 依赖、多个变体，各断言输出条目与 registry 内容；
  - 校验失败用例：重复 id、依赖找不到、样式文件缺失、必填字段缺失，均应失败并给出可读信息；
  - 对真实仓库：产出的 registry 与迁移前基线逐文件一致（路径变化处列白名单）；21 个 id 全部存在；
  - 新增/删除一个夹具组件后，目录与 registry 相应增减。
- **不测**：组件渲染、动画、画廊页面视觉（视觉回归不在本 spec 内）。
- **辅助门槛（非测试接缝）**：每个迁移步骤后类型检查与生产构建必须通过。
- **先例**：仓库目前没有测试；基线快照对比本身就是第一份先例。需要引入一个轻量测试运行器。

## Out of Scope

- 事件协议（Part 类型、渲染映射、后端适配器）及 harness 接入真实 agent——单独评审并另起 spec（ADR-008）。
- 把现有组件改造成受控组件（ADR-007 只约束新组件）。
- 画廊的状态预览条与 `?variant=` 深链接（ADR-009 的可选项）。
- 新增或替换具体的自有组件。
- monorepo / npm 发布（ADR-006）。
- 部署、域名、CI。
- 自有 logo 与视觉品牌设计（先用占位）。

## Further Notes

- 迁移顺序：git 初始化与基线（含 registry 基线快照）→ 样式拆分 → 文件夹化与目录生成 → 站点配置与去品牌 → harness 拆分 → 脚手架。每步可单独验证、可回滚。
- 当前目录还不是 git 仓库，第一步先初始化并提交基线。
- 现有 ADR 使用三位编号（001…），与模板的四位不一致，暂不处理。
- 术语：「画廊组件」= 出现在画廊、有 meta 的组件；「atoms」= 不进画廊的共享构件；「registry」= shadcn 格式的分发产物。项目尚无 CONTEXT.md。
