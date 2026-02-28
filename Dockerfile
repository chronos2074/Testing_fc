# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ビルド時に GEMINI_API_KEY を渡す（Cloud Build の --build-arg で指定）
ARG GEMINI_API_KEY
RUN echo "GEMINI_API_KEY=$GEMINI_API_KEY" > .env

RUN npm run build

# Stage 2: 本番用 - 静的ファイルを配信
FROM node:20-alpine

RUN npm install -g serve

WORKDIR /app
COPY --from=builder /app/dist ./dist

# Cloud Run は PORT 環境変数を設定する（デフォルト 8080）
ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "serve -s dist -l $PORT"]
