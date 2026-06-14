<!--
 * @Author: humengchuan 531537052@qq.com
 * @Date: 2026-04-11 21:57:25
 * @LastEditors: humengchuan 531537052@qq.com
 * @LastEditTime: 2026-04-15 09:50:31
 * @FilePath: \work-tool\docs-vitepress\src\learn\backend-interview.md
 * @Description:
-->

## 目录

- [后端面试题](#b树与b+树面试题)
  - [B树与B+树](#b树与b+树面试题)
  - [订单未支付过期自动关单](#在电商平台中订单未支付过期如何实现自动关单)
  - [秒杀系统库存预占和回滚](#秒杀系统如何实现库存预占和库存回滚)
  - [秒杀系统设计](#如何设计一个秒杀系统)
  - [Redis应用场景](#redis你项目中的redis主要用来做什么的)
  - [缓存穿透、击穿、雪崩](#采用redis缓存遇到缓存穿透缓存击穿缓存雪崩怎么办)
  - [Redis内存管理](#redis内存使用完了怎么办)
  - [数据库与Redis数据一致性](#如何保证数据库与redis的数据一致性)
  - [RabbitMQ核心组件](#rabbitmq说一说它的核心组件和工作原理)
  - [MySQL查询优化](#mysql查询优化)
- [Node.js面试题](#nodejs面试题)
  - [Node.js优势与运行机制](#nodejs对比其他后端框架的优势)
  - [Node.js异常捕获](#nodejs异常捕获)
  - [nextTick与setImmediate](#nexttick和setimmediate的区别)
  - [yarn与npm](#yarn和npm的区别)
  - [多核CPU利用](#nodejs中如何利用好多核cpu的优势)
  - [EventEmitter模块](#eventemmiterm模块的原理)
  - [文件读取对比](#readfile和createfilestream的区别)
  - [模块加载机制](#require加载其他模块的机制)
  - [exports与module.exports](#模块文件导出写法exportsxxx和moduleexport-xxx-本质区别是什么)
  - [事件循环区别](#浏览器的事件循环和nodejs中的事件循环的区别)
  - [内存使用监控](#nodejs中执行程序时如果查看程序内容使用情况)
  - [垃圾回收机制](#垃圾回收的中老生代和新生代的)
  - [内存泄露](#内存泄露的情况)
  - [密钥与加密](#身份验证中的密钥和加密)
  - [线程与进程](#线程和进程之间的区别)
  - [子进程与集群](#node中如何建立子进程)
  - [集群性能优化](#node中如何通过集群提高程序性能)
  - [异步操作监控](#nodejs中如何监控异步操作的时间)
  - [中间件机制](#nodejs中的中间件作用)
  - [Buffer缓冲区](#nodejs中的缓冲区)
  - [NODE_ENV](#nodeenv是什么)
  - [断点续传大文件上传](#如何实现一个支持断点续传的大文件上传功能)
  - [断点续传大文件下载](#如何实现一个支持断点续传的大文件下载功能)

### b树与b+树面试题

B树与B+树是数据库索引结构的核心知识点，本质区别在于数据存储策略和查询优化方向：B树追求"单次查询最短路径"，而B+树追求"批量查询效率+磁盘I/O优化"，这直接决定了它们在不同数据库中的应用场景

数据存储位置 叶子节点结构
B树：所有节点（根节点、内部节点、叶子节点）均存储完整的键值对（Key-Value数据）
B+树：仅叶子节点存储完整数据，内部节点仅存索引（Key+子节点指针），不存储实际数据

MySQL用B+树而MongoDB用B树
B树和B+树都是基于磁盘的索引结构，区别在于B树存储的是键值对，而B+树存储的是索引。B树和B+树在数据存储位置上有所不同，B树存储的是键值对，而B+树存储的是索引。B树和B+树在数据存储位置上有所不同，B树存储的是键值对，而B+树存储的是索引。B树和B+树在数据存储位置上有所不同，B树存储的是键值对，而B+树存储的是索引

| 对比维度 | B树                        | B+树                       |
| -------- | -------------------------- | -------------------------- |
| 单点查询 | 可能O(1)（非叶子命中）     | 稳定O(log n)（必须到叶子） |
| 范围查询 | 慢（需中序递归）           | 快（链表遍历）             |
| 树高度   | 较高（节点含数据）         | 更低（内部节点纯索引）     |
| 磁盘I/O  | 相对较多                   | 更少（单节点存更多索引）   |
| 典型应用 | MongoDB、Redis（部分场景） | MySQL、Oracle、文件系统    |

**B树与B+树详解答案：**

**1. 为什么MySQL使用B+树而不是B树？**

- B+树的非叶子节点不存储数据，只存储索引，这意味着每个节点可以存储更多的索引键
- B+树的查询更稳定，所有查询都需要到达叶子节点，查询效率更稳定
- B+树更适合范围查询，叶子节点之间通过双向链表连接，可以快速进行范围扫描
- B+树的磁盘I/O次数更少，因为每个节点可以存储更多的索引

**2. B+树的叶子节点之间是如何连接的？**

- B+树的叶子节点之间通过双向链表连接
- 叶子节点包含数据和非叶子节点的所有索引信息
- 叶子节点的第一个元素是最大值，最后一个元素是最小值

**3. B树和B+树的高度如何计算？**

- B树的高度取决于每个节点可以存储多少个键
- B+树的高度通常比B树低，因为内部节点只存储索引
- 假设每个节点可以存储n个键，B树的高度约为log_m((n+1)/2)，B+树的高度约为log_m(n/2)

**4. B+树的插入和删除操作**

- 插入时，如果节点满，需要分裂节点
- 删除时，如果节点太空，需要合并节点
- B+树的维护相对简单，因为数据只存储在叶子节点

### 在电商平台中订单未支付过期如何实现自动关单?

订单未支付过期，一般都是通过定时任务来实现的，定时任务一般会通过 cron 表达式来配置，比如每 5 分钟执行一次，然后通过数据库查询订单状态，如果订单状态是未支付，则进行关单操作。
数据库定时轮询方案 Redis键过期监听方案 RabbitMQ延迟队列方案 时间轮算法

小型系统（日订单<1万）
推荐方案：Redis键过期监听
理由：实现简单，实时性好，资源消耗低，无需维护复杂的消息队列
实施要点：
确保Redis持久化配置
添加事件丢失补偿机制
设置合理的过期时间精度

中大型系统（日订单>1万）
推荐方案：RabbitMQ延迟队列
理由：高并发支持好，实时性强，业务解耦，可靠性高
实施要点：
必须二次判断订单状态：关单前验证订单是否仍为待支付状态，防止用户最后一秒支付被误取消
使用乐观锁更新订单状态，避免并发冲突

特殊场景处理
大促期间：需提前评估系统压力，考虑增加消费者实例或调整队列配置
支付竞争处理：明确规则（通常以支付成功为准），在状态机中固化
超时规则动态调整：支持按订单类型、商品类型、时段灵活配置超时时间
关键实现注意事项：订单状态设计与持久化存储 幂等处理 监控与补偿机制

**订单未支付过期自动关单详解答案：**

**1. 数据库定时轮询方案**

```sql
-- 每5分钟执行一次
SELECT * FROM orders WHERE status = '待支付' AND create_time < DATE_SUB(NOW(), INTERVAL 30 MINUTE)
-- 执行关单操作
UPDATE orders SET status = '已取消' WHERE id = ? AND status = '待支付'
```

优点：实现简单，适合小型系统
缺点：存在延迟，实时性差，频繁数据库查询

**2. Redis键过期监听方案**

```javascript
// 下单时设置过期键
redis.setex(`order:timeout:${orderId}`, 1800, orderId); // 30分钟过期
// 监听过期事件
redis.subscribe("__keyevent@0__:expired", (err, channel, message) => {
  // 处理过期订单
});
```

优点：实时性好，实现简单
缺点：Redis单机模式可能丢失事件，需要开启AOF持久化

**3. RabbitMQ延迟队列方案**

```javascript
// 下单时发送延迟消息
channel.sendToQueue('order_delay_exchange',
  Buffer.from(JSON.stringify({orderId, timeout: 1800})), // 30分钟
  {expiration: 1800000, routingKey: 'order.timeout'}
)
// 消费延迟消息
channel.consume('order_delay_queue', (msg) => {
  // 二次验证订单状态
  const order = await db.orders.findById(orderId)
  if (order.status === '待支付') {
    await cancelOrder(orderId)
  }
})
```

优点：高并发支持好，可靠性高，支持消息持久化
缺点：需要维护RabbitMQ集群

**4. 时间轮算法**

- 适用于高精度定时任务，如Netflix的 hollow 库
- 将定时器组织成环形队列，每格代表一个时间单位
- 利用Redis的Sorted Set实现时间轮

**5. 幂等处理方案**

```sql
-- 使用状态机+乐观锁
UPDATE orders
SET status = '已取消', version = version + 1
WHERE id = ? AND status = '待支付' AND version = ?
-- 影响行数为0说明已被处理
```

### 秒杀系统如何实现库存预占和库存回滚?

秒杀系统实现库存预占和库存回滚，一般都是通过数据库来实现的，通过数据库的锁机制来实现的。
锁机制：数据库锁、分布式锁、乐观锁

**秒杀系统库存预占和回滚详解答案：**

**1. 数据库乐观锁方案**

```sql
-- 预占库存（乐观锁）
UPDATE inventory SET stock = stock - quantity, version = version + 1
WHERE product_id = ? AND stock >= quantity AND version = ?

-- 回滚库存
UPDATE inventory SET stock = stock + quantity, version = version + 1
WHERE product_id = ? AND version = ?
```

**2. Redis预减库存+Lua原子操作**

```lua
-- Lua脚本保证原子性
local stock = redis.call('GET', KEYS[1])
if tonumber(stock) < tonumber(ARGV[1]) then
    return 0
end
redis.call('DECRBY', KEYS[1], ARGV[1])
return 1
```

**3. 分布式锁方案（Redisson）**

```java
RLock lock = redisson.getLock("seckill:lock:" + productId);
try {
    lock.lock(10, TimeUnit.SECONDS);
    // 预占库存逻辑
    if (inventoryService.reserve(productId, quantity)) {
        // 发送消息到消息队列
        mqProducer.send("seckill:topic", orderMessage);
    }
} finally {
    lock.unlock();
}
```

**4. 库存回滚场景**

- 订单取消时回滚库存
- 支付超时未支付回滚库存
- 库存预占超时回滚

```java
@Scheduled(cron = "0 */5 * * * ?")
public void rollbackExpiredStock() {
    // 查询超时预占的订单
    List<Order> expiredOrders = orderService.findExpiredOrders();
    for (Order order : expiredOrders) {
        inventoryService.rollbackStock(order.getProductId(), order.getQuantity());
    }
}
```

**5. 防超卖关键点**

- Redis+Lua保证原子扣减
- 数据库唯一键约束防止重复扣减
- 库存字段设置unsigned，扣成负数会报错
- 消息队列异步化，削峰填谷

### 如何设计一个秒杀系统?

流量分层过滤、读写分离、一致性优先、异步削峰、全链路兜底为核心原则，通过Redis+Lua原子操作防超卖、Sentinel+令牌桶限流、消息队列异步化等技术组合，实现高并发下的稳定性与数据一致性

**秒杀系统设计详解答案：**

**1. 整体架构图**

```
用户请求 → CDN → Nginx → Gateway → 限流层 → 秒杀服务 → Redis库存预减 → 消息队列 → 订单服务 → 数据库
```

**2. 核心设计原则**

- 流量分层过滤：CDN缓存静态资源，Nginx层做限流，网关层做身份验证
- 读写分离：秒杀商品读多写少，使用Redis缓存热点数据
- 一致性优先：库存操作必须保证强一致性，不能超卖
- 异步削峰：下单操作异步化，通过消息队列缓解数据库压力
- 全链路兜底：每个层级都要有降级和熔断方案

**3. 关键技术方案**

**限流方案（Sentinel令牌桶）**

```java
@Configuration
public class SentinelConfig {
    @Bean
    public RuleManager ruleManager() {
        return new RuleManager();
    }
}

// 接口限流
@SentinelResource(value = "seckill", blockHandler = "blockHandler")
public Result seckill(Long productId) {
    // 秒杀逻辑
}
```

**防超卖（Redis+Lua）**

```lua
-- secKill.lua
local stock = redis.call('GET', 'seckill:stock:' .. KEYS[1])
if tonumber(stock) < tonumber(ARGV[1]) then
    return 0
end
redis.call('DECRBY', 'seckill:stock:' .. KEYS[1], ARGV[1])
redis.call('SADD', 'seckill:ordered:' .. KEYS[1], ARGV[2])
return 1
```

**消息队列异步化（RabbitMQ）**

```java
// 生产者
public void sendSeckillOrder(OrderMessage message) {
    rabbitTemplate.convertAndSend("seckill.exchange", "seckill.order", message);
}

// 消费者
@RabbitListener(queues = "seckill.order.queue")
public void handleSeckillOrder(OrderMessage message) {
    // 创建订单
    orderService.createOrder(message);
    // 扣减库存
    inventoryService.decreaseStock(message.getProductId(), message.getQuantity());
}
```

**4. 核心流程**

1. 秒杀开始前，将库存同步到Redis
2. 用户请求先到Nginx进行负载均衡
3. 网关层进行限流、身份校验、黑名单过滤
4. Redis预减库存，如果库存不足直接返回
5. 发送秒杀成功消息到消息队列
6. 异步创建订单，落库到MySQL
7. 订单超时未支付则回滚库存

**5. 高可用保障**

- 限流：Sentinel令牌桶，限制QPS
- 熔断：Sentinel熔断策略，避免雪崩
- 降级：Redis宕机时，降级到数据库
- 补偿：定时任务补偿未处理的订单
- 幂等：订单号唯一性约束，防止重复下单

**6. 关键配置**

```yaml
seckill:
  thread-pool-size: 100
  max-qps: 10000
  order-timeout: 900 # 15分钟
  stock-sync-interval: 300 # 5分钟同步一次库存
```

### Redis，你项目中的Redis主要用来做什么的？

Redis使用场景：缓存 分布式锁 Token存储 短信验证码存储 计数器

全局唯一id 排行榜 限流 购物车 点赞关注

分布式Session 发布订阅 延迟队列 消息队列

**Redis使用场景详解答案：**

**1. 缓存**

```javascript
// String缓存
redis.setex("user:info:" + userId, 3600, JSON.stringify(userData));
// Hash缓存
redis.hset("product:info", productId, JSON.stringify(productData));
```

**2. 分布式锁（Redisson）**

```javascript
const Redlock = require("redlock");
const lock = await redlock.acquire(["resource:lock"], 30000);
try {
  // 业务逻辑
} finally {
  await lock.release();
}
```

**3. Token存储（JWT）**

```javascript
// 存储Token
redis.setex("token:" + token, 7200, userId);
// 验证Token
const userId = await redis.get("token:" + token);
```

**4. 全局唯一ID**

```javascript
// 使用Redis INCR
const id = await redis.incr("global:id:order");
// 时间戳 + 自增ID
const id = Date.now() + "" + (await redis.incr("global:id"));
```

**5. 排行榜（Sorted Set）**

```javascript
// 添加分数
redis.zadd("ranking:product", score, productId);
// 获取排名
redis.zrevrank("ranking:product", productId);
// 获取Top N
redis.zrevrange("ranking:product", 0, 9);
```

**6. 延迟队列**

```javascript
// 生产者
redis.zadd("delay:queue", timestamp, JSON.stringify(data));
// 消费者
const now = Date.now();
const jobs = await redis.zrangebyscore("delay:queue", 0, now);
```

### 采用Redis缓存，遇到缓存穿透、缓存击穿、缓存雪崩怎么办?

缓存穿透解决办法：缓存空结果；限制ip访问次数（express-rate-limit）；过滤器（增加一个中间层，例如布隆过滤器）

缓存击穿：初始化的时候没有缓存的时候，或者缓存刚刚失效的短时间内，进行大量请求

解决：热点数据，永远不设置过期，更新数据采用另外的线层来更新

**缓存穿透、击穿、雪崩详解答案：**

**1. 缓存穿透（查询不存在的数据）**

- 现象：大量请求查询不存在的数据，穿透到数据库
- 危害：数据库压力剧增，可能被拖垮

解决方案：

```javascript
// 方案1：缓存空结果
if (result === null) {
  redis.setex("cache:null:" + key, 300, "null"); // 缓存空值5分钟
} else {
  redis.setex(key, 3600, JSON.stringify(result));
}

// 方案2：布隆过滤器
const BloomFilter = require("bloom-filters");
const bloom = BloomFilter.load("./bloom.json");

// 添加商品ID到布隆过滤器
bloom.add(productId);

// 查询前先检查布隆过滤器
if (!bloom.has(productId)) {
  return "商品不存在";
}
```

**2. 缓存击穿（热点key失效瞬间）**

- 现象：某个热点key过期瞬间，大量并发请求同时查询数据库
- 危害：数据库瞬时压力过大

解决方案：

```javascript
// 方案1：互斥锁
const lock = await redis.set("lock:" + key, 1, "EX", 10, "NX");
if (lock) {
  const result = await db.query(key);
  redis.setex(key, 3600, JSON.stringify(result));
  redis.del("lock:" + key);
  return result;
} else {
  // 等待后重试
  await sleep(100);
  return redis.get(key);
}

// 方案2：热点数据永不过期
// 使用额外线程异步更新缓存，而不是设置过期时间
```

**3. 缓存雪崩（大量key同时过期）**

- 现象：大量缓存key同时过期，导致大量请求打到数据库
- 危害：数据库压力剧增，甚至宕机

解决方案：

```javascript
// 方案1：随机过期时间
const expireTime = baseTime + Math.random() * 300; // 基础时间+随机0-5分钟

// 方案2：二级缓存
const L1Cache = new NodeCache(); // 本地缓存
const L2Cache = redis; // Redis缓存

// 方案3：限流降级
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 60000,
  max: 100,
  message: "请求过于频繁",
});

// 方案4：Redis高可用集群
// 搭建Redis Sentinel或Redis Cluster
```

缓存雪崩：Redis要高可用(搭建Redis Sentinel或者Redis Cluster集群)，避免Redis不可用；

给不同的key设置不同的过期时间；本地缓存(二级缓存)+限流&降级，避免数据库被压垮

### Redis内存使用完了怎么办?

配置redis.conf设置内存的大小；设置淘汰策略。

**Redis内存管理详解答案：**

**1. 设置内存大小**

```bash
# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru
```

**2. 淘汰策略详解**
| 策略 | 说明 |
|------|------|
| noeviction | 不淘汰，返回错误（默认） |
| volatile-lru | 从过期key中淘汰LRU |
| allkeys-lru | 从所有key中淘汰LRU |
| volatile-random | 从过期key中随机淘汰 |
| allkeys-random | 从所有key中随机淘汰 |
| volatile-ttl | 淘汰TTL最小的key |

**3. 内存优化策略**

```javascript
// 1. 压缩数据
redis.set("key", JSON.stringify(data)); // 改为压缩
redis.set("key", Gzip.compress(JSON.stringify(data)));

// 2. 合理设置过期时间
// 根据数据热度设置不同的过期时间
// 热点数据：较长过期时间
// 冷数据：较短过期时间

// 3. 使用合适的数据结构
// 大量数据用Hash代替String
// 排行榜使用Sorted Set

// 4. 监控内存使用
redis.info("memory");
```

### 如何保证数据库与Redis的数据一致性?

在数据库发生增删改的时候，数据库的数据要和Redis缓存的数据保持一致性;

双写一致性保障

采用"先删除再插入"的方式来更新缓存，即先删除 Redis 中的相关数据，然后再更新数据库。这样做的好处是可以避免旧数据覆盖新数据的问题。

**数据库与Redis数据一致性详解答案：**

**1. Cache Aside（旁路缓存）**

```javascript
// 读操作
async function getUser(id) {
  const cache = await redis.get("user:" + id);
  if (cache) return JSON.parse(cache);

  const user = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  await redis.setex("user:" + id, 3600, JSON.stringify(user));
  return user;
}

// 写操作
async function updateUser(id, data) {
  await db.query("UPDATE users SET ? WHERE id = ?", [data, id]);
  await redis.del("user:" + id); // 先删除缓存
}
```

**2. Read/Write Through（读写穿透）**

```javascript
// 应用只操作缓存，由缓存服务同步更新数据库
class CacheService {
  async get(key) {
    let data = await redis.get(key);
    if (!data) {
      data = await db.query(key);
      await redis.setex(key, 3600, data);
    }
    return data;
  }

  async set(key, value) {
    await redis.setex(key, 3600, value);
    await db.update(key, value); // 缓存服务同步更新数据库
  }
}
```

**3. Write Behind（异步写入）**

```javascript
// 更新缓存，异步批量更新数据库
async function updateUser(id, data) {
  await redis.setex("user:" + id, 3600, JSON.stringify(data));
  await queue.push("update:user", { id, data }); // 写入消息队列
}

// 消费消息批量更新数据库
async function processQueue() {
  const batch = await queue.pop(100);
  await db.batchUpdate(batch);
}
```

**4. 延时双删策略**

```javascript
async function updateUser(id, data) {
  // 1. 先删除缓存
  await redis.del("user:" + id);
  // 2. 更新数据库
  await db.query("UPDATE users SET ? WHERE id = ?", [data, id]);
  // 3. 延时再删除缓存（确保并发请求的旧数据被清除）
  setTimeout(async () => {
    await redis.del("user:" + id);
  }, 1000);
}
```

**5. 分布式锁保证一致性**

```javascript
async function updateUserWithLock(id, data) {
  const lock = await redis.set("lock:user:" + id, 1, "EX", 10, "NX");
  if (!lock) throw new Error("获取锁失败");

  try {
    await db.query("UPDATE users SET ? WHERE id = ?", [data, id]);
    await redis.del("user:" + id);
  } finally {
    await redis.del("lock:user:" + id);
  }
}
```

**6. 方案对比**
| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| Cache Aside | 简单，低延迟 | 可能短暂不一致 | 大多数场景 |
| Read/Write Through | 数据一致性好 | 实现复杂 | 强一致性要求 |
| Write Behind | 性能最好 | 可能丢数据 | 写多读少 |
| 延时双删 | 解决并发问题 | 有延迟 | 高并发场景 |

### RabbitMQ，说一说它的核心组件和工作原理

**RabbitMQ核心组件和工作原理详解答案：**

**1. 核心概念**
| 组件 | 说明 |
|------|------|
| Producer | 消息生产者 |
| Consumer | 消息消费者 |
| Exchange | 交换机，路由消息 |
| Queue | 队列，存储消息 |
| Binding | 绑定，连接Exchange和Queue |
| Channel | 通道，AMQP连接中的虚拟连接 |

**2. Exchange类型**

```javascript
// Direct Exchange - 精确匹配
channel.assertExchange("direct_exchange", "direct", { durable: true });
channel.bindQueue("queue1", "direct_exchange", "routing_key");

// Fanout Exchange - 广播，所有绑定的队列都收到
channel.assertExchange("fanout_exchange", "fanout", { durable: true });
channel.bindQueue("queue1", "fanout_exchange", "");
channel.bindQueue("queue2", "fanout_exchange", "");

// Topic Exchange - 通配符匹配
channel.assertExchange("topic_exchange", "topic", { durable: true });
channel.bindQueue("queue1", "topic_exchange", "order.*");
channel.bindQueue("queue2", "topic_exchange", "order.created");

// Headers Exchange - 根据消息头匹配
channel.assertExchange("headers_exchange", "headers", { durable: true });
channel.bindQueue("queue1", "headers_exchange", "", {
  match: "all",
  type: "vip",
});
```

**3. 工作流程**

```
Producer → Exchange → Binding → Queue → Consumer
              ↓
           Routing Key
```

**4. 消息确认机制**

```javascript
// 生产者确认
channel.confirmPublish();

// 消费者手动确认
channel.consume(
  "my_queue",
  (msg) => {
    const content = msg.content.toString();
    try {
      // 业务处理
      channel.ack(msg); // 确认消息
    } catch (e) {
      channel.nack(msg, false, true); // 拒绝消息，重新入队
    }
  },
  { noAck: false },
);
```

**5. 持久化配置**

```javascript
// 队列持久化
channel.assertQueue("durable_queue", { durable: true });

// 消息持久化
channel.sendToQueue("queue", Buffer.from("message"), {
  persistent: true,
  deliveryMode: 2,
});

// Exchange持久化
channel.assertExchange("durable_exchange", "direct", { durable: true });
```

**6. 延迟队列实现**

```javascript
// 使用死信队列实现延迟
channel.assertExchange("delay_exchange", "direct", { durable: true });
channel.assertQueue("delay_queue", {
  durable: true,
  arguments: {
    "x-dead-letter-exchange": "real_exchange", // 死信交换机
    "x-dead-letter-routing-key": "real_key",
    "x-message-ttl": 30000, // 30秒延迟
  },
});
```

**7. 消息顺序性保障**

- 单线程消费保证顺序
- 使用消息序列号
- 并发控制：同一key的消息路由到同一队列

### mysql查询优化

①首先优化本身，优化sql语句：避免使用一些缺陷语句，SELECT\*；避免子查询，使用JOIN代替；避免使用OR查询；避免使用!= 或者<>操作符，使用IN代替；避免使用%开通的LIKE查询

②索引优化 更新频繁的慎用索引；查询条件和连接条件列上建立索引；正确使用联合索引

③其他优化 分页优化，排序优化，分组查询， 分库分表；批量插入；多级缓存

**MySQL查询优化详解答案：**

**1. SQL语句优化**

```sql
-- 避免SELECT *
SELECT id, name, email FROM users WHERE id = 1

-- 避免OR，用IN代替
SELECT * FROM orders WHERE status = 'paid' OR status = 'shipped'
-- 改为
SELECT * FROM orders WHERE status IN ('paid', 'shipped')

-- 避免 != 和 <>，用 > 或 < 代替
SELECT * FROM products WHERE price <> 100
-- 改为
SELECT * FROM products WHERE price > 100 OR price < 100

-- 避免前置通配符的LIKE
SELECT * FROM products WHERE name LIKE '%手机%' -- 无法使用索引
-- 改为
SELECT * FROM products WHERE name LIKE '手机%' -- 可以使用索引

-- 使用EXPLAIN分析查询
EXPLAIN SELECT * FROM orders WHERE user_id = 1
```

**2. 索引优化**

```sql
-- 创建单列索引
CREATE INDEX idx_user_id ON orders(user_id)

-- 创建联合索引（遵循最左前缀原则）
CREATE INDEX idx_user_status ON orders(user_id, status)

-- 创建索引的注意事项
-- 1. WHERE条件和JOIN条件列上建立索引
-- 2. 联合索引顺序：区分度高的列放前面
-- 3. 避免在索引列上使用函数
SELECT * FROM orders WHERE YEAR(create_time) = 2024 -- 无法使用索引
-- 改为
SELECT * FROM orders WHERE create_time >= '2024-01-01' AND create_time < '2025-01-01'

-- 删除不用的索引
ALTER TABLE orders DROP INDEX idx_old_index
```

**3. 分页优化**

```sql
-- 深度分页问题
SELECT * FROM orders ORDER BY id LIMIT 1000000, 10 -- 非常慢

-- 优化方案1：使用ID范围
SELECT * FROM orders WHERE id > 1000000 ORDER BY id LIMIT 10

-- 优化方案2：使用子查询
SELECT * FROM orders ORDER BY id LIMIT 10 OFFSET (SELECT COUNT(*) FROM orders WHERE id < (SELECT id FROM orders ORDER BY id LIMIT 1000000, 1)))

-- 优化方案3：使用延迟关联
SELECT o.* FROM orders o
INNER JOIN (SELECT id FROM orders ORDER BY id LIMIT 1000000, 10) t
ON o.id = t.id
```

**4. 排序优化**

```sql
-- 创建索引优化排序
CREATE INDEX idx_status_created ON orders(status, created_at)

-- 避免filesort
-- 坏的查询
SELECT * FROM orders ORDER BY status, created_at DESC -- DESC和ASC混用无法使用索引
-- 好的查询
SELECT * FROM orders ORDER BY status ASC, created_at DESC
```

**5. 分库分表**

```sql
-- 水平分表：将大表按ID范围拆分
CREATE TABLE orders_2024 LIKE orders
CREATE TABLE orders_2025 LIKE orders

-- 垂直分表：将大字段分离
ALTER TABLE orders DROP COLUMN description
CREATE TABLE orders_description (
  order_id BIGINT PRIMARY KEY,
  description TEXT
)
```

**6. 批量插入优化**

```sql
-- 单条插入（慢）
INSERT INTO users VALUES (1, '张三')
INSERT INTO users VALUES (2, '李四')

-- 批量插入（快）
INSERT INTO users VALUES (1, '张三'), (2, '李四'), (3, '王五')

-- 使用LOAD DATA INFILE（最快）
LOAD DATA INFILE '/tmp/users.csv'
INTO TABLE users
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
```

### Node.js面试题

### node.js对比其他后端框架的优势？

高并发、异步非阻塞IO， 单线程

什么叫非阻塞IO：系统在接收输入，再到输出的过程中，能不能接收其他的输入。

### node.js的运行机制

**Node.js运行机制详解答案：**

**1. Node.js事件循环**

```
   ┌───────────────────────────────┐
   │           timers               │  setTimeout, setInterval
   │  (pending callbacks)            │  I/O callbacks
   │      idle, prepare             │  internal
   │          poll                  │  retrieve new I/O events
   │          check                │  setImmediate callbacks
   │     close callbacks            │  socket.on('close')
   └───────────────────────────────┘
```

**2. 核心流程**

```javascript
// 1. 同步代码执行
// 2. 异步任务入队
// 3. 执行所有同步代码
// 4. 执行process.nextTick的回调
// 5. 执行setImmediate的回调
// 6. 进入事件循环
```

**3. 宏任务与微任务**

```javascript
setTimeout(() => console.log("setTimeout"), 0);
setImmediate(() => console.log("setImmediate"));
process.nextTick(() => console.log("nextTick"));

Promise.resolve().then(() => console.log("Promise"));

// 执行顺序：
// nextTick → Promise → setTimeout → setImmediate
```

**4. 事件循环阶段**

```javascript
// timers阶段 - 执行setTimeout和setInterval回调
// pending callbacks阶段 - 执行延迟的I/O回调
// idle, prepare阶段 - 内部使用
// poll阶段 - 获取新的I/O事件，停留此处直到达时间戳
// check阶段 - 执行setImmediate回调
// close callbacks阶段 - 执行关闭回调
```

### node.js异常捕获

**Node.js异常捕获详解答案：**

**1. 同步代码异常捕获**

```javascript
try {
  const result = JSON.parse("invalid json");
} catch (err) {
  console.error("解析错误:", err.message);
}
```

**2. 异步异常捕获**

```javascript
// Promise错误捕获
Promise.resolve()
  .then(() => {
    throw new Error("async error");
  })
  .catch((err) => console.error(err));

// async/await错误捕获
async function fetchData() {
  try {
    const result = await someAsyncOperation();
  } catch (err) {
    console.error(err);
  }
}
```

**3. 进程级异常捕获**

```javascript
// 监听未捕获的异常
process.on("uncaughtException", (err) => {
  console.error("未捕获的异常:", err);
  // 记录日志后优雅退出
  process.exit(1);
});

// 监听未处理的Promise拒绝
process.on("unhandledRejection", (reason, promise) => {
  console.error("未处理的Promise拒绝:", reason);
});
```

**4. 域名错误**

```javascript
// 不要在unhandledRejection中继续执行
process.on("unhandledRejection", (reason, promise) => {
  // 应该有日志记录和监控报警
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
```

### NodeJS的包管理器

### nextTick和setImmediate的区别

**nextTick和setImmediate区别详解答案：**

**1. 概念对比**
| 特性 | process.nextTick | setImmediate |
|------|-----------------|--------------|
| 所属阶段 | 任意阶段优先执行 | check阶段执行 |
| 执行顺序 | 优先于微任务和宏任务 | 在poll阶段之后 |
| 使用场景 | 递归调用、尽早执行 | I/O回调后处理 |
| 性能影响 | 可能阻塞事件循环 | 更安全 |

**2. 执行顺序**

```javascript
process.nextTick(() => console.log("nextTick"));
setImmediate(() => console.log("setImmediate"));
Promise.resolve().then(() => console.log("Promise"));

// 输出顺序：
// nextTick → Promise → setImmediate
```

**3. 实际应用**

```javascript
// nextTick适用：确保回调在下一个事件循环迭代前执行
class Stream {
  constructor() {
    this.cache = [];
  }

  write(data) {
    this.cache.push(data);
    process.nextTick(() => this.flush());
  }
}

// setImmediate适用：I/O操作后的清理
fs.readFile("file.txt", (err, data) => {
  setImmediate(() => processFile(data));
});
```

### yarn和npm的区别

**yarn和npm区别详解答案：**

**1. 核心区别**
| 特性 | npm | yarn |
|------|-----|------|
| 安装速度 | 较慢 | 快（并行下载） |
| 锁文件 | package-lock.json | yarn.lock |
| 命令 | npm install | yarn install |
| 删除依赖 | npm uninstall | yarn remove |
| 全局安装 | npm install -g | yarn global add |
| 离线安装 | 不支持 | 支持（缓存） |

**2. yarn优势**

```bash
# yarn.lock确保版本一致
# 离线缓存安装
yarn --offline
# 只安装dependencies
yarn --prod
# 扁平化依赖
yarn --flat
```

**3. npm改进**

```bash
# npm 7+ 支持workspaces
# npm ci 快速安装
# npm audit 安全审计
```

### nodejs中如何利用好多核CPU的优势

**Node.js多核CPU利用详解答案：**

**1. 集群模式（Cluster）**

```javascript
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  // 主进程创建工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // 重新启动
  });
} else {
  // 工作进程运行服务器
  http
    .createServer((req, res) => {
      res.end(`Handled by worker ${process.pid}`);
    })
    .listen(3000);
}
```

**2. PM2负载均衡**

```bash
# 启动集群模式
pm2 start app.js -i max

# 0表示自动根据CPU核心数启动
pm2 start app.js -i 0
```

**3. 进程间通信**

```javascript
// 主进程发送消息
if (cluster.isMaster) {
  const worker = cluster.fork();
  worker.send({ type: "task", data: "xxx" });
}

// 工作进程接收消息
if (!cluster.isMaster) {
  process.on("message", (msg) => {
    console.log("Received:", msg);
  });
}
```

**4. child_process模块**

```javascript
const { spawn } = require("child_process");

// 启动子进程
const child = spawn("node", ["worker.js"]);

child.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

child.on("close", (code) => {
  console.log(`子进程退出，code: ${code}`);
});
```

});

### eventEmmiter模块的原理

### node事件驱动， eventEmmiter.on()

**EventEmitter模块原理详解答案：**

**1. 基本使用**

```javascript
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

const emitter = new MyEmitter();

// 监听事件
emitter.on("event", (arg1, arg2) => {
  console.log("event fired", arg1, arg2);
});

// 触发事件
emitter.emit("event", "param1", "param2");
```

**2. 核心原理**

```javascript
class EventEmitter {
  constructor() {
    this.events = {}; // 存储事件和回调
  }

  on(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
    return this;
  }

  emit(eventName, ...args) {
    const listeners = this.events[eventName];
    if (listeners) {
      listeners.forEach((listener) => listener.apply(this, args));
    }
    return this;
  }

  off(eventName, listener) {
    const listeners = this.events[eventName];
    if (listeners) {
      this.events[eventName] = listeners.filter((l) => l !== listener);
    }
    return this;
  }
}
```

**3. 常用方法**

```javascript
// once - 只执行一次
emitter.once("single", () => console.log("只执行一次"));

// removeListener - 移除监听
emitter.removeListener("event", callback);

// removeAllListeners - 移除所有监听
emitter.removeAllListeners("event");

// 获取监听数量
emitter.listenerCount("event");

// 获取所有监听器
emitter.listeners("event");
```

### readFile和createFileStream的区别

**readFile和createReadStream区别详解答案：**

**1. readFile（异步读取整个文件）**

```javascript
const fs = require("fs");

// 异步读取 - 一次性加载到内存
fs.readFile("large-file.txt", "utf8", (err, data) => {
  console.log(data.length);
});

// 同步读取 - 阻塞主线程
const data = fs.readFileSync("file.txt", "utf8");

// Promise版本
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const data = await readFile("file.txt", "utf8");
```

**2. createReadStream（流式读取）**

```javascript
const fs = require("fs");
const readStream = fs.createReadStream("large-file.txt", {
  encoding: "utf8",
  highWaterMark: 64 * 1024, // 64KB chunks
  start: 0,
  end: 1000,
});

let total = 0;
readStream.on("data", (chunk) => {
  total += chunk.length;
  console.log(`读取了 ${chunk.length} bytes`);
});

readStream.on("end", () => {
  console.log(`总共 ${total} bytes`);
});

readStream.on("error", (err) => {
  console.error(err);
});
```

**3. 核心区别**
| 特性 | readFile | createReadStream |
|------|----------|------------------|
| 内存使用 | 全部加载到内存 | 分块加载 |
| 适用场景 | 小文件 | 大文件 |
| 性能 | 大文件会占满内存 | 内存占用稳定 |
| 可中断 | 不可中断 | 可通过pause/resume控制 |

**4. 实际应用场景**

```javascript
// readFile适合：配置文件、小型JSON
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

// createReadStream适合：日志处理、文件上传、大文件传输
const http = require("http");
http.createServer((req, res) => {
  const stream = fs.createReadStream("large-file.txt");
  stream.pipe(res); // 流式响应
});
```

### require加载其他模块的机制

**require模块加载机制详解答案：**

**1. 模块分类**

```javascript
// 核心模块（Node.js内置）
const fs = require("fs");
const http = require("http");
const path = require("path");

// 文件模块（项目中的文件）
const myModule = require("./myModule");
const myModule = require("../utils/myModule");

// 第三方模块
const express = require("express");
const axios = require("axios");
```

**2. 加载顺序**

```
1. 缓存中的模块（require.cache）
2. 核心模块
3. 文件模块（./ 或 ../ 开头）
4. 第三方模块（node_modules目录）
```

**3. 加载流程**

```javascript
// 1. 解析模块路径
// 2. 判断模块类型
// 3. 加载模块代码
// 4. 返回module.exports
```

**4. 模块缓存**

```javascript
// 第一次加载会缓存
const a = require("./a"); // 执行一次
const b = require("./a"); // 使用缓存，不重新执行

// 清除缓存
delete require.cache[require.resolve("./a")];
```

**5. 循环引用处理**

```javascript
// a.js
console.log("a开始");
exports.done = false;
const b = require("./b");
console.log("a完成", b.done);

// b.js
console.log("b开始");
exports.done = false;
const a = require("./a");
console.log("b完成", a.done);

// 输出顺序：
// a开始 → b开始 → b完成 → a完成
// 循环引用时，已加载部分可用
```

### 模块文件导出写法exports.xxx=xxx 和module.export = xxx 本质区别是什么

**exports和module.exports区别详解答案：**

**1. 本质关系**

```javascript
// exports是指向module.exports的引用
// 初始状态：exports = module.exports = {}

// 错误写法：断开引用
exports = { name: "test" }; // 断开与module.exports的联系

// 正确写法：添加属性
exports.name = "test"; // 通过exports添加属性到module.exports

// 完全替换（常用）
module.exports = class MyClass {};
module.exports = { name: "test" };
```

**2. 常见误区**

```javascript
// 误区1：同时使用
exports.name = "a";
module.exports = { age: 20 }; // module.exports会覆盖exports

// 误区2：重新赋值exports
exports = { name: "test" }; // 无效，模块返回的是module.exports
module.exports = { name: "test" }; // 有效
```

**3. 最佳实践**

```javascript
// 导出单个函数或类
module.exports = function () {};

// 导出多个属性
module.exports = {
  name: "test",
  doSomething: () => {},
};

// 导出多个属性（使用exports）
exports.name = "test";
exports.doSomething = () => {};
```

### 浏览器的事件循环和nodejs中的事件循环的区别

**浏览器与Node.js事件循环区别详解答案：**

**1. 核心区别**
| 特性 | 浏览器 | Node.js |
|------|--------|---------|
| 微任务队列 | 一个（Promise） | 两个（nextTick和其他） |
| 宏任务队列 | 多个 | 多个（按阶段区分） |
| 执行顺序 | 微任务优先于宏任务 | nextTick优先于其他微任务 |

**2. 浏览器事件循环**

```
用户交互 → setTimeout → requestAnimationFrame → I/O → 渲染
                ↓
         微任务队列（Promise）
                ↓
         宏任务队列（setTimeout, setInterval）
```

**3. Node.js事件循环**

```
   timers（setTimeout, setInterval）
        ↓
  pending callbacks
        ↓
  idle, prepare（内部使用）
        ↓
      poll（I/O回调）
        ↓
     check（setImmediate）
        ↓
  close callbacks
```

**4. 执行顺序对比**

```javascript
// 浏览器中
setTimeout(() => console.log("setTimeout"), 0);
Promise.resolve().then(() => console.log("Promise"));

// 浏览器输出：Promise → setTimeout

// Node.js中
setTimeout(() => console.log("setTimeout"), 0);
process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("Promise"));

// Node.js输出：nextTick → Promise → setTimeout
```

**5. Node.js特有的阶段**

```javascript
// setImmediate在check阶段执行
// setTimeout在timers阶段执行
fs.readFile("file.txt", () => {
  setTimeout(() => console.log("setTimeout"), 0);
  setImmediate(() => console.log("setImmediate"));
});

// I/O回调中，setImmediate优先于setTimeout
```

### nodejs中执行程序时，如果查看程序内容使用情况

**Node.js程序内存使用查看方法详解答案：**

**1. 基础内存查看**

```javascript
// 查看整体内存使用
console.log(process.memoryUsage());
// 输出：
// {
//   rss: 24MB,      // 进程常驻内存
//   heapTotal: 6MB, // V8堆内存总量
//   heapUsed: 4MB,   // V8堆内存使用量
//   external: 2MB   // C++对象内存
// }

// 查看系统内存
const os = require("os");
console.log(os.freemem()); // 空闲内存
console.log(os.totalmem()); // 总内存
```

**2. 内存分析工具**

```bash
# 使用--inspect启动调试
node --inspect app.js

# 使用Chrome DevTools分析堆内存
# 1. 访问 chrome://inspect
# 2. 点击Memory标签
# 3. 选择Heap Snapshot
```

**3. 内存泄漏检测**

```javascript
// 定期记录内存使用
setInterval(() => {
  const mem = process.memoryUsage();
  console.log({
    heapUsed: Math.round(mem.heapUsed / 1024 / 1024) + "MB",
    heapTotal: Math.round(mem.heapTotal / 1024 / 1024) + "MB",
  });
}, 60000);
```

**4. 常见内存问题**

```javascript
// 问题1：全局变量泄漏
global.data = []; // 不要这样做
// 解决：及时清理或使用局部变量

// 问题2：闭包引用
function createLeak() {
  const largeArray = new Array(1000000);
  return () => largeArray; // 闭包持有引用
}

// 问题3：事件监听器未移除
emitter.on("event", handler); // 添加监听
emitter.removeListener("event", handler); // 及时移除
```

### 垃圾回收的中老生代和新生代的

**V8垃圾回收机制详解答案：**

**1. 分代垃圾回收**

```javascript
// V8将内存分为新生代和老生代
// 新生代：存活时间短的对象（1-8MB）
// 老生代：存活时间长的对象（无限大）
```

**2. 新生代垃圾回收（Scavenge）**

```
from空间 ← 新创建的对象
to空间   ← 正在使用的空间

1. 检查from空间中的对象
2. 存活对象复制到to空间
3. 清空from空间
4. 交换from和to空间
```

**3. 老生代垃圾回收（Mark-Sweep & Mark-Compact）**

```javascript
// 标记阶段（Mark）
// 遍历所有对象，标记活动对象

// 清除阶段（Sweep）
// 清扫未标记的对象，释放内存

// 整理阶段（Compact）
// 整理存活对象，解决内存碎片问题
```

**4. 垃圾回收优化**

```javascript
// 1. 避免全局变量
// 2. 及时解除引用
let obj = { large: new Array(10000) };
obj = null; // 解除引用

// 3. 慎用闭包
// 4. 使用WeakMap/WeakSet
const weakMap = new WeakMap();
weakMap.set(obj, "data"); // obj被回收时自动清除
```

### 内存泄露的情况

**内存泄露详解答案：**

**1. 常见内存泄露场景**

```javascript
// 场景1：全局变量
global.data = new Array(1000000); // 永不回收

// 场景2：闭包
function createLeak() {
  const bigData = new Array(1000000);
  return () => bigData; // 闭包引用
}

// 场景3：未移除的事件监听
server.on("request", handler); // 不断添加监听
// 解决：server.removeListener('request', handler)

// 场景4：定时器未清除
setInterval(() => {
  // 每次创建新对象但不清理
}, 1000);
// 解决：clearInterval(id)

// 场景5：缓存未清理
const cache = new Map();
function getData(key) {
  if (!cache.has(key)) {
    cache.set(key, loadFromDB(key));
  }
  return cache.get(key);
}
// 解决：cache.size > 1000 && cache.clear()
```

**2. 内存泄露检测方法**

```bash
# 1. Node.js内置堆内存分析
node --expose-gc app.js

# 2. 使用heapdump
const heapdump = require('heapdump')
heapdump.writeSnapshot('./heapdump.heapsnapshot')

# 3. 使用Chrome DevTools
# 启动：node --inspect app.js
# 打开chrome://inspect
```

**3. 避免内存泄露的最佳实践**

```javascript
// 1. 使用let/const代替全局变量
// 2. 及时移除事件监听
// 3. 清理定时器
// 4. 使用WeakMap/WeakSet
// 5. 定期清理缓存
// 6. 使用对象池复用对象
```

### 身份验证中的密钥和加密

**密钥和加密详解答案：**

**1. 对称加密（AES）**

```javascript
const crypto = require("crypto");

// 加密
const key = crypto.randomBytes(32); // 256位密钥
const iv = crypto.randomBytes(16); // 初始向量
const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
let encrypted = cipher.update("sensitive data", "utf8", "hex");
encrypted += cipher.final("hex");

// 解密
const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
let decrypted = decipher.update(encrypted, "hex", "utf8");
decrypted += decipher.final("utf8");
```

**2. 非对称加密（RSA）**

```javascript
const { generateKeyPairSync } = crypto;

// 生成密钥对
const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

// 加密（用公钥）
const encrypted = crypto.publicEncrypt(publicKey, Buffer.from("data"));

// 解密（用私钥）
const decrypted = crypto.privateDecrypt(privateKey, encrypted);
```

**3. 哈希（HMAC）**

```javascript
const secret = "my-secret-key";
const data = "request-data";

// 创建HMAC
const hash = crypto.createHmac("sha256", secret).update(data).digest("hex");

// 用于签名验证
```

**4. JWT令牌**

```javascript
const jwt = require("jsonwebtoken");

// 生成令牌
const token = jwt.sign({ userId: 123, role: "admin" }, secretKey, {
  expiresIn: "2h",
});

// 验证令牌
try {
  const decoded = jwt.verify(token, secretKey);
} catch (err) {
  // 令牌无效
}
```

### 线程和进程之间的区别

**线程和进程区别详解答案：**

**1. 基本概念**
| 特性 | 进程 | 线程 |
|------|------|------|
| 定义 | 运行的程序实例 | 进程内的执行单元 |
| 资源占用 | 独立内存空间 | 共享进程资源 |
| 创建开销 | 大（分配独立内存） | 小（共享资源） |
| 通信 | IPC（进程间通信） | 直接读写共享内存 |
| 独立性 | 互不影响 | 一个崩溃可能影响其他 |

**2. Node.js中的进程**

```javascript
// 主进程
const http = require("http");
const server = http.createServer((req, res) => {
  res.end("Hello");
});
server.listen(3000);

// 创建子进程
const { fork } = require("child_process");
const child = fork("./worker.js");

child.on("message", (msg) => {
  console.log("来自子进程:", msg);
});

child.send({ type: "start" });
```

**3. Node.js中的线程**

```javascript
// Worker Threads（线程）
const { Worker, isMainThread } = require("worker_threads");

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.on("message", (msg) => console.log(msg));
  worker.postMessage("hello");
} else {
  parentPort.on("message", (msg) => {
    parentPort.postMessage("world");
  });
}
```

**4. 选择策略**

- CPU密集型任务：使用Worker Threads
- I/O密集型任务：Node.js异步非阻塞已经足够
- 需要稳定性：使用Cluster实现负载均衡和故障恢复

### node中如何建立子进程

### node中如何通过集群提高程序性能

**Node.js集群提高性能详解答案：**

**1. Cluster模块**

```javascript
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  http
    .createServer((req, res) => {
      res.end(`Handled by ${process.pid}`);
    })
    .listen(3000);
}
```

**2. PM2进程管理器**

```bash
# 启动集群模式
pm2 start app.js -i max

# 集群状态
pm2 list
pm2 monit

# 重启所有
pm2 restart all

# 零秒停机重载
pm2 reload all
```

**3. 负载均衡**

```javascript
// PM2自动处理负载均衡
// 主进程监听端口，分发给工作进程

// Nginx负载均衡配置
upstream node_app {
  least_conn; // 最少连接
  server 127.0.0.1:3000;
  server 127.0.0.1:3001;
  server 127.0.0.1:3002;
}
```

**4. 性能优化建议**

```javascript
// 1. 合理设置工作进程数
// 一般设置为CPU核心数或核心数-1

// 2. 使用keep-alive
const agent = new http.Agent({ keepAlive: true });

// 3. 启用缓存
const cache = new Map();
```

### nodejs中如何监控异步操作的时间

**异步操作时间监控详解答案：**

**1. 基础性能监控**

```javascript
const { performance } = require("perf_hooks");

// 标记开始
performance.mark("operation-start");

// 执行异步操作
await someAsyncOperation();

// 标记结束
performance.mark("operation-end");

// 测量时间
performance.measure("operation", "operation-start", "operation-end");

const measure = performance.getEntriesByName("operation")[0];
console.log(`耗时: ${measure.duration}ms`);
```

**2. 装饰器模式监控**

```javascript
function measureAsync(name, fn) {
  return async (...args) => {
    const start = Date.now();
    try {
      return await fn(...args);
    } finally {
      console.log(`${name} 耗时: ${Date.now() - start}ms`);
    }
  };
}

const measuredFetch = measureAsync("fetchUser", fetchUser);
```

**3. 中间件监控**

```javascript
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} 耗时: ${duration}ms`);
    metrics.record({ method: req.method, path: req.path, duration });
  });
  next();
});
```

**4. OPENTELEMETRY**

```javascript
const { trace } = require("@opentelemetry/api");
const tracer = trace.getTracer("my-app");

async function monitoredOperation() {
  return tracer.startActiveSpan("operation", async (span) => {
    try {
      const result = await doSomething();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (e) {
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw e;
    } finally {
      span.end();
    }
  });
}
```

### nodejs中的中间件作用

**中间件作用详解答案：**

**1. 中间件概念**

```javascript
// 中间件是一个函数，包含req, res, next三个参数
function middleware(req, res, next) {
  // 处理逻辑
  next(); // 传递给下一个中间件
}
```

**2. 洋葱模型**

```
请求 → middleware1 → middleware2 → middleware3
                                    ↓
响应 ← middleware1 ← middleware2 ← middleware3
```

```javascript
app.use(async (req, res, next) => {
  console.log("1. 开始");
  await next();
  console.log("1. 结束");
});

app.use(async (req, res, next) => {
  console.log("2. 开始");
  await next();
  console.log("2. 结束");
});

// 输出：1开始 → 2开始 → 2结束 → 1结束
```

**3. 中间件类型**

```javascript
// 应用级中间件
app.use((req, res, next) => {
  next();
});
app.get("/path", (req, res, next) => {
  next();
});

// 路由级中间件
const router = express.Router();
router.use(authMiddleware);

// 错误处理中间件（必须有4个参数）
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// 内置中间件
app.use(express.static("public"));
app.use(express.json());

// 第三方中间件
app.use(cors());
app.use(helmet());
app.use(logger());
```

**4. 实际应用**

```javascript
// 日志中间件
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.path} ${Date.now() - start}ms`);
  });
  next();
});

// 认证中间件
function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (verifyToken(token)) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

// 限流中间件
function rateLimitMiddleware(req, res, next) {
  const key = req.ip;
  const count = cache.get(key) || 0;
  if (count > 100) {
    res.status(429).send("Too Many Requests");
  } else {
    cache.set(key, count + 1);
    next();
  }
}
```

### nodejs中的缓冲区

**Node.js Buffer详解答案：**

**1. Buffer基础**

```javascript
// 创建Buffer
const buf1 = Buffer.alloc(10); // 分配10字节
const buf2 = Buffer.from("hello"); // 从字符串创建
const buf3 = Buffer.from([1, 2, 3]); // 从数组创建

// 字符串编码
const buf = Buffer.from("你好", "utf8"); // 'utf8' | 'ascii' | 'base64'
console.log(buf.toString("utf8"));
```

**2. 缓冲区操作**

```javascript
// 写入数据
buf.write("hello", 0, 5, "utf8");

// 读取数据
console.log(buf.toString("utf8", 0, 5));

// 合并缓冲区
const bufA = Buffer.from("hello");
const bufB = Buffer.from(" world");
const bufC = Buffer.concat([bufA, bufB]);
console.log(bufC.toString()); // 'hello world'

// 复制缓冲区
buf.copy(targetBuf, targetStart, sourceStart, sourceEnd);
```

**3. 实际应用**

```javascript
// 文件操作
const fs = require("fs");
const buffer = Buffer.alloc(1024);

fs.open("file.txt", "r", (err, fd) => {
  fs.read(fd, buffer, 0, 1024, 0, (err, bytes) => {
    console.log(buffer.slice(0, bytes).toString());
    fs.close(fd);
  });
});

// 网络传输
const http = require("http");
http.createServer((req, res) => {
  const chunks = [];
  req.on("data", (chunk) => chunks.push(chunk));
  req.on("end", () => {
    const data = Buffer.concat(chunks);
    console.log(data.toString());
  });
});
```

**4. Buffer与字符串转换**

```javascript
// 字符串转Buffer
const buf = Buffer.from("test");

// Buffer转字符串
const str = buf.toString("utf8");

// 截取子缓冲区（不复制，共享内存）
const sub = buf.subarray(0, 2);
```

### NODE_ENV是什么

**NODE_ENV环境变量详解答案：**

**1. 作用**

```javascript
// NODE_ENV表示当前运行环境
// 常见值：development | production | test
console.log(process.env.NODE_ENV); // 'development' | 'production' | undefined
```

**2. 设置方式**

```bash
# Linux/Mac
export NODE_ENV=production
node app.js

# Windows
set NODE_ENV=production
node app.js

# 启动时指定
NODE_ENV=production node app.js
```

**3. 实际应用**

```javascript
// 判断环境
if (process.env.NODE_ENV === "production") {
  // 生产环境配置
}

// 中间件示例
const isProd = process.env.NODE_ENV === "production";

// Express日志
app.use(logger(isProd ? "combined" : "dev"));

// 错误处理
if (!isProd) {
  app.use(errorHandler());
}
```

**4. webpack中的NODE_ENV**

```javascript
// webpack配置
{
  mode: process.env.NODE_ENV || 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
}
```

**5. 最佳实践**

```bash
# package.json
{
  "scripts": {
    "dev": "NODE_ENV=development webpack serve",
    "build": "NODE_ENV=production webpack --mode production",
    "test": "NODE_ENV=test jest"
  }
}
```

**6. 注意事项**

```javascript
// 判断是否为生产环境
const isProduction = process.env.NODE_ENV === "production";

// 注意：process.env.NODE_ENV在未设置时为undefined
// 不要直接使用Boolean(process.env.NODE_ENV)，因为空字符串也会被转为false
```

### 如何实现一个支持断点续传的大文件上传功能？

**断点续传大文件上传详解答案：**

**1. 核心原理**

断点续传的核心是将大文件分片上传，服务器记录已接收的分片，客户端在中断后从最后一个成功分片继续上传。

```
客户端                                    服务器
   |                                        |
   |--- 请求1: 分片1 (0-2MB) -------------> |
   |--- 请求2: 分片2 (2-4MB) -------------> |
   |--- 请求3: 分片3 (4-6MB) -------------> |  [保存到临时目录]
   |          ... 中断                     |
   |          ... 恢复                     |
   |--- 请求4: 分片3 (4-6MB) -------------> |  [跳过已接收的分片]
   |--- 请求5: 分片4 (6-8MB) -------------> |
   |          ... 完成                      |
   |--- 请求6: 合并所有分片 --------------> |  [合并为完整文件]
```

**2. 服务端实现**

```javascript
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// 临时存储目录
const UPLOAD_DIR = path.join(__dirname, "uploads");
const TEMP_DIR = path.join(UPLOAD_DIR, "temp");

// 确保目录存在
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// 上传分片
async function uploadChunk(ctx) {
  const { chunk, filename, chunkIndex, totalChunks, fileHash } =
    ctx.request.body;

  // 临时文件命名：fileHash_chunkIndex
  const tempPath = path.join(TEMP_DIR, `${fileHash}_${chunkIndex}`);

  // 保存分片到临时目录
  const buffer = Buffer.from(chunk, "base64");
  fs.writeFileSync(tempPath, buffer);

  // 记录已上传的分片
  const progressPath = path.join(TEMP_DIR, `${fileHash}_progress.json`);
  let progress = { completed: [] };
  if (fs.existsSync(progressPath)) {
    progress = JSON.parse(fs.readFileSync(progressPath, "utf8"));
  }
  if (!progress.completed.includes(chunkIndex)) {
    progress.completed.push(chunkIndex);
    progress.completed.sort((a, b) => a - b);
    fs.writeFileSync(progressPath, JSON.stringify(progress));
  }

  return { uploaded: progress.completed.length, total: totalChunks };
}

// 查询已上传的分片
async function getUploadedChunks(ctx) {
  const { fileHash } = ctx.query;

  const progressPath = path.join(TEMP_DIR, `${fileHash}_progress.json`);
  if (fs.existsSync(progressPath)) {
    const progress = JSON.parse(fs.readFileSync(progressPath, "utf8"));
    ctx.body = { uploadedChunks: progress.completed };
  } else {
    ctx.body = { uploadedChunks: [] };
  }
}

// 合并分片
async function mergeChunks(ctx) {
  const { filename, fileHash, totalChunks } = ctx.request.body;

  const finalPath = path.join(UPLOAD_DIR, filename);
  const writeStream = fs.createWriteStream(finalPath);

  for (let i = 0; i < totalChunks; i++) {
    const tempPath = path.join(TEMP_DIR, `${fileHash}_${i}`);
    const data = fs.readFileSync(tempPath);
    writeStream.write(data);
  }

  writeStream.end();

  // 清理临时文件
  for (let i = 0; i < totalChunks; i++) {
    const tempPath = path.join(TEMP_DIR, `${fileHash}_${i}`);
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }

  const progressPath = path.join(TEMP_DIR, `${fileHash}_progress.json`);
  if (fs.existsSync(progressPath)) {
    fs.unlinkSync(progressPath);
  }

  return { success: true, path: finalPath };
}

// 计算文件hash
function calculateFileHash(buffer) {
  return crypto.createHash("md5").update(buffer).digest("hex");
}
```

**3. 客户端实现**

```javascript
class ResumableUploader {
  constructor(options = {}) {
    this.chunkSize = options.chunkSize || 2 * 1024 * 1024; // 2MB
    this.maxConcurrency = options.maxConcurrency || 3;
    this.file = null;
    this.uploadedChunks = [];
    this.fileHash = "";
  }

  // 选择文件
  async selectFile(file) {
    this.file = file;
    this.fileHash = await this.calculateHash(file);
    // 查询已上传的分片
    const response = await fetch(
      `/api/upload/status?fileHash=${this.fileHash}`,
    );
    const { uploadedChunks } = await response.json();
    this.uploadedChunks = uploadedChunks || [];
  }

  // 计算文件hash
  async calculateHash(file) {
    const buffer = await file.slice(0, 1024 * 1024).arrayBuffer(); // 前1MB
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // 上传单个分片
  async uploadChunk(index) {
    const start = index * this.chunkSize;
    const end = Math.min(start + this.chunkSize, this.file.size);
    const chunk = this.file.slice(start, end);

    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("filename", this.file.name);
    formData.append("chunkIndex", index);
    formData.append("totalChunks", Math.ceil(this.file.size / this.chunkSize));
    formData.append("fileHash", this.fileHash);

    const response = await fetch("/api/upload/chunk", {
      method: "POST",
      body: formData,
    });

    return response.json();
  }

  // 批量上传（带并发控制）
  async uploadAll() {
    const totalChunks = Math.ceil(this.file.size / this.chunkSize);
    const pendingChunks = [];

    for (let i = 0; i < totalChunks; i++) {
      if (!this.uploadedChunks.includes(i)) {
        pendingChunks.push(i);
      }
    }

    // 并发控制
    const results = [];
    for (let i = 0; i < pendingChunks.length; i += this.maxConcurrency) {
      const batch = pendingChunks.slice(i, i + this.maxConcurrency);
      const batchResults = await Promise.all(
        batch.map((index) => this.uploadChunk(index)),
      );
      results.push(...batchResults);

      // 更新进度
      this.uploadedChunks.push(...batch);
      this.onProgress &&
        this.onProgress({
          uploaded: this.uploadedChunks.length,
          total: totalChunks,
          percent: Math.round((this.uploadedChunks.length / totalChunks) * 100),
        });
    }

    // 合并分片
    if (results.length > 0) {
      await fetch("/api/upload/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: this.file.name,
          fileHash: this.fileHash,
          totalChunks,
        }),
      });
    }

    return { success: true };
  }

  // 监听进度
  onProgress(callback) {
    this.onProgress = callback;
  }
}

// 使用示例
const uploader = new ResumableUploader({ chunkSize: 2 * 1024 * 1024 });

document.getElementById("fileInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  await uploader.selectFile(file);
});

uploader.onProgress((progress) => {
  console.log(`上传进度: ${progress.percent}%`);
  document.getElementById("progress").textContent =
    `${progress.uploaded}/${progress.total}`;
});

document.getElementById("uploadBtn").addEventListener("click", async () => {
  await uploader.uploadAll();
  console.log("上传完成");
});
```

**4. Express路由配置**

```javascript
const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "uploads/temp" });

// 上传分片
router.post("/upload/chunk", upload.single("chunk"), async (req, res) => {
  try {
    const result = await uploadChunk(req);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 查询上传状态
router.get("/upload/status", async (req, res) => {
  try {
    await getUploadedChunks(req, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 合并分片
router.post("/upload/merge", async (req, res) => {
  try {
    const result = await mergeChunks(req);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

**5. 前端暂停/恢复功能**

```javascript
class PausableUploader extends ResumableUploader {
  constructor(options) {
    super(options);
    this.isPaused = false;
    this.abortController = null;
  }

  async uploadChunk(index) {
    this.abortController = new AbortController();

    const start = index * this.chunkSize;
    const end = Math.min(start + this.chunkSize, this.file.size);
    const chunk = this.file.slice(start, end);

    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("filename", this.file.name);
    formData.append("chunkIndex", index);
    formData.append("totalChunks", Math.ceil(this.file.size / this.chunkSize));
    formData.append("fileHash", this.fileHash);

    const response = await fetch("/api/upload/chunk", {
      method: "POST",
      body: formData,
      signal: this.abortController.signal,
    });

    return response.json();
  }

  pause() {
    this.isPaused = true;
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  resume() {
    this.isPaused = false;
    this.uploadAll();
  }
}
```

**6. 关键实现点**

| 功能     | 实现方式                               |
| -------- | -------------------------------------- |
| 分片上传 | 文件切片 + FormData上传                |
| 断点续传 | 服务器记录已上传分片，客户端跳过已上传 |
| 并发控制 | Promise控制同时上传的分片数量          |
| 暂停恢复 | AbortController取消请求，状态保存      |
| 文件校验 | 计算文件hash验证完整性                 |
| 进度显示 | 已上传分片数 / 总分片数                |

### 如何实现一个支持断点续传的大文件下载功能？

**断点续传大文件下载详解答案：**

**1. 核心原理**

断点续传下载的核心是 HTTP Range 请求，服务器返回文件的指定范围，客户端记录已下载的字节位置，中断后从断点继续下载。

```
客户端                                    服务器
   |                                        |
   |--- GET /file.zip Range: bytes=0-1023 ->| [返回前1KB]
   |--- GET /file.zip Range: bytes=1024-   ->| [返回剩余部分]
   |          ... 中断                     |
   |          ... 恢复                     |
   |--- GET /file.zip Range: bytes=512-   ->| [从断点继续]
```

**2. 服务端实现（Express）**

```javascript
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// 下载文件（支持断点续传）
router.get("/download/:filename", async (req, res) => {
  const { filename } = req.params;
  const { range } = req.headers;

  const filePath = path.join(__dirname, "uploads", filename);
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;

  if (range) {
    // 解析Range请求头
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    // 创建读取流
    const stream = fs.createReadStream(filePath, { start, end });
    const buffer = Buffer.alloc(chunkSize);

    let bytesRead = 0;
    stream.on("data", (chunk) => {
      chunk.copy(buffer, bytesRead);
      bytesRead += chunk.length;
    });

    stream.on("end", () => {
      res.writeHead(206, {
        // Partial Content
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "application/octet-stream",
      });
      res.end(buffer);
    });

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      res.status(500).send("Download error");
    });
  } else {
    // 普通下载（无Range请求）
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

// 获取文件信息（用于客户端检查文件是否变化）
router.get("/fileinfo/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "uploads", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  const stat = fs.statSync(filePath);
  res.json({
    filename,
    size: stat.size,
    mtime: stat.mtime.getTime(),
  });
});

module.exports = router;
```

**3. 客户端实现**

```javascript
class ResumableDownloader {
  constructor(options = {}) {
    this.url = options.url;
    this.filename = options.filename;
    this.fileSize = 0;
    this.downloadedSize = 0;
    this.chunkSize = options.chunkSize || 1024 * 1024; // 默认1MB
    this.onProgress = null;
    this.onComplete = null;
    this.onError = null;
    this.abortController = null;
    this.isPaused = false;
  }

  // 初始化下载
  async init() {
    // 获取文件大小
    const response = await fetch(this.url, { method: "HEAD" });
    this.fileSize = parseInt(response.headers.get("content-length"), 10);
    return this.fileSize;
  }

  // 开始下载
  async download() {
    this.abortController = new AbortController();
    this.isPaused = false;

    try {
      const headers = {};
      if (this.downloadedSize > 0) {
        headers["Range"] = `bytes=${this.downloadedSize}-`;
      }

      const response = await fetch(this.url, {
        headers,
        signal: this.abortController.signal,
      });

      if (response.status === 206) {
        // 断点续传响应
        const contentRange = response.headers.get("Content-Range");
        const total = parseInt(contentRange.split("/")[1], 10);
        this.fileSize = total;
      }

      const blob = await response.blob();
      this.downloadedSize += blob.size;

      // 保存到本地
      this.saveBlob(blob);

      if (this.onProgress) {
        this.onProgress({
          downloaded: this.downloadedSize,
          total: this.fileSize,
          percent: Math.round((this.downloadedSize / this.fileSize) * 100),
        });
      }

      if (this.downloadedSize >= this.fileSize) {
        if (this.onComplete) {
          this.onComplete();
        }
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Download paused");
      } else if (this.onError) {
        this.onError(err);
      }
    }
  }

  // 保存Blob到文件
  saveBlob(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = this.filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // 暂停下载
  pause() {
    this.isPaused = true;
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  // 恢复下载
  async resume() {
    await this.download();
  }

  // 获取下载进度（保存到本地存储）
  saveProgress() {
    localStorage.setItem(
      `download_${this.filename}`,
      JSON.stringify({
        downloadedSize: this.downloadedSize,
        fileSize: this.fileSize,
      }),
    );
  }

  // 加载保存的进度
  loadProgress() {
    const saved = localStorage.getItem(`download_${this.filename}`);
    if (saved) {
      const { downloadedSize, fileSize } = JSON.parse(saved);
      if (fileSize === this.fileSize) {
        this.downloadedSize = downloadedSize;
        return true;
      }
    }
    return false;
  }
}

// 使用示例
const downloader = new ResumableDownloader({
  url: "/api/download/largefile.zip",
  filename: "largefile.zip",
  chunkSize: 1024 * 1024,
});

downloader.onProgress = (progress) => {
  console.log(`下载进度: ${progress.percent}%`);
  document.getElementById("progress").textContent = `${progress.percent}%`;
  downloader.saveProgress(); // 保存进度
};

downloader.onComplete = () => {
  console.log("下载完成");
};

document.getElementById("startBtn").addEventListener("click", async () => {
  await downloader.init();
  downloader.loadProgress(); // 加载之前进度
  await downloader.download();
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  downloader.pause();
});

document.getElementById("resumeBtn").addEventListener("click", () => {
  downloader.resume();
});
```

**4. 使用Blob和分段写入的完整实现**

```javascript
class FullResumableDownloader {
  constructor(options = {}) {
    this.url = options.url;
    this.filename = options.filename;
    this.fileSize = 0;
    this.downloadedSize = 0;
    this.chunks = []; // 存储已下载的分片
    this.onProgress = null;
    this.onComplete = null;
  }

  async init() {
    const response = await fetch(this.url, { method: "HEAD" });
    this.fileSize = parseInt(response.headers.get("content-length"), 10);
    this.chunks = new Array(Math.ceil(this.fileSize / this.chunkSize));
    return this.fileSize;
  }

  async downloadChunk(start, end) {
    const response = await fetch(this.url, {
      headers: {
        Range: `bytes=${start}-${end}`,
      },
    });

    if (response.status !== 206) {
      throw new Error("Failed to download chunk");
    }

    return await response.blob();
  }

  async downloadAll() {
    const totalChunks = Math.ceil(this.fileSize / this.chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      if (this.chunks[i]) continue; // 已下载，跳过

      const start = i * this.chunkSize;
      const end = Math.min(start + this.chunkSize - 1, this.fileSize - 1);

      const blob = await this.downloadChunk(start, end);
      this.chunks[i] = blob;
      this.downloadedSize += blob.size;

      if (this.onProgress) {
        this.onProgress({
          downloaded: this.downloadedSize,
          total: this.fileSize,
          percent: Math.round((this.downloadedSize / this.fileSize) * 100),
        });
      }
    }

    // 合并所有分片
    const finalBlob = new Blob(this.chunks);
    this.saveBlob(finalBlob);

    if (this.onComplete) {
      this.onComplete(finalBlob);
    }
  }

  saveBlob(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = this.filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // 支持暂停的版本
  async downloadWithPause(onProgressCheck) {
    const totalChunks = Math.ceil(this.fileSize / this.chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      if (this.chunks[i]) continue;

      // 检查是否暂停
      if (onProgressCheck && onProgressCheck()) {
        return { completed: false, downloadedChunks: i };
      }

      const start = i * this.chunkSize;
      const end = Math.min(start + this.chunkSize - 1, this.fileSize - 1);

      const blob = await this.downloadChunk(start, end);
      this.chunks[i] = blob;
      this.downloadedSize += blob.size;

      if (this.onProgress) {
        this.onProgress({
          downloaded: this.downloadedSize,
          total: this.fileSize,
          percent: Math.round((this.downloadedSize / this.fileSize) * 100),
        });
      }
    }

    const finalBlob = new Blob(this.chunks);
    this.saveBlob(finalBlob);

    if (this.onComplete) {
      this.onComplete(finalBlob);
    }

    return { completed: true };
  }
}
```

**5. 使用axios的实现**

```javascript
const axios = require("axios");
const fs = require("fs");

async function downloadFile(url, outputPath, options = {}) {
  const chunkSize = options.chunkSize || 1024 * 1024;
  let downloadedSize = options.startSize || 0;

  const response = await axios.head(url);
  const fileSize = parseInt(response.headers["content-length"], 10);

  const writeStream = fs.createWriteStream(outputPath, {
    flags: downloadedSize > 0 ? "a" : "w",
  });

  while (downloadedSize < fileSize) {
    const end = Math.min(downloadedSize + chunkSize - 1, fileSize - 1);

    const chunkResponse = await axios.get(url, {
      headers: {
        Range: `bytes=${downloadedSize}-${end}`,
      },
      responseType: "stream",
    });

    await new Promise((resolve, reject) => {
      chunkResponse.data.pipe(writeStream);
      chunkResponse.data.on("end", resolve);
      chunkResponse.data.on("error", reject);
    });

    downloadedSize = end + 1;
    console.log(`Downloaded ${downloadedSize}/${fileSize}`);
  }

  writeStream.end();
  console.log("Download complete");
}

// 使用
downloadFile("http://example.com/largefile.zip", "./largefile.zip");
```

**6. 关键实现点**

| 功能      | 实现方式                                      |
| --------- | --------------------------------------------- |
| 断点下载  | HTTP Range请求头 `Range: bytes=start-end`     |
| 续传恢复  | 记录已下载大小，从断点继续请求                |
| 进度保存  | localStorage或文件记录下载进度                |
| 文件校验  | HEAD请求获取文件大小，验证完整性              |
| 并发下载  | 多个Range请求同时下载不同部分（需服务器支持） |
| 206状态码 | 服务器返回Partial Content表示支持断点续传     |

**7. HTTP断点续传相关头**

| 请求头        | 说明                 | 示例                |
| ------------- | -------------------- | ------------------- |
| Range         | 请求的字节范围       | `bytes=0-1023`      |
| If-Range      | 条件断点续传         | `bytes=1024-`       |
| Content-Range | 响应内容范围         | `bytes 0-1023/1024` |
| Accept-Ranges | 服务器支持的下载单位 | `bytes`             |

```

```
