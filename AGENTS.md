# IELTSTAR 2.0 — 智能体开发指南

> **本文档面向 AI 智能体（Claude、Copilot、Cursor 等），描述 IELTSTAR 项目的完整重构方案。**
> 请严格按照本文档的架构、路径、功能描述进行开发。

---

## 一、项目愿景

将现有的 IELTSTAR 雅思机考模拟平台从 **Next.js Pages Router + MUI + Auth0 + MongoDB/Mongoose** 重构为：

- **前端**: Next.js 16 App Router + React 19 + TypeScript strict + Tailwind CSS v4 + shadcn/ui
- **后端**: Express 5 + TypeScript + Prisma ORM + MySQL 8
- **认证**: 自建 JWT（Access Token + Refresh Token，httpOnly Cookie）
- **架构**: 前端按 feature 分层，后端按 layer 分层（Routes → Controllers → Services → Repositories）

**核心目标**：建成一个支持 Listening / Reading / Writing / Speaking 四科完整模拟考试、自动评分、成绩追踪、管理员内容管理的全栈平台。

---

## 二、参考项目及用途

| 参考项目路径 | 参考什么 |
|---|---|
| `reference/ielts-reading-mock-test/` | **考试界面核心**：IELTS 类型定义、题目组件、导航面板、计时器、评分逻辑、localStorage 持久化、结果页 |
| `reference/rbac-boilerplate/` | **项目骨架**：Express 5 + Prisma 后端架构、Next.js 16 App Router 前端架构、JWT 认证、RBAC、中间件模式、Zod 校验 |
| `reference/IELTS-MOCK-TEST-V2/` | **UI 布局**：Reading 左右分栏、Writing 左右分栏、Listening 单列滚动、顶部栏 + 计时器 |
| `reference/System-Governance-Admin-Dashboard/` | **管理后台 UI**：侧边栏布局、图表卡片、数据表格、KPI 卡片 |
| `reference/halo/ui/` | **大型项目组织**：组件分层、stores 管理、路由设计（仅参考架构思路） |
| `ieltstar/`（现有项目） | **业务逻辑参考**：数据模型、考试流程、评分公式、i18n 翻译表（仅读取，不直接复用代码） |

---

## 三、项目根目录结构

