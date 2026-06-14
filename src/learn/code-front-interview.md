前端异步编程

promise、async await

**Promise**：是ES6提供的异步编程解决方案，用于处理异步操作。Promise有三种状态：pending（进行中）、fulfilled（已成功）、rejected（已失败）。特点：一经改变就不能再变化，支持链式调用。

**async/await**：ES8引入的异步编程语法，让异步代码看起来像同步代码。async函数返回一个Promise，await用于等待Promise结果，可以更清晰地处理异步流程。

**区别**：

- Promise是基础，async/await是基于Promise的语法糖
- async/await让异步代码更易读易写
- async/await实际上是Promise的封装

---

less-loader的less 转成 css 的底层原理

less-loader的转换原理：

1. less-loader使用less编译器（lessc）将Less文件解析成CSS
2. Less文件被加载时，less-loader调用less模块的compile方法
3. less编译器会解析Less语法（变量、混合、嵌套等）并转成标准CSS
4. 通过css-loader和style-loader处理或单独提取CSS文件

---

webpack的 loader 和 plugin 区别

| 特性     | Loader                                    | Plugin                                                 |
| -------- | ----------------------------------------- | ------------------------------------------------------ |
| 执行时机 | 模块转换阶段，转换单个文件                | 整个构建过程，广播事件                                 |
| 输入     | 文件内容                                  | webpack实例和编译信息                                  |
| 输出     | 转换后的文件                              | 额外功能（如打包、优化）                               |
| 用途     | 文件转换（ES6→ES5、Lass→CSS、图片压缩等） | 执行更广泛的任务（代码分割、环境变量注入、生成文件等） |
| 配置     | module.rules中配置                        | plugins数组中配置                                      |

---

webpack 常用插件

- **HtmlWebpackPlugin**：自动生成HTML文件，注入打包后的JS/CSS
- **MiniCssExtractPlugin**：提取CSS到独立文件
- **CleanWebpackPlugin**：清理dist目录
- **DefinePlugin**：定义全局常量
- **TerserPlugin**：压缩JS代码
- **CssMinimizerPlugin**：压缩CSS代码
- **CopyWebpackPlugin**：复制静态资源
- **CompressionPlugin**：启用gzip压缩
- **BundleAnalyzerPlugin**：分析打包结果

---

webpack 如何做代码拆分

1. **入口起点配置**：通过entry配置分离多页面应用
2. **动态导入（code splitting）**：使用import()或require.ensure()实现路由懒加载
3. **splitChunks配置**：通过optimization.splitChunks分离公共代码和第三方库
4. **防止重复**：使用Entry依赖或splitChunks.duplicates去除重复chunk

---

webpack tree shaking 原理

Tree Shaking是DCE（Dead Code Elimination，死码消除）的实现：

1. **原理**：基于ES Module的静态结构（import/export在编译时确定）来分析模块依赖关系
2. **过程**：标记 → 压缩。标记阶段识别未使用的导出，压缩阶段使用Terser等压缩器删除未使用代码
3. **条件**：必须使用ES Module、使用production模式、开启optimization.usedExports

---

webpack动态导入原理

1. **语法**：使用import()语法，返回Promise
2. **原理**：动态导入会创建一个新的chunk，浏览器在需要时再加载
3. **配置**：通过webpack的output.chunkFilename和magic comments（如/_ webpackChunkName _/）控制
4. **应用**：路由懒加载、组件异步加载

---

webpack 热更新原理

1. **HMR Server**：webpack-dev-server中的HMR服务器
2. **HMR Runtime**：浏览器端的HMR运行时
3. **流程**：代码修改 → HMR Server通知HMR Runtime → HMR Runtime拉取更新模块 → Webpack接受新模块 → HotModuleReplacementPlugin处理更新逻辑 → 页面局部更新

---

webpack5 新特性

- **Module Federation**：模块联邦，支持跨项目共享模块
- **持久化缓存**：cache数据持久化到磁盘，加快二次构建
- **更好的Tree Shaking**：支持更多导出类型的Tree Shaking
- **智能增量编译**：更快的构建速度
- **Chunk ID稳定**：生产环境chunk名称不再随机
- **WebAssembly支持**：更好的Wasm支持
- **移除Node.js polyfill**：减少包体积

---

esm和 commonjs 的区别

| 特性       | ESM            | CommonJS              |
| ---------- | -------------- | --------------------- |
| 导入方式   | import         | require               |
| 导出方式   | export         | module.exports        |
| 加载时机   | 编译时（静态） | 运行时（动态）        |
| 值引用     | 只读引用       | 值拷贝                |
| this       | undefined      | undefined（模块顶层） |
| 循环依赖   | 较好处理       | 可能出现问题          |
| 浏览器支持 | 原生支持       | 需要打包              |
| 严格模式   | 自动启用       | 不自动启用            |

TS 的 type 和 interface 的区别

| 特性     | type          | interface                     |
| -------- | ------------- | ----------------------------- |
| 定义方式 | 类型别名      | 接口声明                      |
| 扩展方式 | 交叉类型      | extends                       |
| 合并声明 | 不支持        | 支持（同名interface自动合并） |
| 计算属性 | 可以          | 不可以                        |
| 语法     | `type A = {}` | `interface A {}`              |

**相同点**：都可以描述对象或函数，都支持继承和泛型

---

TS 怎么做枚举

使用enum关键字定义枚举：

```typescript
enum Color {
  Red,
  Green,
  Blue,
}
// 编译后：var Color = { 0: 'Red', 1: 'Green', 2: 'Blue', Red: 0, Green: 1, Blue: 2 }
```

**枚举类型**：

- 数字枚举：默认从0开始
- 字符串枚举：每个成员需要字面量初始化
- 常量枚举：使用const声明，编译时内联
- 异构枚举：混合数字和字符串

---

TS 泛型

泛型是TypeScript的一种参数化类型机制，用于创建可复用的组件：

**基本用法**：

```typescript
function identity<T>(arg: T): T {
  return arg;
}
```

**泛型约束**：限制泛型的范围

```typescript
function loggingIdentity<T extends { length: number }>(arg: T): T { ... }
```

**常见泛型类型**：

- `Array<T>` 或 T[]
- `Promise<T>`
- `Record<K, T>`
- `Partial<T>`
- `Readonly<T>`

**应用场景**：函数、类、接口的类型参数化

---

canvas 绘制流程，canvas 里的图片跨域怎么处理

**Canvas绘制流程**：

1. 获取canvas元素和2D上下文：`const ctx = canvas.getContext('2d')`
2. 设置画布尺寸：`canvas.width = 600; canvas.height = 400`
3. 绑定图片源：`const img = new Image(); img.src = 'url'`
4. 加载图片后绘制：`img.onload = () => ctx.drawImage(img, x, y)`
5. 调用绘图API：fillRect、arc、path等
6. 保存或导出：`canvas.toDataURL()` 或 `toBlob()`

**Canvas图片跨域处理**：

1. 设置图片crossOrigin属性：`img.crossOrigin = 'anonymous'`
2. 服务器设置CORS头：`Access-Control-Allow-Origin: *`
3. 使用可信域名或携带凭证
4. 设置 `img.crossOrigin = 'use-credentials'` 并验证Cookie

---

项目经历:babel插件的实现

Babel插件用于转换JavaScript代码：

**插件结构**：

- 访问者模式（Visitor Pattern）
- 每个节点类型对应一个处理函数
- 返回新节点或undefined

**基本格式**：

```javascript
export default function (babel) {
  return {
    visitor: {
      Identifier(path, state) {
        // 转换逻辑
      },
    },
  };
}
```

**常见插件用途**：语法转换、polyfill填充、代码优化

---

编程题:实现一个深拷贝

**深拷贝需要注意哪些问题?**

1. **循环引用**：使用WeakMap记录已拷贝的对象
2. **特殊对象**：Date、RegExp、Map、Set、Symbol等需要特殊处理
3. **函数**：函数无法拷贝，通常保持引用或使用其他方式
4. **原型链**：需要保留原型信息
5. **属性描述符**：如getter/setter、enumerable等
6. **不可枚举属性**：需要使用Object.getOwnPropertyNames()

**判断数组的方法有哪些?**

1. `Array.isArray()` - 最推荐
2. `Object.prototype.toString.call(arr)` - 返回 '[object Array]'
3. `arr instanceof Array` - 可能有iframe问题
4. `Array.prototype.isPrototypeOf(arr)` - 同上
5. `arr.constructor === Array` - 可能被修改

**手写instanceof方法**：

```javascript
function myInstanceof(left, right) {
  let proto = left.__proto__;
  while (proto !== null) {
    if (proto === right.prototype) return true;
    proto = proto.__proto__;
  }
  return false;
}
```

---

如何借鉴React diff算法的思想，实现各种情况树节点的更新

React Diff算法的核心思想：

1. **同层比较**：只比较同一层级的节点，不同层级直接替换
2. **key匹配**：通过key匹配新旧节点，复用DOM
3. **对比策略**：
   - 不同类型节点：直接卸载并替换
   - 同类型节点：对比props和children
   - 列表对比：使用key识别节点身份

**实现思路**：

- 使用虚拟DOM树结构
- 深度优先遍历比较新旧节点
- 记录差异到差异队列
- 批量应用差异到真实DOM

---

怎么让中间页携带上cookie?

1. **同源请求**：Cookie会自动携带
2. **跨域携带**：
   - 设置 `withCredentials = true`
   - 服务器设置 `Access-Control-Allow-Credentials: true`
   - 响应头设置具体域名而非 `*`
3. **中间页方案**：
   - 后端在重定向时写入Cookie
   - 通过URL参数传递sessionId
   - 使用Bearer Token替代Cookie

---

说说跨域问题

**跨域原因**：浏览器出于安全考虑，限制非同源资源的访问

**同源策略**：协议、域名、端口三者相同

**解决方案**：

- **CORS**：服务端设置 `Access-Control-Allow-Origin`
- **JSONP**：利用script标签不受跨域限制（仅GET）
- **代理服务器**：Nginx/Node代理转发
- **WebSocket**：不受同源策略限制
- **postMessage**：跨窗口通信
- **document.domain**：用于子域名跨域

---

讲讲webpack的整个工作流程

