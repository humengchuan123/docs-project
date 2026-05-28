js部分
防抖和节流有什么区别，分别用于什么场景-防抖，什么场景-节流
防抖和节流都是用来优化短时间内请求次数减轻服务器压力的手段；不同点在于节流是短时间内减少执行频率，每隔一段时间执行一次，防抖是高频触发事件，单位时间内只响应一次，触发后不再触发事件，防抖一般用于input框输入或登录按钮场景，节流用于滚动加载图片和内容以及拖拽。

px-%-em-rem-vw-vh有什么区别
px像素单位，em相对于父元素的font-size，rem相对于html的font-size，vw与vh视口高度和宽度

移动端H5点击有300ms延迟，该如何解决
fast-click、meta标签、touch事件

Retina 屏幕的 1px 像素，如何实现
伪元素 + transform scaleY(.5)、box-shadow、background-image

网页重绘repaint和重排reflow有什么区别
repaint的时候不一定会reflow、reflow的时候一定会repaint。repaint色彩背景布局不变化外观变化，reflow位置变化

后端一次性返回10w条数据，你该如何渲染
如果是vue里面先用Object.freeze()先冻结绑定响应式。然后再用一个滚动计算位置requestAnimationFrame渲染方法一次放30条数据渲染、第三方库、协商分页处理

如果一个H5很慢，如何排查性能问题-通过Chrome Performance分析
First Paint (FP)、First Contentful Paint（FCP）、性能分析工具
网页是如何加载并渲染出来的
什么是event loop
Event Loop 即事件循环， 是JavaScript或Node为解决单线程代码执行不阻塞主进程一种机制，也就是我们所说的异步原理。事件循环负责执行代码、收集和处理事件以及执行队列中的子任务

里面执行代码分为同步任务和异步任务，异步任务里面又分为微任务（promise new mutationObserver nextTick）和宏任务（setTime setInter ajax 事件绑定）

什么时候不能使用箭头函数
对象方法、构造函数

JS中for-in和for-of有什么区别
of适用于可迭代的数据（数组）， in适用于可枚举属性的数据（对象）

for-await-of有什么作用
异步迭代器，for of是同步的，await可以有时间

Map 和 Set-有序和无序
map有序，Map保持插入顺序；Set无序，但Set中的元素是唯一的，可用于去重

Map 和 Object 区别
不同：构造方式不同，Map使用new Map()创建，Object使用{}字面量或new Object()；Map的键可以是任意类型，Object的键只能是字符串或Symbol；Map有迭代器，Object没有；Map可以轻松序列化和反序列化，Object需要手动处理
相同：都可以创建键值对集合，都是动态集合，可以随时添加删除元素

Set 和 Array 区别
Set是ES6新增的数据结构，成员唯一无重复，Array可以有重复元素；Set没有索引，Array通过索引访问；Set提供了更高效的查找方法（has），Array需要遍历；Set用于去重和快速查找，Array用于有序列表操作

map、WeakMap 和 WeakSet
Map：键值对集合，键可以是任意类型，支持迭代
WeakMap：键只能是对象引用，不会阻止垃圾回收，防止内存泄漏
WeakSet：成员只能是对象引用，不会阻止垃圾回收，用于存储对象而不影响其被回收

数组 reduce 的用法
reduce用于数组归并操作，将数组元素依次执行回调函数，最终返回一个值。接收两个参数：回调函数和初始值。回调函数接收四个参数：累加器、当前值、当前索引、原数组。可用于求和、求积、计数、转换数据结构等场景

offsetHeight-scrollHeight-clientHeight有什么区别
offsetHeight：元素内容+padding+border+滚动条的总高度
scrollHeight：元素实际内容的总高度，包括溢出部分
clientHeight：元素内容+padding的可视区域高度，不包括滚动条和border

HTMLCollection和NodeList有什么区别
HTMLCollection是HTML元素的集合，只能包含HTML元素，有item()和namedItem()方法，是实时更新的
NodeList是所有节点的集合，可以包含元素节点、文本节点、注释节点等，有forEach()和item()方法，可能是实时更新或静态的

JS严格模式有什么特点
使用"use strict"声明严格模式。特点包括：变量必须先声明再使用、禁止with语句、eval和arguments特殊处理、函数this不再指向全局对象、禁止八进制字面量、 arguments参数不再追踪函数参数变化、增加静默错误抛出等

HTTP跨域时为何要发送options请求
options请求是CORS预检请求，用于检查是否允许跨域请求。浏览器自动发送，确认服务器是否允许实际的请求方法（GET/POST等）和请求头，以及是否允许携带 credentials（Cookie等）

JS内存垃圾回收用什么算法
主要使用标记清除算法和引用计数算法。V8引擎使用分代回收，将内存分为新生代和老生代，新生代使用Scavenge算法，老生代使用标记清除和标记整理算法

如何检测JS内存泄漏，JS闭包是内存泄漏吗，JS内存泄漏的场景有哪些
检测方法：Chrome DevTools的Memory面板进行快照对比、Performance Monitor监控、使用console.memory查看堆内存
闭包不是内存泄漏，但使用不当会造成内存泄漏

JS内存泄漏的场景有哪些-扩展-WeakMap和WeakSet
常见场景：全局变量未清理、闭包引用外部变量未释放、事件监听器未移除、定时器setInterval未清除、console.log持有引用、DOM引用未移除
WeakMap和WeakSet的特点：键/成员只能是对象，且不影响垃圾回收，适用于存储对象而不阻止其被回收

浏览器和nodejs事件循环 (Event Loop) 有什么区别
环境差异：浏览器使用macrotask queue和microtask queue，Node.js有多个事件循环阶段（timers、I/O callbacks、idle、poll、check、close callbacks）
API差异：浏览器有requestAnimationFrame、setTimeout等；Node.js有setImmediate、process.nextTick等
Node.js有专门的libuv库处理异步I/O，浏览器依赖Web APIs
执行顺序：Node.js中setImmediate和setTimeout执行顺序不确定，浏览器中微任务总是先于宏任务执行