```
ieltstar-2.0/                        # 新建项目根目录（与现有 ieltstar/ 平级或替换）
├── AGENTS.md                        # 本文件
├── package.json                     # npm workspaces root (private)
├── compose.yaml                     # Docker Compose（MySQL + App）
├── .gitignore
├── .editorconfig
│
├── backend/                         # Express 5 + TypeScript + Prisma
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── biome.json
│   ├── .env.example
│   ├── prisma/
│   │   ├── schema.prisma            # 所有数据模型
│   │   └── migrations/
│   ├── seeders/
│   │   ├── seed.ts                  # 种子数据：默认角色 + 权限 + 示例考试
│   │   └── create-admin.ts          # 交互式创建管理员
│   └── src/
│       ├── index.ts                 # 启动入口
│       ├── app.ts                   # Express app 工厂
│       ├── config/
│       │   ├── env.ts               # Zod 校验环境变量
│       │   └── swagger.ts           # Swagger 配置
│       ├── lib/
│       │   ├── prisma.ts            # Prisma client 单例
│       │   ├── jwt.ts               # JWT 签发/验证工具
│       │   ├── http-response.ts     # 统一响应格式
│       │   └── handle-error.ts      # 全局错误处理
│       ├── middleware/
│       │   ├── auth.ts              # JWT 认证中间件
│       │   ├── rbac.ts              # 角色权限校验中间件
│       │   ├── validate.ts          # Zod schema 校验中间件
│       │   ├── audit-log.ts         # 审计日志中间件
│       │   └── rate-limit.ts        # 限流中间件
│       ├── routes/
│       │   ├── auth.ts              # /api/auth/*
│       │   ├── users.ts             # /api/users/*
│       │   ├── exams.ts             # /api/exams/*
│       │   ├── tests.ts             # /api/tests/*
│       │   ├── questions.ts         # /api/questions/*
│       │   ├── submissions.ts       # /api/submissions/*（学生提交答案）
│       │   ├── scores.ts            # /api/scores/*
│       │   ├── dashboard.ts         # /api/dashboard/*（统计聚合）
│       │   ├── audit-logs.ts        # /api/audit-logs/*
│       │   └── notifications.ts     # /api/notifications/*
│       ├── controllers/             # 一一对应 routes
│       ├── services/                # 业务逻辑
│       ├── repositories/            # Prisma 数据库操作
│       ├── schemas/                 # Zod 请求/响应校验
│       ├── types/                   # TypeScript 类型
│       ├── constants/               # 常量（权限列表、评分表等）
│       └── utils/                   # 工具函数
│
├── frontend/                        # Next.js 16 App Router
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   ├── vitest.config.ts
│   ├── biome.json
│   ├── .env.example
│   ├── public/
│   │   ├── favicon.png
│   │   ├── logo.svg
│   │   └── audio/                   # 听力音频文件
│   └── src/
│       ├── app/
│       │   ├── layout.tsx           # 根布局
│       │   ├── page.tsx             # 首页（重定向逻辑）
│       │   ├── globals.css          # Tailwind 全局样式
│       │   ├── (auth)/              # 认证相关页面
│       │   │   ├── login/page.tsx
│       │   │   ├── register/page.tsx
│       │   │   ├── forgot-password/page.tsx
│       │   │   └── reset-password/page.tsx
│       │   ├── (landing)/           # 落地页
│       │   │   └── page.tsx
│       │   ├── (dashboard)/         # 学生仪表盘
│       │   │   ├── layout.tsx       # 学生侧边栏布局
│       │   │   ├── dashboard/page.tsx
│       │   │   ├── exams/page.tsx       # 可用考试列表
│       │   │   ├── exams/[id]/page.tsx  # 考试入口（说明页）→ 跳转 exam-session
│       │   │   ├── archive/page.tsx     # 历史成绩归档
│       │   │   └── profile/page.tsx
│       │   ├── (exam)/              # 考试会话（无导航栏，全屏模式）
│       │   │   ├── layout.tsx       # 全屏布局，无侧边栏
│       │   │   └── session/[id]/page.tsx  # 考试主页面
│       │   └── (admin)/             # 管理后台
│       │       ├── layout.tsx       # 管理员侧边栏布局
│       │       ├── dashboard/page.tsx    # 管理首页统计
│       │       ├── exams/page.tsx        # 考试 CRUD 表格
│       │       ├── exams/[id]/page.tsx   # 考试详情 + 内含 Test 管理
│       │       ├── questions/page.tsx    # 题库管理
│       │       ├── users/page.tsx        # 用户管理
│       │       ├── roles/page.tsx        # 角色管理
│       │       ├── audit-logs/page.tsx   # 审计日志
│       │       └── settings/page.tsx
│       ├── features/                # 按功能域组织
│       │   ├── auth/
│       │   │   ├── components/      # LoginForm, RegisterForm, ForgotPasswordForm
│       │   │   ├── hooks/           # useLogin, useRegister, useLogout
│       │   │   ├── auth.schema.ts   # Zod 校验
│       │   │   ├── auth.types.ts
│       │   │   └── index.ts
│       │   ├── exam/                # 考试核心
│       │   │   ├── components/
│       │   │   │   ├── ExamTopBar.tsx        # 顶部栏：学生ID、计时器、提交按钮
│       │   │   │   ├── ExamBottomNav.tsx     # 底部导航：科目切换标签
│       │   │   │   ├── ListeningView.tsx     # 听力界面（单列 + 音频播放器）
│       │   │   │   ├── ReadingView.tsx       # 阅读界面（左文章 + 右题目）
│       │   │   │   ├── WritingView.tsx       # 写作界面（左题目 + 右写作区）
│       │   │   │   ├── SpeakingView.tsx      # 口语界面（题目 + 录音/语音识别）
│       │   │   │   ├── PassageDisplay.tsx    # 文章展示组件（支持高亮）
│       │   │   │   ├── QuestionCard.tsx      # 可折叠题目卡片（单选/填空/TFNG 等）
│       │   │   │   ├── NavigationPanel.tsx   # 题号导航网格（已答/未答/标记）
│       │   │   │   ├── Timer.tsx             # 倒计时组件
│       │   │   │   ├── AudioPlayer.tsx       # 听力音频播放器
│       │   │   │   ├── InstructionsDialog.tsx # 考试说明弹窗
│       │   │   │   ├── ScoreBoard.tsx        # 成绩面板
│       │   │   │   ├── RadialChart.tsx       # 径向分数图
│       │   │   │   └── SendScore.tsx         # 分享/发送成绩
│       │   │   ├── hooks/
│       │   │   │   ├── useExamSession.ts     # 考试状态管理（类似 ielts-reading-mock-test）
│       │   │   │   ├── useTimer.ts           # 计时器 hook
│       │   │   │   ├── useHighlighter.ts     # 文本高亮 hook
│       │   │   │   └── useSpeechRecognition.ts # 语音识别 hook
│       │   │   ├── utils/
│       │   │   │   ├── scoring.ts            # 评分逻辑（雅思标准）
│       │   │   │   ├── bandScore.ts          # 原始分 → Band Score 转换表
│       │   │   │   └── persistence.ts        # localStorage 持久化
│       │   │   ├── exam.types.ts             # IELTS 类型定义
│       │   │   ├── exam.schema.ts            # 校验
│       │   │   └── index.ts
│       │   ├── dashboard/           # 学生仪表盘
│       │   │   ├── components/
│       │   │   │   ├── SummaryCards.tsx       # 四科分数摘要卡片
│       │   │   │   ├── SectionComparisonChart.tsx # 四科对比图
│       │   │   │   ├── Leaderboard.tsx        # 排行榜
│       │   │   │   ├── TestTimeline.tsx       # 考试时间线
│       │   │   │   └── StudyMaterial.tsx      # 推荐学习资料
│       │   │   ├── hooks/
│       │   │   ├── dashboard.types.ts
│       │   │   └── index.ts
│       │   ├── archive/             # 成绩归档
│       │   │   ├── components/
│       │   │   │   ├── ArchiveTable.tsx
│       │   │   │   └── ScoreDetailDialog.tsx
│       │   │   ├── hooks/
│       │   │   └── index.ts
│       │   ├── admin/               # 管理后台功能
│       │   │   ├── exams/
│       │   │   │   ├── components/
│       │   │   │   │   ├── ExamTable.tsx
│       │   │   │   │   ├── CreateExamDialog.tsx
│       │   │   │   │   ├── UpdateExamDialog.tsx
│       │   │   │   │   └── DeleteExamDialog.tsx
│       │   │   │   ├── hooks/
│       │   │   │   └── index.ts
│       │   │   ├── tests/
│       │   │   │   ├── components/
│       │   │   │   │   ├── TestTable.tsx
│       │   │   │   │   ├── CreateTestDialog.tsx
│       │   │   │   │   └── QuestionManager.tsx  # 向 Test 添加/编辑题目
│       │   │   │   ├── hooks/
│       │   │   │   └── index.ts
│       │   │   ├── questions/
│       │   │   │   ├── components/
│       │   │   │   │   ├── QuestionTable.tsx
│       │   │   │   │   ├── CreateQuestionDialog.tsx
│       │   │   │   │   ├── UpdateQuestionDialog.tsx
│       │   │   │   │   └── QuestionEditor.tsx  # 富文本编辑器（SunEditor 或 Tiptap）
│       │   │   │   ├── hooks/
│       │   │   │   └── index.ts
│       │   │   ├── users/
│       │   │   │   ├── components/
│       │   │   │   │   ├── UsersTable.tsx
│       │   │   │   │   └── UserDetailDialog.tsx
│       │   │   │   ├── hooks/
│       │   │   │   └── index.ts
│       │   │   └── index.ts
│       │   ├── landing/             # 落地页
│       │   │   ├── components/
│       │   │   │   ├── Hero.tsx
│       │   │   │   ├── Features.tsx
│       │   │   │   ├── AboutUs.tsx
│       │   │   │   ├── Testimonials.tsx
│       │   │   │   └── Footer.tsx
│       │   │   └── index.ts
│       │   └── notifications/       # 通知
│       │       ├── components/
│       │       │   └── NotificationList.tsx
│       │       ├── hooks/
│       │       │   └── useNotifications.ts
│       │       └── index.ts
│       ├── shared/                  # 共享模块
│       │   ├── components/
│       │   │   ├── common/          # Button, Input, Modal, Card, Badge, Avatar, etc.
│       │   │   ├── layout/
│       │   │   │   ├── StudentSidebar.tsx
│       │   │   │   ├── AdminSidebar.tsx
│       │   │   │   ├── AdminTopbar.tsx
│       │   │   │   └── Shell.tsx    # 通用页面壳
│       │   │   ├── guard/
│       │   │   │   ├── AuthGuard.tsx     # 登录保护
│       │   │   │   └── RoleGuard.tsx     # 角色保护
│       │   │   └── ui/              # shadcn/ui 组件（自动生成）
│       │   ├── hooks/
│       │   │   ├── useAuth.ts
│       │   │   ├── useDebounce.ts
│       │   │   └── useMediaQuery.ts
│       │   ├── lib/
│       │   │   ├── api-client.ts    # Axios 封装（自动带 token、刷新）
│       │   │   ├── i18n.ts          # 国际化（中/英）
│       │   │   └── utils.ts         # formatDate, formatNumber 等
│       │   ├── stores/
│       │   │   ├── auth-store.ts    # Zustand: 用户信息、token
│       │   │   └── ui-store.ts      # Zustand: 侧边栏、主题等
│       │   ├── providers/
│       │   │   ├── Providers.tsx     # 组合所有 Provider
│       │   │   ├── QueryProvider.tsx # TanStack Query
│       │   │   └── ThemeProvider.tsx
│       │   └── types/
│       │       └── api.types.ts     # 通用 API 响应类型
│       └── locales/
│           ├── en.ts                # 英文翻译（从现有 ieltstar/locales/en.js 迁移）
│           └── zh.ts                # 中文翻译（从现有 ieltstar/locales/zh.js 迁移）
```

