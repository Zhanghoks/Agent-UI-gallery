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

## atoms 还是 gallery？

| | `atoms/` | `gallery/` |
| --- | --- | --- |
| 是什么 | 没有 agent 语义的小构件（Button、GlideMenu…） | agent 要展示给人看的组件（ApprovalCard、ToolChips…） |
| 画廊卡片 / `meta.json` | 无 | 有 |
| 被谁用 | 被 gallery 组件 import | 被 harness 和其他项目使用 |

- 会被两个以上组件复用、自己不需要画廊卡片的 → atoms，并登记到 `atoms.json`。
- 只被一个组件用的小东西 → 直接写在那个组件文件里。
- 只服务画廊网站的 → `components/site/`。
- 依赖方向单向：`harness → gallery → atoms`；gallery 组件可以依赖其他 gallery 组件（不能成环），不能依赖 `site/`、`harness/`。

## 分类

画廊的导航和卡片列表按分类分组。分类定义在 `foundry.config.json` 的 `categories`（每项 `id`、`label`、`description` 都必填，顺序即显示顺序，没有组件的分类不显示）。
分类体系与归类规则见 [ADR-010](docs/adr/010-category-taxonomy.md)；组件当前的归属以各自的 `meta.json` 为准。

| id | 回答的问题 |
| --- | --- |
| `conversation` | 人和 agent 怎么说话 |
| `progress` | agent 正在做什么 |
| `collaboration` | 人和 agent 怎么一起决定 |
| `data` | agent 知道什么、产出什么 |
| `workspace` | 工作发生的界面 |

新增分类只需在配置里加一项；组件在分类内按 `order` 排序。

## 新增一个组件

1. 新建 `components/gallery/<id>/index.tsx`（默认导出 demo 组件，接收可选 `variant`）。
2. 新建 `components/gallery/<id>/meta.json`：

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

`id` 必须与文件夹同名；`category` 必须是 `foundry.config.json` 里 `categories` 的某个 `id`（见下「分类」）；`deps` 可填 atoms 或其他画廊组件的 id；
`variants`、`deps`、`npm`、`css` 可省略。

**`deps` 和 `npm` 必须和 `index.tsx` 里真实的 import 一致**：import 了某个 atom / 其他 gallery 组件却没写进 `deps`、
import 了 npm 包（react、react-dom、next 除外）却没写进 `npm`、import 了 `atoms/` 里没登记的文件、
依赖成环，构建都会失败并指出是哪个组件。`atoms/` 目录里的每个文件也必须登记在 `atoms.json`。`npm run dev` 会自动生成目录，出错时会一次列出全部问题。

## 命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 生成目录并启动开发服务器 |
| `npm run gen` | 只生成目录（`lib/*.generated.*`、`app/gallery.generated.css`） |
| `npm run registry` | 生成目录并写出 `public/r/*.json` |
| `npm run build` | 生成目录 + registry，然后 `next build` |
| `npm run new -- <id> [--category c]` | 生成新组件文件夹（受控组件 + demo 模板） |
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

`components/harness/scenarios.tsx` 是演示数据（`components/harness/Harness.tsx` 只负责渲染）：`SCENARIOS` 把假 prompt 映射到由组件拼成的回复。
接入真实后端时替换这些数据，组件作为渲染层不变。事件协议的设计见 `docs/architecture.md` 第 9 节。

## 许可

MIT，见 [LICENSE](./LICENSE) 与 [docs/NOTICE.md](docs/NOTICE.md)。
