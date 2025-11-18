<!--
 * @Author: humengchuan 531537052@qq.com
 * @Date: 2025-11-17 12:12:09
 * @LastEditors: humengchuan 531537052@qq.com
 * @LastEditTime: 2025-11-17 12:59:54
 * @FilePath: \project\work-tool\docs-vitepress\src\build-story\docker.md
 * @Description:
-->

### Docker

Linux：安装 docker 必须安装 CentOS 系统或 Ubuntu 系统。

windows：安装 docker，需要 windows 专业版，打开虚拟化，hyper-v，然后安装 docker，不然无法安装或安装后无法使用。

拉取 docker hub 上的称之为镜像

隔离的进程独立于宿主机和其他隔离的进程，通过镜像创建的进程也被称之为容器。

docker 代理加速：{"registry-mirrors": ["https://docker.1ms.run"]}

容器操作：

    查看镜像：docker image ls

    拉取镜像：docker pull 【xxx】

    删除镜像：docker rmi 【xxx】

    搜索镜像：docker search 【xxx】

    运行容器：docker run -d -p 80:80 nginx

    停止容器：docker stop 【xxx】

    启动容器：docker start 【xxx】

    重启 rocker：docker restart 【xxx】

    删除容器：docker rm 【xxx】

    容器列表：docker ps -a

    删除所有容器：docker rm -f $(docker ps -a -q)

    查看运行容器：docker ps

容器管理：

    进入运行的容器： docker exec -it 【xxx】 bash

    导出：docker image save 【xxx】

    导入：docker image load -i 【文件路径】

    日志：docker logs -f 【xxxx（id）】

提交镜像：

    ①：docker run -it dockername bash

    ②：docker commit 【xxx】 name

将 docker push 到 hub 上：

    ①需要docker login

    ②docker image  tag （需要打包的镜像）user name/image name: version

    ③docker push  user name/image name: version
