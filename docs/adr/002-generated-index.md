# ADR-002 用脚本生成画廊索引与 registry

状态：提议
背景：Next 无 glob import，当前靠手写 import + DEMOS 映射。
决定：`scripts/gen-index.mjs` 扫描 `gallery/*/meta.ts` 生成 `lib/gallery.generated.ts`（懒加载 Demo）；`build-registry.mjs` 读同一份 meta。dev/build 前自动运行，生成物不入库。
后果：+ 单一事实来源；− 多一个预处理步骤，dev 时新增文件夹需重新生成（用 watch 或重启）。
