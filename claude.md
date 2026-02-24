# MetisAI - Project Instructions

## Project Context

MetisAI - 一个AI智能助手网页应用，可以通过自然语言生成完整的代码项目

> Note: 项目详细需求将在 task_plan.md 中定义和更新。

---

## MANDATORY: Agent Workflow

每个新的 agent 会话必须遵循此工作流程：

### Step 1: 了解项目状态

首先阅读以下文件以了解项目当前状态：

1. **task_plan.md** - 查看任务计划和当前进度
2. **progress.md** - 查看历史开发进度
3. **findings.md** - 查看技术研究记录

### Step 2: 选择下一个任务

从 `task_plan.md` 中选择一个任务来处理。

选择标准（按优先级排序）：
1. 选择未完成的任务（标记为 `- [ ]`）
2. 考虑依赖关系 - 基础功能应该优先完成
3. 选择优先级最高的未完成任务

### Step 3: 实现任务

- 仔细阅读任务描述
- 实现功能以满足所有要求
- 遵循现有的代码模式和约定

### Step 4: 测试验证

实现后，验证任务的所有步骤：

**强制测试要求（Testing Requirements - MANDATORY）：**

1. **大幅度页面修改**（新建页面、重写组件、修改核心交互）：
   - **必须在浏览器中测试！**
   - 验证页面能正确加载和渲染
   - 验证表单提交、按钮点击等交互功能
   - 截图确认 UI 正确显示

2. **小幅度代码修改**（修复 bug、调整样式、添加辅助函数）：
   - 可以使用单元测试或 lint/build 验证
   - 如有疑虑，仍建议浏览器测试

3. **所有修改必须通过**：
   - 代码没有语法错误
   - 功能正常工作
   - 符合项目规范

**测试清单：**
- [ ] 代码没有错误
- [ ] 功能正常工作
- [ ] 对于 UI 相关修改，在浏览器中验证

### Step 5: 更新进度

在 `progress.md` 中记录你的工作：

```
### [Date] - Task: [任务描述]

#### 完成的工作：
- [具体完成的修改]

#### 测试：
- [如何测试的]

#### 备注：
- [任何相关的备注供后续 agent 参考]
```

同时在 `task_plan.md` 中：
- 将完成的任务标记为 `- [x]`
- 更新 "Progress Tracking" 部分的进度统计

### Step 6: 提交更改到 Git

**IMPORTANT: 所有相关的更改应该在同一个 commit 中提交！**

流程：
1. 更新 `task_plan.md`，标记任务为完成
2. 更新 `progress.md` 记录工作内容
3. 如有新的研究发现，更新 `findings.md`
4. 执行 git 操作提交更改：

```bash
git add .
git commit -m "[任务描述] - completed"
```

5. **推送到远程仓库**（如果已配置 GitHub）：

```bash
git push origin master
```

**规则：**
- 只有在所有步骤都验证通过后才标记任务为完成
- 永远不要删除或修改任务描述
- 永远不要从列表中移除任务
- 一个任务的所有内容（代码、progress.md、task_plan.md、findings.md）应该在同一个 commit 中提交
- **每个任务完成后必须推送到远程仓库**，确保代码安全备份

**Mandatory Git 操作要求：**

每个任务完成后，AI Agent **必须**执行以下操作：

1. **检查 Git 状态**：
```bash
git status
```

2. **添加所有更改**：
```bash
git add .
```

3. **提交更改**（使用有意义的 commit message）：
```bash
git commit -m "[Phase X.X] [任务名称] - 完成实现和测试"
```

4. **推送到远程仓库**：
```bash
git push origin master
```

**如果远程仓库未配置**：
- 在 `progress.md` 中记录已完成的工作
- 提示用户配置 GitHub 远程仓库
- 不要假设远程仓库已存在

---

## ⚠️ 阻塞处理（Blocking Issues）

**禁止Mock任何内容，如果任务无法完成测试或需要人工介入，必须遵循以下规则：**

### 需要停止任务并请求人工帮助的情况：

1. **缺少环境配置**：
   - .env 文件需要填写真实的 API 密钥
   - 数据库需要创建和配置
   - 外部服务需要开通账号

2. **外部依赖不可用**：
   - 第三方 API 服务宕机
   - 需要人工授权的 OAuth 流程
   - 需要付费升级的服务

3. **测试无法进行**：
   - 功能依赖外部系统尚未部署
   - 需要特定硬件环境

### 阻塞时的正确操作：

**DO NOT（禁止）：**
- ❌ 提交 git commit
- ❌ 将任务标记为完成
- ❌ 假装任务已完成

**DO（必须）：**
- ✅ 在 progress.md 中记录当前进度和阻塞原因
- ✅ 输出清晰的阻塞信息，说明需要人工做什么
- ✅ 停止任务，等待人工介入

### 阻塞信息格式：

```
🚫 任务阻塞 - 需要人工介入

**当前任务**: [任务名称]

**已完成的工作**:
- [已完成的代码/配置]

**阻塞原因**:
- [具体说明为什么无法继续]

**需要人工帮助**:
1. [具体的步骤 1]
2. [具体的步骤 2]
...

**解除阻塞后**:
- [继续任务的步骤]
```

---

## Project Structure

```
/
├── CLAUDE.md          # 本文件 - 工作流程说明
├── task_plan.md       # 任务计划（任务定义）
├── progress.md        # 每个会话的进度日志
├── findings.md        # 技术研究和发现记录
└── APP/     # 应用代码
```

## Coding Conventions

- 根据选择的技术栈遵循相应规范
- 使用 TypeScript/Python 类型系统
- 编写清晰、可维护的代码
- 为新功能编写测试

---

## Key Rules

1. **One task per session** - 专注于完成一个任务
2. **Test before marking complete** - 所有步骤必须通过
3. **Browser testing for UI changes** - 新建或大幅修改页面必须用playwrightMCP在浏览器测试
4. **Document in progress.md** - 帮助后续 agent 理解你的工作
5. **One commit per task** - 所有更改（代码、progress.md、task_plan.md、findings.md）必须在同一个 commit 中提交
6. **Never remove tasks** - 只将未完成任务标记为完成
7. **Stop if blocked** - 需要人工介入时，不要提交，输出阻塞信息并停止

---

## 技术栈选择

项目已确定以下技术栈：

### 前端选项
- Next.js 14+：前端/后端框架，同构应用，内置API Routes，部署简单
- React 18+：UI库，生态成熟，组件化开发
- Tailwind CSS 4.0+：样式框架，开发效率高，响应式设计
- Sandpack：前端沙箱，实时预览，热更新，集成简单

### 后端选项
- Next.js API Routes：处理前端请求，集成MetaGPT
- Supabase：数据库/认证，开源PostgreSQL，内置认证，配置简单
- Vercel：部署平台，与Next.js深度集成，自动部署

### AI 集成
- MetaGPT：AI框架，多智能体协作，全流程自动化
- OpenAI API：LLM，强大的语言理解和生成能力

### 可选技术栈（后续优化）
- Socket.io：实时通信，支持智能体对话的实时更新
- Monaco Editor：代码编辑器，VS Code同款编辑器，功能强大
- Xterm.js：终端模拟器，提供真实的命令行体验
- Docker：沙箱服务，完整的隔离环境，支持更多技术栈
- Redis：缓存系统，提高API响应速度，减少重复计算