---

## 四、数据模型（Prisma Schema）

```prisma
// backend/prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String                                    // bcrypt 哈希
  name          String
  avatarUrl     String?
  role          Role      @default(STUDENT)
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  submissions   Submission[]
  auditLogs     AuditLog[]
  notifications Notification[]

  @@map("users")
}

enum Role {
  SUPER_ADMIN    // 超级管理员
  ADMIN          // 管理员
  STUDENT        // 学生
}

model Exam {
  id          String    @id @default(cuid())
  title       String
  description String?
  type        ExamType                                  // ACADEMIC / GENERAL
  isPublished Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  tests       Test[]
  submissions Submission[]

  @@map("exams")
}

enum ExamType {
  ACADEMIC
  GENERAL
}

model Test {
  id          String     @id @default(cuid())
  examId      String
  section     Int                                        // 1-4（该科目的第几部分）
  category    TestCategory                              // Listening/Reading/Writing/Speaking
  instruction String?                                    // 考试说明（HTML 富文本）
  source      String?    @db.LongText                    // 文章内容 / 图表描述 / 音频说明
  audioUrl    String?                                    // 听力音频 URL
  duration    Int        @default(30)                    // 时长（分钟）
  order       Int        @default(0)                    // 排序
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  exam        Exam       @relation(fields: [examId], references: [id], onDelete: Cascade)
  questions   Question[]

  @@map("tests")
}

enum TestCategory {
  LISTENING
  READING
  WRITING
  SPEAKING
}

model Question {
  id              String        @id @default(cuid())
  testId          String
  questionNumber  Int                                         // 题目编号 1-40
  type            QuestionType                                // 题型
  title           String?                                     // 题目标题（如 "Question 1"）
  instruction     String?                                     // 该题说明
  content         String?       @db.LongText                  // 题目内容
  options         Json?                                       // ["A. xxx", "B. xxx", ...]
  correctAnswer   String                                      // 正确答案
  acceptableAnswers Json?                                     // ["alt1", "alt2"] 可接受答案
  wordLimit       Int?                                        // 字数限制（填空类）
  marks           Float        @default(1.0)                 // 分值
  groupId         String?                                     // 题目组 ID（如 TFNG 题组）
  groupInstruction String?                                    // 组说明
  groupContent    String?      @db.LongText                   // 组共享内容（标题列表、摘要文本）
  explanation     String?                                     // 答案解析
  passageId       String?                                     // 关联文章段落

  test            Test          @relation(fields: [testId], references: [id], onDelete: Cascade)
  answers         Answer[]

  @@map("questions")
}

enum QuestionType {
  MULTIPLE_CHOICE
  TRUE_FALSE_NOT_GIVEN
  YES_NO_NOT_GIVEN
  MATCHING_HEADINGS
  MATCHING_INFORMATION
  MATCHING_FEATURES
  SENTENCE_COMPLETION
  SUMMARY_COMPLETION
  SHORT_ANSWER
  DIAGRAM_LABELING
  TABLE_COMPLETION
  NOTE_COMPLETION
  ESSAY                                         // Writing
  SPEAKING_TOPIC                                // Speaking
}

model Submission {
  id          String    @id @default(cuid())
  userId      String
  examId      String
  status      SubmissionStatus @default(IN_PROGRESS)
  startedAt   DateTime  @default(now())
  completedAt DateTime?
  totalScore  Float?
  bandScore   Float?

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  exam        Exam      @relation(fields: [examId], references: [id], onDelete: Cascade)
  answers     Answer[]
  scores      Score[]

  @@map("submissions")
}

enum SubmissionStatus {
  IN_PROGRESS
  COMPLETED
  ABANDONED
}

model Answer {
  id           String   @id @default(cuid())
  submissionId String
  questionId   String
  userAnswer   String?                                    // 用户答案
  isCorrect    Boolean?
  timeSpent    Int      @default(0)                       // 耗时（秒）
  createdAt    DateTime @default(now())

  submission   Submission @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  question     Question   @relation(fields: [questionId], references: [id], onDelete: Cascade)

  @@map("answers")
}

model Score {
  id            String   @id @default(cuid())
  submissionId  String
  category      TestCategory
  rawScore      Float                                    // 原始分 (0-40)
  bandScore     Float                                    // Band Score (0-9)
  feedback      String?  @db.LongText                    // AI 反馈（Writing/Speaking）
  createdAt     DateTime @default(now())

  submission    Submission @relation(fields: [submissionId], references: [id], onDelete: Cascade)

  @@map("scores")
}

model AuditLog {
  id        String   @id @default(cuid())
  userId    String
  action    String                                       // 如 "exam.create", "user.delete"
  resource  String                                       // 如 "exam", "user"
  resourceId String?
  detail    Json?
  ipAddress String?
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("audit_logs")
}

model Notification {
  id        String    @id @default(cuid())
  userId    String
  title     String
  message   String
  isRead    Boolean   @default(false)
  link      String?
  createdAt DateTime  @default(now())

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("notifications")
}
```

