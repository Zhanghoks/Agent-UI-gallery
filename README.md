# Agent UI Gallery

面向 AI 原生产品的组件库，以「画廊」形式展示：每个组件都是可交互的实时 demo，可复制源码，也可通过 shadcn registry 安装到其他项目。

Fork 自 [Beautiful UI](docs/NOTICE.md)（MIT）。技术栈：Next.js 15 · React 19 · Tailwind CSS v4 · TypeScript。
文档从 [docs/README.md](docs/README.md) 读起，术语见 [CONTEXT.md](CONTEXT.md)，现状与结构见 [架构](docs/architecture.md)。

- 画廊：`/`
- Harness（把组件组合成 agent 聊天的演示）：`/harness`

## 快速开始

```bash
npm install
npm run dev
```

需要 Node 20+。

## 新增一个组件

先选位置（规则详见 [ADR-0011](docs/adr/0011-atoms-boundary-and-dependency-validation.md)）：

- 要在画廊里展示的 agent 组件 → `components/gallery/<id>/`；
- 没有 agent 语义、被两个以上组件复用的小构件（atom）→ `components/atoms/`，并登记到 `atoms.json`；
- 只被一个组件用的小东西 → 直接写在那个组件里；只服务画廊网站的 → `components/site/`。

然后：

1. 运行 `npm run new -- my-card --category progress` 生成文件夹（受控组件 + Demo 模板，约定见 [ADR-0007](docs/adr/0007-controlled-components-with-demo.md)），或手动新建 `components/gallery/<id>/index.tsx`（默认导出 Demo，接收可选 `variant`）。
2. 编辑同一文件夹里的 `meta.json`：

```json
{
  "id": "my-card",
  "title": "My Card",
  "caption": "One-line description.",
  "category": "progress",
  "order": 220,
  "origin": "own",
  "variants": ["A", "B"],
  "deps": ["button"],
  "npm": [],
  "css": "styles.css"
}
```

- `id`、`title`、`caption`、`category` 必填；`id` 必须与文件夹同名；`category` 取自 `foundry.config.json` 的 `categories`（含义见 [ADR-0010](docs/adr/0010-category-taxonomy.md)）。
- `deps`（atoms 或其他画廊组件的 id）和 `npm` 必须与 `index.tsx` 里真实的 import 一致，`css` 指向组件独有的样式文件；这些字段可省略。
- `npm run dev` 会自动生成目录；有问题时构建会一次列出全部（校验规则见 [架构](docs/architecture.md)）。

## 命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 生成目录并启动开发服务器 |
| `npm run gen` | 只生成目录 |
| `npm run registry` | 生成目录并写出 `public/r/*.json` |
| `npm run build` | 生成目录 + registry，然后 `next build` |
| `npm start` | 启动生产构建（需先 `npm run build`） |
| `npm run new -- <id> [--category c]` | 生成新组件文件夹 |
| `npm test` | 全部测试（目录扫描 + 文档一致性） |
| `npm run docs:check` | 只检查文档与仓库是否一致（也包含在 `npm test` 里） |
| `npm run typecheck` | 生成目录并 `tsc --noEmit` |
| `npm run lint` | `next lint` |

## 安装组件（registry）

```bash
npx shadcn add <registryBaseUrl>/approval-card.json
```

`registryBaseUrl` 在 `foundry.config.json` 中配置。安装会带上内部依赖、npm 依赖、`foundation` 样式，以及该组件独有的样式文件（按提示在你的 globals.css 里 `@import`）。
粘贴任何组件前，先把 `app/globals.css`（即 registry 的 `foundation`）整体引入一次。

## 接入真实 agent

harness 目前是假数据演示。接入真实后端的计划与事件协议见 [路线图](docs/roadmap.md)。

## 许可

MIT，见 [LICENSE](./LICENSE) 与 [docs/NOTICE.md](docs/NOTICE.md)。
