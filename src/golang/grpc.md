<!--
 * @Author: humengchuan 531537052@qq.com
 * @Date: 2026-02-03 17:43:22
 * @LastEditors: humengchuan 531537052@qq.com
 * @LastEditTime: 2026-02-03 18:13:33
 * @FilePath: \project\work-tool\docs-vitepress\src\golang\grpc.md
 * @Description: grpc 微服务
-->

### gRPC

gRPC是一个高性能、开源和通用的RPC框架，面向移动和HTTP/2设计。目前提供C、Java和Go语言版本,分别是:grpc,grpc-java,grpc-go.其中C版本支持C,C++, Node.js, Python, Ruby, Objective-C, PHP和C#支持.

底层基于：protobuf协议进行通信

```md
# 下载protobuf，并在系统重设置PATH环境变量

https://github.com/protocolbuffers/protobuf/releases

# 安装protoc-gen-go依赖包

go get github.com/golang/protobuf/protoc-gen-go

# 生成proto文件

protoc --go_out=. \*.proto

protoc -I . goods.proto --go_out=plugins=grpc:.
```

#### 示例proto文件

```md
syntax = "proto3"; // 必须为文件首行（非空非注释）

package your_package; // 防止命名冲突，影响生成代码的命名空间

// 可选：为特定语言指定包路径（如 Go）；可以指定生成的文件的包路径
option go_package = "example.com/project/protos";

import "google/protobuf/empty.proto"; // 导入其他proto文件

// 用户状态枚举
enum UserStatus {
USER_STATUS_UNSPECIFIED = 0; // 枚举第一个值必须为 0
USER_STATUS_ACTIVE = 1;
USER_STATUS_DISABLED = 2;
}

// 用户信息消息
message User {
int64 id = 1;
string name = 2;
string email = 3;
UserStatus status = 4;
repeated string tags = 5; // repeated 表示一个列表（数组）
optional string nickname = 6; // 可选：可判断“是否被赋值”
}

// 请求消息
message GetUserRequest {
int64 id = 1;
}

// 响应消息
message GetUserResponse {
User user = 1;
}

// 定义服务（常配合 gRPC 使用）
service UserService {
rpc GetUser(GetUserRequest) returns (GetUserResponse);
}

service GoodsService {
rpc GetGoods(google.protobuf.Empty) returns (GoodsResponse);
}
```
