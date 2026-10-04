# ADR-0014 workflow 展示协议、mock 后端，以及从 ZCode 整理组件

状态：已采纳

## 背景

ZCode 是一个 agent 产品，里面有一整套 workflow 的用户面：时间线、运行卡、产物、脚本日志、已保存 workflow 的卡片与运行历史、启动前确认、升级问题，以及一批通用的 agent 展示件（计划、终端、队列、检查点、测试结果、来源……）。它的后端接口是一套带 schema 的 v4 会话协议，与会话、侧栏、桌面端绑在一起。画廊要把这些整理进来，并带上对应的后端接口与 mock 数据，但 ZCode 是 Apache-2.0，本库是 MIT。

## 决定

- **来源与许可**：沿用 ADR-0005 的做法。按参照重画外观与交互，不拷贝 ZCode 源文件；类型、路由、fixtures 都是自己写的。本库保持纯 MIT，不追加 ZCode 的许可声明。所有新组件 `origin: own`。
- **新增 `workflow` 分类**（修订 ADR-0010 的现有分类表）：用户在「跟踪一次 workflow 的运行、找到并启动一个 workflow」，与「看 agent 此刻在做什么」（progress）是两件事。progress 在加入 workflow 组件后会涨到十张以上，已超过「约 8 个就复审」的线，于是复审结果是拆出这一类：
  - `workflow`：timeline、run-card、artifact、workspace-log、saved-card、run-history；
  - 启动前确认和升级问题是人要做决定，归 `collaboration`（workflow-launch-approval、workflow-question-card、checkpoint-bar）；
  - 通用展示件按各自的工作归入现有分类：plan-card、terminal-view → progress；queue-list、suggestion-chips、attachment-tray → conversation；test-results、sources-list → data。
- **自有的 workflow 展示协议** `lib/workflow/protocol.ts`：纯 TypeScript 类型，不用 schema 库，不依赖任何产品。它定义：run 状态（阶段、子代理、节点、用量、待回答问题、产物摘要）、事件联合（`RunEvent`）与带序号的信封、SSE 帧、产物与分页、工作区节点与节点输出、已保存 workflow、命令与拒绝原因（`CommandResult`）、以及全部路由路径（`workflowRoutes`）。拒绝是正常结果，以 `{ ok: false, reason }` 返回。
- **状态只由事件折出来**：`lib/workflow/reducer.ts` 是纯函数 `reduceRun`，序号不大于已折入序号的事件被忽略（重放安全），用量只增不减，子代理状态从它的节点推出。mock 服务端的快照、流的开头快照、列表都由它折出，客户端把流事件叠在快照上也走同一个函数，因此两边不会不一致。
- **mock 服务端** `lib/workflow/mock-server.ts` + `app/api/mock/workflow/*`：每个 run 是一份带时间的事件脚本（`fixtures.ts`），按时钟回放；已结束的 run 完整可见，实时 run 在第一次被读取时开始计时。命令会真的改变脚本：取消在当前时刻截断并追加停止事件，回答问题会放行被「门」挡住的后续事件，续跑新建一个 run 并把旧 run 标为被取代，启动已保存 workflow 会重放它的脚本。状态放在 `globalThis`，开发服务器热更新不会重置演示；不持久化。
- **路由**：`GET runs`、`GET runs/:id`（`?restart=1&speed=` 重放实时演示）、`GET runs/:id/events`（SSE，先快照、后事件、最后 `end`；不带 `after` 从当前开始，`?after=0` 从头重放）、`GET runs/:id/artifacts[/:artifactId]`、`GET runs/:id/workspace[/:nodeId]`、`POST runs/:id/{resume,cancel}`、`POST runs/:id/questions/:qid/answer`、`GET saved`、`POST saved/:name/start`。接真实后端时挂同一棵树，组件和投影不变。
- **投影** `lib/workflow/project.ts`：协议状态 → 现有组件的展示模型（时间线、运行卡、产物、工作区日志）。纯函数，不取数。
- **分层**：协议、reducer、mock 服务端、投影与客户端 hook 都在 `lib/workflow/`，位于组件之上、与 harness 同层：它们可以依赖 gallery 组件的类型，gallery 组件不能依赖它们（组件通过 registry 分发，不能引用只存在于画廊里的 `lib/`）。`components/harness/WorkflowConsole.tsx` 与 `/workflow` 页面用这些把组件接到 mock 服务端，作为端到端的演示。
- **不进 registry**：协议与 mock 服务端不随 registry 分发。它们是参照实现与演示脚手架，使用方照协议自己实现后端即可。

## 后果

- 画廊里有了可交互的完整 workflow 链路（启动、实时观看、回答问题、停止、续跑、看产物与日志），且全部穿过协议。
- ADR-0008 的 Part 协议仍是提议中；本协议只覆盖 workflow 这一块，不替代它。两者将来要合并时，以 Part 协议的评审为准。
- 协议一旦被外部依赖就要版本化；目前有 `PROTOCOL_VERSION = 1`，尚无外部使用者。
- mock 脚本是时间驱动的，同一个实时 run 被多个页面同时读取会共享同一条时钟；需要独立演示时用 `?restart=1`。
- 分类由五个变成六个，`meta.json` 里原本放在 progress 与 data 的四张 workflow 组件改到 `workflow`。

## 备选

- 直接拷贝 ZCode 的源码与 zod schema。否决：本库会变成 MIT 与 Apache 混合许可，且 ZCode 的协议带着会话、节点淘汰、旧客户端兼容等产品细节，不是展示层需要的。
- 只给类型与 fixtures，不起路由。否决：事件流、命令的拒绝路径、续跑与问题门控只有在真的跑一遍时才能验证。
- 把 workflow 组件留在 progress。否决：超过分类软上限，且 progress 的「此刻在做什么」回答不了「这个 workflow 走到哪、能不能再跑一次」。
