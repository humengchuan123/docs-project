<!--
 * @Author: humengchuan 531537052@qq.com
 * @Date: 2025-12-19 12:50:15
 * @LastEditors: humengchuan 531537052@qq.com
 * @LastEditTime: 2026-03-25 10:51:48
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
