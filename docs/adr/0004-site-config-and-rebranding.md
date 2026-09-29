# ADR-0004 品牌与站点信息集中到配置，移除上游推广

状态：已采纳

## 背景

站点名、logo、域名、命名空间目录、页脚文案原先散落在布局、首页、构建脚本和 README 里，还包含上游的推广块、邮件订阅和相关接口。

## 决定

- 单一配置文件 `foundry.config.json`：`name`、`tagline`、`description`、`registryName`、`homepage`、`registryBaseUrl`、`namespaceDir`、`harnessName`、`categories`（`{ id, label, description }` 列表，见 ADR-0010）。页面与脚本只读它。
- 配置用 JSON 而不是 TS：构建脚本是纯 Node，页面通过 JSON 导入读取同一份文件。
- 移除：上游推广与预约块、邮件订阅（组件与服务端接口）、harness 里的 "Fork this" 弹窗、上游 logo / 装饰图 / favicon。
- 库名与 registry 地址目前是**占位值**（`Agent UI Gallery`、本地地址），确定后只改这一个文件。

## 后果

- 改名或换域名只改一处。
- 站点暂时没有自己的 logo 与 favicon。

## 备选

保留上游的订阅与统计。否决：与本项目无关，且引入外部服务依赖。
