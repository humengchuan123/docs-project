<!--
 * @Author: humengchuan 531537052@qq.com
 * @Date: 2025-08-28 14:36:57
 * @LastEditors: humengchuan 531537052@qq.com
 * @LastEditTime: 2025-09-15 13:48:28
 * @FilePath: \project\work-tool\docs-vitepress\src\nodejs\nest.md
 * @Description:
-->

### nestjs

```js
$ npm i -g @nestjs/cli
$ nest new project-name

```

validator [校验工具](https://www.npmjs.com/package/validator)  
Validation Pipe 管道  
创建模块 nest g module [moduleName]  
创建控制器 nest g controller [controllerName] --no-spec  
创建服务 nest g service [serviceName]  
创建接口 nest g resource [resourceName]

```js
// 导入其他的模块，主要在于appc.module.ts中管理模块
import { UserModule } from './user/user.module'

@Module({
  imports: [UserModule], // 引入其他的模块
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}



// 其他模块内，接口地址：例如：/usermodel/test，
// @Controller('usermodel') 可以设置统一前缀
@Controller('usermodel')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get('test')
  getUserHello(): string {
    return this.appService.getUser()
  }
  @Get('list')
  getUserList(): Array<string> {
    return this.appService.getUserList()
  }
}

```