虚拟DOM (vdom) 真的很快吗
虚拟DOM并不总是最快的，它的优势在于：减少直接DOM操作、提供中间层便于跨平台、声明式编程更易维护。在大量简单更新场景，原生操作可能更快；但在复杂应用和需要批量更新的场景，vdom能更好地避免不必要的重排重绘，提升开发体验和可维护性

遍历一个数组用for和forEach哪个更快
for循环通常比forEach更快，因为forEach需要调用回调函数有额外开销。但在现代JS引擎中差异很小，主要选择依据是可读性和功能性需求

nodejs如何开启多进程，进程如何通讯-进程和线程的区别
进程和线程的区别：进程是资源分配的最小单位，有独立内存空间；线程是CPU调度的最小单位，同一进程内线程共享内存
Node.js开启多进程：使用child_process模块的fork()方法、cluster模块、工作线程worker_threads
进程通讯方式：IPC（进程间通信）、socket网络、消息队列、共享内存、文件通讯等

nodes如何开启多进程，进程如何通讯
使用child_process模块：spawn()创建子进程，fork()创建进程通信，exec()执行命令
使用cluster模块：充分利用多核CPU，自动负载均衡
进程通讯：IPC通道（默认）、process.send()发送消息、共享内存、文件、socket等

请描述js-bridge的实现原理
JSBridge是连接JavaScript和Native（原生）的桥梁。原理：通过WebView注入JS环境，在Native层暴露API给JS调用；JS调用Native通过拦截URL Scheme或注入全局方法；Native调用JS通过evaluateJavaScript执行JS代码。实现方式包括：注入API、协议拦截、消息队列等

requestldleCallback和requestAnimationFrame有什么区别
requestAnimationFrame是为了实现更流畅和性能更好的动画，在下一次重绘前调用，适合做动画和UI更新
requestIdleCallback是在渲染空闲时间执行优先级不高的操作，以避免阻塞渲染，适合做统计、埋点、日志等低优先级任务

script标签的defer和async有什么区别
defer：延迟脚本，HTML解析完后再执行脚本，多个defer脚本按顺序执行
async：异步脚本，脚本下载完立即执行，不保证执行顺序，可能打断HTML解析
都没有：同步脚本，阻塞HTML解析，脚本下载完立即执行

prefetch和dns-prefetch分别是什么
prefetch：预获取资源，提前下载将来可能需要的资源（CSS、JS、字体等），不影响当前页面加载
dns-prefetch：DNS预解析，提前解析域名对应的IP，减少DNS查询时间，对跨域资源访问优化明显

前端攻击手段有哪些，该如何预防
常见攻击：XSS（跨站脚本攻击）、CSRF（跨站请求伪造）、SQL注入、DDOS攻击、点击劫持、中间人攻击
预防措施：输入输出转义过滤、CSP内容安全策略、CSRF Token、验证码、HTTPS、安全Header、正则验证、避免内联eval等

前端常用的设计模式和使用场景
常见模式：单例模式（全局唯一实例如弹窗）、工厂模式（创建对象如组件库）、观察者模式（事件系统）、发布订阅模式（EventBus）、装饰器模式（功能扩展）、代理模式（拦截操作）、策略模式（算法切换）、迭代器模式（遍历集合）

观察者模式和发布订阅模式的区别
观察者模式：Subject（目标）和Observer（观察者）直接通信，观察者注册到目标中，目标状态改变直接通知观察者，耦合度较高
发布订阅模式：Publisher（发布者）和Subscriber（订阅者）通过中间件EventChannel/EventBus通信，解耦更彻底，发布者和订阅者不需要直接引用对方

手写一个JS函数，实现数组扁平化Array Flatten
答案：使用reduce和concat递归实现

手写一个JS函数，实现数组深度扁平化
答案：使用reduce和concat配合递归或使用flat(Infinity)

手写一个getType函数，获取详细的数据类型
答案：使用Object.prototype.toString.call()获取详细类型字符串

new 个对象的过程是什么

1. 创建一个空对象，为其分配内存空间
2. 将构造函数的prototype属性赋值给新对象的**proto**
3. 将构造函数中的this指向新创建的对象
4. 执行构造函数中的代码，如果构造函数有返回值且为对象则返回该对象，否则返回新创建的对象

深度优先遍历一个DOM树
答案：使用递归或栈实现，有前序、中序、后序三种方式

广度优先遍历一个DOM树
答案：使用队列实现，逐层遍历DOM节点

手写一个LazyMan，实现sleep机制
答案：使用任务队列和控制执行状态

手写curry函数，实现函数柯里化
答案：将多参数函数转换为接收单个参数的函数序列

instanceof原理是什么，请写代码表示
答案：检查对象的原型链是否包含构造函数的prototype

手写函数bind功能
答案：改变函数this指向，返回新函数

手写函数call和apply功能
答案：改变函数this指向，call接收参数列表，apply接收参数数组

手写EventBus自定义事件-包括on和once
答案：实现事件订阅和发布机制，once需要标记并在触发后移除

用JS实现一个LRU缓存-分析数据结构特点，使用Map
答案：利用Map的插入顺序特性，最新访问的放最后，超出容量时删除第一个

手写JS深拷贝-考虑各种数据类型和循环引用
答案：使用WeakMap处理循环引用，递归拷贝各种数据类型

根据一个 DOM树，写出一个虚拟 DOM 对象
答案：递归遍历DOM节点构建JS对象

[1,2,3].map(parselnt) /_ 1 NaN _/
答案：map会传递三个参数(element, index, array)，parseInt接收两个参数(value, radix)，所以实际执行为parseInt(1,0)=1, parseInt(2,1)=NaN, parseInt(3,2)=NaN

读代码-函数修改形参，能否影响实参
答案：基本类型不能影响实参（值传递），引用类型如果直接修改形参属性可以影响实参（引用传递），但如果完全重新赋值形参则不影响

把一个数组转换为树
答案：使用Map记录节点，递归构建树结构

读代码-构造函数和原型的重名属性
答案：读取属性时先找实例属性再找原型属性，修改属性时只会修改实例属性不影响原型

如何设计个前端统SDK-分析功能范围
答案：确定SDK功能范围和边界、选择加载方式（CDN/npm）、设计API接口、提供调试工具和日志、考虑兼容性和性能、版本管理和更新机制、文档和示例

