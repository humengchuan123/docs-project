<!--
 * @Author: humengchuan 531537052@qq.com
 * @Date: 2026-03-25 11:02:37
 * @LastEditors: HuMeng 531537052@qq.com
 * @LastEditTime: 2026-05-13 14:13:34
 * @FilePath: \work-tool\docs-vitepress\src\ai-tool\index.md
 * @Description:
-->

# OpenCode 使用教程

## 简介

OpenCode 是一个强大的 AI 辅助开发工具，能够帮助开发者提高编码效率，提供智能代码补全、代码生成、代码优化等功能。本教程将指导您完成 OpenCode 的安装、配置和使用。

## 快速开始

### 环境要求

- **操作系统**：Windows、macOS 或 Linux
- **Node.js**：Node.js 14.0 或更高版本
- **终端**：PowerShell（Windows）、Terminal（macOS）或 Bash（Linux）

### 安装步骤

#### 1. 全局安装 OpenCode

打开终端，执行以下命令：

```bash
npm i -g opencode-ai
```

**安装说明**：

- `-g` 参数表示全局安装，使 `opencode` 命令在系统任何位置都可用
- 安装过程可能需要几分钟，取决于网络速度
- 如果遇到权限问题，在 Windows 上可能需要以管理员身份运行 PowerShell

#### 2. 验证安装

安装完成后，验证 OpenCode 是否正确安装：

```bash
opencode --version


```

如果显示版本号，说明安装成功。

#### 3. 启动 OpenCode

在 PowerShell 中输入以下命令启动 OpenCode：

```bash
opencode


```

### 启动后接入其他模型

Ctrl + P => Switch model => 进入搜索界面 Ctrl + a 输入模型名称 => 选择模型供应商 复制api key => 选择模型 => 测试使用

vscode + opencode

文件夹/ code . => 打开vscode => vscode ctrl+ ~打开终端， 输入opencode

opencode init（在 TUI 中为 /init 命令）会扫描你的项目，分析其结构、依赖和约定，然后生成一个 AGENTS.md 文件。这样，在未来的会话中，OpenCode 会自动读取这些项目级别的指令（如构建命令、代码规范、架构信息等），无需每次都重复说明。建议将生成的 AGENTS.md 提交到 Git 仓库中。

opencode go 订阅模型
https://opencode.ai/workspace/wrk_01KR03DCT2GDF10APX4CNRP4RW/go
选择opencode go 模型 => 打开opencode => 切换模型 => 搜索opencode => 填写秘钥 => 测试使用

## 主要功能

### 1. 智能代码补全

OpenCode 能够根据上下文智能补全代码，提高编码速度。

**使用方法**：

- 在编辑器中编写代码时，OpenCode 会自动提示可能的补全选项
- 使用 `Tab` 键接受建议
- 使用 `Esc` 键关闭建议

**示例**：

```javascript
// 输入以下代码时，OpenCode 会自动补全
function calculateSum(a, b) {
  return a + b;
}

// OpenCode 会自动添加分号
function calculateSum(a, b) {
  return a + b;
}
```

### 2. 代码生成

OpenCode 可以根据自然语言描述生成代码。

**使用方法**：

- 在编辑器中输入注释或描述
- OpenCode 会根据描述生成相应的代码

**示例**：

```javascript
// 创建一个函数来计算数组的平均值
function calculateAverage(arr) {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, val) => acc + val, 0);
  return sum / arr.length;
}
```

### 3. 代码优化

OpenCode 可以分析代码并提供优化建议。

**使用方法**：

- 选中需要优化的代码
- 使用快捷键触发优化功能
- 根据建议选择是否应用优化

**示例**：

```javascript
// 优化前
function findUser(users, id) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      return users[i];
    }
  }
  return null;
}

// 优化后
function findUser(users, id) {
  return users.find((user) => user.id === id) || null;
}
```

### 4. 错误检测与修复

OpenCode 能够实时检测代码错误并提供修复建议。

**使用方法**：

- 编写代码时，OpenCode 会自动检测错误
- 错误信息会显示在编辑器中
- 点击错误信息查看修复建议

## 使用示例

### 示例 1：创建 REST API

```javascript
// 使用 OpenCode 创建一个简单的 Express 路由
const express = require("express");
const app = express();

app.get("/api/users", (req, res) => {
  res.json([
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
  ]);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### 示例 2：数据库操作

```javascript
// 使用 OpenCode 生成数据库查询代码
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mydb",
  password: "password",
  port: 5432,
});

async function getUsers() {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
}
```

### 示例 3：前端组件

```javascript
// 使用 OpenCode 生成 React 组件
import React from "react";

function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>{user.bio}</p>
    </div>
  );
}

