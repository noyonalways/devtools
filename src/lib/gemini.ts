import { GoogleGenAI } from "@google/genai";

// The API key is handled by the platform environment
let aiInstance: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in the environment');
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export const MODELS = {
  DEFAULT: "gemini-3-flash-preview",
  PRO: "gemini-3.1-pro-preview",
  IMAGE: "gemini-2.5-flash-image",
};