---

## 五、API 路由设计

### 5.1 认证 `/api/auth`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/register` | 注册 | 否 |
| POST | `/api/auth/login` | 登录 → 返回 httpOnly Cookie | 否 |
| POST | `/api/auth/logout` | 登出 → 清除 Cookie | 是 |
| POST | `/api/auth/refresh` | 刷新 token | 否（用 refresh cookie） |
| GET | `/api/auth/me` | 获取当前用户信息 | 是 |
| POST | `/api/auth/forgot-password` | 发送重置邮件 | 否 |
| POST | `/api/auth/reset-password` | 重置密码 | 否 |
| POST | `/api/auth/verify-email` | 验证邮箱 | 否 |

### 5.2 用户管理 `/api/users`（管理员）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/users` | 用户列表（分页+搜索） |
| GET | `/api/users/:id` | 用户详情 + 考试历史 |
| POST | `/api/users` | 创建用户 |
| PATCH | `/api/users/:id` | 更新用户 |
| DELETE | `/api/users/:id` | 软删除用户 |
| PATCH | `/api/users/:id/role` | 修改角色 |

### 5.3 考试管理 `/api/exams`（管理员）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/exams` | 考试列表 |
| GET | `/api/exams/:id` | 考试详情（含 tests） |
| POST | `/api/exams` | 创建考试 |
| PATCH | `/api/exams/:id` | 更新考试 |
| DELETE | `/api/exams/:id` | 删除考试 |
| PATCH | `/api/exams/:id/publish` | 发布/取消发布 |

