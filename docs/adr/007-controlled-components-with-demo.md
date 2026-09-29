# ADR-007 受控组件 + 独立 Demo

状态：提议
背景：现有组件数据走 props，但状态（如 ThinkingState 的阶段）由内部定时器 `useSequence` 推进，外部无法用真实事件驱动。
决定：新组件拆成「受控展示层（状态来自 props，导出 Props 类型）」与「demo.tsx（定时器+假数据）」。画廊展示 demo，registry 分发受控组件。旧组件在实际使用或替换时再补齐受控模式，不做一次性重写。
后果：+ 同一组件既能演示又能接真实 agent；− 每个组件多一个文件；旧组件短期内仍是定时器驱动。
备选：保留单文件、靠 `onSettled` 等回调。否决：无法表达 error/取消/重试等真实状态。

## 实现补充
- 为保持 registry 分发简单，受控组件与 Demo 目前在同一个 `index.tsx` 里：具名导出受控组件与 `Props` 类型，默认导出是驱动它的 Demo（`npm run new` 的模板即如此）。若之后 Demo 变大，再拆到 `demo.tsx`。