**Webpack工作流程**：

1. **初始化**：读取配置，初始化Compiler
2. **编译**：创建Compilation
3. **编译阶段**：
   - 读取文件内容
   - 调用Loader处理文件
   - 生成AST语法树
4. **输出阶段**：
   - 使用Plugin广播事件
   - 生成Chunk
   - 输出文件到dist目录

**核心概念**：

- Entry：入口文件
- Output：输出配置
- Loader：文件转换
- Plugin：扩展功能
- Chunk：代码块
- Bundle：最终产物

---

有没有用过webpack的loader解决过一些具体的场景问题?

**常见Loader应用场景**：

- `babel-loader`：ES6+转ES5
- `ts-loader`：处理TypeScript
- `less-loader`/`sass-loader`：预处理CSS
- `css-loader`/`style-loader`：处理CSS模块
- `file-loader`/`url-loader`：处理静态资源
- `vue-loader`：处理Vue组件
- `image-webpack-loader`：图片压缩

**自定义Loader场景**：

- 处理特殊文件格式
- 内容替换和变量注入
- 自定义语法转换

---

ES5怎么实现继承? 讲讲对原型链的理解

**ES5继承方式**：

1. **原型链继承**：

```javascript
Parent.prototype = new Parent();
Child.prototype = new Child();
```

2. **构造函数继承**：

```javascript
function Child(...args) {
  Parent.apply(this, args);
}
```

3. **组合继承**：原型链 + 构造函数

4. **寄生组合继承**：最佳方式，避免实例属性重复

**原型链理解**：

- 每个对象有 `__proto__` 属性指向构造函数的prototype
- prototype对象也有自己的 `__proto__`，形成链式结构
- 属性查找沿链向上，直到Object.prototype
- `Object.prototype.__proto__ === null`

**原型链顶端**：`Object.prototype`

---

require和import的区别?

| 特性     | require        | import     |
| -------- | -------------- | ---------- |
| 模块类型 | CommonJS       | ES Module  |
| 加载方式 | 运行时         | 编译时     |
| 语法     | 动态           | 静态       |
| 导入方式 | 解构赋值       | 指定导入   |
| 导出方式 | module.exports | export     |
| 循环处理 | 可能问题       | 较好支持   |
| 浏览器   | 需打包         | 可原生支持 |

HTTP与HTTPS的区别?

**HTTP与HTTPS的区别**：

| 特性   | HTTP     | HTTPS           |
| ------ | -------- | --------------- |
| 安全性 | 明文传输 | SSL/TLS加密     |
| 端口   | 80       | 443             |
| 证书   | 不需要   | 需要CA证书      |
| 连接   | 无连接   | SSL握手建立连接 |
| SEO    | 不利     | 有利于SEO       |
| 性能   | 较快     | 略有性能损耗    |
| 成本   | 无       | CA证书成本      |

**HTTPS工作原理**：

1. 客户端发送Client Hello
2. 服务器发送证书和Server Hello
3. 证书验证和密钥交换
4. 加密通信建立

---

get和post的区别

| 特性     | GET                      | POST       |
| -------- | ------------------------ | ---------- |
| 用途     | 获取资源                 | 提交数据   |
| 参数位置 | URL查询参数              | 请求体     |
| 安全性   | 较低（参数暴露）         | 较高       |
| 长度限制 | URL长度限制（浏览器2KB） | 无限制     |
| 缓存     | 可缓存                   | 一般不缓存 |
| 历史记录 | 参数保留在历史记录       | 一般不保留 |
| 数据类型 | ASCII                    | 任意类型   |

**GET POST共同点**：都是HTTP方法，都基于TCP/IP

---

TCP与UDP的区别?

| 特性     | TCP            | UDP               |
| -------- | -------------- | ----------------- |
| 连接     | 面向连接       | 无连接            |
| 可靠性   | 可靠           | 不可靠            |
| 传输方式 | 字节流         | 数据报文          |
| 速度     | 较慢           | 较快              |
| 拥塞控制 | 有             | 无                |
| 头部大小 | 20-60字节      | 8字节             |
| 适用场景 | 文件传输、网页 | 视频流、DNS、游戏 |

---

cookie和session的区别

| 特性     | Cookie       | Session      |
| -------- | ------------ | ------------ |
| 存储位置 | 浏览器       | 服务器       |
| 存储大小 | <=4KB        | 无限制       |
| 安全性   | 较低         | 较高         |
| 有效期   | 可设置       | 随浏览器关闭 |
| 传输     | 请求自动携带 | 需手动传递   |
| 资源消耗 | 客户端资源   | 服务器资源   |

**关系**：Session通常依赖Cookie存储sessionId

---

常用响应状态码含义

**1xx**：信息性状态码

- 100 Continue、101 Switching Protocols

**2xx**：成功状态码

- 200 OK、201 Created、204 No Content

**3xx**：重定向状态码

- 301 Moved Permanently、302 Found、304 Not Modified

**4xx**：客户端错误状态码

- 400 Bad Request、401 Unauthorized、403 Forbidden、404 Not Found

**5xx**：服务器错误状态码

- 500 Internal Server Error、502 Bad Gateway、503 Service Unavailable、504 Gateway Timeout

---

三次挥手、四次握手

**TCP三次握手**：

1. 客户端发送SYN包（SYN=j）进入SYN_SEND状态
2. 服务器收到SYN，发送SYN+ACK包（SYN=k, ACK=j+1）进入SYN_RECV状态
3. 客户端收到SYN+ACK，发送ACK包（ACK=k+1），建立连接

**TCP四次挥手**：

1. 主动方发送FIN包，进入FIN_WAIT_1状态
2. 被动方收到FIN，发送ACK包，进入CLOSE_WAIT状态
3. 被动方处理完数据，发送FIN包，进入LAST_ACK状态
4. 主动方收到FIN，发送ACK包，进入TIME_WAIT状态，等待2MSL后关闭

---

抓包fiddler的作用有哪些?

1. **抓取HTTP/HTTPS请求**：查看请求和响应详情
2. **修改请求**：测试接口参数边界
3. **弱网测试**：模拟慢速网络
4. **移动端抓包**：设置代理抓取App请求
5. **接口Mock**：修改响应数据
6. **性能分析**：查看请求耗时
7. **前后端Bug定位**：区分问题归属

---

如何通过fiddler定位前后端bug?

1. **看响应状态码**：4xx一般是前端问题，5xx一般是后端问题
2. **看响应数据格式**：格式错误是后端问题
3. **看业务逻辑**：数据错误可能是后端，交互错误可能是前端
4. **打断点**：修改请求参数测试
5. **过滤域名**：快速定位问题接口

---

怎么抓取https，设置断点?

1. **抓取HTTPS**：
   - 勾选Options → Decrypt HTTPS Traffic
   - 勾选Actions → Trust Root Certificate
   - 安装证书并信任

2. **设置断点**：
   - F11设置请求前断点
   - Shift+F11设置响应后断点
   - 可修改请求或响应数据

---

接口测试用例具体怎么设计?

1. **功能测试**：
   - 正向数据（正常参数）
   - 边界值（最大/最小/临界值）
   - 异常数据（空值、错误格式）

2. **参数测试**：
   - 必填参数缺失
   - 参数类型错误
   - 参数组合测试

3. **业务测试**：
   - 业务流程覆盖
   - 状态机测试
   - 权限测试

4. **安全测试**：
   - SQL注入、XSS
   - 越权访问
   - 敏感信息加密

---

什么时候进行接口测试?

1. **开发阶段**：接口开发完成提测前
2. **集成测试**：前后端联调时
3. **回归测试**：代码变更后
4. **上线前**：确保线上功能正常

---

你们公司的接口测试是如何做的?

常见流程：

1. 制定接口文档（Swagger/RAP）
2. 使用工具测试（Postman/Jmeter/Apifox）
3. 自动化测试脚本（Python/JavaScript）
4. 持续集成（Jenkins/GitLab CI）
5. 测试报告生成

---

一个项目中迭代项目一般包括多少个接口?

数量取决于项目复杂度：

- 小型项目：10-30个接口
- 中型项目：30-100个接口
- 大型项目：100+个接口

---

接口测试contenttype常见的类型有哪些?

1. **application/json**：JSON数据
2. **application/x-www-form-urlencoded**：表单数据
3. **multipart/form-data**：文件上传
4. **text/xml**：XML数据
5. **application/xml**：XML数据

1.前端如何实现截图?

**前端截图实现方式**：

1. **html2canvas**：将DOM转换为Canvas

```javascript
import html2canvas from "html2canvas";
html2canvas(document.body).then((canvas) => {
  const url = canvas.toDataURL();
  // 下载或上传
});
```

2. **Canvas截图**：手动绘制

```javascript
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
// 绘制页面内容
```

3. **window.captureVirtualDocument()**：Firefox私有API
4. **MediaDevices.getDisplayMedia()**：屏幕捕获API
5. **截图插件**：html2canvas、dom-to-image等

---

2.当QPS达到峰值时，该如何处理?

**前端处理方案**：

1. **请求合并**：将多个请求合并为一个批量请求
2. **请求缓存**：对相同请求进行缓存
3. **防抖节流**：限制请求频率
4. **请求队列**：控制并发数量
5. **骨架屏**：减少用户感知等待

**后端处理方案**：

1. **负载均衡**：多服务器分流
2. **限流熔断**：拒绝过量请求
3. **服务降级**：关闭非核心功能
4. **消息队列**：异步处理请求
5. **CDN缓存**：静态资源加速

---

3.js 超过 Number 最大值的数怎么处理?

**Number.MAX_VALUE** = 1.7976931348623157e+308

**处理方式**：

1. **BigInt**：ES2020引入，任意精度整数

```javascript
const bigNum = 9007199254740993n; // 添加n后缀
```

2. **字符串处理**：将大数转为字符串运算

```javascript
// 手动实现加法
function addStrings(a, b) {
  let i = a.length - 1,
    j = b.length - 1,
    carry = 0;
  let result = "";
  while (i >= 0 || j >= 0 || carry) {
    // 逐位相加
  }
  return result;
}
```

3. **第三方库**：decimal.js、bignumber.js、big.js

---

