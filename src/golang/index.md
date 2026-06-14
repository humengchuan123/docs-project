<!--
 * @Author: humengchuan 531537052@qq.com
 * @Date: 2025-12-19 12:50:15
 * @LastEditors: HuMeng 531537052@qq.com
 * @LastEditTime: 2026-05-31 22:18:53
 * @FilePath: \work-tool\docs-vitepress\src\golang\index.md
 * @Description:
-->

### Golang

\*\*\*\*指针

&是取地址，\*是解引用，去这个地址指向的值

\*\*\*\* 数组与切片

数组是固定长度的，切片是动态长度的
操作数组的方法：

```go
// 切片的增
s1 := []int{1, 2}
append{s1, 3}
// s1 = [1, 2, 3]

s1 := []int{1, 2}
s2 := []int{3, 4, 5}
s1 = append(s1, s2...)    // 添加s2的所有元素
// 结果: [1, 2, 3, 4, 5]

// 在开头插入元素
s = append([]int{0}, s1...)
// 结果: [0, 1, 2, 3, 4, 5]

// 在中间插入元素
// 在索引2处插入元素
s = append(s[:2], append([]int{4}, s[2:]...)...)
// s = [1, 2, 4, 3, 4, 5]

// 切片删
s := []int{1, 2, 3, 4, 5}
index := 2  // 要删除索引2的元素（值为3）
s = append(s[:index], s[index+1:]...)
// tips: 删除索引为2的元素, 方法中不包含s[index+1:]
// 结果: [1, 2, 4, 5]

// 删除最后一个元素
s = s[:len(s)-1]

// 删除第一个元素
s = s[1:]

// Go 1.21后，slices包也可以操作数组和切片
slices.Delete(s, index, index+1)

// 切片的复制  copy apend都能进行复制
s.Copy()  // 返回一个新的切片，该切片的元素是原切片的副本
s.apend(s[index:]...) // 添加s[index:]的所有元素

// 切片的修改
s := []int{1, 2, 3, 4, 5}

// 修改第一个元素
s[0] = 10 // s = [10, 2, 3, 4, 5]

// 修改中间元素
s[2] = 30 // s = [10, 2, 30, 4, 5]

// 修改最后一个元素
s[len(s)-1] = 50

// 修改多个元素
s[1:3] = []int{20, 30} // s = [10, 20, 30, 4, 50]
```

#### golang ORM 框架

gorm https://duoke360.com/tutorial/gorm/g2
gorm 支持多种关系型数据库（MySQL、PostgreSQL、SQLite、SQL Server 等）但不支持 MongoDB。

```go

type Product struct {
  gorm.Model
  Code  string
  Price uint
  Name  sql.NullString
  Index sql.NullInt64
}
db, err := gorm.Open(mysql.Open("username:password@/dbname"), &gorm.Config{})
db.AutoMigrate(&Product{}) // 自动创建表

// 新增 增加一条数据
db.Create(&Product{Code: "D42", Price: 100})

// 删除  逻辑删除
db.Delete(&Product{}, 1)

// 修改
/*
* 更新0值或者null 的字段不会被更新
* 若要更新 1.将string 设置为*string 2.使用sql的NULLxXX来解决
*/
db.Model(&Product{}).Where("code = ?", "D42").Update("price", 200)

// 查询
var product Product
db.First(&product, 1) // 查询 id = 1 的数据
db.First(&product, "code = ?", "D42") // 查询 code = D42 的数据


```

go.mongodb.org/mongo-driver/mongo
MongoDB 官方推荐的 Go 驱动

go-redis（v8）
Redis 官方的 Go 驱动

#### air

（Go 社区最流行的热重载工具）

```md
go install github.com/cosmtrek/air@latest

cd your-gin-project
air init

air
```

几个不同难度和方向的Go练手项目，建议按照“从CLI到Web，再到系统级”的顺序循序渐进，这样能最大程度地建立信心并掌握核心技能。
🌱 新手入门：命令行工具 (CLI)
这类项目不依赖复杂的网络和数据库，能让你快速看到代码运行的效果，专注于Go的基础语法、错误处理和标准库。
go-simple-calculator（命令行计算器）：最安全的起点。只用标准库，通过 flag 解析命令行参数，实现加减乘除。你可以重点练习 switch 运算逻辑和错误返回处理1。
quiz-app-cli（终端答题应用）：读取 CSV 文件作为题库，在终端逐题提问并计时判分。这个项目能让你直观地理解 Go 的 select + channel 超时控制机制，以及文件 I/O 操作1。
批量文件重命名工具：用 cobra 框架搭骨架，实现给文件批量添加前缀或后缀。能练熟 filepath.Glob、os.Rename 等核心文件操作能力5。
🚀 进阶实战：Web服务与API
当你熟悉了基础语法后，可以尝试构建网络服务，理解路由、JSON序列化以及并发安全。
用 net/http 写极简 REST API：强烈建议先别碰框架。直接用标准库 net/http 实现两个路由（如 /users 和 /users/1），手动进行 JSON 序列化。这能让你看清 Web 服务的底层逻辑，而不是被框架的黑盒掩盖4。
go-todo（双模式待办事项）：同一个数据结构同时支持命令行增删查和 HTTP 接口返回 JSON。数据暂存在内存 map 中，是练习并发安全（sync.RWMutex）的绝佳场景，还能顺手实现数据持久化到 JSON 文件1。
gin-vue-admin（全栈后台管理系统）：如果你已经掌握了 Gin 框架和 GORM，这个项目是迈向工程化的好选择。它使用了 Gin、GORM、Zap 日志库等主流生态，目录结构清晰，非常适合学习企业级项目是如何组织和开发的2。
⚙️ 高阶挑战：系统与中间件
深入理解分布式、并发底层原理以及网络协议。
Redis 分布式锁：用 go-redis 连接 Redis，实现加锁、解锁逻辑。重点在于理解为什么解锁必须用 Lua 脚本来保证原子性，以及如何处理锁的超时误释放问题4。
Godis（简化版 Redis）：不要被名字吓到，教学版通常只实现 SET 和 GET。核心是学习用 net.Listener 接收 TCP 连接，并手动解析 Redis 的 RESP 协议，能让你对网络编程有质的飞跃1。
rosedb（嵌入式 KV 存储引擎）：一个稳定、高性能的内嵌键值存储引擎，支持 String、List 等多种数据结构。代码中包含了大量数据结构的实现，适合想深入钻研存储原理的同学