sourcemap有何作用，如何配置
作用：将压缩混淆的代码映射回源码，便于调试和生产环境问题排查
配置：在webpack、vite等构建工具的devtool选项中设置，如source-map、eval-source-map等

SPA和MPA应该如何选择
SPA适用：单页面应用、需要流畅体验的Web App、需要实时更新的应用、API驱动的前后端分离项目
MPA适用：内容为主的项目、SEO敏感的项目、需要多页面但共享部分少的项目、老项目改造

设计一个H5编辑器的数据模型和核心功能
答案：数据模型包括页面、组件、属性、样式、事件等；核心功能包括拖拽布局、属性编辑、样式调整、预览发布、撤销重做、多人协作等

何时应该使用 SSR，何时不用
适用SSR：需要SEO优化、首屏加载性能要求高、需要更好用户体验、内容型网站
不用SSR：交互性强但内容少的应用、需要实时数据的Dashboard、API驱动的Web App、团队技术栈限制

设计一个"用户-角色-权限"的模型和功能
答案：用户表、角色表、权限表，角色权限关联表，用户角色关联表。功能包括用户管理、角色管理、权限分配、菜单权限、数据权限、按钮权限等

简单描述hybrid模板的更新流程
答案：检测版本号→下载最新模板包→解压到本地→更新本地引用→重启应用

开发一个H5抽奖页，需要后端提供哪些接口
答案：用户登录/验证接口、抽奖活动信息接口、抽奖记录接口、奖品库存接口、中奖名单接口、防刷验证接口、抽奖结果提交接口

如果你是前端技术负责人，将如何做技术选型
答案：考虑团队技术栈和经验、项目需求和特点、性能和用户体验、长期维护成本、社区生态和文档、性能和包大小、兼容性和适配成本

设计实现一个H5图片懒加载SDK
答案：利用IntersectionObserver或滚动事件监听、设置占位图、计算图片进入视口的时机、懒加载真实图片、考虑低版本浏览器兼容

前端性能优化有哪些方式
答案：资源压缩合并、CDN加速、缓存策略、代码分割、Tree Shaking、图片优化（压缩、懒加载、WebP）、DNS预解析、预加载、减少重排重绘、事件委托、虚拟列表、按需加载、节流防抖

H5页面如何进行首屏优化
答案：SSR或预渲染、代码分割、路由懒加载、图片懒加载、骨架屏或loading、资源预加载、减少请求数量、利用缓存、优化CSS和JS加载顺序

后端有了 java php python ，为何还需要 nodejs
答案：Node.js适合I/O密集型应用、轻量级API服务、实时应用、前后端分离统一语言、npm生态丰富、快速原型开发、能够处理高并发连接

js网络请求与通信相关

Ajax-Fetch-Axios三者有什么区别
Ajax：异步JavaScript和XML，一种技术统称，使用XMLHttpRequest实现
Fetch：浏览器原生API，基于Promise，用于网络请求，比Ajax更简洁，支持Service Worker，但需要封装处理错误和超时
Axios：基于Promise的HTTP库，对Fetch的封装，提供拦截器、自动转换JSON、取消请求、防止XSRF等功能

HTTP请求中token和cookie有什么区别-cookie和session，token和JWT
cookie和session：cookie存储在浏览器，session存储在服务器，cookie配合session使用，session需要sessionId
token和JWT：token是令牌概念，JWT是具体实现，token存储在localStorage或cookie，JWT可以自包含信息，无状态可扩展

如何实现SSO单点登录
答案：用户访问应用A未登录→重定向到SSO服务器→登录成功后生成全局session和token→重定向回应用A并携带token→应用A验证token并创建本地session→用户访问应用B→应用B验证token→SSO验证通过创建本地session

HTTP协议和UDP协议有什么区别
TCP：面向连接、可靠传输、数据顺序保证、三次握手四次挥手、拥塞控制、错误检查
UDP：无连接、不可靠传输、不保证顺序、不需要连接建立、性能更高、适用于实时性要求高的场景如视频流

HTTP协议1.0和1.1和2.0有什么区别
1.0：默认短连接，每次请求建立TCP连接，请求结束断开
1.1：默认长连接（keep-alive），支持管道化请求，支持断点续传，增加缓存控制，新增PUT、DELETE等方法
2.0：多路复用（一个TCP连接并行多个请求）、header压缩、服务器推送、二进制分帧、请求优先级

什么是HTTPS中间人攻击，如何预防
中间人攻击：攻击者插入到客户端和服务器之间，截获和篡改通信内容
预防：使用有效SSL证书、验证证书链、启用HSTS、使用HTTPS、证书绑定（Public Key Pinning）

WebSocket和HTTP协议有什么区别
HTTP：请求-响应模式，单向通信，基于TCP，需要轮询保持连接
WebSocket：全双工通信协议，基于TCP，建立连接后可以双向发送数据，连接保持不断开，适合实时应用

WebSocket和HTTP长轮询的区别
长轮询：客户端发送请求，服务器无数据时等待，有数据则响应，客户端立即再发请求
WebSocket：建立一次连接，持续双向通信，性能更好，延迟更低，资源消耗更少

从输入URL 到网页显示的完整过程
DNS解析→建立TCP连接→发送HTTP请求→服务器处理请求→返回HTTP响应→浏览器解析HTML→构建DOM树→构建CSSOM树→合成渲染树→布局计算→绘制页面→加载外部资源→执行脚本→完成显示

如何实现网页多标签tab通讯
答案：使用localStorage或sessionStorage事件监听、使用BroadcastChannel、使用postMessage、基于WebSocket或Server-Sent Events、使用cookie轮询

如何实现网页和iframe之间的通讯
答案：使用postMessage API、父页面和子页面相互通信、使用localStorage事件、使用SharedWorker

描述 TCP 三次握手和四次挥手
三次握手：客户端发送SYN包→服务器返回SYN+ACK包→客户端发送ACK包，连接建立
四次挥手：主动方发送FIN包→被动方返回ACK→被动方发送FIN包→主动方返回ACK，连接断开

