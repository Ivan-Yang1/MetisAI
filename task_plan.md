# Project Plan

## Goals & Objectives
构建一个通过自然语言生成代码项目的AI Agent应用平台，类似于atoms.dev。

## Scope & Boundaries
- **包含**：AI Agent交互界面、代码生成引擎、项目管理功能、用户系统、数据库存储
- **排除**：高级代码审查功能、多语言支持（初始版本）

## Phases & Progress

| Phase | Status | Description |
|-------|--------|-------------|
| 1. 基础设施搭建 | `completed` | 创建项目结构，安装依赖，配置环境变量，检查Git仓库状态 |
| 2. 数据库与认证 | `completed` | 在Supabase控制台手动创建项目，配置认证，执行SQL迁移 |
| 3. 核心API开发 | `completed` | 开发基础API路由，实现数据库操作，配置认证中间件 |
| 4. 前端核心功能 | `completed` | 创建登录页面，仪表盘，基础项目管理功能 |
| 5. AI功能集成 | `completed` | 配置MetaGPT，封装API，实现AI对话界面 |
| 6. 沙箱与预览 | `pending` | 集成Sandpack，实现沙箱预览界面 |
| 7. 核心功能验证 | `pending` | 配置Vercel，执行核心功能测试 |
| 8. 优化提升阶段 | `pending` | 性能优化，用户体验改进，高级功能增强 |
| 9. 最终验证与交付 | `pending` | 最终功能测试，错误处理，文档更新 |

## Detailed Tasks

> Note: 每个任务完成后，必须按照claude.md中的工作流程执行Git提交操作，包括检查Git状态、添加更改、提交更改并推送到远程仓库。

### Phase 1: 基础设施搭建
| Task | Status | Description | Time Estimate |
|------|--------|-------------|---------------|
| 1.1 创建Next.js项目 | `completed` | 使用`npx create-next-app`创建项目，配置TypeScript和Tailwind CSS | 1 hour |
| 1.2 安装依赖 | `completed` | 安装必要的依赖包（Supabase, Zustand, 等） | 1 hour |
| 1.3 配置环境变量 | `completed` | 创建.env.local文件，配置基础环境变量 | 30 minutes |
| 1.4 项目结构搭建 | `completed` | 创建合理的项目目录结构，配置基础文件 | 1.5 hours |
| 1.5 初始化Git仓库 | `completed` | 检查Git仓库初始化状态，创建.gitignore文件，检查连接GitHub远程仓库状态 | 30 minutes |

### Phase 2: 数据库与认证
| Task | Status | Description | Time Estimate |
|------|--------|-------------|---------------|
| 2.1 创建Supabase项目 | `completed` | 在Supabase控制台手动创建项目，配置数据库 | 30 minutes |
| 2.2 设计数据模型 | `completed` | 设计用户、项目、文件、对话等核心数据模型 | 1.5 hours |
| 2.3 执行SQL迁移 | `completed` | 编写SQL迁移脚本，创建表结构和关系（已修复类型转换问题） | 2 hours |
| 2.4 配置认证 | `completed` | 在Supabase控制台手动配置认证，设置JWT密钥和RLS策略 | 1 hour |

### Phase 3: 核心API开发
| Task | Status | Description | Time Estimate |
|------|--------|-------------|---------------|
| 3.1 开发API路由 | `completed` | 创建Next.js API Routes，实现基础路由结构 | 1.5 hours |
| 3.2 数据库操作 | `completed` | 实现数据库CRUD操作，处理数据持久化 | 2.5 hours |
| 3.3 认证中间件 | `completed` | 实现用户认证和权限控制中间件 | 1.5 hours |
| 3.4 API文档 | `completed` | 创建API文档，为前端开发提供参考 | 1 hour |

### Phase 4: 前端核心功能
| Task | Status | Description | Time Estimate |
|------|--------|-------------|---------------|
| 4.1 创建登录页面 | `completed` | 实现用户登录和注册功能 | 1.5 hours |
| 4.2 创建仪表盘 | `completed` | 实现项目列表和管理功能 | 2 hours |
| 4.3 项目详情页面 | `completed` | 实现项目详情和文件管理功能 | 2 hours |
| 4.4 基础UI组件 | `completed` | 创建可复用的UI组件库（Button、Input、Card、Label） | 1.5 hours |

