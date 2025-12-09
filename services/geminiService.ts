import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateDailyQuote = async (): Promise<string> => {
  if (!ai) return "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a short, inspiring, philosophical quote about technology, future, or serenity. Max 20 words. Do not include the author.",
    });
    return response.text || "Every moment is a fresh beginning.";
  } catch (error) {
    console.error("Failed to fetch quote", error);
    return "Simplicity is the ultimate sophistication.";
  }
};

export const chatWithGemini = async (message: string, history: {role: string, parts: {text: string}[]}[] = []): Promise<string> => {
  if (!ai) return "Please configure your API_KEY to use the AI assistant.";

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history as any,
      config: {
        systemInstruction: "You are a helpful, concise AI assistant integrated into a browser start page. Keep answers brief and helpful."
      }
    });

    const response: GenerateContentResponse = await chat.sendMessage({
      message: message
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Chat error", error);
    return "Sorry, I encountered an error connecting to the AI service.";
  }
};
