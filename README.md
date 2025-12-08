# つながる防災 (Connecting Disaster Prevention)

地域コミュニティの防災力を高めるためのWebアプリケーションです。AI機能を活用し、災害時の情報共有と避難支援を提供します。

## 特徴

- **避難場所マップ**: 近隣の避難所や安全な場所を確認
- **安全状況確認**: 地域の安全情報をリアルタイムで把握
- **コミュニティ支援**: 地域住民同士の助け合いをサポート
- **チェックリスト**: 防災準備と避難時の確認事項
- **Gemini AI統合**: AIによる防災アドバイスと質問応答

## 技術スタック

- **フロントエンド**: React 19.2 + TypeScript
- **ビルドツール**: Vite 6.2
- **AI**: Google Gemini API
- **スタイリング**: Tailwind CSS (カスタム)
- **コンテナ**: Docker + Docker Compose

## セットアップ

### 前提条件

- Node.js 20以上
- npm
- Gemini APIキー（[Google AI Studio](https://ai.google.dev/)で取得）

### ローカル環境での実行

1. **リポジトリのクローン**
   ```bash
   git clone <repository-url>
   cd bousai
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **環境変数の設定**
   
   `.env`ファイルを作成し、Gemini APIキーを設定:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **開発サーバーの起動**
   ```bash
   npm run dev
   ```

5. **ブラウザでアクセス**
   
   http://localhost:3000 を開く

### Docker環境での実行

**前提条件**: Docker と Docker Compose がインストールされていること

#### 開発環境

1. **環境変数の設定**
   ```bash
   # .envファイルを作成
   cp .env.example .env
   # エディタで.envファイルを開き、GEMINI_API_KEYを設定
   ```

2. **コンテナの起動**
   ```bash
   docker-compose up
   ```
   
   バックグラウンドで起動する場合:
   ```bash
   docker-compose up -d
   ```

3. **ブラウザでアクセス**
   
   http://localhost:3001 を開く

#### プロダクション環境

```bash
docker-compose --profile production up app-prod
```

#### Docker管理コマンド

```bash
# コンテナの停止
docker-compose down

# ログの確認
docker-compose logs -f

# コンテナの再起動
docker-compose restart

# イメージの再ビルド
docker-compose build --no-cache

# コンテナの状態確認
docker-compose ps
```

## ビルド

プロダクション用にビルドする場合:

```bash
npm run build
```

ビルドされたファイルは`dist`ディレクトリに出力されます。

プレビュー:

```bash
npm run preview
```

## プロジェクト構造

```
bousai/
├── components/          # Reactコンポーネント
│   ├── Card.tsx        # 基本カードコンポーネント
│   ├── ChecklistCard.tsx        # チェックリストカード
│   ├── CommunityHelpCard.tsx    # コミュニティ支援カード
│   ├── Dashboard.tsx            # メインダッシュボード
│   ├── EvacuationCard.tsx       # 避難場所カード
│   ├── GeminiAICard.tsx         # AI対話カード
│   ├── Header.tsx               # ヘッダー
│   ├── SafetyStatusCard.tsx     # 安全状況カード
│   └── icons/                   # アイコンコンポーネント
├── services/           # サービス層
│   └── geminiService.ts         # Gemini API連携
├── App.tsx             # メインアプリケーション
├── index.tsx           # エントリーポイント
├── types.ts            # TypeScript型定義
├── Dockerfile          # Dockerイメージ定義
├── docker-compose.yml  # Docker Compose設定
├── vite.config.ts      # Vite設定
└── tsconfig.json       # TypeScript設定
```

## 環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `GEMINI_API_KEY` | Google Gemini APIキー | ✓ |

## 開発

### コードの整形

TypeScriptの型チェック:
```bash
npx tsc --noEmit
```

### 新機能の追加

1. `components/`ディレクトリに新しいコンポーネントを作成
2. 必要に応じて`services/`にサービスロジックを追加
3. `Dashboard.tsx`で新しいコンポーネントを統合

## トラブルシューティング

### ポートが既に使用されている

Docker使用時にポート3001が使用中の場合、`docker-compose.yml`のポート設定を変更:
```yaml
ports:
  - "3002:3000"  # 3002など別のポートに変更
```

### Gemini APIエラー

- APIキーが正しく設定されているか確認
- `.env`ファイルがプロジェクトルートに存在するか確認
- APIキーの有効性を[Google AI Studio](https://ai.google.dev/)で確認

### Docker関連の問題

```bash
# コンテナとボリュームを完全に削除して再起動
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

## ライセンス

このプロジェクトはプライベートプロジェクトです。

## 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## サポート

問題が発生した場合は、GitHubのissueセクションで報告してください。
