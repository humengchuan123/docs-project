# 前端面试题精选（161题）

> 本文档收录了161道前端高频面试题，涵盖JavaScript、CSS、HTTP、工程化、性能优化、框架等多个领域。每道题均标注了热度值，热度越高代表考察频率越高。�?

---

## 一、性能监控与统�?

### 1. 统计前端请求耗时 [热度:609]

\*_解析�?_
可以使用 Performance API �?XMLHttpRequest/Fetch 拦截来统计请求耗时�?

```javascript
// 方法1：使�?Performance API
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (
      entry.initiatorType === "xmlhttprequest" ||
      entry.initiatorType === "fetch"
    ) {
      console.log(`请求: ${entry.name}, 耗时: ${entry.duration}ms`);
    }
  }
});
observer.observe({ entryTypes: ["resource"] });

// 方法2：拦�?XMLHttpRequest
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url) {
  this._url = url;
  this._startTime = performance.now();
  this.addEventListener("loadend", () => {
    const duration = performance.now() - this._startTime;
    console.log(`请求: ${url}, 耗时: ${duration}ms`);
  });
  return originalOpen.apply(this, arguments);
};

// 方法3：拦�?Fetch
const originalFetch = window.fetch;
window.fetch = function (...args) {
  const start = performance.now();
  return originalFetch.apply(this, args).finally(() => {
    console.log(`请求: ${args[0]}, 耗时: ${performance.now() - start}ms`);
  });
};
```

---

### 2. 如何保证项目质量 [热度:784]

\*_解析�?_

1. **代码规范**：ESLint + Prettier + Stylelint
2. \*_类型检�?_：TypeScript
3. **单元测试**：Jest + React Testing Library / Vue Test Utils
4. **E2E测试**：Cypress / Playwright
5. **代码审查**：Code Review + Git Hook
6. **持续集成**：GitHub Actions / Jenkins
7. **性能监控**：Lighthouse + Performance API
8. **错误监控**：Sentry
9. **文档规范**：README + JSDoc + Storybook

---

### 3. eslint 是怎么做到用配置规则去检验代码异�?[热度:75]

\*_解析�?_
ESLint 的工作原理：

1. **解析**：使�?Espree 解析器将代码转为 AST（抽象语法树�?
2. **遍历**：使�?AST 遍历器（estraverse）遍历节�?
3. \*_规则检�?_：每个规则都是一个插件，监听特定�?AST 节点类型
4. **报告**：发现问题后生成报告

```javascript
// 自定义规则示�?
module.exports = {
  create(context) {
    return {
      // 监听变量声明
      VariableDeclarator(node) {
        if (node.id.name === "foo") {
          context.report({
            node,
            message: "变量名不能为 foo",
          });
        }
      },
    };
  },
};
```

---

### 4. 将已�?push 到远端的两个 commit 合并成一�?commit 应该怎么�?

\*_解析�?_

```bash
# 方法1：使�?git rebase -i（交互式变基�?
git rebase -i HEAD~2
# 将第二个 pick 改为 squash �?s，保存退�?

# 方法2：使�?git reset + git commit
git reset --soft HEAD~2
git commit -m "合并后的提交信息"
git push --force-with-lease

# 方法3：使�?git merge --squash（如果是分支合并�?
```

---

### 5. 前端两个 dom 元素是可以拖拽的，要实现两个 dom 之间的连接线

\*_解析�?_
可以使用 SVG �?Canvas 绘制连接线，监听元素的拖拽事件实时更新连线位置�?

```javascript
// 使用 SVG 绘制连线
function drawLine(elem1, elem2) {
  const rect1 = elem1.getBoundingClientRect();
  const rect2 = elem2.getBoundingClientRect();

  const x1 = rect1.left + rect1.width / 2;
  const y1 = rect1.top + rect1.height / 2;
  const x2 = rect2.left + rect2.width / 2;
  const y2 = rect2.top + rect2.height / 2;

  const svg = document.querySelector("svg");
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "black");
  svg.appendChild(line);
}
```

---

### 6. 日常开发中使用到哪些常用的 Git 命令 [热度:193]

\*_解析�?_

```bash
# 基础操作
git clone <url>          # 克隆仓库
git add .                # 添加所有变�?
git commit -m "msg"      # 提交
git push                 # 推�?
git pull                 # 拉取

# 分支操作
git branch <name>        # 创建分支
git checkout <branch>    # 切换分支
git merge <branch>       # 合并分支
git rebase <branch>      # 变基

# 查看信息
git status               # 查看状�?
git log --oneline        # 查看提交历史
git diff                 # 查看差异

# 撤销操作
git reset --soft HEAD~1  # 撤销提交（保留更改）
git stash                # 暂存更改
git cherry-pick <commit> # 挑选提�?
```

---

### 7. 代码�?console.log 比较多，该怎么�?[热度:340]

\*_解析�?_

1. **生产环境移除**：使�?babel-plugin-transform-remove-console
2. **封装日志工具**：统一封装，支持日志级别控�?
3. **ESLint 规则**：使�?no-console 规则
4. **环境判断**：只在开发环境输�?

```javascript
// 封装日志工具
const logger = {
  log: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  error: (...args) => {
    console.error(...args); // 错误始终输出
  }
};

// .eslintrc
{
  "rules": {
    "no-console": ["warn", { "allow": ["error"] }]
  }
}
```

---

### 8. 项目部署更新之后，如何提醒用户去刷新更新页面资源 [热度:340]

\*_解析�?_

1. **WebSocket 通知**：服务端推送更新消�?
2. \*_轮询版本�?_：前端定期请求版本号，对比后提示刷新
3. **Service Worker**：利�?sw 的更新机�?
4. **构建时注入版本号**：在 HTML 中注入版本号，JS 对比

```javascript
// 版本号检�?
const checkVersion = async () => {
  const res = await fetch("/version.json");
  const { version } = await res.json();
  if (version !== localStorage.getItem("app_version")) {
    localStorage.setItem("app_version", version);
    // 显示刷新提示
    showUpdateNotification();
  }
};
setInterval(checkVersion, 5 * 60 * 1000); // 5分钟检测一�?
```

---

### 9. 排查谁在修改对象 [热度:500]

\*_解析�?_
可以使用 Proxy 监听对象属性的修改�?

```javascript
const createTrackedObject = (obj, name) => {
  return new Proxy(obj, {
    set(target, prop, value) {
      console.trace(`${name}.${String(prop)} 被修改`);
      target[prop] = value;
      return true;
    },
  });
};

// 或者使�?Object.defineProperty
Object.keys(obj).forEach((key) => {
  let value = obj[key];
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newVal) {
      console.trace(`${key} 被修改`);
      value = newVal;
    },
  });
});
```

---

### 10. 为何现在主流的图表库都是用的 canvas 方案，而不是使�?svg

\*_解析�?_
| 特�?| Canvas | SVG |
|------|--------|-----|
| 性能 | 大数据量时性能更好 | 节点多时有性能问题 |
| 渲染方式 | 位图，逐像素绘�?| 矢量，DOM 节点 |
| 交互 | 需要手动计算坐�?| 天然支持事件绑定 |
| 缩放 | 会失�?| 不失�?|
| 适用场景 | 大量数据、实时渲�?| 静态图表、需要交�?|

**主流图表库选择 Canvas 的原因：**

1. **性能**：Canvas 渲染大数据量�?1000 点）时更流畅
2. **内存**：SVG 节点过多会占用大量内�?
3. **绘制控制**：Canvas 可以精细控制绘制过程，优化性能
4. \*_跨平�?_：Canvas 更容易跨端（小程序、React Native 等）

---

### 11. Performance API 主要有哪些应用场�?[热度:431]

\*_解析�?_

```javascript
// 1. 页面加载性能分析
const timing = performance.timing;
const pageLoadTime = timing.loadEventEnd - timing.navigationStart;

// 2. 资源加载监控
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`${entry.name}: ${entry.duration}ms`);
  }
});
observer.observe({ entryTypes: ["resource", "navigation", "paint"] });

// 3. 自定义性能标记
performance.mark("start");
// ... 执行代码
performance.mark("end");
performance.measure("task", "start", "end");

// 4. 长任务检�?
const longTaskObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 50) {
      console.warn("长任�?", entry.duration);
    }
  }
});
longTaskObserver.observe({ entryTypes: ["longtask"] });
```

---

### 12. 弱网检测该如何�?[热度:597]

\*_解析�?_

```javascript
// 方法1：使�?navigator.connection
const connection =
  navigator.connection || navigator.mozConnection || navigator.webkitConnection;
if (connection) {
  console.log("网络类型:", connection.effectiveType); // 4g, 3g, 2g
  console.log("下行速度:", connection.downlink, "Mbps");
  console.log("RTT:", connection.rtt, "ms");
}

// 方法2：发送探测请�?
const detectNetwork = async () => {
  const start = performance.now();
  try {
    await fetch("/ping?_" + Date.now(), { method: "HEAD", cache: "no-store" });
    const rtt = performance.now() - start;
    return { rtt, online: true };
  } catch {
    return { online: false };
  }
};

// 方法3：监听网络状�?
window.addEventListener("online", () => console.log("网络已连�?));
window.addEventListener("offline", () => console.log("网络已断开"));
```

---

### 13. canvas 是如何处理复杂事件交互的�?[热度:120]

\*_解析�?_
Canvas 本身不支持事件绑定到具体图形，需要手动计算：

```javascript
class CanvasEventManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.shapes = []; // 存储可交互图�?
    this.ctx = canvas.getContext("2d");

    canvas.addEventListener("click", (e) => {
      const pos = this.getMousePos(e);
      const clickedShape = this.shapes.find((shape) =>
        this.isPointInShape(pos, shape),
      );
      if (clickedShape) {
        clickedShape.onClick?.();
      }
    });
  }

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  isPointInShape(pos, shape) {
    // 根据图形类型判断点是否在内部
    switch (shape.type) {
      case "rect":
        return (
          pos.x >= shape.x &&
          pos.x <= shape.x + shape.w &&
          pos.y >= shape.y &&
          pos.y <= shape.y + shape.h
        );
      case "circle":
        const dx = pos.x - shape.x;
        const dy = pos.y - shape.y;
        return Math.sqrt(dx * dx + dy * dy) <= shape.r;
    }
  }
}
```

---

### 14. Javascript 数组中有那些方法可以改变自身，那些不可以

**解析�?\*
**改变自身（mutable）：\*\*

- `push()`, `pop()`, `shift()`, `unshift()`
- `splice()`, `sort()`, `reverse()`
- `copyWithin()`, `fill()`

**不改变自身（immutable）：**

- `map()`, `filter()`, `reduce()`, `reduceRight()`
- `slice()`, `concat()`, `flat()`, `flatMap()`
- `join()`, `indexOf()`, `find()`, `findIndex()`
- `every()`, `some()`, `includes()`
- `forEach()`（不返回新数组，但也不改变原数组�?

---

### 15. flex 布局�?align-content �?align-items 有何区别 [热度:106]

\*_解析�?_
| 属�?| 作用对象 | 生效条件 |
|------|----------|----------|
| `align-items` | 单行内的子元�?| 始终生效 |
| `align-content` | 多行之间的对�?| 需�?`flex-wrap: wrap` 且有多行时才生效 |

```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-items: center; /* 单行内垂直居�?*/
  align-content: space-between; /* 多行之间均匀分布 */
}
```

---

### 16. npm install 之后需要执行一些处理工作，应该如何处理 [热度:1...]

\*_解析�?_
使用 npm scripts 的钩子：

```json
{
  "scripts": {
    "postinstall": "node scripts/setup.js",
    "prepare": "husky install"
  }
}
```

可用的钩子：

- `preinstall` / `postinstall`
- `prepublish` / `prepare`
- `prepack` / `postpack`

---

### 17. package.json 里面，表示导出包内容的配置有哪些 [热度:260]

\*_解析�?_

```json
{
  "main": "dist/index.js", // CommonJS 入口
  "module": "dist/index.esm.js", // ES Module 入口
  "types": "dist/index.d.ts", // TypeScript 类型定义
  "exports": {
    // 条件导出（Node 12+�?
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"], // 发布时包含的文件
  "sideEffects": false // 标记无副作用，支�?tree-shaking
}
```

---

### 18. package.json 依赖申明的方式有哪些，他们有何却�?[热度:19...]

\*_解析�?_
| 类型 | 说明 | 使用场景 |
|------|------|----------|
| `dependencies` | 生产环境依赖 | 运行时需要的�?|
| `devDependencies` | 开发环境依�?| 构建、测试、开发工�?|
| `peerDependencies` | 对等依赖 | 插件需要宿主包（如 React 插件需�?React�?|
| `optionalDependencies` | 可选依�?| 安装失败不阻�?|
| `bundledDependencies` | 捆绑依赖 | 打包时包�?|

---

### 19. 介绍一�?URLSearchParams API [热度:10]

\*_解析�?_

```javascript
// 创建
const params = new URLSearchParams("?name=john&age=20");
const params2 = new URLSearchParams({ name: "john", age: "20" });

// 方法
params.append("city", "beijing"); // 添加
params.delete("age"); // 删除
params.get("name"); // 获取
params.getAll("tag"); // 获取所有同名参�?
params.has("name"); // 判断是否存在
params.set("name", "jane"); // 设置（覆盖）
params.sort(); // 排序

// 遍历
for (const [key, value] of params) {
  console.log(key, value);
}

// 转字符串
params.toString(); // "name=john&city=beijing"
```

---

### 20. 前端如何快速获取页�?url query 参数 [热度:888]

\*_解析�?_

```javascript
// 方法1：URLSearchParams（推荐）
const params = new URLSearchParams(location.search);
const name = params.get("name");

// 方法2：URL 对象
const url = new URL(location.href);
const name = url.searchParams.get("name");

// 方法3：正则匹�?
function getQueryParam(key) {
  const match = location.search.match(new RegExp(`[?&]${key}=([^&]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// 方法4：解析为对象
const query = Object.fromEntries(new URLSearchParams(location.search));
```

---

### 21. 前端如何处理一个页面多主题色可供选择的场�?[热度:797]

\*_解析�?_

```css
/* CSS 变量方案 */
:root {
  --primary-color: #1890ff;
  --bg-color: #fff;
}

[data-theme="dark"] {
  --primary-color: #177ddc;
  --bg-color: #141414;
}

/* 使用 */
.button {
  background: var(--primary-color);
}
```

```javascript
// 切换主题
const toggleTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};

// 初始�?
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
```

---

### 22. 如何计算页面白屏时间 [热度:400]

\*_解析�?_

```javascript
// 方法1：Performance API
const timing = performance.timing;
const whiteScreenTime = timing.responseEnd - timing.navigationStart;

// 方法2：FP (First Paint) �?FCP (First Contentful Paint)
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name === 'first-contentful-paint') {
      console.log('FCP:', entry.startTime);
    }
  }
});
observer.observe({ entryTypes: ['paint'] });

// 方法3：手动标记（�?<head> 中插入）
<script>
  window.pageStartTime = Date.now();
</script>
// 在页面底�?
<script>
  const whiteScreenTime = Date.now() - window.pageStartTime;
</script>
```

---

### 23. DOMContentLoaded �?load 事件有什么区�?[热度:210]

\*_解析�?_
| 事件 | 触发时机 | 用�?|
|------|----------|------|
| `DOMContentLoaded` | HTML 解析完成，DOM 树构建完�?| 不等待图片、样式表、iframe |
| `load` | 所有资源（图片、样式、iframe）加载完�?| 需要完整资源时 |

```javascript
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM 就绪");
});

window.addEventListener("load", () => {
  console.log("所有资源加载完�?);
});
```

---

### 24. 如果我期望，页面加载和解析完成之后出发事件，我该怎么�?

\*_解析�?_

```javascript
// 方法1：DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // DOM 解析完成
});

// 方法2：defer 脚本
<script defer src="app.js"></script>;
// defer 脚本�?DOM 解析完成后执�?

// 方法3：requestIdleCallback
requestIdleCallback(() => {
  // 浏览器空闲时执行
});

// 方法4：setTimeout 延迟
setTimeout(() => {
  // 延迟执行
}, 0);
```

---

### 25. 如何实现页面文本不可选中，不可复�?[热度:255]

\*_解析�?_

```css
/* 方法1：CSS */
.no-select {
  user-select: none;
  -webkit-user-select: none;
}

/* 方法2：阻止默认行�?*/
document.addEventListener('selectstart', (e) => {
  e.preventDefault();
});

document.addEventListener('copy', (e) => {
  e.preventDefault();
});

