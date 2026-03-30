# 宝可梦任务系统 🎮

一个专为儿童设计的任务积分兑换系统，通过完成任务收集宝可梦！

## 功能特点

- **双端设计**：家长端布置任务，孩子端完成任务
- **精灵球收集**：每完成一个主题的所有任务，获得一个精灵球
- **周五特殊精灵**：周五有机会获得皮卡丘、小火龙、杰尼龟等热门精灵
- **番茄钟计时**：帮助孩子专注完成任务
- **中文界面**：所有宝可梦名称、属性、描述均为中文

## 快速部署到 Vercel

### 方法一：一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/pokemon-task-system)

### 方法二：手动部署

1. **Fork 或 Clone 本项目到 GitHub**

2. **登录 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录

3. **导入项目**
   - 点击 "Add New" → "Project"
   - 选择你 fork 的仓库
   - 点击 "Deploy"

4. **获取链接**
   - 部署完成后获得 `https://你的项目名.vercel.app`
   - 可以在任何设备上访问

## 本地运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build
```

## 使用说明

### 家长端
1. 选择"家长端"进入
2. 在"周总览"查看任务完成情况
3. 在"布置任务"添加新任务
4. 在"主题管理"创建不同科目的主题

### 孩子端
1. 选择"宝贝端"进入
2. 点击任务开始番茄钟计时
3. 完成后等待家长检查
4. 检查通过后领取精灵球
5. 在"收集精灵"查看所有宝可梦
6. 在"成就"查看统计数据

## 技术栈

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- LocalStorage（本地存储）

## 许可证

MIT
