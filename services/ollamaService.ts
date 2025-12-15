import { Ollama } from 'ollama/browser';
import { knowledgeBase } from '../src/services/knowledgeBase';

const ollama = new Ollama({ host: 'http://localhost:11434' });

const SYSTEM_PROMPT = `
あなたは防災の専門家です。
- やさしい日本語で回答してください
- 具体的で実践的なアドバイスを提供してください
- 緊急度の高い情報を優先してください
- 地域や状況に応じた柔軟な対応を心がけてください
`;

export const askOllama = async (prompt: string): Promise<string> => {
  try {
    // 1. まず知識ベースを検索
    const searchResults = await knowledgeBase.search(prompt);
    
    let context = "";
    if (searchResults.length > 0) {
      context = "\n\n参考情報:\n" + searchResults.map(item => 
        `【${item.title}】\n${item.content.ja}`
      ).join("\n\n");
    }

    // 2. 検索結果をコンテキストとしてプロンプトに追加
    const finalPrompt = context 
      ? `${prompt}\n\n以下の参考情報を元に回答してください。もし参考情報が質問と直接関係ない場合は、一般的な防災知識に基づいて回答してください。${context}`
      : prompt;

    const response = await ollama.chat({
      model: 'qwen2:0.5b', // メモリ制約のため軽量モデルを使用 (llama3.2:3b等は環境によってクラッシュする可能性があります)
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: finalPrompt }
      ],
    });
    return response.message.content;
  } catch (error) {
    console.error('Ollama error:', error);
    // エラーメッセージをより詳細に返す
    if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
            throw new Error('ローカルAIサーバーに接続できません。Ollamaが起動しているか確認してください。また、ブラウザのコンソールで詳細なエラーを確認してください。');
        }
        // モデルクラッシュ（500エラー）の場合
        if (error.message.includes('500')) {
             throw new Error('AIモデルの実行中にエラーが発生しました。メモリ不足の可能性があります。より軽量なモデル（qwen2:0.5bなど）を試してください。');
        }
    }
    throw error;
  }
};
