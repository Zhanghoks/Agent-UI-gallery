# 术语表

本项目的领域词汇，是各文档与代码评审里用词的唯一定义处。文档用中文，代码与标识符用英文。

## 核心名词

| 术语 | 含义 |
| --- | --- |
| **gallery 组件**（画廊组件） | 出现在画廊里、有 `meta.json`、可通过 registry 分发的组件，放在 `components/gallery/<id>/`。一个文件夹一个组件 |
| **atom** | 没有 agent 语义、被两个以上 gallery 组件复用的小构件（如 Button）。没有画廊卡片；登记在 `components/atoms/atoms.json` 的会随 registry 分发 |
| **meta** | 组件文件夹里的 `meta.json`：标题、说明、分类、依赖等元信息，是组件的唯一声明处 |
| **目录**（catalog） | 扫描全部 `meta.json` 得到的条目与分组，供画廊页面渲染 |
| **registry** | shadcn 格式的分发产物，`public/r/*.json`，使用方 `npx shadcn add` 安装 |
| **foundation** | 使用方必须先引入的基础样式：设计 token、主题映射、基础规则、通用动画（即去掉组件独有样式后的全局样式） |
| **分类**（category） | 组件在人机交互里承担的工作，定义在 `foundry.config.json`（见 ADR-0010） |
| **分组**（group） | 一个分类加上属于它的组件，导航与卡片列表按它渲染 |
| **origin** | 组件来源标记：`upstream`（来自 Beautiful UI）或 `own`（自己新增或已替换） |
| **site** | 画廊网站自己的外壳（导航、卡片网格、主题切换……），不属于组件库 |
| **harness** | 用 gallery 组件拼成的演示用 agent 聊天界面，与 site 互不依赖 |
| **scenario**（场景） | harness 里的一段假数据：把一个用户提示映射到由组件拼成的回复；接真实后端时替换它 |
| **受控组件** | 状态完全来自 props 的组件，可以被真实 agent 事件驱动（见 ADR-0007） |
| **Demo** | 用定时器和假数据驱动受控组件的默认导出，画廊里看到的动画就是它 |
| **占位值** | 尚未确定、只用来让项目跑起来的值（库名、registry 地址） |

## 依赖方向

`harness → gallery → atoms`。gallery 组件之间可以依赖但不能成环，不能依赖 site 或 harness（构建时校验，见 ADR-0011）。

## 应避免的说法

| 不要说 | 改说 |
| --- | --- |
| primitive（上游的叫法） | gallery 组件 |
| 组件库 / 画廊 混用 | 指整个项目时说「组件库」；指网站时说「画廊」或「site」 |
| 共享组件、基础组件、共享小构件 | atom |
| 演示 = 组件 | 受控组件是组件，Demo 是驱动它的演示 |
| 类型 / 标签（指分类） | 分类（category）；多标签不在当前设计内 |