// 方法3：覆盖剪贴板
document.addEventListener('copy', (e) => {
  e.clipboardData.setData('text/plain', '复制被禁�?);
  e.preventDefault();
});
```

---

### 26. 查找页面出现次数最多的 HTML 标签 [热度:379]

\*_解析�?_

```javascript
function getMostFrequentTag() {
  const tags = document.getElementsByTagName("*");
  const count = {};

  for (const tag of tags) {
    const tagName = tag.tagName.toLowerCase();
    count[tagName] = (count[tagName] || 0) + 1;
  }

  return Object.entries(count).sort((a, b) => b[1] - a[1])[0];
}

// 使用
const [tag, times] = getMostFrequentTag();
console.log(`最多的标签: ${tag}, 出现 ${times} 次`);
```

---

### 27. 有哪些前端性能分析工具 [热度:400]

\*_解析�?_

1. **Chrome DevTools**
   - Performance：性能面板
   - Lighthouse：综合评�?
   - Network：网络分�?
   - Memory：内存分�?

2. **在线工具**
   - WebPageTest
   - GTmetrix
   - PageSpeed Insights

3. **性能 API**
   - PerformanceObserver
   - Navigation Timing API
   - Resource Timing API

4. **监控平台**
   - Sentry（错误监控）
   - Fundebug
   - 阿里�?ARMS

---

## 二、HTTP 与缓�?

### 28. http 缓存�?no-cache �?no-store 的区别是什�?[热度:564]

\*_解析�?_
| 指令 | 含义 | 使用场景 |
|------|------|----------|
| `no-cache` | 可以缓存，但每次使用前要验证（发请求问服务器�?| 需要实时性但允许缓存 |
| `no-store` | 完全禁止缓存 | 敏感数据，绝不缓�?|

```
Cache-Control: no-cache  // 使用前验�?
Cache-Control: no-store  // 不缓�?
```

---

### 29. 如何进行代码质量检�?[热度:497]

\*_解析�?_

1. \*_静态分�?_：ESLint、Stylelint、Prettier
2. \*_类型检�?_：TypeScript
3. **单元测试**：Jest、Vitest
4. \*_代码覆盖�?_：Istanbul
5. \*_复杂度分�?_：SonarQube
6. **Git Hook**：husky + lint-staged

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

---

### 30. http 缓存 header 中的 Date �?Last-Modified 有什么不�?

\*_解析�?_
| Header | 含义 | 用�?|
|--------|------|------|
| `Date` | 消息发送的时间 | 标识响应生成时间 |
| `Last-Modified` | 资源最后修改时�?| 协商缓存的验证依�?|

```
客户端请求：
If-Modified-Since: Wed, 21 Oct 2023 07:28:00 GMT

服务端响应（未修改）�?
Status: 304 Not Modified
```

---

### 31. http �?https 做重定向应该使用哪个状态码 [热度:336]

**解析�?\*
使用 **301** �?**308\*\*�?

- **301**：永久重定向（POST 可能变为 GET�?
- **308**：永久重定向（保持请求方法不变，推荐�?

```nginx
# Nginx 配置
server {
  listen 80;
  return 308 https://$host$request_uri;
}
```

---

### 32. http header content-type �?application/octet-stream，则...

**解析�?\*
`application/octet-stream` 表示**二进制流\*\*，浏览器会触发下载而不是直接显示�?

常见 Content-Type�?
| 类型 | 用�?|
|------|------|
| `text/html` | HTML 文档 |
| `application/json` | JSON 数据 |
| `application/javascript` | JS 文件 |
| `text/css` | CSS 文件 |
| `image/png` | PNG 图片 |
| `application/octet-stream` | 二进制文件（下载�?|

---

### 33. http 静态文件缓�?Last-Modified 是根据什么生成的 [热度:85]

\*_解析�?_
`Last-Modified` 是服务器根据文件�?*最后修改时�?*生成的�?

```javascript
// Node.js 示例
const fs = require("fs");
const stat = fs.statSync("file.txt");
const lastModified = stat.mtime.toUTCString();

res.setHeader("Last-Modified", lastModified);
```

---

### 34. 站点是如何保持登录状�?[热度:210]

\*_解析�?_

1. **Cookie + Session**
   - 服务端存�?Session，客户端存储 Session ID

2. **JWT (JSON Web Token)**
   - 服务端签�?Token，客户端存储�?localStorage �?cookie �?

3. **Refresh Token**
   - Access Token 短期有效，Refresh Token 长期有效

```javascript
// JWT 方案
const login = async (credentials) => {
  const { accessToken, refreshToken } = await api.login(credentials);
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

// 请求拦截器添�?Token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

### 35. http ETag 值改变了，是否意味着文件内容一定已经更�?

**解析�?\*
**不一定�?\*

ETag 的生成方式：

1. **�?ETag**：基于文件内容哈希，内容变则 ETag �?
2. **�?ETag**（W/ 前缀）：基于文件属性（如修改时间），可能内容没变但 ETag 变了

```
ETag: "33a64df5"        // �?ETag
ETag: W/"33a64df5"      // �?ETag
```

---

### 36. http 响应头中�?ETag 值是如何生成�?[热度:37]

\*_解析�?_
ETag 生成算法�?

1. \*_文件版本�?_：文件内容哈希（MD5、SHA1�?
2. \*_文件属�?_：inode + 修改时间 + 文件大小
3. **自定义逻辑**：数据库版本号等

```javascript
// Node.js 示例
const crypto = require("crypto");
const fs = require("fs");

function generateETag(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(content).digest("hex");
}
```

---

### 37. 浏览器中如何实现剪切板复制内容的功能 [热度:95]

\*_解析�?_

```javascript
// 方法1：Clipboard API（推荐）
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("复制成功");
  } catch (err) {
    console.error("复制失败:", err);
  }
}

// 方法2：传统方法（兼容性好�?
function copyText(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

// 读取剪贴�?
async function readClipboard() {
  const text = await navigator.clipboard.readText();
  console.log("剪贴板内�?", text);
}
```

---

### 38. 分片上传文件，如何校验文件完整�?[热度:220]

\*_解析�?_

```javascript
// 1. 计算文件 MD5
async function calculateMD5(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("MD5", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// 2. 分片上传
async function uploadFile(file) {
  const chunkSize = 1024 * 1024; // 1MB
  const chunks = Math.ceil(file.size / chunkSize);
  const fileHash = await calculateMD5(file);

  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("index", i);
    formData.append("total", chunks);
    formData.append("hash", fileHash);

    await fetch("/upload", { method: "POST", body: formData });
  }

  // 3. 合并分片并校�?
  await fetch("/upload/merge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hash: fileHash, total: chunks }),
  });
}
```

---

### 39. try...catch 是否能捕获异步异�?[热度:701]

\*_解析�?_

```javascript
// 不能捕获异步异常
try {
  setTimeout(() => {
    throw new Error("异步错误"); // 无法捕获
  }, 0);
} catch (e) {
  console.log("捕获不到");
}

// 正确做法
// 方法1：回调中 try-catch
setTimeout(() => {
  try {
    throw new Error("异步错误");
  } catch (e) {
    console.log("捕获成功:", e.message);
  }
}, 0);

// 方法2：Promise
try {
  await Promise.reject(new Error("异步错误"));
} catch (e) {
  console.log("捕获成功:", e.message);
}

// 方法3：async/await + try-catch
async function foo() {
  try {
    await someAsyncOperation();
  } catch (e) {
    console.log("捕获成功");
  }
}

// 方法4：全局监听
window.addEventListener("unhandledrejection", (e) => {
  console.log("未处理的 Promise 错误:", e.reason);
});
```

---

### 40. 单元测试、E2E 测试有和区别 [热度:258]

**解析�?\*
| 类型 | 测试范围 | 工具 | 速度 | 稳定�?|
|------|----------|------|------|--------|
| **单元测试** | 单个函数/组件 | Jest、Vitest | �?| �?|
| **集成测试** | 多个模块交互 | Jest + Testing Library | 中等 | 中等 |
| **E2E 测试\*\* | 完整用户流程 | Cypress、Playwright | �?| �?|

---

### 41. 前端应用有哪些代码测试手�?[热度:385]

\*_解析�?_

1. **单元测试**：Jest、Vitest、Mocha
2. **组件测试**：React Testing Library、Vue Test Utils
3. **E2E 测试**：Cypress、Playwright、Selenium
4. **视觉回归测试**：Percy、Chromatic
5. **性能测试**：Lighthouse CI
6. \*_静态分�?_：ESLint、TypeScript

---

### 42. mobx �?redux 有什么区�?[热度:277]

\*_解析�?_
| 特�?| Redux | MobX |
|------|-------|------|
| 理念 | 函数式，不可变数�?| 响应式，可变数据 |
| 学习曲线 | 较陡 | 平缓 |
| 代码�?| 较多（Action、Reducer、Store�?| 较少 |
| 调试 | Redux DevTools 强大 | 一�?|
| 适用场景 | 大型应用 | 中小型应�?|

---

### 43. �?forEach 中和 for 循环中调用异步函数的区别 [热度:371]

\*_解析�?_

```javascript
// forEach 不会等待异步完成
[1, 2, 3].forEach(async (i) => {
  await delay(100);
  console.log(i); // 不会按顺序输�?
});
console.log("结束"); // 先输�?

// for...of 会等�?
(async () => {
  for (const i of [1, 2, 3]) {
    await delay(100);
    console.log(i); // 按顺序输�?
  }
  console.log("结束"); // 后输�?
})();

// 解决方案：使�?Promise.all
await Promise.all(
  [1, 2, 3].map(async (i) => {
    await delay(100);
    console.log(i);
  }),
);
```

---

### 44. axios 如何取消请求 [热度:218]

\*_解析�?_

```javascript
// Axios v0.22+ 使用 AbortController
const controller = new AbortController();

axios.get("/api/data", {
  signal: controller.signal,
});

// 取消请求
controller.abort();

// 取消多个请求
const controller1 = new AbortController();
const controller2 = new AbortController();

// 取消所有请�?
function cancelAll() {
  controller1.abort();
  controller2.abort();
}
```

---

### 45. axios 如何注销拦截�?[热度:140]

\*_解析�?_

```javascript
// 添加拦截器并保存引用
const requestInterceptor = axios.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

const responseInterceptor = axios.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

// 注销拦截�?
axios.interceptors.request.eject(requestInterceptor);
axios.interceptors.response.eject(responseInterceptor);
```

---

### 46. �?axios 做一个通用拦截器，实现功能为状态码�?200 的时�?..

\*_解析�?_

```javascript
// 创建 axios 实例
const instance = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// 请求拦截�?
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截�?
instance.interceptors.response.use(
  (response) => {
    if (response.status !== 200) {
      // 处理�?200 状态码
      return Promise.reject(new Error("请求失败"));
    }
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，跳转登录
          window.location.href = "/login";
          break;
        case 403:
          message.error("没有权限");
          break;
        case 500:
          message.error("服务器错�?);
          break;
        default:
          message.error(error.response.data.message || "请求失败");
      }
    }
    return Promise.reject(error);
  },
);
```

---

### 47. 想设�?axios 全局通用配置，有哪些方法 [热度:298]

\*_解析�?_

```javascript
// 方法1：axios.defaults
axios.defaults.baseURL = "https://api.example.com";
axios.defaults.timeout = 10000;
axios.defaults.headers.common["Authorization"] = "Bearer token";

// 方法2：创建实�?
const instance = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000,
  headers: { "X-Custom-Header": "foobar" },
});

// 方法3：拦截器
axios.interceptors.request.use((config) => {
  config.headers["X-Request-Time"] = Date.now();
  return config;
});
```

---

### 48. 解释�?axios withCredentials 配置 [热度:197]

\*_解析�?_
`withCredentials` 控制是否携带跨域请求�?Cookie�?

```javascript
axios.get("/api/data", {
  withCredentials: true, // 允许携带 Cookie
});
```

\*_注意�?_

- 需要服务端配合设置 `Access-Control-Allow-Credentials: true`
- 此时 `Access-Control-Allow-Origin` 不能�?`*`，必须指定具体域�?

---

### 49. axios 支持哪些常用的配�?[热度:196]

\*_解析�?_

```javascript
axios({
  url: "/api/data",
  method: "get", // 请求方法
  baseURL: "https://api.example.com",
  headers: { "X-Requested-With": "XMLHttpRequest" },
  params: { id: 123 }, // URL 参数
  data: { name: "john" }, // 请求体数�?
  timeout: 1000, // 超时时间
  withCredentials: false, // 跨域携带 Cookie
  responseType: "json", // 响应数据类型
  validateStatus: (status) => status >= 200 && status < 300,
});
```

---

### 50. axios 有哪些特�?[热度:147]

\*_解析�?_

1. **基于 Promise**：支�?async/await
2. **浏览器和 Node.js**：支持双�?
3. \*_拦截�?_：请�?响应拦截
4. **取消请求**：支�?AbortController
5. **自动转换 JSON**：自动解析响应数�?
6. **客户�?XSRF 防护**：自动读�?Cookie 中的 XSRF token
7. \*_请求/响应转换�?_：支持自定义转换逻辑

---

## 三、CSS 与布局

### 51. 动画性能如何检�?[热度:262]

\*_解析�?_

```javascript
// 方法1：Chrome DevTools Performance 面板
// 录制动画，查�?FPS、CPU 占用

// 方法2：requestAnimationFrame 计算 FPS
let lastTime = performance.now();
let frameCount = 0;

function measureFPS() {
  frameCount++;
  const currentTime = performance.now();

  if (currentTime - lastTime >= 1000) {
    console.log(`FPS: ${frameCount}`);
    frameCount = 0;
    lastTime = currentTime;
  }

  requestAnimationFrame(measureFPS);
}

// 方法3：使�?Performance Observer
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 16.67) {
      // 超过 60fps 的帧时间
      console.warn("掉帧:", entry.duration);
    }
  }
});
observer.observe({ entryTypes: ["frame"] });
```

---

### 52. 手写实现 lodash.flattenDeep �?array 递归为一维数�?

\*_解析�?_

```javascript
// 递归实现
function flattenDeep(arr) {
  return arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val),
    [],
  );
}

// 使用栈实现（避免递归深度问题�?
function flattenDeep(arr) {
  const result = [];
  const stack = [...arr];

  while (stack.length) {
    const next = stack.pop();
    if (Array.isArray(next)) {
      stack.push(...next);
    } else {
      result.push(next);
    }
  }

  return result.reverse();
}

// 使用 Generator
function* flattenDeep(arr) {
  for (const item of arr) {
    if (Array.isArray(item)) {
      yield* flattenDeep(item);
    } else {
      yield item;
    }
  }
}

// 使用 Infinity
arr.flat(Infinity);
```

---

### 53. localStorage 是同步还是异�?[热度:210]

**解析�?\*
**localStorage 是同步的�?\*

```javascript
// 同步操作
localStorage.setItem("key", "value"); // 立即执行
const value = localStorage.getItem("key"); // 立即返回

// 注意：大数据量时会阻塞主线程
// 解决方案：使�?IndexedDB（异步）

// 封装为异�?API
const asyncLocalStorage = {
  setItem: (key, value) =>
    Promise.resolve().then(() => localStorage.setItem(key, value)),
  getItem: (key) => Promise.resolve().then(() => localStorage.getItem(key)),
};
```

---

### 54. 如何限制 input 框只能输入正整数 [热度:230]

\*_解析�?_

```html
<!-- 方法1：type="number" -->
<input
  type="number"
  min="1"
  step="1"
  oninput="this.value = this.value.replace(/[^0-9]/g, '')"
/>

<!-- 方法2：正则验�?-->
<input type="text" id="numberInput" />
<script>
  document.getElementById("numberInput").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  });
</script>

<!-- 方法3�?compositionstart/compositionend 处理中文输入 -->
<input type="text" id="input" />
<script>
  let isComposing = false;
  const input = document.getElementById("input");

  input.addEventListener("compositionstart", () => (isComposing = true));
  input.addEventListener("compositionend", () => {
    isComposing = false;
    input.value = input.value.replace(/\D/g, "");
  });
  input.addEventListener("input", () => {
    if (!isComposing) {
      input.value = input.value.replace(/\D/g, "");
    }
  });
</script>
```

---

### 55. npm run start 的过程是啥，为何能执行对应的命令 [热度:170]

\*_解析�?_

```bash
# npm run start 的执行过程：
# 1. 读取 package.json 中的 scripts 字段
# 2. �?node_modules/.bin 中查找对应的命令
# 3. 将命令添加到 PATH 中执�?

# package.json
{
  "scripts": {
    "start": "webpack serve --mode development"
  }
}

# 实际执行�?
# ./node_modules/.bin/webpack serve --mode development
```

---

### 56. 如何做静态资源预加载 [热度:696]

\*_解析�?_

```html
<!-- 1. DNS 预解�?-->
<link rel="dns-prefetch" href="//cdn.example.com" />

<!-- 2. 预连�?-->
<link rel="preconnect" href="https://cdn.example.com" />

<!-- 3. 预加载关键资�?-->
<link rel="preload" href="/critical.css" as="style" />
<link rel="preload" href="/font.woff2" as="font" crossorigin />

<!-- 4. 预获取下一页资�?-->
<link rel="prefetch" href="/next-page.js" />

<!-- 5. 预渲�?-->
<link rel="prerender" href="/next-page.html" />
```

```javascript
// JS 动态预加载
const preloadImage = (src) => {
  const img = new Image();
  img.src = src;
};

// Intersection Observer 懒加�?+ 预加�?
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});
```

---

### 57. 在开发过程中，想�?git 代码暂存，该如何�?[热度:342]

\*_解析�?_

```bash
# git stash：暂存当前修�?
git stash                    # 暂存
git stash save "描述信息"     # 带描述暂�?
git stash list               # 查看暂存列表
git stash pop                # 恢复最近暂存并删除
git stash apply              # 恢复最近暂存但不删�?
git stash drop stash@{0}     # 删除指定暂存
git stash clear              # 清空所有暂�?
```

---

### 58. websocket 断链之后如何重连，且保证断链期间数据不丢�?

\*_解析�?_

```javascript
class ReconnectingWebSocket {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.reconnectInterval = 3000;
    this.messageQueue = []; // 断线期间的消息队�?
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("连接成功");
      // 发送断线期间累积的消息
      while (this.messageQueue.length > 0) {
        this.send(this.messageQueue.shift());
      }
    };

    this.ws.onclose = () => {
      console.log("连接断开，准备重�?..");
      setTimeout(() => this.connect(), this.reconnectInterval);
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket 错误:", error);
    };
  }

  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      // 离线时存入队�?
      this.messageQueue.push(data);
    }
  }
}
```

---

### 59. 需要详细记录多个操作链路的性能耗时，进行结构化场景分析...

\*_解析�?_

```javascript
class PerformanceTracer {
  constructor() {
    this.traces = new Map();
  }

  start(traceId, stepName) {
    if (!this.traces.has(traceId)) {
      this.traces.set(traceId, { steps: [], startTime: performance.now() });
    }

    const trace = this.traces.get(traceId);
    trace.steps.push({
      name: stepName,
      startTime: performance.now(),
      endTime: null,
    });
  }

  end(traceId, stepName) {
    const trace = this.traces.get(traceId);
    const step = trace.steps.find((s) => s.name === stepName && !s.endTime);
    if (step) {
      step.endTime = performance.now();
      step.duration = step.endTime - step.startTime;
    }
  }

  report(traceId) {
    const trace = this.traces.get(traceId);
    const totalTime = performance.now() - trace.startTime;

    console.log(`链路 ${traceId} 性能报告:`);
    console.log(`总耗时: ${totalTime.toFixed(2)}ms`);
    trace.steps.forEach((step) => {
      console.log(`  ${step.name}: ${step.duration.toFixed(2)}ms`);
    });

    return { totalTime, steps: trace.steps };
  }
}

// 使用
const tracer = new PerformanceTracer();
tracer.start("user_login", "api_request");
// ... 异步操作
tracer.end("user_login", "api_request");
tracer.report("user_login");
```

---

### 60. eslint 如何设置只校验本�?MR 变更的文件内�?[热度:200]

\*_解析�?_

```bash
# 使用 lint-staged（推荐）
# 只校�?git 暂存区的文件

# package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
}

# 或者使�?eslint �?--cache 选项
eslint --cache --ext .js,.jsx,.ts,.tsx src/

# 只校验变更的文件（CI 场景�?
eslint $(git diff --name-only --diff-filter=ACMRTUXB origin/main | grep -E '\.(js|jsx|ts|tsx)$')
```

---

### 61. 假如没有 ip 地址只使�?Mac 地址会有什么问�?

\*_解析�?_

1. \*_网络层无法路�?_：Mac 地址是链路层地址，无法跨网段通信
2. **地址空间不足**：Mac 地址 48 位，IPv4 32 位、IPv6 128 �?
3. **配置复杂**：需要手动配置路由表
4. **无法 NAT**：无法实现网络地址转换
5. **广播风暴**：大量广播包导致网络拥塞

---

### 62. 聊聊低代�?组件表单如何设计

\*_解析�?_
低代码表单设计核心：

1. **JSON Schema 定义表单结构**
2. **组件映射**：根�?type 渲染对应组件
3. **数据绑定**：双向绑定表单数�?
4. **校验规则**：集成校验逻辑
5. **布局系统**：支持行列布局

```javascript
// JSON Schema 示例
const schema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "姓名",
      required: true,
    },
    age: {
      type: "number",
      title: "年龄",
      minimum: 0,
      maximum: 150,
    },
  },
};

// 渲染�?
function renderForm(schema) {
  return Object.entries(schema.properties).map(([key, config]) => {
    switch (config.type) {
      case "string":
        return <Input {...config} />;
      case "number":
        return <InputNumber {...config} />;
      // ...
    }
  });
}
```

---

### 63. 低代码多层渲染怎么实现

\*_解析�?_

```javascript
// 递归渲染组件�?
function renderComponent(node) {
  const Component = componentMap[node.type];

  if (!node.children || node.children.length === 0) {
    return <Component {...node.props} />;
  }

  return (
    <Component {...node.props}>
      {node.children.map((child) => renderComponent(child))}
    </Component>
  );
}

// 组件树结�?
const tree = {
  type: "Page",
  props: { title: "表单�? },
  children: [
    {
      type: "Form",
      props: {},
      children: [
        { type: "Input", props: { name: "username" } },
        { type: "Select", props: { name: "role" } },
      ],
    },
  ],
};
```

---

### 64. vite 预构�?

\*_解析�?_
Vite 预构建（Pre-bundling）的目的�?

1. **减少请求数量**：将 CommonJS 依赖转为 ESM
2. **优化加载速度**：合并小文件，减�?HTTP 请求
3. **支持按需加载**：处理源码中的裸导入（bare imports�?

```javascript
// vite.config.js
export default {
  optimizeDeps: {
    include: ["lodash-es", "vue"], // 强制预构�?
    exclude: ["@internal/lib"], // 排除预构�?
    entries: ["./src/main.js"], // 自定义入�?
  },
};
```

---

### 65. react hooks 设计理念

\*_解析�?_
React Hooks 设计理念�?

1. \*_函数式编�?_：让函数组件拥有状态和生命周期
2. **逻辑复用**：通过自定�?Hook 复用状态逻辑
3. **组合优于继承**：函数组合实现功能扩�?
4. \*_声明�?_：关�?做什�?而非"怎么�?

核心 Hooks�?

- `useState`：状态管�?
- `useEffect`：副作用处理
- `useContext`：上下文消费
- `useReducer`：复杂状态逻辑
- `useMemo/useCallback`：性能优化

---

### 66. 如何判断用户设备

\*_解析�?_

```javascript
// 方法1：User Agent
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

// 方法2：屏幕尺�?
const isMobile = window.innerWidth < 768;

// 方法3：触摸支�?
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

// 方法4：现�?API
const deviceMemory = navigator.deviceMemory; // 设备内存（GB�?
const connection = navigator.connection; // 网络信息
```

---

### 67. 将多次提交压缩成一次提�?

\*_解析�?_

```bash
# 方法1：git rebase -i
git rebase -i HEAD~3
# �?pick 改为 squash �?s

# 方法2：git reset --soft
git reset --soft HEAD~3
git commit -m "合并后的提交信息"

# 方法3：git merge --squash
git merge --squash feature-branch
git commit -m "合并 feature-branch"
```

---

### 68. 介绍一�?navigator.sendBeacon 方法

\*_解析�?_
`navigator.sendBeacon` 用于在页面卸载时可靠地发送数据�?

```javascript
// 使用场景：页面关闭时上报数据
window.addEventListener("beforeunload", () => {
  navigator.sendBeacon(
    "/analytics",
    JSON.stringify({
      page: location.href,
      duration: Date.now() - pageStartTime,
    }),
  );
});

// 特点�?
// 1. 异步发送，不阻塞页面卸�?
// 2. 数据在浏览器内部排队发�?
// 3. 支持 POST 请求
// 4. 发送的�?Blob �?FormData

// 对比 XMLHttpRequest
// XHR �?beforeunload 中可能被取消
// sendBeacon 更可�?
```

---

### 69. 混动跟随导航（电梯导航）该如何实�?

\*_解析�?_

```javascript
// 电梯导航实现
class ElevatorNav {
  constructor(navSelector, sectionSelector) {
    this.navItems = document.querySelectorAll(navSelector);
    this.sections = document.querySelectorAll(sectionSelector);
    this.init();
  }

  init() {
    // 点击导航滚动到对应区�?
    this.navItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        this.sections[index].scrollIntoView({ behavior: "smooth" });
      });
    });

    // 滚动时高亮对应导�?
    window.addEventListener(
      "scroll",
      this.throttle(() => {
        this.highlightNav();
      }, 100),
    );
  }

  highlightNav() {
    const scrollPos = window.scrollY + 100;

    this.sections.forEach((section, index) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        this.navItems.forEach((item) => item.classList.remove("active"));
        this.navItems[index].classList.add("active");
      }
    });
  }

  throttle(fn, delay) {
    let lastTime = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastTime >= delay) {
        fn.apply(this, args);
        lastTime = now;
      }
    };
  }
}
```

---

### 70. 退出浏览器之间，发送积压的埋点数据请求，该如何�?

\*_解析�?_

```javascript
// 方法1：sendBeacon（推荐）
window.addEventListener("beforeunload", () => {
  const data = JSON.stringify(getPendingTrackingData());
  navigator.sendBeacon(
    "/track",
    new Blob([data], { type: "application/json" }),
  );
});

// 方法2：fetch with keepalive
window.addEventListener("beforeunload", () => {
  fetch("/track", {
    method: "POST",
    body: JSON.stringify(getPendingTrackingData()),
    keepalive: true, // 保持连接
  });
});

// 方法3：使�?IndexedDB 存储，下次打开时发�?
async function savePendingData(data) {
  const db = await openDB("tracking", 1);
  await db.put("pending", data, Date.now());
}

// 页面加载时发送积压数�?
window.addEventListener("load", async () => {
  const db = await openDB("tracking", 1);
  const pending = await db.getAll("pending");
  for (const data of pending) {
    await fetch("/track", { method: "POST", body: JSON.stringify(data) });
    await db.delete("pending", data.id);
  }
});
```

---

### 71. 如何统计页面�?long task（长任务�?[热度:140]

\*_解析�?_

```javascript
// 使用 PerformanceObserver 检测长任务
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.warn("长任�?detected:", {
      duration: entry.duration,
      startTime: entry.startTime,
      name: entry.name,
    });
  }
});

observer.observe({ entryTypes: ["longtask"] });

// 长任务定义：执行时间超过 50ms 的任�?
// 优化方案�?
// 1. 将大任务拆分为多个小任务
// 2. 使用 requestIdleCallback
// 3. 使用 Web Worker
```

---

### 72. PerformanceObserver 如何测量页面性能

\*_解析�?_

```javascript
// 测量各种性能指标
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.startTime, entry.duration);
  }
});

// 监听不同类型的性能条目
observer.observe({ entryTypes: ["navigation"] }); // 页面导航
observer.observe({ entryTypes: ["resource"] }); // 资源加载
observer.observe({ entryTypes: ["paint"] }); // 绘制（FP、FCP�?
observer.observe({ entryTypes: ["largest-contentful-paint"] }); // LCP
observer.observe({ entryTypes: ["layout-shift"] }); // CLS
observer.observe({ entryTypes: ["first-input"] }); // FID
observer.observe({ entryTypes: ["longtask"] }); // 长任�?

// 核心 Web 指标
// LCP (Largest Contentful Paint) < 2.5s
// FID (First Input Delay) < 100ms
// CLS (Cumulative Layout Shift) < 0.1
```

---

### 73. 移动端如何实现下拉滚动加载（顶部加载�?

\*_解析�?_

```javascript
// 下拉刷新实现
class PullToRefresh {
  constructor(container, callback) {
    this.container = container;
    this.callback = callback;
    this.startY = 0;
    this.isRefreshing = false;

    this.container.addEventListener(
      "touchstart",
      this.handleTouchStart.bind(this),
    );
    this.container.addEventListener(
      "touchmove",
      this.handleTouchMove.bind(this),
    );
    this.container.addEventListener("touchend", this.handleTouchEnd.bind(this));
  }

  handleTouchStart(e) {
    if (this.container.scrollTop === 0 && !this.isRefreshing) {
      this.startY = e.touches[0].clientY;
    }
  }

  handleTouchMove(e) {
    if (this.startY === 0 || this.isRefreshing) return;

    const diff = e.touches[0].clientY - this.startY;
    if (diff > 0 && this.container.scrollTop === 0) {
      // 下拉�?
      this.container.style.transform = `translateY(${diff * 0.5}px)`;
    }
  }

  handleTouchEnd(e) {
    if (this.isRefreshing) return;

    const diff = e.changedTouches[0].clientY - this.startY;
    if (diff > 80) {
      this.isRefreshing = true;
      this.container.style.transform = "translateY(50px)";
      this.callback().then(() => {
        this.isRefreshing = false;
        this.container.style.transform = "translateY(0)";
      });
    } else {
      this.container.style.transform = "translateY(0)";
    }
    this.startY = 0;
  }
}
```

---

### 74. 判断页签是否为活跃状�?

\*_解析�?_

```javascript
// 方法1：visibilitychange 事件
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    console.log("页面不可�?);
  } else {
    console.log("页面可见");
  }
});

// 方法2：document.visibilityState
console.log(document.visibilityState); // 'visible' | 'hidden' | 'prerender'

// 方法3：window.onblur / window.onfocus
window.addEventListener("blur", () => console.log("失去焦点"));
window.addEventListener("focus", () => console.log("获得焦点"));

// 应用场景：暂停视频、停止轮询、节省资�?
```

---

### 75. 在网络带宽一定的情况下，切片上传感觉和整体上传，消费的时�?..

**解析�?\*
**切片上传的优势：\*\*

1. **断点续传**：失败只需重传失败的分�?
2. **并发上传**：多个分片同时上传（提高带宽利用率）
3. **进度可控**：更精确的进度条
4. **内存友好**：不需要一次性读取大文件

**整体上传的优势：**

1. \*_简�?_：实现简�?
2. \*_开销�?_：没有分片合并的开销
3. \*_小文件更�?_：小文件不需要分�?

\*_结论�?_

- 大文件（>100MB）：切片上传更快（并发优势）
- 小文件（<10MB）：整体上传更快（无分片开销�?

---

### 76. 大文件切片上传的时候，确定切片数量的时候，有那些考量因素

\*_解析�?_

1. **文件大小**：通常 1MB-10MB 一个分�?
2. **网络状况**：弱网时分片更小�?00KB-500KB�?
3. **并发限制**：浏览器并发连接数限制（HTTP/1.1 �?6-8 个）
4. \*_服务器限�?_：请求体大小限制
5. **内存限制**：分片不能太大，避免内存溢出
6. **重传成本**：分片越小，重传成本越低

```javascript
function calculateChunkSize(fileSize) {
  if (fileSize < 10 * 1024 * 1024) return 1024 * 1024; // <10MB: 1MB
  if (fileSize < 100 * 1024 * 1024) return 2 * 1024 * 1024; // <100MB: 2MB
  if (fileSize < 1024 * 1024 * 1024) return 5 * 1024 * 1024; // <1GB: 5MB
  return 10 * 1024 * 1024; // >=1GB: 10MB
}
```

---

### 77. 页面关闭时执行方法，该如何做

\*_解析�?_

```javascript
// 方法1：beforeunload
window.addEventListener("beforeunload", (e) => {
  // 可以提示用户是否离开
  e.preventDefault();
  e.returnValue = "";
});

// 方法2：unload（不可靠，部分浏览器不支持异步操作）
window.addEventListener("unload", () => {
  // 同步操作
  localStorage.setItem("lastVisit", Date.now());
});

// 方法3：pagehide（推荐，支持异步�?
window.addEventListener("pagehide", (event) => {
  if (event.persisted) {
    // 页面被缓�?
  }
  // 可以使用 sendBeacon 发送数�?
  navigator.sendBeacon("/log", JSON.stringify({ type: "exit" }));
});

// 方法4：visibilitychange（页面隐藏时触发�?
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    // 页面被隐藏或关闭
    saveData();
  }
});
```

### 78. 如何统计用户 PV 访问的发起请求数量

> **功能简述：** 该代码展示了统计用户 PV（页面访问）期间发起请求数量的两种方法：
>
> **方法1（拦截 XHR + Fetch）：** 通过猴子补丁重写 `XMLHttpRequest.prototype.open` 和 `window.fetch`，每次请求时计数 +1 并记录方法、URL、时间戳；页面卸载时通过 `navigator.sendBeacon` 上报数据，同时每 30 秒通过 `fetch + keepalive` 定时上报。仅统计 XHR/Fetch 请求，不含静态资源，但内置上报逻辑。
>
> **方法2（Performance API）：** 利用 `PerformanceObserver` 被动监听资源加载条目，按 `initiatorType` 分类统计 XHR、Fetch 及其他资源请求，不侵入业务代码、无副作用，但仅输出控制台，需自行扩展上报。

**解析：**

```javascript
// 方法1：拦截 XMLHttpRequest
class RequestCounter {
  constructor() {
    this.count = 0;
    this.requests = [];
    this.init();
  }

  init() {
    this.interceptXHR();
    this.interceptFetch();
    this.report();
  }

  interceptXHR() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const self = this;

    XMLHttpRequest.prototype.open = function (method, url) {
      self.count++;
      self.requests.push({
        method,
        url: typeof url === "string" ? url : url[0],
        time: Date.now(),
      });
      return originalOpen.apply(this, arguments);
    };
  }

  interceptFetch() {
    const originalFetch = window.fetch;
    const self = this;

    window.fetch = async function (...args) {
      self.count++;
      self.requests.push({
        method: "GET",
        url: args[0],
        time: Date.now(),
      });
      return originalFetch.apply(this, args);
    };
  }

  report() {
    window.addEventListener("beforeunload", () => {
      navigator.sendBeacon(
        "/analytics",
        JSON.stringify({
          type: "pv_request_count",
          count: this.count,
          requests: this.requests.slice(-50),
          url: location.href,
        }),
      );
    });

    setInterval(() => {
      if (this.count > 0) {
        fetch("/analytics", {
          method: "POST",
          body: JSON.stringify({
            type: "request_stats",
            count: this.count,
            url: location.href,
          }),
          keepalive: true,
        }).catch(() => {});
      }
    }, 30000);
  }
}

new RequestCounter();

// 方法2：使用 Performance API
const observer = new PerformanceObserver((list) => {
  let resourceCount = 0,
    xhrCount = 0,
    fetchCount = 0;
  for (const entry of list.getEntries()) {
    if (entry.initiatorType === "xmlhttprequest") xhrCount++;
    else if (entry.initiatorType === "fetch") fetchCount++;
    else if (entry.entryType === "resource") resourceCount++;
  }
  console.log(
    `PV 请求统计 - 资源:${resourceCount}, XHR:${xhrCount}, Fetch:${fetchCount}`,
  );
});
observer.observe({ entryTypes: ["resource", "navigation"] });
```

---

### 79. 长文本溢出，展开/收起如何实现

**解析：**

**方案1：纯 CSS 方式**

```css
.text-ellipsis-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.text-ellipsis-multi {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

**方案2：React 实现**

```jsx
function ExpandableText({ text, maxLines = 3 }) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      const lineHeight = parseFloat(getComputedStyle(ref.current).lineHeight);
      setIsOverflowing(ref.current.scrollHeight > lineHeight * maxLines);
    }
  }, [text, maxLines]);

  return (
    <div>
      <div
        ref={ref}
        style={{
          display: expanded ? "block" : "-webkit-box",
          WebkitLineClamp: expanded ? "unset" : maxLines,
          WebkitBoxOrient: "vertical",
          overflow: expanded ? "visible" : "hidden",
        }}
      >
        {text}
      </div>
      {isOverflowing && (
        <button onClick={() => setExpanded(!expanded)}>
          {expanded ? "收起" : "展开全文"}
        </button>
      )}
    </div>
  );
}
```

**方案3：原生 JS 实现**

```javascript
class ExpandableText {
  constructor(el) {
    this.el = el;
    this.maxLines = parseInt(el.dataset.maxLines) || 3;
    this.isExpanded = false;
    this.init();
  }

