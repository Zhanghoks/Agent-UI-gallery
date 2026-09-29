# ADR-0008 与后端无关的 Part 协议与渲染映射

状态：提议中

## 背景

harness 的演示数据直接返回 React 节点，无法接事件流；README 里「演示 → 真实后端」的对照表只是散文。

## 决定

以下设计尚未实现（见路线图）：

- 定义与后端无关的 UI 消息部件 `Part`（text、thinking、tool、approval、context、task、data 等），只描述「界面要显示什么」，不绑定任何 SDK。
- 维护 `Part.type` 到组件的渲染映射表；自有组件 = 新增一种 Part 并注册一行。
- 每个后端（AI SDK、pi、OpenAI Agents SDK 等）写一个适配器，把自家事件转成 Part。
- 协议一旦被 agent-foundry 依赖就要版本化，因此实现前需要单独评审。

## 后果

- 换后端只写适配器，组件不变。
- 协议成为最需要稳定的一层，先设计再写代码。

## 备选

直接采用某个 SDK 的消息类型。否决：把基座绑死在单一后端。