### 5.4 测试管理 `/api/tests`（管理员）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/tests?examId=xxx` | 按考试获取 tests |
| GET | `/api/tests/:id` | Test 详情（含 questions） |
| POST | `/api/tests` | 创建 Test |
| PATCH | `/api/tests/:id` | 更新 Test |
| DELETE | `/api/tests/:id` | 删除 Test |
| POST | `/api/tests/:id/questions` | 向 Test 添加题目 |
| PATCH | `/api/tests/:id/questions/:questionId` | 更新题目 |
| DELETE | `/api/tests/:id/questions/:questionId` | 删除题目 |
| PATCH | `/api/tests/:id/reorder` | 调整题目顺序 |

### 5.5 考试提交 `/api/submissions`（学生）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/submissions` | 开始考试（创建 submission） |
| GET | `/api/submissions/:id` | 获取考试会话（恢复考试） |
| POST | `/api/submissions/:id/answers` | 提交单个答案 |
| POST | `/api/submissions/:id/complete` | 完成考试（触发自动评分） |
| GET | `/api/submissions?userId=xxx` | 获取用户所有提交记录 |

### 5.6 成绩 `/api/scores`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/scores/:submissionId` | 获取某次提交的评分详情 |
| GET | `/api/scores/student/:userId` | 学生所有成绩历史 |

### 5.7 仪表盘 `/api/dashboard`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/dashboard/student/:userId` | 学生仪表盘数据（四科分数、图表） |
| GET | `/api/dashboard/admin` | 管理后台统计数据 |
| GET | `/api/dashboard/leaderboard` | 排行榜 |

### 5.8 审计日志 `/api/audit-logs`（管理员）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/audit-logs` | 审计日志列表（分页+筛选） |

---

## 六、前端路由与页面逻辑

### 6.1 路由分组设计

