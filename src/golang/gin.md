<!--
 * @Author: humengchuan 531537052@qq.com
 * @Date: 2025-12-19 12:50:35
 * @LastEditors: humengchuan 531537052@qq.com
 * @LastEditTime: 2026-02-09 20:38:05
 * @FilePath: \project\work-tool\docs-vitepress\src\golang\gin.md
 * @Description:
-->

### Golang--gin

Go 环境（建议 1.18+）
初始化 Go 模块（创建 go.mod 文件）

```go
mkdir gin-project && cd gin-project

// 创建go.mod文件
go mod init gin-project

// 安装gin
go get -u github.com/gin-gonic/gin

// 添加依赖
go mod tidy

```

创建 main.go 文件 测试是否成功

```go
package main

import "github.com/gin-gonic/gin"

func main() {
    // 创建默认的Gin引擎
    r := gin.Default()

    // 定义一个简单的路由
    r.GET("/hello", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "Hello, Gin!",
            "status":  "success",
        })
    })

    // 启动服务器，监听8080端口
    r.Run(":8080")
}
```

```go
// 路由分组

func main() {
    r := gin.Default()
    v1 := r.Group("/v1")
    {
        v1.GET("/hello", func(c *gin.Context) { })
        v1.POST("/user", func(c *gin.Context) { })
        v1.PUT("/user/:id", func(c *gin.Context) { })
    }

    v2 := r.Group("/v2")
    {
        v2.GET("/hello", func(c *gin.Context) { })
        v2.POST("/user", func(c *gin.Context) { })
    }


}

```