  init() {
    this.checkOverflow();
    this.createToggleBtn();
    window.addEventListener("resize", () => this.checkOverflow());
  }

  checkOverflow() {
    const lineHeight = parseFloat(getComputedStyle(this.el).lineHeight);
    this.isOverflowing = this.el.scrollHeight > lineHeight * this.maxLines;

    if (!this.isExpanded && this.isOverflowing) {
      Object.assign(this.el.style, {
        display: "-webkit-box",
        WebkitLineClamp: this.maxLines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      });
    }
    this.toggleBtn &&
      (this.toggleBtn.style.display = this.isOverflowing ? "" : "none");
  }

  createToggleBtn() {
    this.toggleBtn = document.createElement("span");
    this.toggleBtn.textContent = "展开";
    this.toggleBtn.style.cssText =
      "color:#1890ff;cursor:pointer;display:none;margin-left:8px";
    this.toggleBtn.onclick = () => this.toggle();
    this.el.parentNode.insertBefore(this.toggleBtn, this.el.nextSibling);
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      Object.assign(this.el.style, {
        display: "block",
        WebkitLineClamp: "unset",
        overflow: "visible",
      });
      this.toggleBtn.textContent = "收起";
    } else {
      Object.assign(this.el.style, {
        display: "-webkit-box",
        WebkitLineClamp: this.maxLines,
        overflow: "hidden",
      });
      this.toggleBtn.textContent = "展开";
    }
  }
}
document
  .querySelectorAll(".expandable-text")
  .forEach((el) => new ExpandableText(el));
```

---

### 80. 如何实现鼠标拖拽

**解析：**

**方案1：HTML5 Drag & Drop API**

```javascript
const draggables = document.querySelectorAll(".draggable");
draggables.forEach((item) => {
  item.draggable = true;
  item.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", item.id);
    item.classList.add("dragging");
  });
  item.addEventListener("dragend", () => item.classList.remove("dragging"));
});

const dropZone = document.querySelector(".drop-zone");
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});
dropZone.addEventListener("dragleave", () =>
  dropZone.classList.remove("drag-over"),
);
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  dropZone.appendChild(
    document.getElementById(e.dataTransfer.getData("text/plain")),
  );
});
```

**方案2：鼠标事件实现自由拖拽**

```javascript
class Draggable {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      handle: options.handle || element,
      bounds: options.bounds || null,
      onDragStart: options.onDragStart || (() => {}),
      onDrag: options.onDrag || (() => {}),
      onDragEnd: options.onDragEnd || (() => {}),
    };
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.initialLeft = 0;
    this.initialTop = 0;
    this.options.handle.addEventListener(
      "mousedown",
      this.onMouseDown.bind(this),
    );
  }

  onMouseDown(e) {
    e.preventDefault();
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    const rect = this.element.getBoundingClientRect();
    this.initialLeft = rect.left;
    this.initialTop = rect.top;
    Object.assign(this.element.style, {
      position: "absolute",
      zIndex: "1000",
      userSelect: "none",
    });
    this.options.onDragStart(e);
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  onMouseMove(e) {
    if (!this.isDragging) return;
    let newX = this.initialLeft + e.clientX - this.startX;
    let newY = this.initialTop + e.clientY - this.startY;
    if (this.options.bounds) {
      const b = this.options.bounds.getBoundingClientRect(),
        r = this.element.getBoundingClientRect();
      newX = Math.max(b.left, Math.min(newX, b.right - r.width));
      newY = Math.max(b.top, Math.min(newY, b.bottom - r.height));
    }
    Object.assign(this.element.style, { left: `${newX}px`, top: `${newY}px` });
    this.options.onDrag(e, { x: newX, y: newY });
  }

  onMouseUp(e) {
    if (!this.isDragging) return;
    this.isDragging = false;
    Object.assign(this.element.style, { userSelect: "", zIndex: "" });
    this.options.onDragEnd(e);
    document.removeEventListener("mousemove", this.onMouseMove.bind(this));
    document.removeEventListener("mouseup", this.onMouseUp.bind(this));
  }
}
```

---

### 81. 统计全站每一个静态资源加载耗时，该如何做

> **功能简述：** 通过 `PerformanceObserver` 监听 `resource` 类型条目，实时采集每个静态资源的 URL、耗时、传输大小、类型等信息；对耗时超过 3 秒的慢资源立即通过 `sendBeacon` 告警上报；页面加载完成后 1 秒生成汇总报告，按资源类型统计数量、平均耗时、最大耗时及慢资源列表，并取耗时 Top 10，最终通过 `sendBeacon`（降级为 `fetch + keepalive`）上报至监控端。

**解析：**

```javascript
class ResourcePerformanceTracker {
  constructor() {
    this.resources = [];
    this.init();
  }

  init() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "resource") this.recordResource(entry);
      }
    });
    observer.observe({ entryTypes: ["resource"] });
    window.addEventListener("load", () =>
      setTimeout(() => this.report(), 1000),
    );
  }

  recordResource(entry) {
    const resource = {
      name: entry.name.split("/").pop(),
      url: entry.name,
      duration: Math.round(entry.duration),
      size: entry.transferSize,
      type: entry.initiatorType,
      startTime: Math.round(entry.startTime),
      responseStart: Math.round(entry.responseStart - entry.startTime),
      transferSize: entry.transferSize,
      encodedBodySize: entry.encodedBodySize,
      decodedBodySize: entry.decodedBodySize,
    };
    this.resources.push(resource);
    if (entry.duration > 3000) {
      console.warn(`慢资源警告: ${resource.name} 耗时 ${resource.duration}ms`);
      navigator.sendBeacon("/monitor/slow-resource", JSON.stringify(resource));
    }
  }

  report() {
    const stats = {};
    for (const res of this.resources) {
      if (!stats[res.type])
        stats[res.type] = { count: 0, totalDuration: 0, resources: [] };
      const g = stats[res.type];
      g.count++;
      g.totalDuration += res.duration;
      g.resources.push(res);
    }

    const report = {
      pageUrl: location.href,
      timestamp: Date.now(),
      totalCount: this.resources.length,
      byType: Object.entries(stats).map(([type, d]) => ({
        type,
        count: d.count,
        avgDuration: Math.round(d.totalDuration / d.count),
        maxDuration: Math.max(...d.resources.map((r) => r.duration)),
        slowResources: d.resources.filter((r) => r.duration > 2000),
      })),
      topSlowResources: [...this.resources]
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 10),
    };

    console.table(
      report.byType.map((t) => ({
        类型: t.type,
        数量: t.count,
        平均耗时: t.avgDuration + "ms",
        最慢: t.maxDuration + "ms",
      })),
    );

    try {
      navigator.sendBeacon(
        "/monitor/resource-performance",
        JSON.stringify(report),
      );
    } catch {
      fetch("/monitor/resource-performance", {
        method: "POST",
        body: JSON.stringify(report),
        keepalive: true,
      }).catch(() => {});
    }
  }
}

new ResourcePerformanceTracker();
```

## 四、小程序与移动端

### 82. 小程序为什么会有两个线�?

\*_解析�?_
小程序采�?*双线程模�?*�?

1. \*_渲染层（WebView�?_
   - 负责 WXML �?WXSS 的渲�?
   - 运行在独立的 WebView �?

2. \*_逻辑层（JSCore�?_
   - 负责执行 JS 代码
   - 处理数据绑定、事件处理等逻辑

\*_原因�?_

1. \*_安全�?_：隔离逻辑层和渲染层，防止恶意操作 DOM
2. **性能优化**：避�?JS 阻塞 UI 渲染
3. **管控能力**：方便微信进�?API 管控和能力限�?
4. **通信机制**：通过 `Native Bridge` 进行跨线程通信

```
┌─────────────�?    ┌─────────────�?
�? 渲染�?     �?    �? 逻辑�?     �?
�? (WebView)  │◄──►│  (JSCore)   �?
�?            �?    �?            �?
�?WXML/WXSS  �?    �?  JS 代码    �?
└─────────────�?    └─────────────�?
        �?                  �?
        └───────────────────�?
              Native Bridge
```

---

### 83. web 应用中如何对静态资源加载失败的场景做降级处�?[热度:1...]

\*_解析�?_

```javascript
// 方法1：img 标签 onerror
<img src="image.png" onError={handleError} fallback-src="fallback.png" />;

function handleError(e) {
  e.target.src = "/fallback.png";
}

// 方法2：监�?error 事件
window.addEventListener(
  "error",
  (e) => {
    if (e.target.tagName === "IMG" || e.target.tagName === "SCRIPT") {
      console.log("资源加载失败:", e.target.src);
      // 降级处理
      if (e.target.tagName === "IMG") {
        e.target.src = "/placeholder.png";
      }
    }
  },
  true,
);

// 方法3：Performance Observer 监听资源加载失败
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.initiatorType === "img" && !entry.responseStart) {
      console.log("图片加载失败:", entry.name);
    }
  }
});
observer.observe({ entryTypes: ["resource"] });

// 方法4：预加载失败检�?+ 自动重试
function loadWithFallback(src, fallback, maxRetries = 3) {
  return new Promise((resolve, reject) => {
    let retries = 0;

    const attempt = () => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = () => {
        retries++;
        if (retries < maxRetries) {
          attempt();
        } else {
          img.src = fallback; // 使用降级资源
          resolve();
        }
      };
      img.src = src;
    };

    attempt();
  });
}
```

---

### 84. html 中前缀�?data- 开头的元素属性是什么？

\*_解析�?_
`data-*` �?HTML5 引入�?*自定义数据属�?*�?

```html
<div id="user" data-id="123" data-name="张三" data-age="25">用户信息</div>
```

\*_访问方式�?_

```javascript
// 方法1：dataset API
const el = document.getElementById("user");
console.log(el.dataset.id); // "123"
console.log(el.dataset.name); // "张三"
console.log(el.dataset.age); // "25"

// 设置�?
el.dataset.city = "北京";

// 方法2：getAttribute
el.getAttribute("data-id");

// 方法3：CSS 选择�?
document.querySelector('[data-id="123"]');
```

\*_命名规则�?_

- 必须�?`data-` 开�?
- 不能包含大写字母（会自动转小写）
- 支持连字符，会转为驼峰：`data-user-name` �?`dataset.userName`

---

### 85. 移动端如何实现上拉加载，下拉刷新�?

\*_解析�?_

```javascript
class PullRefreshAndLoadMore {
  constructor(container, options = {}) {
    this.container = container;
    this.onRefresh = options.onRefresh || (() => {});
    this.onLoadMore = options.onLoadMore || (() => {});
    this.threshold = options.threshold || 50;

    this.init();
  }

  init() {
    this.bindEvents();
    this.observeScroll();
  }

  bindEvents() {
    let startY = 0;
    let isPulling = false;

    this.container.addEventListener("touchstart", (e) => {
      startY = e.touches[0].clientY;
    });

    this.container.addEventListener("touchmove", (e) => {
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;

      // 下拉刷新：在顶部且向下拖�?
      if (this.container.scrollTop <= 0 && diff > 0) {
        isPulling = true;
        this.showRefreshHint(diff);
        e.preventDefault();
      }

      // 上拉加载：接近底�?
      const { scrollTop, scrollHeight, clientHeight } = this.container;
      if (scrollHeight - scrollTop - clientHeight < this.threshold) {
        this.loadMore();
      }
    });

    this.container.addEventListener("touchend", () => {
      if (isPulling) {
        isPulling = false;
        this.triggerRefresh();
      }
    });
  }

  showRefreshHint(distance) {
    // 显示刷新提示
    const hint = document.getElementById("refresh-hint");
    hint.style.transform = `translateY(${Math.min(distance * 0.5, 60)}px)`;
    hint.style.opacity = distance > 80 ? "1" : "0.6";
  }

  async triggerRefresh() {
    await this.onRefresh();
    this.hideRefreshHint();
  }

  async loadMore() {
    if (!this.isLoading) {
      this.isLoading = true;
      await this.onLoadMore();
      this.isLoading = false;
    }
  }
}
```

---

### 86. 如何判断 dom 元素是否在可视区�?[热度:846]

\*_解析�?_

```javascript
// 方法1：getBoundingClientRect（推荐）
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}

// 方法2：Intersection Observer（性能更好�?
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log("元素进入可视区域:", entry.target);
        // 执行懒加载等操作
      } else {
        console.log("元素离开可视区域:", entry.target);
      }
    });
  },
  {
    threshold: [0, 0.1, 0.5, 1], // 触发阈�?
    rootMargin: "0px 0px -50px 0px", // 边距调整
  },
);

observer.observe(document.querySelector(".lazy-element"));

// 方法3：兼容性方�?
function isInViewportCompat(element) {
  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top <= windowHeight &&
    rect.bottom >= 0 &&
    rect.left <= windowWidth &&
    rect.right >= 0
  );
}
```

---

### 87. 前端如何�?canvas 来做电影院选座功能

\*_解析�?_

```javascript
class CinemaSeatSelector {
  constructor(canvasId, config) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.config = config;
    this.seats = [];
    this.selectedSeats = new Set();

