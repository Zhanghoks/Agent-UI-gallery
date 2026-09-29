# ADR-004 品牌与站点信息集中到 foundry.config.ts

状态：提议
背景：名称、logo、域名、命名空间目录（beautifui）、页脚文案散落多处。
决定：单一配置文件，页面与脚本只读它。去掉 Turbo 推广、邮件订阅、PostHog。
后果：改名/换域名只改一处。

## 实现补充
- 配置文件是 `foundry.config.json`（而非 `.ts`）：构建脚本是纯 Node，页面通过 `resolveJsonModule` 直接导入同一份文件。字段：`name`、`tagline`、`description`、`registryName`、`homepage`、`registryBaseUrl`、`namespaceDir`、`harnessName`、`categories`（`{ id, label, description }` 列表，见 ADR-010）。域名与库名目前是占位值。
- 已移除：Turbo 推广块、邮件订阅（组件与 `/api/subscribe`）、"Fork this" 弹窗、上游 logo / 装饰图 / favicon。代码里本来就没有 PostHog，只有 README 提到，已一并删除。
