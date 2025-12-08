
import React from 'react';
import Card from './Card';
import { MapPinIcon } from './icons/MapPinIcon';

const EvacuationCard: React.FC = () => {
  return (
    <Card title="避難計画アシスタント" icon={<MapPinIcon />}>
      <div className="flex flex-col h-full">
        <div className="bg-gray-200 rounded-lg flex-grow flex items-center justify-center mb-4">
           <img src="https://picsum.photos/400/200?grayscale" alt="Map" className="w-full h-full object-cover rounded-lg"/>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          現在地周辺のハザードマップを基に、安全な避難場所へのルートを検索します。
        </p>
        <button className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
          安全なルートを検索
        </button>
      </div>
    </Card>
  );
};

export default EvacuationCard;
