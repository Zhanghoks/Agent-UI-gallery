# ADR-0011 atoms 边界与依赖校验

状态：已采纳

## 背景

组件的 `deps` 与 `npm` 是手写的：忘写一项，本地一切正常，别的项目装完才报找不到模块。atoms 与 gallery 的分界也只在约定里，放错位置没有任何东西提醒。

## 决定

分层与依赖方向：`harness → gallery → atoms`，`site` 是画廊网站自己的外壳。

- **atoms** 是没有 agent 语义、会被两个以上 gallery 组件复用的小构件，没有画廊卡片，也没有 `meta.json`；`components/atoms/atoms.json` 声明其中哪些作为 registry 条目分发。只被一个组件用的小东西直接写在那个组件里；只服务画廊网站的放 `components/site/`。
- 构建时（`scripts/lib/catalog.mjs`）校验，出错一次列出全部问题：
  - `atoms/` 里的每个文件都必须登记在 `atoms.json`；
  - 组件 `index.tsx` 的真实 import 必须与 `deps`、`npm` 一致（react、react-dom、next 除外；`@/lib/*` 视为使用方项目已有的约定）；atoms 的 npm import 也要与其声明一致；
  - gallery 组件不能依赖 `site/`、`harness/`；gallery 组件之间可以依赖但不能成环；
  - 必填字段、`id` 与文件夹名一致、category 在配置里、`index.tsx` 与声明的 css 文件存在、id 全局唯一、`deps` 可解析。
- 原先未登记的 6 个 atoms：Chip、TextRow、StatusPill 只被未使用的遗留文件引用，移到了 `components/site/`；Switch、ProgressRing、SegmentedControl 没有任何使用方，已删除（git 历史可找回）。

## 后果

- 分界从约定变成校验；新增组件时依赖写错会立刻失败。
- 静态 import 解析只识别行首的 `import` / `export … from` 与 `import()`，不会被字符串里的示例代码误伤。

## 备选

从 import 自动推导 `deps`。否决：`deps` 同时是给使用者看的文档和 registry 的依赖声明，显式声明并校验更可控。