4.使用同一个链接，如何实现 PC 打开是 web 应用、手机打开是一个 H5 应用?

**实现方式**：

1. **User-Agent检测**：

```javascript
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
```

2. **响应式设计**：同一页面适配不同设备
3. **服务端渲染**：后端根据UA返回不同页面
4. **Vary User-Agent头**：CDN缓存不同版本
5. **设备指纹**：更精确的设备识别

---

5.如何保证用户的使用体验

1. **性能优化**：
   - 首屏加载优化（代码分割、懒加载）
   - 骨架屏、Loading状态
   - 图片优化（压缩、CDN、WebP）

2. **交互优化**：
   - 操作反馈及时
   - 防抖节流避免频繁操作
   - 友好的错误提示

3. **稳定性**：
   - 异常监控
   - 降级策略
   - 离线可用

---

6.如何解决页面请求接口大规模并发问题

1. **前端限流**：
   - 请求队列管理
   - 并发数量控制
   - 请求取消与重试

2. **缓存策略**：
   - 请求缓存
   - 本地缓存
   - 预加载数据

3. **分批处理**：
   - 分页请求
   - 虚拟滚动
   - 懒加载

4. **数据压缩**：
   - gzip压缩
   - protobuf

---

7.设计一套全站请求耗时统计工具？

**统计方式**：

1. `Performance API`：performance.timing
2. `Resource Timing API`：performance.getEntriesByType('resource')
3. `User Timing API`：performance.mark/measure
4. `Beacon API`：异步上报

**统计指标**：

- DNS解析时间
- TCP连接时间
- SSL握手时间
- 首字节时间(TTFB)
- 内容下载时间
- 白屏时间
- 可交互时间(TTI)

**实现思路**：

```javascript
// 拦截所有请求
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    // 上报 entry.duration, entry.name 等
  });
});
observer.observe({ entryTypes: ["resource", "paint"] });
```

---

8.大文件上传了解多少？大文件分片上传？大文件上传断点续传

**大文件上传方案**：

1. **分片上传**：
   - 将文件切成多个chunk
   - 并发上传多个分片
   - 服务端合并

2. **断点续传**：
   - 记录已上传的分片
   - 刷新后从中断处继续
   - 使用localStorage或服务端记录进度

3. **秒传**：
   - 上传前计算文件MD5
   - 服务端已存在则直接成功

4. **实现**：

```javascript
// 使用 spark-md5 计算文件hash
// 使用 XMLHttpRequest 的 progress 事件
// 使用 FormData 分片上传
```

---

9.H5 如何解决移动端适配问题

1. ** viewport meta标签**：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

2. **rem/vw适配**：

```css
html {
  font-size: calc(100vw / 7.5);
}
```

3. **媒体查询**：

```css
@media (min-width: 768px) {
  /* tablet */
}
@media (min-width: 1024px) {
  /* desktop */
}
```

4. **flexible方案**：淘宝H5适配方案
5. **PostCSS插件**：autoprefixer、px2rem
6. **动态计算**：lib-flexible库

---

10.站点一键换肤的实现方式有哪些?

**换肤方案**：

1. **CSS变量切换**：

```css
:root {
  --primary-color: #1890ff;
}
[data-theme="dark"] {
  --primary-color: #1890ff-dark;
}
```

切换时修改 `document.documentElement.dataset.theme`

2. **less.modifyVars**：

```javascript
less.modifyVars({ "@primaryColor": "#000" });
```

3. **动态加载CSS**：加载不同主题的CSS文件
4. **CSS-in-JS**：如styled-components
5. **本地存储**：记住用户选择

---

11.如何实现网页加载进度条?

**实现方式**：

1. **NProgress**：经典进度条库
2. **手动实现**：

```javascript
// 监听页面加载
window.addEventListener("load", () => {
  NProgress.done();
});

// 监听资源加载
const observer = new PerformanceObserver((list) => {
  const progress = calculateProgress();
  NProgress.set(progress);
});
observer.observe({ entryTypes: ["resource"] });
```

3. **fake-loader**：CSS实现的假进度条
4. **CSS动画**：纯CSS进度指示器

---

12.常见图片懒加载方式有哪些?

1. **IntersectionObserver**：

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src;
      observer.unobserve(entry.target);
    }
  });
});
```

2. **getBoundingClientRect**：

```javascript
window.addEventListener(
  "scroll",
  throttle(() => {
    const scrollTop = document.documentElement.scrollTop;
    // 判断元素是否在视口内
  }),
);
```

3. **loading="lazy"**：原生懒加载
4. **srcset属性**：响应式图片懒加载

---

13.cookie 构成部分有哪些？

**Cookie属性**：

- `name`：名称
- `value`：值
- `expires`：过期时间
- `max-age`：最大存活时间（秒）
- `path`：路径
- `domain`：域
- `secure`：仅HTTPS传输
- `HttpOnly`：禁止JS访问
- `SameSite`：跨站策略（Strict/Lax/None）

---

14.扫码登录实现方式？

**扫码登录原理**：

1. **生成二维码**：服务端生成唯一标识code
2. **前端展示**：页面展示二维码和code
3. **App扫码**：调用API上传code和token
4. **轮询确认**：前端轮询验证登录状态
5. **建立会话**：成功后建立session/跳转

**实现流程**：

- PC端：请求code → 展示二维码
- 手机端：扫码 → 输入账号密码/确认登录 → 上报token
- PC端：轮询状态 → 登录成功

---

15.DNS协议了解多少？

**DNS协议**：

1. **作用**：域名解析为IP地址
2. **端口**：53端口
3. **查询方式**：
   - 递归查询：DNS服务器完整解析
   - 迭代查询：客户端逐级查询

4. **缓存**：
   - 浏览器缓存
   - 系统缓存
   - DNS服务器缓存

5. **DNS记录类型**：
   - A记录：域名指向IP
   - CNAME：域名别名
   - MX：邮件服务器
   - TXT：文本记录

6. **优化**：
   - DNS预解析：`<link rel="dns-prefetch">`
   - 减少域名数量

---

16.函数式编程了解多少?

**函数式编程的核心概念**：

1. **纯函数**：相同输入总是相同输出，无副作用
2. **不可变性**：数据不可修改，产生新数据
3. **函数组合**：多个函数组合成新函数
4. **柯里化**：将多参数函数转为单参数函数
5. **高阶函数**：函数作为参数或返回值
6. **函子(Functor)**：包装值的容器
7. **Monad**：链式操作的容器

**函数式编程的优势**：

1. **可预测性**：无副作用，结果确定
2. **可测试性**：纯函数易于单元测试
3. **并发安全**：不可变性避免竞态
4. **易于推理**：声明式代码更易理解
5. **可组合**：函数复用性强

---

17.前端水印了解多少?

**明水印和暗水印的区别**：

- **明水印**：肉眼可见，直接覆盖在页面上
- **暗水印**：肉眼不可见，隐藏在其他数据中

**添加明水印手段**：

1. **Canvas生成**：

```javascript
const canvas = document.createElement("canvas");
canvas.width = 200;
canvas.height = 100;
const ctx = canvas.getContext("2d");
ctx.fillText("水印内容", 10, 50);
// 设为背景图
```

2. **SVG背景**：使用SVG重复图案
3. **CSS伪元素**：`::before` 或 `::after`

**防止删除CSS水印**：

1. MutationObserver监听DOM变化
2. 定时检测水印元素是否存在
3. 动态重绘水印
4. 结合暗水印

**暗水印原理**：

1. **LSB隐写**：最低有效位隐藏信息
2. **颜色通道**：在不同颜色通道隐藏
3. **频域隐写**：傅里叶变换隐藏
4. 通常用于图片/音视频
5. 米哈游方案，隐藏在图像内部
6. 起点读数方案，隐藏在短句中

---

18.什么是领域模型

**领域模型**：
是对业务领域中概念和关系的抽象模型，描述业务实体及其关系。

**前端系统划分领域模型**：

1. **用户域**：登录、权限、个人信息
2. **订单域**：购物车、结算、订单管理
3. **商品域**：商品详情、搜索、分类
4. **内容域**：文章、评论、内容管理
5. **支付域**：支付方式、账单、退款

**划分原则**：

- 高内聚低耦合
- 单一职责
- 领域边界清晰
- 依赖关系单向

---

19.一直在 window 上面挂东西是否有什么风险

**风险**：

1. **内存泄漏**：未清理的全局变量累积
2. **命名冲突**：与其他库或代码冲突
3. **安全风险**：暴露敏感数据
4. **性能问题**：查找速度变慢
5. **维护困难**：全局状态难以追踪
6. **垃圾回收受阻**：引用关系复杂

**最佳实践**：

- 使用模块化避免全局污染
- 及时清理（removeEventListener）
- 使用IIFE或ES Module
- 使用Proxy包装

---

20.深度 SEO 优化的方式有哪些， 从技术层面来说

**技术层面SEO优化**：

1. **Meta标签**：title、description、keywords
2. **语义化HTML**：header、nav、main、article、section
3. **结构化数据**：Schema.org、JSON-LD
4. **Sitemap**：生成sitemap.xml
5. **Robots.txt**：搜索引擎抓取规则
6. **Canonical**：URL规范化

**性能优化**：

1. **首屏加载**：SSR/预渲染
2. **页面速度**：Core Web Vitals
3. **移动友好**：响应式设计
4. **HTTPS**：安全网站优先

**内容优化**：

1. **关键字优化**：标题、正文、ALT
2. **内链外链**：合理的链接结构
3. **内容质量**：原创、有价值的内容

   21.小程序为什么会有两个线程

**小程序双线程模型**：

- **渲染线程**：WebView，负责UI渲染
- **JS线程**：逻辑层，负责JS执行

**原因**：

1. **安全管控**：防止开发者直接操作DOM
2. **性能隔离**：避免JS执行阻塞渲染
3. **数据安全**：setData传输数据而非DOM操作
4. **平台统一**：抹平iOS/Android差异

**通信机制**：

- Native层作为中转
- 采用虚拟DOM思想，数据驱动视图
- 有一定的通信损耗

---

22.web 应用中如何对静态资源加载失败的场景做降级处理

**降级策略**：

1. **重试机制**：

```javascript
function loadScript(src, retries = 3) {
  return fetch(src).catch(() =>
    retries > 0 ? loadScript(src, retries - 1) : fallback(src),
  );
}
```

2. **备用资源**：

```javascript
<img src="original.jpg" onerror="this.src='fallback.jpg'">
```

3. **CDN降级**：主CDN失败切换到备CDN
4. **本地缓存**：Service Worker缓存优先
5. **离线页面**：静态资源加载失败时显示离线页面
6. **错误监控**：上报加载失败进行排查

---

23.html 中前缀为 data- 开头的元素属性是什么?

**data-\* 属性**：

- 用于存储页面私有的自定义数据
- 可以在HTML元素上存储额外信息
- JavaScript可通过dataset访问

**示例**：

```html
<div data-user-id="123" data-role="admin">内容</div>
```

```javascript
const userId = element.dataset.userId;
element.dataset.role = "superadmin";
```

**特点**：

- 命名规范：data-后面至少一个字符
- 存储格式：字符串
- 不影响页面布局和性能
- 适合存储简单数据

---

24.移动端如何实现上拉加载，下拉刷新?

**实现方式**：

1. **原生API**：Better-Scroll、Pulltorefresh.js
2. **Scroll事件**：

```javascript
window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - threshold) {
    loadMore();
  }
});
```

3. **Touch事件**：

```javascript
let startY = 0;
element.addEventListener("touchstart", (e) => {
  startY = e.touches[0].pageY;
});
element.addEventListener("touchmove", (e) => {
  const deltaY = e.touches[0].pageY - startY;
  if (deltaY > 0 && scrollTop === 0) {
    // 下拉刷新
  }
});
```

4. **CSS overscroll-behavior**：控制滚动边界行为
5. **Native实现**：wx.onPullDownRefresh等

---

25.如何判断dom元素是否在可视区域

**判断方法**：

1. **getBoundingClientRect**：

```javascript
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
```

2. **IntersectionObserver**：

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // 进入可视区
    }
  });
});
observer.observe(el);
```

