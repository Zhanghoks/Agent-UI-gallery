# ADR-0005 上游来源与许可

状态：已采纳

## 背景

本项目 fork 自 MIT 协议的 Beautiful UI（作者 Shane Levine / Turbo）。

## 决定

- 保留 `LICENSE` 中的原版权行并追加本项目版权行；`docs/NOTICE.md` 记录来源与处理方式。
- 上游组件在 `meta.json` 里标记 `origin: upstream`，被替换后改为 `own`。
- 不保留对方的品牌资产（logo、装饰图、favicon）与推广文案。

## 后果

- 合规，且能一眼看出哪些组件仍是上游代码。
- 只要仍包含上游派生代码，就必须保留原版权行。

## 备选

去掉原版权行。否决：MIT 协议要求保留。
