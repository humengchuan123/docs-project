<!--
 * @Author: humengchuan 531537052@qq.com
 * @Date: 2026-05-06
 * @LastEditors: humengchuan 531537052@qq.com
 * @LastEditTime: 2026-05-06
 * @FilePath: \project\work-tool\docs-vitepress\src\build-story\mysql-redis-deploy.md
 * @Description: MySQL + Redis Docker 部署与迁移指南
-->

### MySQL + Redis 服务器部署迁移指南

## 一、服务器要求

### 硬件配置（以腾讯云轻量服务器 4核4G 为例）

| 资源 | 最低要求 | 推荐配置 | 4核4G服务器 |
|------|---------|---------|------------|
| CPU | 2 核 | 4 核+ | 满足 |
| RAM | 2 GB | 4 GB+ | 满足 |
| 磁盘 | 20 GB SSD | 50 GB+ SSD | 按需确认 |

**资源预估：**

| 服务 | 内存占用 | CPU 占用 |
|------|---------|---------|
| MySQL | 512 MB - 1.5 GB | 低-中 |
| Redis | 50 - 200 MB | 很小 |
| 系统/Docker | ~300 MB | - |
| **合计** | **约 1 - 2 GB** | **剩余充裕** |

### 软件环境

```
操作系统: Linux
Docker:   20.10+
Docker Compose: v2.0+
Git:      最新版
```

---

## 二、本地开发环境搭建

### Step 1: 创建项目结构

```bash
mkdir my-project && cd my-project
mkdir -p docker/mysql/conf.d
mkdir -p docker/mysql/init
mkdir -p docker/redis/data
```

**目录结构：**
```
my-project/
├── docker/
│   ├── mysql/
│   │   ├── conf.d/
│   │   └── init/
│   └── redis/
│       └── data/
├── .env
├── .env.example
├── docker-compose.yml
└── .gitignore
```

### Step 2: 创建 `.env` 文件（本地开发）

```bash
# MySQL 配置
MYSQL_ROOT_PASSWORD=local_root_password_123
MYSQL_DATABASE=myapp
MYSQL_USER=appuser
MYSQL_PASSWORD=app_password_123
MYSQL_PORT=3306

# Redis 配置
REDIS_PORT=6379
REDIS_PASSWORD=

# 应用配置
APP_ENV=development
COMPOSE_PROJECT_NAME=myapp-dev
```

### Step 3: 创建 `docker-compose.yml`

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: ${COMPOSE_PROJECT_NAME:-myapp}-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      TZ: Asia/Shanghai
    ports:
      - "${MYSQL_PORT:-3306}:3306"
    volumes:
      - ./docker/mysql/conf.d:/etc/mysql/conf.d
      - ./docker/mysql/data:/var/lib/mysql
      - ./docker/mysql/init:/docker-entrypoint-initdb.d
    command:
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_unicode_ci
      --default-authentication-plugin=mysql_native_password
      --innodb-buffer-pool-size=512M
      --max-connections=200
      --slow-query-log=1
      --long-query-time=2
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: ${COMPOSE_PROJECT_NAME:-myapp}-redis
    restart: unless-stopped
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - ./docker/redis/data:/data
    command: >
      redis-server
      --appendonly yes
      --maxmemory 256mb
      --maxmemory-policy allkeys-lru
      --requirepass ${REDIS_PASSWORD:-}
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  app-network:
    driver: bridge
```

### Step 4: 创建 MySQL 配置文件

```ini
# docker/mysql/conf.d/my.cnf

[mysqld]
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
max_connections = 200
innodb_buffer_pool_size = 512M
innodb_log_file_size = 128M
innodb_flush_log_at_trx_commit = 2
slow_query_log = 1
long_query_time = 2
skip-name-resolve
lower_case_table_names = 1

[client]
default-character-set = utf8mb4

[mysql]
default-character-set = utf8mb4
```

### Step 5: 数据库初始化脚本（可选）

```sql
-- docker/mysql/init/01-init.sql

CREATE DATABASE IF NOT EXISTS `${MYSQL_DATABASE}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `${MYSQL_DATABASE}`;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Step 6: 创建 `.gitignore`

```bash
.env
docker/mysql/data/
docker/redis/data/
*.log
.DS_Store
.idea/
```

### Step 7: 启动本地开发环境

```bash
docker compose up -d
docker compose ps
docker compose logs -f mysql
```

---

## 三、生产环境部署

### Step 1: 服务器初始化

```bash
ssh root@your_server_ip

apt update && apt upgrade -y
apt install -y git curl wget vim ufw

curl -fsSL https://get.docker.com | sh
systemctl start docker && systemctl enable docker

mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
```

### Step 2: 防火墙配置

```bash
ufw enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
# 注意：不要开放 3306 和 6379 给外网！
ufw status verbose
```

### Step 3: 克隆项目并配置

```bash
adduser deploy
usermod -aG sudo deploy
usermod -aG docker deploy
su - deploy

cd /opt
sudo mkdir projects && sudo chown deploy:deploy projects
cd projects
git clone https://github.com/your-username/your-project.git
cd your-project