3. **scrollIntoView**：el.scrollIntoView()

---

26.前端如何用 canvas 来做电影院选票功能？

**实现思路**：

1. **绘制座位图**：Canvas绘制座位矩阵

```javascript
ctx.fillStyle = seat.status === "available" ? "#00ff00" : "#ff0000";
ctx.fillRect(x, y, width, height);
```

2. **座位状态**：可用、已售、选中、损坏

3. **交互处理**：

- 点击事件检测座位
- 多选逻辑（最多N张票）
- 价格计算

4. **缩放和平移**：

- 监听wheel事件缩放
- 拖拽平移视图

5. **性能优化**：

- 分层Canvas
- 局部重绘
- 事件节流

---

27.如何通过设置失效时间清除本地存储的数据?

**方案**：

1. **Storage封装**：

```javascript
const storage = {
  set(key, value, expire) {
    const data = { value, expire: Date.now() + expire };
    localStorage.setItem(key, JSON.stringify(data));
  },
  get(key) {
    const data = JSON.parse(localStorage.getItem(key));
    if (data && Date.now() > data.expire) {
      localStorage.removeItem(key);
      return null;
    }
    return data.value;
  },
};
```

2. **定时清理**：页面加载时清理过期数据
3. **前端数据库**：Dexie.js等支持过期机制
4. **后端控制**：敏感数据存服务端

---

28.如果不使用脚手架，如何用 webpack 构建一个自己的 react 应用?

**Webpack配置要点**：

```javascript
module.exports = {
  entry: "./src/index.js",
  output: { path: __dirname + "/dist", filename: "bundle.js" },
  module: {
    rules: [
      { test: /\.jsx?$/, use: "babel-loader", exclude: /node_modules/ },
      { test: /\.less$/, use: ["style-loader", "css-loader", "less-loader"] },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  resolve: { extensions: [".js", ".jsx"] },
  plugins: [new HtmlWebpackPlugin()],
};
```

**支持CSS Module**：

```javascript
{
  test: /\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: { modules: true }
    }
  ]
}
```

**按需加载antd**：

```javascript
// babel.config.js
plugins: [
  ["import", { libraryName: "antd", libraryDirectory: "es", style: true }],
];
```

---

29.用nodejs实现一个命令行工具，统计输入目录下

**实现思路**：

```javascript
#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function countFiles(dir, stats = { files: 0, lines: 0 }) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      countFiles(filePath, stats);
    } else {
      stats.files++;
      const content = fs.readFileSync(filePath, "utf-8");
      stats.lines += content.split("\n").length;
    }
  });

  return stats;
}

const dir = process.argv[2] || ".";
console.log(countFiles(dir));
```

---

33.[React]如何进行路由变化监听

**监听方式**：

1. **Route component props**：

```jsx
<Route path="/:id" component={Component} />
// 在组件内 this.props.location.pathname 变化时会重新渲染
```

2. **useLocation Hook**：

```jsx
import { useLocation } from "react-router-dom";
function Component() {
  const location = useLocation();
  useEffect(() => {
    console.log("路由变化:", location.pathname);
  }, [location]);
}
```

3. **withRouter HOC**（类组件）：

```jsx
withRouter(connect(mapState)(Component));
```

4. **History API**：

```jsx
useEffect(() => {
  const unlisten = props.history.listen((location) => {
    console.log("路由变化");
  });
  return () => unlisten();
}, [props.history]);
```

---

34.单点登录是什么，具体流程是什么

**单点登录(SSO)**：
用户只需登录一次，即可访问多个相互信任的应用系统。

**实现流程**：

1. **用户访问A系统**：A系统无登录状态，跳转到SSO登录页
2. **用户登录**：SSO验证用户名密码，生成全局session
3. **生成Token**：SSO生成令牌，跳转回A系统
4. **A系统验证**：A系统验证Token，建立本地会话
5. **访问B系统**：B系统发现未登录，跳转SSO
6. **SSO验证**：SSO发现已登录，直接返回令牌
7. **B系统验证**：B系统验证令牌，建立本地会话

**CAS协议**：最常用的SSO实现方案

---

35.web 网页如何禁止别人移除水印

**防护措施**：

1. **MutationObserver**：

```javascript
const observer = new MutationObserver(() => {
  if (!watermarkElement) {
    reRenderWatermark();
  }
});
observer.observe(document.body, { childList: true, subtree: true });
```

2. **定期检查**：setInterval检查水印是否存在
3. **CSS样式保护**：

```css
.watermark {
  pointer-events: none;
}
```

4. **不可选中**：user-select: none
5. **层级保护**：确保水印在最上层
6. **暗水印补充**：视觉水印被移除后仍有暗水印追溯

---

36.用户访问页面白屏了，原因是啥，如何排查?

**白屏原因**：

1. **JS错误**：语法错误、运行时异常
2. **资源加载失败**：CSS、JS文件404
3. **网络问题**：CDN故障、dns污染
4. **浏览器兼容**：不兼容的API
5. **CSP策略**：内容安全策略阻止
6. **框架错误**：React/Vue渲染失败

**排查方法**：

1. **检查控制台**：F12查看Error信息
2. **Network面板**：检查资源加载情况
3. **Sources断点**：定位错误位置
4. **错误监控**：Sentry等工具
5. **用户环境**：用户浏览器、操作系统
6. **服务端日志**：后端错误日志
7. **降级方案**：静态HTML兜底

---

37.[代码实现]JS 中如何实现大对象深度对比

**实现思路**：

```javascript
function deepEqual(obj1, obj2, visited = new WeakMap()) {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;

  if (visited.has(obj1)) return visited.get(obj1) === obj2;
  visited.set(obj1, obj2);

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key], visited)) return false;
  }

  return true;
}
```

**优化点**：

- 处理循环引用
- 处理特殊对象(Date、RegExp)
- 处理Map、Set等数据结构
- 性能优化：类型快速失败

---

38.如何理解数据驱动视图，有哪些核心要素?

**数据驱动视图**：
一种编程范式，通过修改数据自动触发视图更新，无需直接操作DOM。

**核心要素**：

1. **状态(State)**：应用数据的唯一来源
2. **虚拟DOM**：描述UI的JS对象树
3. **Diff算法**：计算最优更新方式
4. **渲染函数**：将数据渲染为UI
5. **响应式系统**：数据变化自动通知订阅者

**框架实现**：

- **Vue**：Proxy响应式 + 模板编译
- **React**：setState触发重新渲染 + Diff
- **Angular**：Zone.js脏检查

---

39.vue-cli 都做了哪些事儿，有哪些功能?

**vue-cli功能**：

1. **项目脚手架**：交互式创建项目
2. **插件系统**：一键添加依赖（Vue Router、Vuex）
3. **图形界面**：GUI项目管理
4. **Preset配置**：保存和复用项目配置

**构建功能**：

- Webpack配置集成
- 开发服务器热更新
- 生产环境构建优化
- ESLint代码检查
- 单元测试/E2E测试
- 现代模式（Modern JS）

**核心包**：

- `@vue/cli-service`：开发/构建服务
- `@vue/cli-plugin-babel`：Babel转译
- `@vue/cli-plugin-router`：路由插件
- `@vue/cli-plugin-vuex`：状态管理插件

---

40.JS 执行 100万个任务，如何保证浏览器不卡顿?

**解决方案**：

1. **分片处理**：

```javascript
function processTasks(tasks, chunkSize = 1000) {
  let index = 0;
  function processChunk() {
    const chunk = tasks.slice(index, index + chunkSize);
    chunk.forEach((task) => task());
    index += chunkSize;
    if (index < tasks.length) {
      requestIdleCallback(processChunk);
    }
  }
  requestIdleCallback(processChunk);
}
```

2. **requestIdleCallback**：空闲时执行
3. **setTimeout分批**：

```javascript
function processInBatches(tasks, size) {
  let index = 0;
  function batch() {
    for (let i = 0; i < size && index < tasks.length; i++) {
      tasks[index++]();
    }
    if (index < tasks.length) {
      setTimeout(batch, 0);
    }
  }
  batch();
}
```

4. **Web Worker**：后台线程执行
5. **时间切片**：使用performance.now()控制时间
6. **优化算法**：减少计算复杂度

---

41.JS 放在 head 里和放在 body 里有什么区别?

