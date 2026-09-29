# ADR-002 用脚本生成画廊索引与 registry

状态：提议
背景：Next 无 glob import，当前靠手写 import + DEMOS 映射。
决定：`scripts/gen-index.mjs` 扫描 `gallery/*/meta.ts` 生成 `lib/gallery.generated.ts`（懒加载 Demo）；`build-registry.mjs` 读同一份 meta。dev/build 前自动运行，生成物不入库。
后果：+ 单一事实来源；− 多一个预处理步骤，dev 时新增文件夹需重新生成（用 watch 或重启）。

## 实现补充
- 脚本实际命名：`scripts/gen.mjs`（生成目录，加 `--registry` 同时写 `public/r`）；registry 构建并入 `scripts/lib/catalog.mjs`，不再有单独的 `build-registry.mjs`。扫描的是 `meta.json`（见 ADR-001 实现补充）。
- 校验项：必填字段、id 与文件夹名一致、category 在配置里、`index.tsx`/css 文件存在、id 全局唯一、`deps` 可解析、`deps`/`npm` 与真实 import 一致、无循环依赖。
