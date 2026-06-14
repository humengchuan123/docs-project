<!--
 * @Author: HuMeng 531537052@qq.com
 * @Date: 2026-06-01 16:55:32
 * @LastEditors: Yaoyouyou yaoyouyou888@hotmail.com
 * @LastEditTime: 2026-06-14 09:37:49
 * @FilePath: \work-tool\docs-vitepress\src\php\index.md
 * @Description:
-->

### PHP 项目学习

#### 安装环境

phpstudy 安装  
https://www.xp.cn/phpstudy#phpstudy

在phpstudy 面板中安装选择的mysql php版本 Redis版本
在设置中配置phpstudy 文件位置

#### 设置环境变量

设置电脑中的环境变量path D:\php-devlop\phpstudy_pro\Extensions\php\php8.0.2nts

验证 php 安装
php -v

#### 安装 Composer

下载 composer 安装包
https://getcomposer.org/download/

验证 composer 安装
composer --version

安装完成后，设置镜像
composer config -g repos.packagist composer https://mirrors.cloud.tencent.com/composer/

安装thinkphp项目
composer create-project topthink/think project-name

cd project-name

composer install

php think run OR 将项目的public目录添加到phpstudy的www目录下
