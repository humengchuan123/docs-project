# Golang 后端面试题汇总

> 涵盖 Go 基础、Go 进阶、实战场景、MySQL、Redis、MQ 消息队列、gRPC 微服务、Nginx、部署、Docker 等高频考点
>
> 2026 年最新整理版

---

## 目录

- [第一部分：Golang 基础（20 题）](#第一部分golang-基础20-题)
  - [1.1 语言基础](#11-语言基础)
  - [1.2 数据结构](#12-数据结构)
  - [1.3 并发编程基础](#13-并发编程基础)
  - [1.4 接口与类型系统](#14-接口与类型系统)
- [第二部分：Golang 进阶（15 题）](#第二部分golang-进阶15-题)
  - [2.1 并发深入](#21-并发深入)
  - [2.2 内存与性能](#22-内存与性能)
  - [2.3 工程实践](#23-工程实践)
- [第三部分：MySQL（10 题）](#第三部分mysql10-题)
- [第四部分：Redis（10 题）](#第四部分redis10-题)
- [第五部分：MQ 消息队列（8 题）](#第五部分mq-消息队列8-题)
- [第六部分：gRPC 微服务（8 题）](#第六部分grpc-微服务8-题)
- [第七部分：Nginx（6 题）](#第七部分nginx6-题)
- [第八部分：部署与 Docker（8 题）](#第八部分部署与-docker8-题)
- [第九部分：实战场景题（15 题）](#第九部分实战场景题15-题)

---

# 第一部分：Golang 基础（20 题）

## 1.1 语言基础

### Q1: Go 语言有哪些核心特点？

**频率：** ★★★★★ 几乎必问

**参考答案：**

- **静态类型、编译型语言**：类型安全，编译为机器码，运行效率高
- **垃圾回收（GC）**：自动内存管理，并发标记清除算法
- **原生并发支持**：goroutine（轻量级线程，~2KB 栈）+ channel（CSP 模型）
- **组合优于继承**：通过结构体嵌入实现代码复用，无传统 OOP 继承
- **接口隐式实现**：无需显式声明 implements，只要实现接口方法即可
- **内置工具链**：go fmt、go test、go vet、go mod 等一站式工具
- **跨平台编译**：GOOS/GOARCH 交叉编译，支持多平台
- **快速编译**：依赖分析精确，增量编译速度快

---

### Q2: defer 的执行顺序是什么？和 panic 如何交互？

**频率：** ★★★★★

**参考答案：**

- **defer 遵循 LIFO（后进先出）**，多个 defer 按声明逆序执行
- **defer 参数在声明时立即求值**，不是在执行时求值
- **panic 触发时**：先逆序执行当前函数所有 defer，若 defer 中无 recover()，则 panic 向上层传播
- **defer + recover**：在 defer 中调用 recover() 可捕获 panic，恢复正常执行

```go
func example() {
    defer func() { fmt.Println("1") }()
    defer func() { fmt.Println("2") }()
    defer func() { fmt.Println("3") }()
    panic("error")
}
// 输出顺序：3 → 2 → 1 → panic
```

**避坑：** defer 中的命名返回值修改会影响实际返回值（因为命名返回值是函数作用域变量）。

---

### Q3: new 和 make 有什么区别？

**频率：** ★★★★★

**参考答案：**

| 特性 | new(T) | make(T, args) |
|------|--------|---------------|
| 适用类型 | 所有类型 | 仅 slice、map、channel |
| 返回值 | *T（指针） | T（初始化后的值） |
| 初始化 | 零值内存 | 按类型初始化（非零值） |
| 底层 | 分配内存 | 分配内存 + 初始化内部结构 |

```go
p := new([]int)    // *[]int，指向 nil 切片，append 会 panic
s := make([]int, 3) // []int{0, 0, 0}，可直接使用
```

---

### Q4: Go 中值类型和引用类型分别有哪些？

**频率：** ★★★★

**参考答案：**

- **值类型**：int、float、bool、string、array、struct —— 赋值/传参会拷贝
- **引用类型**：slice、map、channel、interface、pointer、function —— 赋值/传参共享底层数据

**注意：** Go 中所有传参都是值传递，引用类型之所以能"共享数据"是因为它们内部包含指针。

---

### Q5: iota 的用法是什么？

**频率：** ★★★

**参考答案：**

- `iota` 是 Go 的预声明常量生成器，在 const 块中使用
- 每出现一个 const，iota 重置为 0
- 每新增一行常量声明，iota 值 +1
- 可用于位运算定义枚举标志

```go
const (
    A = iota  // 0
    B         // 1
    C         // 2
    D = 1 << iota  // 8 (1 << 3)
    E         // 16 (1 << 4)
)
```

---

## 1.2 数据结构

### Q6: slice（切片）的底层结构是什么？扩容机制是怎样的？

**频率：** ★★★★★

**参考答案：**

**底层结构（reflect.SliceHeader）：**

```go
type SliceHeader struct {
    Data uintptr  // 指向底层数组的指针
    Len  int      // 切片长度
    Cap  int      // 切片容量
}
```

**扩容机制：**

- 当 `append` 导致 `len > cap` 时触发扩容
- Go 1.18+：容量 < 256 时，新容量 = 旧容量 × 2；容量 >= 256 时，新容量 = 旧容量 × 1.25 + 192（约）
- 扩容后可能分配新的底层数组，旧数据拷贝到新数组

**常见陷阱：**

- 切片共享底层数组时，修改一个切片可能影响另一个
- 大切片 `append` 后容量翻倍可能导致内存浪费

---

### Q7: slice 和 array 有什么区别？

**频率：** ★★★★★

**参考答案：**

| 特性 | 数组 (Array) | 切片 (Slice) |
|------|-------------|-------------|
| 长度 | 固定，类型的一部分 | 动态，可变 |
| 比较 | 可比较（值相等） | 不可直接比较（只能和 nil 比） |
| 传参 | 值拷贝（整个数组） | 拷贝 SliceHeader（共享底层数组） |
| 初始化 | `[3]int{1,2,3}` | `make([]int, 3)` 或 `[]int{1,2,3}` |
| 函数参数 | `func f(arr [3]int)` | `func f(s []int)` |

---

### Q8: map 的底层实现是什么？为什么 map 不是并发安全的？

**频率：** ★★★★★

**参考答案：**

**底层实现：**

- Go map 基于哈希表实现，核心结构是 `hmap`
- 使用**拉链法**解决哈希冲突
- 每个 bucket 存储 8 个 key-value 对
- 触发扩容条件：负载因子 > 6.5 或溢出桶过多
- 扩容策略：等量扩容（整理内存）或 翻倍扩容（2 倍容量）

**并发不安全原因：**

- map 在扩容时需要迁移数据，并发读写会导致数据竞争
- Go 运行时会检测并发写，直接 `fatal error: concurrent map writes`
- **解决方案**：`sync.RWMutex` 加锁 或 `sync.Map`（适合读多写少）

---

### Q9: map 的 key 有什么要求？哪些类型不能做 key？

**频率：** ★★★★

**参考答案：**

- key 必须是**可比较类型**（支持 == 和 !=）
- **可以做 key**：int、float、string、bool、指针、channel、interface、struct（字段全部可比较）、array（元素全部可比较）
- **不能做 key**：slice、map、function（这些类型只能和 nil 比较）

---

### Q10: map 如何实现有序遍历？

**频率：** ★★★

**参考答案：**

Go 原生 map 是无序的（哈希随机化，防止依赖遍历顺序）。

**解决方案：**

1. **对 key 排序后遍历**：提取所有 key 到 slice，排序后依次取值
2. **使用第三方库**：如 `github.com/iancoleman/orderedmap`
3. **Go 1.12+**：`map` 遍历顺序在同一运行中稳定，但不同运行间随机

```go
keys := make([]string, 0, len(m))
for k := range m {
    keys = append(keys, k)
}
sort.Strings(keys)
for _, k := range keys {
    fmt.Println(k, m[k])
}
```

---

## 1.3 并发编程基础

### Q11: goroutine 和线程有什么区别？

**频率：** ★★★★★

**参考答案：**

| 特性 | goroutine | OS 线程 |
|------|-----------|---------|
| 创建大小 | ~2KB 栈（可动态增长到 GB） | 固定大小（通常 1-8MB） |
| 创建成本 | 极低（用户态） | 高（系统调用） |
| 调度 | Go runtime 调度器（GMP 模型） | OS 内核调度 |
| 切换成本 | ~几十纳秒 | ~微秒级 |
| 数量 | 轻松创建百万级 | 通常几千个 |
| 通信方式 | channel（推荐） | 共享内存 + 锁 |

---

### Q12: GMP 调度模型是什么？

**频率：** ★★★★★

**参考答案：**

- **G（Goroutine）**：用户态协程，包含栈、指令指针等
- **M（Machine）**：OS 线程，实际执行者
- **P（Processor）**：逻辑处理器，持有本地 runqueue

**调度流程：**

1. G 创建后放入全局队列或 P 的本地队列
2. M 从绑定的 P 的本地队列获取 G 执行
3. 本地队列为空时，从全局队列或其他 P 偷取 G（Work Stealing）
4. G 发生系统调用时，P 释放 M，创建新 M 继续执行其他 G
5. 系统调用返回后，G 重新放入全局队列等待调度

---

### Q13: channel 有哪些类型？分别有什么特点？

**频率：** ★★★★★

**参考答案：**

| 类型 | 声明 | 特点 |
|------|------|------|
| 无缓冲 | `make(chan int)` | 发送/接收同步阻塞，双方必须同时就绪 |
| 有缓冲 | `make(chan int, N)` | 缓冲满时发送阻塞，缓冲空时接收阻塞 |
| 只读 | `<-chan int` | 只能接收，用于函数参数限制 |
| 只写 | `chan<- int` | 只能发送，用于函数参数限制 |

**关键规则：**

- 对 nil channel 操作会永久阻塞
- 对已关闭的 channel 发送会 panic
- 对已关闭的 channel 接收返回零值和 false
- 关闭已关闭的 channel 会 panic
- 向 channel 发送/接收是原子操作，无需额外加锁

---

### Q14: select 的作用是什么？多个 case 同时就绪时怎么处理？

**频率：** ★★★★★

**参考答案：**

- `select` 用于同时监听多个 channel 操作
- **多个 case 同时就绪时，Go 会伪随机选择一个执行**（避免饥饿）
- 所有 case 都不就绪且没有 default，select 会阻塞
- 有 default 时，select 不会阻塞（非阻塞模式）

```go
select {
case v := <-ch1:
    fmt.Println(v)
case v := <-ch2:
    fmt.Println(v)
case <-time.After(3 * time.Second):
    fmt.Println("timeout")
default:
    fmt.Println("no data")
}
```

---

### Q15: sync 包有哪些常用类型？分别适用什么场景？

**频率：** ★★★★★

**参考答案：**

| 类型 | 用途 | 场景 |
|------|------|------|
| `sync.Mutex` | 互斥锁 | 保护共享资源读写 |
| `sync.RWMutex` | 读写锁 | 读多写少场景 |
| `sync.WaitGroup` | 等待组 | 等待一组 goroutine 完成 |
| `sync.Once` | 单次执行 | 单例模式、延迟初始化 |
| `sync.Map` | 并发安全 map | 读多写少、key 稳定的场景 |
| `sync.Pool` | 对象池 | 减少内存分配（如 bytes.Buffer 复用） |
| `sync.Cond` | 条件变量 | goroutine 间条件通知 |
| `sync.Atomic` | 原子操作 | 计数器、状态标志 |

---

## 1.4 接口与类型系统

### Q16: 接口的底层实现是什么？空接口和非空接口有什么区别？

**频率：** ★★★★★

**参考答案：**

**接口底层结构（iface 和 eface）：**

- **空接口 `interface{}`**（eface）：`{type, data}` —— 无方法列表
- **非空接口**（iface）：`{tab, data}` —— tab 包含方法列表和类型信息

**接口为 nil 的条件：**

- type 和 data 都为 nil 时，接口才为 nil
- 将一个 nil 指针赋给接口，接口不为 nil（因为 type 不为 nil）

```go
var p *int = nil
var i interface{} = p
fmt.Println(i == nil) // false！type = *int, data = nil
```

---

### Q17: 值接收者和指针接收者实现接口有什么区别？

**频率：** ★★★★★

**参考答案：**

**方法集规则：**

| 类型 T | 类型 *T |
|--------|---------|
| 所有 receiver 为 T 的方法 | 所有 receiver 为 T 的方法 |
| | 所有 receiver 为 *T 的方法 |

- 值类型 `T` 只能实现 receiver 为 `T` 的接口方法
- 指针类型 `*T` 能实现 receiver 为 `T` 和 `*T` 的接口方法
- **最佳实践**：如果结构体需要修改，使用指针接收者；否则使用值接收者

---

### Q18: 类型断言和类型 switch 的用法？

**频率：** ★★★★

**参考答案：**

```go
// 类型断言（安全方式）
var i interface{} = "hello"
if s, ok := i.(string); ok {
    fmt.Println(s) // "hello"
}

// 类型断言（不安全，失败会 panic）
s := i.(string)

// 类型 switch（仅适用于 interface 类型）
switch v := i.(type) {
case string:
    fmt.Println("string:", v)
case int:
    fmt.Println("int:", v)
default:
    fmt.Println("unknown")
}
```

**注意：** `i.(type)` 只能在 switch 语句中使用，且 `i` 必须是 interface 类型。

---

### Q19: Go 的类型别名（type alias）和类型定义（type definition）有什么区别？

**频率：** ★★★

**参考答案：**

```go
type MyInt int      // 类型定义：新类型，和 int 是不同类型
type AliasInt = int // 类型别名：和 int 完全相同，只是另一个名字
```

- **类型定义**：创建新类型，不共享原类型的方法集（除非显式定义）
- **类型别名**：与原类型完全等价，共享所有方法，可用于兼容性迁移
- Go 1.9 引入类型别名，主要用于渐进式代码重构

---

### Q20: Go 中的 error 处理最佳实践？

**频率：** ★★★★★

**参考答案：**

- **errors.Is()**：判断错误链中是否包含某个错误（Go 1.13+）
- **errors.As()**：从错误链中提取特定类型的错误
- **fmt.Errorf("%w", err)**：包装错误，保留错误链
- **自定义错误类型**：实现 `error` 接口，携带更多上下文
- **defer + recover**：捕获 panic 并转为 error 返回
- **最佳实践**：错误要处理，不要忽略；错误信息要包含上下文

```go
if err != nil {
    return fmt.Errorf("查询用户失败: %w", err) // 包装错误
}

// 错误链判断
if errors.Is(err, sql.ErrNoRows) {
    // 处理未找到
}

var myErr *MyError
if errors.As(err, &myErr) {
    // 提取特定错误类型
}
```

---

# 第二部分：Golang 进阶（15 题）

## 2.1 并发深入

### Q21: goroutine 泄漏有哪些常见场景？如何排查？

**频率：** ★★★★★

**参考答案：**

**常见场景：**

1. **channel 阻塞**：向无缓冲 channel 发送/接收，对方未就绪
2. **生产者-消费者不匹配**：生产者速度 > 消费者，缓冲区满后阻塞
3. **缺少退出机制**：goroutine 没有 context 或 done channel 控制退出
4. **HTTP 客户端未关闭 Body**：导致连接泄漏

**排查方法：**

- `runtime.NumGoroutine()` 监控 goroutine 数量
- `pprof` 工具：`import _ "net/http/pprof"` + `go tool pprof`
- `runtime.Stack()` 打印所有 goroutine 的堆栈
- `go test -race` 检测数据竞争

**预防方案：**

- 始终使用 `context.Context` 控制 goroutine 生命周期
- 使用带缓冲 channel 或 select + default
- 生产环境设置 goroutine 数量告警

---

### Q22: context 包的作用和使用场景？

**频率：** ★★★★★

**参考答案：**

**核心功能：**

- **取消信号传递**：`context.WithCancel()` —— 一个取消，所有子 goroutine 收到通知
- **超时控制**：`context.WithTimeout()` —— 超时自动取消
- **截止时间**：`context.WithDeadline()` —— 指定时间点取消
- **值传递**：`context.WithValue()` —— 请求级别的元数据传递（如 traceID）

**最佳实践：**

- context 作为函数的第一个参数传递（命名约定 `ctx context.Context`）
- 不要将 context 存入结构体，而是作为参数传递
- context.Value 的 key 应使用自定义类型避免冲突
- 外层函数创建 context，内层函数使用 context

```go
func handler(w http.ResponseWriter, r *http.Request) {
    ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
    defer cancel()
    result, err := fetchData(ctx)
    // ...
}
```

---

### Q23: sync.Pool 的原理和使用场景？

**频率：** ★★★★

**参考答案：**

**原理：**

- 临时对象池，用于缓存和复用对象，减少 GC 压力
- Get()：从池中获取对象，池空则调用 New 函数创建
- Put()：将对象放回池中
- **GC 时会清空池中对象**，所以不适合做持久缓存

**适用场景：**

- `bytes.Buffer` 复用（JSON 序列化、HTTP 响应）
- 数据库连接复用（但不推荐，应使用连接池）
- 临时对象频繁创建销毁的场景

**不适用场景：**

- 连接池（GC 会清空）
- 需要持久化的缓存（用 sync.Map 或 Redis）

---

## 2.2 内存与性能

### Q24: 什么是内存逃逸？如何分析？

**频率：** ★★★★★

**参考答案：**

**内存逃逸**：变量本应在栈上分配（函数结束自动回收），但编译器判断需要在堆上分配。

**常见逃逸场景：**

1. 返回局部变量的指针
2. 接口类型赋值（编译器无法确定大小）
3. 闭包引用外部变量
4. slice 动态扩容
5. 大对象（编译器保守策略）

**分析工具：**

```bash
go build -gcflags="-m" main.go    # 查看逃逸分析
go build -gcflags="-m -m" main.go # 更详细信息
```

**优化建议：**

- 减少不必要的指针返回，优先返回值
- 减少接口使用，使用具体类型
- 预分配 slice/map 容量
- 对象复用（sync.Pool）

---

### Q25: Go 的垃圾回收机制（GC）是怎样的？

**频率：** ★★★★★

**参考答案：**

**三色标记法 + 混合写屏障：**

1. **白色**：未扫描的对象（可能垃圾）
2. **灰色**：已扫描，但引用的对象未扫描完
3. **黑色**：已扫描完成，存活对象

**GC 流程：**

1. **标记准备**：所有对象标记为白色，STW（Stop The World）
2. **标记阶段**：从 root 开始遍历，灰色→黑色，引用对象白色→灰色
3. **标记终止**：STW，确保所有灰色对象处理完毕
4. **清除阶段**：并发清除白色对象

**优化特性：**

- **并发标记**：大部分工作与用户 goroutine 并发执行
- **混合写屏障**：结合 Dijkstra 和 Yuasa 屏障，减少 STW 时间
- **GC 频率调优**：`GOGC` 环境变量控制 GC 触发阈值（默认 100%）
- Go 1.19+：软内存上限 `GOMEMLIMIT`，更精准控制 GC

---

### Q26: Go 中如何实现单例模式？

**频率：** ★★★★

**参考答案：**

```go
// 方式一：sync.Once（推荐）
type Singleton struct{}

var (
    instance *Singleton
    once     sync.Once
)

func GetInstance() *Singleton {
    once.Do(func() {
        instance = &Singleton{}
    })
    return instance
}

// 方式二：init 函数（包级别初始化）
var instance2 = &Singleton{}
```

**sync.Once 的优势：**

- 线程安全，保证只执行一次
- 懒加载，首次使用时初始化
- 性能优于加锁方案（内部使用原子操作实现 double-check）

---

## 2.3 工程实践

### Q27: Go 项目的目录结构推荐？

**频率：** ★★★★

**参考答案：**

```
project/
├── cmd/            # 程序入口
│   └── server/
│       └── main.go
├── internal/       # 私有代码（不可被外部引用）
│   ├── handler/    # HTTP 处理器
│   ├── service/    # 业务逻辑
│   ├── repository/ # 数据访问层
│   ├── model/      # 数据模型
│   └── middleware/ # 中间件
├── pkg/            # 可被外部引用的公共库
├── api/            # API 定义（proto、OpenAPI）
├── config/         # 配置文件
├── scripts/        # 脚本
├── go.mod
└── go.sum
```

---

### Q28: Go 项目的依赖管理（go mod）常用命令？

**频率：** ★★★

**参考答案：**

```bash
go mod init <module>    # 初始化模块
go mod tidy             # 整理依赖（下载缺失、移除未使用）
go mod download         # 下载依赖到本地缓存
go mod vendor           # 创建 vendor 目录
go mod verify           # 校验依赖的完整性
go mod graph            # 打印依赖图
go mod edit             # 编辑 go.mod
go get <package>@version # 添加/更新依赖
```

**go.mod 中的版本规则：**

- `v1.2.3`：精确版本
- `v1.2`：>= v1.2.0, < v1.3.0
- `v1`：>= v1.0.0, < v2.0.0

---

### Q29: Go 如何进行单元测试和基准测试？

**频率：** ★★★★★

**参考答案：**

```go
// 单元测试：文件名 xxx_test.go
func TestAdd(t *testing.T) {
    result := Add(1, 2)
    if result != 3 {
        t.Errorf("expected 3, got %d", result)
    }
}

// 表驱动测试
func TestAddTable(t *testing.T) {
    tests := []struct {
        name string
        a, b, want int
    }{
        {"positive", 1, 2, 3},
        {"negative", -1, 1, 0},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            if got := Add(tt.a, tt.b); got != tt.want {
                t.Errorf("got %d, want %d", got, tt.want)
            }
        })
    }
}

// 基准测试
func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Add(1, 2)
    }
}

// Mock 测试：使用 gomock 或 testify/mock
```

```bash
go test ./...              # 运行所有测试
go test -v ./...           # 详细输出
go test -race ./...        # 竞态检测
go test -cover ./...       # 覆盖率
go test -bench=. ./...     # 基准测试
go test -benchmem ./...    # 基准测试 + 内存分配
```

---

### Q30: Go 代码中常见的性能优化手段？

**频率：** ★★★★★

**参考答案：**

1. **减少内存分配**：预分配 slice/map 容量、sync.Pool 复用对象
2. **字符串处理**：`strings.Builder` 代替 `+` 拼接、避免不必要的 `[]byte` ↔ `string` 转换
3. **减少锁竞争**：sync.RWMutex 读写分离、分片锁、sync.Map
4. **避免反射**：反射性能差，可用代码生成替代（如 jsoniter 代替 encoding/json）
5. **并发处理**：goroutine 并行处理独立任务、pipeline 模式
6. **编译优化**：`-ldflags="-s -w"` 去除调试信息、`-trimpath`
7. **内存对齐**：调整结构体字段顺序减少内存占用
8. **pprof 分析**：CPU/内存/锁竞争 profiling，找到瓶颈

---

### Q31: Go 1.18-1.23 有哪些重要新特性？

**频率：** ★★★★

**参考答案：**

| 版本 | 新特性 |
|------|--------|
| Go 1.18 | 泛型（Generics）、fuzzing 测试、workspaces |
| Go 1.19 | 软内存上限 GOMEMLIMIT、修订内存模型 |
| Go 1.20 | Profile-Guided Optimization（PGO）、切片转数组 |
| Go 1.21 | 内置 min/max/clear 函数、slog 结构化日志、WASI 支持 |
| Go 1.22 | for 循环变量语义修复（每次迭代独立变量）、增强 range over int/func |
| Go 1.23 | range over func、unique 包、timer/ticker 改进 |

---

### Q32: Go 中如何实现优雅退出？

**频率：** ★★★★★

**参考答案：**

```go
func main() {
    srv := &http.Server{Addr: ":8080"}

    // 启动服务
    go func() {
        if err := srv.ListenAndServe(); err != http.ErrServerClosed {
            log.Fatal(err)
        }
    }()

    // 监听信号
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    log.Println("Shutting down server...")

    // 优雅关闭：等待已有请求处理完毕
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    if err := srv.Shutdown(ctx); err != nil {
        log.Fatal("Server forced to shutdown:", err)
    }
    log.Println("Server exited")
}
```

---

### Q33: unsafe 包的使用场景和风险？

**频率：** ★★★

**参考答案：**

**使用场景：**

- `unsafe.Pointer`：任意指针类型转换
- `reflect.SliceHeader`：直接操作 slice 底层数组
- `reflect.StringHeader`：string ↔ []byte 零拷贝转换
- 结构体内存对齐优化

**风险：**

- 绕过类型系统，可能导致内存安全问题
- 不保证 Go 版本间的兼容性
- 可能导致难以调试的 bug

**零拷贝 string → []byte：**

```go
func strToBytes(s string) []byte {
    return *(*[]byte)(unsafe.Pointer(
        &reflect.SliceHeader{
            Data: (*reflect.StringHeader)(unsafe.Pointer(&s)).Data,
            Len:  len(s),
            Cap:  len(s),
        },
    ))
}
```

---

### Q34: init() 函数的执行顺序？

**频率：** ★★★★

**参考答案：**

**执行顺序：**

1. 被导入的包的 init() 先于当前包
2. 同一个包内，按源文件名字典序执行
3. 同一个文件内，按声明顺序执行（变量初始化 → init 函数）
4. 所有 init() 在 main() 之前执行

**特点：**

- init() 不能被调用，没有参数和返回值
- 每个文件可以有多个 init()
- 常用于注册驱动、初始化配置、设置默认值

---

### Q35: Go 中如何实现限流？

**频率：** ★★★★

**参考答案：**

```go
// 方式一：令牌桶（推荐 golang.org/x/time/rate）
limiter := rate.NewLimiter(100, 10) // 每秒100个，桶容量10
if !limiter.Allow() {
    return errors.New("rate limit exceeded")
}

// 方式二：滑动窗口
// 方式三：漏桶算法
// 方式四：固定窗口计数器

// HTTP 中间件示例
func RateLimitMiddleware(limiter *rate.Limiter) gin.HandlerFunc {
    return func(c *gin.Context) {
        if !limiter.Allow() {
            c.AbortWithStatusJSON(429, gin.H{"error": "too many requests"})
            return
        }
        c.Next()
    }
}
```

---

# 第三部分：MySQL（10 题）

### Q36: MySQL 的索引类型有哪些？分别适用什么场景？

**频率：** ★★★★★

**参考答案：**

| 索引类型 | 说明 | 适用场景 |
|---------|------|---------|
| B+Tree 索引 | 最常用，支持范围查询 | 等值查询、范围查询、排序 |
| 哈希索引 | 精确匹配 O(1) | 等值查询（Memory 引擎） |
| 全文索引 | 全文搜索 | 文本搜索（MATCH AGAINST） |
| 空间索引 | 地理空间数据 | GIS 查询 |
| 聚集索引 | 数据和索引在一起 | 主键查询 |
| 非聚集索引（二级索引） | 索引指向主键 | 非主键列查询 |

**联合索引最左前缀原则：**

- `(a, b, c)` 索引支持：`a`、`a,b`、`a,b,c` 查询
- 不支持：`b`、`c`、`b,c` 查询（除非有覆盖索引）

---

### Q37: 事务的 ACID 特性是什么？MySQL 如何保证？

**频率：** ★★★★★

**参考答案：**

| 特性 | 含义 | MySQL 实现机制 |
|------|------|---------------|
| 原子性（A） | 事务要么全部成功，要么全部回滚 | undo log（回滚日志） |
| 一致性（C） | 事务前后数据一致 | undo log + redo log + 约束 |
| 隔离性（I） | 并发事务互不影响 | MVCC + 锁机制 |
| 持久性（D） | 提交后数据永久保存 | redo log（重做日志） |

---

### Q38: MySQL 的隔离级别有哪些？各自解决什么问题？

**频率：** ★★★★★

**参考答案：**

| 隔离级别 | 脏读 | 不可重复读 | 幻读 | 性能 |
|---------|------|-----------|------|------|
| 读未提交（Read Uncommitted） | ✗ | ✗ | ✗ | 最高 |
| 读已提交（Read Committed） | ✓ | ✗ | ✗ | 高 |
| 可重复读（Repeatable Read） | ✓ | ✓ | ✗* | 中 |
| 串行化（Serializable） | ✓ | ✓ | ✓ | 最低 |

- MySQL InnoDB 默认 **可重复读（RR）**
- InnoDB 在 RR 级别通过 **MVCC + Next-Key Lock** 基本解决了幻读

---

### Q39: MVCC（多版本并发控制）的实现原理？

**频率：** ★★★★★

**参考答案：**

**核心组件：**

1. **隐藏列**：每行数据有 `trx_id`（事务ID）和 `roll_pointer`（回滚指针）
2. **undo log**：存储数据的历史版本
3. **Read View**：事务启动时创建的可见性判断快照

**可见性规则：**

- 创建 Read View 时，记录当前活跃事务列表
- `trx_id < min_trx_id`：可见（事务已提交）
- `trx_id >= max_trx_id`：不可见（事务在 Read View 之后开始）
- `min_trx_id <= trx_id < max_trx_id`：检查是否在活跃列表中，不在则可见

**RC 和 RR 的区别：**

- RC：每次 SELECT 创建新的 Read View
- RR：事务第一次 SELECT 时创建 Read View，后续复用

---

### Q40: MySQL 有哪些锁？InnoDB 的行锁有哪些？

**频率：** ★★★★★

**参考答案：**

**全局锁**：`FLUSH TABLES WITH READ LOCK`，用于全库备份

**表级锁**：表锁、元数据锁（MDL）、意向锁

**InnoDB 行锁：**

| 锁类型 | 说明 |
|--------|------|
| Record Lock | 记录锁，锁定索引记录 |
| Gap Lock | 间隙锁，锁定索引记录之间的间隙 |
| Next-Key Lock | Record Lock + Gap Lock，左开右闭 |
| Insert Intention Lock | 插入意向锁 |

**死锁处理：**

- InnoDB 自动检测死锁，回滚代价最小的事务
- `SHOW ENGINE INNODB STATUS` 查看死锁日志
- 预防：按固定顺序访问表和行、保持事务简短、使用合适隔离级别

---

### Q41: 如何进行 SQL 慢查询优化？

**频率：** ★★★★★

**参考答案：**

**定位慢查询：**

1. 开启慢查询日志：`slow_query_log = ON`，`long_query_time = 1`
2. 使用 `EXPLAIN` 分析执行计划
3. `pt-query-digest` 工具分析慢查询日志

**优化策略：**

- **索引优化**：添加合适的索引、利用覆盖索引、避免索引失效
- **SQL 改写**：避免 SELECT *、避免子查询改 JOIN、合理使用 LIMIT
- **索引失效场景**：函数操作列、隐式类型转换、左模糊 LIKE '%xx'、OR 条件（部分列无索引）、不等于（!=）
- **表结构优化**：字段类型选择、适当分表分库
- **架构优化**：读写分离、缓存（Redis）、分库分表

---

### Q42: 分库分表的方案有哪些？如何选择分片键？

**频率：** ★★★★

**参考答案：**

**垂直拆分：**

- 垂直分库：按业务域拆分到不同数据库
- 垂直分表：大表拆分为多个小表（宽表拆窄表）

**水平拆分：**

- 水平分库：相同结构的表分布到不同库
- 水平分表：同一张表的数据按规则分布到多张表

**分片策略：**

| 策略 | 说明 | 优缺点 |
|------|------|--------|
| Hash 取模 | `hash(key) % N` | 数据均匀，扩容需数据迁移 |
| 范围分片 | 按时间/ID 范围 | 扩容简单，可能热点 |
| 一致性 Hash | Hash 环 | 扩容影响最小 |

**分片键选择原则：**

- 查询频率高的字段
- 数据分布均匀
- 尽量避免跨分片查询

---

### Q43: MySQL 主从复制的原理是什么？有哪些复制方式？

**频率：** ★★★★

**参考答案：**

**复制原理：**

1. Master 将变更写入 binlog
2. Slave 的 IO Thread 请求 Master 的 binlog
3. Master 的 Dump Thread 发送 binlog 事件
4. Slave 的 IO Thread 写入 relay log
5. Slave 的 SQL Thread 重放 relay log

**复制方式：**

| 方式 | 说明 | 延迟 |
|------|------|------|
| 异步复制 | Master 写入 binlog 即返回 | 可能有延迟 |
| 半同步复制 | 至少一个 Slave 确认接收 | 较低延迟 |
| 全同步复制 | 所有 Slave 确认写入 | 最高一致性，性能最低 |

**延迟优化：**

- 并行复制（多线程回放）
- 降低大事务
- 读写分离时考虑最终一致性

---

### Q44: InnoDB 和 MyISAM 有什么区别？

**频率：** ★★★★

**参考答案：**

| 特性 | InnoDB | MyISAM |
|------|--------|--------|
| 事务支持 | ✓ | ✗ |
| 行级锁 | ✓ | ✗（表级锁） |
| 外键 | ✓ | ✗ |
| 崩溃恢复 | ✓（redo log） | ✗ |
| MVCC | ✓ | ✗ |
| 全文索引 | ✓（5.6+） | ✓ |
| 存储空间 | 较大（数据和索引在一起） | 较小 |
| COUNT(*) | 不缓存，实时统计 | 缓存，速度快 |
| 适用场景 | 高并发 OLTP | 读多写少、不需要事务 |

---

### Q45: 如何设计一个高性能的数据库表？

**频率：** ★★★★

**参考答案：**

1. **字段类型选择**：能用小类型就不用大类型（TINYINT vs INT）、定长优先
2. **主键设计**：自增 ID 或雪花算法（避免页分裂）、避免使用 UUID（太长且无序）
3. **索引设计**：合理创建索引、避免冗余索引、利用覆盖索引
4. **反范式设计**：适当冗余字段减少 JOIN、读写分离
5. **时间字段**：用 DATETIME 或 TIMESTAMP（注意 2038 问题）
6. **大字段处理**：TEXT/BLOB 单独分表
7. **软删除**：增加 `deleted_at` 字段，避免物理删除
8. **审计字段**：`created_at`、`updated_at`、`created_by`

---

# 第四部分：Redis（10 题）

### Q46: Redis 支持哪些数据结构？底层实现是什么？

**频率：** ★★★★★

**参考答案：**

| 数据类型 | 底层编码 | 适用场景 |
|---------|---------|---------|
| String | SDS（Simple Dynamic String） | 缓存、计数器、分布式锁 |
| List | quicklist（双向链表 + 压缩列表） | 消息队列、最新列表 |
| Hash | ziplist / hashtable | 对象存储、购物车 |
| Set | hashtable / intset | 标签、共同好友 |
| ZSet（有序集合） | ziplist / skiplist + hashtable | 排行榜、延迟队列 |

**高级数据结构：**

- **Bitmap**：位图，用户签到、在线状态
- **HyperLogLog**：基数统计，UV 统计
- **GEO**：地理位置，附近的人
- **Stream**：消息流，消费者组（5.0+）

---

### Q47: Redis 的缓存穿透、缓存击穿、缓存雪崩分别是什么？如何解决？

**频率：** ★★★★★

**参考答案：**

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| **缓存穿透** | 查询不存在的数据，缓存和DB都没有 | 布隆过滤器、缓存空值（短TTL）、参数校验 |
| **缓存击穿** | 热点key过期，大量请求打到DB | 互斥锁（SETNX）、逻辑过期（不设物理TTL）、永不过期+异步更新 |
| **缓存雪崩** | 大量key同时过期，或Redis宕机 | 过期时间加随机值、Redis高可用（哨兵/集群）、多级缓存、限流降级 |

---

### Q48: Redis 的持久化机制 RDB 和 AOF 有什么区别？

**频率：** ★★★★★

**参考答案：**

| 特性 | RDB | AOF |
|------|-----|-----|
| 方式 | 快照（二进制） | 日志（追加写命令） |
| 恢复速度 | 快 | 慢 |
| 文件大小 | 小（压缩） | 大 |
| 数据安全 | 可能丢失最近数据 | 最多丢失1秒（everysec） |
| 性能影响 | fork时可能有瞬间延迟 | 持续写入 |
| 适用场景 | 备份、灾难恢复 | 数据安全要求高 |

**混合持久化（Redis 4.0+）：** RDB + AOF 增量，结合两者优势。

---

### Q49: Redis 的过期删除策略和内存淘汰策略？

**频率：** ★★★★★

**参考答案：**

**过期删除策略（三种配合）：**

1. **定时删除**：创建定时器，到期立即删除（内存友好，CPU 不友好）
2. **惰性删除**：访问时检查是否过期（CPU 友好，内存不友好）
3. **定期删除**：每隔一段时间随机检查一批 key（折中方案）

**内存淘汰策略（maxmemory-policy）：**

| 策略 | 说明 |
|------|------|
| `noeviction` | 不淘汰，写入返回错误（默认） |
| `allkeys-lru` | 所有key中淘汰最近最少使用的 |
| `volatile-lru` | 设置了TTL的key中淘汰最近最少使用的 |
| `allkeys-random` | 随机淘汰所有key |
| `volatile-random` | 随机淘汰设置了TTL的key |
| `volatile-ttl` | 淘汰TTL最小的key |
| `allkeys-lfu` | 淘汰使用频率最低的（Redis 4.0+） |

---

### Q50: Redis 集群模式有哪些？如何选型？

**频率：** ★★★★★

**参考答案：**

| 模式 | 说明 | 优缺点 |
|------|------|--------|
| 主从复制 | 一主多从，读写分离 | 简单，但手动故障转移 |
| 哨兵（Sentinel） | 自动故障转移 + 主从复制 | 高可用，但写入仍单点 |
| Cluster | 数据分片 + 高可用 | 水平扩展，官方推荐 |

**Cluster 要点：**

- 16384 个 Hash Slot，每个节点负责一部分
- 客户端路由：MOVED 重定向
- 节点间 Gossip 协议通信
- 至少 6 个节点（3主3从）

**选型建议：**

- 数据量小（< 单机内存）：单机 + 哨兵
- 数据量大、需要水平扩展：Cluster
- 超大数据量：Redis Cluster + 代理（Codis）

---

### Q51: Redis 如何实现分布式锁？

**频率：** ★★★★★

**参考答案：**

```go
// 加锁（SET key value NX PX timeout）
// NX：不存在才设置（互斥）
// PX：设置过期时间（防死锁）
// value：唯一标识（防误删）

// 加锁
func tryLock(ctx context.Context, rdb *redis.Client, key, value string, ttl time.Duration) (bool, error) {
    return rdb.SetNX(ctx, key, value, ttl).Result()
}

// 解锁（Lua 脚本保证原子性）
const unlockScript = `
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end
`

func unlock(ctx context.Context, rdb *redis.Client, key, value string) error {
    _, err := rdb.Eval(ctx, unlockScript, []string{key}, value).Result()
    return err
}
```

**Redisson 方案（更完善）：**

- 看门狗机制：自动续期
- 可重入锁
- 红锁（RedLock）：多节点分布式锁

---

### Q52: Redis 和 MySQL 数据一致性如何保证？

**频率：** ★★★★★

**参考答案：**

**常见方案：**

1. **Cache Aside（旁路缓存）**：先更新DB，再删除缓存
   - 读：先读缓存，miss 读DB，写入缓存
   - 写：先更新DB，再删除缓存

2. **延迟双删**：更新DB前删缓存 → 更新DB → 延迟N毫秒 → 再删缓存

3. **监听 Binlog**：Canal 监听 MySQL binlog，异步更新/删除缓存

4. **消息队列**：更新DB后发消息，消费者更新缓存

**最终一致性 vs 强一致性：**

- 大多数业务场景接受最终一致性（延迟双删 + Binlog 监听）
- 强一致性方案：分布式事务（Seata）、TCC、Saga

---

### Q53: Redis 的热 Key 问题如何解决？

**频率：** ★★★★

**参考答案：**

**问题：** 某个 key 访问量极高，单个 Redis 节点成为瓶颈。

**解决方案：**

1. **本地缓存**：使用 Go 的 `sync.Map` 或 `bigcache` 做一级缓存
2. **Key 分散**：将热点 key 复制多份（如 `key_1`、`key_2`...`key_N`），客户端随机访问
3. **读写分离**：增加从节点分担读压力
4. **提前预热**：活动前将热点数据加载到缓存

---

### Q54: Redis Pipeline 的作用？

**频率：** ★★★

**参考答案：**

- **Pipeline**：将多个命令打包一次性发送，减少网络往返次数（RTT）
- 普通模式：N 条命令 = N 次 RTT
- Pipeline 模式：N 条命令 = 1 次 RTT
- **注意**：Pipeline 中的命令不是原子执行的，需要原子性用 MULTI/EXEC 或 Lua 脚本

---

### Q55: Redis 做消息队列的优缺点？

**频率：** ★★★

**参考答案：**

| 方案 | 优点 | 缺点 |
|------|------|------|
| List（LPUSH/BRPOP） | 简单 | 无确认机制、无消费者组 |
| Pub/Sub | 实时性好 | 消息不持久化、离线消费者丢失 |
| Stream（5.0+） | 持久化、消费者组、ACK | 功能不如专业 MQ |

**建议：** 简单场景用 Redis Stream，复杂场景用专业 MQ（Kafka/RabbitMQ）。

---

# 第五部分：MQ 消息队列（8 题）

### Q56: 为什么需要消息队列？解决了什么问题？

**频率：** ★★★★★

**参考答案：**

**三大核心作用：**

1. **解耦**：生产者和消费者不需要直接调用
2. **异步**：非核心链路异步处理，提升响应速度
3. **削峰填谷**：高并发时消息排队，消费者按能力消费

**典型场景：**

- 用户注册后发短信、发优惠券（异步）
- 秒杀系统：请求入队，后端按序处理（削峰）
- 日志收集：各服务发日志到 MQ，日志服务消费（解耦）

---

### Q57: Kafka、RabbitMQ、RocketMQ 如何选型？

**频率：** ★★★★★

**参考答案：**

| 特性 | RabbitMQ | Kafka | RocketMQ |
|------|----------|-------|----------|
| 吞吐量 | 万级 | 百万级 | 十万级 |
| 延迟 | 微秒级 | 毫秒级 | 毫秒级 |
| 消息可靠性 | 高 | 高 | 最高 |
| 消息回溯 | 不支持 | 支持（offset） | 支持 |
| 事务消息 | 不支持 | 不支持（支持幂等） | 支持 |
| 延迟消息 | 插件支持 | 不原生支持 | 支持 |
| 适用场景 | 中小规模、复杂路由 | 大数据、日志、流处理 | 电商、金融、事务消息 |

**选型建议：**

- 中小项目、需要复杂路由：**RabbitMQ**
- 大数据量、高吞吐、日志收集：**Kafka**
- 电商/金融、需要事务消息：**RocketMQ**

---

### Q58: 如何保证消息不丢失？

**频率：** ★★★★★

**参考答案：**

**三个环节：**

1. **生产者端**：
   - Kafka：`acks=all` + 重试
   - RabbitMQ：publisher confirm + 持久化
   - RocketMQ：同步发送 + 重试

2. **MQ 端**：
   - 消息持久化到磁盘
   - 集群 + 副本（Kafka replication factor >= 2）
   - RabbitMQ：队列持久化 + 消息持久化

3. **消费者端**：
   - 手动 ACK（消费成功后才确认）
   - 消费失败重试 + 死信队列

---

### Q59: 如何保证消息的顺序消费？

**频率：** ★★★★★

**参考答案：**

**方案：**

1. **单队列单消费者**：最简单，但吞吐量低
2. **分区有序**：Kafka 的 partition 保证分区内有序，相同 key 发到同一 partition
3. **RocketMQ**：MessageQueueSelector 按 key 哈希选择队列
4. **业务层面**：订单号作为路由 key，保证同一订单的消息有序

**注意：** 全局有序性能差，通常只需要**局部有序**（同一业务 key 有序即可）。

---

### Q60: 如何处理消息的重复消费（幂等性）？

**频率：** ★★★★★

**参考答案：**

**幂等方案：**

1. **全局唯一ID**：每条消息携带唯一 msgId，消费前检查是否已处理（Redis SETNX 或数据库唯一索引）
2. **数据库唯一约束**：利用唯一索引防重复插入
3. **乐观锁**：版本号机制（`UPDATE ... WHERE version = ?`）
4. **Redis 状态标记**：消费前 SETNX，消费后设置完成标记
5. **去重表**：记录已消费的 msgId

```go
// Redis 幂等检查
func consumeWithIdempotent(msgID string, handler func() error) error {
    ok, _ := rdb.SetNX(ctx, "consumed:"+msgID, 1, 24*time.Hour).Result()
    if !ok {
        return nil // 已消费，跳过
    }
    if err := handler(); err != nil {
        rdb.Del(ctx, "consumed:"+msgID) // 失败回滚
        return err
    }
    return nil
}
```

---

### Q61: 消息积压如何处理？

**频率：** ★★★★

**参考答案：**

**紧急处理：**

1. **快速扩容消费者**：增加消费者实例数量
2. **临时队列**：将积压消息转移到临时 topic，多消费者并行处理
3. **服务降级**：非核心链路暂停，集中资源处理积压

**预防方案：**

1. **监控告警**：队列长度超过阈值告警
2. **合理设置消费者数量**：根据消费能力调整
3. **限流**：生产端限流，避免突发流量
4. **死信队列**：消费失败的消息进入 DLQ，人工处理

---

### Q62: RabbitMQ 的 Exchange 类型有哪些？

**频率：** ★★★★

**参考答案：**

| 类型 | 路由规则 | 场景 |
|------|---------|------|
| Direct | 精确匹配 routing key | 点对点、日志级别 |
| Fanout | 广播到所有绑定队列 | 广播通知 |
| Topic | 通配符匹配（* 匹配一个词，# 匹配零或多个） | 多条件路由 |
| Headers | 匹配消息头（不常用） | 复杂路由 |

---

### Q63: Kafka 的分区和消费者组机制？

**频率：** ★★★★

**参考答案：**

**分区（Partition）：**

- Topic 物理上分为多个 Partition
- Partition 有序，不同 Partition 并行
- 同一 Partition 内消息有序

**消费者组（Consumer Group）：**

- 一个组内的消费者共同消费一个 Topic
- 一个 Partition 同一时刻只能被组内一个消费者消费
- 消费者数量 > Partition 数量时，多余消费者空闲
- 消费者加入/离开时触发 Rebalance

---

# 第六部分：gRPC 微服务（8 题）

### Q64: gRPC 和 REST API 有什么区别？

**频率：** ★★★★★

**参考答案：**

| 特性 | gRPC | REST API |
|------|------|----------|
| 协议 | HTTP/2 | HTTP/1.1 |
| 数据格式 | Protobuf（二进制） | JSON（文本） |
| 序列化性能 | 高（体积小、速度快） | 低（体积大、解析慢） |
| 流式支持 | 双向流、客户端流、服务端流 | 有限（SSE 仅服务端推送） |
| 代码生成 | 自动生成客户端/服务端代码 | 手动编写或 OpenAPI 生成 |
| 浏览器支持 | 需要 gRPC-Web 代理 | 原生支持 |
| 适用场景 | 微服务间通信、高性能 | 对外 API、浏览器调用 |

---

### Q65: Protobuf 的优缺点？

**频率：** ★★★★

**参考答案：**

**优点：**

- 序列化后体积小（JSON 的 1/3 ~ 1/10）
- 序列化/反序列化速度快
- 强类型 Schema，前后端接口一致
- 向后兼容（新增字段不影响旧版本）
- 支持多语言

**缺点：**

- 可读性差（二进制格式）
- 需要编译工具链（protoc）
- 不适合对外暴露给前端（需 gRPC-Web 转换）

---

### Q66: gRPC 的四种通信模式？

**频率：** ★★★★★

**参考答案：**

```protobuf
// 1. 一元 RPC（Unary）
rpc GetUser(GetUserRequest) returns (GetUserResponse);

// 2. 服务端流式（Server Streaming）
rpc ListUsers(ListUsersRequest) returns (stream User);

// 3. 客户端流式（Client Streaming）
rpc CreateUsers(stream User) returns (CreateUsersResponse);

// 4. 双向流式（Bidirectional Streaming）
rpc Chat(stream ChatMessage) returns (stream ChatMessage);
```

**使用场景：**

- 一元：普通 CRUD
- 服务端流：大数据量分批返回、实时推送
- 客户端流：文件上传、批量数据提交
- 双向流：聊天、实时协作

---

### Q67: gRPC 如何实现拦截器（Interceptor）？

**频率：** ★★★★

**参考答案：**

```go
// 一元拦截器
func UnaryInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
    start := time.Now()
    // 前置处理：认证、日志、trace
    md, _ := metadata.FromIncomingContext(ctx)
    log.Printf("method: %s, metadata: %v", info.FullMethod, md)

    // 调用实际处理函数
    resp, err := handler(ctx, req)

    // 后置处理：记录耗时、错误
    log.Printf("method: %s, duration: %v, error: %v", info.FullMethod, time.Since(start), err)
    return resp, err
}

// 注册拦截器
server := grpc.NewServer(
    grpc.UnaryInterceptor(UnaryInterceptor),
)
```

**常见用途：** 认证鉴权、日志记录、链路追踪、限流、熔断。

---

### Q68: 微服务架构中如何实现服务注册与发现？

**频率：** ★★★★★

**参考答案：**

**主流方案：**

| 方案 | 说明 | 适用场景 |
|------|------|---------|
| Consul | 健康检查 + KV 存储 + 服务网格 | Go 生态首选 |
| Etcd | 分布式 KV 存储（K8s 原生） | K8s 环境 |
| Nacos | 阿里开源，配置中心 + 服务发现 | Java/Go 混合生态 |
| Eureka | Netflix 开源 | Java 生态（已停更） |

**工作流程：**

1. 服务启动时注册到注册中心（IP + 端口 + 元数据）
2. 定时发送心跳维持注册状态
3. 消费者从注册中心获取服务列表（客户端负载均衡）
4. 服务下线时注销

---

### Q69: 微服务之间如何进行链路追踪？

**频率：** ★★★★

**参考答案：**

**OpenTelemetry 标准：**

- **TraceID**：全局唯一，贯穿整个请求链路
- **SpanID**：每个服务调用的唯一标识
- **Context Propagation**：通过 HTTP Header 或 gRPC metadata 传递

**Go 实现：**

```go
import (
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/exporters/jaeger"
    "go.opentelemetry.io/otel/sdk/trace"
)

// 初始化 TracerProvider
func initTracer() *trace.TracerProvider {
    exp, _ := jaeger.New(jaeger.WithCollectorEndpoint(jaeger.WithEndpoint("http://localhost:14268/api/traces")))
    tp := trace.NewTracerProvider(trace.WithBatcher(exp))
    otel.SetTracerProvider(tp)
    return tp
}
```

**可视化后端：** Jaeger、Zipkin、SkyWalking

---

### Q70: 微服务的熔断、限流、降级如何实现？

**频率：** ★★★★★

**参考答案：**

**Go 常用库：**

- **熔断**：`github.com/sony/gobreaker`、`github.com/afex/hystrix-go`
- **限流**：`golang.org/x/time/rate`（令牌桶）
- **降级**：自定义降级策略 + 配置中心动态开关

**熔断器状态机：**

```
关闭（正常）→ 失败率超阈值 → 打开（拒绝请求）→ 超时后 → 半开（放行少量请求探测）
→ 探测成功 → 关闭 | 探测失败 → 打开
```

```go
// gobreaker 示例
cb := gobreaker.NewCircuitBreaker(gobreaker.Settings{
    Name:        "order-service",
    MaxRequests: 3,              // 半开状态最大请求数
    Interval:    10 * time.Second, // 关闭→打开的时间窗口
    Timeout:     30 * time.Second, // 打开→半开的等待时间
    ReadyToTrip: func(counts gobreaker.Counts) bool {
        return counts.ConsecutiveFailures > 5 // 连续失败5次触发熔断
    },
})
```

---

### Q71: 微服务的数据一致性如何保证？

**频率：** ★★★★★

**参考答案：**

| 方案 | 说明 | 适用场景 |
|------|------|---------|
| **2PC（两阶段提交）** | 强一致性，性能差 | 跨库事务 |
| **TCC（Try-Confirm-Cancel）** | 业务层面补偿 | 金融、支付 |
| **Saga** | 长事务编排 | 电商订单流程 |
| **本地消息表** | 本地事务 + 消息表 + 定时扫描 | 最终一致性 |
| **事务消息** | RocketMQ 事务消息 | 订单+库存 |
| **Seata** | 阿里开源分布式事务框架 | Java/Go 混合 |

**Go 项目推荐：** 本地消息表 + MQ 实现最终一致性。

---

# 第七部分：Nginx（6 题）

### Q72: Nginx 的核心工作原理？

**频率：** ★★★★

**参考答案：**

- **Master-Worker 架构**：Master 管理 Worker，Worker 处理请求
- **事件驱动 + 异步非阻塞**：基于 epoll/kqueue 实现高并发
- **Worker 进程数**：通常设置为 CPU 核心数
- **单 Worker 可处理数万并发连接**

**请求处理流程：**

```
客户端 → Nginx（反向代理）→ 后端服务
         ↑
    静态文件直接返回
```

---

### Q73: Nginx 常用配置场景？

**频率：** ★★★★★

**参考答案：**

```nginx
# 1. 反向代理
location /api/ {
    proxy_pass http://backend:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

# 2. 负载均衡
upstream backend {
    server 10.0.0.1:8080 weight=3;
    server 10.0.0.2:8080 weight=2;
    server 10.0.0.3:8080 backup;
    # 负载均衡策略：round-robin（默认）、ip_hash、least_conn、random
}

# 3. HTTPS
server {
    listen 443 ssl;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
}

# 4. 限流
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
location /api/ {
    limit_req zone=api burst=20 nodelay;
}

# 5. 静态文件服务
location /static/ {
    alias /var/www/static/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}

# 6. Gzip 压缩
gzip on;
gzip_types text/plain application/json;
gzip_min_length 1024;
```

---

### Q74: Nginx 负载均衡策略有哪些？

**频率：** ★★★★

**参考答案：**

| 策略 | 说明 | 适用场景 |
|------|------|---------|
| round-robin（轮询） | 默认，按顺序分配 | 服务器性能相近 |
| weight（加权轮询） | 按权重分配 | 服务器性能不同 |
| ip_hash | 按 IP 哈希分配 | 需要会话保持 |
| least_conn | 最少连接数 | 长连接场景 |
| random | 随机分配 | 简单场景 |
| hash | 自定义 key 哈希 | 按 URL/参数路由 |

---

### Q75: Nginx 如何实现灰度发布？

**频率：** ★★★★

**参考答案：**

```nginx
# 方式一：基于 Cookie/Header
split_clients "${http_x_canary}" $variant {
    0%    "canary";
    *     "stable";
}

upstream canary {
    server 10.0.0.1:8080;  # 新版本
}
upstream stable {
    server 10.0.0.2:8080;  # 旧版本
}

server {
    location / {
        proxy_pass http://$variant;
    }
}

# 方式二：基于 IP 段
geo $canary {
    default         0;
    192.168.1.0/24  1;  # 特定 IP 走灰度
}
```

---

### Q76: Nginx 如何配置跨域（CORS）？

**频率：** ★★★

**参考答案：**

```nginx
location /api/ {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
    add_header Access-Control-Allow-Headers "Content-Type, Authorization";
    add_header Access-Control-Max-Age 3600;

    # 预检请求直接返回
    if ($request_method = OPTIONS) {
        return 204;
    }

    proxy_pass http://backend;
}
```

---

### Q77: Nginx 502 和 504 错误分别是什么原因？

**频率：** ★★★★

**参考答案：**

| 错误 | 含义 | 常见原因 |
|------|------|---------|
| **502 Bad Gateway** | Nginx 收到上游无效响应 | 后端服务未启动、端口错误、后端崩溃 |
| **504 Gateway Timeout** | Nginx 等待上游响应超时 | 后端处理太慢、`proxy_read_timeout` 设置过小 |

**排查方法：**

- 检查后端服务状态和日志
- 调整 `proxy_connect_timeout`、`proxy_read_timeout`
- 检查防火墙和网络连通性

---

# 第八部分：部署与 Docker（8 题）

### Q78: Dockerfile 的最佳实践？

**频率：** ★★★★★

**参考答案：**

```dockerfile
# 1. 多阶段构建（减小镜像体积）
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o server .

# 2. 运行阶段使用最小基础镜像
FROM alpine:3.19
RUN apk --no-cache add ca-certificates tzdata
WORKDIR /app
COPY --from=builder /app/server .
COPY --from=builder /app/configs ./configs
EXPOSE 8080
ENTRYPOINT ["./server"]
```

**最佳实践：**

- 使用多阶段构建减小镜像
- 合理利用缓存层（少变动的层放前面）
- 使用 `.dockerignore` 排除不需要的文件
- 不使用 root 用户运行（`RUN adduser`）
- 合并 RUN 指令减少层数
- 使用特定标签而非 `latest`

---

### Q79: Docker Compose 的使用场景？

**频率：** ★★★★

**参考答案：**

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - mysql
      - redis
    environment:
      - DB_HOST=mysql
      - REDIS_HOST=redis
    restart: always

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: mydb
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mysql_data:
```

**适用场景：** 本地开发环境、多服务编排、CI/CD 测试环境。

---

### Q80: Kubernetes 的核心概念？

**频率：** ★★★★★

**参考答案：**

| 概念 | 说明 |
|------|------|
| Pod | 最小部署单元，包含一个或多个容器 |
| Deployment | 管理 Pod 的副本数、滚动更新 |
| Service | Pod 的稳定网络入口（负载均衡 + 服务发现） |
| Ingress | HTTP 路由规则（域名 → Service） |
| ConfigMap | 配置数据 |
| Secret | 敏感数据（密码、证书） |
| PVC/PV | 持久化存储 |
| Namespace | 资源隔离 |

**Go 服务部署到 K8s：**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        ports:
        - containerPort: 8080
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 3
          periodSeconds: 5
```

---

### Q81: CI/CD 流水线如何设计？

**频率：** ★★★★

**参考答案：**

**典型流程：**

```
代码提交 → 代码检查（lint）→ 单元测试 → 构建镜像 → 推送镜像仓库 → 部署到 K8s
```

**Go 项目 CI/CD 示例（GitHub Actions）：**

```yaml
name: CI/CD
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      - run: go test -race -cover ./...
      - run: golangci-lint run

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build & Push Docker Image
        run: |
          docker build -t myapp:${{ github.sha }} .
          docker push registry/myapp:${{ github.sha }}
      - name: Deploy to K8s
        run: |
          kubectl set image deployment/myapp myapp=registry/myapp:${{ github.sha }}
```

---

### Q82: 容器化部署中如何管理配置？

**频率：** ★★★

**参考答案：**

| 方案 | 说明 | 适用场景 |
|------|------|---------|
| ConfigMap | K8s 原生配置管理 | K8s 环境 |
| 环境变量 | Docker/K8s 原生支持 | 简单配置 |
| 配置文件挂载 | 将配置文件挂载到容器 | 复杂配置 |
| 配置中心 | Apollo、Nacos、Consul | 动态配置、多环境 |
| .env 文件 | Docker Compose 支持 | 本地开发 |

**最佳实践：**

- 敏感信息用 Secret，非敏感用 ConfigMap
- 配置与代码分离，不硬编码
- 支持热更新（配置中心 + 文件监听）

---

### Q83: 服务健康检查如何设计？

**频率：** ★★★★

**参考答案：**

**三级健康检查：**

1. **存活检查（Liveness）**：服务是否存活，失败则重启容器
2. **就绪检查（Readiness）**：服务是否可以接收流量，失败则从负载均衡移除
3. **启动检查（Startup）**：服务是否启动完成（慢启动场景）

```go
// Go 健康检查端点
func healthHandler(w http.ResponseWriter, r *http.Request) {
    // 检查依赖
    if err := checkDB(); err != nil {
        http.Error(w, "db unhealthy", http.StatusServiceUnavailable)
        return
    }
    if err := checkRedis(); err != nil {
        http.Error(w, "redis unhealthy", http.StatusServiceUnavailable)
        return
    }
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
```

---

### Q84: 如何实现零停机部署？

**频率：** ★★★★★

**参考答案：**

**K8s 滚动更新（Rolling Update）：**

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1          # 最多多创建1个Pod
      maxUnavailable: 0    # 不允许有Pod不可用
```

**配合方案：**

1. **优雅退出**：监听 SIGTERM 信号，等待请求处理完毕
2. **就绪探针**：新 Pod 通过就绪检查后才接收流量
3. **PreStop Hook**：在 Pod 终止前执行清理操作（sleep 几秒等待连接关闭）
4. **数据库迁移**：向前兼容的数据库变更（先加列再删列）

---

### Q85: 日志收集方案如何设计？

**频率：** ★★★

**参考答案：**

**ELK 技术栈：**

```
应用 → Filebeat（采集）→ Kafka（缓冲）→ Logstash（处理）→ Elasticsearch（存储）→ Kibana（展示）
```

**Go 结构化日志：**

```go
import "log/slog"

// 初始化
logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
    Level: slog.LevelInfo,
}))
slog.SetDefault(logger)

// 使用
slog.Info("user login", "user_id", userID, "ip", clientIP, "duration", time.Since(start))
```

**日志规范：**

- 使用结构化日志（JSON 格式）
- 包含 traceID、时间戳、级别、模块、消息、上下文
- 日志级别：DEBUG < INFO < WARN < ERROR < FATAL
- 敏感信息脱敏

---

# 第九部分：实战场景题（15 题）

### Q86: 设计一个秒杀系统，你会怎么做？

**频率：** ★★★★★

**参考答案：**

**架构设计：**

```
用户请求 → Nginx（限流）→ API 网关（鉴权/限流）→ 秒杀服务 → Redis（预扣库存）
                                                              ↓
                                                        MQ（异步下单）
                                                              ↓
                                                        订单服务（创建订单）
                                                              ↓
                                                        数据库（落库）
```

**关键点：**

1. **前端限流**：按钮置灰、验证码、答题
2. **Nginx 限流**：`limit_req` 控制请求速率
3. **API 限流**：令牌桶/漏桶算法
4. **Redis 预扣库存**：`DECR` 原子操作，防止超卖
5. **MQ 异步下单**：削峰，避免数据库被打垮
6. **数据库乐观锁**：`UPDATE stock SET count = count - 1 WHERE id = ? AND count > 0`
7. **超时未支付**：定时任务关闭订单、回滚库存

---

### Q87: 设计一个短链接系统？

**频率：** ★★★★

**参考答案：**

**核心流程：**

1. 长链接 → 发号器生成唯一 ID → Base62 编码 → 短链接
2. 短链接 → 查缓存（Redis）→ 未命中查 DB → 重定向

**发号器方案：**

- **数据库自增 ID**：简单但有性能瓶颈
- **雪花算法**：分布式唯一 ID，趋势递增
- **号段模式**：一次从 DB 获取一批 ID，本地分配

**存储设计：**

```sql
CREATE TABLE short_url (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    original_url VARCHAR(2048) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expire_at TIMESTAMP NULL,
    INDEX idx_short_code (short_code)
);
```

**优化：**

- Redis 缓存热点短链接
- 布隆过滤器判断不存在的短链接（防穿透）
- 分库分表（按 short_code 哈希）

---

### Q88: 设计一个分布式 ID 生成器？

**频率：** ★★★★

**参考答案：**

**方案对比：**

| 方案 | 优点 | 缺点 |
|------|------|------|
| UUID | 简单、无中心化 | 无序、太长、索引性能差 |
| 数据库自增 | 简单有序 | 性能瓶颈、单点 |
| 雪花算法（Snowflake） | 有序、高性能、分布式 | 依赖时钟 |
| 号段模式 | 高性能 | ID 不连续 |
| Leaf（美团） | 号段 + Snowflake | 需要额外组件 |

**雪花算法（Go 实现）：**

```
| 1位符号位 | 41位时间戳 | 10位机器ID | 12位序列号 |
```

- 每毫秒可生成 4096 个 ID
- 时钟回拨问题：等待时钟追上 或 报错

---

### Q89: 如何设计一个高可用的 API 网关？

**频率：** ★★★★

**参考答案：**

**核心功能：**

1. **路由转发**：根据路径/Host 路由到后端服务
2. **认证鉴权**：JWT 验证、RBAC 权限
3. **限流熔断**：令牌桶限流、熔断器
4. **日志追踪**：请求日志、链路追踪
5. **协议转换**：HTTP ↔ gRPC
6. **灰度发布**：基于 Header/Cookie 路由

**Go 技术选型：**

- 自研：Gin + 中间件链
- 开源：Kong、APISIX、Envoy
- 轻量：Kratos（Bilibili）

---

### Q90: 如何处理数据库的读写分离？

**频率：** ★★★★

**参考答案：**

**架构：**

```
写请求 → Master DB
读请求 → Slave DB（多个从库负载均衡）
```

**Go 实现方案：**

1. **代码层面**：定义 `ReadDB` 和 `WriteDB` 连接，根据操作类型选择
2. **中间件层面**：GORM 插件自动路由读写
3. **代理层面**：MyCat、ProxySQL 自动读写分离

**注意事项：**

- 主从延迟：写入后立即读取可能读不到（最终一致性）
- 解决方案：关键读走主库、延迟监控告警

---

### Q91: 如何设计一个分布式任务调度系统？

**频率：** ★★★★

**参考答案：**

**核心组件：**

1. **调度器**：负责任务的触发和分发（Cron 表达式）
2. **执行器**：实际执行任务的 Worker
3. **注册中心**：管理执行器的注册和发现
4. **数据库**：存储任务定义、执行记录

**Go 技术选型：**

- `github.com/robfig/cron/v3`：单机定时任务
- `github.com/asynkron/go-quartz`：分布式任务调度
- 自研：基于 Redis ZSet 实现延迟队列

**关键设计：**

- 任务幂等性：重复执行不产生副作用
- 失败重试：指数退避策略
- 超时控制：context.WithTimeout
- 分片执行：大任务拆分为子任务并行

---

### Q92: 如何实现接口的签名验证？

**频率：** ★★★★

**参考答案：**

**签名算法：**

```
1. 将所有请求参数按 key 字典序排序
2. 拼接成 key1=value1&key2=value2 格式
3. 在末尾拼接 app_secret
4. 对整个字符串做 HMAC-SHA256
5. 将结果转为十六进制字符串作为签名
```

**Go 实现：**

```go
func generateSignature(params map[string]string, appSecret string) string {
    // 1. 排序
    keys := make([]string, 0, len(params))
    for k := range params {
        keys = append(keys, k)
    }
    sort.Strings(keys)

    // 2. 拼接
    var buf strings.Builder
    for _, k := range keys {
        buf.WriteString(k)
        buf.WriteString("=")
        buf.WriteString(params[k])
        buf.WriteString("&")
    }
    buf.WriteString(appSecret)

    // 3. HMAC-SHA256
    h := hmac.New(sha256.New, []byte(appSecret))
    h.Write([]byte(buf.String()))
    return hex.EncodeToString(h.Sum(nil))
}
```

**防重放：** 增加 timestamp 和 nonce 参数，服务端校验时间窗口和 nonce 唯一性。

---

### Q93: 如何设计一个配置中心？

**频率：** ★★★

**参考答案：**

**核心功能：**

1. **配置管理**：集中管理所有服务的配置
2. **版本管理**：配置变更历史、回滚
3. **环境隔离**：dev/staging/prod 多环境
4. **热更新**：配置变更实时推送到服务
5. **权限控制**：不同角色不同权限

**Go 技术选型：**

- Consul KV + Watch
- Etcd + Watch
- Apollo（携程开源）
- Nacos（阿里开源）

**热更新实现：**

```go
// 使用 fsnotify 监听配置文件变化
watcher, _ := fsnotify.NewWatcher()
watcher.Add("config.yaml")
go func() {
    for {
        select {
        case event := <-watcher.Events:
            if event.Op&fsnotify.Write == fsnotify.Write {
                config.Reload() // 重新加载配置
            }
        }
    }
}()
```

---

### Q94: 如何设计一个限流系统？

**频率：** ★★★★

**参考答案：**

**多级限流架构：**

```
Nginx 限流（全局限流）
    ↓
API 网关限流（服务级限流）
    ↓
服务内部限流（接口级限流）
    ↓
Redis 分布式限流（跨实例限流）
```

**限流算法对比：**

| 算法 | 优点 | 缺点 |
|------|------|------|
| 固定窗口 | 简单 | 临界点突发 |
| 滑动窗口 | 更平滑 | 内存占用大 |
| 漏桶 | 恒定速率 | 不能应对突发 |
| 令牌桶 | 允许突发 | 实现稍复杂 |

**Redis 分布式限流（Lua 脚本保证原子性）：**

```lua
-- 滑动窗口限流
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
redis.call('ZREMRANGEBYSCORE', key, 0, now - window)
local count = redis.call('ZCARD', key)
if count < limit then
    redis.call('ZADD', key, now, now)
    return 1
end
return 0
```

---

### Q95: 如何设计一个支付系统？

**频率：** ★★★★

**参考答案：**

**核心流程：**

```
创建订单 → 发起支付 → 支付渠道回调 → 更新订单状态 → 通知业务方
```

**关键设计：**

1. **幂等性**：同一笔订单多次回调不重复处理（唯一流水号）
2. **异步回调**：支付渠道异步通知，主动查询兜底
3. **对账**：每日与支付渠道对账，处理差异
4. **分布式事务**：订单服务 + 支付服务 + 库存服务一致性
5. **安全性**：签名验证、HTTPS、防篡改

**状态机：**

```
待支付 → 支付中 → 支付成功 / 支付失败 / 超时关闭
支付成功 → 退款中 → 退款成功 / 退款失败
```

---

### Q96: 如何设计一个实时聊天系统？

**频率：** ★★★★

**参考答案：**

**架构设计：**

```
客户端 ←→ WebSocket 网关 ←→ 消息服务 ←→ Redis Pub/Sub ←→ 消息服务 ←→ 数据库
```

**关键技术点：**

1. **长连接管理**：WebSocket + 心跳检测
2. **消息投递**：在线直接推送，离线存入消息队列
3. **消息存储**：消息序号 + 游标，客户端断线重连后从游标处拉取
4. **群聊**：Redis Pub/Sub 实现跨实例消息广播
5. **消息可靠性**：消息确认机制（ACK）、重传
6. **水平扩展**：WebSocket 网关无状态化，通过一致性哈希路由用户连接

---

### Q97: 如何设计一个延迟任务系统？

**频率：** ★★★

**参考答案：**

**方案对比：**

| 方案 | 精度 | 适用场景 |
|------|------|---------|
| 定时轮询 DB | 秒级 | 简单场景 |
| Redis ZSet | 毫秒级 | 中等精度 |
| 时间轮（Kafka） | 毫秒级 | 高精度、大数据量 |
| Go Timer | 纳秒级 | 单机 |

**Redis ZSet 实现：**

```go
// 添加延迟任务
func AddDelayTask(ctx context.Context, taskID string, executeAt time.Time) error {
    score := float64(executeAt.UnixMilli())
    return rdb.ZAdd(ctx, "delay_queue", redis.Z{Score: score, Member: taskID}).Err()
}

// 消费延迟任务（定时轮询）
func ConsumeDelayTasks(ctx context.Context) {
    for {
        now := float64(time.Now().UnixMilli())
        // 取出到期的任务
        tasks, _ := rdb.ZRangeByScore(ctx, "delay_queue", &redis.ZRangeBy{
            Min: "-inf", Max: strconv.FormatFloat(now, 'f', 0, 64),
        }).Result()
        for _, taskID := range tasks {
            // 处理任务
            processTask(taskID)
            // 从队列移除
            rdb.ZRem(ctx, "delay_queue", taskID)
        }
        time.Sleep(100 * time.Millisecond)
    }
}
```

---

### Q98: 如何设计一个文件上传/下载系统？

**频率：** ★★★

**参考答案：**

**上传方案：**

| 文件大小 | 方案 |
|---------|------|
| < 5MB | 直接上传（multipart/form-data） |
| 5MB - 1GB | 分片上传 + 断点续传 |
| > 1GB | 分片上传 + 秒传（文件Hash） |

**分片上传流程：**

1. 前端计算文件 MD5
2. 检查秒传（MD5 已存在则直接返回 URL）
3. 将文件分片（如 5MB/片），并行上传
4. 后端接收分片存储到临时目录
5. 所有分片上传完成，合并文件
6. 验证文件完整性（MD5 校验）

**存储方案：**

- 小文件：本地磁盘 / OSS
- 大文件：OSS + CDN 加速
- 对象存储：MinIO（自建）、阿里云 OSS、AWS S3

---

### Q99: 如何设计一个灰度发布系统？

**频率：** ★★★

**参考答案：**

**灰度策略：**

1. **按权重**：5% 流量到新版本，95% 到旧版本
2. **按用户**：特定用户/用户组走新版本
3. **按地区**：特定地区走新版本
4. **按规则**：Header/Cookie/IP 匹配规则

**实现方案：**

- Nginx split_clients + upstream
- API 网关路由规则
- Feature Flag 系统（LaunchDarkly、Unleash）
- K8s Canary Deployment + Istio VirtualService

**回滚策略：**

- 自动回滚：错误率超阈值自动切回
- 手动回滚：一键切换到旧版本
- 灰度验证：监控核心指标（错误率、延迟、业务指标）

---

### Q100: 如何排查线上 Go 服务 OOM（内存溢出）问题？

**频率：** ★★★★★

**参考答案：**

**排查步骤：**

1. **开启 pprof**：

```go
import _ "net/http/pprof"
go http.ListenAndServe(":6060", nil)
```

2. **获取堆快照**：

```bash
go tool pprof http://localhost:6060/debug/pprof/heap
```

3. **分析内存分配**：

```bash
go tool pprof -alloc_space http://localhost:6060/debug/pprof/heap
```

4. **查看 goroutine 数量**：

```bash
curl http://localhost:6060/debug/pprof/goroutine?debug=1
```

**常见 OOM 原因：**

- goroutine 泄漏（无退出机制的 goroutine）
- 全局变量持续增长（未清理的缓存）
- 大对象未释放（大 slice/map）
- 文件/连接未关闭
- string/[]byte 频繁转换产生临时对象

**预防措施：**

- 设置 `GOMEMLIMIT` 软上限
- 监控 `runtime.MemStats`
- 定期 pprof 采样分析
- 压测验证内存使用

---

> **总计 100 道面试题**，覆盖 Golang 基础到进阶、MySQL、Redis、MQ、gRPC、Nginx、部署、Docker 及实战场景，祝面试顺利！