export default UserProfile;
```

## 高级功能

### 1. 自定义配置

OpenCode 支持通过配置文件自定义行为。

**配置文件位置**：

- Windows: `%USERPROFILE%\.opencode\config.json`
- macOS/Linux: `~/.opencode/config.json`

**配置示例**：

```json
{
  "language": "javascript",
  "theme": "dark",
  "autoComplete": true,
  "codeOptimization": true,
  "errorDetection": true
}
```

### 2. 插件系统

OpenCode 支持插件扩展功能。

**安装插件**：

```bash
opencode plugin install <plugin-name>
```

**常用插件**：

- `opencode-plugin-react`：React 开发支持
- `opencode-plugin-vue`：Vue 开发支持
- `opencode-plugin-python`：Python 开发支持

### 3. 团队协作

OpenCode 支持团队配置共享和代码规范统一。

**共享配置**：

```bash
opencode config export team-config.json
opencode config import team-config.json
```

## 故障排除

### 问题 1：安装失败

**症状**：执行 `npm i -g opencode-ai` 时报错

**可能原因**：

- 网络连接问题
- npm 版本过低
- 权限不足

**解决方案**：

```bash
# 检查 npm 版本
npm --version

# 升级 npm
npm install -g npm@latest

# 使用国内镜像源
npm config set registry https://registry.npmmirror.com

# 重新安装
npm i -g opencode-ai
```

### 问题 2：命令无法识别

**症状**：输入 `opencode` 提示"不是内部或外部命令"

**可能原因**：

- 全局安装路径未添加到系统 PATH
- 安装未成功

**解决方案**：

**Windows**：

```powershell
# 查找安装路径
where opencode

# 手动添加到 PATH（假设路径为 C:\Users\YourName\AppData\Roaming\npm）
$env:Path += ";C:\Users\YourName\AppData\Roaming\npm"
```

**macOS/Linux**：

```bash
# 查找安装路径
which opencode

# 添加到 ~/.bashrc 或 ~/.zshrc
export PATH="$PATH:/path/to/npm/bin"
```

### 问题 3：启动失败

**症状**：输入 `opencode` 后无响应或报错

**可能原因**：

- 端口被占用
- 配置文件错误
- 系统资源不足

**解决方案**：

```bash
# 检查端口占用
netstat -ano | findstr :3000

# 重置配置
opencode config reset

# 查看详细日志
opencode --verbose
```

### 问题 4：代码补全不工作

**症状**：OpenCode 不提供代码补全建议

**可能原因**：

- 自动补全功能被禁用
- 编辑器不支持
- 文件类型不支持

**解决方案**：

```bash
# 检查配置
opencode config get autoComplete

# 启用自动补全
opencode config set autoComplete true

# 重启 OpenCode
opencode restart
```

## 常见问题 (FAQ)

### Q1: OpenCode 支持哪些编程语言？

**A**: OpenCode 支持多种编程语言，包括：

- JavaScript/TypeScript
- Python
- Java
- C/C++
- Go
- Rust
- PHP
- Ruby
- Swift
- Kotlin

### Q2: OpenCode 是免费的吗？

**A**: OpenCode 提供免费版本和付费版本。免费版本包含基本功能，付费版本提供更多高级功能和更好的性能。

### Q3: 如何更新 OpenCode？

**A**: 使用以下命令更新 OpenCode：

```bash
npm update -g opencode-ai
```

### Q4: OpenCode 会上传我的代码吗？

**A**: OpenCode 默认不会上传代码。所有处理都在本地进行。如果使用云端功能，需要明确授权。

### Q5: 如何卸载 OpenCode？

**A**: 使用以下命令卸载：

```bash
npm uninstall -g opencode-ai
```

### Q6: OpenCode 支持哪些编辑器？

**A**: OpenCode 支持主流编辑器和 IDE：

- VS Code
- WebStorm
- Sublime Text
- Atom
- Vim/Neovim
- Emacs

## 最佳实践

### 1. 代码规范

- 遵循项目代码规范
- 使用一致的命名约定
- 添加适当的注释
- 保持代码简洁清晰

### 2. 安全考虑

- 不要在代码中硬编码敏感信息
- 使用环境变量存储配置
- 定期更新 OpenCode
- 审查生成的代码

### 3. 性能优化

- 合理使用代码生成功能
- 避免过度依赖自动补全
- 定期清理缓存
- 关闭不需要的功能

### 4. 团队协作

- 共享配置文件
- 统一代码风格
- 建立代码审查流程
- 记录使用经验

## 参考资源

- [OpenCode 官方文档](https://opencode.ai/docs)
- [OpenCode GitHub 仓库](https://github.com/opencode/opencode)
- [OpenCode 社区论坛](https://community.opencode.ai)
- [OpenCode API 文档](https://api.opencode.ai)

## 版本历史

### v1.0.0 (2024-01-01)

- 初始版本发布
- 支持基础代码补全
- 支持代码生成
- 支持错误检测

### v1.1.0 (2024-02-15)

- 新增代码优化功能
- 改进自动补全算法
- 支持更多编程语言
- 性能优化

### v1.2.0 (2024-03-20)

- 新增插件系统
- 支持团队协作
- 改进用户界面
- 修复已知问题
