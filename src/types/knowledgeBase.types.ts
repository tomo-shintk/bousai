export type DisasterCategory =
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

export interface DisasterKnowledge {
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
