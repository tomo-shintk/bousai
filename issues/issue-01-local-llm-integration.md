# Issue #1: ローカルLLMの統合による完全オフライン化

## 概要
災害時のインターネット接続障害に対応するため、ローカルで動作するLLM（大規模言語モデル）を統合し、完全オフラインで動作する防災AIアシスタントを実装する。

## 目的
- インターネット接続なしでAI機能を利用可能にする
- API課金コストの削減
- プライバシー保護の強化
- 災害時の通信インフラ障害時でも機能する信頼性の確保

## 背景
現在の実装では、以下の課題がある：
- `geminiService.ts`は簡易的なキーワードマッチングのみ
- Gemini APIキーが未設定
- オンライン接続が前提となっており、災害時に機能しない可能性

## 実装方法

### Option A: Ollama統合（推奨）

**技術スタック:**
- Ollama（ローカルLLMランタイム）
- Llama 3.2 3B または Phi-3 Mini（軽量モデル）
- Docker Compose での統合

**実装ステップ:**

1. **docker-compose.ymlにOllamaサービスを追加**
```yaml
services:
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    command: serve

volumes:
  ollama_data:
```

2. **Ollamaクライアントライブラリの追加**
```bash
npm install ollama
```

3. **geminiService.tsをollamaService.tsにリファクタリング**
- Ollama APIエンドポイント: `http://ollama:11434`
- モデル: `llama3.2:3b` または `phi3:mini`
- システムプロンプト: 防災専門家としての役割定義

4. **防災特化プロンプトの設計**
```typescript
const systemPrompt = `
あなたは防災の専門家です。
- やさしい日本語で回答してください
- 具体的で実践的なアドバイスを提供してください
- 緊急度の高い情報を優先してください
- 地域や状況に応じた柔軟な対応を心がけてください
`;
```

**推定工数:** 3-4時間

**メリット:**
- ✅ 完全オフライン動作
- ✅ 追加コストなし
- ✅ モデルの切り替えが容易
- ✅ 高品質な応答生成

**デメリット:**
- ❌ 初回モデルダウンロードに時間がかかる（1-2GB）
- ❌ メモリ使用量が増加（推奨8GB RAM以上）

---

### Option B: WebLLM統合（ブラウザ内実行）

**技術スタック:**
- WebLLM / Transformers.js
- WebGPU
- Phi-2またはTinyLlama

**実装ステップ:**

1. **依存関係の追加**
```bash
npm install @mlc-ai/web-llm
```

2. **ブラウザ内LLMの初期化**
```typescript
import { CreateWebWorkerMLCEngine } from "@mlc-ai/web-llm";

const engine = await CreateWebWorkerMLCEngine(
  new Worker(new URL("./worker.ts", import.meta.url), { type: "module" }),
  "Phi2-q4f16_1"
);
```

3. **Service Workerでのモデルキャッシュ**

**推定工数:** 5-6時間

**メリット:**
- ✅ サーバー不要
- ✅ 完全ブラウザ内動作
- ✅ 配布が容易

**デメリット:**
- ❌ 初回ロードが遅い（モデルダウンロード）
- ❌ GPU必須（WebGPU対応ブラウザ）
- ❌ モバイルデバイスでのパフォーマンス課題

---

### Option C: RAG（Retrieval-Augmented Generation）アプローチ

**技術スタック:**
- ローカルベクトルDB（Chroma / LanceDB）
- 防災知識ベースのエンベディング
- 軽量LLM（Llama 3.2 1B）

**実装ステップ:**

1. **防災知識ベースの構築**
- 気象庁の防災ガイドライン
- 自治体の避難マニュアル
- 災害別対応手順

2. **ベクトルDBのセットアップ**
```bash
npm install chromadb
```

3. **RAGパイプラインの実装**
- ユーザークエリのエンベディング
- 関連知識の検索
- LLMによる回答生成

**推定工数:** 6-8時間

**メリット:**
- ✅ 高精度な回答
- ✅ 情報のトレーサビリティ
- ✅ 知識ベースの更新が容易

**デメリット:**
- ❌ 実装が複雑
- ❌ データ準備に時間がかかる

---

## 技術仕様

### 必須要件
- [ ] オフラインで動作すること
- [ ] 応答時間が5秒以内であること
- [ ] メモリ使用量が4GB以下であること
- [ ] Docker環境で動作すること

### 推奨要件
- [ ] 多言語対応（日本語、英語、やさしい日本語）
- [ ] コンテキストの保持（会話履歴）
- [ ] ストリーミング応答

### パフォーマンス目標
| 指標 | 目標値 |
|------|--------|
| 初回応答時間 | < 3秒 |
| 連続応答時間 | < 2秒 |
| メモリ使用量 | < 4GB |
| モデルサイズ | < 2GB |

---

## テスト計画

### 単体テスト
- [ ] LLMサービスの初期化テスト
- [ ] プロンプト生成ロジックのテスト
- [ ] エラーハンドリングのテスト

### 統合テスト
- [ ] フロントエンド-バックエンド連携テスト
- [ ] オフライン動作確認
- [ ] 複数クエリの連続実行テスト

### パフォーマンステスト
- [ ] 応答速度の計測
- [ ] メモリ使用量の監視
- [ ] 同時リクエスト処理のテスト

### ユーザビリティテスト
- [ ] 実際の防災質問での回答品質評価
- [ ] 高齢者・外国人による使用テスト
- [ ] 緊急時を想定したストレステスト

---

## 実装ファイル

### 新規作成
- `services/ollamaService.ts` - Ollama連携サービス
- `services/llmConfig.ts` - LLM設定管理
- `services/promptTemplates.ts` - プロンプトテンプレート
- `utils/responseFormatter.ts` - 応答フォーマッター
- `__tests__/ollamaService.test.ts` - テストファイル

### 変更
- `components/GeminiAICard.tsx` → `components/LocalAICard.tsx`
- `docker-compose.yml` - Ollamaサービス追加
- `package.json` - 依存関係追加
- `README.md` - セットアップ手順更新

---

## マイルストーン

### Phase 1: PoC（1-2日）
- [ ] Ollamaのローカルセットアップ
- [ ] 基本的な質問応答の動作確認
- [ ] パフォーマンス評価

### Phase 2: 統合（2-3日）
- [ ] Docker Composeへの統合
- [ ] UIコンポーネントの更新
- [ ] エラーハンドリングの実装

### Phase 3: 最適化（2-3日）
- [ ] プロンプトエンジニアリング
- [ ] 応答速度の改善
- [ ] メモリ最適化

### Phase 4: テスト・ドキュメント（1-2日）
- [ ] テストの実装と実行
- [ ] ドキュメントの作成
- [ ] デプロイ手順の整備

---

## 参考資料

- [Ollama公式ドキュメント](https://ollama.ai/docs)
- [Llama 3.2モデル仕様](https://ai.meta.com/llama/)
- [WebLLM GitHub](https://github.com/mlc-ai/web-llm)
- [防災情報APIドキュメント](https://www.jma.go.jp/jma/kishou/know/kurashi/index.html)

---

## 関連Issue
- #2 防災知識ベースの拡充
- #3 PWA化によるオフライン対応

---

## ラベル
`enhancement`, `high-priority`, `ai`, `offline-first`, `disaster-resilience`
