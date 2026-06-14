<!--
 * @Author: Yaoyouyou yaoyouyou888@hotmail.com
 * @Date: 2026-06-14 09:24:50
 * @LastEditors: Yaoyouyou yaoyouyou888@hotmail.com
 * @LastEditTime: 2026-06-14 09:36:12
 * @FilePath: \work-tool\docs-vitepress\src\sever\index.md
 * @Description:服务器部署项目
-->

## server operation and maintenance

服务器操作和维护

1. 在开发完成项目之后，需要上线服务器，将项目部署到服务器上。
   如果是简单的vibe coding项目，只需要上传到githup， 通过githup部署到vercel或者github pages上。数据上可以使用在线数据库，如supabase，MongoDB Atlas等。访问上面的项目也需要魔法上网
   ---在AI-tool中有相关配置在线数据库的文档，可以参考。

2. 如果项目的复杂度较高，在国内可以访问，则需要购买域名，购买服务器。需要在服务器上部署， 配置服务器环境， 安装依赖， 启动项目。
   --- 1.购买域名(选择阿里云或腾讯云)
   --- 2.购买服务器(选择阿里云或腾讯云，简单项目可以选择38元/年。阿里云新用户注册账号可以买，腾讯云新账号不要购买任何产品才能购买，而且38元/年的服务器很难抢到手)
   --- 3.购物域名和服务之后的工作就是域名服务器备案，在购买的控制台有备案选项，根据指引一步一步的进行操作即可。
   --- 4.配置服务器环境，可以进行命令行登录使用命令行进行安装相关依赖；也可以使用图形化界面进行配置，比如：宝塔面板，cPanel等；新手推荐还是使用面板+命令行进行配置。
   --- 5.当环境配置好了之后，可以将项目进行上传到服务器上，有多种方式，比如：使用ftp上传，使用ssh上传，或者直接拖拽上传；高级别有多台服务器可以考虑使用ci/cd工具进行部署，比如：jenkins，gitlab ci等。
