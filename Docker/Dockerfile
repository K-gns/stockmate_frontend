# Development Stage
FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm i

COPY . .

EXPOSE 3000


CMD ["npm", "run", "dev"]

# Builder Stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm


RUN pnpm install

COPY . .

RUN pnpm run build

# Production Stage

FROM node:18-alpine AS production

WORKDIR /app

RUN npm install -g pnpm

# Копируем собранные артефакты
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Переменные окружения
ENV NODE_ENV=production

EXPOSE 3000

CMD ["pnpm", "start"]

