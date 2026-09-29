# ADR-0002 用脚本生成画廊目录与 registry

状态：已采纳

## 背景

Next 没有 glob import，画廊索引只能手写 import 与映射；registry 构建又自己维护一份组件列表。

## 决定

- `scripts/gen.mjs` 扫描所有 `meta.json`，生成三份文件：`lib/gallery.generated.ts` <!-- docs-check-ignore: 生成文件，运行 npm run gen 后才存在 -->、`lib/demos.generated.tsx` <!-- docs-check-ignore: 生成文件，运行 npm run gen 后才存在 -->、`app/gallery.generated.css` <!-- docs-check-ignore: 生成文件，运行 npm run gen 后才存在 -->。加 `--registry` 时同时写出 `public/r/*.json`。
- 扫描与 registry 构建是同一个函数（`scripts/lib/catalog.mjs`）：输入仓库根目录与配置，输出目录条目、分组和 registry 文件集合。它是整个项目最主要的测试接缝。
- `npm run dev`、`build`、`typecheck` 之前自动生成；生成的三份文件不入库。
- 出错时一次列出全部问题，校验项见 ADR-0011。

## 后果

- 元信息单一来源，画廊与 registry 不会不一致。
- 多一个预处理步骤：新增组件文件夹后 dev 服务需要重新生成（重启 `npm run dev`）。
- `public/r` 仍然入库（便于直接部署静态文件）。

## 备选

用构建时 glob 或动态 import。否决：需要额外打包配置，且 registry 仍要单独生成。
