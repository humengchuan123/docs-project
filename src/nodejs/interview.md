<!--
 * @Author: humengchuan 531537052@qq.com
 * @Date: 2025-08-28 14:38:08
 * @LastEditors: humengchuan 531537052@qq.com
 * @LastEditTime: 2026-04-01 14:47:29
 * @FilePath: \work-tool\docs-vitepress\src\nodejs\interview.md
 * @Description:
-->

### 后端面试题

#### MySQL事务

- 一致性
- 原子性
- 隔离性
- 持久性

#### 业务使用场景

##### MQ消息异步队列使用场景

- 异步处理高并发场景，如订单处理、消息通知等
- 分布式系统之间的消息传递，如服务之间调用、消息队列等
- 异步处理耗时任务，如数据导入、导出、数据同步等

##### 核心优点

- **核心价值**：将耗时操作异步化，缩短主流程响应时间，提升用户体验和系统吞吐量

##### 具体业务场景

###### 用户注册/登录场景

- 用户注册成功后，异步发送短信验证码、欢迎邮件、积分发放
- 注册流程只需完成核心操作（如写入数据库），将"用户已注册"消息发送到MQ，即可立即返回响应
- 用户无需等待所有步骤完成，响应时间从3秒缩短至0.1秒

###### 电商订单场景

- 用户下单成功后，异步处理发送短信通知、生成订单、扣减库存、增加积分等
- 支付成功后，异步通知积分系统更新用户积分
- 用户完成订单后，异步发放优惠券，提升订单流程响应速度

###### 文件处理场景

- 用户上传头像后，异步生成缩略图、更新CDN、记录审计日志
- 用户无需等待3秒才看到"上传成功"，用户体验显著提升

###### 系统解耦场景

- **核心价值**：降低系统间依赖，实现松耦合架构，方便系统扩展和维护

###### 流量削峰场景

- **核心价值**：将瞬时高流量转化为平稳流量，保护后端系统不被冲垮
- 应用场景：秒杀/抢购活动、大促订单处理

###### 数据分发与同步场景

- **核心价值**：一对多高效数据分发，保证各系统间数据的最终一致性

###### 延迟队列场景

- **核心价值**：定时提醒，实现业务流程的时序控制
- 应用场景：
  - 订单超时处理
  - 优惠券管理：优惠券生成→消息队列（延迟到过期前1天）→发送提醒短信
  - 优惠券过期提醒，提升用户转化率

#### 幂等性

##### 相关概念

- 一致性（最终一致性） → 原子操作 → 幂等性（微服务 重试 超时）

##### 哪些接口需要考虑幂等性？

- **核心价值**：保证数据一致性，避免数据不一致导致的业务错误
- 应用场景：
  - 订单支付场景：防止重复支付
  - 订单支付成功后，发送消息到MQ，MQ处理订单支付成功后的后续逻辑，如生成订单、扣减库存、增加积分等
  - 创建用户场景：创建用户成功后，发送消息到MQ，MQ处理创建用户成功后的后续逻辑，如发送欢迎邮件、积分发放等

##### HTTP请求类型与幂等性

| 请求类型 | 幂等性   | 说明                                                                                                                                                                                                      |
| -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET      | 无需幂等 | 获取商品信息，不会引起商品数据的变化                                                                                                                                                                      |
| POST     | 需要幂等 | 比较常见，这种接口需要考虑到幂等性                                                                                                                                                                        |
| PUT      | 部分幂等 | 不一定需要实现幂等性：<br>- 例如：将1号商品的价格改为200，网络返回抖动重试，第二次调用仍会将价格改为200，无幂等问题<br>- 但在购物车场景中，调用一次商品数量加一，多次调用会导致数量持续增加，存在幂等问题 |
| DELETE   | 无需幂等 | 一般不具备严格幂等性要求：<br>- 第一次调用删除数据<br>- 第二次调用尝试删除已不存在的数据                                                                                                                  |

##### 幂等性问题场景

- 同样的请求发送多次（如网络抖动、超时重试等）
- 微服务架构中的服务调用重试机制
- 前端重复提交表单

解决幂等性问题的方法

- **核心价值**：保证数据一致性，避免数据不一致导致的业务错误

  token 缓存防止重复提交表单

  唯一锁引 防止脏数据

OSS上传文件功能

### OSS Web端直传架构图

![OSS Web直传流程](./path/to/your/image.png)

**流程说明：**

1. **浏览器 -> Gin**：请求签名。
2. **Gin -> 浏览器**：返回签名策略。
3. **浏览器 -> OSS**：携带签名直传文件。

