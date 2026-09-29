# ADR-001 一个组件一个文件夹，元信息与代码同处

状态：提议
背景：新增组件需改 meta.ts、registry.tsx、build-registry.mjs 三处，且列表重复。
决定：每个组件放 `components/gallery/<id>/`，含 `index.tsx`、`meta.ts`（`defineComponent`）、可选 `styles.css`。
后果：+ 加/删组件只动一个文件夹；+ 元信息不会与代码脱节。− 需要一次性搬移 21 个文件（纯移动）。
备选：保留 `components/primitives/*.tsx` + 中央 meta。否决：中央列表正是漂移的来源。
