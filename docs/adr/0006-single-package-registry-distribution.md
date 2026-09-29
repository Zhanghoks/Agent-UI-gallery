# ADR-0006 暂不做 monorepo 与 npm 发布，分发走 shadcn registry

状态：已采纳

## 背景

需要让其他 agent 项目复用这些组件，但目前只有一个使用方（画廊自己）。

## 决定

- 库本身是一个 Next 应用，通过 `public/r/*.json` 分发，使用方 `npx shadcn add <地址>/<id>.json`。
- 安装会带上内部依赖、npm 依赖、foundation 样式和组件独有样式。
- 重新评估的条件：组件之间出现需要版本化的共享逻辑，或需要接入 agent-foundry 的 workspace；届时把 `components/gallery` 与 `components/atoms` 抽成独立包，画廊作为其中一个应用。目录已按文件夹自洽，抽取成本低。

## 后果

- 结构简单，没有发布流程。
- 使用方拿到的是源码副本，不会自动获得更新。

## 备选

现在就拆 monorepo 并发布 npm 包。否决：过早，没有第二个使用方来验证边界。
