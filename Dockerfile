# 开发环境Dockerfile (frontend/Dockerfile.dev)
FROM node:18-alpine

# 安装pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 优先复制包管理文件
COPY package.json pnpm-lock.yaml* ./

# 安装依赖（使用frozen-lockfile确保版本一致）
RUN pnpm install --frozen-lockfile

# 复制所有源文件（排除node_modules）
COPY public ./public
COPY app ./app
COPY . .

# 设置文件监听环境变量
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 3000

CMD ["pnpm", "dev"]