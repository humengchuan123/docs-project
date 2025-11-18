<!--
 * @Author: humengchuan 531537052@qq.com
 * @Date: 2025-11-17 12:11:51
 * @LastEditors: humengchuan 531537052@qq.com
 * @LastEditTime: 2025-11-18 23:14:31
 * @FilePath: \project\work-tool\docs-vitepress\src\build-story\jenkins.md
 * @Description:
-->

### jenkins

## jikens 安装

jinkens 安装一般分为 服务器本地安装 docker 安装两种方式

本篇主要讲服务器使用 docker 安装 jenkins 的方式

环境准备：docker docker-compose Java jdk

示例：docker pull jenkins/jenkins:2.528.2-lts-jdk17

docker run -d -p 16809:8080 --name jenkins -v /my/jenkins:/var/jenkins_home jenkins/jenkins:2.501-alpine-jdk21

这条命令表面上没有问题，但是实际运行时，会提示如下错误：

java.lang.UnsatisfiedLinkError: no jansi in java.library.path: [/usr/java/packages/lib, /usr/lib64, /lib64, /lib, /usr/lib]

或者初始化 jenkins 之后会没有网络的情况，出现离线状态，导致后续无法安装相关扩展插件。

正确的执行：docker run -u root -d --name jenkins -p 14808:8080 -v /my/jenkins:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -v /usr/bin/docker:/usr/bin/docker jenkins/jenkins:2.528.2-lts-jdk17

添加 -u root 参数，并添加 -v /var/run/docker.sock:/var/run/docker.sock -v /usr/bin/docker:/usr/bin/docker 参数，并使用 -v /my/jenkins:/var/jenkins_home 映射宿主机的 jenkins_home 目录，这样，jenkins 在启动的时候，就会找到宿主机的 jenkins_home 目录，并使用宿主机的 jenkins_home 目录中的数据。

## jikens 配置

## jikens 项目设置

项目在添加仓库的时候，会提示如下错误：
无法连接仓库：Command "git ls-remote -h -- https://gitee.com/xxxuser/docs-project.git HEAD" returned status code 128:
stdout:
stderr: fatal: unable to access 'https://gitee.com/xxxuser/docs-project.git/': Could not resolve host: gitee.com
![jenkins-error](/public/jenkins-error1.png)

原因：私有项目仓库配置凭证的时候，账号密码没有输入正确，链接公有仓库没有问题，链接私有仓库就出问题了，网上和 AI 会给你扯很多配置和答案，但得到的结果会天差地别。另外，在有的时候会网络错误也会出现上述的错误提示，在之前还是好的配置，下一刻无法拉取 code。这时需要重启 jenkins 容器，重启 docker 容器，或者重启服务器。

## jikens 构建 shell

```md
#!/bin/bash

# Check the Node.js version

echo "Node.js version-------------------- $(node -v)"
echo "Npm version-------------------- $(npm -v)"

# 定义应用名称

APP_NAME="doc_project" # Docker 容器名
TARGET_DIR="/my/jenkins/workspace/doc-project" #目标路径
DIST_DIR=".vitepress/dist" # 构建输出目录
HOST_PORT="8096" # 宿主机端口

echo "当前工作空间路径: $WORKSPACE"

# 安装依赖

echo "-----npm install pnpm :"
npm install pnpm -g

echo "安装 pnpm 依赖... & pnpm version"

# 安装依赖

pnpm install

# 构建项目并记录输出

echo "开始构建项目..."
npm run docs:build

# 列出 dist 目录内容以确认构建结果

echo "构建后的 dist 目录内容:"

FULL_DIR=$WORKSPACE/$DIST_DIR
REAL_DIR=$TARGET_DIR/$DIST_DIR
ls -la $FULL_DIR

# 如果存在同名容器，先停止并删除它

if docker ps -a --filter name=$APP_NAME --format '{{.Names}}' | grep -wq $APP_NAME; then
    echo "$APP_NAME 容器存在，正在重启..."
docker stop $APP_NAME && docker rm $APP_NAME
fi

# 使用绝对路径挂载 dist 目录到 Nginx 容器

echo "启动 Nginx 容器并挂载 dist 目录..."
docker run --name $APP_NAME -v "$REAL_DIR":/usr/share/nginx/html -d -p $HOST_PORT:80 nginx

# 查看 Nginx 错误日志以帮助调试

sleep 5 # 等待几秒钟让容器启动
docker logs $APP_NAME

# === 部署成功验证 ===

echo "✅ ✅ ✅ 构建和部署成功！"
echo "项目: doc_project"
echo "部署地址: $HOST_PORT"
echo "容器名: $APP_NAME"
echo "构建目录: $full_dist_dir"
echo "部署完成时间: $(date)"
```

```md
### 第二种构建方法

## 准备 DockerFile nginx.cof

#!/bin/bash

# Check the Node.js version

echo "Node.js version-------------------- $(node -v)"
echo "Npm version-------------------- $(npm -v)"

# 定义应用端口

HOST_PORT="8090" # 宿主机端口

echo "当前工作空间路径: $WORKSPACE"
ls -la $WORKSPACE

# 安装依赖

npm install --no-fund

# 构建项目并记录输出

echo "开始构建项目..."
npm run build

# 列出 dist 目录内容以确认构建结果

echo "构建后的 dist 目录内容:"

FULL_DIR=$WORKSPACE/$DIST_DIR
ls -la $FULL_DIR

#基于项目的 DockerFile 构建独属于项目的 nginx
IMAGE_NAME="my-frontend-nginx:latest"

FRONTEND_DIST_DIR="dist"

# 3. 容器名称（用于替换旧容器）

CONTAINER_NAME="react-practice"

# ================ 步骤 1: 验证 dist 目录（关键！） ================

echo "=== 步骤 1: 验证前端构建产物 ==="
if [ ! -d "$FRONTEND_DIST_DIR" ]; then
echo "❌ 错误: 未找到 dist 目录！请先执行 'npm run build'"
echo "当前目录: $(pwd)"
echo "目录列表: $(ls -a)"
exit 1
fi

echo "✅ dist 目录已就绪: $FRONTEND_DIST_DIR"

# ================ 步骤 2: 构建 Docker 镜像（直接使用现有 Dockerfile） ================

echo -e "\n=== 步骤 2: 构建 Docker 镜像 ==="
docker build -t $IMAGE_NAME .

echo "✅ 镜像构建完成: $IMAGE_NAME"

# ================ 步骤 3: 运行容器（替换旧容器） ================

echo -e "\n=== 步骤 3: 启动容器（直接在本地运行） ==="

# 停止并删除旧容器（如果存在）

if docker ps -a | grep -q "$CONTAINER_NAME"; then
echo "停止并删除旧容器: $CONTAINER_NAME"
docker stop $CONTAINER_NAME
docker rm $CONTAINER_NAME
fi

# 启动新容器（映射 8080->80，避免端口冲突）

echo "启动新容器: $CONTAINER_NAME"
docker run -d --name $CONTAINER_NAME -p $HOST_PORT:80 $IMAGE_NAME

# === 部署成功验证 ===

echo -e "\n✅ 应用构建完成------容器已启动！访问端口:$HOST_PORT"
echo "部署完成时间: $(date)"
```
