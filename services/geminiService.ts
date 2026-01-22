
import { GoogleGenAI, Type } from "@google/genai";

// Use direct process.env.API_KEY as per guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPriceSuggestion = async (productName: string, location: string, category: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest a fair market price for ${productName} (${category}) in ${location}, India. Give a single numeric value in INR per unit and a short one-sentence explanation of why based on current seasonal trends.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedPrice: { type: Type.NUMBER },
            explanation: { type: Type.STRING }
          },
          required: ["suggestedPrice", "explanation"]
        }
      }
    });
    // response.text is a property, correct usage
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Price suggestion error:", error);
    return { suggestedPrice: 0, explanation: "Could not fetch AI insights at this moment." };
  }
};

export const checkProductQuality = async (base64Image: string) => {
  const ai = getAI();
  try {
    // Using gemini-3-flash-preview for multimodal text output tasks as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Analyze the quality of this agricultural product. Rate it from 1 to 10 and provide brief feedback on freshness, color, and texture." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING }
          },
          required: ["score", "feedback"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Quality check error:", error);
    return { score: 0, feedback: "Error analyzing image." };
  }
};

export const getCropRecommendations = async (location: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the location ${location}, what are the top 3 high-demand crops to plant in the current season for maximum profit in India?`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              cropName: { type: Type.STRING },
              reason: { type: Type.STRING },
              expectedDemand: { type: Type.STRING }
            },
            required: ["cropName", "reason", "expectedDemand"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Crop recommendations error:", error);
    return [];
  }
};
