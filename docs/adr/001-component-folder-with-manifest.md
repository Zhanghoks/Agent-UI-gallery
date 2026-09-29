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
