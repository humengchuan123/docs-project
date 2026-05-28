<!--
 * @Author: humengchuan 531537052@qq.com
 * @Date: 2026-04-27 10:00:00
 * @LastEditors: HuMeng 531537052@qq.com
 * @LastEditTime: 2026-04-28 08:14:05
 * @FilePath: \work-tool\docs-vitepress\src\nodejs\redis.md
 * @Description: Redis 常用热门知识点
-->

### Redis

#### 1. 为什么 Redis 这么快？

- 纯内存操作：数据存储在内存中，避免磁盘 I/O
- 高效数据结构：跳表、哈希表、压缩列表等
- I/O 多路复用：单线程通过 epoll/kqueue 处理万级并发连接
- 单线程模型：避免线程切换和锁竞争开销
- Redis 6.0+ 引入多线程处理网络 I/O，命令执行仍是单线程

#### 2. 数据类型与底层实现

| 数据类型    | 底层编码                       | 适用场景                         |
| ----------- | ------------------------------ | -------------------------------- |
| String      | int / raw / embstr             | 缓存、计数器、分布式锁           |
| List        | zplist / quicklist             | 消息队列、最新列表               |
| Hash        | ziplist / hashtable            | 对象存储（用户信息等）           |
| Set         | intset / hashtable             | 标签、去重、共同关注             |
| ZSet        | ziplist / skiplist + hashtable | 排行榜、延迟队列                 |
| Bitmap      | String                         | 海量布尔值统计（如签到）         |
| HyperLogLog | 概率算法                       | UV 统计（误差 0.81%，固定 12KB） |
| GEO         | ZSet + GeoHash                 | 地理位置、附近的人               |
| Streams     | radix tree                     | 消息队列（支持消费者组）         |

#### 3. 持久化

- RDB（快照）：fork 子进程全量 dump，文件紧凑恢复快，可能丢最后一次快照后的数据
- AOF（追加日志）：记录每条写命令，数据更安全，文件大恢复慢
- 混合持久化（Redis 4.0+）：AOF 文件前半段 RDB 格式 + 后半段 AOF 命令，兼顾速度与安全
- AOF 三种 fsync 策略：always（每条同步）、everysec（每秒同步，推荐）、no（OS 控制）
- AOF 重写：合并冗余命令减少文件体积，子进程扫描内存生成最小命令集

#### 4. 内存淘汰策略

| 策略            | 说明                                      |
| --------------- | ----------------------------------------- |
| noeviction      | 默认，内存满时写请求报错                  |
| allkeys-lru     | 所有 key 中淘汰最近最少使用               |
| volatile-lru    | 仅带过期时间的 key 中 LRU 淘汰            |
| allkeys-lfu     | 所有 key 中淘汰访问频率最低（Redis 4.0+） |
| volatile-lfu    | 仅带过期时间的 key 中 LFU 淘汰            |
| allkeys-random  | 随机淘汰                                  |
| volatile-random | 随机淘汰带过期时间的 key                  |
| volatile-ttl    | 优先淘汰 TTL 短的 key                     |

- LRU vs LFU：LRU 看最后一次访问时间，LFU 统计访问频率；热点数据稳定用 LRU，突发流量用 LFU

#### 5. 缓存三大问题

| 问题     | 原因                               | 解决方案                                       |
| -------- | ---------------------------------- | ---------------------------------------------- |
| 缓存穿透 | 查询不存在的数据，绕过缓存直打 DB  | 布隆过滤器拦截、缓存空值（短过期）             |
| 缓存击穿 | 热点 key 过期瞬间，大量请求打 DB   | 互斥锁重建缓存、逻辑过期（不设 TTL，后台更新） |
| 缓存雪崩 | 大量 key 同时过期，DB 瞬间压力暴增 | 过期时间加随机值、高可用 + 限流、多级缓存      |

#### 6. 高可用架构

- 主从复制：全量同步（RDB 传输）+ 增量同步（命令传播），读写分离
- 哨兵 Sentinel：监控、通知、自动故障转移，至少 3 个哨兵防脑裂
  - 主观下线（SDOWN）：单个哨兵认为不可达
  - 客观下线（ODOWN）：quorum 数量哨兵确认故障
- Redis Cluster：16384 个哈希槽分片，CRC16(key) % 16384 计算槽位
  - Gossip 协议节点间通信
  - 至少 3 主节点，推荐 3 主 3 从
  - 不支持跨槽位事务（可用 hash tags 解决）

#### 7. 分布式锁

- 基础版：`SET lock_key unique_value NX EX 30`（NX 原子性 + EX 防死锁）
- 问题：锁过期业务未完成、不可重入、主从切换丢锁
- 推荐方案：Redisson
  - Watchdog 机制自动续期
  - 支持可重入
  - 多节点多数派（Redlock）
- 释放锁必须用 Lua 脚本校验值，保证原子性

#### 8. 事务

- MULTI 开启事务 → 命令入队 → EXEC 执行
- WATCH 监控 key，若被修改则事务不执行（乐观锁）
- Redis 事务不支持回滚，某条命令失败其余仍执行
- 不保证原子性（非数据库 ACID 的原子性）

#### 9. 过期删除策略

- 定期删除：每隔一段时间随机抽取 key 检查过期并删除
- 惰性删除：访问 key 时才检查是否过期
- 两者配合使用：定期删除主动清理 + 惰性删除兜底

#### 10. 其他高频知识点

- Pipeline：客户端打包多条命令一次性发送，减少网络 RTT
- Pub/Sub：发布订阅模式，适合实时消息推送，不支持消息持久化和确认
- BigKey 问题：大 value 阻塞线程，拆分为小 key 或使用 UNLINK 异步删除
- HotKey 问题：热点 key 造成单节点压力，本地缓存 + 分片打散
- SCAN 命令：渐进式遍历，避免 KEYS 阻塞线程
- Redis 7.0 新特性：多 AOF 文件、客户端缓存、Function 替代 Lua 脚本