http常见的状态码有哪些
1xx：信息状态码（Continue、Switching Protocols）
2xx：成功状态码（200 OK、201 Created、204 No Content）
3xx：重定向状态码（301 Moved Permanently、302 Found、304 Not Modified）
4xx：客户端错误状态码（400 Bad Request、401 Unauthorized、403 Forbidden、404 Not Found）
5xx：服务器错误状态码（500 Internal Server Error、502 Bad Gateway、503 Service Unavailable）

http 哪些常见 header
请求头：Accept、Accept-Encoding、Accept-Language、Cache-Control、Cookie、Host、User-Agent、Authorization、Content-Type、Content-Length、Referer
响应头：Content-Type、Content-Length、Content-Encoding、Cache-Control、Set-Cookie、ETag、Last-Modified、Access-Control-Allow-Origin、Server

http 为何需要缓存
答案：减少服务器负载、加快页面加载速度、节约网络带宽、用户体验更好、离线可用

cache-control是什么意思-http强制缓存
Cache-Control是HTTP响应头，用于控制强制缓存的行为。常见值：public（可被任何缓存存储）、private（只有浏览器缓存）、no-cache（需要协商缓存）、no-store（禁止缓存）、max-age（缓存有效期）

Etag和Last-Modified是什么意思-http协商缓存
Last-Modified：资源最后修改时间，服务器返回，客户端下次请求时发送If-Modified-Since
ETag：资源唯一标识，服务器生成，客户端下次请求时发送If-None-Match，比Last-Modified更精确

刷新页面对http缓存的影响
正常刷新（F5）：优先使用缓存，可能发送协商缓存验证请求
强制刷新（Ctrl+F5）：忽略缓存，直接从服务器获取最新资源，发送Pragma: no-cache和Cache-Control: no-cache

https-加密方式
混合加密：使用非对称加密（RSA/ECDHE）交换对称加密密钥，使用对称加密（ AES ）加密实际数据传输，结合了两者的优点

如何用 chrome 调试js 代码
答案：使用Sources面板设置断点、使用console.log/debugger打断点、使用Watch监控变量、使用Call Stack查看调用栈、使用Network面板查看网络请求、使用Performance分析性能、使用Application查看存储和使用Elements检查DOM

移动端 h5 如何抓包网络请求
答案：使用Charles配置代理、使用Fiddler、使用mitmproxy、手机设置代理指向电脑、使用浏览器开发者工具远程调试

vue面试题
Vue中computed和watch有什么区别
computed：计算属性，基于响应式依赖缓存，只有依赖的数据变化时才重新计算，适用于派生状态
watch：监听数据变化并执行回调，适用于响应数据变化执行副作用或异步操作

Vue组件通讯有几种方式
props和emit：父子组件通讯；provide和inject：祖先和后代组件通讯；$attrs和$listeners：跨级通讯；$refs：获取组件实例；eventBus（ mitt、EventBus）：自定义事件；Vuex/Pinia：状态管理；本地存储：localStorage/sessionStorage

在实际工作中，你对Vue做过哪些优化
答案：函数式组件优化、Object.freeze冻结数据、路由懒加载、组件懒加载、大列表使用虚拟滚动、第三方库按需加载、使用keep-alive缓存组件、合理使用computed和watch、减少Watcher、避免大型响应式对象、使用穹哥组件、预渲染/SSR、压缩代码、Tree Shaking

在使用Vue过程中遇到过哪些坑
答案：数组更新检测（直接用索引修改数组）、对象属性添加删除（Vue2无法检测）、路由切换时组件没有销毁、scoped样式穿透、路由守卫next()参数、Vue2和Vue3响应式差异、async组件在循环中使用、this指向问题、生命周期顺序问题

如何统一监听Vue组件报错
答案：使用Vue.config.errorHandler全局错误处理、使用window.onerror、组件中使用errorCaptured钩子、Vue3使用app.config.errorHandler、生产环境使用Sentry监控

Vuex中action和mutation有什么区别
mutation：同步操作，直接修改state，是唯一修改state的途径；action：可以包含异步操作，通过提交mutation来修改state，适用于执行副作用或调用API

Vue每个生命周期都做了什么
beforeCreate：实例刚创建，data和methods未初始化；created：实例创建完成，data和methods可用，DOM未生成；beforeMount：模板编译完成，即将挂载；mounted：DOM挂载完成，可访问$el；beforeUpdate：数据变化前；updated：DOM更新完成；beforeDestroy：实例销毁前；destroyed：实例销毁完成

Vue2和Vue3和React三者的diff 算法有什么区别
Vue2：双端比较，从两端向中间比较，使用sameNode判断
Vue3：使用静态标记和最长递增子序列优化，只有带标记的节点才会对比
React：使用reconciliation协调，单节点使用key比较，多节点批量更新，Fiber架构实现时间切片

Vue-router的MemoryHistory是什么
MemoryHistory是一种路由模式，路由信息存储在内存中，不依赖URL，适用于非浏览器环境（如SSR或原生应用），不会同步到地址栏

如何用自定义事件进行 vue 组件通讯
答案：创建EventBus，组件中$on监听事件，$emit触发事件，$off移除监听器，或使用mitt库实现更轻量的事件通讯

vue 动态组件是什么
动态组件指通过component标签和is属性实现的组件切换，根据数据动态决定渲染哪个组件，常用于标签页切换、表单动态渲染等场景

vue 如何异步加载组件
异步组件是一种延迟加载组件的方式，它可以让我们在需要时再加载组件，从而提高应用的性能和用户体验。异步加载的工厂函数、或者（）=> import()。() => ({component: import('./AsyncComponent.vue'),loading: LoadingComponent,error: ErrorComponent,delay: 200,timeout: 10000})

vue 组件如何抽离公共逻辑
hooks：Vue3中使用组合式函数抽离复用逻辑；mixins：混入方式复用组件选项；mixins存在问题：命名冲突、来源不清；hooks更优：逻辑清晰、易于测试、更好的类型支持

vue 模板被编译成什么
render函数。Vue模板编译器（vue-template-compiler）将模板编译成render函数，render函数返回VNode，VNode描述了要渲染的组件结构