**区别**：

1. **执行时机**：
   - head中：页面解析前执行
   - body末尾：页面解析后执行

2. **页面渲染**：
   - head中JS：阻塞页面渲染
   - body中JS：不影响初始渲染

3. **DOM访问**：
   - head中JS：DOM未加载，需等DOMContentLoaded
   - body中JS：可直接访问DOM

4. **加载顺序**：
   - head中：同步加载，依赖先加载
   - body中：按文档顺序执行

**最佳实践**：

- 库文件放head（如React）
- 业务代码放body末尾
- 使用defer/async改变加载行为

---

42.Eslint 代码检查的过程是啥?

**ESLint工作流程**：

1. **解析**：使用Espree解析JS代码为AST
2. **配置**：加载.eslintrc配置文件
3. **规则执行**：遍历AST，执行配置的规则
4. **报告问题**：将违规信息报告给开发者
5. **自动修复**：部分规则支持自动修复

**配置文件**：

- `parserOptions`：解析器配置
- `env`：环境全局变量
- `extends`：继承规则集
- `rules`：自定义规则
- `plugins`：第三方规则集

**集成方式**：

- CLI命令行
- webpack loader（eslint-loader）
- IDE插件
- Git Hook（husky + lint-staged）
- CI/CD流程

---

43.虚拟滚动加载原理是什么，用代码简单实现一个虚拟滚动

**原理**：
只渲染可见区域的列表项，通过滚动位置计算当前应该显示哪些项。

**基础版本实现**：

```javascript
class VirtualList {
  constructor({ container, itemHeight, renderItem }) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.renderItem = renderItem;
    this.items = [];

    container.addEventListener("scroll", () => this.onScroll());
    this.update();
  }

  setItems(items) {
    this.items = items;
    this.container.style.height = items.length * this.itemHeight + "px";
    this.update();
  }

  onScroll() {
    requestAnimationFrame(() => this.update());
  }

  update() {
    const scrollTop = this.container.scrollTop;
    const viewportHeight = this.container.clientHeight;
    const startIndex = Math.floor(scrollTop / this.itemHeight);
    const endIndex = Math.floor((scrollTop + viewportHeight) / this.itemHeight);

    // 渲染可见项
    // 使用transform定位
  }
}
```

**进阶版本（IntersectionObserver）**：

```javascript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const item = entry.target;
        // 懒加载真实内容
      }
    });
  },
  { rootMargin: "100px" },
);
```

---

44.[React]react-router 和原生路由区别

**React Router vs 原生路由**：

| 特性     | React Router   | 原生路由         |
| -------- | -------------- | ---------------- |
| 类型     | 组件化路由     | 基于History API  |
| 页面刷新 | 无需后台配置   | 需要服务器重定向 |
| 404处理  | 统一处理       | 需服务器配置     |
| SEO      | 需额外处理     | 更友好           |
| 状态管理 | 状态保存在内存 | 可持久化URL      |
| 嵌套路由 | 声明式嵌套     | 实现复杂         |

**原生路由API**：

- `history.pushState()`
- `history.replaceState()`
- `popstate` 事件

---

45.html的行内元素和块级元素的区别

**区别**：

| 特性    | 行内元素   | 块级元素         |
| ------- | ---------- | ---------------- |
| 排列    | 水平排列   | 垂直排列         |
| 宽度    | 由内容决定 | 默认100%父宽度   |
| 高度    | 由内容决定 | 由内容或高度决定 |
| margin  | 水平有效   | 四周有效         |
| padding | 四周有效   | 四周有效         |
| 换行    | 不自动换行 | 自动换行         |

**常见行内元素**：

- `<span>`、`<a>`、`<strong>`
- `<img>`、`<input>`、`<button>`
- `<em>`、`<i>`、`<br>`

**常见块级元素**：

- `<div>`、`<p>`、`<h1>-<h6>`
- `<ul>`、`<ol>`、`<li>`
- `<header>`、`<footer>`、`<nav>`

**转换**：

- `display: inline` / `display: block`

---

46.介绍一下requestIdleCallback api

**requestIdleCallback**：
在浏览器空闲时执行低优先级任务。

**何时使用**：

- 非关键的后台任务
- 预加载未来可能需要的数据
- 分析/上报等非紧急任务

**如何使用**：

```javascript
requestIdleCallback((deadline) => {
  // deadline.timeRemaining() 剩余时间
  // deadline.didTimeout 是否超时
  while (deadline.timeRemaining() > 0 && tasks.length) {
    tasks.shift()();
  }
  if (tasks.length) {
    requestIdleCallback(processTasks);
  }
});
```

**回调函数参数**：

- `timeRemaining()`：剩余空闲时间（毫秒）
- `didTimeout`：是否超时

**注意事项**：

- 浏览器支持情况（Safari不支持）
- 回调可能被延迟很久
- 不适合高优先级任务

**跨浏览器兼容**：

```javascript
window.requestIdleCallback =
  window.requestIdleCallback ||
  function (cb) {
    return setTimeout(
      () =>
        cb({
          timeRemaining: () => 50,
          didTimeout: false,
        }),
      1,
    );
  };
```

---

47.documentFragment api是什么，有哪些使用场景?

**DocumentFragment**：
轻量级文档对象，可在内存中构建DOM结构，一次性插入页面。

**特点**：

- 不属于主文档树
- 修改不会触发回流
- 批量操作效率高

**使用场景**：

1. **批量添加DOM**：

```javascript
const fragment = document.createDocumentFragment();
items.forEach((item) => {
  const li = document.createElement("li");
  li.textContent = item;
  fragment.appendChild(li);
});
ul.appendChild(fragment); // 只触发一次回流
```

2. **模板克隆**：

```javascript
const template = document.getElementById("tpl");
const clone = template.content.cloneNode(true);
```

3. **Vue虚拟列表**：使用DocumentFragment优化

---

48.git pull和git fetch的区别？

**区别**：

| 操作     | git fetch          | git pull               |
| -------- | ------------------ | ---------------------- |
| 下载内容 | 仅下载，不合并     | 下载并合并             |
| 本地分支 | 不更新             | 更新本地分支           |
| 仓库状态 | 安全，不影响工作区 | 可能产生冲突           |
| 用法     | git fetch origin   | git pull origin branch |

**git pull = git fetch + git merge**

**推荐流程**：

1. `git fetch origin` 查看远程更新
2. `git log origin/main --oneline` 检查提交
3. `git merge origin/main` 合并（或rebase）

   70.Eslint 代码检查的过程是啥?

ESLint工作流程：

1. **解析**：使用Espree解析JS代码为AST
2. **配置**：加载.eslintrc配置文件
3. **规则执行**：遍历AST，执行配置的规则
4. **报告问题**：将违规信息报告给开发者
5. **自动修复**：部分规则支持自动修复

配置文件：

- `parserOptions`：解析器配置
- `env`：环境全局变量
- `extends`：继承规则集
- `rules`：自定义规则
- `plugins`：第三方规则集

---

71.HTTP是一个无状态的协议，那么Web应用要怎么保持用户的登录状态?

**保持登录状态的方式**：

1. **Cookie-Session**：
   - 服务端创建session存储用户信息
   - 通过Cookie传递sessionId
   - 服务端根据sessionId查找用户

2. **Token机制**：
   - 服务端生成Token返回客户端
   - 客户端存储Token（localStorage/Cookie）
   - 每次请求携带Token

3. **JWT（JSON Web Token）**：
   - 自包含的令牌
   - 包含用户信息和签名
   - 无状态，可扩展

4. **SSO单点登录**：
   - 中央认证服务
   - 多个子系统共享登录状态

5. **自动续期**：
   - 定期刷新Token
   - 滑动过期策略

---

72.如何检测网页空闲状态(一定时间内无操作)

**如何判断页面是否空闲**：

1. **监听用户行为**：
   - mousemove
   - keydown
   - scroll
   - click
   - touchstart

2. **定时器方案**：

```javascript
let idleTime = 0;
const IDLE_TIMEOUT = 30000; // 30秒

function resetIdleTime() {
  idleTime = 0;
}

// 监听用户行为
["mousemove", "keydown", "scroll"].forEach((event) => {
  document.addEventListener(event, resetIdleTime);
});

// 定时检查
setInterval(() => {
  idleTime += 1000;
  if (idleTime >= IDLE_TIMEOUT) {
    console.log("页面空闲");
  }
}, 1000);
```

**网页空闲检测实现**：

```javascript
function onIdle(callback, idleTime = 30000) {
  let timeoutId;

  const resetTimer = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, idleTime);
  };

  ["mousemove", "keydown", "scroll", "click", "touchstart"].forEach((event) => {
    document.addEventListener(event, resetTimer, { passive: true });
  });

  resetTimer(); // 初始化
}

// 使用
onIdle(() => {
  console.log("用户空闲了");
  // 执行清理、暂停动画等
});
```

**扩展**：

- `requestIdleCallback` API（浏览器原生支持）
- 页面可见性API（visibilitychange）
- 后台任务处理

---

73.为什么 Vite 速度比 Webpack快?

**1、开发模式的差异**：

- **Webpack**：开发时需要打包整个依赖树， bundle模式
- **Vite**：直接启动服务器，按需编译

**2、对ES Modules的支持**：

- Vite利用浏览器原生ESM，直接提供源码
- Webpack将所有模块打包成bundle
- Vite只编译当前需要的文件

**3、底层语言的差异**：

- **Webpack**：使用JavaScript编写，bundle过程慢
- **Vite**：使用Go编写，编译速度更快
- esbuild（Go）比JavaScript更快

**4、热更新的处理**：

- **Webpack**：修改后重新打包相关模块
- **Vite**：修改后仅更新对应模块的HMR边界
- Vite支持毫秒级HMR

---

74.列表分页，快速翻页下的竞态问题

**竞态问题场景**：
用户快速点击下一页（1→2→3），请求返回顺序不确定，导致显示错误页码。

**解决方案**：

1. **请求取消**：

```javascript
let currentPage = 1;
let abortController;

async function fetchPage(page) {
  if (abortController) {
    abortController.abort(); // 取消之前的请求
  }
  abortController = new AbortController();

  try {
    const data = await fetch(`/api/list?page=${page}`, {
      signal: abortController.signal,
    });

    // 验证返回数据是否最新
    if (page !== currentPage) return; // 忽略过期响应
    render(data);
  } catch (e) {
    if (e.name === "AbortError") return;
  }
}
```

