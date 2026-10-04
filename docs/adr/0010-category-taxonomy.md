# ADR-0010 分类体系：按「组件在人机交互里承担的工作」划分

状态：已采纳

## 背景
最初的四类（agent / input / data / layout）是按技术形态随手分的：一半组件挤在 `agent` 里，导航和网格也没有分组标题。随着组件增多，需要一套能持续容纳新组件的分类，且分类本身应描述「这个组件为 agent 交互做什么」，而不是它长什么样。

## 决定
分类定义在 `foundry.config.json` 的 `categories`，每项 `{ id, label, description }`（三项必填、id 唯一），列表顺序就是显示顺序；没有组件的分类不显示。当前六类（`workflow` 由 ADR-0014 加入）：

| id | 回答的问题 | 现有组件 |
| --- | --- | --- |
| `conversation` | 人和 agent 怎么说话 | streaming-text、chat-composer、prompt-bar、queue-list、suggestion-chips、attachment-tray |
| `progress` | agent 正在做什么 | loading-state、thinking-state、task-rows、tool-chips、agent-screen、plan-card、terminal-view |
| `workflow` | 一次 workflow 走到哪、怎么找到并启动它 | workflow-timeline、workflow-run-card、workflow-artifact、workflow-workspace-log、workflow-saved-card、workflow-run-history |
| `collaboration` | 人和 agent 怎么一起决定 | approval-card、recommendation-card、fine-tune-card、selection-actions、workflow-launch-approval、workflow-question-card、checkpoint-bar |
| `data` | agent 知道什么、产出什么 | context-cards、records-table、diff-table、filter-table、insight-cards、code-block、test-results、sources-list |
| `workspace` | 工作发生的界面 | sidebar-nav、search、flowchart |

归类规则：
1. 一个组件只属于一个分类，按它**主要承担的工作**归类，而不是按外观。
2. 分不清时看使用者视角：用户是在「说话 / 看进度 / 做决定 / 看数据 / 找位置」里的哪一种。
3. 某个分类长期只有 1 个组件、或某个分类超过约 8 个时，重新评估拆分或合并。
4. 分类 id 一旦发布就当作稳定标识（组件 meta 引用它）；改名要同步改所有 `meta.json`，构建会校验。

`flowchart` 放在 `workspace`：它是一块用来编排 agent 工作流的画布（编辑界面），不是运行进度。原先叫 `navigation` 的分类改名为 `workspace`，以容纳侧栏、搜索、画布这类「界面本身」。

## 后果
- 导航、卡片列表、脚手架、校验全部读同一份配置；新增分类只改配置。
- 卡片编号在每个分类内重新从 01 开始；分类标题可作为锚点（`#group-<id>`），导航中的分类名可点击，滚动高亮会跟随分类标题。
- 从旧四类迁移是一次性的破坏性变更（`meta.json` 的 `category` 值变了）；目前没有外部使用者。
- 生成的 registry 条目顺序按分类排序，与旧顺序不同。

## 备选
- 保持技术形态分类（input / data / layout）。否决：对 agent 库来说信息量太低，`agent` 一类会无限膨胀。
- 多标签（一个组件多个分类）。否决：导航与卡片列表要单一归属，标签可以以后作为独立的 `tags` 字段再加。