如何理解ref toRef 和 toRefs
ref：创建响应式引用，可用于基本类型和对象类型
toRef：将响应式对象的某个属性转换为ref，保持响应式连接
toRefs：将响应式对象的所有属性转换为ref，常用于解构响应式对象
为什么需要用 ref
因为基本类型不是对象，无法直接实现响应式，ref将基本类型包装成对象实现响应式
为什么需要 toRef 和 toRefs
在保持响应式的前提下，方便地访问和使用响应式对象的属性，避免解构丢失响应式
Composition API 如何实现逻辑复用
通过抽取为独立的函数（hooks/composables），在组件中调用并组合使用。可以将相关的逻辑（状态、方法、生命周期）封装在一起，形成可复用的组合式函数

watch和watchEffect的区别
effect是副作用一个函数API，watch是一个选项API。与watch不同，watchEffect不需要显式地指定要监听的数据，它会自动追踪函数内部使用的响应式数据。由于watchEffect的自动追踪机制，它通常用于处理副作用，例如执行异步操作或者更新UI。

Vite 为什么启动非常快
Vite启动快的原因是启动的时候不需要做任何编译。Vite利用ESM模块系统在开发环境中按需编译，只有当某个模块被实际请求时才会进行编译，实现了即时启动

ES Module 在浏览器中的应用
ES Module是ES6提出的模块化标准，使用import和export语法。浏览器通过script标签type="module"启用，支持异步加载，模块只执行一次，常用于现代前端工程的模块化管理

Composition API 和 React Hooks 的对比
相同点：都支持逻辑复用、都围绕响应式数据、都可以替代Class组件
不同点：Vue使用选项式和组合式两种写法，React只有函数式；Vue的setup在实例创建前调用，React的hooks在渲染时调用；Vue自动追踪依赖，React需要手动声明依赖；Vue使用Proxy实现响应式，React使用useState/useReducer；React hooks有严格的调用顺序规则

Vue3-script-setup-暴露组件信息defineExpose
vue3的语法糖最终解析都为render函数，函数中会有一个expose方法，给外界暴露相关属性，在3.2的语法糖中默认直接暴露expose（）对属性进行收缩，与之前的版本相比没有把内部属性给暴露出去，优点就是为了防止外部修改属性值，保持单一数据流动
vue3的语法糖最终解析都为render函数，函数中会有一个expose方法，给外界暴露相关属性，在3.2的语法糖中默认直接暴露expose（）对属性进行收缩，与之前的版本相比没有把内部属性给暴露出去，优点就是为了防止外部修改属性值，保持单一数据流动

小程序

小程序状态管理？
1.mobx-miniprogram， 这个库类似于react-redux用法。2.一般使用uni-app的一套架构体系，直接使用vue的状态管理。

react
JSX如何判断条件和渲染列表
条件渲染：使用三元运算符或逻辑与运算符（&&）判断条件、也可以使用if语句或switch语句返回不同JSX；列表渲染：使用map方法遍历数组，返回JSX元素，必须为每个列表项提供唯一的key属性

React事件为何bind this
因为在在createElement中的时候丢失了this指针，并不是由组件实例调用的，因此需要手动绑定this

```jsx
// 问题示例：this指向undefined
class Hello extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: 'Hello' };
  }

  handleClick() {
    // 这里的 this 是 undefined（在严格模式下）
    console.log(this.state.message);
  }

  render() {
    // 错误：直接传递方法引用，this会丢失
    return <button onClick={this.handleClick}>点击</button>;
  }
}

// 解决方案1：构造函数中bind
class Hello extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: 'Hello' };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log(this.state.message);
  }

  render() {
    return <button onClick={this.handleClick}>点击</button>;
  }
}

// 解决方案2：箭头函数（推荐）
class Hello extends React.Component {
  state = { message: 'Hello' };

  handleClick = () => {
    console.log(this.state.message);
  };

  render() {
    return <button onClick={this.handleClick}>点击</button>;
  }
}

// 解决方案3：render中使用箭头函数（正确，但注意性能问题）
// 这种写法 this 是正确的，但因为每次渲染都创建新函数，可能影响性能
render() {
  return <button onClick={() => this.handleClick()}>点击</button>;
}
```

React 事件和 DOM 事件的区别
一个是模拟合成事件（方便跨平台），一个是真实事件，dom需要获取到真实节点，react是通过根节点，冒泡、捕获事件来获取

React父子组件通讯
父到子：props传递数据；子到父：父组件传递回调函数props，子组件调用；也可以使用Context上下文或状态管理（Redux/Zustand）进行通讯

setState为何使用不可变值
组件的状态（state）应该保持不变。通过使用 setState 方法更新状态时，React会合并现有状态和新状态，而不是直接修改状态。 这确保 React 可以正确地追踪状态的变化并进行必要的更新

setState何时会合并state
在React可以监控的地方：React 事件,React 组件的生命周期函数，以及其他的React方法中，呈现异步表现，并且回对setState进行合并更新
在异步方法中，或原生事件中，setState 呈现同步表现，不会对 setState 进行合并处理（react17之前）
React组件生命周期
函数组件没有生命周期、类组件有生命周期

React函数组件和class组件有何区别
类组件需要声明constructor，函数组件不需要
类组件需要手动绑定this，函数组件不需要
类组件有生命周期钩子，函数组件没有
类组件可以定义并维护自己的state，属于有状态组件，函数组件是无状态组件
类组件需要继承class，函数组件不需要
类组件使用的是面向对象的方法，封装：组件属性和方法都封装在组件内部 继承:通过extends React.Component继承;函数组件使用的是函数式编程思想

什么是React非受控组件
受控组件和非受控组件的区别：其实就在于对状态state的控制，将所需用的数据实时存储到state中，就是受控组件，而在需要用到数据的时候从DOM中获取就是非受控组件

什么场景需要用React Portals
封装一些弹窗和提示框的时候，因为节点的层级问题，需要提示框通过传送门到根节点层级去覆盖到达最高的优先级

是否用过React Context
Context是React提供的全局数据传递机制，用于在组件树中共享数据，避免层层传递props。适用于主题、语言、用户信息等全局数据的场景。使用createContext创建，Provider提供数据，Consumer或useContext消费数据

React如何异步加载组件
lazy 和import。React.lazy()用于代码分割，接收一个返回dynamic import的函数，配合React.Suspense组件实现加载状态显示