2. **版本号控制**：

```javascript
let requestId = 0;

async function fetchPage(page) {
  const id = ++requestId;
  const data = await api.getList(page);

  if (id !== requestId) return; // 过期请求
  render(data);
}
```

3. **防抖处理**：快速翻页时防抖
4. **锁机制**：请求期间禁止点击

---

75.JS 执行 100 万个任务，如何保证浏览器不卡顿?

同第40题，参考分片处理、requestIdleCallback、Web Worker等方案。

---

76.git 仓库迁移应该怎么操作

**方法一：使用 git clone 和 git push**：

```bash
# 克隆旧仓库
git clone --mirror https://github.com/old/repo.git

# 进入仓库目录
cd repo.git

# 推送所有分支和标签到新仓库
git push --mirror https://github.com/new/repo.git
```

**方法二：使用 git bundle**：

```bash
# 打包旧仓库
git bundle create repo.bundle --all

# 传输到新机器后克隆
git clone repo.bundle -b master
```

**方法三：手动添加remote**：

```bash
# 克隆原仓库
git clone https://github.com/old/repo.git

# 添加新仓库remote
git remote add new-origin https://github.com/new/repo.git

# 推送所有分支
git push --all new-origin

# 推送所有标签
git push --tags new-origin

# 删除旧的origin（可选）
git remote remove origin
```

---

77.如何禁止别人调试自己的前端页面代码?

**防护措施**：

1. **禁用右键菜单**：

```javascript
document.addEventListener("contextmenu", (e) => e.preventDefault());
```

2. **屏蔽开发者工具**：

```javascript
// 检测窗口变化
setInterval(() => {
  const threshold = 160;
  if (
    window.outerWidth - window.innerWidth > threshold ||
    window.outerHeight - window.innerHeight > threshold
  ) {
    // 打开调试模式
  }
}, 1000);
```

3. **代码混淆**：UglifyJS、Terser
4. **禁止断点**：禁用debugger语句
5. **接口签名**：后端接口加签名验证
6. **代码水印**：添加可识别的水印

**注意**：无法完全禁止，只能增加调试难度。

---

78.web 系统里面，如何对图片进行优化?

**优化方式**：

1. **格式选择**：
   - JPEG/JPG：照片、复杂图像
   - PNG：需要透明度的图
   - WebP：更好的压缩率
   - SVG：简单图形、图标

2. **压缩工具**：
   - TinyPNG
   - imagemin
   - sharp（Node.js）

3. **响应式图片**：

```html
<img srcset="small.jpg 480w, large.jpg 1200w" sizes="..." />
```

4. **懒加载**：

```html
<img loading="lazy" src="image.jpg" />
```

5. **CDN加速**：使用图片CDN服务
6. **CSS Sprite**：合并小图标
7. **Base64**：极小图片可转Base64内嵌
8. **WebP替代**：现代浏览器使用WebP

---

79.0Auth2.0 是什么登录方式

**OAuth 2.0**：
开放授权协议，允许第三方应用获取用户在其他服务上的有限访问权限。

**授权流程**：

1. 用户点击"使用XX登录"
2. 跳转到授权页面
3. 用户授权
4. 回调返回授权码
5. 后端用授权码换Token
6. 用Token获取用户信息

**授权类型**：

- **授权码模式**：最安全，适合后端
- **隐式模式**：纯前端应用
- **密码模式**：信任的应用
- **客户端凭证**：机器对机器

**常见场景**：

- 第三方登录（GitHub、Google登录）
- 开放API授权

---

80.单点登录是如何实现的?

**单点登录(SSO)**：
用户只需登录一次，即可访问多个相互信任的系统。

**实现方案**：

1. **共享Session**：
   - 多个应用共享同一个Session存储
   - 使用Redis等分布式存储

2. **Cookie共享**：
   - 主域名相同则可共享Cookie
   - 设置domain为主域名

3. **OAuth/SAML协议**：
   - CAS（Central Authentication Service）
   - OAuth 2.0 + OpenID Connect
   - SAML 2.0

**CAS实现单点登录流程**：

1. 用户访问A系统，未登录
2. A系统重定向到CAS登录页
3. 用户在CAS登录（假设已登录则跳过）
4. CAS生成Ticket
5. 浏览器携带Ticket回调A系统
6. A系统验证Ticket，建立局部会话
7. 用户访问B系统，同样流程
8. B系统验证Ticket，建立局部会话

   81.常见的登录鉴权方式有哪些？

**常见登录鉴权方式**：

1. **Cookie-Session**：传统模式，服务器存储session，客户端存cookie
2. **Token认证**：
   - JWT（JSON Web Token）：自包含令牌
   - OAuth 2.0：第三方授权
   - SAML：企业级单点登录
3. **SSO单点登录**：多个系统共用一套登录系统
4. **第三方登录**：OAuth（GitHub、Google等登录）

---

82.需要在跨域请求中携带另外一个域名下的 Cookie 该如何操作?

1. **设置withCredentials**：请求端设置 `xhr.withCredentials = true`
2. **服务端配置CORS**：
   - `Access-Control-Allow-Credentials: true`
   - `Access-Control-Allow-Origin: 具体域名（不能是*）`
3. **Cookie属性**：
   - 设置 `SameSite: None`（需Secure）
   - 设置正确的 `Domain` 属性
4. **使用代理**：同域代理转发请求

---

83.vite 和 webpack 在热更新上有啥区别?

| 特性       | Vite                   | Webpack                         |
| ---------- | ---------------------- | ------------------------------- |
| HMR原理    | 基于ESM，模块更新      | 基于webpack-dev-server          |
| 更新速度   | 极快（毫秒级）         | 较慢（需重新编译）              |
| 热更新范围 | 只更新变化的模块       | 可能影响关联模块                |
| 实现方式   | WebSocket通知，HRM API | webpack-dev-server + HMR Plugin |
| 缓存       | 利用浏览器缓存         | 需额外配置                      |

---

84.封装一个请求超时，发起重试的代码【

使用axios拦截器或原生Promise封装：

1. 设置timeout
2. 捕获超时错误
3. 记录重试次数
4. 指数退避策略
5. 达到最大次数停止

---

85.前端如何设置请求超时时间 timeout

1. **axios**：配置 `axios.defaults.timeout = 5000`
2. **fetch**：使用 `AbortController`
3. **XHR**：设置 `xhr.timeout = 5000`
4. **nginx**：设置 `proxy_connect_timeout`

---

86.nodejs 如何充分利用多核 CPU?

**三种方式**：

1. **cluster模块**：主进程fork多个worker进程
2. **child_process模块**：spawn多个进程
3. **worker_threads模块**：多线程（Node 10+）

**同步代码问题**：同步代码会阻塞事件循环，无法利用多核

**异步代码优势**：异步I/O让出CPU，事件循环可调度其他任务

**原理**：Node.js异步I/O基于libuv，当I/O等待时，事件循环继续处理其他任务，实现并发

---

87.后端一次性返回树形结构数据，数据量非常大,前端该如何处理?

1. **前端处理**：
   - 使用虚拟滚动渲染
   - 分批渲染（requestAnimationFrame）
   - 使用 `Object.freeze()` 冻结数据
2. **优化数据结构**：
   - 扁平化树结构
   - 使用id-parentId替代嵌套
3. **交互优化**：
   - 默认收起，只渲染可见节点
   - 点击展开再加载子节点
4. **后端优化**：
   - 分页返回
   - 按层级分批返回

---

88.你认为组件封装的一些基本准则是什么?

1. **单一职责**：每个组件只做一件事
2. **可复用性**：通用逻辑抽离，参数化配置
3. **可测试性**：纯函数组件更易测试
4. **一致性**：命名、API、行为保持一致
5. **解耦性**：减少外部依赖
6. **文档完善**：Props说明、使用示例

---

89.页面加载速度提升(性能优化)应该从哪些反向来思考?

**性能优化方向**：

1. **减少请求数量**：合并资源、骨架屏
2. **减少请求体积**：压缩、Tree Shaking、CDN
3. **优化加载顺序**：preload、prefetch
4. **减少渲染阻塞**：async/defer、代码分割
5. **优化渲染性能**：虚拟滚动、减少重排重绘
6. **缓存策略**：强缓存、协商缓存

---

90.前端日志埋点 SDK设计思路

**SDK设计**：

1. **采集**：用户行为、页面访问、点击事件、性能数据
2. **存储**：本地缓存，批量上报
3. **发送**：图片信标（1x1.gif）或navigator.sendBeacon
4. **去重**：唯一ID标识用户

**数据发送时机**：

- 页面离开时（beforeunload）
- 批量达到阈值
- 定时发送

**错误上报**：

- window.onerror
- Promise.reject
- Vue/React错误边界

---

91.token 进行身份验证了解多少?

**token概念和作用**：

- Token是服务端生成的令牌，用于身份验证
- 无状态，可扩展性好
- 自包含用户信息

**客户端存储位置**：

- localStorage：持久存储
- sessionStorage：会话存储
- Cookie：自动发送（HttpOnly更安全）

---

92.前端应用如何进行权限设计？

**权限类型**：

1. **路由权限**：页面访问控制
2. **按钮权限**：操作权限
3. **数据权限**：字段级别权限

**实现方式**：

- 权限码配置
- 角色-权限映射
- 动态路由生成
- 指令封装（v-permission）

---

96.IndexedDB 存储空间大小是如何约束的?

1. **浏览器限制**：
   - 大多数浏览器：无限或很大（>1GB）
   - 部分移动浏览器：50MB左右
2. **用户约束**：用户可设置存储配额
3. **主动请求配额**：使用 `navigator.storage.estimate()`
4. **超出处理**：清理旧数据、分库分表

---

97.浏览器的存储有哪些

