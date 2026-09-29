# ADR-0001 一个组件一个文件夹，元信息与代码同处

状态：已采纳

## 背景

原先新增一个组件要同时改元信息列表、手写的画廊索引和 registry 构建脚本三处，且构建脚本里又抄了一份组件列表，两边会漂移（上游的 registry 就因此漏掉了 `agent-screen`）。

## 决定

- 每个画廊组件放在 `components/gallery/<id>/`：`index.tsx`（默认导出 Demo）、`meta.json`（元信息）、可选的 `styles.css`。
- `meta.json` 字段：`id`、`title`、`caption`、`category`（必填）；`order`、`origin`（`upstream` / `own`，缺省 `own`）、`variants`、`deps`、`npm`、`css`（可选）。
- `id` 必须等于文件夹名；`order` 决定同一分类内的显示顺序。
- 元信息用 JSON 而不是 TypeScript：扫描脚本是纯 Node，无需 TS 运行时，校验在扫描时完成；类型在 `lib/meta.ts`。
- 共享小构件不进画廊，放在 `components/atoms/`（边界规则见 ADR-0011）。

## 后果

- 新增或删除组件只动一个文件夹。
- 元信息与代码不会脱节。
- 一次性搬移了 21 个上游组件（纯移动，行为不变）。迁移时手工对比了前后的 `public/r`：除组件路径变化、5 个组件里共享构件的 import 路径更新、以及新增 `agent-screen` 外无其他差异；该对比是一次性的，没有做成持久测试（组件一旦被修改就会失效）。

## 备选

保留中央元信息列表加各组件单文件。否决：中央列表正是漂移的来源。