React性能优化
shouldComponentUpdate；memo；getDerviedStateFromProps；使用Fragment
v-for使用正确的key；拆分尽可能小的可复用组件，ErrorBoundary；使用useTranslation优化列表延迟渲染
使用React.lazy和React.Suspense延迟加载不需要立马使用的组件

什么是React高阶组件
HOC 1.接受一个或多个函数作为输入 2.输出一个函数。高阶组件是参数为组件，返回新组件的函数。用于逻辑复用、props增强、渲染劫持。常见的有装饰器模式、代理模式

什么是React Render Props
Render Props是一种复用组件逻辑的技术，通过props传递一个返回JSX的函数，在组件内部调用该函数并传递数据。Render Props和HOC都能实现逻辑复用，Render Props更灵活，HOC更简洁

React高级特性
答案：Suspense、Concurrent Mode、Fiber架构、时间切片、代码分割、Error Boundaries、Portals、Refs、Context、Hooks

描述Redux单项数据流
事件或行为进行触发dispatch函数，dispatch携带相关定义的type & preload数据到action，action根据对应的type类型运行reducer函数更改对应的值，state通知视图进行更新

Redux action如何处理异步
安装redux-thunk中间库，或者使用RTK通过封装构造出dispatch函数的回调方法，就可以处理异步

简述Redux中间件原理
中间件在dispatch和reducer之间提供了第三方的扩展点。原理：改造store的dispatch方法，使其依次经过所有中间件处理，每个中间件可以拦截action、执行异步操作、决定是否继续传递action。典型中间件格式：store => next => action => {...}

在实际工作中，你对React做过哪些优化
答案：组件懒加载、使用React.memo/useMemo/useCallback优化不必要的渲染、合理使用shouldComponentUpdate、避免匿名函数和内联对象、使用Fragment减少DOM节点、列表使用虚拟滚动、第三方库按需加载、骨架屏、代码分割、减少Context过度使用、避免不必要的重新渲染

你在使用React时遇到过哪些坑
答案：setState的异步和合并问题、useEffect依赖项导致的无限循环、useEffect清理函数未正确清理、React Portal导致的事件冒泡问题、Context引起的性能问题、React18的自动批处理、SSR hydration不匹配、React.memo比较的是props引用、Hook不能在条件语句中使用

