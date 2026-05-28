<!--
 * @Author: HuMeng 531537052@qq.com
 * @Date: 2026-05-03 21:37:48
 * @LastEditors: HuMeng 531537052@qq.com
 * @LastEditTime: 2026-05-11 20:24:16
 * @FilePath: \work-tool\docs-vitepress\src\nodejs\question.md
 * @Description:
-->

#### 存20亿个手机号到数据库使用什么方案？如果手机号高频新增和删除（动态变化），该方案是否合适？

bitmap（位图）
位图是一种压缩存储的位序列，每个位表示一个手机号是否被使用。

#### 登录token设计

1. （session + redis）+ cookie
2. jwt 双token （access token + refresh token）

#### 订单倒计时结束支付取消付款的竞态问题

订单状态机流转：

1. 订单创建 -> 订单支付 -> 订单完成
2. 订单倒计时结束 -> 订单取消付款

1.订单状态机状态设计要清晰 2. 取消订单时要进行原子操作订单和支付状态都要进行同步3.异常状态兜底机制 4.高并发分布式锁

#### 支付扫码竞态问题（一个二维码，两种支付方式扫码或多人扫码）

#### 数据库如何实现在线无感迁移?
