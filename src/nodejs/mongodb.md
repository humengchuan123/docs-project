### mongodb

[mongoose 文档](https://mongoosejs.com/docs/documents.html)  
mongoose 安装 npm i mongoose

mongoose 创建数据库

```js
const mongoose = require("mongoose");
moogoose.connect("mongodb://localhost:27017/myapp");
```

```js
mongoose.connection.on("open", () => {
  // 在这里可以执行链接成功的操作
  console.log("mongodb 数据库连接成功!");

  // 查询并打印 MongoDB 数据库版本
  try {
    mongoose.connection.db
      .command({ buildInfo: 1 })
      .then((info) => {
        console.log("MongoDB Version:", info.version);
      })
      .catch((err) => {
        console.error("Error fetching MongoDB version:", err);
      });
  } catch (err) {
    console.error("Exception occurred while fetching MongoDB version:", err);
  }
});

// 监听断开连接事件
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB 连接断开");
});

// 监听连接错误事件
mongoose.connection.on("error", (err) => {
  console.error("MongoDB 连接错误:", err);
});
```

mongoose 使用  
mongoose.Schema 创建集合
