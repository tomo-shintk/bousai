
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const systemInstruction = `あなたは親切で優秀な防災アシスタントです。日本の災害対策に関する質問に対して、子供や外国人にも理解しやすいように、専門用語を避けた「やさしい日本語」で、簡潔かつ正確に回答してください。箇条書きや絵文字を効果的に使って、情報を分かりやすく伝えてください。`;

/**
 * Gemini AIに質問を送信し、回答を取得します
 * @param prompt - 質問内容
 * @returns AI の回答テキスト
 * @throws エラーが発生した場合、ユーザーフレンドリーなメッセージを含むErrorをスロー
 */
export const askGemini = async (prompt: string): Promise<string> => {
  if (!API_KEY || !ai) {
    return Promise.resolve("APIキーが設定されていないため、AIアシスタントは利用できません。");
  }

  // 入力の検証
  if (!prompt || prompt.trim().length === 0) {
    throw new Error("質問を入力してください。");
  }

  if (prompt.length > 1000) {
    throw new Error("質問は1000文字以内で入力してください。");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt.trim(),
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    // response.text is a getter provided by the SDK that extracts text from the response
    const responseText = response?.text;
    
    if (!responseText || responseText.trim().length === 0) {
      throw new Error("AIからの応答が空でした。もう一度お試しください。");
    }
    
    return responseText;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    
    // より詳細なエラーメッセージを提供
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error("APIキーが無効です。設定を確認してください。");
      }
      if (error.message.includes('quota') || error.message.includes('limit')) {
        throw new Error("APIの利用制限に達しました。しばらくしてからお試しください。");
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error("ネットワークエラーが発生しました。接続を確認してください。");
      }
    }
    
    throw new Error("AIアシスタントへの接続に失敗しました。しばらくしてからお試しください。");
  }
};
