# 云端留言板 (Guestbook)

基于 **Next.js App Router**、**Better Auth**、**Prisma** 与 **Neon PostgreSQL** 的 Serverless 全栈留言板 Demo。

## 技术栈

| 类别   | 技术                                                          |
| ------ | ------------------------------------------------------------- |
| 框架   | [Next.js](https://nextjs.org/) 16、React 19、TypeScript       |
| 认证   | [Better Auth](https://www.better-auth.com/)（邮箱密码）       |
| 数据库 | [Prisma](https://www.prisma.io/) + [Neon](https://neon.tech/) |
| 校验   | [Zod](https://zod.dev/)                                       |
| 样式   | Tailwind CSS 4                                                |
| 质量   | ESLint、Prettier、Vitest                                      |
| 部署   | [Vercel](https://vercel.com/)                                 |
| 包管理 | pnpm 9                                                        |

## 功能特性

- **Server Actions** 处理表单提交，无需手写 REST API
- **Better Auth + Middleware** 实现登录保护与 Session 管理
- **分层架构**（Domain → Service → Repository → Infrastructure）解耦业务与数据库/认证细节
- **Zod** 校验留言内容（1–200 字）
- **GitHub Actions** 自动执行格式检查、Lint、类型检查、测试与构建

## 项目结构

```
guestbook/
├── .github/workflows/ci.yml       # CI 流水线
├── prisma/
│   └── schema.prisma              # 数据模型（User / Session / Message 等）
├── public/                        # 静态资源
├── src/
│   ├── app/                       # Next.js 页面与路由
│   │   ├── (auth)/                # 认证页（/login、/signup）
│   │   ├── actions/               # Server Actions（薄层，调用 Service）
│   │   ├── api/auth/[...all]/     # Better Auth HTTP 端点
│   │   ├── page.tsx               # 首页留言板
│   │   ├── loading.tsx            # 加载骨架屏
│   │   └── error.tsx              # 错误边界
│   ├── components/                # 客户端组件
│   ├── domain/                    # 领域模型、校验规则、业务异常
│   ├── infrastructure/            # 外部依赖实现
│   │   ├── auth/                  # Better Auth 配置与仓储
│   │   └── prisma/                # Prisma Client 与留言仓储
│   ├── repositories/              # 数据访问接口 + 依赖注入
│   ├── services/                  # 业务逻辑层
│   └── middleware.ts              # 路由守卫（未登录跳转 /login）
├── .env.example                   # 环境变量模板
├── package.json
└── vitest.config.ts
```

### 分层职责

| 层级     | 目录                  | 职责                               |
| -------- | --------------------- | ---------------------------------- |
| 表现层   | `app/`、`components/` | 页面渲染、表单、Server Actions     |
| 业务层   | `services/`           | 鉴权、校验、业务流程编排           |
| 接口层   | `repositories/`       | 定义数据访问契约，注入具体实现     |
| 领域层   | `domain/`             | 实体、Zod Schema、领域错误         |
| 基础设施 | `infrastructure/`     | Better Auth、Prisma 等具体技术实现 |

## 快速开始

### 1. 安装依赖

```bash
git clone <your-repo-url>
cd guestbook
pnpm install
```

`postinstall` 会自动执行 `prisma generate` 生成 Prisma Client。

### 2. 配置 Neon 数据库

1. 在 [Neon Console](https://console.neon.tech/) 创建项目
2. 复制 **Connection string**（Serverless 环境建议使用 pooled 连接）

### 3. 配置环境变量

```bash
cp .env.example .env.local
```

生成 Better Auth 密钥：

```bash
pnpm dlx @better-auth/cli@latest secret
```

填入 `.env.local`：

```env
BETTER_AUTH_SECRET=生成的密钥
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://...@...neon.tech/neondb?sslmode=require
```

### 4. 同步数据库 Schema

```bash
pnpm db:push
```

将 `prisma/schema.prisma` 中的表结构推送到 Neon。

### 5. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000)。

> 若 IDE 报 `@prisma/client` 类型缺失，执行 `pnpm db:generate` 后重启 TypeScript 服务。

## 常用命令

```bash
pnpm dev            # 开发（自动生成 Prisma Client）
pnpm build          # 生产构建
pnpm start          # 启动生产服务
pnpm db:generate    # 生成 Prisma Client
pnpm db:push        # 推送 schema 到数据库
pnpm db:migrate     # 创建迁移（生产环境推荐）
pnpm db:studio      # 打开 Prisma Studio
pnpm lint           # ESLint 检查
pnpm typecheck      # TypeScript 类型检查
pnpm test           # 运行单元测试
pnpm format         # Prettier 格式化
pnpm format:check   # 检查代码格式
```

## CI（GitHub Actions）

配置文件：`.github/workflows/ci.yml`

**触发条件**：向 `main` / `master` 分支 push 或发起 Pull Request。

**执行步骤**：

| 步骤        | 命令                             | 说明             |
| ----------- | -------------------------------- | ---------------- |
| 安装依赖    | `pnpm install --frozen-lockfile` | 锁定版本安装     |
| 生成 Client | `pnpm db:generate`               | 生成 Prisma 类型 |
| 格式检查    | `pnpm format:check`              | Prettier         |
| 静态检查    | `pnpm lint`                      | ESLint           |
| 类型检查    | `pnpm typecheck`                 | TypeScript       |
| 单元测试    | `pnpm test`                      | Vitest           |
| 构建        | `pnpm build`                     | Next.js 生产构建 |

CI 使用占位环境变量，无需真实数据库连接即可完成构建。

## 部署（Vercel）

1. 推送代码到 GitHub
2. 在 Vercel 导入仓库
3. 配置环境变量：
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL`（生产域名，如 `https://your-app.vercel.app`）
   - `DATABASE_URL`（Neon pooled 连接串）
4. 部署

首次部署前，在本地或 CI 中对生产数据库执行 `pnpm db:push` 或 `pnpm db:migrate`。

## License

MIT
