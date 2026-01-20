<!--
 * @Author: humengchuan 531537052@qq.com
 * @Date: 2025-12-19 12:50:15
 * @LastEditors: humengchuan 531537052@qq.com
 * @LastEditTime: 2026-01-04 10:48:42
 * @FilePath: \project\work-tool\docs-vitepress\src\golang\index.md
 * @Description:
-->

### Golang

\*\*\*\*指针

&是取地址，\*是解引用，去这个地址指向的值

\*\*\*\* 数组与切片

数组是固定长度的，切片是动态长度的
操作数组的方法：

```go
s1 := []int{1, 2}
append{s1, 3}
// s1 = [1, 2, 3]

s1 := []int{1, 2}
s2 := []int{3, 4, 5}
s1 = append(s1, s2...)    // 添加s2的所有元素
// 结果: [1, 2, 3, 4, 5]

s := []int{1, 2, 3, 4, 5}
index := 2  // 要删除索引2的元素（值为3）
s = append(s[:index], s[index+1:]...)
// tips: 删除索引为2的元素, 方法中不包含s[index+1:]
// 结果: [1, 2, 4, 5]

// Go 1.21后，slices包也可以操作数组和切片
slices.Delete(s, index, index+1)

```

#### golang ORM 框架

gorm https://duoke360.com/tutorial/gorm/g2
gorm 支持多种关系型数据库（MySQL、PostgreSQL、SQLite、SQL Server 等）但不支持 MongoDB。

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
