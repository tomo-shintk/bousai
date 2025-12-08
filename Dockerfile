# 開発環境用ステージ
FROM node:20-alpine AS development

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm install

# ポートの公開
EXPOSE 3000

# アプリケーションの起動（docker-composeでオーバーライド）
CMD ["npm", "run", "dev"]

# ビルドステージ
FROM node:20-alpine AS builder

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm install

# ソースコードのコピー
COPY . .

# ビルド
RUN npm run build

# プロダクション実行ステージ
FROM node:20-alpine AS production

WORKDIR /app

# ビルド成果物と必要なファイルのコピー
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --production

# 本番用サーバーをインストール
RUN npm install -g serve

# ポートの公開
EXPOSE 3000

# アプリケーションの起動
CMD ["serve", "-s", "dist", "-l", "3000"]
