# 博客项目介绍

这是一个基于Next.js构建的现代化博客系统，支持Markdown文章编写、实时预览、主题切换以及AI聊天功能。系统采用了最新的前端技术栈，提供了良好的用户体验和开发体验。

## 🚀 主要功能

- ✨ 响应式博客页面，支持桌面端和移动端
- 📝 Markdown文章支持，包括代码高亮、图片展示等
- 🌓 深色/浅色主题切换，自动跟随系统设置
- 💬 AI聊天功能，支持流式响应
- 🏎️ 性能优化，包括组件懒加载、图片优化和数据缓存
- 🎨 优雅的UI设计，基于Tailwind CSS和自定义组件
- 📊 博客文章列表，支持骨架屏加载状态

## 🛠️ 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式系统**: Tailwind CSS + shadcn/ui
- **Markdown解析**: React-Markdown
- **AI集成**: @google/genai
- **构建工具**: TypeScript
- **代码高亮**: rehype-highlight

## 📦 快速开始

### 前提条件

确保您的环境中已安装以下软件：
- Node.js (v18+) 
- npm (v9+) 或 yarn/pnpm

### 安装步骤

1. 克隆项目代码

```bash
# 克隆仓库
git clone <仓库地址>
cd blog
```

2. 安装依赖

```bash
# 使用npm
npm install

# 或使用yarn
# yarn install

# 或使用pnpm
# pnpm install
```

3. 本地开发

```bash
npm run dev
```

项目将在 http://localhost:3000 启动开发服务器

4. 构建生产版本

```bash
npm run build
npm run start
```

## 📁 目录结构

```
blog/
├── src/
│   ├── app/              # Next.js App Router目录
│   │   ├── chat/         # 聊天功能页面
│   │   ├── [name]/       # 博客文章详情页
│   │   ├── layout.tsx    # 全局布局
│   │   └── page.tsx      # 主页（博客列表）
│   ├── components/       # 通用组件
│   │   ├── header.tsx    # 头部导航组件
│   │   ├── blog-list.tsx # 博客列表组件
│   │   ├── md-components.tsx # Markdown渲染组件
│   │   └── theme-mode-toggle.tsx # 主题切换组件
│   ├── actions/          # 服务端操作
│   │   └── blog/         # 博客相关操作
│── content/          # 内容目录
│   └── mds/          # Markdown文章存储
├── public/               # 静态资源
├── next.config.js        # Next.js配置
├── package.json          # 项目依赖
└── tsconfig.json         # TypeScript配置
```

## ✏️ 如何修改博客内容

### 添加新的博客文章

1. 在 `content/mds/` 目录下创建新的Markdown文件
2. 在 content/mds 中创建 格式的 Markdown 文件[$name]-[$time].md

```markdown
```
4. 保存文件后，新文章会自动显示在博客列表中

### 修改现有博客文章

直接编辑 `content/mds/` 目录下对应的Markdown文件即可，修改会实时反映在博客页面上。

## 🎨 如何自定义样式和组件

### 修改全局样式

1. 全局样式文件位于 `src/app/globals.css`
2. 可以在这里添加自定义的Tailwind工具类、动画效果或基础样式

### 修改页面布局

1. 全局布局文件位于 `src/app/layout.tsx`
2. 可以修改这里的HTML结构、添加全局组件或修改元数据

### 添加或修改组件

1. 组件文件位于 `src/components/` 目录下
2. 可以创建新的组件文件或修改现有的组件
3. 组件样式通过Tailwind类或内联样式实现

## 🔧 常用开发命令

```bash
npm run dev       # 启动开发服务器
npm run build     # 构建生产版本
npm run start     # 运行生产版本
npm run lint      # 运行代码检查
```

## 🚀 性能优化

本项目已实现多项性能优化措施：

1. **组件懒加载** - 只在需要时加载组件
2. **数据缓存** - 博客列表和文章内容使用内存缓存减少重复读取
3. **图片优化** - 自动优化静态图片资源
4. **骨架屏** - 加载状态下显示骨架屏提升用户体验
5. **响应式设计** - 适配不同屏幕尺寸的设备

## 📝 注意事项

1. 请确保所有Markdown文件都遵循正确的格式
2. 静态资源应放在 `public/` 目录下
3. 开发前请先安装依赖
4. 提交代码前请运行代码检查

## 🔮 未来计划

- 文章分类和标签系统
- 评论功能
- 阅读统计
- 文章搜索功能
- 更多AI集成功能

---

希望这个博客系统能满足您的需求！如有任何问题或建议，请随时提出。