| 存储方式       | 大小   | 过期     | 跨域                   |
| -------------- | ------ | -------- | ---------------------- |
| localStorage   | 5-10MB | 永久     | 不支持                 |
| sessionStorage | 5-10MB | 页面关闭 | 不支持                 |
| Cookie         | 4KB    | 可设置   | 支持                   |
| IndexedDB      | 无限   | 永久     | 不支持                 |
| Web SQL        | 有限   | 永久     | 不支持                 |
| Cache Storage  | 很大   | 可设置   | 支持（Service Worker） |

---

98.[Webpack]如何打包运行时 chunk，且在项目工程中，如何去.

使用 `optimization.runtimeChunk`：

```javascript
optimization: {
  runtimeChunk: "single"; // 或 { name: 'runtime' }
}
```

**作用**：将webpack运行时抽离成单独chunk，实现长缓存

---

99.为何现在市面上做表格渲染可视化技术的，大多数都是 canvas，…

**Canvas优势**：

- 性能好：直接操作像素
- 绘制大量数据：10万+行数据无压力
- 控制精确：像素级控制
- 跨平台：PDF导出容易

**DOM表格局限**：

- DOM节点多性能差
- 内存占用大
- 滚动卡顿

---

100.在你的项目中，使用过哪些webpack plugin,说一下他们的作用

常见Plugin：

- **HtmlWebpackPlugin**：生成HTML
- **MiniCssExtractPlugin**：提取CSS
- **TerserPlugin**：压缩JS
- **DefinePlugin**：注入环境变量
- **CopyWebpackPlugin**：复制静态资源
- **CompressionPlugin**：Gzip压缩

---

101.在你的项目中，使用过哪些 webpack loader,说一下他们的作用

常见Loader：

- **babel-loader**：ES6+转ES5
- **ts-loader**：TypeScript编译
- **less-loader**：Less编译
- **css-loader**：处理CSS模块
- **style-loader**：注入CSS到DOM
- **file-loader**：处理静态资源

---

102.[React]如何避免不必要的渲染?

1. **React.memo**：缓存组件
2. **useMemo**：缓存计算结果
3. **useCallback**：缓存回调函数
4. **Immutable数据**：避免对象引用变化
5. **合理使用Context**：减少Provider范围
6. **key使用**：列表使用稳定key
7. **shouldComponentUpdate**：类组件优化

---

103.全局样式命名冲突和样式覆盖问题怎么解决?

1. **CSS Modules**：局部作用域
2. **BEM命名**：Block-Element-Modifier
3. **CSS-in-JS**：样式组件化
4. **Less/Sass嵌套**：减少全局冲突
5. **CSS变量**：统一管理主题
6. **postcss-autoreset**：重置样式

---

104.[React]如何实现专场动画?

1. **CSS Transition**：简单过渡
2. **React Motion**：动画库
3. **react-spring**：物理动画
4. **Framer Motion**：声明式动画
5. **CSS Keyframes**：复杂动画
6. **requestAnimationFrame**：自定义动画
7. GSAP，适合页面过渡、滚动动画

---

105.[React]从 React 层面上，能做的性能优化有哪些?

1. **组件优化**：React.memo、useMemo、useCallback
2. **列表优化**：虚拟列表、key稳定
3. **懒加载**：React.lazy + Suspense
4. **减少渲染**：减少不必要的state变化
5. **代码分割**：路由懒加载
6. **状态管理**：合理拆分state
7. **Immutable**：避免不必要的重渲染

---

106.[Vue]中为何不要把 v-if 和 v-for 同时用在同一个元素上， 原理.

**原因**：

1. v-for优先级更高，先循环再判断
2. 每次渲染都要遍历整个列表
3. 性能浪费

**正确做法**：

- 使用计算属性过滤数据
- 在外层使用v-if
- 使用template包装

---

107.将静态资源缓存在本地的方式有哪些?

1. **强缓存**：
   - Cache-Control
   - Expires
2. **协商缓存**：
   - Last-Modified / If-Modified-Since
   - ETag / If-None-Match
3. **Service Worker**：离线缓存
4. **Cache API**：可编程缓存
5. **localStorage**：小资源本地存储

---

108.SPA首屏加载速度慢的怎么解决

1. **优化入口**：
   - 代码分割
   - 路由懒加载
   - 组件懒加载
2. **优化资源**：
   - Tree Shaking
   - 图片压缩
   - CDN加速
3. **优化渲染**：
   - SSR/预渲染
   - 骨架屏
   - Loading动画
4. **缓存利用**：
   - 强缓存/协商缓存
   - chunk分割

---

109.axios如何区分是nodejs环境还是浏览器环境？

**判断方式**：

1. 检测 `typeof window !== 'undefined'`
2. 检测 `typeof process !== 'undefined'`
3. axios使用 `platform` 配置自动判断
4. 根据 `XMLHttpRequest` 是否存在判断

---

110.如何拦截web应用请求？

1. **Service Worker**：拦截fetch请求
2. **XMLHttpRequest**：重写open方法
3. **fetch**：重写fetch方法
4. **Proxy代理**：Nginx/Node代理层
5. **Mock数据**：whistle/fiddler代理

---

111.前端有那些跨页面通信方式？

1. **localStorage事件监听**：同源页面通信
2. **BroadcastChannel**：同源页面通信
3. **postMessage**：跨窗口通信
4. **SharedWorker**：跨标签页通信
5. **WebSocket**：实时通信
6. **window.name**：同源跨域（需中转页）

TypeScript 和 JavaScript 区别？

**TypeScript 和 JavaScript 区别**：

| 特性      | TypeScript     | JavaScript |
| --------- | -------------- | ---------- |
| 类型系统  | 静态类型、可选 | 动态类型   |
| 编译      | 需编译为JS     | 直接运行   |
| 类型推断  | 支持           | 不支持     |
| 接口/枚举 | 支持           | 不支持     |
| 面向对象  | 更完整的OOP    | 基于原型   |
| 复杂度    | 更高           | 更简单     |

---

什么是TypeScript?

**TypeScript** 是微软开发的JavaScript超集，是一门开源语言。它添加了可选的静态类型系统和面向对象特性，最终编译为纯JavaScript。

**特点**：

- 静态类型检查
- 支持ES6+特性
- 编译到ES3/5/6
- 强大的IDE支持
- 适用于大型项目

---

为什么需要TypeScript？

1. **类型安全**：编译时捕获错误
2. **代码提示**：IDE更好的智能提示
3. **可维护性**：大型项目的代码更易维护
4. **重构友好**：类型系统支持安全重构
5. **团队协作**：接口定义清晰

---

TypeScript的特性

1. **静态类型**：编译时类型检查
2. **类型推断**：自动推断变量类型
3. **接口和类型别名**：定义数据结构
4. **泛型**：参数化类型
5. **装饰器**：元编程支持
6. **模块系统**：ES6模块
7. **类型注解**：显式声明类型

---

使用TypeScript有哪些好处？

1. **提前发现Bug**：编译时类型检查
2. **更好的重构**：类型支持安全重构
3. **代码文档化**：类型即文档
4. **开发体验**：更好的IDE支持
5. **团队协作**：减少沟通成本
6. **OOP支持**：完整的面向对象

---

使用TypeScript有哪些缺点？

1. **学习成本**：需要学习类型系统
2. **编译步骤**：额外的编译过程
3. **类型声明**：有时需要写复杂类型
4. **项目初始化**：配置较多
5. **编译时间**：大型项目编译较慢

---

TypeScript的组成部分是什么？

1. **语言**：语法、关键词、类型
2. **编译器**：tsc编译器，编译为JS
3. **语言服务**：类型检查、代码提示
4. **语言工具**：IDE插件、调试器

---

谁开发了 TypeScript？当前稳定版本是什么？

- **开发者**：Microsoft（安德斯·海尔斯伯格主导）
- **首次发布**：2012年
- **当前稳定版**：5.x（持续更新中）

---

如何安装 TypeScript?

```bash
# 全局安装
npm install -g typescript

# 项目安装
npm install --save-dev typescript

# 使用npx
npx tsc
```

---

如何编译 TypeScript 文件？

```bash
# 编译当前目录所有ts文件
tsc

# 编译指定文件
tsc app.ts

# 监视模式
tsc --watch

# 使用配置文件
tsc --project tsconfig.json
```

---

可以把多个ts文件合并成一个js文件吗？

**可以**。使用 `tsc` 编译时会按模块依赖打包。可以使用：

- `outFile` 配置（仅用于AMD/System）
- Webpack/Rollup等打包工具
- ES模块天然支持代码合并

---

TypeScript中的类型。 基本数据类型 引用数据类型 特殊数据类型（any,unknow,void,never,enum）

**基本数据类型**：

- `number`：数值（整数、浮点）
- `string`：字符串
- `boolean`：布尔值
- `null`：空值
- `undefined`：未定义
- `symbol`：唯一标识
- `bigint`：大整数

**引用数据类型**：

- `object`：对象
- `array`：数组
- `function`：函数

**特殊数据类型**：

- `any`：任意类型
- `unknown`：未知类型（类型安全）
- `void`：空返回值
- `never`：永不返回
- `enum`：枚举

---

列出TypeScript中的内置数据类型。

```
基本类型：number, string, boolean, null, undefined
高级类型：object, array, function, symbol, bigint
特殊类型：any, unknown, void, never, enum
字面量类型：'success' | 'error', 1 | 2 | 3
```

---

TypeScript中的变量以及如何声明？

```typescript
// 显式类型声明
let name: string = "Tom";
let age: number = 25;
let isActive: boolean = true;

// 类型推断
let city = "Beijing"; // 推断为string

// 常量
const PI: number = 3.14;
```

---

声明变量的不同方式？

| 方式     | 关键字  | 可变性   | 作用域     |
| -------- | ------- | -------- | ---------- |
| 普通变量 | `var`   | 可修改   | 函数作用域 |
| 局部变量 | `let`   | 可修改   | 块级作用域 |
| 常量     | `const` | 不可修改 | 块级作用域 |

---

可以实时编译ts文件吗？

**可以**。使用 `--watch` 或 `-w` 参数：

```bash
tsc app.ts --watch
# 或
tsc -w
```

IDE中如VS Code也支持自动编译。

---

TypeScript支持哪些面向对象术语？

1. **类**（Class）
2. **接口**（Interface）
3. **继承**（Inheritance）
4. **多态**（Polymorphism）
5. **封装**（Encapsulation）
6. **抽象**（Abstraction）
7. **修饰符**（public/private/protected）
8. **抽象类**（Abstract class）
9. **静态成员**（Static members）