    this.init();
  }

  init() {
    this.createSeats();
    this.draw();
    this.bindEvents();
  }

  createSeats() {
    const { rows, cols, seatSize, gap } = this.config;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        this.seats.push({
          id: `${row}-${col}`,
          x: col * (seatSize + gap),
          y: row * (seatSize + gap),
          width: seatSize,
          height: seatSize,
          status: Math.random() > 0.8 ? "sold" : "available",
          price: this.getPrice(row),
        });
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.seats.forEach((seat) => {
      this.ctx.beginPath();
      this.roundRect(seat.x, seat.y, seat.width, seat.height, 5);

      switch (seat.status) {
        case "selected":
          this.ctx.fillStyle = "#1890ff";
          break;
        case "sold":
          this.ctx.fillStyle = "#d9d9d9";
          break;
        default:
          this.ctx.fillStyle = "#52c41a";
      }

      this.ctx.fill();

      // 绘制座位�?
      this.ctx.fillStyle = "#fff";
      this.ctx.font = "12px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        `${seat.id.split("-")[1] + 1}`,
        seat.x + seat.width / 2,
        seat.y + seat.height / 2 + 4,
      );
    });
  }

  bindEvents() {
    this.canvas.addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const clickedSeat = this.seats.find(
        (seat) =>
          x >= seat.x &&
          x <= seat.x + seat.width &&
          y >= seat.y &&
          y <= seat.y + seat.height &&
          seat.status !== "sold",
      );

      if (clickedSeat) {
        if (this.selectedSeats.has(clickedSeat.id)) {
          this.selectedSeats.delete(clickedSeat.id);
          clickedSeat.status = "available";
        } else {
          this.selectedSeats.add(clickedSeat.id);
          clickedSeat.status = "selected";
        }

        this.draw();
        this.onSelectionChange([...this.selectedSeats]);
      }
    });
  }

  roundRect(x, y, w, h, r) {
    this.ctx.moveTo(x + r, y);
    this.ctx.lineTo(x + w - r, y);
    this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    this.ctx.lineTo(x + w, y + h - r);
    this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.ctx.lineTo(x + r, y + h);
    this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    this.ctx.lineTo(x, y + r);
    this.ctx.quadraticCurveTo(x, y, x + r, y);
  }

  getPrice(row) {
    // 根据排数定价
    if (row < 3) return 80; // 前排便宜
    if (row > 7) return 100; // 后排�?
    return 90; // 中间价格
  }

  onSelectionChange(selectedIds) {
    console.log("已选座�?", selectedIds);
    // 计算总价
    const total = selectedIds.reduce((sum, id) => {
      const seat = this.seats.find((s) => s.id === id);
      return sum + (seat?.price || 0);
    }, 0);
    console.log("总价:", total);
  }
}

// 使用
new CinemaSeatSelector("canvas", {
  rows: 10,
  cols: 15,
  seatSize: 30,
  gap: 5,
});
```

---

### 88. 如何通过设置失效时间清除本地存储的数据？ [热度:1,085]

\*_解析�?_

```javascript
// 封装带过期时间的 Storage
class ExpiryStorage {
  constructor(storage = localStorage) {
    this.storage = storage;
  }

  setItem(key, value, expireInMs) {
    const item = {
      value,
      expire: Date.now() + expireInMs,
    };
    this.storage.setItem(key, JSON.stringify(item));
  }

  getItem(key) {
    const itemStr = this.storage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      if (Date.now() > item.expire) {
        this.removeItem(key);
        return null;
      }
      return item.value;
    } catch {
      return null;
    }
  }

  removeItem(key) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }

  // 清理所有过期数�?
  clearExpired() {
    const keysToRemove = [];

    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      const itemStr = this.storage.getItem(key);

      try {
        const item = JSON.parse(itemStr);
        if (item.expire && Date.now() > item.expire) {
          keysToRemove.push(key);
        }
      } catch {}
    }

    keysToRemove.forEach((key) => this.removeItem(key));
  }
}

// 使用
const storage = new ExpiryStorage(localStorage);

storage.setItem("token", "abc123", 24 * 60 * 60 * 1000); // 24小时过期
const token = storage.getItem("token"); // 过期返回 null

// 页面加载时清理过期数�?
storage.clearExpired();
```

---

### 89. 如果不使用脚手架，用 webpack 构建一个自己的 react 应用

\*_解析�?_

```javascript
// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  devServer: {
    port: 3000,
    hot: true,
    open: true,
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
};
```

```json
// package.json
{
  "name": "my-react-app",
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.22.0",
    "@babel/preset-env": "^7.22.0",
    "@babel/preset-react": "^7.22.0",
    "@babel/plugin-transform-runtime": "^7.22.0",
    "babel-loader": "^9.1.0",
    "clean-webpack-plugin": "^4.0.0",
    "css-loader": "^6.8.0",
    "html-webpack-plugin": "^5.5.0",
    "style-loader": "^3.3.0",
    "webpack": "^5.88.0",
    "webpack-cli": "^5.1.0",
    "webpack-dev-server": "^4.15.0"
  }
}
```

```jsx
// src/App.jsx
import React from "react";

function App() {
  return <h1>Hello React without CRA!</h1>;
}

export default App;

// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

### 90. �?nodejs 实现一个命令行工具，统计输入目录下指定代码的行数、注释行数、空行数

\*_解析�?_

```javascript
#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

function countLines(filePath) {
  return new Promise((resolve) => {
    const stats = {
      total: 0,
      code: 0,
      comment: 0,
      blank: 0,
    };

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    let inBlockComment = false;

    rl.on("line", (line) => {
      stats.total++;
      const trimmed = line.trim();

      if (trimmed === "") {
        stats.blank++;
      } else if (inBlockComment) {
        stats.comment++;
        if (trimmed.includes("*/")) {
          inBlockComment = false;
        }
      } else if (trimmed.startsWith("//")) {
        stats.comment++;
      } else if (trimmed.startsWith("/*")) {
        stats.comment++;
        if (!trimmed.includes("*/")) {
          inBlockComment = true;
        }
      } else if (trimmed.startsWith("*")) {
        stats.comment++;
      } else {
        stats.code++;
      }
    });

    rl.on("close", () => resolve(stats));
  });
}

async function countDirectory(dirPath, ext) {
  const files = [];

  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== "node_modules" && entry.name !== ".git") {
          walkDir(fullPath);
        }
      } else if (ext ? entry.name.endsWith(ext) : true) {
        files.push(fullPath);
      }
    }
  }

  walkDir(dirPath);

  const result = {
    files: {},
    total: { total: 0, code: 0, comment: 0, blank: 0 },
  };

  for (const file of files) {
    const stats = await countLines(file);
    result.files[file] = stats;
    result.total.total += stats.total;
    result.total.code += stats.code;
    result.total.comment += stats.comment;
    result.total.blank += stats.blank;
  }

  return result;
}

// CLI 入口
const args = process.argv.slice(2);
const dir = args[0] || process.cwd();
const ext = args[1];

console.log(`\n📊 统计目录: ${dir}`);
if (ext) console.log(`文件类型: ${ext}`);
console.log("-".repeat(50));

countDirectory(dir, ext).then((result) => {
  Object.entries(result.files).forEach(([file, stats]) => {
    console.log(`\n${path.basename(file)}:`);
    console.log(
      `  总行�? ${stats.total} | 代码: ${stats.code} | 注释: ${stats.comment} | 空白: ${stats.blank}`,
    );
  });

  console.log("\n" + "=".repeat(50));
  console.log("\n📈 总计:");
  console.log(`  文件�? ${Object.keys(result.files).length}`);
  console.log(`  总行�? ${result.total.total}`);
  console.log(
    `  代码�? ${result.total.code} (${((result.total.code / result.total.total) * 100).toFixed(1)}%)`,
  );
  console.log(
    `  注释�? ${result.total.comment} (${((result.total.comment / result.total.total) * 100).toFixed(1)}%)`,
  );
  console.log(
    `  空白�? ${result.total.blank} (${((result.total.blank / result.total.total) * 100).toFixed(1)}%)`,
  );
});
```

---

### 91. package.json 里面 sideEffects 属性的作用是啥 [热度:229]

\*_解析�?_
`sideEffects` 用于告诉打包工具（Webpack、Rollup）该模块是否有副作用�?

```json
{
  "sideEffects": false
}
```

\*_作用�?_

1. **启用 Tree Shaking**：标记为 `false` 时，打包工具可以安全地移除未使用的导�?
2. **优化产物体积**：减少不必要的代码打�?

\*_配置方式�?_

```json
{
  "sideEffects": false, // 无副作用，可完全 tree-shaking
  "sideEffects": ["*.css", "*.less"], // CSS 有副作用
  "sideEffects": ["./src/utils/*"] // 指定文件有副作用
}
```

\*_示例�?_

```javascript
// utils.js
export function used() {
  return "used";
}
export function unused() {
  return "unused";
}

// main.js
import { used } from "./utils.js";

// 如果 sideEffects: false，unused 会被 tree-shaking 移除
```

---

### 92. script 标签上有哪些属性，分别作用是啥�?[热度:744]

\*_解析�?_

| 属�?          | 作用                                   |
| ------------- | -------------------------------------- |
| `src`         | 外部脚本路径                           |
| `type`        | 脚本类型（module/text/javascript�?     |
| `async`       | 异步加载，下载完立即执行（不保证顺序�? |
| `defer`       | 异步加载，DOM 解析完成后按顺序执行     |
| `charset`     | 字符编码                               |
| `crossorigin` | CORS 设置                              |
| `integrity`   | SRI（子资源完整性校验）                |
| `nomodule`    | 不支�?ES Module 时加�?                 |
| `noModule`    | 支持 ES Module 时不加载                |

```html
<!-- async vs defer 对比 -->
<script src="a.js" async></script>
<!-- 异步，立即执�?-->
<script src="b.js" defer></script>
<!-- 异步，DOMContentLoaded 前执�?-->

<!-- ES Module -->
<script type="module" src="app.js"></script>

<!-- SRI 安全校验 -->
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-xxx"
  crossorigin="anonymous"
></script>
```

\*_执行顺序�?_

1. 普�?script：同步阻塞，按顺序执�?
2. async：异步加载，下载完立即执行（无序�?
3. defer：异步加载，DOM 解析后按顺序执行

---

### 93. 为什�?SPA 应用都会提供一�?hash 路由，好处是什么？ [热度:...]

\*_解析�?_
Hash 路由使用 URL 中的 `#` 后面的部分作为路由标识�?

\*_优点�?_

1. \*_无需服务器配�?_：Hash 变化不会触发服务器请�?
2. **兼容性好**：支持所有浏览器
3. \*_部署简�?_：静态服务器即可部署
4. **避免 404**：刷新页面不会请求不存在的路�?

```javascript
// Hash 路由实现原理
class HashRouter {
  constructor() {
    this.routes = {};
    window.addEventListener("hashchange", () => {
      this.render();
    });
  }

  register(path, handler) {
    this.routes[path] = handler;
  }

  render() {
    const hash = location.hash.slice(1) || "/";
    const handler = this.routes[hash];
    handler?.();
  }
}
```

\*_对比 History 路由�?_

| 特�?       | Hash 路由 | History 路由 |
| ---------- | --------- | ------------ |
| URL 美观�? | �?# �?    | 更美�?       |
| 服务器要�? | 无需配置  | 需要回退配置 |
| SEO        | 不友�?    | 可配置支�?   |
| 兼容�?     | 全兼�?    | 需�?HTML5    |

---

### 94. [React] 如何进行路由变化监听 [热度:698]

\*_解析�?_

```javascript
// 方法1：useLocation Hook（React Router v6�?
import { useLocation, useEffect } from "react-router-dom";

function MyComponent() {
  const location = useLocation();

  useEffect(() => {
    console.log("路由变化:", location.pathname);
    // 执行相关操作
  }, [location]);

  return <div>...</div>;
}

// 方法2：自定义 Hook
function useRouteChange(callback) {
  const location = useLocation();
  const prevLocationRef = useRef(location);

  useEffect(() => {
    if (prevLocationRef.current.pathname !== location.pathname) {
      callback(location, prevLocationRef.current);
      prevLocationRef.current = location;
    }
  }, [location, callback]);
}

// 使用
useRouteChange((location, prevLocation) => {
  console.log(`�?${prevLocation.pathname} �?${location.pathname}`);
});

// 方法3：history.listen（React Router v5�?
import { useHistory } from "react-router-dom";

function MyComponent() {
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      console.log(action, location.pathname);
    });
    return unlisten;
  }, [history]);
}

// 方法4：全局监听（适用于埋点）
function setupRouteTracking(history) {
  history.listen((location) => {
    trackPageView(location.pathname);
  });
}
```

---

### 95. 单点登录是什么，具体流程是什�?

\*_解析�?_
单点登录（SSO, Single Sign-On）允许用户一次登录即可访问多个相互信任的应用系统�?

\*_流程�?_

```
┌─────────�?    ┌─────────�?    ┌─────────�?
�?用户     �?    �?应用A   �?    �?认证中心  �?
└────┬────�?    └────┬────�?    └────┬────�?
     �?              �?              �?
     �? 1.访问应用A   �?              �?
     ├──────────────►│               �?
     �?              �?              �?
     �?              �? 2.未登录，跳转 �?
     �?              ├──────────────►│
     �?              �?              �?
     �? 3.显示登录�? �?              �?
     │◄──────────────�?              �?
     �?              �?              �?
     �? 4.输入凭证    �?              �?
     ├───────────────┤──────────────►│
     �?              �?              �?
     �?              �? 5.验证成功    �?
     �?              │◄──────────────�?
     �?              �?              �?
     �?              �? 6.携带Ticket  �?
     │◄──────────────┤───────────────�?
     �?              �?              �?
     �? 7.设置Session �?              �?
     ├──────────────►│               �?
     �?              �?              �?
     �? 8.访问应用B   �?              �?
     ├──────────────────────────────►│
     �?              �?              �?
     �?              �? 9.已登录，放行 �?
     │◄──────────────────────────────�?
```

\*_实现方式�?_

1. **Cookie + Session**：共享认证中心的 Cookie
2. **JWT Token**：认证中心签�?Token，各应用验证
3. **CAS 协议**：Central Authentication Service 标准

---

### 96. web 网页访问如何禁止别人移除水印 [热度:540]

\*_解析�?_

```javascript
// 方案1：Canvas 水印（推荐）
class Watermark {
  constructor(options) {
    this.options = {
      text: "机密文档",
      fontSize: 16,
      color: "rgba(200, 200, 200, 0.3)",
      rotate: -20,
      ...options,
    };
    this.init();
  }

  init() {
    this.createWatermark();
    this.preventRemove();
  }

  createWatermark() {
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");

    ctx.font = `${this.options.fontSize}px Arial`;
    ctx.fillStyle = this.options.color;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((this.options.rotate * Math.PI) / 180);
    ctx.textAlign = "center";
    ctx.fillText(this.options.text, 0, 0);

    this.watermarkDiv = document.createElement("div");
    this.watermarkDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 99999;
      background-image: url(${canvas.toDataURL()});
      background-repeat: repeat;
    `;
    document.body.appendChild(this.watermarkDiv);
  }

  preventRemove() {
    // MutationObserver 监听水印移除
    const observer = new MutationObserver(() => {
      if (!document.body.contains(this.watermarkDiv)) {
        document.body.appendChild(this.watermarkDiv);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 定时检�?
    setInterval(() => {
      if (!document.body.contains(this.watermarkDiv)) {
        document.body.appendChild(this.watermarkDiv);
      }
    }, 1000);

    // 禁止开发者工具删�?
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function (child) {
      if (child === this.watermarkDiv) {
        return child;
      }
      return originalRemoveChild.call(this, child);
    }.bind(this);
  }
}

new Watermark({ text: "内部资料" });
```

---

### 97. 用户访问页面白屏了，原因是啥，如何排查？

\*_解析�?_

\*_常见原因�?_

1. **JS 报错导致渲染中断**
2. **资源加载失败**（CDN 问题、网络问题）
3. \**SSR/CSR 不匹�?*�?hydration 错误�?
4. \*_浏览器兼容性问�?_
5. **内存溢出**

\*_排查方法�?_

```javascript
// 1. 全局错误捕获
window.addEventListener("error", (e) => {
  reportError({
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno,
    stack: e.error?.stack,
  });
});

// 2. Promise 未捕获错�?
window.addEventListener("unhandledrejection", (e) => {
  reportError({
    reason: e.reason,
    type: "unhandledrejection",
  });
});

// 3. 资源加载监控
window.addEventListener(
  "error",
  (e) => {
    if (e.target !== window) {
      reportError({
        type: "resource_error",
        target: e.target.src || e.target.href,
      });
    }
  },
  true,
);

// 4. 白屏检�?
function detectWhiteScreen() {
  const bodyElements = document.body.children.length;
  const htmlContent = document.documentElement.innerHTML.length;

  if (bodyElements === 0 || htmlContent < 500) {
    reportError({
      type: "white_screen",
      url: location.href,
      timestamp: Date.now(),
    });
  }
}

setTimeout(detectWhiteScreen, 3000);

// 5. Performance 监控
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === "navigation") {
      const timing = entry;
      if (timing.domContentLoadedEventEnd === 0) {
        reportError({ type: "dom_not_ready" });
      }
    }
  }
});
observer.observe({ entryTypes: ["navigation"] });
```

---

### 98. [代码实现]JS 中如何实现大对象深度对比 [热度:906]

\*_解析�?_

```javascript
function deepEqual(a, b) {
  // 相同引用
  if (a === b) return true;

  // 类型不同
  if (typeof a !== typeof b) return false;

  // null 检�?
  if (a == null || b == null) return a === b;

  // 基本类型
  if (typeof a !== "object") return a === b;

  // 数组 vs 对象
  const isArrayA = Array.isArray(a);
  const isArrayB = Array.isArray(b);
  if (isArrayA !== isArrayB) return false;

  // 数组长度不同
  if (isArrayA && a.length !== b.length) return false;

  // 键数量不�?
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  // 递归比较每个�?
  for (const key of keysA) {
    if (!deepEqual(a[key], b[key])) return false;
  }

  // 处理 Map
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, val] of a) {
      if (!deepEqual(val, b.get(key))) return false;
    }
    return true;
  }

  // 处理 Set
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const val of a) {
      if (!b.has(val)) return false;
    }
    return true;
  }

  // 处理 Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // 处理 RegExp
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString();
  }

  // 处理循环引用
  const seen = new WeakMap();
  function checkCycle(obj1, obj2) {
    if (seen.has(obj1)) return seen.get(obj1) === obj2;
    seen.set(obj1, obj2);
    return deepEqual(obj1, obj2);
  }

  return checkCycle(a, b);
}

// 测试
const obj1 = { a: 1, b: { c: [1, 2] }, d: new Set([1]) };
const obj2 = { a: 1, b: { c: [1, 2] }, d: new Set([1]) };
console.log(deepEqual(obj1, obj2)); // true
```

---

### 99. 如何理解数据驱动视图，有哪些核心要素? [热度:943]

**解析�?*
数据驱动视图是现代前端框架的核心思想�?*UI 是数据的函数映射**�?

\*_核心要素�?_

1. \*_响应式数�?_

```javascript
// Vue 3 响应�?
const state = reactive({ count: 0 });

// React State
const [count, setCount] = useState(0);
```

2. \*_声明式模�?_

```jsx
// 数据变化自动更新视图
<div>{count}</div> // �?count 变化时自动更�?
```

3. **虚拟 DOM / Diff 算法**

- �?JS 对象描述 DOM 结构
- 对比新旧虚拟 DOM，最小化更新

4. \*_依赖收集与更新调�?_

```
数据变化 �?通知依赖 �?重新渲染 �?Diff �?更新真实 DOM
```

\*_优势�?_

- 关注点分离：只关心数据，不用操作 DOM
- 可预测性：相同输入产生相同输出
- 易于测试：纯函数易于单元测试

---

### 100. vue-cli 都做了哪些事，有哪些功能�?[热度:386]

\*_解析�?_
Vue CLI 提供了完整的 Vue 项目脚手架功能：

\*_核心功能�?_

1. **项目创建**

```bash
vue create my-project
# 交互式选择：预设、插件、配�?
```

2. **内置 Webpack 配置**

- Babel 编译 ES6+
- CSS 预处理器（Sass/Less/Stylus�?
- 热模块替换（HMR�?
- 代码分割与懒加载

3. **插件系统**

```bash
# 安装官方插件
vue add router
vue add vuex
vue add eslint

# 第三方插�?
vue add @vue/cli-plugin-pwa
vue add element-ui
```

4. \*_开发服�?_

- 本地开发服务器
- 代理配置
- 环境变量管理�?env�?

5. **构建优化**

- Tree-shaking
- 压缩混淆
- Source Map
- CDN 外部�?

6. \*_图形化管理界�?_

```bash
vue ui
# 浏览器打开项目管理界面
```

\*_项目结构生成�?_

```
my-project/
├── public/
├── src/
�?  ├── assets/
�?  ├── components/
�?  ├── views/
�?  ├── App.vue
�?  └── main.js
├── .env.development
├── .env.production
├── babel.config.js
├── vue.config.js
└── package.json
```

---

### 101. JS 执行 100 万个任务，如何保证浏览器不卡顿？ [热度:806]

\*_解析�?_

```javascript
// 方法1：requestIdleCallback（推荐）
function runTasksIdle(tasks, callback) {
  let index = 0;

  function runChunk(deadline) {
    while (deadline.timeRemaining() > 0 && index < tasks.length) {
      tasks[index++]();
    }

    if (index < tasks.length) {
      requestIdleCallback(runChunk);
    } else {
      callback?.();
    }
  }

  requestIdleCallback(runChunk);
}

// 方法2：requestAnimationFrame 分片
function runTasksRAF(tasks, chunkSize = 50) {
  let index = 0;

  function runChunk() {
    const end = Math.min(index + chunkSize, tasks.length);
    while (index < end) {
      tasks[index++]();
    }

    if (index < tasks.length) {
      requestAnimationFrame(runChunk);
    }
  }

  requestAnimationFrame(runChunk);
}

// 方法3：setTimeout 分片（兼容性最好）
function runTasksTimeout(tasks, delay = 0) {
  let index = 0;

  function runChunk() {
    const start = performance.now();
    while (index < tasks.length && performance.now() - start < 10) {
      tasks[index++]();
    }

    if (index < tasks.length) {
      setTimeout(runChunk, delay);
    }
  }

  setTimeout(runChunk, delay);
}

