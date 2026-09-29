# ADR-006 暂不做 monorepo / npm 发布，分发走 shadcn registry

状态：提议
决定：库本身是一个 Next 应用，通过 `public/r/*.json` 分发（`npx shadcn add`）。
重新评估条件：组件之间出现需要版本化的共享逻辑，或要接入 agent-foundry 的 workspace；届时把 `gallery/` 与 `atoms/` 抽为 `packages/ui`，画廊作为 `apps/gallery`。因为目录已按文件夹自洽，抽取成本低。