cp .env.example .env
vim .env
```

**生产环境 `.env` 配置：**

```bash
# 使用强密码！
MYSQL_ROOT_PASSWORD=Prod_Root_P@ssw0rd_Secure_2024!
MYSQL_DATABASE=myapp_prod
MYSQL_USER=appuser_prod
MYSQL_PASSWORD=App_Pr0d_P@ss_Secure_2024!
MYSQL_PORT=3306
REDIS_PORT=6379
REDIS_PASSWORD=R3dis_Pr0d_Secure_P@ss_2024!
APP_ENV=production
COMPOSE_PROJECT_NAME=myapp-prod
```

### Step 4: 生产环境 MySQL 优化配置

```ini
# docker/mysql/conf.d/my.cnf (生产环境)

[mysqld]
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
max_connections = 200
wait_timeout = 600
interactive_timeout = 600

# 针对 4GB 内存优化
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT
innodb_io_capacity = 200

# 日志
slow_query_log = 1
long_query_time = 1
log_queries_not_using_indexes = 1
log_error = /var/log/mysql/error.log

# 安全
skip-name-resolve
local_infile = 0

[client]
default-character-set = utf8mb4
```

### Step 5: 启动服务并验证

```bash
cd /opt/projects/your-project
docker compose pull
docker compose up -d
docker compose ps

# 验证 MySQL
docker exec -it myapp-prod-mysql mysql -u root -p -e "SELECT VERSION();"

# 验证 Redis
docker exec -it myapp-prod-redis redis-cli ping
```

---

## 四、数据迁移方案

### 从开发到生产的完整流程

#### 导出本地数据

```bash
# 本地执行

# 完整导出（推荐）
docker exec myapp-dev-mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  --hex-blob \
  myapp > backup_$(date +%Y%m%d_%H%M%S).sql

# 仅导出结构
docker exec myapp-dev-mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} --no-data myapp > structure.sql

# 仅导出数据
docker exec myapp-dev-mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} --no-create-info myapp > data.sql
```

#### 传输到服务器

```bash
# SCP 传输
scp backup_20260506_120000.sql deploy@your_server_ip:/opt/projects/backup/

# 或压缩后传输（节省带宽）
tar czf backup.tar.gz backup_*.sql
scp backup.tar.gz deploy@your_server_ip:/opt/projects/backup/
```

#### 导入到生产环境

```bash
# 服务器上执行
cd /opt/projects/backup/
tar xzf backup.tar.gz

cat backup_20260506_120000.sql | docker exec -i myapp-prod-mysql mysql -u root -p myapp_prod
```

### Redis 数据迁移

```bash
# 本地导出
npm install -g redis-dump
redis-dump -u redis://localhost:6379 > redis_backup.json

# 传输后导入
cat redis_backup.json | redis-load -u redis://:PASSWORD@localhost:6379
```

---

## 五、常用运维命令

### 服务管理

```bash
# 启动/停止/重启
docker compose up -d
docker compose down
docker compose restart mysql
docker compose restart redis

# 查看状态和日志
docker compose ps
docker compose logs -f mysql
docker compose logs --tail=100 redis
```

### 自动备份脚本

```bash
cat > /opt/projects/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# MySQL 备份
source /opt/projects/your-project/.env
docker exec myapp-prod-mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD \
  --single-transaction --routines --triggers \
  myapp_prod > $BACKUP_DIR/mysql_$DATE.sql

# 清理 7 天前的备份
find $BACKUP_DIR -mtime +7 -delete
echo "Backup completed at $(date)"
EOF

chmod +x /opt/projects/backup.sh

# 设置定时任务（每天凌晨 2 点）
crontab -e
# 0 2 * * * /opt/projects/backup.sh >> /var/log/backup.log 2>&1
```

### 监控命令

```bash
# MySQL 监控
docker exec myapp-prod-mysql mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';"
docker exec myapp-prod-mysql mysql -u root -p -e "SHOW PROCESSLIST;"

# Redis 监控
docker exec myapp-prod-redis redis-cli INFO memory
docker exec myapp-prod-redis redis-cli DBSIZE
```

### 故障排查

```bash
# 容器无法启动 → 查看日志
docker compose logs mysql

# 连接被拒绝 → 检查端口
docker compose ps
netstat -tlnp | grep 3306

# 内存不足 → 检查资源
free -h
docker stats

# 重置 MySQL 密码
docker exec -it myapp-prod-mysql mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

---

## 六、安全加固 Checklist

| 项目 | 说明 |
|------|------|
| 强密码 | Root密码 > 16位，包含大小写数字特殊字符 |
| 防火墙 | 关闭 3306/6379 外网访问 |
| 定期备份 | 每日自动备份 + 异地存储 |
| 日志监控 | 开启慢查询日志 |
| 版本更新 | 定期更新镜像 |
| 访问控制 | 应用使用独立数据库账号 |

---

## 附录：快速参考

```bash
# ===== 本地开发 =====
cp .env.example .env && docker compose up -d

# ===== 服务器部署 =====
ssh root@server
curl -fsSL https://get.docker.com | sh
git clone <repo> && cd <project>
cp .env.example .env && vim .env
docker compose up -d

# ===== 数据迁移 =====
# 导出: docker exec mysql mysqldump ... > backup.sql
# 传输: scp backup.sql server:/path/
# 导入: cat backup.sql | docker exec -i mysql mysql ...

# ===== 日常维护 =====
docker compose ps           # 查状态
docker compose logs -f      # 看日志
docker compose restart      # 重启服务
docker compose down && docker compose up -d  # 全部重启
```