```
/                           → 重定向逻辑
├── (landing)/              → 公开落地页（未登录用户）
│   └── /                   → Landing 页面
├── (auth)/                 → 认证页面
│   ├── /login              → 登录
│   ├── /register           → 注册
│   ├── /forgot-password    → 忘记密码
│   └── /reset-password     → 重置密码
├── (dashboard)/            → 学生端（需登录，角色=STUDENT）
│   ├── /dashboard          → 仪表盘首页
│   ├── /exams              → 可用考试列表
│   ├── /exams/[id]         → 考试说明页 → 点击开始进入 exam-session
│   ├── /archive            → 历史成绩
│   └── /profile            → 个人资料
├── (exam)/                 → 考试会话（全屏模式，无导航）
│   └── /session/[id]       → 考试主界面
└── (admin)/                → 管理后台（需登录，角色=SUPER_ADMIN/ADMIN）
    ├── /admin/dashboard    → 管理首页
    ├── /admin/exams        → 考试管理
    ├── /admin/exams/[id]   → 考试详情（含 Tests 管理）
    ├── /admin/questions    → 题库管理
    ├── /admin/users        → 用户管理
    ├── /admin/audit-logs   → 审计日志
    └── /admin/settings     → 系统设置
```

### 6.2 重定向逻辑（`/` page.tsx）

```
1. 检查 httpOnly Cookie 中的 access_token（或调用 /api/auth/me）
2. 未登录 → 显示 (landing) 页面
3. 已登录 + role=STUDENT → redirect /dashboard
4. 已登录 + role=ADMIN/SUPER_ADMIN → redirect /admin/dashboard
```

### 6.3 考试流程详解

```
/exams → 选择考试
    ↓
/exams/[id] → 查看考试说明（四科概览、时长）→ 点击 "Start Test"
    ↓
/session/[submissionId] → 全屏考试界面
    ├── 弹出 InstructionsDialog（科目说明）
    ├── 计时器开始倒计时（每科独立时长）
    ├── 学生作答：自动保存到后端 + localStorage 双保险
    ├── 底部 BottomNav 切换科目（Listening→Reading→Writing→Speaking）
    ├── 时间到自动提交 / 点击 Finish 手动提交
    ↓
ScoreBoard 弹窗 → 显示各科分数 + 总 Band Score
    ├── RadialChart 径向分数图
    ├── 按题目类型的正确率统计
    └── SendScore（分享/邮件/SMS）
```

### 6.4 考试界面布局（参考 `reference/IELTS-MOCK-TEST-V2/`）

#### Listening 界面
```
┌──────────────────────────────────────────────┐
│ ExamTopBar: [学生名] [⏱ 28:15] [交卷] [设置] │
├──────────────────────────────────────────────┤
│  AudioPlayer: ═══════════🔊══════════════    │
├──────────────────────────────────────────────┤
│  Part 1: Questions 1-10                      │
│  ┌──────────────────────────────────────┐    │
│  │ QuestionCard 1 (collapsible)         │    │
│  │ QuestionCard 2                       │    │
│  │ ...                                  │    │
│  └──────────────────────────────────────┘    │
│  NavigationPanel (题号网格)                  │
├──────────────────────────────────────────────┤
│ BottomNav: [Listening] [Reading] [Writing]   │
└──────────────────────────────────────────────┘
```

#### Reading 界面（参考 `reference/ielts-reading-mock-test/` 的 TestInterface）
```
┌──────────────────────────────────────────────┐
│ ExamTopBar: [学生名] [⏱ 52:30] [交卷] [A- A A+] [🖍] │
├────────────────────┬─────────────────────────┤
│ PassageDisplay     │ QuestionCard 1          │
│ (文章，可滚动)      │   (collapsible)          │
│                    │ QuestionCard 2          │
│ 高亮 + 字号调整     │   (collapsible)          │
│                    │ ...                     │
│                    │ NavigationPanel         │
├────────────────────┴─────────────────────────┤
│ BottomNav: [Passage 1] [Passage 2] [Passage 3]│
└──────────────────────────────────────────────┘
```

#### Writing 界面
```
┌──────────────────────────────────────────────┐
│ ExamTopBar: [学生名] [⏱ 45:20] [交卷]         │
├────────────────────┬─────────────────────────┤
│ Task Description   │ TextArea (写作区)        │
│ (题目 + 图表)       │                         │
│                    │ Word Count: 187 / 250    │
│                    │                         │
├────────────────────┴─────────────────────────┤
│ BottomNav: [Task 1] [Task 2]                  │
└──────────────────────────────────────────────┘
```

#### Speaking 界面
```
┌──────────────────────────────────────────────┐
│ ExamTopBar: [学生名] [⏱ 12:30] [交卷]         │
├──────────────────────────────────────────────┤
│  Topic Card (话题卡片)                        │
│  ┌──────────────────────────────────────┐    │
│  │ Describe a memorable trip...         │    │
│  │ You should say:                      │    │
│  │ - where you went                     │    │
│  │ - who you went with                  │    │
│  │ - what you did there                 │    │
│  └──────────────────────────────────────┘    │
│  🎤 [Start Recording]  ⏺ Recording...       │
│  Transcription Area (语音转文字结果)          │
└──────────────────────────────────────────────┘
```

---

