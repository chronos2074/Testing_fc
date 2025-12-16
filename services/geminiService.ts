import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFanMessage = async (prizeName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        あなたは「車いすラグビー」の熱血選手です。
        ファンクラブ会員がガチャを回して「${prizeName}」というタイトルの画像を当てました。
        
        このファンに向けて、以下の条件で短いメッセージ（50文字程度）を書いてください。
        
        条件:
        - とてもエネルギッシュで、パッション溢れる口調で。
        - 車いすラグビー用語（タックル、トライ、タイヤ、コートなど）を比喩に使って励ます。
        - 日本語で出力。
        - 絵文字を1つか2つ含める。
      `,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "ナイス！今月も応援ありがとう！次の試合も全力でぶつかるぜ！🔥"; // Fallback message
  }
};