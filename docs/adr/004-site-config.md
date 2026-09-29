# ADR-004 品牌与站点信息集中到 foundry.config.ts

状态：提议
背景：名称、logo、域名、命名空间目录（beautifui）、页脚文案散落多处。
决定：单一配置文件，页面与脚本只读它。去掉 Turbo 推广、邮件订阅、PostHog。
后果：改名/换域名只改一处。
