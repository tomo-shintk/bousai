
import React, { useState } from 'react';
import Card from './Card';
import { UsersIcon } from './icons/UsersIcon';
import { CommunityPost, RequestType } from '../types';

const mockPosts: CommunityPost[] = [
  { id: 1, type: RequestType.Request, item: '粉ミルク', user: '佐藤さん', distance: '300m' },
  { id: 2, type: RequestType.Request, item: '水 (2L x 3)', user: '鈴木さん', distance: '500m' },
  { id: 3, type: RequestType.Offer, item: '毛布 (5枚)', user: '高橋さん', distance: '1.2km' },
  { id: 4, type: RequestType.Offer, item: '通訳 (英語)', user: '田中さん', distance: '800m' },
  { id: 5, type: RequestType.Request, item: '常備薬', user: '伊藤さん', distance: '250m' },
];

const CommunityHelpCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RequestType>(RequestType.Request);

  const filteredPosts = mockPosts.filter(p => p.type === activeTab);

  const TabButton: React.FC<{ type: RequestType }> = ({ type }) => (
    <button
      onClick={() => setActiveTab(type)}
      className={`flex-1 py-2 px-4 text-sm font-medium rounded-md focus:outline-none transition-colors duration-200 ${
        activeTab === type
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      }`}
    >
      {type}
    </button>
  );

  return (
    <Card title="地域で支え合う「共助」" icon={<UsersIcon />}>
      <div className="flex flex-col h-full">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg mb-4">
          <TabButton type={RequestType.Request} />
          <TabButton type={RequestType.Offer} />
        </div>
        <div className="flex-grow overflow-y-auto max-h-64 pr-2">
          <ul className="space-y-2">
            {filteredPosts.map(post => (
              <li key={post.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">{post.item}</p>
                  <p className="text-xs text-gray-500">{post.user} • {post.distance}</p>
                </div>
                <button className="bg-white border border-blue-500 text-blue-500 text-xs font-bold py-1 px-3 rounded-full hover:bg-blue-50">
                  詳細
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default CommunityHelpCard;
