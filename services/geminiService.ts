
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this example, we throw an error if the key is missing.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `あなたは親切で優秀な防災アシスタントです。日本の災害対策に関する質問に対して、子供や外国人にも理解しやすいように、専門用語を避けた「やさしい日本語」で、簡潔かつ正確に回答してください。箇条書きや絵文字を効果的に使って、情報を分かりやすく伝えてください。`;

export const askGemini = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("APIキーが設定されていないため、AIアシスタントは利用できません。");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get response from Gemini API.");
  }
};
