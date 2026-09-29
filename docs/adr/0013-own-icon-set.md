# ADR-0013 使用自有图标集，不依赖第三方图标包

状态：已采纳

## 背景

上游的组件依赖两个第三方图标包：`sidebar-nav` 用商业图标库 `@central-icons-react`（安装时要检查 license 密钥），`selection-actions` 用 `iconoir-react`。这与「做成自己的组件库」的目标不符：使用方装一个组件就被迫带上别人的图标包，还要处理商业许可。

## 决定

- 新增一个 atom：`components/atoms/Icons.tsx`，登记在 `atoms.json`（id 为 `icons`），是库自己的图标集。
- 图标是纯内联 SVG：24×24 网格、2px 圆角描边、`currentColor`，因此跟随文字颜色；通过 `size`（默认 16）控制大小，其余属性（`className`、`strokeWidth` 等）透传给 `<svg>`。
- 图标形状全部自己绘制，不复制任何第三方图标库的路径数据（商业库的路径受许可保护）。
- 组件要用图标就 import 这个 atom，并在 `meta.json` 的 `deps` 里写上 `icons`（依赖校验会强制，见 ADR-0011）。新增图标只需在该文件里加一行 `icon("Name", <path … />)`。
- 已移除 `@central-icons-react` 与 `iconoir-react` 两个依赖；安装不再需要 license 密钥或 `--ignore-scripts`。

## 后果

- 图标外观与之前略有不同（描边风格相近，但形状是重新绘制的），需要在画廊里目视确认。
- 所有图标集中在一个文件里，是一个 atom，随使用它的组件一起分发。
- 图标数量增长后，可以按用途拆成多个文件，或改成每个图标一个文件。

## 备选

- 换成另一个免费第三方图标包。否决：仍然是外部依赖，且换个包并没有解决「自己的库」这个目标。
- 每个组件各自内联 SVG。否决：重复，且风格容易不一致。