// 方法4：Web Worker（真正并行）
function runTasksWorker(tasks) {
  return new Promise((resolve) => {
    const worker = new Worker(
      URL.createObjectURL(
        new Blob(
          [
            `self.onmessage = (e) => { 
            const tasks = e.data.tasks;
            tasks.forEach(fn => fn()); 
            self.postMessage('done'); 
          }`,
          ],
          { type: "application/javascript" },
        ),
      ),
    );

    worker.onmessage = () => {
      worker.terminate();
      resolve();
    };

    worker.postMessage({ tasks });
  });
}

// 使用示例
const tasks = Array.from({ length: 1000000 }, (_, i) => () => {
  // 执行任务
  console.count("task");
});

runTasksIdle(tasks, () => console.log("完成"));
```

---

### 102. JS 放在 head 里和放在 body 里有什么区�? [热度:420]

\*_解析�?_

| 位置          | 特点           | 影响               |
| ------------- | -------------- | ------------------ |
| `<head>` �?   | DOM 未构建完�? | 可能找不�?DOM 元素 |
| `<body>` 底部 | DOM 已构建完�? | 可正常操�?DOM      |

**最佳实践：**

```html
<!-- 1. head �?+ defer（推荐） -->
<head>
  <script src="app.js" defer></script>
</head>

<!-- 2. body 底部 -->
<body>
  <div id="app"></div>
  <script src="app.js"></script>
</body>

<!-- 3. head �?+ async（非关键脚本�?-->
<head>
  <script src="analytics.js" async></script>
</head>

<!-- 4. 动态加�?-->
<body>
  <script>
    function loadScript(src) {
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      document.head.appendChild(script);
    }
    loadScript("app.js");
  </script>
</body>
```

\*_执行顺序�?_

```
HTML 解析 �?遇到普�?script �?阻塞解析 �?执行 JS �?继续解析
HTML 解析 �?遇到 defer script �?继续解析 �?解析完成后执�?JS
HTML 解析 �?遇到 async script �?继续解析 �?下载完立即执�?
```

---

### 103. Eslint 代码检查的过程是啥�?[热度:111]

\*_解析�?_

ESLint 检查流程：

```
源代�?�?解析�?AST) �?遍历AST节点 �?规则匹配 �?生成报告
```

\*_详细步骤�?_

1. **读取配置**

```javascript
// .eslintrc.js
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  plugins: ["react-hooks"],
  rules: {
    "no-unused-vars": "warn",
    "react-hooks/rules-of-hooks": "error",
  },
};
```

2. **词法分析 & 语法分析**

```javascript
// 源代�?
const x = 1;

// AST（抽象语法树�?
{
  "type": "Program",
  "body": [{
    "type": "VariableDeclaration",
    "declarations": [{
      "type": "VariableDeclarator",
      "id": { "type": "Identifier", "name": "x" },
      "init": { "type": "Literal", "value": 1 }
    }],
    "kind": "const"
  }]
}
```

3. \*_遍历并应用规�?_

```javascript
// 自定义规则示�?
module.exports = {
  meta: { type: "problem" },
  create(context) {
    return {
      VariableDeclarator(node) {
        if (node.id.name.length === 1) {
          context.report({
            node,
            messageId: "shortName",
            data: { name: node.id.name },
          });
        }
      },
    };
  },
  messages: {
    shortName: '变量�?"{{name}}" 太短',
  },
};
```

4. **输出结果**

```
/path/to/file.js
  1:7  warning  变量�?"x" 太短  no-short-names
�?1 problem (0 errors, 1 warning)
```

---

### 104. 虚拟滚动加载原理是什么，�?JS 代码简单实现一个虚拟滚动加�?

\*_解析�?_
虚拟滚动只渲染可视区域内的列表项，大幅提升长列表性能�?

```javascript
class VirtualScrollList {
  constructor(options) {
    this.container = options.container;
    this.itemHeight = options.itemHeight || 50;
    this.items = options.items || [];
    this.bufferSize = options.bufferSize || 5;

    this.viewportHeight = this.container.clientHeight;
    this.scrollTop = 0;

    this.init();
  }

  init() {
    this.container.style.overflow = "auto";
    this.render();
    this.bindEvents();
  }

  getVisibleRange() {
    const startIndex = Math.max(
      0,
      Math.floor(this.scrollTop / this.itemHeight) - this.bufferSize,
    );
    const endIndex = Math.min(
      this.items.length,
      Math.ceil((this.scrollTop + this.viewportHeight) / this.itemHeight) +
        this.bufferSize,
    );
    return { startIndex, endIndex };
  }

  render() {
    const { startIndex, endIndex } = this.getVisibleRange();
    const visibleItems = this.items.slice(startIndex, endIndex);

    // 创建内容容器
    const contentHeight = this.items.length * this.itemHeight;
    const offsetY = startIndex * this.itemHeight;

    this.container.innerHTML = `
      <div style="height: ${contentHeight}px; position: relative;">
        <div style="transform: translateY(${offsetY}px);">
          ${visibleItems
            .map(
              (item, i) => `
            <div style="height: ${this.itemHeight}px; border-bottom: 1px solid #eee; padding: 10px;">
              ${this.renderItem(item, startIndex + i)}
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `;
  }

  renderItem(item, index) {
    return `<strong>#${index}</strong>: ${typeof item === "object" ? JSON.stringify(item) : item}`;
  }

  bindEvents() {
    this.container.addEventListener("scroll", () => {
      this.scrollTop = this.container.scrollTop;
      this.render(); // 使用节流优化
    });
  }

  updateItems(newItems) {
    this.items = newItems;
    this.render();
  }
}

// 使用
const container = document.getElementById("list-container");
const items = Array.from({ length: 10000 }, (_, i) => `Item ${i}`);

new VirtualScrollList({
  container,
  items,
  itemHeight: 50,
  bufferSize: 5,
});
```

---

### 105. [React] react-router 和原生路由区�?[热度:434]

\*_解析�?_

| 特�?     | React Router   | 原生路由          |
| -------- | -------------- | ----------------- |
| 路由模式 | Hash / History | �?Hash 或手动实�? |
| 声明�?   | �?JSX 声明�?   | �?命令�?          |
| 嵌套路由 | �?支持         | �?手动处理        |
| 路由守卫 | �?组件级别     | �?手动拦截        |
| 动态参�? | �?useParams    | �?手动解析        |
| 404 处理 | �?Route 组件   | �?手动判断        |

```jsx
// React Router v6 示例
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<Login />} />

        {/* 需要认证的路由 */}
        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// 路由守卫组件
function AuthLayout() {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // 渲染子路�?
}
```

---

### 106. html 的行内元素和块级元素的区�?[热度:796]

\*_解析�?_

| 特�?           | 块级元素              | 行内元素                        |
| -------------- | --------------------- | ------------------------------- |
| 显示           | 独占一�?              | 并排显示                        |
| 宽度           | 默认 100%             | 由内容决�?                      |
| 高度           | 可设�?                | 无效（除替换元素�?              |
| margin/padding | 四边有效              | 左右有效，上下无�?              |
| 可包�?         | 块级+行内             | 只能包含行内                    |
| 常见标签       | div, p, h1-h6, ul, li | span, a, img, input, em, strong |

\*_CSS 转换�?_

```css
/* 行内转块�?*/
span {
  display: block;
}

/* 块级转行�?*/
div {
  display: inline;
}

/* 行内块级 */
button {
  display: inline-block;
}
```

\*_特殊说明�?_

- `img`、`input` �?\*替换元素\*\*（replaced element），可以设置宽高
- `inline-block` 兼具两者特点：可并排、可设宽�?

---

### 107. 介绍一�?requestIdleCallback api [热度:290]

\*_解析�?_
`requestIdleCallback` 在浏览器空闲时执行回调，适合低优先级任务�?

```javascript
// 基本用法
requestIdleCallback(
  (deadline) => {
    console.log("剩余时间:", deadline.timeRemaining());
    console.log("是否超时:", deadline.didTimeout);

    // 在空闲时间内执行任务
    while (deadline.timeRemaining() > 0 && hasMoreWork) {
      doWork();
    }

    // 还有未完成的任务，下次空闲继�?
    if (hasMoreWork) {
      requestIdleCallback(doWork);
    }
  },
  { timeout: 2000 },
); // 超时时间（可选）

// 应用场景：批量更�?
function batchUpdate(items) {
  let index = 0;

  function processBatch(deadline) {
    while (deadline.timeRemaining() > 0 && index < items.length) {
      updateItem(items[index++]);
    }

    if (index < items.length) {
      requestIdleCallback(processBatch);
    }
  }

  requestIdleCallback(processBatch);
}

// 兼容�?polyfill
window.requestIdleCallback =
  window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

window.cancelIdleCallback =
  window.cancelIdleCallback || ((id) => clearTimeout(id));
```

\*_�?requestAnimationFrame 对比�?_

| 特�?     | rAF                  | rIC                |
| -------- | -------------------- | ------------------ |
| 执行时机 | 每帧�?               | 浏览器空�?         |
| 适用场景 | 动画、视觉更�?       | 低优先级后台任务   |
| 时间保证 | �?16ms/�?            | 不保�?             |
| 取消     | cancelAnimationFrame | cancelIdleCallback |

---

### 108. documentFragment api 是什么，有哪些使用场�? [热度:115]

\*_解析�?_
DocumentFragment 是轻量级的文档片段，用于批量操作 DOM�?

```javascript
// 创建 DocumentFragment
const fragment = document.createDocumentFragment();

// 批量添加元素（只触发一�?reflow�?
const list = document.getElementById("list");
for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}
list.appendChild(fragment); // 一次性插�?

// 场景1：模板克�?
const template = document.getElementById("template");
const clone = template.content.cloneNode(true);
clone.querySelector(".title").textContent = "新标�?;
document.body.appendChild(clone);

// 场景2：DOM 操作优化
function renderList(data) {
  const fragment = document.createDocumentFragment();

  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<h3>${item.title}</h3><p>${item.desc}</p>`;
    fragment.appendChild(div);
  });

  container.appendChild(fragment);
}

// 场景3：节点移�?
function moveNodes(source, target) {
  const fragment = document.createDocumentFragment();
  while (source.firstChild) {
    fragment.appendChild(source.firstChild);
  }
  target.appendChild(fragment);
}
```

\*_优点�?_

1. **性能优化**：减�?DOM 操作次数，降�?reflow/reflow
2. **内存友好**：不在文档树中，不影响布局
3. \*_API 一�?_：支�?appendChild、querySelector �?DOM API

---

### 109. 防止前端页面重复请求 [热度:?]

> **简述：** 通过请求锁（pending 标记）、请求取消（AbortController）、请求去重（相同请求复用 Promise）三种策略防止重复请求。

**解析：**

```javascript
// 方法1：请求锁 - 用 Map 记录正在进行的请求
const pendingRequests = new Map();

function generateKey(config) {
  return [
    config.method,
    config.url,
    JSON.stringify(config.params),
    JSON.stringify(config.data),
  ].join("&");
}

function removePendingRequest(config) {
  const key = generateKey(config);
  if (pendingRequests.has(key)) {
    pendingRequests.delete(key);
  }
}

// axios 拦截器中使用
axios.interceptors.request.use((config) => {
  const key = generateKey(config);
  if (pendingRequests.has(key)) {
    const controller = new AbortController();
    config.signal = controller.signal;
    controller.abort();
  } else {
    config.requestKey = key;
    pendingRequests.set(key, true);
  }
  return config;
});

axios.interceptors.response.use(
  (res) => {
    removePendingRequest(res.config);
    return res;
  },
  (err) => {
    removePendingRequest(err.config);
    return Promise.reject(err);
  },
);

// 方法2：请求去重 - 相同请求复用同一个 Promise
const pendingPromises = new Map();

function dedupRequest(key, requestFn) {
  if (pendingPromises.has(key)) {
    return pendingPromises.get(key);
  }
  const promise = requestFn().finally(() => {
    pendingPromises.delete(key);
  });
  pendingPromises.set(key, promise);
  return promise;
}

// 方法3：节流/防抖控制提交按钮
function useThrottle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      return fn.apply(this, args);
    }
  };
}
```

---

### 110. ResizeObserver 作用是什么?

> **简述：** `ResizeObserver` 是浏览器提供的 API，用于监听元素尺寸变化（宽高），当被观察元素的尺寸发生改变时触发回调，常用于响应式布局、自适应组件等场景。

**解析：**

```javascript
const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    console.log(`${entry.target.tagName} 尺寸变化: ${width}x${height}`);
  }
});

observer.observe(document.querySelector(".container"));

// 停止观察
// observer.unobserve(element);
// observer.disconnect();

// 应用场景：
// 1. 组件自适应：根据容器尺寸切换布局
// 2. 虚拟滚动：监听容器高度变化重新计算可见项
// 3. 图表自适应：容器变化时重绘图表
// 4. 文本溢出检测：容器缩小时判断是否需要省略号
```

---

### 111. 要实时统计用户浏览器窗口大小，该如何做?

> **简述：** 监听 `window.resize` 事件配合防抖获取 `window.innerWidth/innerHeight`，或使用 `ResizeObserver` 观察 `document.documentElement`。

**解析：**

```javascript
// 方法1：resize + 防抖
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const reportViewport = debounce(() => {
  const data = {
    width: window.innerWidth,
    height: window.innerHeight,
    url: location.href,
    timestamp: Date.now(),
  };
  navigator.sendBeacon("/analytics/viewport", JSON.stringify(data));
}, 500);

window.addEventListener("resize", reportViewport);

// 方法2：ResizeObserver 观察 html 元素
const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    console.log(`视口尺寸: ${width}x${height}`);
  }
});
observer.observe(document.documentElement);

// 方法3：定时采样（适合低频统计场景）
setInterval(() => {
  const data = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}, 10000);
```

---

### 112. 当项目报错，你想定位是哪个 commit 引入的错误的时候，你该怎么做?

> **简述：** 使用 `git bisect` 二分查找法，自动在好版本和坏版本之间逐步缩小范围，精确定位引入 bug 的 commit。

**解析：**

```bash
# git bisect 二分查找
git bisect start
git bisect bad                  # 当前版本有 bug
git bisect good <commit-hash>  # 指定一个没有 bug 的版本

# Git 会自动 checkout 中间的 commit，你测试后标记：
git bisect good   # 当前 commit 没问题
git bisect bad    # 当前 commit 有问题

# 重复直到找到引入错误的 commit，然后重置：
git bisect reset

# 自动化：配合测试脚本
git bisect run npm test
# Git 会自动运行 npm test，根据退出码判断 good/bad
```

```javascript
// 也可以手动二分查找
// 1. git log --oneline 查看提交历史
// 2. git checkout <mid-commit> 切到中间 commit
// 3. 测试并缩小范围
// 4. 重复直到定位
```

---

### 113. 如何移除一个指定的 commit

> **简述：** 使用 `git rebase -i` 交互式删除，或 `git revert` 生成反向提交，或 `git reset --hard` 回退后重新提交。

**解析：**

```bash
# 方法1：git rebase -i（推荐，彻底移除）
git rebase -i <commit-hash>^
# 在编辑器中将目标 commit 的 pick 改为 drop（或直接删除那行）
# 保存退出即可

# 方法2：git revert（安全，生成反向提交，不修改历史）
git revert <commit-hash>
# 会创建一个新的 commit 来撤销指定 commit 的修改
# 适用于已 push 到远端、多人协作的场景

# 方法3：git reset（回退到指定 commit 之前）
git reset --hard <commit-hash>^
git push --force-with-lease
# 危险操作，会丢失之后的 commit，仅适用于未 push 或个人分支

# 方法4：cherry-pick 保留需要的 commit
git rebase -i HEAD~5
# 删除不需要的 commit，保留其他 commit
```

---

### 114. 如何还原用户操作流程

> **简述：** 通过录制用户操作（事件监听 + 快照）、DOM 快照回放、操作日志记录等方式还原用户操作流程，常用于问题排查和用户行为分析。

**解析：**

```javascript
// 方法1：rrweb 录制与回放（业界主流方案）
// import { record } from 'rrweb';
// record({
//   emit(event) {
//     events.push(event);
//   },
// });

// 方法2：手动记录用户操作
class UserActionRecorder {
  constructor() {
    this.actions = [];
    this.init();
  }

  init() {
    document.addEventListener(
      "click",
      (e) => {
        this.actions.push({
          type: "click",
          target: e.target.tagName + (e.target.id ? `#${e.target.id}` : ""),
          x: e.clientX,
          y: e.clientY,
          timestamp: Date.now(),
        });
      },
      true,
    );

    document.addEventListener(
      "input",
      (e) => {
        this.actions.push({
          type: "input",
          target: e.target.tagName,
          value: e.target.value,
          timestamp: Date.now(),
        });
      },
      true,
    );

    document.addEventListener(
      "scroll",
      () => {
        this.actions.push({
          type: "scroll",
          scrollY: window.scrollY,
          timestamp: Date.now(),
        });
      },
      true,
    );

    window.addEventListener("beforeunload", () => {
      navigator.sendBeacon("/analytics/actions", JSON.stringify(this.actions));
    });
  }
}

// 方法3：DOM 快照 + MutationObserver
const observer = new MutationObserver((mutations) => {
  mutations.forEach((m) => {
    console.log("DOM 变化:", m.type, m.target);
  });
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
});
```

---

### 115. 可有办法将请求的源码地址包括代码行数也上报上去？

> **简述：** 利用 `Error.stack` 获取调用栈，解析出源码文件路径和行号；或通过 Source Map 反编译还原源码位置；也可使用 `import.meta.url` 获取当前模块地址。

**解析：**

```javascript
// 方法1：Error.stack 获取调用栈
function getSourceInfo() {
  const stack = new Error().stack;
  const lines = stack.split("\n");
  // stack[0] 是 Error, stack[1] 是当前函数, stack[2] 是调用者
  const callerLine = lines[2] || "";
  const match = callerLine.match(/at\s+.*\s+\(?(https?:\/\/.+):(\d+):(\d+)\)?/);
  if (match) {
    return {
      file: match[1],
      line: match[2],
      column: match[3],
    };
  }
  return null;
}

// 在请求拦截器中自动附加源码信息
axios.interceptors.request.use((config) => {
  const sourceInfo = getSourceInfo();
  if (sourceInfo) {
    config.headers["X-Source-File"] = sourceInfo.file;
    config.headers["X-Source-Line"] = sourceInfo.line;
  }
  return config;
});

// 方法2：Source Map 反编译（服务端处理）
// 构建时生成 source map 并上传到监控平台
// 监控平台收到报错后，利用 source-map 库还原原始位置
// const { SourceMapConsumer } = require('source-map');
// const consumer = await new SourceMapConsumer(sourceMapContent);
// const pos = consumer.originalPositionFor({ line: 1, column: 100 });

// 方法3：Vite/Webpack 插件自动注入构建信息
// 构建时在代码中注入 __FILE__ 和 __LINE__ 宏
```

---

### 116. 请求失败会弹出一个 toast，如何保证此批请求失败，只弹出一个?

> **简述：** 使用防抖（debounce）合并同一时间段内的 toast，或收集错误后延迟统一弹出一个汇总 toast，或用标记位控制只弹一次。

**解析：**

```javascript
// 方法1：防抖合并 toast
let toastTimer = null;
const pendingErrors = [];

function showErrorToast(message) {
  pendingErrors.push(message);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    const count = pendingErrors.length;
    const msg =
      count > 1
        ? `${pendingErrors[0]} 等 ${count} 个请求失败`
        : pendingErrors[0];
    Toast.error(msg);
    pendingErrors.length = 0;
  }, 300);
}

// 方法2：axios 拦截器中统一处理
let errorCount = 0;
let errorTimer = null;

axios.interceptors.response.use(null, (error) => {
  errorCount++;
  clearTimeout(errorTimer);
  errorTimer = setTimeout(() => {
    if (errorCount > 0) {
      Toast.error(`${errorCount} 个请求失败，请稍后重试`);
      errorCount = 0;
    }
  }, 500);
  return Promise.reject(error);
});

// 方法3：请求分组标记
const shownGroups = new Set();

function showGroupedToast(groupKey, message) {
  if (shownGroups.has(groupKey)) return;
  shownGroups.add(groupKey);
  Toast.error(message);
  setTimeout(() => shownGroups.delete(groupKey), 3000);
}
```

---

### 117. 如何减少项目里面 if-else [热度:310]

> **简述：** 使用策略模式（Map/对象映射）、三元表达式、可选链、卫语句（提前 return）、多态等方式替代复杂的 if-else 嵌套。

**解析：**

```javascript
// 1. 策略模式 - Map/对象映射替代 if-else
// Before:
function getDiscount(type) {
  if (type === "vip") return 0.8;
  else if (type === "svip") return 0.7;
  else if (type === "normal") return 1.0;
}

// After:
const discountMap = {
  vip: 0.8,
  svip: 0.7,
  normal: 1.0,
};
function getDiscount(type) {
  return discountMap[type] ?? 1.0;
}

// 2. 卫语句 - 提前 return 减少嵌套
// Before:
function process(user) {
  if (user) {
    if (user.age > 18) {
      // 主逻辑
    } else {
      return "未成年";
    }
  } else {
    return "无用户";
  }
}

// After:
function process(user) {
  if (!user) return "无用户";
  if (user.age <= 18) return "未成年";
  // 主逻辑
}

// 3. 可选链 + 空值合并
const name = user?.profile?.name ?? "未知";

// 4. 多态替代条件判断
class Dog {
  speak() {
    return "汪";
  }
}
class Cat {
  speak() {
    return "喵";
  }
}
function animalSound(animal) {
  return animal.speak();
}
```

---

### 118. babel-runtime 作用是啥 [热度:200]

> **简述：** `babel-runtime` 提供 Babel 编译所需的辅助函数（如 `_extend`、`_classCallCheck` 等），避免每个文件都内联一份重复的辅助代码，减小打包体积。配合 `babel-plugin-transform-runtime` 自动替换内联辅助为从 runtime 引用。

**解析：**

```javascript
// 没有 babel-runtime 时，每个文件都会内联辅助函数：
// 文件A:
function _classCallCheck(instance, Constructor) { ... }
class A {}

// 文件B:
function _classCallCheck(instance, Constructor) { ... } // 重复！
class B {}

// 使用 babel-plugin-transform-runtime + babel-runtime 后：
// 文件A:
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
class A {}

