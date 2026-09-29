# 路线图

尚未实现的设计与后续计划。现状见 [架构](architecture.md)。状态：**未开始** / **进行中** / **待定**（需要先做决定）/ **已完成**。

| # | 事项 | 状态 | 依据 | 说明 |
| --- | --- | --- | --- | --- |
| 1 | 把现有组件改造成受控组件 | 未开始 | ADR-0007 | 只在被实际使用时才改。建议先做最先要用的 ThinkingState、ToolChips、ApprovalCard、StreamingText，让受控化的写法有真实样例 |
| 2 | Part 协议、渲染映射、后端适配器 | 未开始 | ADR-0008 | 接真实 agent 的前提；实现前需单独评审，并且要版本化 |
| 3 | harness 接真实后端 | 未开始 | ADR-0008 | 依赖第 2 项；替换 `components/harness/scenarios.tsx` 的假数据，渲染部分不动 |
| 4 | 画廊 `?variant=` 深链接 | 未开始 | ADR-0009 | 分享具体变体 |
| 5 | 画廊状态预览条 | 未开始 | ADR-0009 | 受控组件可切换 running / done / error；依赖第 1 项 |
| 6 | 逐个替换或新增自有组件 | 进行中 | ADR-0005 | 每替换一个，`origin` 从 `upstream` 改为 `own` |
| 7 | 确定库名、registry 地址、logo | 待定 | ADR-0004 | 目前库名是 `Agent UI Gallery`、registry 地址是 `http://localhost:3000`，都是占位值；站点也没有自己的 logo 与 favicon。确定后只改 `foundry.config.json` |
| 8 | 是否替换商业图标库 | 待定 | 尚无 | `sidebar-nav` 依赖 `@central-icons-react`，安装时有 license 检查；可换成已在依赖里的 `iconoir-react` |
| 9 | 清理上游遗留的未使用文件 | 待定 | 尚无 | `components/site/Foundations.tsx`、`components/site/ChatExperience.tsx` 没有任何地方引用；`components/site/Chip.tsx`、`components/site/TextRow.tsx`、`components/site/StatusPill.tsx` 只被前者使用 |
| 10 | 交互音效与开发工具条是否保留 | 待定 | 尚无 | 交互音效（`components/site/InteractionSounds.tsx`）与开发工具条（`components/site/DevToolbar.tsx`） |

## 建议的下一步

先做第 1 项中的一两个组件，再基于真实的受控组件写第 2 项的协议评审。

## 已完成

只列条目，细节以对应 ADR 与 [架构](architecture.md) 为准。

| 事项 | 状态 | 依据 |
| --- | --- | --- |
| 一个组件一个文件夹，生成目录与 registry，组件独有 CSS 拆分 | 已完成 | ADR-0001、ADR-0002、ADR-0003 |
| 品牌集中到配置，移除上游推广，保留来源与许可 | 已完成 | ADR-0004、ADR-0005 |
| 画廊外壳的分类分组、锚点与滚动高亮 | 已完成 | ADR-0009、ADR-0010 |
| atoms 边界与依赖校验 | 已完成 | ADR-0011 |
| 文档分工与文档一致性检查 | 已完成 | ADR-0012 |
