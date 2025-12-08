
import React, { useState, useMemo, useCallback } from 'react';
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
  { id: 7, text: '現金 (小銭を含む)', checked: false, category: '必需品' },
  { id: 8, text: '常備薬', checked: false, category: '医療品' },
  { id: 9, text: '避難場所の確認', checked: false, category: '家の対策' },
];

const ChecklistCard: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [filter, setFilter] = useState<string>('all');

  const toggleItem = useCallback((id: number) => {
    setItems(prev =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  const progress = useMemo(() => {
    const checkedCount = items.filter((item) => item.checked).length;
    return Math.round((checkedCount / items.length) * 100);
  }, [items]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map(item => item.category)));
    return cats;
  }, [items]);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter(item => item.category === filter);
  }, [items, filter]);

  const getProgressColor = () => {
    if (progress === 100) return 'bg-green-600';
    if (progress >= 70) return 'bg-blue-600';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressMessage = () => {
    if (progress === 100) return '完璧です！';
    if (progress >= 70) return 'あと少しです！';
    if (progress >= 40) return '順調です！';
    return '準備を進めましょう！';
  };

  return (
    <Card title="わが家の防災チェック" icon={<CheckBadgeIcon />}>
      <div>
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-blue-700">進捗</span>
            <div className="flex items-center">
              <span className="text-xs text-gray-600 mr-2">{getProgressMessage()}</span>
              <span className="text-sm font-medium text-blue-700">{progress}%</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* カテゴリフィルター */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              すべて ({items.length})
            </button>
            {categories.map(cat => {
              const count = items.filter(item => item.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`text-xs px-2 py-1 rounded-full transition-colors ${
                    filter === cat 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {filteredItems.map((item) => (
            <div key={item.id} className="flex items-center hover:bg-gray-50 p-1 rounded transition-colors">
              <input
                id={`item-${item.id}`}
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(item.id)}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                aria-label={`${item.text}をチェック`}
              />
              <label 
                htmlFor={`item-${item.id}`} 
                className={`ml-3 text-sm font-medium flex-grow cursor-pointer ${
                  item.checked ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {item.text}
              </label>
              <span className="text-xs text-gray-400">{item.category}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ChecklistCard;
