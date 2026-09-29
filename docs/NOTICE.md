# 来源与许可

本项目 fork 自 **Beautiful UI**（作者 Shane Levine / Turbo，MIT 协议）的画廊与组件，
并在此基础上重构为可扩展的个人 agent 组件库。

- 保留：组件与设计系统代码（`components/gallery`、`components/atoms`、`app/globals.css`），
  在 `meta.json` 里标记为 `"origin": "upstream"`。
- 移除：原作者的品牌资产（logo、装饰图、favicon）、推广文案、邮件订阅与其接口。
- 许可：`LICENSE` 保留原版权行并追加本项目版权行。分发本项目（含通过 registry 分发组件）时，
  请保留该文件。
- 逐个替换上游组件后，对应组件的 `origin` 改为 `"own"`；全部替换后可重新评估是否还需要保留原版权行
  （只要仍包含上游派生代码，就必须保留）。
