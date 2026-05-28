<!--
 * @Author: humengchuan 531537052@qq.com
 * @Date: 2026-04-10 23:22:20
 * @LastEditors: humengchuan 531537052@qq.com
 * @LastEditTime: 2026-04-15 09:58:47
 * @FilePath: \work-tool\docs-vitepress\src\learn\node-interview.md
 * @Description:
-->

**Node.js 面试题汇总**

基础理论 + 实战场景题

涵盖事件循环、异步编程、流处理、性能优化、高并发、架构设计等高频考点

2026年最新整理版

**第一部分：基础核心题**

**1.1 Node.js 基础概念**

**Q1: Node.js 是什么？有哪些核心特点？**

**频率：**★★★★★ 几乎必问

**参考答案：**

- Node.js 是基于 Chrome V8 引擎的 JavaScript 运行时，用于服务器端执行 JS 代码

- 事件驱动（Event-Driven）：通过事件循环处理异步操作

- 非阻塞 I/O：单线程模型，通过异步 I/O 实现高并发

- 单线程主线程 + Worker Threads 处理 CPU 密集型任务

- 跨平台：Windows / macOS / Linux

- 适合场景：I/O 密集型应用（API 服务、实时通信、代理服务器）

**Q2: Node.js 的单线程模型是什么意思？为什么单线程还能高并发？**

**频率：**★★★★★

**参考答案：**

- Node.js 主线程是单线程的，只有一个执行栈和一个事件循环

- 高并发的秘密：底层通过 libuv 线程池处理 I/O 操作，主线程不会被 I/O 阻塞

- 当遇到 I/O 操作时，主线程将操作委托给 libuv 的工作线程，自己继续处理其他请求

- I/O 完成后，回调被放入事件队列，主线程空闲时执行

- 注意：CPU 密集型任务会阻塞主线程，需要用 Worker Threads 或 child_process 分离

**Q3: Node.js 和浏览器的 JavaScript 有什么区别？**

**频率：**★★★★

**参考答案：**

- 环境对象：Node.js 是 global，浏览器是 window

- DOM/BOM：Node.js 没有 DOM 和 BOM 操作能力

- 模块系统：Node.js 使用 CommonJS（require/module.exports），浏览器使用 ES Module

- API：Node.js 提供 fs、http、net、crypto 等服务器端 API

- V8 引擎相同，但 Node.js 可直接访问操作系统底层资源

**1.2 事件循环机制**

**Q4: 请详细说明 Node.js 的事件循环机制，和浏览器的有什么区别？**

**频率：**★★★★★ 超高频

**参考答案：**

Node.js 事件循环基于 libuv 实现，分为 6 个阶段：

- Timers：执行 setTimeout / setInterval 回调

- Pending Callbacks：处理上一轮未完成的 I/O 回调（如 TCP 错误）

- Idle / Prepare：libuv 内部使用

- Poll：获取新的 I/O 事件，执行 I/O 相关回调

- Check：执行 setImmediate 回调