```go
package main

import (
    "bytes"
    "encoding/base64"
    "encoding/json"
    "fmt"
    "hash/hmac"
    "hash/sha1"
    "io"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
)

// Config OSS 配置
var (
    AccessKeyId     = "your-access-key-id"
    AccessKeySecret = "your-access-key-secret"
    BucketName      = "your-bucket-name"
    Endpoint        = "oss-cn-hangzhou.aliyuncs.com" // 替换为你的Endpoint
    ExpireTime      = 30 // 签名过期时间(分钟)
)

func main() {
    r := gin.Default()

    // 1. 获取签名接口
    r.GET("/api/oss/sign", func(c *gin.Context) {
        sign, policy := getPolicy()
        c.JSON(http.StatusOK, gin.H{
            "accessid":  AccessKeyId,
            "host":      fmt.Sprintf("https://%s.%s", BucketName, Endpoint),
            "policy":    policy,
            "signature": sign,
            "expire":    fmt.Sprintf("%d", getExpire()),
            "dir":       "user-dir/", // 上传目录前缀，可选
        })
    })

    r.Run(":8080")
}

// getPolicy 生成上传策略和签名
func getPolicy() (string, string) {
    expire := getExpire()
    policy := `{
        "expiration": "` + time.Unix(expire, 0).Format("2006-01-02T15:04:05Z") + `",
        "conditions": [
          ["content-length-range", 0, 1048576000] // 限制文件大小 1G
        ]
      }`

    policy = strings.TrimSpace(policy)
    encodedPolicy := base64.StdEncoding.EncodeToString([]byte(policy))
    h := hmac.New(sha1.New, []byte(AccessKeySecret))
    h.Write([]byte(encodedPolicy))
    signature := base64.StdEncoding.EncodeToString(h.Sum(nil))

    return signature, encodedPolicy
}

func getExpire() int64 {
    now := time.Now().Unix()
    return now + int64(ExpireTime*60)
}
```

js部分代码

```js
<script setup>
import { ref } from 'vue';

// 1. 定义状态
const fileInput = ref(null);
const selectedFile = ref(null);
const uploading = ref(false);
const progress = ref(0);
const uploadResult = ref('');

// 2. 获取签名
// 根据架构图，第一步是向 Gin 后端请求签名
const getSignature = async () => {
  try {
    const res = await fetch('/api/oss/sign'); // 对应后端的 /oss/sign 接口
    const data = await res.json();
    if (data.code === 200) {
      return data.data; // 返回 { policy, signature, accessid, dir, host }
    } else {
      alert('获取签名失败');
      return null;
    }
  } catch (error) {
    console.error('请求签名出错:', error);
    return null;
  }
};

// 3. 处理文件选择
const handleFileChange = (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    selectedFile.value = files[0];
    uploadResult.value = '';
  }
};

// 4. 执行上传
const startUpload = async () => {
  if (!selectedFile.value) return;

  uploading.value = true;
  progress.value = 0;

  // 获取后端签名信息
  const signInfo = await getSignature();
  if (!signInfo) {
    uploading.value = false;
    return;
  }

  const { policy, signature, accessid, dir, host } = signInfo;

  // 构造 FormData
  // 根据 OSS PostObject 规则，必须包含的字段
  const formData = new FormData();
  formData.append('OSSAccessKeyId', accessid);
  formData.append('policy', policy);
  formData.append('signature', signature);
  formData.append('key', dir + selectedFile.value.name); // 文件保存路径 + 文件名
  formData.append('file', selectedFile.value); // 文件对象

  // 5. 发起上传请求到 OSS Endpoint
  try {
    const uploadUrl = `https://${BucketName}.${Endpoint}`; // 替换为你的 OSS 地址

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      // 配置上传进度
      onUploadProgress: (e) => {
        if (e.total > 0) {
          progress.value = parseInt((e.loaded / e.total) * 100);
        }
      }
    });

    if (response.ok) {
      // 上传成功，通常 OSS 返回 204 No Content 或 XML
      uploadResult.value = `上传成功！文件访问链接: ${host}/${dir}${selectedFile.value.name}`;
      // 清空文件输入框
      fileInput.value.value = '';
    } else {
      uploadResult.value = '上传失败，服务器返回错误';
      console.error('OSS 上传失败:', response.statusText);
    }
  } catch (err) {
    uploadResult.value = '网络错误，上传中断';
    console.error('上传异常:', err);
  } finally {
    uploading.value = false;
  }
};
</script>

```