## 七、评分逻辑

### 7.1 Listening & Reading（自动评分）

参考 `reference/ielts-reading-mock-test/src/utils/scoring.ts`：

```
1. 遍历 questions，比对学生答案与 correctAnswer
2. 标准化比较：trim + lowercase + 去除多余空格
3. 如配置 acceptableAnswers，额外匹配
4. 正确数 → 原始分 (0-40)
5. 原始分 → IELTS Band Score（查表映射，Academic 和 General 不同）

Band Score 转换表（Academic Reading）：
  原始分 39-40 → Band 9
  原始分 37-38 → Band 8.5
  原始分 35-36 → Band 8
  原始分 33-34 → Band 7.5
  原始分 30-32 → Band 7
  ...（从现有 ieltstar 项目或 ielts-reading-mock-test 获取完整表）
```

### 7.2 Writing（半自动评分）

```
1. 字数统计 → 是否满足最低字数（Task 1: 150, Task 2: 250）
2. 基础评分：语法检查（可接入 Grammarly API 或开源方案）
3. 人工评分：管理员可在后台查看写作内容并手动打分
4. 最终 Band Score = 人工评分 或 基础评分
```

### 7.3 Speaking（半自动评分）

```
1. 语音录制 + Web Speech API 转文字
2. 基础评分：流利度（语速）、词汇量（unique words）、语法复杂度
3. 人工评分：管理员可回听录音并手动打分
```

---

## 八、RBAC 权限设计

参考 `reference/rbac-boilerplate/` 的权限系统：

### 角色

| 角色 | 说明 |
|------|------|
| `SUPER_ADMIN` | 超级管理员，拥有全部权限 |
| `ADMIN` | 管理员，可管理考试/题目/用户但不能删除其他管理员 |
| `STUDENT` | 学生，只能参加考试和查看自己的成绩 |

### 权限（resource:action 格式）

```
exams:read, exams:create, exams:update, exams:delete, exams:publish
tests:read, tests:create, tests:update, tests:delete
questions:read, questions:create, questions:update, questions:delete
users:read, users:create, users:update, users:delete
roles:read, roles:update
submissions:read
scores:read, scores:create
audit-logs:read
dashboard:read
```

权限中间件在路由层生效，模式参考 `reference/rbac-boilerplate/backend/src/middleware/`。

---

## 九、国际化 (i18n)

- 翻译文件位置：`frontend/src/locales/en.ts` 和 `frontend/src/locales/zh.ts`
- 从现有 `ieltstar/locales/en.js` 和 `ieltstar/locales/zh.js` **迁移所有翻译 key**
- 使用 React Context 实现（类似现有 `ieltstar/utils/i18n.js`），或使用 next-intl
- 支持语言：English (en) 和 简体中文 (zh)
- 语言偏好存储在 localStorage (`ieltstar_lang`)，默认跟随浏览器语言

---

## 十、技术栈详细

### 前端

| 类别 | 选型 | 说明 |
|------|------|------|
| 框架 | Next.js 16 (App Router) | 参考 rbac-boilerplate |
| 语言 | TypeScript (strict) | |
| 样式 | Tailwind CSS v4 | 参考 rbac-boilerplate |
| 组件库 | shadcn/ui | 基于 Radix UI |
| 图表 | Recharts | 替代 ApexCharts |
| 状态管理 | Zustand | 轻量，替代 Redux Toolkit |
| 数据获取 | TanStack Query (React Query v5) | 服务端状态管理 |
| 表单 | React Hook Form + Zod | |
| 富文本 | Tiptap 或 SunEditor | 用于题目编辑器 |
| 音频 | 原生 `<audio>` + 自定义控件 | 替代 react-h5-audio-player |
| 语音识别 | Web Speech API | 替代 react-speech-recognition |
| HTTP | Axios（封装在 api-client.ts） | 自动携带 token、自动刷新 |
| 动画 | framer-motion | 替代 AOS |
| 图标 | lucide-react | |

### 后端

| 类别 | 选型 | 说明 |
|------|------|------|
| 运行时 | Node.js 20+ | |
| 框架 | Express 5 + TypeScript | 参考 rbac-boilerplate |
| ORM | Prisma | |
| 数据库 | MySQL 8 | |
| 认证 | JWT (jsonwebtoken + bcryptjs) | Access 15min + Refresh 7d, httpOnly Cookie |
| 校验 | Zod | |
| 邮件 | SendGrid (`@sendgrid/mail`) | |
| 短信 | Twilio | |
| 日志 | morgan | |
| API 文档 | Swagger (swagger-jsdoc + swagger-ui-express) | 访问 /api/docs |
| 测试 | Vitest | |

---

## 十一、开发顺序与优先级

