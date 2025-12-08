
import React, { useState, useMemo } from 'react';
import Card from './Card';
import { UsersIcon } from './icons/UsersIcon';
import { CommunityPost, RequestType } from '../types';

const mockPosts: CommunityPost[] = [
  { id: 1, type: RequestType.Request, item: '粉ミルク', user: '佐藤さん', distance: '300m' },
  { id: 2, type: RequestType.Request, item: '水 (2L x 3)', user: '鈴木さん', distance: '500m' },
  { id: 3, type: RequestType.Offer, item: '毛布 (5枚)', user: '高橋さん', distance: '1.2km' },
  { id: 4, type: RequestType.Offer, item: '通訳 (英語)', user: '田中さん', distance: '800m' },
  { id: 5, type: RequestType.Request, item: '常備薬', user: '伊藤さん', distance: '250m' },
  { id: 6, type: RequestType.Offer, item: '自転車', user: '山田さん', distance: '600m' },
  { id: 7, type: RequestType.Request, item: 'おむつ (Mサイズ)', user: '中村さん', distance: '400m' },
];

const CommunityHelpCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RequestType>(RequestType.Request);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = useMemo(() => {
    return mockPosts.filter(p => {
      const matchesType = p.type === activeTab;
      const matchesSearch = searchTerm === '' || 
        p.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [activeTab, searchTerm]);

  const TabButton: React.FC<{ type: RequestType }> = ({ type }) => {
    const count = mockPosts.filter(p => p.type === type).length;
    return (
      <button
        onClick={() => setActiveTab(type)}
        className={`flex-1 py-2 px-4 text-sm font-medium rounded-md focus:outline-none transition-colors duration-200 ${
          activeTab === type
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`}
        aria-label={`${type}を表示`}
      >
        {type} ({count})
      </button>
    );
  };

  return (
    <Card title="地域で支え合う「共助」" icon={<UsersIcon />}>
      <div className="flex flex-col h-full">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg mb-3">
          <TabButton type={RequestType.Request} />
          <TabButton type={RequestType.Offer} />
        </div>

        {/* 検索バー */}
        <div className="mb-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="物品や人を検索..."
            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="検索"
          />
        </div>

        <div className="flex-grow overflow-y-auto max-h-64 pr-2">
          {filteredPosts.length > 0 ? (
            <ul className="space-y-2">
              {filteredPosts.map(post => (
                <li 
                  key={post.id} 
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
                >
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{post.item}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="inline-flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {post.user}
                      </span>
                      <span className="mx-1">•</span>
                      <span className="inline-flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {post.distance}
                      </span>
                    </p>
                  </div>
                  <button 
                    className="bg-white border border-blue-500 text-blue-500 text-xs font-bold py-1 px-3 rounded-full hover:bg-blue-50 transition-colors ml-2"
                    aria-label={`${post.item}の詳細を表示`}
                  >
                    詳細
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">該当する情報が見つかりません</p>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <button className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300">
            + 新しい投稿
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CommunityHelpCard;