// 文件B:
import _classCallCheck from 'babel-runtime/helpers/classCallCheck'; // 复用！
class B {}

// babel.config.js 配置
{
  "plugins": [
    ["@babel/plugin-transform-runtime", {
      "corejs": 3,      // 是否注入 polyfill（2/3/false）
      "helpers": true,   // 提取辅助函数
      "regenerator": true
    }]
  ]
}

// babel-runtime vs babel-polyfill：
// babel-runtime：按需引入辅助函数，不污染全局，适合库开发
// babel-polyfill：全量注入 polyfill，修改全局原型，适合应用开发
```

---

### 119. 如何实现预览 PDF 文件

> **简述：** 使用浏览器原生 `<iframe>`/`<embed>`/`<object>` 直接嵌入，或使用 `pdf.js` 库实现自定义渲染，支持分页、缩放、搜索等交互。

**解析：**

```javascript
// 方法1：iframe/embed 直接嵌入（最简单）
<iframe src="/file.pdf" width="100%" height="600px"></iframe>
<embed src="/file.pdf" type="application/pdf" width="100%" height="600px" />

// 方法2：pdf.js 自定义渲染（推荐，兼容性好）
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';

async function renderPDF(url, container) {
  const pdf = await pdfjsLib.getDocument(url).promise;
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;
  }
}

// 方法3：react-pdf（React 项目推荐）
import { Document, Page } from 'react-pdf';

function PDFViewer({ url }) {
  const [numPages, setNumPages] = useState(null);
  return (
    <Document file={url} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
      {Array.from({ length: numPages }, (_, i) => (
        <Page key={i} pageNumber={i + 1} />
      ))}
    </Document>
  );
}

// 方法4：使用 PDF 查看器库
// - pdf.js viewer（Mozilla 官方查看器）
// - vue-pdf-embed（Vue 项目）
// - @react-pdf-viewer/core（React 项目）
```

---

### 120. 如何在划词选择的文本上添加右键菜单(划词:鼠标滑动选择一段文字)

> **简述：** 监听 `contextmenu` 事件，通过 `window.getSelection()` 获取选中文本及位置，在鼠标坐标处显示自定义菜单。

**解析：**

```javascript
class SelectionMenu {
  constructor(menuEl) {
    this.menu = menuEl;
    this.selectedText = "";
    this.init();
  }

  init() {
    document.addEventListener("mouseup", (e) => {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text && text.length > 0) {
        this.selectedText = text;
        this.showMenu(e.clientX, e.clientY);
      } else {
        this.hideMenu();
      }
    });

    document.addEventListener("click", () => {
      this.hideMenu();
    });

    this.menu.addEventListener("click", (e) => {
      const action = e.target.dataset.action;
      if (action === "copy") {
        navigator.clipboard.writeText(this.selectedText);
      } else if (action === "search") {
        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(this.selectedText)}`,
        );
      } else if (action === "translate") {
        window.open(
          `https://translate.google.com/?text=${encodeURIComponent(this.selectedText)}`,
        );
      }
      this.hideMenu();
    });
  }

  showMenu(x, y) {
    this.menu.style.display = "block";
    this.menu.style.left = x + "px";
    this.menu.style.top = y + "px";
  }

  hideMenu() {
    this.menu.style.display = "none";
  }
}

// HTML:
// <div id="context-menu" style="display:none;position:fixed;">
//   <button data-action="copy">复制</button>
//   <button data-action="search">搜索</button>
//   <button data-action="translate">翻译</button>
// </div>
```

---

### 121. 富文本里面，是如何做到划词的(鼠标滑动选择一组字符，对组...)

> **简述：** 利用 `Selection API`（`window.getSelection()`）获取用户选区，通过 `Range` 对象操作选中文本的 DOM 范围，再用 `Range.surroundContents()` 或 `document.execCommand()` 对选中内容包裹标签实现高亮/加粗等效果。

**解析：**

```javascript
// 获取选区信息
function getSelectionInfo() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  return {
    text: selection.toString(),
    startOffset: range.startOffset,
    endOffset: range.endOffset,
    startContainer: range.startContainer,
    endContainer: range.endContainer,
    range,
  };
}

// 高亮选中文本
function highlightSelection(color = "yellow") {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);

  const mark = document.createElement("mark");
  mark.style.backgroundColor = color;
  mark.className = "text-highlight";

  try {
    range.surroundContents(mark);
  } catch {
    // 跨节点选区时需要拆分文本节点
    const fragment = range.extractContents();
    mark.appendChild(fragment);
    range.insertNode(mark);
  }
  selection.removeAllRanges();
}

// 监听划词事件
document.addEventListener("mouseup", () => {
  const selection = window.getSelection();
  const text = selection.toString().trim();
  if (text) {
    console.log("划词内容:", text);
  }
});
```

---

### 122. 如何做好前端监控方案 [热度:672]

> **简述：** 前端监控包含三大方向：错误监控（JS 异常、资源加载、Promise 未捕获）、性能监控（页面加载、接口耗时、长任务）、行为监控（PV/UV、用户点击、路由跳转），数据通过 `sendBeacon` 上报至监控平台。

**解析：**

```javascript
class FrontendMonitor {
  constructor(reportUrl) {
    this.reportUrl = reportUrl;
    this.queue = [];
    this.init();
  }

  init() {
    this.catchJSErrors();
    this.catchPromiseErrors();
    this.catchResourceErrors();
    this.monitorPerformance();
    this.monitorBehavior();
    this.startReportTimer();
    window.addEventListener("beforeunload", () => this.flush());
  }

  catchJSErrors() {
    window.onerror = (msg, url, line, col, error) => {
      this.report({
        type: "js_error",
        msg,
        url,
        line,
        col,
        stack: error?.stack,
      });
    };
  }

  catchPromiseErrors() {
    window.addEventListener("unhandledrejection", (e) => {
      this.report({
        type: "promise_error",
        reason: e.reason?.message || e.reason,
      });
    });
  }

  catchResourceErrors() {
    window.addEventListener(
      "error",
      (e) => {
        if (e.target !== window) {
          this.report({
            type: "resource_error",
            tag: e.target.tagName,
            src: e.target.src || e.target.href,
          });
        }
      },
      true,
    );
  }

  monitorPerformance() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "navigation") {
          this.report({
            type: "page_load",
            dns: entry.domainLookupEnd - entry.domainLookupStart,
            tcp: entry.connectEnd - entry.connectStart,
            ttfb: entry.responseStart - entry.requestStart,
            domReady: entry.domContentLoadedEventEnd - entry.startTime,
            load: entry.loadEventEnd - entry.startTime,
          });
        }
        if (entry.entryType === "longtask" && entry.duration > 50) {
          this.report({
            type: "long_task",
            duration: entry.duration,
            startTime: entry.startTime,
          });
        }
      }
    });
    observer.observe({ entryTypes: ["navigation", "longtask", "resource"] });
  }

  monitorBehavior() {
    document.addEventListener(
      "click",
      (e) => {
        this.report({
          type: "click",
          tag: e.target.tagName,
          text: e.target.innerText?.slice(0, 50),
        });
      },
      true,
    );
  }

  report(data) {
    this.queue.push({
      ...data,
      url: location.href,
      timestamp: Date.now(),
      ua: navigator.userAgent,
    });
    if (this.queue.length >= 10) this.flush();
  }

  flush() {
    if (this.queue.length === 0) return;
    const data = this.queue.splice(0);
    navigator.sendBeacon(this.reportUrl, JSON.stringify(data));
  }

  startReportTimer() {
    setInterval(() => this.flush(), 5000);
  }
}
```

---

### 123. 如何标准化处理线上用户反馈的问题 [热度:631]

> **简述：** 建立标准化流程：收集反馈 → 复现问题 → 定位根因 → 修复验证 → 归档总结。关键在于完善的监控体系、用户信息采集和问题分类机制。

**解析：**

```javascript
// 1. 用户反馈信息采集
function collectFeedback(description) {
  return {
    description,
    url: location.href,
    userAgent: navigator.userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    timestamp: Date.now(),
    cookies: document.cookie,
    localStorage: JSON.stringify(localStorage),
    recentErrors: window.__recentErrors?.slice(-5),
    performance: {
      memory: performance.memory?.usedJSHeapSize,
      domNodes: document.querySelectorAll("*").length,
    },
  };
}

// 2. 问题分类与优先级
const IssuePriority = {
  P0: "服务不可用/数据丢失",
  P1: "核心功能异常",
  P2: "非核心功能异常",
  P3: "体验优化/建议",
};

// 3. 错误自动关联
// 通过 error stack + source map 定位源码
// 通过 user id + session id 关联用户操作链路
// 通过 git bisect 定位引入问题的 commit

// 4. 标准化处理流程
// Step1: 收集 → 自动采集环境信息 + 用户操作录制
// Step2: 复现 → 利用 rrweb 回放用户操作
// Step3: 定位 → 监控告警 + Source Map + 日志
// Step4: 修复 → 编写测试 → 修复代码 → Code Review
// Step5: 归档 → 问题库记录 → 复盘总结 → 防范措施
```

---

### 124. px 如何转为 rem[热度:545]

> **简述：** `rem` 相对于根元素 `font-size`，通过设置 `html` 的 `font-size` 基准值，将 `px` 按 `px / rootFontSize` 换算为 `rem`。通常使用 PostCSS 插件（如 `postcss-pxtorem`）自动转换，配合 `amfe-flexible` 动态设置根字号实现移动端适配。

**解析：**

```css
/* 手动换算：假设根字号 16px */
/* 32px = 32 / 16 = 2rem */
html {
  font-size: 16px;
}
.box {
  width: 2rem;
} /* 32px */
```

```javascript
// 动态设置根字号（amfe-flexible 原理）
function setRootFontSize() {
  const designWidth = 375;
  const baseFontSize = 16;
  const scale = document.documentElement.clientWidth / designWidth;
  document.documentElement.style.fontSize =
    baseFontSize * Math.max(scale, 0.5) + "px";
}
setRootFontSize();
window.addEventListener("resize", setRootFontSize);

// PostCSS 插件自动转换
// postcss.config.js
module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 16, // 根字号
      propList: ["*"], // 所有属性都转换
      selectorBlackList: [".no-rem"], // 忽略的选择器
    },
  },
};

// 换算公式：rem = px / rootValue
// 例：32px → 32/16 = 2rem
```

---

### 125. 浏览器有同源策略，但是为什么 cdn 请求资源的时候不会有跨域问题?

> **简述：** 同源策略主要限制 JS 读取跨域响应内容，但不限制 `<script>`、`<link>`、`<img>` 等标签加载资源。CDN 资源通过这些标签引入不受同源策略限制，但 JS 无法通过 AJAX 读取 CDN 资源的内容。

**解析：**

```
同源策略的限制范围：
┌──────────────────────────────────────────┐
│ 受限（需要 CORS）                        │
│ - XMLHttpRequest / Fetch 读取响应内容     │
│ - JS 操作跨域 iframe 的 DOM              │
│ - Canvas 读取跨域图片像素数据             │
├──────────────────────────────────────────┤
│ 不受限（允许跨域加载）                    │
│ - <script src="cdn.js">                  │
│ - <link href="cdn.css">                  │
│ - <img src="cdn.png">                    │
│ - <video>/<audio> 加载媒体资源            │
│ - @font-face 加载字体（需 CORS）          │
└──────────────────────────────────────────┘

CDN 场景：
1. CSS/JS/图片通过标签引入 → 浏览器直接加载，不触发 CORS 检查
2. 但如果用 fetch() 请求 CDN 资源 → 需要 CDN 配置 Access-Control-Allow-Origin
3. Canvas 绘制跨域图片后读取像素 → 需要 crossOrigin 属性 + CDN 配置 CORS

<script src="https://cdn.example.com/lib.js"></script>  ✅ 可加载
<link href="https://cdn.example.com/style.css">          ✅ 可加载
fetch('https://cdn.example.com/data.json')               ❌ 需 CORS
<img src="https://cdn.example.com/img.png" crossorigin>  ✅ 需 CDN 配 CORS
```

---

### 126. cookie 可以实现不同域共享吗 [热度:533]

> **简述：** Cookie 默认不能跨域共享，但可以通过设置 `domain` 属性实现同主域下的子域共享（如 `.example.com`），不同主域之间无法直接共享 Cookie，需借助中间页面（如 SSO）间接传递。

**解析：**

```
Cookie 的 domain 规则：
1. 默认：cookie 只对设置它的域生效
2. 设置 domain=.example.com：
   - a.example.com 可以读取
   - b.example.com 可以读取
   - other.com 不可读取

// 同主域共享
// 在 a.example.com 设置：
document.cookie = 'token=abc; domain=.example.com; path=/';
// b.example.com 也可以读取该 cookie

// 不同主域共享（SSO 方案）
// 1. 用户登录 sso.com，写入 cookie
// 2. 访问 app1.com 时，重定向到 sso.com 验证
// 3. sso.com 验证通过后，重定向回 app1.com 并携带 token
// 4. app1.com 将 token 写入自己的 cookie

// cookie 跨域携带（CORS 请求）
// 前端：fetch(url, { credentials: 'include' })
// 后端：Access-Control-Allow-Credentials: true
//       Access-Control-Allow-Origin: https://specific.com（不能为 *）
```

---

### 127. axios 是否可以取消请求 [热度:532]

> **简述：** 可以。axios 支持两种取消方式：`AbortController`（推荐，Web 标准 API）和 `CancelToken`（已废弃）。通过在请求配置中传入 `signal` 或 `cancelToken`，调用对应方法即可取消请求。

**解析：**

```javascript
// 方法1：AbortController（推荐，v0.22.0+）
const controller = new AbortController();

axios.get("/api/data", {
  signal: controller.signal,
});

controller.abort(); // 取消请求

// 批量取消
const controller = new AbortController();
axios.get("/api/a", { signal: controller.signal });
axios.post("/api/b", { signal: controller.signal });
controller.abort(); // 同时取消所有请求

// 方法2：CancelToken（已废弃但仍可用）
const source = axios.CancelToken.source();

axios.get("/api/data", {
  cancelToken: source.token,
});

source.cancel("请求已取消");

// 方法3：封装自动取消重复请求
const pendingMap = new Map();

function addPending(config) {
  const key = [config.method, config.url].join("&");
  config.signal = new AbortController().signal;
  pendingMap.set(key, config.signal);
}

function removePending(config) {
  const key = [config.method, config.url].join("&");
  if (pendingMap.has(key)) {
    pendingMap.get(key).abort();
    pendingMap.delete(key);
  }
}
```

---

### 128. 前端如何实现折叠面板效果?

> **简述：** 使用 CSS `max-height` + `overflow: hidden` + `transition` 实现动画过渡，或使用 `<details>/<summary>` 原生标签，或通过 `grid` 的 `0fr/1fr` 过渡实现。

**解析：**

```css
/* 方法1：max-height 过渡（最常用） */
.collapse-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.collapse-content.open {
  max-height: 500px; /* 需要预设一个足够大的值 */
}

/* 方法2：CSS Grid 过渡（更精确） */
.collapse-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}
.collapse-wrapper.open {
  grid-template-rows: 1fr;
}
.collapse-wrapper > div {
  overflow: hidden;
}
```

```html
<!-- 方法3：原生 details/summary -->
<details>
  <summary>点击展开</summary>
  <div class="content">折叠内容</div>
</details>
```

```javascript
// 方法4：JS 动态计算高度（最精确）
function toggleCollapse(el) {
  if (el.style.maxHeight) {
    el.style.maxHeight = null;
  } else {
    el.style.maxHeight = el.scrollHeight + "px";
  }
}
```

---

### 129. dom 里面，如何判断 a 元素是否是 b 元素的子元素 [热度:400]

> **简述：** 使用 `node.contains()`（推荐）、`node.compareDocumentPosition()` 或递归遍历 `parentNode`。

**解析：**

```javascript
// 方法1：contains（推荐，最简洁）
const isChild = b.contains(a);
// b.contains(a) 返回 true 表示 a 是 b 的后代（含自身）

// 方法2：compareDocumentPosition
const position = a.compareDocumentPosition(b);
const isChild = (position & Node.DOCUMENT_POSITION_CONTAINS) !== 0;
// 表示 b 包含 a

// 方法3：递归 parentNode
function isDescendant(a, b) {
  let node = a.parentNode;
  while (node) {
    if (node === b) return true;
    node = node.parentNode;
  }
  return false;
}

// 方法4：closest（判断是否为指定选择器的后代）
const isChild = a.closest(b.tagName) === b;

// 注意：contains 包含自身
// b.contains(b) === true
// 如需严格子元素（不含自身），需额外判断 a !== b
const isStrictChild = b.contains(a) && a !== b;
```

---

### 130. 判断一个对象是否为空，包含了其原型链上是否有自定义数据或...

> **简述：** 使用 `Object.keys()` 判断自有属性是否为空，结合 `Object.getPrototypeOf()` 检查原型链上是否有自定义属性。

**解析：**

```javascript
// 方法1：仅判断自有属性
function isEmptyOwn(obj) {
  return Object.keys(obj).length === 0;
}

// 方法2：包含原型链上的自定义属性
function isEmptyDeep(obj) {
  let current = obj;
  while (current && current !== Object.prototype) {
    const ownKeys = Object.getOwnPropertyNames(current);
    const filtered = ownKeys.filter(
      (k) => k !== "constructor" && typeof current[k] !== "function",
    );
    if (filtered.length > 0) return false;
    current = Object.getPrototypeOf(current);
  }
  return true;
}

// 方法3：JSON.stringify（仅可序列化属性）
function isEmptyJSON(obj) {
  return JSON.stringify(obj) === "{}";
}
// 注意：无法检测不可枚举属性和 Symbol 属性

// 方法4：完整检测（含 Symbol、不可枚举）
function isEmptyComplete(obj) {
  if (obj == null) return true;
  const keys = Reflect.ownKeys(obj);
  return keys.length === 0;
}

// isEmptyOwn({})              // true
// isEmptyOwn(Object.create({a:1}))  // true（a 在原型上）
// isEmptyDeep(Object.create({a:1})) // false
```

---

### 131. js 如何判断？【空】包含了空数组、空对象、空字符串、U...

> **简述：** 综合判断多种"空"值类型：`null`、`undefined`、空字符串 `""`、空数组 `[]`、空对象 `{}`、`NaN` 等，需要针对不同类型分别处理。

**解析：**

```javascript
function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (typeof value === "number") return Number.isNaN(value);
  if (typeof value === "boolean") return false;
  if (typeof value === "function") return false;
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (typeof value === "object") {
    if (value instanceof Date) return false;
    if (value instanceof Error) return value.message === "";
    return Object.keys(value).length === 0;
  }
  return false;
}

// 测试
isEmpty(null); // true
isEmpty(undefined); // true
isEmpty(""); // true
isEmpty("  "); // true
isEmpty([]); // true
isEmpty({}); // true
isEmpty(NaN); // true
isEmpty(0); // false
isEmpty(false); // false
isEmpty([1]); // false
isEmpty({ a: 1 }); // false
isEmpty(new Map()); // true
isEmpty(new Set()); // true
```

---

### 132. css 实现醒牌效果[热度:116]

> **简述：** 醒牌效果（标签/徽章）通常使用 CSS 实现圆角矩形背景 + 文字的标签样式，常见于状态标记、分类标签等场景，可配合伪元素实现三角箭头等装饰。

**解析：**

```css
/* 基础醒牌样式 */
.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  color: #fff;
  background: #1890ff;
}

/* 不同状态 */
.badge-success {
  background: #52c41a;
}
.badge-warning {
  background: #faad14;
  color: #333;
}
.badge-danger {
  background: #ff4d4f;
}

/* 带边框的醒牌 */
.badge-outline {
  padding: 2px 8px;
  border: 1px solid #1890ff;
  border-radius: 4px;
  color: #1890ff;
  background: transparent;
}

/* 带圆点的醒牌 */
.badge-dot::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  margin-right: 6px;
  vertical-align: middle;
}

/* 带三角箭头的醒牌 */
.badge-arrow {
  position: relative;
  padding: 2px 8px 2px 12px;
  background: #1890ff;
  color: #fff;
  border-radius: 0 4px 4px 0;
}
.badge-arrow::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  border: 10px solid transparent;
  border-left-color: #fff;
  border-right-width: 0;
}
.badge-arrow::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 3px;
  width: 4px;
  height: 14px;
  background: #1890ff;
}
```

---

### 133. flex:1 代表什么[热度:400]

> **简述：** `flex: 1` 是 `flex-grow: 1`、`flex-shrink: 1`、`flex-basis: 0%` 的简写，表示元素按比例分配剩余空间，且可收缩，初始尺寸为 0。

**解析：**

```css
/* flex: 1 等价于 */
.item {
  flex-grow: 1; /* 放大比例：占满剩余空间 */
  flex-shrink: 1; /* 缩小比例：空间不足时等比缩小 */
  flex-basis: 0%; /* 初始尺寸：不占固有空间，全部按比例分配 */
}

/* 对比 */
flex: 1; /* flex-grow:1, flex-shrink:1, flex-basis:0% */
flex: auto; /* flex-grow:1, flex-shrink:1, flex-basis:auto */
flex: none; /* flex-grow:0, flex-shrink:0, flex-basis:auto */

/* flex:1 vs flex:auto 区别 */
/* flex:1 → basis 为 0%，所有空间按 grow 比例分配 */
/* flex:auto → basis 为 auto，先分配固有宽度，剩余空间按 grow 分配 */

/* 示例 */
.container {
  display: flex;
  width: 600px;
}
.a {
  flex: 1;
} /* 占 1/3 = 200px */
.b {
  flex: 2;
} /* 占 2/3 = 400px */
```

---

### 134. 一般是怎么做代码重构的

> **简述：** 代码重构遵循"小步快跑"原则：先确保有测试覆盖 → 识别坏味道 → 逐步重构 → 每步验证。常见手段包括提取函数、消除重复、简化条件、重命名等。

**解析：**

```
代码重构流程：

1. 准备阶段
   - 确保有足够的测试覆盖（单元测试/集成测试）
   - 建立基准性能指标
   - 理解现有代码逻辑

2. 识别坏味道（Code Smell）
   - 过长函数 → 提取函数
   - 重复代码 → 提取公共方法
   - 过深嵌套 → 卫语句/策略模式
   - 过多参数 → 参数对象/解构
   - 魔法数字 → 常量提取
   - 过大类 → 职责拆分