### Phase 1：基础骨架（后端 + 前端认证）
1. 初始化项目结构 + npm workspaces
2. 后端：Prisma schema → migrations → seed → 认证 API（register/login/logout/me）
3. 前端：App Router 布局 → (auth) 页面 → JWT 认证流程

### Phase 2：管理后台
4. 后端：Exam/Test/Question CRUD API + RBAC 中间件
5. 前端：(admin) 布局 → 考试/题目/用户管理页面

### Phase 3：考试核心
6. 后端：Submission/Answer/Score API + 自动评分逻辑
7. 前端：(exam) 考试界面 → 各科目视图 → 计时器 → 导航面板 → 提交

### Phase 4：学生仪表盘
8. 前端：(dashboard) 仪表盘 → 成绩图表 → 排行榜 → 归档
9. 后端：Dashboard 聚合 API

### Phase 5：增强功能
10. 国际化（i18n）
11. 落地页（landing）
12. 通知系统
13. 审计日志
14. 成绩分享（邮件/SMS/社交媒体）
15. 测试与部署

---

## 十二、关键代码模式

### 12.1 后端分层模式（参考 `reference/rbac-boilerplate/backend/src/`）

```
route  → 仅做路由匹配 + 调用 controller
controller → 解析请求参数 → 调用 service → 格式化响应
service → 业务逻辑 → 调用 repository → 抛出业务异常
repository → Prisma 查询 → 返回数据
middleware → 认证/授权/校验/日志 → next()
```

### 12.2 前端 Feature 模式（参考 `reference/rbac-boilerplate/frontend/src/features/`）

每个 feature 包含：
- `components/` — 该功能的 UI 组件
- `hooks/` — 该功能的自定义 hooks
- `*.types.ts` — 该功能的类型定义
- `*.schema.ts` — Zod 校验 schema
- `index.ts` — 统一导出

### 12.3 API Client 模式

```typescript
// frontend/src/shared/lib/api-client.ts
// Axios 实例：
// - baseURL = process.env.NEXT_PUBLIC_API_URL
// - withCredentials: true（携带 httpOnly Cookie）
// - 响应拦截器：401 → 尝试 refresh → 重试原请求
// - 请求拦截器：自动添加 CSRF token（如有）
```

### 12.4 考试状态管理（参考 `reference/ielts-reading-mock-test/src/hooks/useTestSession.ts`）

```typescript
// 前端：useExamSession hook
// - 管理当前科目索引、题目索引
// - answers: Record<questionId, answer>
// - flaggedQuestions: Set<questionId>
// - visitedQuestions: Set<questionId>
// - 自动保存到 localStorage（防刷新丢失）
// - 定时同步到后端（每 30 秒或每次答题）
// - 倒计时结束自动提交
```

---

## 十三、环境变量

### 后端 `.env`
```
PORT=3001
DATABASE_URL="mysql://user:pass@localhost:3306/ieltstar"
JWT_ACCESS_SECRET="xxx"
JWT_REFRESH_SECRET="xxx"
ACCESS_TOKEN_EXPIRY="15m"
REFRESH_TOKEN_EXPIRY="7d"
FRONTEND_URL="http://localhost:3000"
SENDGRID_API_KEY="xxx"
TWILIO_ACCOUNT_SID="xxx"
TWILIO_AUTH_TOKEN="xxx"
TWILIO_PHONE_NUMBER="xxx"
```

### 前端 `.env.local`
```
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXT_PUBLIC_APP_NAME="IELTSTAR"
```

---

## 十四、注意事项

1. **不要直接复制现有 `ieltstar/` 代码**。现有项目使用 Pages Router + MUI + Auth0 + Mongoose，重构为 App Router + Tailwind + JWT + Prisma，API 风格完全不同。只从现有项目读取**业务逻辑**（评分公式、i18n 翻译文本）。
2. **参考 `reference/ielts-reading-mock-test/` 的 IELTS 类型定义和评分逻辑**，它们是精心设计的、经过测试的。
3. **参考 `reference/rbac-boilerplate/` 的项目骨架**，包括 ESLint/Biome 配置、tsconfig、中间件模式、Prisma 使用方式。
4. **所有 API 响应使用统一格式**：`{ success: boolean, data?: any, error?: string, message?: string }`
5. **所有前端表单使用 React Hook Form + Zod** 进行校验。
6. **考试界面必须全屏模式**，隐藏浏览器导航栏（使用 Fullscreen API）。
7. **本地开发**：`npm run dev:backend` (port 3001) + `npm run dev:frontend` (port 3000)。

---

> **此文件由项目策划阶段生成，后续开发请严格遵循此文件中的路径、命名和架构约定。**
