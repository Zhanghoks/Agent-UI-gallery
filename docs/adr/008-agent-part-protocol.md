# ADR-008 与后端无关的 Part 协议 + 渲染映射表

状态：提议（第二阶段前需单独评审）
背景：README 的 seam 表是散文；harness 用 `SCENARIOS` 直接返回 ReactNode，无法接事件流。
决定：`lib/protocol.ts` 定义 `Part` 联合类型；`components/harness/renderers.tsx` 维护 `Part.type → 组件` 映射；各后端（AI SDK、pi、OpenAI Agents SDK 等）在 `adapters/` 里把自家事件转成 `Part`。
后果：+ 换后端只写适配器；+ 加自有组件 = 加 Part 类型 + 注册一行；− 协议一旦被 foundry 依赖就要谨慎演进，需版本化。
备选：直接采用某个 SDK 的消息类型。否决：把基座绑死在单一后端。