3. 常用重构手法
   - 提取函数/变量
   - 重命名（变量、函数、文件）
   - 以多态替代条件判断
   - 以策略模式替代 if-else
   - 移动方法/字段到合适的类
   - 封装集合/字段
   - 合并重复的条件片段

4. 安全保障
   - 每次只做一个小重构
   - 每步重构后运行测试
   - 使用 Git 分支隔离
   - Code Review 把关
   - 灰度发布验证

5. 工具辅助
   - IDE 重构功能（重命名、提取方法）
   - ESLint 检测坏味道
   - TypeScript 类型检查
   - SonarQube 代码质量分析
```

---

### 135. 如何清理源码里面没有被应用的代码，主要是 JS、TS、CSS �?..

> **简述：** JS/TS 使用 Tree Shaking（基于 ES Module 静态分析）+ ESLint 检测未使用变量；CSS 使用 PurgeCSS / UnCSS 扫描 HTML 模板移除未使用的样式；还可借助 TypeScript 编译器、IDE 引用分析等工具定位死代码。

**解析：**

```javascript
// JS/TS 死代码清理
// 1. Tree Shaking（Webpack/Vite 自动）
// 前提：使用 ES Module（import/export），配置 sideEffects: false
// package.json
{ "sideEffects": false }

// 2. ESLint 检测未使用的变量
// .eslintrc
{ "rules": { "no-unused-vars": "warn", "@typescript-eslint/no-unused-vars": "warn" } }

// 3. TypeScript 编译器检测
// tsconfig.json
{ "compilerOptions": { "noUnusedLocals": true, "noUnusedParameters": true } }

// 4. knip 工具（全面检测未使用的导出、文件、依赖）
// npx knip
```

```bash
# CSS 死代码清理
# 1. PurgeCSS（最常用，构建时扫描模板移除未用样式）
# postcss.config.js
# const purgecss = require('@fullhuman/postcss-purgecss')
# plugins: [purgecss({ content: ['./src/**/*.html', './src/**/*.vue', './src/**/*.jsx'] })]

# 2. UnCSS（扫描 HTML 文件移除未用 CSS）
# npx uncss src/index.html > cleaned.css

# 3. Chrome DevTools Coverage 面板
# 手动检测页面中未使用的 CSS/JS 比例
```

---

### 136. 前端应用如何做国际化？[热度:199]

> **简述：** 通过 i18n 库（如 `i18next`、`vue-i18n`、`react-intl`）管理多语言文案，按 key 映射翻译文本，根据用户语言偏好动态切换，配合构建工具实现按需加载语言包。

**解析：**

```javascript
// 1. i18next 通用方案
import i18next from "i18next";

i18next.init({
  lng: navigator.language.startsWith("zh") ? "zh" : "en",
  resources: {
    en: { translation: { hello: "Hello", submit: "Submit" } },
    zh: { translation: { hello: "你好", submit: "提交" } },
  },
});

i18next.t("hello"); // 根据当前语言返回对应文本
i18next.changeLanguage("en"); // 切换语言

// 2. React 项目：react-i18next
import { useTranslation } from "react-i18next";
function App() {
  const { t } = useTranslation();
  return <button>{t("submit")}</button>;
}

// 3. Vue 项目：vue-i18n
import { createI18n } from "vue-i18n";
const i18n = createI18n({
  locale: "zh",
  messages: { en: { hello: "Hello" }, zh: { hello: "你好" } },
});
// 模板中：{{ $t('hello') }}

// 4. 按需加载语言包
async function loadLocale(lang) {
  const resources = await import(`./locales/${lang}.json`);
  i18next.addResourceBundle(lang, "translation", resources.default);
  i18next.changeLanguage(lang);
}

// 5. 其他注意事项
// - 日期/数字格式化：Intl.DateTimeFormat / Intl.NumberFormat
// - 复数/性别：i18next 的 plural/suffix 支持
// - SEO：SSR 时根据 URL 或 Accept-Language 返回对应语言
```

---

### 137. 应用如何做应用灰度发布？[热度:247]

> **简述：** 灰度发布通过逐步放量（如 1%→10%→50%→100%）让部分用户先使用新版本，验证无问题后再全量发布。前端可通过 URL 参数、Cookie 标记、AB 测试平台、特性开关（Feature Flag）等实现。

**解析：**

```javascript
// 方法1：基于用户 ID 哈希的灰度
function isGrayUser(userId, percentage) {
  const hash = userId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return hash % 100 < percentage;
}

// 方法2：基于 Cookie 的灰度标记
function setGrayFlag(flag) {
  document.cookie = `gray_flag=${flag}; path=/; max-age=86400`;
}

function getGrayFlag() {
  return document.cookie.match(/gray_flag=(\w+)/)?.[1];
}

// 方法3：Feature Flag（特性开关）
const featureFlags = {
  newFeature: async () => {
    const user = await getCurrentUser();
    return isGrayUser(user.id, 20); // 20% 灰度
  },
};

async function App() {
  const showNew = await featureFlags.newFeature();
  return showNew ? <NewFeature /> : <OldFeature />;
}

// 方法4：Nginx 配置灰度分流
// upstream backend {
//   server old-version weight=90;
//   server new-version weight=10;
// }

// 方法5：专业 AB 测试平台
// - LaunchDarkly
// - Unleash
// - Optimizely
// - 自建灰度平台（配置中心 + SDK）
```

---

### 138. [微前端] 为何通常微前端应用隔离，不选择 iframe 方案[�?..

> **简述：** iframe 虽然天然隔离，但存在性能差（独立进程）、通信困难（postMessage）、URL 不同步、弹窗/遮罩局限在 iframe 内、无法共享 UI 组件库、SEO 不友好等问题，因此微前端方案通常选择 JS 沙箱 + CSS 隔离替代。

**解析：**

```
iframe 方案的缺点：
1. 性能开销：每个 iframe 是独立的浏览器上下文，内存和 CPU 开销大
2. 通信复杂：只能通过 postMessage，数据序列化/反序列化麻烦
3. URL 不同步：浏览器地址栏不随 iframe 内路由变化
4. 弹窗/遮罩问题：iframe 内的弹窗无法覆盖父页面
5. 样式隔离过度：无法共享主题、组件库
6. 布局困难：iframe 高度自适应需要额外处理
7. SEO 不友好：搜索引擎无法索引 iframe 内容
8. 历史记录：iframe 内的路由变化不会添加到浏览器历史

iframe 适用场景：
- 完全独立的第三方应用嵌入
- 需要绝对安全隔离的场景
- 遗留系统无侵入式集成

微前端替代方案：
- qiankun：JS 沙箱 + Shadow DOM / scoped CSS
- Module Federation：模块共享，运行时集成
- single-spa：路由级应用组合
- Web Components：Shadow DOM 天然样式隔离
```

---

### 139. [微前端] Qiankun 是如何做 JS 隔离的？[热度:228]

> **简述：** Qiankun 提供三种 JS 隔离方案：`SnapshotSandbox`（快照沙箱，diff 对比 window 属性）、`LegacySandbox`（代理沙箱，记录增删改操作）、`ProxySandbox`（代理沙箱，完全隔离，推荐）。

**解析：**

```javascript
// 1. SnapshotSandbox（快照沙箱）
// 原理：激活时保存 window 快照，卸载时对比差异恢复
class SnapshotSandbox {
  constructor() {
    this.windowSnapshot = {};
    this.modifyPropsMap = {};
  }
  activate() {
    this.windowSnapshot = {};
    for (const prop in window) {
      this.windowSnapshot[prop] = window[prop];
    }
    Object.keys(this.modifyPropsMap).forEach((p) => {
      window[p] = this.modifyPropsMap[p];
    });
  }
  deactivate() {
    this.modifyPropsMap = {};
    for (const prop in window) {
      if (window[prop] !== this.windowSnapshot[prop]) {
        this.modifyPropsMap[prop] = window[prop];
        window[prop] = this.windowSnapshot[prop];
      }
    }
  }
}

// 2. ProxySandbox（代理沙箱，推荐）
// 原理：通过 Proxy 代理 fakeWindow，所有操作在 fakeWindow 上进行
class ProxySandbox {
  constructor() {
    const fakeWindow = Object.create(null);
    this.proxy = new Proxy(fakeWindow, {
      get(target, key) {
        return target[key] ?? window[key]; // 自有属性优先，否则读 window
      },
      set(target, key, value) {
        target[key] = value; // 所有写操作都在 fakeWindow 上
        return true;
      },
    });
  }
}

// 3. LegacySandbox（单实例代理沙箱）
// 原理：与 ProxySandbox 类似，但会同步修改真实 window（单实例场景）
```

---

### 140. [微前端] 微前端架构一般是如何做 JavaScript 隔离

> **简述：** 微前端 JS 隔离主要有三种方式：Proxy 沙箱（代理 window 对象隔离读写）、快照沙箱（激活/卸载时 diff 恢复 window）、Shadow DOM + 作用域隔离。CSS 隔离则通过 Shadow DOM、CSS Modules、CSS 前缀等实现。

**解析：**

```javascript
// 1. Proxy 沙箱（最推荐，多实例安全）
function createProxySandbox() {
  const fakeWindow = Object.create(null);
  return new Proxy(fakeWindow, {
    get(target, key, receiver) {
      if (key === "window" || key === "self") return receiver;
      if (key in target) return Reflect.get(target, key);
      const value = window[key];
      if (typeof value === "function" && !value.prototype) {
        return value.bind(window); // 绑定原 window，如 setTimeout
      }
      return value;
    },
    set(target, key, value) {
      target[key] = value; // 写操作只在 fakeWindow
      return true;
    },
    has(target, key) {
      return key in target || key in window;
    },
  });
}

// 2. 快照沙箱（兼容性好，不支持多实例）
// 见 139 题详解

// 3. iframe 沙箱（天然隔离，但代价大）
// 在 iframe 中执行子应用 JS

// CSS 隔离方案
// 1. Shadow DOM：完全隔离，但第三方库兼容性差
// 2. CSS Modules / CSS-in-JS：构建时隔离
// 3. CSS 前缀：qiankun 默认方案，运行时添加选择器前缀
// 4. @layer CSS 层级：新标准，控制样式优先级
```

---

### 141. [React] 循环渲染中为什么推荐不用 index 做 key[热[�?320]

> **简述：** 使用 index 作为 key 时，当列表发生插入、删除、排序操作，React 会错误复用组件实例和 DOM 节点，导致渲染异常、状态错乱、性能下降。应使用唯一且稳定的标识（如 id）作为 key。

**解析：**

```jsx
// 问题场景：使用 index 作为 key
function List({ items }) {
  return items.map((item, index) => (
    <div key={index}>
      <input defaultValue={item.name} />
      <span>{item.name}</span>
    </div>
  ));
}

// 当在列表头部插入一项时：
// 原: [{name:'A'}, {name:'B'}]  key: 0, 1
// 新: [{name:'C'}, {name:'A'}, {name:'B'}]  key: 0, 1, 2
// React 认为 key=0 还是 A → 复用 A 的 DOM → input 中的值错乱

// 正确做法：使用唯一 id
function List({ items }) {
  return items.map((item) => (
    <div key={item.id}>
      <input defaultValue={item.name} />
      <span>{item.name}</span>
    </div>
  ));
}

// key 的作用：
// 1. 帮助 React 识别哪些元素发生了变化
// 2. key 相同 → React 认为是同一组件，复用 DOM
// 3. key 不同 → React 销毁旧组件，创建新组件

// index 作为 key 有问题的场景：
// - 列表头部插入/删除
// - 列表排序
// - 列表项有内部状态（input、动画等）
// 不受影响的场景：
// - 纯静态展示列表
// - 列表只在尾部追加
```

---

### 142. [React] 如何避免使用 context 的时候，引起整个挂载节点树的...

> **简述：** Context 值变化会导致所有消费该 Context 的组件重新渲染。优化方式包括：拆分 Context（按职责分离）、使用 `useMemo` 缓存 Context 值、子组件用 `React.memo` 包裹、将状态和 dispatch 分为两个 Context。

**解析：**

```jsx
// 问题：一个 Context 变化导致所有消费者重渲染
const AppContext = createContext();

function Provider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  // 任何状态变化 → 所有消费者重渲染
  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

// 优化1：拆分 Context
const UserContext = createContext();
const ThemeContext = createContext();

function Provider({ children }) {
  return (
    <UserContext.Provider value={userValue}>
      <ThemeContext.Provider value={themeValue}>
        {children}
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}

// 优化2：状态和 dispatch 分离（Redux 模式）
const StateContext = createContext();
const DispatchContext = createContext();

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
// dispatch 引用稳定，不会触发仅使用 dispatch 的组件重渲染

// 优化3：React.memo 包裹子组件
const ExpensiveChild = React.memo(function ExpensiveChild({ value }) {
  return <div>{value}</div>;
});

// 优化4：useMemo 缓存 Context value
const value = useMemo(() => ({ user, theme }), [user, theme]);
```

---

### 143. 前端如何实现截图？

> **简述：** 使用 `html2canvas` 将 DOM 转为 Canvas 再导出图片，或使用 `dom-to-image` 将 DOM 转为 SVG 再导出，也可使用原生 `Canvas API` 手动绘制。

**解析：**

```javascript
// 方法1：html2canvas（最常用）
import html2canvas from "html2canvas";

async function screenshot(element) {
  const canvas = await html2canvas(element, {
    useCORS: true, // 允许跨域图片
    scale: 2, // 高清截图
    backgroundColor: null,
    logging: false,
  });
  return canvas.toDataURL("image/png");
}

// 下载截图
function downloadScreenshot(element) {
  html2canvas(element).then((canvas) => {
    const link = document.createElement("a");
    link.download = "screenshot.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}

// 方法2：dom-to-image
import domtoimage from "dom-to-image";

domtoimage.toPng(element).then((dataUrl) => {
  const img = new Image();
  img.src = dataUrl;
});

// 方法3：html-to-image（轻量替代）
import { toPng } from "html-to-image";
toPng(element).then((dataUrl) => {
  /* ... */
});

// 方法4：浏览器原生截图 API（Screen Capture）
async function captureScreen() {
  const stream = await navigator.mediaDevices.getDisplayMedia();
  const track = stream.getVideoTracks()[0];
  const imageCapture = new ImageCapture(track);
  const bitmap = await imageCapture.grabFrame();
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d").drawImage(bitmap, 0, 0);
  return canvas.toDataURL();
}
```

---

### 144. 当 QPS 达到峰值时，该如何做？

> **简述：** 前端通过请求限流（防抖/节流）、请求队列、降级策略（骨架屏/缓存数据）、CDN 分流等手段应对高 QPS；后端通过限流、熔断、扩容、缓存等保障服务稳定。

**解析：**

```javascript
// 1. 前端请求限流
function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      return fn.apply(this, args);
    }
  };
}

// 2. 请求队列（控制并发数）
class RequestQueue {
  constructor(maxConcurrent = 5) {
    this.maxConcurrent = maxConcurrent;
    this.running = 0;
    this.queue = [];
  }

  add(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject });
      this.run();
    });
  }

  run() {
    while (this.running < this.maxConcurrent && this.queue.length) {
      const { requestFn, resolve, reject } = this.queue.shift();
      this.running++;
      requestFn()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.running--;
          this.run();
        });
    }
  }
}

// 3. 降级策略
async function fetchDataWithFallback(url) {
  try {
    return await fetchWithTimeout(url, 3000);
  } catch {
    return localStorage.getItem(`cache:${url}`) || defaultData;
  }
}

// 4. 服务端策略
// - 限流：令牌桶/漏桶算法
// - 熔断：Circuit Breaker 模式
// - 扩容：自动/手动扩容
// - 缓存：Redis / CDN 缓存
// - 降级：返回兜底数据
// - 排队：消息队列削峰
```

---

### 145. js 超过 Number 最大值的数怎么处理?

> **简述：** JS 中 `Number.MAX_SAFE_INTEGER` 为 `2^53 - 1`，超过此值会丢失精度。处理方式：使用 `BigInt` 处理整数、字符串传递大数、第三方库（如 `decimal.js`、`bignumber.js`）处理高精度运算。

**解析：**

```javascript
// 问题：超过安全整数范围精度丢失
console.log(9007199254740992 === 9007199254740993); // true！精度丢失

// 方法1：BigInt（原生支持，ES2020）
const big1 = BigInt(9007199254740993);
const big2 = 9007199254740993n; // 字面量后缀 n
console.log(big1 + big2); // 18014398509481986n
// 注意：BigInt 不能与 Number 混合运算
// big1 + 1 // TypeError
// big1 + BigInt(1) // OK

// 方法2：字符串传递（与后端交互时）
// 前端用字符串接收大数，展示时直接用字符串
const orderId = "9007199254740993123";

// JSON 解析大数问题
// 默认 JSON.parse 会丢失精度
const text = '{"id": 9007199254740993123}';
JSON.parse(text).id; // 9007199254740993000 精度丢失

// 使用 json-bigint 库
import JSONbig from "json-bigint";
JSONbig.parse(text).id.toString(); // "9007199254740993123"

// 方法3：decimal.js / bignumber.js（高精度浮点运算）
import Decimal from "decimal.js";
const result = new Decimal("0.1").plus("0.2").toString(); // "0.3"
const big = new Decimal("9007199254740993123.456");
big.plus("1").toString(); // "9007199254740993124.456"
```

---

### 146. 使用同一个链接，如何实现 PC 打开是 web 应用、手机打开是一...

> **简述：** 通过 User-Agent 检测设备类型，服务端重定向到不同应用；或前端路由判断设备类型渲染不同组件；移动端还可通过 Deep Link / Universal Link 唤起原生 App。

**解析：**

```javascript
// 方法1：UA 检测 + 重定向（服务端/前端）
function isMobile() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

if (isMobile()) {
  location.href = 'https://m.example.com';
  // 或尝试唤起 App
  // location.href = 'myapp://page?id=123';
}

// 方法2：前端同构，根据设备渲染不同组件
function App() {
  const isMobile = useDeviceDetect();
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}

// 方法3：Deep Link 唤起 App
function openApp(deepLink, fallbackUrl) {
  const start = Date.now();
  location.href = deepLink; // 尝试唤起 App

  setTimeout(() => {
    if (Date.now() - start < 2000) {
      location.href = fallbackUrl; // 唤起失败，跳应用商店
    }
  }, 1500);
}

// Android: intent://example.com/#Intent;scheme=myapp;end
// iOS: Universal Link（https 链接，需配置 apple-app-site-association）

// 方法4：响应式设计（同一页面适配不同设备）
// CSS 媒体查询 + 弹性布局
@media (max-width: 768px) {
  .desktop-only { display: none; }
}
@media (min-width: 769px) {
  .mobile-only { display: none; }
}
```

---

### 147. 如何保证用户的使用体验?

> **简述：** 从性能优化（加载速度、渲染流畅）、稳定性（错误监控、降级策略）、交互体验（反馈及时、操作便捷）、可访问性（无障碍设计）四个维度保障用户体验。

**解析：**

```
1. 性能优化
   - 首屏加载：< 3s，骨架屏/SSR 减少白屏
   - 资源优化：代码分割、懒加载、CDN、图片压缩
   - 渲染流畅：虚拟滚动、防抖节流、Web Worker
   - 接口优化：请求合并、缓存、预加载

2. 稳定性保障
   - 错误监控：全局异常捕获 + 上报
   - 降级策略：接口超时返回兜底数据
   - 灰度发布：逐步放量验证
   - 回滚机制：出问题快速回滚

3. 交互体验
   - 操作反馈：loading、toast、进度条
   - 防重复提交：按钮防抖/禁用
   - 表单校验：实时校验 + 友好提示
   - 离线支持：Service Worker 缓存

4. 可访问性
   - 语义化 HTML
   - 键盘导航支持
   - ARIA 标签
   - 色彩对比度

5. 监控与度量
   - Core Web Vitals：LCP、FID、CLS
   - 自定义性能指标
   - 用户满意度调研
```

---

### 148. 如何解决页面请求接口大规模并发问题?

> **简述：** 通过请求队列控制并发数、接口合并（BFF 聚合）、数据缓存、分页/懒加载、请求取消（AbortController）等策略应对大规模并发请求。

**解析：**

```javascript
// 1. 并发控制（限制同时请求数）
function concurrentRequest(urls, maxConcurrent = 5) {
  return new Promise((resolve) => {
    const results = [];
    let index = 0;
    let completed = 0;

    function next() {
      while (index < urls.length && index - completed < maxConcurrent) {
        const i = index++;
        fetch(urls[i])
          .then((res) => res.json())
          .then((data) => {
            results[i] = data;
          })
          .catch((err) => {
            results[i] = null;
          })
          .finally(() => {
            completed++;
            next();
          });
      }
      if (completed === urls.length) resolve(results);
    }
    next();
  });
}

// 2. 接口合并（BFF 层）
// 前端：一次请求获取多个数据
// GET /api/batch?apis=userInfo,orderList,settings
// BFF 层并行调用后端多个接口，聚合后返回

// 3. 数据缓存
const cache = new Map();
async function fetchWithCache(url) {
  if (cache.has(url)) return cache.get(url);
  const data = await fetch(url).then((r) => r.json());
  cache.set(url, data);
  setTimeout(() => cache.delete(url), 60000); // 60s 过期
  return data;
}

// 4. 分页 + 懒加载
// 只请求当前页数据，滚动到底部再加载下一页

// 5. 请求取消（路由切换时取消未完成请求）
const controller = new AbortController();
fetch("/api/data", { signal: controller.signal });
controller.abort(); // 取消
```

---

### 149. 设计一套全站请求耗时统计工具

> **简述：** 通过拦截 XHR/Fetch 记录每个请求的开始时间和结束时间，结合 Performance API 获取更精确的耗时数据，按接口维度聚合统计（平均耗时、P95、失败率），定时上报至监控平台。

**解析：**

```javascript
class RequestDurationTracker {
  constructor(reportUrl) {
    this.reportUrl = reportUrl;
    this.records = [];
    this.init();
  }

  init() {
    this.interceptXHR();
    this.interceptFetch();
    this.observePerformance();
    this.startReport();
  }

  interceptXHR() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    const self = this;

