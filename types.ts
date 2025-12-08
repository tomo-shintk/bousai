
export enum SafetyStatus {
  Safe = '安全',
  Unconfirmed = '未確認',
  NeedsHelp = '要救助',
}

export interface FamilyMember {
  id: number;
  name: string;
  status: SafetyStatus;
}

export interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
  category: string;
}

export enum RequestType {
  Request = 'お願い',
  Offer = '提供',
}

export interface CommunityPost {
  id: number;
  type: RequestType;
  item: string;
  user: string;
  distance: string;
}
