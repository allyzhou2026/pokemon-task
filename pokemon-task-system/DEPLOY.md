# 宝可梦任务系统 - 部署指南

## 方案一：Vercel 部署（推荐，免费稳定）

### 步骤 1：准备 GitHub 仓库

1. 在 GitHub 创建新仓库（如 `pokemon-task-system`）
2. 将代码推送到 GitHub：

```bash
cd /workspace/pokemon-task-system
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/pokemon-task-system.git
git push -u origin main
```

### 步骤 2：部署到 Vercel

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 "Add New" → "Project"
4. 选择你的 GitHub 仓库
5. 点击 "Deploy"
6. 等待部署完成，获得永久访问链接

部署后你会得到一个类似 `https://pokemon-task-system.vercel.app` 的链接，可以在任何设备上访问。

---

## 方案二：本地部署 + 内网穿透

如果不想用云服务，可以用内网穿透工具：

### 使用 Cloudflare Tunnel（免费）

1. 下载 cloudflared：https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

2. 运行本地服务：
```bash
cd /workspace/pokemon-task-system
npm run build
npx serve -s dist -p 3000
```

3. 创建隧道：
```bash
cloudflared tunnel --url http://localhost:3000
```

会生成一个类似 `https://xxx.trycloudflare.com` 的链接。

---

## 数据同步说明

当前版本使用 LocalStorage 存储数据，数据存在浏览器本地。要实现多设备数据同步，需要：

### 方案 A：使用 Firebase（已集成，需配置）

1. 创建 Firebase 项目：https://console.firebase.google.com
2. 启用 Authentication 和 Firestore
3. 修改 `src/lib/firebase.ts`：

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "你的API_KEY",
  authDomain: "你的项目.firebaseapp.com",
  projectId: "你的项目ID",
  storageBucket: "你的项目.appspot.com",
  messagingSenderId: "你的发送者ID",
  appId: "你的应用ID"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const isMockMode = false;
```

### 方案 B：使用 Supabase（免费额度大）

1. 创建 Supabase 项目：https://supabase.com
2. 创建表结构
3. 集成 Supabase SDK

---

## 快速开始（推荐）

最简单的方式：

1. **部署到 Vercel** → 获得稳定公网链接
2. **每个家庭成员用同一账号登录** → 数据通过 LocalStorage 在各自设备上
3. 如果需要真正的数据同步 → 配置 Firebase

这样你可以：
- ✅ 在手机、平板、电脑上都能访问
- ✅ 链接稳定，不会变化
- ✅ 无需购买服务器
- ✅ 完全免费
