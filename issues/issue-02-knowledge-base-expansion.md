# Issue #2: 防災知識ベースの拡充

## 概要
現在の簡易的なキーワードマッチングシステムを、包括的で詳細な防災知識ベースに拡張し、より実践的で地域特化した情報提供を実現する。

## 目的
- 災害種別ごとの詳細な対応手順の提供
- 地域別ハザードマップデータの統合
- 多言語対応による外国人住民への支援
- 時系列に沿った段階的な防災情報の提供

## 背景
現在の`geminiService.ts`には以下の制限がある：
- 7つの基本キーワードのみ対応
- 回答が一般的で具体性に欠ける
- 地域差や季節性を考慮していない
- 多言語対応なし

## データ構造設計

### 知識ベースのスキーマ

```typescript
interface DisasterKnowledge {
  id: string;
  category: DisasterCategory;
  subcategory?: string;
  title: string;
  content: {
    ja: string;
    en?: string;
    "ja-easy"?: string; // やさしい日本語
    zh?: string; // 中国語
    ko?: string; // 韓国語
  };
  severity: "low" | "medium" | "high" | "critical";
  targetAudience?: string[]; // ["elderly", "children", "disabled", "foreigners"]
  region?: string[]; // 対象地域
  season?: string[]; // 対象季節
  relatedTopics?: string[]; // 関連トピックID
  sources: string[]; // 情報源URL
  lastUpdated: string;
  media?: {
    images?: string[];
    videos?: string[];
    audio?: string[];
  };
}

type DisasterCategory = 
  | "earthquake" // 地震
  | "tsunami" // 津波
  | "typhoon" // 台風
  | "flood" // 洪水
  | "landslide" // 土砂災害
  | "fire" // 火災
  | "volcanic" // 火山
  | "heavySnow" // 大雪
  | "heatwave" // 猛暑
  | "preparation" // 事前準備
  | "evacuation" // 避難
  | "communication" // 連絡・通信
  | "firstAid"; // 応急手当
```

### データファイル構成

```
data/
├── disasters/
│   ├── earthquake/
│   │   ├── before.json      # 事前準備
│   │   ├── during.json      # 発生時
│   │   ├── after.json       # 発生後
│   │   └── faq.json         # よくある質問
│   ├── tsunami/
│   ├── typhoon/
│   └── ...
├── regions/
│   ├── tokyo.json           # 東京都の情報
│   ├── osaka.json
│   └── ...
├── checklists/
│   ├── emergency-kit.json   # 非常持ち出し袋
│   ├── stockpile.json       # 備蓄品
│   └── family-plan.json     # 家族計画
└── glossary/
    ├── terms-ja.json        # 用語集
    └── terms-easy-ja.json   # やさしい日本語用語集
```

---

## 実装計画

### Phase 1: データ収集とキュレーション

**情報源:**
1. **公的機関**
   - 気象庁（防災情報）
   - 内閣府（防災情報のページ）
   - 消防庁（防災マニュアル）
   - 各自治体のハザードマップ

2. **信頼できる組織**
   - 日本赤十字社
   - 防災科学技術研究所
   - 国土交通省（河川・道路情報）

**データ項目:**
- [ ] 地震対応（震度別・場所別）
- [ ] 津波避難（沿岸部特化）
- [ ] 台風・豪雨対策
- [ ] 火災対応（建物種別）
- [ ] 土砂災害警戒
- [ ] 火山噴火対応
- [ ] 大雪対策
- [ ] 熱中症予防
- [ ] 備蓄品リスト（家族構成別）
- [ ] 避難所情報（バリアフリー情報含む）
- [ ] 応急手当方法
- [ ] ペット同行避難

**推定工数:** 10-15時間

---

### Phase 2: データベース実装

**技術選定:**

#### Option A: JSON + 全文検索
```typescript
// services/knowledgeBase.ts
import Fuse from 'fuse.js';

class KnowledgeBase {
  private fuse: Fuse<DisasterKnowledge>;
  
  async search(query: string, filters?: SearchFilters): Promise<DisasterKnowledge[]> {
    // 全文検索 + フィルタリング
  }
  
  async getByCategory(category: DisasterCategory): Promise<DisasterKnowledge[]> {
    // カテゴリ別取得
  }
}
```

**メリット:**
- ✅ 実装が簡単
- ✅ バージョン管理が容易（Git）
- ✅ オフライン動作
- ✅ 軽量

**推定工数:** 4-6時間

---

#### Option B: SQLite + FTS5（全文検索）
```typescript
// services/database.ts
import Database from 'better-sqlite3';

class DisasterDB {
  private db: Database.Database;
  
  async fullTextSearch(query: string): Promise<DisasterKnowledge[]> {
    // FTS5を使用した高速検索
  }
}
```

**メリット:**
- ✅ 高速な検索
- ✅ 複雑なクエリに対応
- ✅ データ整合性

**推定工数:** 8-10時間

---

### Phase 3: 検索・推薦アルゴリズム

**実装機能:**

1. **セマンティック検索**
```typescript
// 類義語・関連語を考慮した検索
const synonyms = {
  "避難": ["逃げる", "にげる", "退避"],
  "備蓄": ["準備", "用意", "ストック"],
  "地震": ["じしん", "揺れ", "earthquake"]
};
```

2. **コンテキスト認識**
```typescript
// ユーザーの状況を考慮
interface UserContext {
  location?: { lat: number; lng: number };
  language: string;
  accessibility?: ("elderly" | "wheelchair" | "visual" | "hearing")[];
  familySize?: number;
  hasPets?: boolean;
}
```