### Phase 5: AI功能集成
| Task | Status | Description | Time Estimate |
|------|--------|-------------|---------------|
| 5.1 配置MetaGPT | `completed` | 安装MetaGPT（使用pip install metagpt），初始化配置文件（metagpt --init-config），配置API密钥和环境变量 | 2 hours |
| 5.2 封装MetaGPT API | `completed` | 创建MetaGPT集成层，使用generate_repo函数封装API调用，支持代码生成和文件结构输出，为沙箱同步提供数据支持 | 2.5 hours |
| 5.3 AI对话界面 | `completed` | 实现左侧AI对话界面，支持自然语言输入，将用户输入传递给MetaGPT | 2.5 hours |
| 5.4 智能体管理 | `completed` | 实现智能体选择和管理功能，基于MetaGPT的Role和Action组件 | 1 hour |

### Phase 6: 沙箱与预览
| Task | Status | Description | Time Estimate |
|------|--------|-------------|---------------|
| 6.1 集成Sandpack | `pending` | 安装和配置Sandpack库 | 1 hour |
| 6.2 沙箱预览界面 | `pending` | 实现右侧沙箱预览界面 | 2.5 hours |
| 6.3 文件同步 | `pending` | 实现MetaGPT生成代码到Sandpack沙箱的实时同步机制，包括文件结构更新和代码内容同步 | 2 hours |
| 6.4 MetaGPT-沙箱集成 | `pending` | 实现MetaGPT生成代码到沙箱的自动同步机制 | 2 hours |
| 6.5 代码反馈循环 | `pending` | 实现沙箱代码修改后反馈给MetaGPT的机制 | 1.5 hours |

### Phase 7: 核心功能验证
| Task | Status | Description | Time Estimate |
|------|--------|-------------|---------------|
| 7.1 配置Vercel | `pending` | 在Vercel创建项目，配置环境变量 | 1 hour |
| 7.2 核心功能测试 | `pending` | 测试核心功能是否正常运行 | 2 hours |
| 7.3 集成测试 | `pending` | 测试MetaGPT生成代码到沙箱同步的完整流程 | 1.5 hours |

### Phase 8: 优化提升阶段
| Task | Status | Description | Time Estimate |
|------|--------|-------------|---------------|
| 8.1 性能优化 | `pending` | 优化前端性能，减少加载时间 | 1.5 hours |
| 8.2 交互优化 | `pending` | 优化沙箱界面的用户体验 | 1.5 hours |
| 8.3 自动化测试 | `pending` | 实现自动化测试，持续运行 | 2 hours |
| 8.4 高级功能增强 | `pending` | 增强智能体管理功能，添加更多智能体类型 | 2 hours |
| 8.5 响应式设计 | `pending` | 优化移动端适配，提升跨设备体验 | 1 hour |

### Phase 9: 最终验证与交付
| Task | Status | Description | Time Estimate |
|------|--------|-------------|---------------|
| 9.1 最终功能测试 | `pending` | 执行完整的功能测试，确保所有功能正常 | 2 hours |
| 9.2 错误处理 | `pending` | 完善错误处理机制，提高系统稳定性 | 1.5 hours |
| 9.3 文档更新 | `pending` | 更新README文档，编写使用指南 | 1 hour |
| 9.4 准备演示 | `pending` | 准备项目演示，记录已知问题和限制 | 1 hour |










## Key Decisions
| Decision | Context | Outcome |
|----------|---------|---------|
| 使用MetaGPT框架 | 需要一个强大的AI Agent框架来处理自然语言到代码的生成 | 选择MetaGPT作为核心框架 |
| 使用Supabase | 需要一个易于使用的数据库和认证系统 | 选择Supabase作为后端数据库 |
| 前端托管在Vercel | 需要一个快速、易用的前端部署平台 | 选择Vercel作为前端托管服务 |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| [Error 1] | [What did we try?] | [How was it fixed?] |

## Files Created/Modified
| File | Purpose |
|------|---------|
| [File 1] | [What does it do?] |