- Close Callbacks：处理关闭事件（如 socket.on(\'close\')）

与浏览器的区别：

- 浏览器：宏任务 → 微任务 → 渲染 → 下一轮宏任务

- Node.js：多阶段循环，每个阶段执行完后清空微任务队列

- process.nextTick 优先级最高，优先于每个阶段的微任务

- Promise.then 属于微任务，在每个阶段切换时执行

**Q5: 请说明下面代码的执行顺序：**

> console.log(\'start\');
>
> setTimeout(() =\> console.log(\'timeout\'), 0);
>
> setImmediate(() =\> console.log(\'immediate\'));
>
> Promise.resolve().then(() =\> console.log(\'promise\'));
>
> process.nextTick(() =\> console.log(\'nextTick\'));
>
> console.log(\'end\');

**频率：**★★★★★

**参考答案：**

执行顺序：start → end → nextTick → promise → timeout/immediate（后两者顺序不确定）

- 同步代码先执行：start、end

- process.nextTick 优先级最高，立即执行

- Promise.then 是微任务，在当前阶段结束后执行

- setTimeout(0) 和 setImmediate 的顺序取决于当前事件循环所在阶段

**Q6: process.nextTick 和 setImmediate 有什么区别？**

**频率：**★★★★

**参考答案：**

- process.nextTick：在当前操作立即执行，优先级高于所有微任务和宏任务

- setImmediate：在事件循环的 Check 阶段执行

- 实践建议：优先使用 setImmediate，避免 nextTick 导致 I/O 饥饿问题

**1.3 模块系统**

**Q7: CommonJS 和 ES Module 有什么区别？**

**频率：**★★★★★

**参考答案：**

- CommonJS：require/module.exports，运行时加载，同步加载，值拷贝，可以条件导入

- ES Module：import/export，编译时静态分析，异步加载，引用拷贝，支持 tree-shaking

- Node.js 从 v12 开始稳定支持 ES Module（package.json 中设置 \"type\": \"module\"）

- \_\_dirname / \_\_filename 在 ES Module 中不可用，需用 import.meta.url 替代

**Q8: require 的模块加载机制是怎样的？**

**频率：**★★★★

**参考答案：**

- 路径解析：先查找缓存，再按路径查找文件

- 查找顺序：内置模块 → node_modules → 上级目录的 node_modules（递归向上）

- 文件扩展名补全：.js → .json → .node

- 目录导入：自动加载目录下的 index 文件

- 模块缓存：第一次加载后缓存到 module.cache，后续直接读缓存

**1.4 异步编程**

**Q9: Node.js 如何实现异步编程？回调、Promise、async/await 有什么区别？**

**频率：**★★★★★

**参考答案：**

- 回调函数：最早期的异步方式，容易出现回调地狱（Callback Hell）

- Promise：链式调用解决回调嵌套，支持 .then()/.catch()/.finally()

- async/await：基于 Promise 的语法糖，代码更接近同步风格，配合 try/catch 处理错误

- 错误优先回调（Error-First Callback）：Node.js 约定回调第一个参数为 err，其余为数据

**Q10: 如何实现并行执行多个异步操作？Promise.all 和 Promise.allSettled 的区别？**

**频率：**★★★★

**参考答案：**

- Promise.all：所有 Promise 都 resolve 才成功，任何一个 reject 则整体 reject（快速失败）

- Promise.allSettled：等待所有 Promise 完成（无论成功或失败），返回每个结果的状态

- Promise.race：返回第一个完成的结果（无论成功或失败）

- Promise.any：返回第一个成功的结果，全部失败才 reject

**1.5 内置模块深入**

**Q11: EventEmitter 的工作原理是什么？如何实现一个简单的 EventEmitter？**

**频率：**★★★★

**参考答案：**

- EventEmitter 是 Node.js 事件驱动的基础，内部维护一个事件-回调映射表

- 核心方法：on()、emit()、once()、off()/removeListener()

- 监听器数量默认最大 10 个，超出会警告（可通过 setMaxListeners 修改）

- 实现要点：用 Map/Object 存储事件和回调的映射关系，on 添加，emit 触发，once 触发后移除

**Q12: fs 模块的同步和异步方法有什么区别？什么时候用哪个？**

**频率：**★★★★

**参考答案：**

- 同步方法（如 readFileSync）：阻塞主线程，直到操作完成才继续执行

- 异步方法（如 readFile）：不阻塞主线程，通过回调返回结果

- 同步适用场景：启动时配置加载、CLI 工具、简单脚本

- 异步适用场景：服务器应用、高并发场景、大文件操作

- Node.js 还提供 fs.promises API，基于 Promise 的异步接口

**Q13: Buffer 是什么？为什么需要它？**

**频率：**★★★★

**参考答案：**

- Buffer 是用于处理二进制数据的类，类似于定长数组，大小固定不可变

- V8 引擎原生不支持二进制数据，Buffer 在 C++ 层分配内存，通过 JavaScript 对象操作

- 常用场景：文件读写、网络传输、图像处理、加密解密

- Buffer.alloc() vs Buffer.from() vs Buffer.allocUnsafe()：allocUnsafe 不初始化内存，性能更好但可能包含旧数据

**Q14: 什么是错误优先的回调函数？**

**频率：**★★★

**参考答案：**

- 约定：回调函数的第一个参数为错误对象 err，其余参数为数据

- err 为 null 表示成功，err 为 Error 对象表示失败

- 这是 Node.js 的核心设计模式，所有内置异步 API 都遵循此约定

**Q15: Node.js 中如何处理未捕获的异步错误？**

**频率：**★★★★

**参考答案：**

- process.on(\'uncaughtException\')：捕获未处理的同步异常

- process.on(\'unhandledRejection\')：捕获未处理的 Promise 拒绝

- 建议：记录日志后优雅退出进程，而不是继续运行（状态可能已损坏）

- 最佳实践：所有异步操作都应该有明确的错误处理机制

**第二部分：进阶技术题**

**2.1 流处理与 Buffer**

**Q16: Stream 是什么？有哪些类型？适用场景是什么？**

**频率：**★★★★★

**参考答案：**

- Stream 是处理流式数据的抽象接口，避免一次性加载大文件到内存

- 可读流（Readable）：fs.createReadStream、HTTP 请求

- 可写流（Writable）：fs.createWriteStream、HTTP 响应

- 双工流（Duplex）：TCP socket，同时可读可写

- 转换流（Transform）：zlib 压缩、文件编码转换

- 应用场景：大文件上传下载、日志处理、数据管道、视频流处理

**Q17: 管道（pipe）和背压（backpressure）是什么？**

**频率：**★★★★

**参考答案：**

- pipe() 自动将可读流连接到可写流，自动管理数据流动

- 背压机制：当可写流处理速度慢于可读流时，通知可读流暂停发送数据

- 避免内存溢出：不用 pipe 而是手动监听 data 事件可能导致内存爆炸

**2.2 进程与线程**

**Q18: Cluster 模块和 Worker Threads 有什么区别？分别适用于什么场景？**

**频率：**★★★★★

**参考答案：**

- Cluster：多进程模型，通过 fork() 创建多个子进程，共享同一个端口

- Cluster 适用于利用多核 CPU 提升 HTTP 服务并发能力

- Worker Threads：多线程模型，共享内存，通信开销较小

- Worker Threads 适用于 CPU 密集型任务（图像处理、加密、大数据计算）

- 关键区别：Cluster 进程间内存独立，Worker Threads 共享内存空间

**Q19: child_process 的 exec、spawn、execFile 有什么区别？**

**频率：**★★★★

**参考答案：**

- exec：创建 shell 执行命令，有缓冲区限制（默认 200KB），适合小输出

- execFile：直接执行可执行文件，不经过 shell，更安全高效

- spawn：以流式处理输出，无缓冲区限制，适合大数据量输出

- fork：spawn 的特殊形式，专门用于创建 Node.js 子进程，支持 IPC 通信

**2.3 性能优化**

**Q20: Node.js 有哪些常见的性能瓶颈？如何优化？**

**频率：**★★★★★

**参考答案：**

常见瓶颈：

- CPU 密集型任务阻塞事件循环（如复杂计算、加密）

- 同步操作阻塞主线程（如大文件 readFileSync）

- 内存泄漏（全局变量、闭包、未清理的定时器）

- 连接泄漏（未关闭的数据库连接、HTTP Agent 配置不当）

- 事件循环拥堵（微任务队列过长）

优化策略：

- 使用 Stream 处理大文件，避免一次性加载到内存

- CPU 密集型任务用 Worker Threads 分离

- 合理使用缓存（Redis、内存缓存）

- 使用 Cluster 利用多核 CPU

- 使用 node \--inspect 和 Chrome DevTools 进行性能分析

**Q21: 如何将 Node.js 接口性能优化到 10 万 QPS？**

**频率：**★★★★

**参考答案：**

- 代码层：减少中间件层级、避免同步操作、优化数据序列化

- 缓存层：Redis 缓存热点数据、HTTP 响应缓存、CDN

- 连接层：HTTP Keep-Alive、连接池、合理配置 http.Agent

- 架构层：Cluster 多进程、负载均衡、无状服务

- 系统层：调整文件描述符限制、TCP 参数优化、内核参数调整

**Q22: Node.js 的内存管理和 V8 垃圾回收机制是怎样的？**

**频率：**★★★★

**参考答案：**

- V8 堆分为新生代堆（New Generation）和老生代堆（Old Generation）

- 新生代：Scavenge 算法，将存活对象从 From 空间复制到 To 空间

- 老生代：Mark-Sweep-Compact 算法，标记-清除-压缩

- 内存泄漏常见原因：全局变量引用、闭包引用、未清除的定时器/监听器

- 排查工具：heapdump、Chrome DevTools Memory、node \--inspect

**2.4 安全与调试**

**Q23: Node.js 有哪些常见的安全风险？如何防范？**

**频率：**★★★★

**参考答案：**

- 代码注入：使用 helmet 中间件设置安全 HTTP 头

- XSS 攻击：对用户输入进行转义和过滤（如 xss 库）

- CSRF 攻击：使用 csurf 中间件或 SameSite Cookie

- 依赖安全：定期 npm audit、使用 lock 文件、避免不安全的依赖

- 环境变量泄露：使用 dotenv，不要将敏感信息硬编码或提交到 Git

- 请求限流：express-rate-limit 等中间件防止暴力破解

**Q24: Node.js 的调试工具和方法有哪些？**

**频率：**★★★

**参考答案：**

- node \--inspect：启动调试模式，配合 Chrome DevTools 调试

- VS Code 内置调试器：断点、单步调试、变量监视

- console 方法：console.time/timeEnd、console.trace、console.assert

- NDbg：命令行调试工具

- perf_hooks 模块：精确测量函数执行时间

**2.5 框架与生态**

**Q25: Express 中间件的工作原理是什么？如何实现一个中间件？**

**频率：**★★★★

**参考答案：**

- 中间件是一个函数，接收 (req, res, next) 三个参数

- 执行完成后调用 next() 传递给下一个中间件

- 应用级中间件（app.use）vs 路由级中间件（router.use）

- 错误处理中间件有 4 个参数（err, req, res, next）

**Q26: 如何实现 JWT 认证？JWT 的优缺点是什么？**

**频率：**★★★★

**参考答案：**

- JWT 由 Header.Payload.Signature 三部分组成，通过 jsonwebtoken 库生成

- 优点：无状、适合分布式系统、跨域支持

- 缺点：Token 无法主动失效、Payload 不宜存放敏感信息、Token 较大

- 解决方案：短期 Token + 长期 Refresh Token、将敏感数据存在服务端

**Q27: Node.js 如何处理跨域请求？**

**频率：**★★★

**参考答案：**

- CORS 中间件：使用 cors 库，配置 Access-Control-Allow-Origin

- 预检请求：OPTIONS 请求用于检查跨域权限

- JSONP：只支持 GET 请求，已过时

- 反向代理：Nginx 配置同域代理转发

**Q28: Node.js 如何实现优雅退出？**

**频率：**★★★★

**参考答案：**

- 监听信号：SIGTERM（优雅关闭）、SIGINT（Ctrl+C）

- 关闭时操作：停止接收新请求、等待进行中的请求完成、关闭数据库连接、清理资源

- 配合集群管理：PM2 的 gracefulReload、Kubernetes 的 terminationGracePeriodSeconds

**Q29: Node.js 如何实现请求限流？**

**频率：**★★★★

**参考答案：**

- 固定窗口算法：在固定时间窗口内限制请求数

- 滑动窗口算法：每次请求空间一个时间窗口，更平滑

- 令牌桶算法：以固定速率向桶中添加令牌，每次请求消耗令牌

- 工具：express-rate-limit、rate-limiter-flexible

**Q30: Node.js 如何实现日志管理？**

**频率：**★★★

**参考答案：**

- winston：支持多传输（控制台、文件、远程）、日志级别、格式化

- pino：性能极高，适合高并发场景

- log4js：支持日志分类、日志切割、日志级别

- 日志切割：按日期/大小切割文件，避免单个文件过大

**第三部分：实战场景题**

**3.1 高并发场景**

**Q31: 你的 Node.js 服务在高并发时出现响应超时，你会如何排查和解决？**

**考察点：**系统性思维、排查方法、性能优化经验

**参考答案：**

排查步骤：

- 1\. 监控确认：通过 APM 工具（PM2、New Relic、Prometheus）确认是 CPU、内存还是 I/O 瓶颈

- 2\. 检查事件循环滞后：是否有同步操作或 CPU 密集型任务阻塞主线程

- 3\. 检查数据库：是否有慢查询、连接池耗尽、锁等待

- 4\. 检查外部服务：下游服务是否响应慢、超时配置是否合理

解决方案：

- 优化慢查询，添加索引、分页

- 增加缓存层（Redis）

- 使用 Cluster 或 PM2 cluster 模式扩展并发能力

- 对外部请求设置合理的超时时间和重试机制

**Q32: 如何设计一个支持百万级连接的实时聊天服务？**

**考察点：**架构设计、WebSocket、负载均衡、性能优化

**参考答案：**

- 技术选型：WebSocket（ws/Socket.IO）或 SSE

- 连接管理：心跳检测、自动重连、连接池管理

- 消息分发：Redis Pub/Sub 实现跨进程消息广播

- 负载均衡：Nginx 反向代理 + 多实例部署

- 消息队列：对不需要实时处理的消息使用 RabbitMQ/Kafka

- 连接数优化：调整操作系统文件描述符限制、TCP 参数优化

**Q33: 如何实现一个分布式的请求限流系统？**

**考察点：**分布式系统、Redis、算法选择

**参考答案：**

- 基于 Redis 实现：使用 Redis 的计数器或令牌桶算法

- 滑动窗口 + Redis ZSET：每次请求记录时间戳，清理过期记录后统计窗口内请求数

- Lua 脚本保证原子性：判断 + 计数 + 设置过期时间一次完成

- 多实例部署时，所有实例共享同一个 Redis 计数器

**3.2 文件处理场景**

**Q34: 如何实现一个支持断点续传的大文件上传功能？**

**考察点：**文件分片、Stream、前后端协作

**参考答案：**

- 前端：将文件切分为固定大小的片（如 5MB），并行上传

- 后端：接收分片存储到临时目录，记录上传进度

- 合并：所有分片上传完成后，使用 Stream 合并文件

- 断点续传：前端记录已上传的分片，重新上传时跳过已完成的部分

- 哈希校验：每个分片上传前计算 MD5，确保数据完整性

**Q35: 如何实现一个高效的日志收集系统？**

**考察点：**日志架构、流处理、性能与可靠性

**参考答案：**

- 日志采集：业务服务通过 UDP/TCP 发送日志到收集服务（避免阻塞业务线程）

- 日志缓冲：批量写入文件，减少 I/O 次数

- 日志切割：按时间/大小切割，避免单文件过大

- 日志传输：Filebeat/Fluentd 采集→ Kafka→ Logstash→ Elasticsearch

**Q36: 如何实现一个支持断点续传的大文件下载功能？**

**考察点：**HTTP Range 请求、Stream、前后端协作

**参考答案：**

- 使用 HTTP Range 头实现分片下载：Range: bytes=0-1023

- 服务端返回 206 Partial Content 状态码

- 前端将文件分为多个区间并行下载，完成后合并

- 断点续传：记录已下载的字节范围，重新下载时从断点处继续

**3.3 实时通信场景**

**Q37: 如何实现 SSE（Server-Sent Events）和 WebSocket？两者如何选择？**

**考察点：**实时通信技术选型、场景判断

**参考答案：**

- SSE：服务器单向推送，基于 HTTP，自动重连，轻量

- WebSocket：双向通信，全双工，适合聊天、協作编辑、游戏

- SSE 适用场景：股票行情、通知推送、实时日志

- WebSocket 适用场景：聊天室、協作编辑、多人游戏、远程控制

**Q38: 如何实现一个分布式的消息队列消费者？**

**考察点：**消息队列、可靠性、并发消费

**参考答案：**

- 技术选型：RabbitMQ/Kafka/Bull（基于 Redis）

- 消费模式：发布-订阅、点对点、竞争消费

- 消息确认：ACK 机制确保消息不丢失

- 死信队列：处理失败的消息重新进入队列

- 并发消费：多个 Worker 并行消费，提升吞吐量

**3.4 架构设计场景**

**Q39: 如何设计一个 Node.js 微服务架构？**

**考察点：**架构设计、服务拆分、通信机制

**参考答案：**

- 服务拆分：按业务功能拆分为独立服务（用户、订单、支付等）

- 服务通信：REST API / gRPC / 消息队列

- 服务注册与发现：Consul / Etcd / Nacos

- API 网关：Express Gateway / Kong

- 配置中心：统一管理配置，支持动态更新

- 链路追踪：分布式 Trace ID 贯穿全链路

**Q40: 如何实现 API 的版本管理？**

**考察点：**API 设计、向下兼容

**参考答案：**

- URL 版本号：/api/v1/users、/api/v2/users

- 请求头版本：Accept-Version: v1、API-Version: 2

- 查询参数：?version=1

- 向下兼容：新版本不删除字段，只增加新字段，设置默认值

- 版本废弃策略：提前通知、设置过期时间、返回 Sunset 头

**Q41: 如何实现服务的灰度发布？**

**考察点：**部署策略、风险控制

**参考答案：**

- 基于请求头：根据特定 Header（如 X-Canary: true）路由到灰度版本

- 基于 Cookie：通过 Cookie 标记灰度用户

- 基于权重：按百分比分配流量（如 5% 流量到新版本）

- 回滚策略：灰度版本出现问题时快速切回稳定版本

**Q42: 如何实现服务的熔断和降级机制？**

**考察点：**高可用、容错设计

**参考答案：**

- 熔断器（Circuit Breaker）：三种状态------关闭、打开、半开

- 关闭状态：正常请求；失败率超阈值则进入打开状态

- 打开状态：直接返回默认值/错误，不请求下游服务

- 半开状态：放行少量请求试探，成功则恢复关闭

- 降级：当系统压力大时，关闭非核心功能，保证核心链路

**3.5 运维与稳定性场景**

**Q43: 如何实现零停机部署（Zero-Downtime Deployment）？**

**考察点：**部署策略、进程管理

**参考答案：**

- Cluster 模式：逐个重启工作进程，保证始终有进程在处理请求

- PM2 的 reload 命令：自动实现零停机重启

- Docker + Kubernetes：Rolling Update 策略，逐个替换 Pod

- 健康检查：确保新实例健康后再下线旧实例

**Q44: 如何实现服务的健康检查和监控告警？**

**考察点：**运维能力、监控体系

**参考答案：**

- 健康检查端点：/health 接口检查服务状态、数据库连接、Redis 连接

- 指标采集：Prometheus + Grafana 采集和展示 CPU、内存、QPS、响应时间

- 日志采集：ELK 技术栈（Elasticsearch + Logstash + Kibana）

- 告警通知：配合告警规则，通过邮件/钉钉/飞书等通知

**Q45: 生产环境中 Node.js 服务崩溃了，你会如何处理？**

**考察点：**应急响应、问题定位、改进措施

**参考答案：**

应急响应：

- 1\. 立即重启服务（PM2、Docker、K8s 自动重启）

- 2\. 回滚到上一个稳定版本（如果是新版本引起）

- 3\. 通知相关人员，发布故障公告

问题定位：

- 1\. 查看日志：定位崩溃时间和错误信息

- 2\. 堆转储分析：如果有 core dump 文件，用 llnode/gdb 分析

- 3\. 监控数据：查看 CPU、内存、连接数等指标异常

改进措施：

- 1\. 修复 Bug，添加更多的健康检查和告警

- 2\. 完善自动化测试和 CI/CD 流程

- 3\. 制定故障复盘文档，防止同类问题再次发生

**Q46: 如何设计一个分布式的任务调度系统？**

**考察点：**分布式系统、任务调度、可靠性

**参考答案：**

- 定时任务：bull / agenda（基于 Redis）或 node-cron

- 任务持久化：将任务状态存储在数据库/Redis

- 失败重试：指数退避策略，设置最大重试次数

- 任务分片：大任务拆分为子任务，并行执行

- 分布式锁：Redis 分布式锁防止任务重复执行

**Q47: 如何实现一个安全的文件上传服务？**

**考察点：**安全、文件处理、性能

**参考答案：**

- 文件类型验证：检查 MIME 类型和文件后缀名白名单

- 文件大小限制：限制上传文件最大尺寸

- 文件名安全：重命名文件，避免路径穿越攻击

- 存储安全：将上传目录设为不可执行，存储在非 Web 根目录

- 用 multer 处理 multipart/form-data 上传

**Q48: 如何设计一个的缓存策略？**

**考察点：**缓存设计、性能与一致性

**参考答案：**

- 多级缓存：内存缓存 → Redis 缓存 → CDN 缓存

- 缓存策略：Cache-Aside、Read-Through、Write-Through、Write-Behind

- 缓存过期：TTL 策略，热点数据短 TTL，冷数据长 TTL

- 缓存击穿：互斥锁或单飞模式防止缓存击穿

- 缓存一致性：双写策略、发布/订阅模式更新缓存

**Q49: 如何实现一个分布式的 Session 管理？**

**考察点：**会话管理、分布式系统

**参考答案：**

- 基于 Redis 存储 Session：express-session + connect-redis

- Session ID 通过 Cookie 传递，数据存储在 Redis 中

- 优势：多实例共享 Session，支持横向扩展

- Session 过期策略：滑动过期（每次访问续期）vs 固定过期

**Q50: 如何实现一个安全的 RESTful API 设计？**

**考察点：**API 设计、安全、规范

**参考答案：**

- RESTful 设计规范：资源命名、HTTP 方法语义化、状态码规范

- 认证授权：JWT Token + RBAC 角色权限控制

- 输入验证：joi/zod 参数校验，防止 SQL 注入和 XSS

- 响应格式：统一的响应结构（code/message/data）

- 分页、过滤、排序：统一的查询参数规范

- API 文档：Swagger/OpenAPI 自动生成文档
