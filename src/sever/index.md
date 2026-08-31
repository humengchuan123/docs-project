<!--
 * @Author: Yaoyouyou yaoyouyou888@hotmail.com
 * @Date: 2026-06-14 09:24:50
 * @LastEditors: Yaoyouyou yaoyouyou888@hotmail.com
 * @LastEditTime: 2026-07-10 13:14:08
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

3. 服务器维护和清理
   ---应用场景
   在我们的日常开发中，我们的服务器总是在不知不觉中磁盘莫名奇妙少了很多空间，或者被占满了，如果这时候要想要存储什么文件，突然发现空间不够了。但我们通常也不知道那些文件占用的空间大，这时候就需要对磁盘占用情况进行管理，删除那些用不上的文件原因分析
   1、自己的服务器本上磁盘空间比较少，然后你的服务上数据和软件比较多，导致磁盘爆满
   2、自己的服务器上运行了某些程序，由于长时间运行，产生了大量的日志数据，没有及时删除，因为自己也不知道日志文件存储在那个目录(这个是最常见，最多的情况)
   一般我们的磁盘爆满都是第二个原因导致的多，当然对于新手来说可能是二个原因一直导致的，我的服务器爆满主要是第二个原因。所以当服务器爆满我们就需要对服务器的磁盘占用情况进行了解，然后删除垃圾日志文件或者不必要的文件数据
   ---操作步骤
   解决步骤(重点)
   查看当前系统的磁盘占用情况:df-h
   使用df命令可以查看当前的系统占用情况，-h选项则时可以人性化的显示空间大小(将字节转化成G,M这种单位)，从这里可以看出的的磁盘大小总共是40G，可以还有23G。
   找出大目录：du -sh /\* 2>/dev/null | sort -hr | head -20 然后逐步深入。或 ncdu 工具。

   检查已删除但仍被进程占用的文件：lsof | grep deleted （可能会占用磁盘空间不释放）。

   检查大日志文件、数据库、docker overlay2、缓存等。

   清理系统日志：journalctl --vacuum-size=200M； /var/log/ 下日志文件可清空（> filename）或删除旧日志。

   清理包管理器缓存：apt-get clean (Debian/Ubuntu)，yum clean all (CentOS)。

   删除不必要的软件包或旧内核：purge-old-kernels 或手动。

   清理/tmp目录：注意安全，可以用 tmpwatch 或设置定时清理。

   Docker：docker system prune -a (清理未使用镜像容器等)。

   检查用户数据：/home/下大文件，/var/www等。

   数据库日志或备份文件。

   如果云盘上有多个分区，考虑扩容云盘（在线扩容）再扩展文件系统。

   https://www.bilibili.com/video/BV1fg7az2EPS/?spm_id_from=333.337.search-card.all.click&vd_source=d9d66609221f88f305da17685d7e945c

远程桌面：
另外一台电脑打开远程桌面，并打开对应服务 必须在同一局域网下
控制电脑：
win+r mstsc

1.  打开远程桌面，输入服务器的IP地址，点击连接。
2.  输入服务器的账号和密码，点击登录。
3.  连接成功后，你可以在远程桌面上操作服务器。

![alt text](image.png)

在此正好推荐几个老少咸宜寓教于乐的网站，也欢迎各位大佬补充：

交互、解密和视觉实验合集 https://neal.fun
看 Google 街景猜地点 https://geoguessr.com
文字游戏 https://lessgames.com
驾驶 https://slowroads.io/
进化 https://pmotschmann.github.io/Evolve/ （汉化 fork 项目 https://g8hh.github.io/evolve ）
打开一扇窗 https://www.window-swap.com/
建造 https://oskarstalberg.com/Townscaper/
