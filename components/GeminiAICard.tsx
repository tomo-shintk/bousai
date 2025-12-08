
import React, { useState, useCallback } from 'react';
import Card from './Card';
import { SparklesIcon } from './icons/SparklesIcon';
import { askGemini } from '../services/geminiService';

const GeminiAICard: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      const result = await askGemini(query);
      setResponse(result);
    } catch (err) {
      setError('情報の取得中にエラーが発生しました。もう一度お試しください。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  return (
    <Card title="防災AIアシスタント" icon={<SparklesIcon />}>
      <div className="flex flex-col h-full">
        <p className="text-sm text-gray-600 mb-4">
          地震や防災に関する質問を入力してください。AIが「やさしい日本語」で回答します。
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="例: 地震が起きたらまず何をすべき？"
              className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? '...' : '質問'}
            </button>
          </div>
        </form>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg min-h-[100px] flex-grow whitespace-pre-wrap font-mono text-sm text-gray-800 overflow-y-auto">
          {isLoading && <div className="animate-pulse">AIが回答を考えています...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {response && <div>{response}</div>}
        </div>
      </div>
    </Card>
  );
};

export default GeminiAICard;
