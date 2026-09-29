# ADR-003 组件独有 CSS 放进各自文件夹

状态：提议
背景：`build-registry.mjs` 用硬编码行号（423/505/1331）从 globals.css 切出 sidebar、records 的样式，改 globals.css 就会静默出错。
决定：独有 CSS 移到 `gallery/<id>/styles.css`，globals.css 通过生成的 @import 引入；registry 读 `meta.css`。
验证：搬移前后 `public/r/*.json` 内容一致。
后果：+ 消除脆弱切片；+ 新组件可带自己的样式。