    XMLHttpRequest.prototype.open = function (method, url) {
      this._trackerMeta = { method, url, startTime: 0 };
      return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
      this._trackerMeta.startTime = performance.now();
      this.addEventListener("loadend", function () {
        const duration = performance.now() - this._trackerMeta.startTime;
        self.records.push({
          type: "xhr",
          method: this._trackerMeta.method,
          url: this._trackerMeta.url,
          duration: Math.round(duration),
          status: this.status,
          timestamp: Date.now(),
        });
      });
      return originalSend.apply(this, arguments);
    };
  }

  interceptFetch() {
    const originalFetch = window.fetch;
    const self = this;

    window.fetch = async function (url, options = {}) {
      const start = performance.now();
      try {
        const response = await originalFetch.apply(this, arguments);
        self.records.push({
          type: "fetch",
          method: options.method || "GET",
          url: typeof url === "string" ? url : url.url,
          duration: Math.round(performance.now() - start),
          status: response.status,
          timestamp: Date.now(),
        });
        return response;
      } catch (err) {
        self.records.push({
          type: "fetch",
          method: options.method || "GET",
          url: typeof url === "string" ? url : url.url,
          duration: Math.round(performance.now() - start),
          status: 0,
          error: err.message,
          timestamp: Date.now(),
        });
        throw err;
      }
    };
  }

  observePerformance() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (
          entry.initiatorType === "xmlhttprequest" ||
          entry.initiatorType === "fetch"
        ) {
          console.log(
            `[Performance] ${entry.name}: ${Math.round(entry.duration)}ms`,
          );
        }
      }
    });
    observer.observe({ entryTypes: ["resource"] });
  }

  startReport() {
    setInterval(() => {
      if (this.records.length === 0) return;
      const data = this.records.splice(0);
      navigator.sendBeacon(this.reportUrl, JSON.stringify(data));
    }, 10000);

    window.addEventListener("beforeunload", () => {
      if (this.records.length > 0) {
        navigator.sendBeacon(this.reportUrl, JSON.stringify(this.records));
      }
    });
  }
}

new RequestDurationTracker("/monitor/request-duration");
```

---

### 150. 大文件上传了多久

> **简述：** 记录上传开始时间，通过 `XMLHttpRequest.upload.onprogress` 监听进度，上传完成时计算总耗时；也可结合切片上传统计每个分片耗时，分析上传瓶颈。

**解析：**

```javascript
class FileUploadTracker {
  constructor() {
    this.startTime = 0;
    this.chunks = [];
  }

  async upload(file, url, chunkSize = 5 * 1024 * 1024) {
    this.startTime = performance.now();
    const totalChunks = Math.ceil(file.size / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const chunkStart = performance.now();
      const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize);
      await this.uploadChunk(chunk, i, totalChunks, url);
      this.chunks.push({
        index: i,
        duration: Math.round(performance.now() - chunkStart),
        size: chunk.size,
      });
    }

    const totalDuration = Math.round(performance.now() - this.startTime);
    const avgSpeed = (file.size / 1024 / 1024 / (totalDuration / 1000)).toFixed(
      2,
    );
    console.log(
      `上传完成，总耗时: ${totalDuration}ms，平均速度: ${avgSpeed} MB/s`,
    );

    return {
      totalDuration,
      avgSpeed: `${avgSpeed} MB/s`,
      chunks: this.chunks,
    };
  }

  uploadChunk(chunk, index, total, url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("chunk", chunk);
      formData.append("index", index);
      formData.append("total", total);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          console.log(`分片 ${index + 1}/${total}: ${percent}%`);
        }
      };

      xhr.onload = () => resolve(xhr);
      xhr.onerror = () => reject(new Error(`分片 ${index} 上传失败`));
      xhr.open("POST", url);
      xhr.send(formData);
    });
  }
}
```

---

### 151. H5 如何解决移动端适配问题

> **简述：** 常用方案包括：`rem` + 动态根字号（flexible）、`vw/vh` 视口单位、`viewport meta` 设置、CSS 媒体查询。现代方案推荐 `vw` + `rem` 组合，配合 `postcss-px-to-viewport` 自动转换。

**解析：**

```html
<!-- 1. viewport meta（必须） -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
```

```javascript
// 2. rem + 动态根字号（amfe-flexible 方案）
function setRootFontSize() {
  const designWidth = 375;
  const baseFontSize = 37.5;
  const clientWidth = document.documentElement.clientWidth;
  document.documentElement.style.fontSize =
    baseFontSize * Math.min(clientWidth / designWidth, 2) + "px";
}
setRootFontSize();
window.addEventListener("resize", setRootFontSize);

// 3. vw 方案（推荐，无需 JS）
// 设计稿 375px，1px = 100vw/375 = 0.2667vw
// postcss-px-to-viewport 自动转换
```

```javascript
// postcss.config.js - vw 方案
module.exports = {
  plugins: {
    "postcss-px-to-viewport-8-plugin": {
      viewportWidth: 375,
      unitPrecision: 5,
      viewportUnit: "vw",
      selectorBlackList: [".ignore"],
      minPixelValue: 1,
      mediaQuery: false,
    },
  },
};
```

```css
/* 4. 安全区域适配（刘海屏） */
padding-bottom: env(safe-area-inset-bottom);
padding-top: env(safe-area-inset-top);

/* 5. 1px 边框问题 */
.border-1px {
  position: relative;
}
.border-1px::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: #ccc;
  transform: scaleY(0.5);
  transform-origin: 0 0;
}
```

---

### 152. 站点一键换肤的实现方式有哪�?

> **简述：** 主要方案有：CSS 变量（推荐，动态切换 `:root` 变量）、多套 CSS 主题文件切换、CSS-in-JS 动态注入、`prefers-color-scheme` 跟随系统暗黑模式、Element UI 等组件库的主题定制。

**解析：**

```css
/* 方法1：CSS 变量（推荐） */
:root {
  --primary-color: #1890ff;
  --bg-color: #ffffff;
  --text-color: #333333;
}

[data-theme="dark"] {
  --primary-color: #177ddc;
  --bg-color: #141414;
  --text-color: #ffffff;
}

.button {
  background: var(--primary-color);
  color: var(--text-color);
}
```

```javascript
// 切换主题
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

// 跟随系统
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
mediaQuery.addEventListener("change", (e) => {
  setTheme(e.matches ? "dark" : "light");
});

// 方法2：多套 CSS 文件切换
function switchTheme(themeName) {
  const links = document.querySelectorAll('link[rel="stylesheet"][data-theme]');
  links.forEach((link) => {
    link.disabled = link.dataset.theme !== themeName;
  });
}

// 方法3：CSS-in-JS（styled-components / emotion）
const Button = styled.button`
  background: ${(props) => props.theme.primaryColor};
`;

// 方法4：Ant Design / Element UI 主题定制
// 通过 less 变量覆盖或 CSS 变量模式
```

---

### 153. 如何实现网页加载进度条？ [热度:1,001]

> **简述：** 常用方案：NProgress 等库配合路由拦截、CSS 动画模拟进度条、`PerformanceObserver` 监听真实加载进度、`fetch` 拦截计算请求完成比例。

**解析：**

```javascript
// 方法1：NProgress（最常用，配合路由）
import NProgress from "nprogress";
import "nprogress/nprogress.css";

router.beforeEach(() => NProgress.start());
router.afterEach(() => NProgress.done());

// 方法2：手动实现进度条
class ProgressBar {
  constructor() {
    this.bar = document.createElement("div");
    this.bar.style.cssText =
      "position:fixed;top:0;left:0;height:3px;background:#1890ff;z-index:9999;transition:width 0.3s;width:0";
    document.body.appendChild(this.bar);
    this.progress = 0;
    this.timer = null;
  }

  start() {
    this.progress = 0;
    this.setProgress(10);
    this.timer = setInterval(() => {
      if (this.progress < 90) {
        this.setProgress(this.progress + Math.random() * 10);
      }
    }, 500);
  }

  setProgress(value) {
    this.progress = Math.min(value, 100);
    this.bar.style.width = this.progress + "%";
  }

  done() {
    clearInterval(this.timer);
    this.setProgress(100);
    setTimeout(() => {
      this.bar.style.width = "0";
    }, 300);
  }
}

// 方法3：基于请求完成比例
let totalRequests = 0;
let completedRequests = 0;

axios.interceptors.request.use((config) => {
  totalRequests++;
  updateProgress();
  return config;
});

axios.interceptors.response.use((res) => {
  completedRequests++;
  updateProgress();
  return res;
});

function updateProgress() {
  const percent =
    totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0;
  progressBar.setProgress(percent);
  if (percent >= 100) progressBar.done();
}
```

---

### 154. 常见图片加载方式有哪�? [热度:1,001]

> **简述：** 常见方式包括：`<img>` 标签直接加载、CSS `background-image`、懒加载（`loading="lazy"` / IntersectionObserver）、预加载（`<link rel="preload">`）、渐进式加载（低质量占位图 LQIP）、Base64 内联、SVG 内联、WebP/AVIF 现代格式。

**解析：**

```html
<!-- 1. img 标签 -->
<img src="photo.jpg" alt="描述" />

<!-- 2. 原生懒加载 -->
<img src="photo.jpg" loading="lazy" />

<!-- 3. 预加载 -->
<link rel="preload" as="image" href="hero.jpg" />

<!-- 4. 渐进式加载（LQIP） -->
<img src="tiny-blur.jpg" data-src="full-size.jpg" class="lazyload" />

<!-- 5. 响应式图片 -->
<img
  srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 600px) 480px, 800px"
  src="medium.jpg"
/>

<!-- 6. 现代格式 + 降级 -->
<picture>
  <source srcset="photo.avif" type="image/avif" />
  <source srcset="photo.webp" type="image/webp" />
  <img src="photo.jpg" />
</picture>
```

```javascript
// 7. IntersectionObserver 懒加载
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll("img[data-src]").forEach((img) => {
  observer.observe(img);
});

// 8. Base64 内联（小图标适用，< 10KB）
// <img src="data:image/png;base64,..." />
// 优点：减少 HTTP 请求
// 缺点：体积增大 33%，无法缓存

// 9. SVG 内联
// <svg>...</svg>
// 优点：矢量、可交互、体积小
```

---

### 155. cookie 构成都分有哪�?[热度:598]

> **简述：** Cookie 由键值对和多个属性组成：`name=value`、`Domain`、`Path`、`Expires/Max-Age`、`HttpOnly`、`Secure`、`SameSite`、`Priority` 等。

**解析：**

```
Cookie 完整格式：
Set-Cookie: name=value; Domain=.example.com; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Lax

各属性说明：

1. name=value（必需）
   - Cookie 的键值对

2. Domain（域名）
   - 指定 Cookie 生效的域名
   - 默认为当前域名（不含子域）
   - 设为 .example.com 则子域共享

3. Path（路径）
   - 指定 Cookie 生效的路径
   - 默认为 /（全站有效）

4. Expires / Max-Age（过期时间）
   - Expires: 绝对时间，如 Wed, 21 Oct 2025 07:28:00 GMT
   - Max-Age: 相对秒数，如 86400（1天）
   - 不设置则为 Session Cookie，关闭浏览器即失效

5. HttpOnly（安全）
   - 禁止 JS 通过 document.cookie 访问
   - 防止 XSS 窃取 Cookie

6. Secure（安全）
   - 仅通过 HTTPS 传输
   - 防止中间人攻击

7. SameSite（跨站限制）
   - Strict: 完全禁止跨站发送
   - Lax: 允许顶级导航的 GET 请求携带（默认值）
   - None: 允许跨站发送（需配合 Secure）

8. Priority（优先级，Chrome 扩展）
   - Low / Medium / High
   - Cookie 超限时优先删除低优先级的
```

---

### 156. 扫码登录实现方式 [热度:734]

> **简述：** 扫码登录基于 WebSocket 长连接或轮询实现：PC 端生成二维码（含唯一 token）→ 手机扫码确认 → 服务端通知 PC 端登录成功。核心流程为：生成 token → 展示二维码 → 手机扫码 → 确认授权 → PC 端获取凭证。

**解析：**

```
扫码登录流程：

1. PC 端请求生成二维码
   GET /api/qrcode/generate
   Response: { token: "abc123", qrUrl: "https://app.com/scan?token=abc123" }

2. PC 端展示二维码 + 建立 WebSocket 连接
   const ws = new WebSocket('wss://server/ws?token=abc123');
   ws.onmessage = (e) => {
     const data = JSON.parse(e.data);
     if (data.status === 'confirmed') {
       // 登录成功，获取 token
       localStorage.setItem('auth_token', data.authToken);
     }
   };

3. 手机 App 扫码
   - 解析二维码获取 token
   - 调用接口: POST /api/qrcode/scan { token: "abc123" }
   - 服务端标记该 token 为"已扫描"

4. 手机确认登录
   POST /api/qrcode/confirm { token: "abc123" }

5. 服务端通过 WebSocket 通知 PC 端
   { status: "confirmed", authToken: "xxx" }

6. 轮询方案（WebSocket 降级）
   setInterval(async () => {
     const res = await fetch(`/api/qrcode/status?token=abc123`);
     const data = await res.json();
     if (data.status === 'confirmed') {
       clearInterval(timer);
       // 登录成功
     }
   }, 2000);

安全考虑：
- 二维码有效期（通常 5 分钟）
- Token 一次性使用
- 确认操作需验证用户身份
```

---

### 157. DNS 协议了解多少 [热度:712]

> **简述：** DNS（Domain Name System）是将域名解析为 IP 地址的分布式系统。解析流程：浏览器缓存 → 系统缓存 → 路由器缓存 → 本地 DNS → 根域名服务器 → 顶级域名服务器 → 权威域名服务器。支持递归查询和迭代查询。

**解析：**

```
DNS 解析流程：

1. 浏览器 DNS 缓存（chrome://net-internals/#dns）
2. 操作系统 DNS 缓存
3. 路由器 DNS 缓存
4. 本地 DNS 服务器（ISP 提供）
5. 根域名服务器（.）
6. 顶级域名服务器（.com）
7. 权威域名服务器（example.com）

查询方式：
- 递归查询：客户端只问一次，DNS 服务器负责完整解析
- 迭代查询：DNS 服务器返回下一级服务器地址，客户端逐级查询

DNS 记录类型：
- A：域名 → IPv4 地址
- AAAA：域名 → IPv6 地址
- CNAME：域名别名
- MX：邮件服务器
- NS：域名服务器
- TXT：文本记录（SPF、DKIM 等）

前端 DNS 优化：
<!-- DNS 预解析 -->
<link rel="dns-prefetch" href="//cdn.example.com" />

<!-- DNS 预连接 -->
<link rel="preconnect" href="//api.example.com" />

// 查看 DNS 解析耗时
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`DNS 解析: ${entry.domainLookupEnd - entry.domainLookupStart}ms`);
  }
});
observer.observe({ entryTypes: ['navigation'] });
```

---

### 158. 函数式编程了解多少？ [热度:1,789]

> **简述：** 函数式编程（FP）核心思想：纯函数（无副作用）、不可变数据、函数组合、高阶函数、柯里化。强调声明式编程，数据流动清晰可预测，便于测试和并发。

**解析：**

```javascript
// 1. 纯函数：相同输入始终返回相同输出，无副作用
function add(a, b) {
  return a + b;
} // 纯函数
let count = 0;
function impureAdd(a, b) {
  count++;
  return a + b;
} // 非纯函数

// 2. 不可变数据
const arr = [1, 2, 3];
const newArr = [...arr, 4]; // 不修改原数组
const obj = { name: "Tom" };
const newObj = { ...obj, age: 20 }; // 不修改原对象

// 3. 高阶函数：接收或返回函数的函数
const double = (x) => x * 2;
[1, 2, 3].map(double); // [2, 4, 6]

// 4. 函数组合
const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((acc, fn) => fn(acc), x);
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((acc, fn) => fn(acc), x);

const trim = (s) => s.trim();
const toLower = (s) => s.toLowerCase();
const addPrefix = (s) => "user_" + s;

const normalize = pipe(trim, toLower, addPrefix);
normalize("  Hello  "); // "user_hello"

// 5. 柯里化（Currying）
const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...moreArgs) => curried.apply(this, args.concat(moreArgs));
  };
};

const add = curry((a, b, c) => a + b + c);
add(1)(2)(3); // 6
add(1, 2)(3); // 6
add(1)(2, 3); // 6

// 6. 函子（Functor）/ Monad
class Maybe {
  constructor(value) {
    this.value = value;
  }
  static of(value) {
    return new Maybe(value);
  }
  map(fn) {
    return this.value == null ? Maybe.of(null) : Maybe.of(fn(this.value));
  }
}

Maybe.of("Hello").map((s) => s.toUpperCase()).value; // "HELLO"
Maybe.of(null).map((s) => s.toUpperCase()).value; // null（安全）

// 7. 常用 FP 库
// - Ramda：柯里化优先的实用函数库
// - lodash/fp：lodash 的函数式版本
// - Immutable.js：不可变数据结构
```

---

### 159. 前端水印了解多少？[热度:641]

> **简述：** 前端水印分为可见水印和隐水印。可见水印通过 Canvas 绘制或 CSS 重复背景实现；隐水印通过修改像素 LSB 位、频域变换等方式嵌入不可见信息。防删除可通过 MutationObserver 监听 + 自动恢复。

**解析：**

```javascript
// 1. Canvas 绘制可见水印
function createWatermark(text, options = {}) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = options.width || 300;
  canvas.height = options.height || 200;

  ctx.rotate((-20 * Math.PI) / 180);
  ctx.font = options.fontSize || "16px Arial";
  ctx.fillStyle = options.color || "rgba(180, 180, 180, 0.3)";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 20, canvas.height / 2);

  return canvas.toDataURL();
}

// 2. 全页面水印覆盖层
function addWatermark(text) {
  const url = createWatermark(text);
  const div = document.createElement("div");
  div.id = "__watermark";
  div.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 99999;
    background-image: url(${url}); background-repeat: repeat;
  `;
  document.body.appendChild(div);
  return div;
}

// 3. 防删除：MutationObserver 监听
function protectWatermark(watermarkEl) {
  const observer = new MutationObserver((mutations) => {
    if (!document.getElementById("__watermark")) {
      document.body.appendChild(watermarkEl);
    }
    if (
      watermarkEl.style.display !== "block" ||
      watermarkEl.style.opacity !== ""
    ) {
      watermarkEl.style.display = "block";
      watermarkEl.style.opacity = "";
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });
}

// 4. 隐水印（LSB 最低有效位嵌入）
function embedInvisibleWatermark(imageData, message) {
  const binaryMsg = message
    .split("")
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");
  for (let i = 0; i < binaryMsg.length; i++) {
    imageData.data[i * 4] =
      (imageData.data[i * 4] & 0xfe) | parseInt(binaryMsg[i]);
  }
  return imageData;
}

// 5. 商业方案
// - 阿里水印 SDK
// - watermark-dom
// - gitzone/watermark
```

---

### 160. 什么是锁域模型? [热度:1,092]

> **简述：** 锁域模型（Lock Domain Model）是一种并发控制模型，通过锁机制保证同一时间只有一个执行上下文可以访问共享资源，防止竞态条件。前端中常见于 IndexedDB 事务、Web Worker 共享内存（SharedArrayBuffer + Atomics）、以及业务层的操作锁（如防止重复提交）。

**解析：**

```javascript
// 1. 前端业务锁（防止重复操作）
class OperationLock {
  constructor() {
    this.locks = new Map();
  }

  async acquire(key, fn, timeout = 5000) {
    if (this.locks.has(key)) {
      return this.locks.get(key);
    }
    const promise = fn();
    this.locks.set(key, promise);

    const timer = setTimeout(() => {
      this.locks.delete(key);
    }, timeout);

    try {
      const result = await promise;
      return result;
    } finally {
      clearTimeout(timer);
      this.locks.delete(key);
    }
  }
}

const lock = new OperationLock();
// 同一操作不会重复执行
lock.acquire("submit-order", () => fetch("/api/order", { method: "POST" }));

// 2. SharedArrayBuffer + Atomics（多线程锁）
const sab = new SharedArrayBuffer(4);
const lock = new Int32Array(sab);

// 加锁
Atomics.wait(lock, 0, 1); // 如果 lock[0] === 1，则等待
Atomics.store(lock, 0, 1); // 设置为已锁

// 解锁
Atomics.store(lock, 0, 0);
Atomics.notify(lock, 0); // 唤醒等待的线程

// 3. IndexedDB 事务锁
// IndexedDB 本身通过事务机制保证数据一致性
const tx = db.transaction("store", "readwrite");
// 同一事务内的操作串行执行

// 4. 乐观锁 vs 悲观锁
// 乐观锁：读取时记录版本号，写入时校验版本
// 悲观锁：读取时即加锁，阻止其他操作
```

---

### 161. 一直在 window 上面挂载内容是否有甚么风险?

> **简述：** 在 `window` 上挂载全局变量存在命名冲突、内存泄漏、安全风险、难以维护等问题。应使用模块化（ES Module）、命名空间、闭包、Symbol key 等方式替代全局挂载。

**解析：**

```javascript
// 风险1：命名冲突
// 第三方库或多人协作时，全局变量可能被覆盖
window.config = { theme: "dark" }; // 你的代码
window.config = { theme: "light" }; // 别人的代码，覆盖了你的

// 风险2：内存泄漏
// 全局变量不会被 GC 回收
window.cache = new Map(); // 持续增长，永不释放

// 风险3：安全风险
// 全局变量可被 XSS 攻击读取或篡改
window.userToken = "secret"; // 可被恶意脚本读取

// 风险4：难以追踪
// 不知道哪个文件修改了全局变量，调试困难

// 风险5：Tree Shaking 失效
// 全局变量无法被静态分析，构建工具无法移除未使用代码

// 更好的替代方案：

// 1. ES Module（推荐）
export const config = { theme: "dark" };
import { config } from "./config";

// 2. 命名空间（必须全局时）
window.__MY_APP__ = {
  config: { theme: "dark" },
  utils: {},
};

// 3. Symbol key（避免命名冲突）
const key = Symbol("my-app-config");
window[key] = { theme: "dark" };

// 4. 闭包封装
const cache = (() => {
  const store = new Map();
  return {
    get: (k) => store.get(k),
    set: (k, v) => store.set(k, v),
  };
})();

// 5. 依赖注入 / Context（框架层）
// React: Context API
// Vue: provide/inject
```

---
