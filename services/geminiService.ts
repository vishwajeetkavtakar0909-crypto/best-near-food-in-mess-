
import { GoogleGenAI, Type } from "@google/genai";

// Guideline: Always use a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key.

export const extractMenuFromImage = async (base64Image: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: "Extract the food items from this menu card image. Categorize them into breakfast, lunch, or dinner. For each item, identify if it's a bhaji, chapati, rice, or other. Also extract prices if visible." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            breakfast: {
              type: Type.OBJECT,
              properties: {
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                      price: { type: Type.NUMBER }
                    },
                    required: ["name", "category"]
                  }
                },
                price: { type: Type.NUMBER }
              }
            },
            lunch: {
              type: Type.OBJECT,
              properties: {
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                      price: { type: Type.NUMBER }
                    },
                    required: ["name", "category"]
                  }
                },
                price: { type: Type.NUMBER }
              }
            },
            dinner: {
              type: Type.OBJECT,
              properties: {
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                      price: { type: Type.NUMBER }
                    },
                    required: ["name", "category"]
                  }
                },
                price: { type: Type.NUMBER }
              }
            }
          }
        }
      }
    });

    // Guideline: Directly access the .text property on GenerateContentResponse
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini OCR Error:", error);
    return null;
  }
};

export const getSmartSuggestions = async (history: string[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on these user comments, suggest 3 new menu items or improvements for a local mess: ${history.join(', ')}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    // Guideline: Directly access the .text property on GenerateContentResponse
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return [];
  }
};
