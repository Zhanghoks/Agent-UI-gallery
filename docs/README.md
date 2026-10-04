# 文档索引

先读 [术语表](../CONTEXT.md) 了解用词，再读 [架构](architecture.md) 了解现状；想知道接下来做什么看 [路线图](roadmap.md)；想知道为什么这样设计看下面的 ADR。怎么使用、有哪些命令见项目根目录的 [README](../README.md)。

| 文档 | 内容 |
| --- | --- |
| [architecture.md](architecture.md) | 现状：分层、目录、数据流、校验、命令、待清理项 |
| [roadmap.md](roadmap.md) | 尚未实现的设计与后续计划 |
| [NOTICE.md](NOTICE.md) | 上游来源与许可说明 |
| [术语表](../CONTEXT.md) | 项目词汇的唯一定义处 |

## 决策记录（ADR）

固定结构：状态 / 背景 / 决定 / 后果 / 备选。状态为「已采纳 / 提议中 / 已被取代」。

| ADR | 标题 | 状态 |
| --- | --- | --- |
| [0001](adr/0001-component-folder-with-manifest.md) | 一个组件一个文件夹，元信息与代码同处 | 已采纳 |
| [0002](adr/0002-generated-catalog-and-registry.md) | 用脚本生成画廊目录与 registry | 已采纳 |
| [0003](adr/0003-per-component-css.md) | 组件独有 CSS 放进各自文件夹 | 已采纳 |
| [0004](adr/0004-site-config-and-rebranding.md) | 品牌与站点信息集中到配置，移除上游推广 | 已采纳 |
| [0005](adr/0005-upstream-attribution.md) | 上游来源与许可 | 已采纳 |
| [0006](adr/0006-single-package-registry-distribution.md) | 暂不做 monorepo 与 npm 发布，分发走 shadcn registry | 已采纳 |
| [0007](adr/0007-controlled-components-with-demo.md) | 新组件：受控展示层加独立 Demo | 已采纳 |
| [0008](adr/0008-agent-part-protocol.md) | 与后端无关的 Part 协议与渲染映射 | 提议中 |
| [0009](adr/0009-gallery-shell-extension-points.md) | 画廊外壳保持交互不变，仅开放扩展点 | 已采纳 |
| [0010](adr/0010-category-taxonomy.md) | 分类体系：按组件承担的工作划分 | 已采纳 |
| [0011](adr/0011-atoms-boundary-and-dependency-validation.md) | atoms 边界与依赖校验 | 已采纳 |
| [0012](adr/0012-docs-structure-and-consistency-check.md) | 文档分工与文档一致性检查 | 已采纳 |
| [0013](adr/0013-own-icon-set.md) | 使用自有图标集，不依赖第三方图标包 | 已采纳 |
| [0014](adr/0014-workflow-protocol-and-zcode-intake.md) | workflow 展示协议、mock 后端，以及从 ZCode 整理组件 | 已采纳 |

## 技能配置

供工程技能读取的配置（由 setup 技能生成）：[issue tracker](agents/issue-tracker.md)、[triage 标签](agents/triage-labels.md)、[领域文档约定](agents/domain.md)。

## 需求（spec）

需求与任务放在 GitHub issues（见 issue tracker 配置）。`.scratch/` 里是改用 GitHub 之前留下的本地 spec，不再新增。