---

•TypeScript中的接口

**接口定义**：

```typescript
interface Person {
  name: string;
  age: number;
  greet(): void;
}
```

**可选属性**：`age?: number`
**只读属性**：`readonly id: number`
**索引签名**：`[key: string]: any`

---

TypeScript中的类及其特性

```typescript
class User {
  name: string;
  private age: number; // 私有
  protected email: string; // 保护
  static count: number; // 静态

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): void {
    console.log(`Hello, ${this.name}`);
  }
}
```

**特性**：继承、抽象类、方法重载、getter/setter

---

TypeScript支持的访问修饰符

| 修饰符      | 类内部 | 子类 | 类外部        |
| ----------- | ------ | ---- | ------------- |
| `public`    | ✓      | ✓    | ✓             |
| `protected` | ✓      | ✓    | ✗             |
| `private`   | ✓      | ✗    | ✗             |
| `readonly`  | ✓      | ✓    | ✗（需初始化） |

---

TypeScript是一种可选的静态类型语言吗？

**是的**。TypeScript是可选的静态类型语言：

- 可以使用 `any` 类型绕过类型检查
- 类型注解是可选的
- 类型推断减少显式注解
- 兼容所有JavaScript代码

---

TypeScript中的模块

```typescript
// 导出
export const name = "Tom";
export function greet() {}

// 导入
import { name, greet } from "./module";
```

**模块类型**：

- Internal modules（命名空间）
- External modules（ES6模块）

---

TypeScript中内部模块和外部模块区别？

| 特性   | 内部模块        | 外部模块        |
| ------ | --------------- | --------------- |
| 语法   | `module` 关键字 | `import/export` |
| 作用域 | 命名空间隔离    | 文件级隔离      |
| 编译   | 可合并          | 按需加载        |
| 现代性 | 旧语法          | ES6标准         |

---

TypeScript中的命名空间以及如何声明？

```typescript
namespace Validation {
  export interface StringValidator {
    isValid(s: string): boolean;
  }

  export class EmailValidator implements StringValidator {
    isValid(s: string): boolean {
      return /@/.test(s);
    }
  }
}

// 使用
let validator = new Validation.EmailValidator();
```

---

TypeScript支持方法重载吗？

**支持**。TypeScript允许函数重载：

```typescript
function overload(x: number): number;
function overload(x: string): string;
function overload(x: any): any {
  return x;
}
```

但不支持抽象方法重载（需在子类中实现）。

---

解释一下TypeScript中的装饰器

**装饰器**是一种语法，可以在不修改原类的情况下添加功能：

```typescript
// 类装饰器
function sealed(target: Function) {
  Object.seal(target);
}

// 方法装饰器
function enumerable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    descriptor.enumerable = value;
  };
}

@sealed
class Example {
  @enumerable(false)
  method() {}
}
```

**装饰器类型**：类、方法、属性、参数、访问器

---

什么是混入？

**Mixin** 是将多个类功能混合到一个类中的模式：

```typescript
mixin = {
  method1() {},
  method2() {},
};

class MyClass extends mixin {
  // 获得mixin的所有方法
}
```

TypeScript支持 `mixin` 模式，通过继承实现功能复用。

---

TypeScript支持可选参数吗？

**支持**。可选参数用 `?` 标记：

```typescript
function greet(name?: string) {
  return name ? `Hello, ${name}` : "Hello";
}
```

注意：可选参数必须在必选参数之后。

---

什么是作用域变量？

**作用域规则**：

1. **全局作用域**：整个程序可见
2. **函数作用域**：`var` 在函数内有效
3. **块级作用域**：`let/const` 在块内有效
4. **模块作用域**：文件内有效
5. **类作用域**：类内部有效

---

如何调试TypeScript文件？

1. **IDE调试**：VS Code断点调试
2. **sourceMap**：生成 `.map` 文件
3. **浏览器调试**：Chrome DevTools
4. **Node调试**：`ts-node` 或编译后调试
5. **断言日志**：`console.log` 输出

---

什么是TypeScript Definition Manager？为什么需要它？

** DefinitelyTyped** 是TypeScript类型定义仓库，提供社区维护的类型声明文件。

**作用**：

- 为JavaScript库提供类型
- 无需自己编写类型
- 通过 `npm install @types/xxx` 安装

---

包含类型定义文件的步骤是什么？

1. 安装类型定义：`npm install @types/jquery`
2. TS自动识别：`tsconfig.json` 包含 `types`
3. 手动声明：如需自定义，编写 `.d.ts` 文件

---

TypeScript中的 Declare 关键字

**declare** 用于声明类型，不生成实际代码：

```typescript
declare var jQuery: (selector: string) => any;
declare module "lodash" {
  export function cloneDeep<T>(obj: T): T;
}
```

常用于：

- 声明全局变量
- 声明模块类型
- 声明文件

---

．什么是默认参数？

```typescript
function greet(name = "World") {
  return `Hello, ${name}`;
}
```

**特性**：

- 默认参数可在参数列表任意位置
- 可引用前面参数
- 支持表达式：`function(x = 1, y = x + 1)`

---

解释一下tsconfigjson文件

**tsconfig.json** 是TypeScript项目配置文件：

```json
{
  "compilerOptions": {
    "target": "ES5",
    "module": "commonjs",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**常用配置**：

- `target`：编译目标
- `strict`：严格模式
- `module`：模块系统
- `outDir`：输出目录

---

什么是泛型？

**泛型**是参数化类型机制，创建可复用组件：

```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 泛型接口
interface Container<T> {
  value: T;
}

// 泛型约束
function logging<T extends { length: number }>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

**常见泛型类型**：Array, Promise, Record, Partial, Readonly

---

接口和类型的差别是什么？

| 特性     | interface        | type           |
| -------- | ---------------- | -------------- |
| 扩展     | extends          | 交叉类型 `&`   |
| 合并     | 支持声明合并     | 不支持         |
| 计算属性 | 不支持           | 支持           |
| 语法     | `interface A {}` | `type A = {}`  |
| 用途     | 对象结构         | 联合类型、元组 |

---

什么是JSX？

**JSX** 是JavaScript的XML语法扩展，允许在JS中写类似HTML的代码：

```jsx
const element = <h1 className="title">Hello</h1>;
```

TypeScript通过 `tsx` 文件支持JSX，需要 `jsx` 编译选项。

---

TypeScript支持哪些 JSX模式？

| 模式           | 说明                         |
| -------------- | ---------------------------- |
| `preserve`     | 保留JSX，输出 `.jsx`         |
| `react-native` | 保留JSX，输出 `.js`          |
| `react`        | 编译为 `React.createElement` |
| `react-jsx`    | 编译为 `_jsx`（React 17+）   |

---

TypeScript中的环境是什么？何时使用它们？

**环境声明**用于告诉编译器外部API的形状：

```typescript
declare var document: Document;
declare function alert(message: string): void;
```

**使用场景**：

- 全局变量
- 外部库类型
- 第三方插件

---

什么是TypeScript映射文件？

**映射文件**（`.map` 文件）是源码映射，用于调试：

- 将编译后的代码映射回源码
- 支持断点调试
- 通过 `sourceMap: true` 生成

---

什么是类型断言？

**类型断言**用于强制指定类型：

```typescript
// as语法（推荐）
let value: unknown = "hello";
let str: string = value as string;

// 尖括号语法
let str2: string = <string>value;
```

注意：断言不进行类型检查，只是骗过编译器。

---

什么是剩余参数？

**剩余参数**将多个参数收集为数组：

```typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

sum(1, 2, 3, 4); // 10
```

---

声明剩余参数的规则是什么？举例说明

**规则**：

1. 只能有一个剩余参数
2. 必须在参数列表最后
3. 是数组类型

```typescript
// 正确
function f(a: string, ...rest: number[]) {}

// 错误：剩余参数不能在前面
function f(...rest: number[], a: string) {}
```

---

解释一下TypeScript中的"as"句法

**as** 用于类型断言：

```typescript
// 值 as 类型
let value: unknown = 'hello';
let str = value as string;

// 在JSX中使用
let element = <div>{content as string}</div>;
```

推荐使用 `as` 语法，更清晰且兼容JSX。

---

解释一下TypeScript中的枚举

```typescript
// 数字枚举
enum Color {
  Red,
  Green,
  Blue,
}

// 字符串枚举
enum Direction {
  Up = "UP",
  Down = "DOWN",
}

// 常量枚举
const enum Mode {
  A,
  B,
  C,
}

// 异构枚举
enum Result {
  Success = 200,
  Error = "ERROR",
}
```

**特点**：

- 数字枚举可反向映射
- 字符串枚举无反向映射
- 常量枚举编译时内联

---

解释一下相对/非相对模块导入

**相对导入**：

```typescript
import { User } from "./user";
import { utils } from "../shared/utils";
```

以 `./` `../` 开头， относительный путь

**非相对导入**：

```typescript
import { Component } from "vue";
import lodash from "lodash";
```

基于 `node_modules` 或 `path` 配置解析。

---

什么是匿名函数？

**匿名函数**是没有名称的函数：

```typescript
// 函数表达式
const add = function (a, b) {
  return a + b;
};

// 箭头函数
const multiply = (a, b) => a * b;

// 立即执行
(function () {
  console.log("IIFE");
})();
```

---

什么是方法重载？

**方法重载**是同一函数名不同参数类型/数量：

```typescript
class Calculator {
  // 重载签名
  add(x: number, y: number): number;
  add(x: string, y: string): string;

  // 实现
  add(x: any, y: any): any {
    return x + y;
  }
}
```

注意：TypeScript重载是编译时检查，非运行时多态。

---

什么是Lambda函数（箭头函数）？

**Lambda** 即箭头函数，是ES6简洁函数语法：

```typescript
// 基本语法
const add = (a, b) => a + b;

// 单参数可省略括号
const double = (x) => x * 2;

// 多行函数体
const greet = (name) => {
  const message = `Hello, ${name}`;
  return message;
};
```

**特点**：

- `this` 词法绑定
- 不能用作构造函数
- 没有 `arguments` 对象
