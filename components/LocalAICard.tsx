import React, { useState, useCallback } from 'react';
import Card from './Card';
import { SparklesIcon } from './icons/SparklesIcon';
import { askOllama } from '../services/ollamaService';

const LocalAICard: React.FC = () => {
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
      const result = await askOllama(query);
      setResponse(result);
    } catch (err) {
      let errorMessage = '情報の取得中にエラーが発生しました。もう一度お試しください。';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  return (
    <Card title="ローカル防災AI" icon={<SparklesIcon />}>
      <div className="flex flex-col h-full">
        <p className="text-sm text-gray-600 mb-4">
          インターネット接続なしで動作するAIアシスタントです。防災知識ベースと連携して回答します。
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="例: 地震が起きたらどうする？"
              className="flex-grow p-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors whitespace-nowrap"
              disabled={isLoading}
            >
              {isLoading ? '生成中...' : '質問する'}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {response && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 overflow-y-auto max-h-60">
            <h4 className="font-semibold text-gray-700 mb-2">AIの回答:</h4>
            <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
              {response}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LocalAICard;
