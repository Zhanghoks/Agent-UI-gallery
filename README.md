# Agent UI Gallery

面向 AI 原生产品的组件库，以「画廊」形式展示：每个组件都是可交互的实时 demo，可复制源码，也可通过 shadcn registry 安装到其他项目。

Fork 自 [Beautiful UI](docs/NOTICE.md)（MIT）。技术栈：Next.js 15 · React 19 · Tailwind CSS v4 · TypeScript。

- 画廊：`/`
- Harness（把组件组合成 agent 聊天的演示）：`/harness`

## 快速开始

```bash
npm install --ignore-scripts   # 见下方「图标库」
npm run dev
```

需要 Node 20+。

> **图标库**：`sidebar-nav` 使用商业图标库 `@central-icons-react`，安装时会做 license 检查。
> 设置 `CENTRAL_LICENSE_KEY` 后正常 `npm install`，或用 `--ignore-scripts` 跳过检查，或替换该组件的图标。

## 目录

```
components/
  atoms/          共享小构件（不进画廊）；atoms.json 声明哪些会作为 registry 条目分发
  gallery/<id>/   每个组件一个文件夹：index.tsx · meta.json · styles.css（可选）
  site/           画廊外壳（Grid、Nav、主题、harness…）
app/              页面与 globals.css（设计 token、@theme、基础规则、通用动画）
lib/              meta 类型；*.generated.* 由 `npm run gen` 生成，不入库
scripts/          gen.mjs（生成）、lib/catalog.mjs（扫描 → 目录 + registry，有测试）
foundry.config.json   站点名、registry 地址、命名空间目录、分类列表
docs/             architecture.md、adr/、NOTICE.md
public/r/         生成的 shadcn registry
```

## 新增一个组件

1. 新建 `components/gallery/<id>/index.tsx`（默认导出 demo 组件，接收可选 `variant`）。
2. 新建 `components/gallery/<id>/meta.json`：

```json
{
  "id": "my-card",
  "title": "My Card",
  "caption": "One-line description.",
  "category": "agent",
  "order": 220,
  "origin": "own",
  "variants": ["A", "B"],
  "deps": ["button"],
  "npm": [],
  "css": "styles.css"
}
```

`id` 必须与文件夹同名；`category` 取自 `foundry.config.json`；`deps` 可填 atoms 或其他画廊组件的 id；
`variants`、`deps`、`npm`、`css` 可省略。`npm run dev` 会自动生成目录，出错时会一次列出全部问题。

## 命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 生成目录并启动开发服务器 |
| `npm run gen` | 只生成目录（`lib/*.generated.*`、`app/gallery.generated.css`） |
| `npm run registry` | 生成目录并写出 `public/r/*.json` |
| `npm run build` | 生成目录 + registry，然后 `next build` |
| `npm test` | 目录扫描 / registry 生成的测试 |
| `npm run typecheck` | 生成目录并 `tsc --noEmit` |

## 安装组件（registry）

```bash
npx shadcn add <registryBaseUrl>/approval-card.json
```

`registryBaseUrl` 在 `foundry.config.json` 中配置（目前是本地占位地址）。安装会带上内部依赖、npm 依赖、
`foundation` 样式，以及该组件独有的样式文件（按提示在你的 globals.css 里 `@import`）。

## 设计系统

token 在 `app/globals.css` 中（`:root` / `.dark` / `@theme inline`）：偏冷的蓝灰中性色、实线细边框、单一蓝色强调色；
圆角 chip 6 · control 8 · card 10 · window 14；Inter + JetBrains Mono。粘贴任何组件前，先把 `app/globals.css`
（即 registry 的 `foundation`）整体引入一次。

## 接入真实 agent

`components/site/IceCreamHarness.tsx` 是演示：`SCENARIOS` 把假 prompt 映射到由组件拼成的回复。
接入真实后端时替换这些数据，组件作为渲染层不变。事件协议的设计见 `docs/architecture.md` 第 9 节。

## 许可

MIT，见 [LICENSE](./LICENSE) 与 [docs/NOTICE.md](docs/NOTICE.md)。