如何统一监听React组件报错
答案：使用React16+的Error Boundaries（componentDidCatch、getDerivedStateFromError）、React18使用onCaughtError和onUncaughtError、window.addEventListener('error')、window.addEventListener('unhandledrejection'）、生产环境使用Sentry监控

React原理
React基于虚拟DOM和Diff算法。核心思想是声明式编程，组件化开发，通过props和state驱动视图更新，使用协调器（Reconciler）比较虚拟DOM差异，渲染器（Renderer）负责更新真实DOM。Fiber架构将更新拆分为小任务，实现时间切片和优先级调度

React 的 batchUpdate 机制
批量更新机制是React优化性能的手段，将多个setState调用合并为一次更新。React17以前只在事件处理函数中自动批处理，React18开始无论在哪里（包括异步、定时器、原生事件）都会自动批处理，使用flushSync可以强制同步

React 的合成事件机制
合成事件是React封装的事件系统（SyntheticEvent），兼容所有浏览器。原理：在根节点（React17+）上绑定事件监听器，事件触发时根据event.type找到对应处理函数，传递合成事件对象。提供跨浏览器一致的API，自动管理事件委托和自动绑定

React事务机制
事务机制是React源码中的重要概念，是一种将多个操作包装成原子操作的方式。事务会执行wrapper方法，在wrapper前后有initialize和close方法，用于处理事务的初始化和清理工作。React中的更新、重渲染、错误处理等都依赖事务机制

React组件渲染和更新的过程
首次渲染：JSX => createElement => VDOM => render => DOM；更新过程：setState => diff算法 => 更新差异DOM节点。React18使用Fiber架构，将渲染工作分为render阶段（标记更新）和commit阶段（应用更新），支持时间切片和优先级调度

class 组件逻辑复用有哪些问题；class 组件存在哪些问题
class组件逻辑复用问题：Mixin（混入）有命名冲突、来源不清、依懒顺序问题；HOC有嵌套地狱、props被覆盖问题；Render Props有嵌套过深、性能问题
class组件存在问题：this绑定复杂、易出错；生命周期复杂、逻辑分散；代码量多、复用困难；热重载不友好；类实例创建开销大

hooks还不能完整的为函数组件提供类组件的能力
函数组件给了我们一定程度的自由，却也对开发者的水平提出了更高的要求
Hooks 在使用层面有着严格的规则约束
用 useEffect 模拟组件生命周期
useEffect中 直接打印数据 模拟数据载入， 在effect方法中收集数据变动模拟数据更新，在effect return回调方法中模拟销毁

用 useEffect 模拟 WillUnMount 时的注意事项
答案：确保清理函数正确返回、清理副作用避免内存泄漏、处理异步操作的取消、注意依赖项变化导致的重复执行和清理

React-setState是微任务还是宏任务
在官网上描述为state可能是异步的，其实也可能是是同步，框架设计异步渲染，异步批量更新数据更新顺序在微任务前面

用 useState 实现 state 和 setState 功能
答案：useState返回状态和更新函数，setState可以接收新值或返回新值的函数，类似class组件的this.setState

useRef 和 useContext
useRef：创建引用，存储可变值，修改不会触发重新渲染，常用于访问DOM元素或存储不需要渲染的值
useContext：接收Context对象，返回当前Context值，用于在函数组件中获取Context提供的数据

useReducer 能代替 redux 吗
可以部分代替redux，适用于简单到中等的state管理。但redux有更完善的生态（中间件、开发工具、时间旅行）、更适合大型项目和复杂状态逻辑；useReducer更适合局部状态管理或中等复杂度应用

使用 useMemo 做性能优化
useMemo用于缓存计算结果，只有依赖项变化时才重新计算。适用于计算量大的场景、避免不必要的重复计算、可用于存储对象和数组等引用类型，但要注意过度使用可能增加开销

使用 useCallback 做性能优化
useCallback用于缓存函数定义，只有依赖项变化时才返回新函数。适用于将回调函数传递给子组件（子组件使用React.memo优化）、在useEffect依赖项中使用函数，避免子组件不必要的渲染

什么是自定义 Hook
自定义Hook是以use开头的函数，内部可以使用其他Hook，用于抽取和复用有状态的逻辑。是React Hooks逻辑复用的主要方式，可以让组件逻辑复用更清晰、更易测试、更易于分享

为何 Hooks 要依赖于调用顺序
因为底层是链表，每一个 Hook 的 next 是指向下一个 Hook 的，if 会导致顺序不正确，从而导致报错，所以 React 是不允许这样使用 Hook 的

Hooks 组件逻辑复用有哪些好处
告别难以理解的class组件；解决业务逻辑难以拆分的问题
使状态逻辑复用变的简单可行；函数组件从设计理念来看，更适合react

webpack
webpack5
webpack5的新特性：Module Federation（模块联邦）、更好的Tree Shaking、持久化缓存、智能增量编译、WebAssembly支持、更好的性能、Chunk ID稳定、Node.js的自动polyfill被移除、更多的优化和改进

webpack基本配置
output entry devServer reslove moldes plugins devTool

如何配置 babel
使用babel-loader，配置babel.config.js或.babelrc，设置presets（@babel/preset-env、@babel/preset-react）和plugins，支持根据环境配置不同转换规则

ES6 模块化规范是什么
ES6 Module是ECMAScript官方的模块化标准，使用import和export语法。特点：静态导入（import在顶层）、默认严格模式、模块只执行一次、导入引用只读、编译时确定依赖关系、支持异步加载

如何配置 webpack 生产环境
答案：mode设为production、启用代码压缩和Tree Shaking、使用optimization配置、配置SplitChunks分代码分割、使用DefinePlugin注入环境变量、配置output.filename使用contenthash、使用CssMinimizerPlugin压缩CSS

webpack如何抽离压缩css文件
使用mini-css-extract-plugin提取CSS到独立文件，使用css-loader和style-loader，使用css-minimizer-webpack-plugin压缩CSS，配置optimization.minimizer

webpack如何抽离公共代码和第三方代码
配置optimization.splitChunks，chunks设为'all'或'all'，设置cacheGroups分离vendor和common，vendor用于第三方库（如node_modules），common用于公共模块

webpack如何实现异步加载JS
答案：使用import()动态导入语法（需要配置babel支持）、使用require.ensure（webpack特有）、使用webpackChunkName注释自定义包名、配合React.lazy和Suspense使用

module chunk bundle 的区别
module：模块，源码中的一个文件或模块，是Webpack打包的基本单位
chunk：代码块，打包过程中合并的模块集合，用于代码分割和按需加载
bundle：最终输出的文件，是Webpack打包结果的产物，通常由一个或多个chunk组成

webpack优化构建速度
答案：使用HappyPack/thread-loader多线程编译、配置resolve.alias减少解析范围、使用noParse跳过无依赖模块、使用DllPlugin抽离不变代码、使用cache-loader缓存、使用webpack5持久缓存、减少loader和plugin、使用esbuild等更快的编译器

webpack 如何配置热更新
答案：配置devServer.hot为true、引入webpack.HotModuleReplacementPlugin、配置hot: true in devServer、使用module.hot.accept处理模块更新、在组件中使用useHotLoader或react-hot-loader

何时使用 DllPlugin
当项目依赖的第三方库（如React、Vue、AntD）不经常变化时，使用DllPlugin将这些不常变化的库单独打包成动态链接库，避免每次构建都重新编译第三方代码，大幅提升构建速度

ES Module 和 Commonjs 的区别
ESM：静态导入，编译时确定依赖，导入导出值是只读引用，支持异步加载， 自动严格模式
CJS：动态导入，运行时刻依赖，require()是同步的，导出值是拷贝，可以修改，module.exports导出
混用问题：ESM可以import CJS（整体导出），CJS不能直接require ESM（需要插件转换）

babel、babel-polyfill、babel-runtime
babel：JavaScript编译器，将ES6+代码转译为ES5；babel-polyfill：通过导入core-js和regenerator-runtime提供新特性，适合全局补充；babel-runtime：模块化方式提供新特性，减少重复代码，适合库开发

算法题
使用JS反转单向链表-什么是链表
链表是一种线性数据结构，由节点组成，每个节点包含数据和指向下一个节点的指针。单向链表的节点只能指向下一个节点，反转链表需要改变指针方向

时间复杂度、空间复杂度
时间复杂度：算法执行时间与数据规模的关系，用大O表示法描述，如O(1)、O(log n)、O(n)、O(n²)等
空间复杂度：算法占用内存空间与数据规模的关系，描述额外空间需求

链表和数组哪个实现队列更快
链表，因为链表的时间复杂度O(1), 队列是O(n)

用JS实现二分查找
答案：使用双指针法，在有序数组中每次将查找范围缩小一半，时间复杂度O(log n)

求二叉搜索树的第K小值-二叉树和三种遍历
答案：利用二叉搜索树特性，中序遍历得到升序序列，第K-1个元素即为第K小值。时间复杂度O(h+k)，h为树高

为什么二叉树很重要，而不是三叉树四岔树
答案：二叉树结构简单、规律性强、便于存储和检索；任何树都可以转换为二叉树表示；计算机底层采用二进制运算；高效算法实现相对简单

堆有什么特点，和二叉树有什么关系
堆是一种完全二叉树，分为最大堆和最小堆。最大堆：父节点大于等于子节点；最小堆：父节点小于等于子节点。常用于实现优先队列、堆排序、TopK问题

求斐波那契数列的第n值
答案：可以使用递归（O(2^n)）、记忆化递归（O(n)）、动态规划（O(n)）、矩阵快速幂（O(log n)）等方法实现

用JS实现快速排序
答案：采用分治策略，选择基准元素，将数组分为两部分递归排序。时间复杂度平均O(n log n)，最坏O(n²)，空间复杂度O(log n)

二分法查找、 sort排序、 冒泡排序
答案：二分查找用于有序数组，时间复杂度O(log n)；sort排序通常使用快速排序或Timsort，时间复杂度O(n log n)；冒泡排序时间复杂度O(n²)，适合小规模数据

获取1-10000之前所有的对称数
答案：对称数（回文数）是指正读和反读都相同的数字。可以遍历100-999和1000-9999生成，或使用数学方法计算

如何实现高效的英文单词前缀匹配
答案：使用字典树（Trie）数据结构，以空间换时间，前缀查询时间复杂度O(m)，m为前缀长度。支持插入、查找、前缀匹配操作

二叉树的前、中、后序遍历的结果
前序 根->左->右 执行顺序从头到尾 A B C G D E F H L
中序 左->中->右 执行顺序从尾到头 G C D B A H F L E
后续 左->右->中 执行顺序从尾到头最后到根 G C D B H L F E A

#### 后端面试题

并行和并发的区别
并行：多个任务在同一时刻真正同时执行，需要多核/多处理器支持
并发：多个任务在同一时间段内交替执行，单核通过时间片轮转实现，宏观上同时运行，微观上交替执行

go创建线程有哪些方式
答案：

1. go 关键字启动 goroutine：Go 通过 `go func()` 创建轻量级协程（goroutine），由 Go 运行时调度到 OS 线程上执行，非传统 OS 线程
2. runtime.GOMAXPROCS()：控制使用的 OS 线程数量，Go 运行时自动将多个 goroutine 复用到少量 OS 线程上

nodejs创建线程有哪些方式
答案：

1. worker_threads 模块：Node.js 内置模块，通过 `new Worker(filename)` 创建真正的多线程，线程间可通过 MessagePort / SharedArrayBuffer 通信
2. child_process 模块：通过 fork / spawn / exec 等方法创建子进程，虽不是线程但常用于并行处理 CPU 密集型任务
3. cluster 模块：基于 child_process.fork() 创建多个工作进程，利用多核 CPU 实现负载均衡

线程池有哪些状态
答案：

1. RUNNING：接受新任务并处理队列中的任务
2. SHUTDOWN：不接受新任务，但处理队列中的已有任务
3. STOP：不接受新任务，不处理队列任务，中断正在执行的任务
4. TIDYING：所有任务已终止，工作线程数为 0
5. TERMINATED：线程池完全终止

什么是死锁？怎么防止？
死锁：多个线程或进程互相等待对方释放资源，导致都无法继续执行的状态。
产生死锁的四个必要条件：互斥、请求与保持、不剥夺、循环等待。
防止：

1. 破坏请求与保持条件：一次性申请所有需要的资源
2. 破坏不剥夺条件：申请不到新资源时释放已持有的资源
3. 破坏循环等待条件：对资源编号，按序申请
4. 银行家算法：在分配资源前检查是否会导致不安全状态

rabbitmq有哪些重要的组件？
答案：

1. 交换机（Exchange）：接收生产者消息，按规则路由到队列
2. 队列（Queue）：存储消息，消费者从队列获取消息
3. 绑定（Binding）：将交换机和队列关联，定义路由规则
4. 连接（Connection）：生产者/消费者与 Broker 的 TCP 连接
5. 通道（Channel）：Connection 上的轻量级虚拟连接，减少 TCP 开销
6. 虚拟主机（Virtual Host）：逻辑隔离，不同 vhost 之间资源互不可见

rabbitmq有哪些广播类型？
答案：

1. direct：根据路由键精确匹配，将消息路由到绑定了对应路由键的队列
2. fanout：将消息广播到所有绑定的队列，忽略路由键
3. topic：根据路由键的模式匹配（支持 \* 和 # 通配符）路由到匹配的队列
4. headers：根据消息头（headers）属性匹配，忽略路由键

MySQL索引有哪些类型？
答案：

1. 按数据结构分：B+树索引（InnoDB 默认）、Hash 索引（Memory 引擎）、全文索引（FULLTEXT）
2. 按逻辑功能分：主键索引（唯一且非空）、唯一索引（值不可重复）、普通索引（无约束）、复合索引（多列组合）
3. 按物理存储分：聚簇索引（叶子节点存完整行数据，每表只有一个）、非聚簇索引（叶子节点存主键值，需回表查询）

MySQL索引是怎么实现的？
答案：

1. InnoDB 使用 B+树实现索引：非叶子节点只存索引键，叶子节点存数据或主键值
2. 聚簇索引：叶子节点存储完整行数据，数据按主键顺序物理存储，每表仅一个
3. 非聚簇索引（二级索引）：叶子节点存储主键值，查询非索引列需回表（通过主键查聚簇索引）
4. B+树相比 B 树的优势：叶子节点链表连接支持范围查询，非叶子节点不存数据使树更矮减少 IO

简述乐观锁和悲观锁
答案：

1. 乐观锁：假设不会发生冲突，读取时不加锁，更新时通过版本号（version）或 CAS 检测是否被修改，若被修改则重试或放弃
2. 悲观锁：假设一定会冲突，操作前先加锁（如 `SELECT ... FOR UPDATE`），确保其他事务无法修改，操作完成后释放锁

Redis有哪些数据类型
答案：

1. 字符串（String）：最基本类型，可存字符串、整数、浮点数，最大 512MB
2. 列表（List）：有序可重复的字符串链表，支持两端推入/弹出
3. 集合（Set）：无序不重复的字符串集合，支持交集/并集/差集运算
4. 有序集合（Sorted Set）：不重复且按分数排序的集合，支持范围查询
5. 哈希（Hash）：字段-值映射表，适合存储对象
6. HyperLogLog：基数估算，用于 UV 统计等去重计数场景
7. Stream：消息流，支持消费组，类似轻量级消息队列

怎么保证缓存和数据库数据的一致性
答案：

1. Cache Aside（旁路缓存）：读时先查缓存，未命中再查数据库并写入缓存；写时先更新数据库，再删除缓存
2. 延迟双删：更新数据库前后各删除一次缓存，中间加短暂延迟，防止旧数据被回填
3. 基于 binlog 订阅：通过 Canal 等工具监听 MySQL binlog，异步更新/删除缓存，保证最终一致性
4. 消息队列保证：写数据库后发 MQ 消息，消费者负责删除缓存，失败可重试
