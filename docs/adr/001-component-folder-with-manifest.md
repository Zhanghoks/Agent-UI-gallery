# ADR-001 一个组件一个文件夹，元信息与代码同处

状态：提议
背景：新增组件需改 meta.ts、registry.tsx、build-registry.mjs 三处，且列表重复。
决定：每个组件放 `components/gallery/<id>/`，含 `index.tsx`、`meta.ts`（`defineComponent`）、可选 `styles.css`。
后果：+ 加/删组件只动一个文件夹；+ 元信息不会与代码脱节。− 需要一次性搬移 21 个文件（纯移动）。
备选：保留 `components/primitives/*.tsx` + 中央 meta。否决：中央列表正是漂移的来源。

## 实现补充
- meta 使用 `meta.json` 而非 `meta.ts`：扫描脚本是纯 Node（无需 TS 运行时），校验在扫描时完成；类型 `Meta` 仍在 `lib/meta.ts`。
- `id` 必须等于文件夹名；`order` 控制画廊顺序；`origin` 标记上游/自有。
- 共享构件在 `components/atoms/atoms.json` 里声明哪些会作为 registry 条目分发（GlideMenu 已从 primitives 移入 atoms）。
- 迁移时发现上游 registry 的两处问题并已修复：① 旧脚本按硬编码行号切 CSS，records 块少切了末尾的 `}`，导致 foundation.css 多出一个孤立的 `}`、records-table.css 缺一个；② 手写的组件列表漏了 `agent-screen`，现在自动纳入。
- **atoms / gallery 分界（规则）**：见 README「atoms 还是 gallery？」。`atoms/` 里的每个文件必须登记在 `atoms.json`，否则构建失败——这把分界从约定变成了校验。原先未登记的 6 个：`Chip`、`TextRow`、`StatusPill` 只被（未使用的）`site/Foundations.tsx` 用，已移到 `components/site/`；`Switch`、`ProgressRing`、`SegmentedControl` 没有任何使用方，已删除（git 历史可找回）。
- **依赖对照**：扫描时解析 `index.tsx` 的 import，与 `deps`/`npm` 对照（缺少即失败），并检测 gallery 之间的循环依赖、gallery 对 `site/harness` 的反向依赖。对真实仓库的 21 个组件与 6 个 atoms 全部通过。
- **迁移验证结论**：迁移时手工对比了迁移前后的 `public/r`：除组件路径变化、5 个组件里 `GlideMenu` 的 import 路径更新、以及新增 `agent-screen` 外，无其他差异。该对比是一次性的，没有做成持久测试（组件一旦被修改它就会失效）。
