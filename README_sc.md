# IELTSTAR — 雅思机考模拟平台

[English](./README.md) | 中文

基于真实 British Council 机考界面的全栈雅思 Academic 模拟考试系统，覆盖**听力、阅读、写作**三科。为学校教学场景设计。

## 功能

- 🎧 **听力** — 单列题目布局 + 音频播放
- 📖 **阅读** — 左文右题分栏 + **划词高亮**
- ✍️ **写作** — 左题右写 + **实时字数统计**（Task 1 & 2）
- ⏱️ **分科计时** — 听力 30min / 阅读 60min / 写作 60min
- ✅ **自动评分** — 听力阅读客观题自动判分
- 🧑‍🏫 **教师批阅** — 写作提交后教师在线打分
- 🖍️ **划词高亮** — 选中即标黄，点击取消
- 📝 **便签面板** — 内置笔记功能
- 🧭 **底部导航** — 科目切换 + 答题状态
- 👥 **权限管理** — 超管/教师/学生三级角色
- 🎲 **随机抽题** — 题库随机组卷（可开关）

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 13 / React 18 / TypeScript / MUI v5 |
| 后端 | Node.js / Express / MongoDB (Mongoose) |
| 认证 | 内置 JWT + Auth0 可选 |
| 部署 | Docker / Docker Compose / GitHub Actions |

## 快速开始 — Docker

```bash
# 1. 配置 MongoDB
cp server/.env.example server/.env
# 编辑 server/.env → DB_URL=mongodb://你的MongoDB地址:27017

# 2. 启动
docker compose up -d

# 3. 初始化数据
docker exec ieltstar-api node seed.js
docker exec ieltstar-api node seed-roles.js
```

打开 `http://localhost:3000` → 登录：`admin@gmail.com` / `admin123`

<details>
<summary>📄 compose.yaml 模板</summary>

```yaml
services:
  backend:
    image: crpi-icp3lopw4m28wge3.cn-shanghai.personal.cr.aliyuncs.com/xmmtx/ieltstar-api:latest
    container_name: ieltstar-api
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      PORT: 8080
      DB_NAME: ieltstar
      DB_URL: mongodb://你的MongoDB地址:27017
      DB_USER: ""
      DB_PASS: ""
    networks:
      - ieltstar

  frontend:
    image: crpi-icp3lopw4m28wge3.cn-shanghai.personal.cr.aliyuncs.com/xmmtx/ieltstar-web:latest
    container_name: ieltstar-web
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      API_URL: http://你的服务器IP:8080
    depends_on:
      - backend
    networks:
      - ieltstar

networks:
  ieltstar:
    driver: bridge
```

把 `你的MongoDB地址` 和 `API_URL` 换成实际值。
</details>

## 自动构建

推送代码到 `main` 分支后，GitHub Actions 自动构建并**同时推送** Docker Hub 和阿里云 ACR：

| 镜像 | Docker Hub | ACR (杭州) |
|------|-----------|-----------|
| 后端 API | `你的用户名/ieltstar-api:latest` | `registry.cn-shanghai.aliyuncs.com/ieltstar/ieltstar-api:latest` |
| 前端 | `你的用户名/ieltstar-web:latest` | `registry.cn-shanghai.aliyuncs.com/ieltstar/ieltstar-web:latest` |

### GitHub Secrets

| Secret | 说明 |
|--------|------|
| `DOCKERHUB_USERNAME` | Docker Hub 用户名 |
| `DOCKERHUB_TOKEN` | Docker Hub 访问令牌 |
| `ACR_REGISTRY` | 阿里云镜像仓库地址，如 `registry.cn-shanghai.aliyuncs.com` |
| `ACR_NAMESPACE` | ACR 命名空间，如 `ieltstar` |
| `ACR_USERNAME` | 阿里云账号 |
| `ACR_PASSWORD` | ACR 密码（容器镜像服务 → 访问凭证） |

### 配置 CI/CD

1. Fork 本仓库
2. 在 GitHub → **Settings → Secrets → Actions** 添加：
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN`
3. 推送代码自动触发构建

### 服务器部署

```bash
docker compose up -d
docker exec ieltstar-api node seed.js
docker exec ieltstar-api node seed-roles.js
```

## 开发环境

```bash
cd ieltstar && npm install --legacy-peer-deps
cd ../server && npm install
cp server/.env.example server/.env
cp ieltstar/.env.example ieltstar/.env.local
# 编辑 .env 文件

# 启动
cd server && node server.js          # → :8080
cd ieltstar && npm run dev            # → :3000
```

免登录体验：`http://localhost:3000/test-exam`

## 项目结构

```
ieltstar/         # Next.js 前端
├── components/TestComponents/ExamV2/  # 机考 UI 组件
├── pages/
│   ├── login.jsx       # 登录/注册
│   ├── test-exam.jsx   # 免登录演示
│   ├── admin/          # 管理后台
│   └── student/        # 学生端
└── store/              # Redux

server/           # Express 后端
├── api/
│   ├── models/         # Mongoose 数据模型
│   ├── controllers/    # 业务逻辑
│   ├── routes/         # API 路由
│   └── services/       # 数据库操作
├── seed.js             # 题库种子
└── seed-roles.js       # 角色种子
```

## API 端点

| 前缀 | 说明 |
|------|------|
| `/auth` | 注册/登录/邮箱验证/登出 |
| `/admin` | 用户管理/角色/系统设置 |
| `/exams` | 考试 CRUD |
| `/tests` | 试卷 CRUD |
| `/review` | 写作批阅 |
| `/students` | 学生数据 |

## 环境变量

| 变量 | 说明 |
|------|------|
| `DB_URL` | MongoDB 连接地址 |
| `DB_NAME` | 数据库名 |
| `PORT` | 后端端口 |
| `SENDGRID_APIKEY` | 邮件服务（可选） |

完整列表见 `.env.example` 文件。

## 许可

原项目由 Amey Bansod, Harshil Shah, Keerthana Satheesh, Saloni Talwar 开发（东北大学），改编用于学校教学场景。
