<!--
 * @Author: HuMeng 531537052@qq.com
 * @Date: 2026-04-29 12:19:58
 * @LastEditors: HuMeng 531537052@qq.com
 * @LastEditTime: 2026-05-06 15:55:44
 * @FilePath: \work-tool\docs-vitepress\src\ai-tool\vibe coding--database.md
 * @Description: vibe coding 数据库配置
-->

### vibe coding 数据库配置篇

代码上传至 GitHub 后，可通过 Vercel 或 GitHub Pages 快速部署（访问需魔法上网）。Vercel 引入项目后，后续提交会自动部署；也可在 Deployments 列表中点击最后一次部署，展开后选择 Redeploy 手动重新部署。

- **前端项目**：部署后需留意 API 接口地址，不能直接使用本地接口，需通过环境变量配置接口地址
- **后端项目**：在 Vercel 上部署时，需在 Vercel 平台配置环境变量（非本地配置），数据库需使用在线服务商提供的数据库：Supabase、MongoDB Atlas

#### MongoDB Atlas 配置

**Step 1**：登录账号（Google 邮箱或 GitHub 账号）

**Step 2**：获取连接字符串，配置环境变量 `MONGODB_URI`

路径：Project → DATABASE → Clusters → Connect → Drivers，查看连接字符串：

```
mongodb+srv://用户名:密码@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Step 3**：添加 IP 白名单

路径：Project → SECURITY → Network Access，选择以下任一方式：

- **Allow Access from Anywhere**（`0.0.0.0/0`）— 最简单，允许所有 IP 访问
- **Add Current IP Address** — 仅允许当前 IP 访问（推荐）

![MongoDB Atlas Network Access](image.png)

#### Supabase 配置

Connect点击弹窗中有相关信息
supabase

Framework模式
step 1:选择对应的框架

step 2: npm install @supabase/supabase-js 对应的库

step 3: 配置环境变量
Add files
Copy the following code into your project.

Direct(Connection string)---
Direct connection
Transaction pooler url直连模式
Session pooler

url链接：postgresql://postgres:[YOUR-PASSWORD]@db.[your-project-ref].supabase.co:5432/postgres

tips：数据库连接字符串中的 YOUR-PASSWORD 字段值，即数据库密码，仅在创建项目时设置一次，创建后无法直接查看（出于安全设计）。若未妥善保存，必须通过控制台重置密码
选择目标项目---点击左侧菜单 Project Settings → Database。
在 Database password 区域点击 Reset password 按钮

Direct Connection（直连模式）
适用场景：仅限 IPv6 网络环境（如部分海外云服务），免费计划下不支持 IPv4。
端口：5432

Transaction Pooler（事务连接池模式）IPv4 环境
适用场景：无服务器函数（Serverless）、边缘计算等短连接场景（如 Vercel、Netlify 部署的应用）。
端口：6543

Session pooler  
Supabase 提供的 IPv4 兼容连接模式，本质是 Supabase 官方维护的代理服务，用于解决免费计划下 Direct Connection 仅支持 IPv6 的限制。它并非传统意义上的连接池，而是通过代理层将 IPv4 请求转发至实际数据库（IPv6），同时保持与直连模式几乎一致的会话行为。

##### supabase本地部署

https://supabase.com/docs/guides/self-hosting

https://supabase.com/docs/guides/self-hosting/docker

通过docker-compose部署supabase数据库
![alt text](image-1.png)

```bash

# Get the code
git clone --depth 1 https://github.com/supabase/supabase

# Make your new supabase project directory
mkdir supabase-project

# Tree should look like this
# .
# ├── supabase
# └── supabase-project

# Copy the compose files over to your project
cp -rf supabase/docker/* supabase-project

# Copy the fake env vars
cp supabase/docker/.env.example supabase-project/.env

# Switch to your project directory
cd supabase-project

# Pull the latest images
docker compose pull

```

## Studio 认证配置详解

### 访问地址

默认通过 API 网关的 **8000 端口**访问 Supabase Studio（管理面板）：

- 本地访问：`http://localhost:8000`
- 远程访问：`http://<你的IP>:8000`

### 认证方式

Supabase Studio 使用 **HTTP Basic Authentication**（HTTP 基本认证）保护访问，浏览器会弹出登录框要求输入用户名和密码。

### 密码设置规则

在 `.env` 文件中配置以下变量：

| 配置项 | 是否必须 | 说明 |
|--------|---------|------|
| `DASHBOARD_PASSWORD` | ✅ 必须 | Studio 登录密码 |
| `DASHBOARD_USERNAME` | 可选 | 自定义用户名 |

**密码要求：**
- 必须包含至少一个字母
- 不能只用数字
- 不能包含特殊字符

**示例配置（`.env` 文件）：**

```bash
# Studio 认证配置
DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD=MySecurePass2024
```

### 操作流程

```
1. 编辑 .env 文件，设置 DASHBOARD_PASSWORD
2. 启动服务：docker compose up -d
3. 浏览器打开 http://localhost:8000
4. 输入用户名和密码，进入管理面板
```

> **注意：** `DASHBOARD_PASSWORD` 是用于登录 Supabase Studio 可视化管理界面的密码，与应用程序连接数据库的密码是不同的配置项。
