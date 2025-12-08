
import React, { useState } from 'react';
import Card from './Card';
import { MapPinIcon } from './icons/MapPinIcon';

interface EvacuationSite {
  id: number;
  name: string;
  distance: string;
  capacity: string;
  type: string;
}

const nearbyEvacuationSites: EvacuationSite[] = [
  { id: 1, name: '中央小学校', distance: '450m', capacity: '300人', type: '指定避難所' },
  { id: 2, name: '市民体育館', distance: '800m', capacity: '500人', type: '指定避難所' },
  { id: 3, name: '中央公園', distance: '250m', capacity: '200人', type: '一時避難所' },
];

const EvacuationCard: React.FC = () => {
  const [showList, setShowList] = useState(false);

  return (
    <Card title="避難計画アシスタント" icon={<MapPinIcon />}>
      <div className="flex flex-col h-full">
        <div className="bg-gray-200 rounded-lg flex-grow flex items-center justify-center mb-4 min-h-[150px] relative overflow-hidden">
          <img 
            src="https://picsum.photos/400/200?grayscale" 
            alt="周辺地図" 
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-blue-900 bg-opacity-10 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-md">
              <p className="text-sm font-semibold text-gray-800">現在地周辺のハザードマップ</p>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">
          現在地周辺のハザードマップを基に、安全な避難場所へのルートを検索します。
        </p>

        {/* 近隣避難所リスト */}
        {showList && (
          <div className="mb-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">近隣の避難所</h4>
            <div className="space-y-2">
              {nearbyEvacuationSites.map(site => (
                <div key={site.id} className="flex justify-between items-start text-xs bg-white p-2 rounded border border-gray-100">
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{site.name}</p>
                    <p className="text-gray-600">{site.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-600 font-semibold">{site.distance}</p>
                    <p className="text-gray-500">{site.capacity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <button 
            onClick={() => setShowList(!showList)}
            className="flex-1 bg-white border-2 border-blue-600 text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-300"
          >
            {showList ? '非表示' : '避難所リスト'}
          </button>
          <button className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
            ルート検索
          </button>
        </div>
      </div>
    </Card>
  );
};

export default EvacuationCard;