3. **優先度付けロジック**
```typescript
function prioritizeResults(results: DisasterKnowledge[], context: UserContext) {
  return results.sort((a, b) => {
    // 1. 緊急度
    // 2. 地域関連性
    // 3. ユーザー特性との一致度
  });
}
```

**推定工数:** 6-8時間

---

### Phase 4: 多言語対応

**実装方針:**
- 主要言語: 日本語、英語、やさしい日本語
- 副次言語: 中国語、韓国語、ベトナム語、ポルトガル語

**やさしい日本語の例:**
```json
{
  "title": "地震が起きたとき",
  "content": {
    "ja": "地震が発生したら、まず身の安全を確保してください。",
    "ja-easy": "地震のとき、まず 自分の体を 守ってください。",
    "en": "During an earthquake, protect yourself first."
  }
}
```

**ツール:**
- Google Translate API（オフライン用は事前翻訳）
- やさしい日本語変換ツール
- ネイティブチェック

**推定工数:** 12-16時間（翻訳含む）

---

## ファイル構成

### 新規作成
```
src/
├── data/
│   ├── disasters/
│   │   └── [各災害種別のJSONファイル]
│   ├── regions/
│   └── checklists/
├── services/
│   ├── knowledgeBase.ts
│   ├── searchEngine.ts
│   └── translationService.ts
├── types/
│   └── knowledgeBase.types.ts
└── utils/
    └── textProcessing.ts
```

### 変更
- `services/geminiService.ts` - 知識ベース統合
- `components/GeminiAICard.tsx` - 検索UI改善

---

## データサンプル

### 地震対応データ例
```json
{
  "id": "earthquake-during-indoor",
  "category": "earthquake",
  "subcategory": "during",
  "title": "地震発生時の屋内での行動",
  "content": {
    "ja": "地震が発生したら以下の行動を取ってください：\n\n1. まず低い姿勢になり、頭を守る\n2. 机やテーブルの下に隠れる\n3. 揺れが収まるまでじっとしている\n4. 慌てて外に飛び出さない\n5. 揺れが収まったら火の始末と出口の確保",
    "ja-easy": "地震のとき、建物の中にいる人へ：\n\n1. 低く なってください\n2. 頭を 守ってください\n3. 机の下に 入ってください\n4. 揺れが 止まるまで 動かないでください\n5. 外に すぐに 出ないでください",
    "en": "During an earthquake indoors:\n\n1. DROP to your hands and knees\n2. Take COVER under a desk or table\n3. HOLD ON until the shaking stops\n4. Don't rush outside\n5. After shaking stops, check for fires and clear exits"
  },
  "severity": "critical",
  "targetAudience": ["general"],
  "relatedTopics": ["earthquake-after-indoor", "evacuation-route"],
  "sources": [
    "https://www.jma.go.jp/",
    "https://www.fdma.go.jp/"
  ],
  "lastUpdated": "2025-12-08",
  "media": {
    "images": ["/assets/earthquake-drop-cover-hold.png"]
  }
}
```

---

## テスト計画

### データ品質テスト
- [ ] 全データのJSON妥当性検証
- [ ] 必須フィールドの存在確認
- [ ] 翻訳の一貫性チェック
- [ ] リンク切れチェック
- [ ] 情報の最新性確認

### 機能テスト
- [ ] キーワード検索の精度テスト
- [ ] 多言語切り替えテスト
- [ ] フィルタリング機能テスト
- [ ] 関連トピック推薦テスト

### パフォーマンステスト
- [ ] 検索速度（目標: 100ms以内）
- [ ] データロード時間
- [ ] メモリ使用量

---

## マイルストーン

### Phase 1: データ収集（1週間）
- [ ] 公的機関からのデータ収集
- [ ] データ構造の確定
- [ ] 初期100件のデータ作成

### Phase 2: 実装（1週間）
- [ ] 知識ベースサービスの実装
- [ ] 検索エンジンの統合
- [ ] UIの更新

### Phase 3: 翻訳・多言語化（1週間）
- [ ] やさしい日本語への変換
- [ ] 英語・中国語・韓国語への翻訳
- [ ] ネイティブチェック

### Phase 4: テスト・改善（3日）
- [ ] 品質テスト
- [ ] ユーザビリティテスト
- [ ] フィードバック反映

---

## 運用・更新計画

### 定期更新
- 月次: 災害情報の最新化
- 四半期: 地域データの更新
- 年次: 法令・ガイドライン改定の反映

### コミュニティ貢献
- GitHub Issuesでの情報提供受付
- Pull Requestによるデータ追加
- 多言語翻訳のクラウドソーシング

---

## 参考資料

- [気象庁防災情報](https://www.jma.go.jp/jma/kishou/know/faq/index.html)
- [内閣府防災情報](http://www.bousai.go.jp/)
- [やさしい日本語ガイドライン](https://www.bunka.go.jp/seisaku/kokugo_nihongo/kyoiku/pdf/92484001_01.pdf)
- [多言語防災用語集](https://www.nhk.or.jp/lesson/en/)

---

## 関連Issue
- #1 ローカルLLMの統合
- #4 リアルタイム災害情報の取得と表示
- #6 音声入力・音声出力機能

---

## ラベル
`enhancement`, `high-priority`, `data`, `i18n`, `accessibility`
