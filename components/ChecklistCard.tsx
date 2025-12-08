
import React, { useState, useMemo } from 'react';
import Card from './Card';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';
import { ChecklistItem } from '../types';

const initialItems: ChecklistItem[] = [
  { id: 1, text: '水 (3日分)', checked: true, category: '食料・水' },
  { id: 2, text: '非常食 (3日分)', checked: true, category: '食料・水' },
  { id: 3, text: '救急箱', checked: false, category: '医療品' },
  { id: 4, text: '懐中電灯と電池', checked: true, category: '必需品' },
  { id: 5, text: '携帯ラジオ', checked: false, category: '必需品' },
  { id: 6, text: '家具の固定', checked: false, category: '家の対策' },
];

const ChecklistCard: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);

  const toggleItem = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const progress = useMemo(() => {
    const checkedCount = items.filter((item) => item.checked).length;
    return Math.round((checkedCount / items.length) * 100);
  }, [items]);

  return (
    <Card title="わが家の防災チェック" icon={<CheckBadgeIcon />}>
      <div>
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-blue-700">進捗</span>
            <span className="text-sm font-medium text-blue-700">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center">
              <input
                id={`item-${item.id}`}
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(item.id)}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={`item-${item.id}`} className={`ml-3 text-sm font-medium text-gray-900 ${item.checked ? 'line-through text-gray-500' : ''}`}>
                {item.text}
              </label>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ChecklistCard;
