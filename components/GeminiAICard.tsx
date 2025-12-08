
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Card from './Card';
import { SparklesIcon } from './icons/SparklesIcon';
import { askGemini } from '../services/geminiService';

const GeminiAICard: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  // 回答が表示されたら自動的にスクロール
  useEffect(() => {
    if (response && responseRef.current) {
      responseRef.current.scrollTop = 0;
    }
  }, [response]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('質問を入力してください。');
      return;
    }

    if (trimmedQuery.length > 1000) {
      setError('質問は1000文字以内で入力してください。');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      const result = await askGemini(trimmedQuery);
      setResponse(result);
      setQuery(''); // 送信後にクリア
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '情報の取得中にエラーが発生しました。もう一度お試しください。';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
      // フォーカスを入力欄に戻す
      inputRef.current?.focus();
    }
  }, [query]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // 入力中はエラーをクリア
    if (error) setError(null);
  }, [error]);

  return (
    <Card title="防災AIアシスタント" icon={<SparklesIcon />}>
      <div className="flex flex-col h-full">
        <p className="text-sm text-gray-600 mb-4">
          地震や防災に関する質問を入力してください。AIが「やさしい日本語」で回答します。
        </p>
        <form onSubmit={handleSubmit} aria-label="AI質問フォーム">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="例: 地震が起きたらまず何をすべき？"
              className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={isLoading}
              maxLength={1000}
              aria-label="質問入力"
              aria-describedby="query-hint"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading || !query.trim()}
              aria-label="質問を送信"
            >
              {isLoading ? '送信中...' : '質問'}
            </button>
          </div>
          <p id="query-hint" className="text-xs text-gray-500 mt-1">
            {query.length > 0 && `${query.length}/1000文字`}
          </p>
        </form>
        <div 
          ref={responseRef}
          className="mt-4 p-4 bg-gray-50 rounded-lg min-h-[100px] flex-grow whitespace-pre-wrap text-sm text-gray-800 overflow-y-auto"
          role="region"
          aria-live="polite"
          aria-label="AI回答"
        >
          {isLoading && (
            <div className="animate-pulse flex items-center">
              <div className="mr-2">
                <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <span>AIが回答を考えています...</span>
            </div>
          )}
          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded border border-red-200" role="alert">
              <strong className="font-semibold">エラー: </strong>
              {error}
            </div>
          )}
          {response && (
            <div className="leading-relaxed">
              {response}
            </div>
          )}
          {!isLoading && !error && !response && (
            <div className="text-gray-400 text-center py-8">
              質問を入力して、AIアシスタントに相談しましょう
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default GeminiAICard;
