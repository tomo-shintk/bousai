import Fuse from 'fuse.js';
import { DisasterKnowledge, DisasterCategory } from '../types/knowledgeBase.types';

// データをインポート (実際の実装では動的に読み込むか、ビルド時にバンドルする)
import earthquakeDuring from '../data/disasters/earthquake/during.json';
import tsunamiEvacuation from '../data/disasters/tsunami/evacuation.json';
import emergencyKit from '../data/checklists/emergency-kit.json';

// 全データを統合
const allKnowledge: DisasterKnowledge[] = [
  ...(earthquakeDuring as unknown as DisasterKnowledge[]),
  ...(tsunamiEvacuation as unknown as DisasterKnowledge[]),
  ...(emergencyKit as unknown as DisasterKnowledge[]),
];

export class KnowledgeBase {
  private fuse: Fuse<DisasterKnowledge>;
  private data: DisasterKnowledge[];

  constructor() {
    this.data = allKnowledge;
    
    const options = {
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'content.ja', weight: 0.5 },
        { name: 'content.ja-easy', weight: 0.4 },
        { name: 'category', weight: 0.3 },
        { name: 'subcategory', weight: 0.3 }
      ],
      threshold: 0.4, // 曖昧検索の閾値 (0.0は完全一致、1.0は全て一致)
      includeScore: true
    };

    this.fuse = new Fuse(this.data, options);
  }

  /**
   * クエリに基づいて知識ベースを検索する
   */
  async search(query: string, limit: number = 3): Promise<DisasterKnowledge[]> {
    if (!query.trim()) return [];

    const results = this.fuse.search(query);
    return results.slice(0, limit).map(result => result.item);
  }

  /**
   * カテゴリに基づいて知識を取得する
   */
  async getByCategory(category: DisasterCategory): Promise<DisasterKnowledge[]> {
    return this.data.filter(item => item.category === category);
  }

  /**
   * IDに基づいて特定の知識を取得する
   */
  async getById(id: string): Promise<DisasterKnowledge | undefined> {
    return this.data.find(item => item.id === id);
  }
  
  /**
   * 全データを取得する（デバッグ用など）
   */
  getAll(): DisasterKnowledge[] {
      return this.data;
  }
}

export const knowledgeBase = new KnowledgeBase();
