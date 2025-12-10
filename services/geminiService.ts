import { GoogleGenAI, Type } from "@google/genai";
import { Movie } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchMoviesWithAI = async (query: string): Promise<Movie[]> => {
  if (!process.env.API_KEY) {
    console.error("API Key missing");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Suggest 5 movies based on this query: "${query}". 
      Return a JSON array where each object has:
      - id (random string)
      - title (Persian translation if possible, else English)
      - originalTitle
      - description (short summary in Persian)
      - rating (number between 1-10)
      - year (string)
      - genres (array of strings in Persian)
      
      For the images, since you cannot generate real URLs, I will handle them in the UI, but provide a 'posterUrl' field with value 'placeholder'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              originalTitle: { type: Type.STRING },
              description: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              year: { type: Type.STRING },
              genres: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              posterUrl: { type: Type.STRING },
            },
            required: ['id', 'title', 'description', 'rating', 'year', 'genres']
          }
        }
      }
    });

    const rawData = response.text;
    if (!rawData) return [];
    
    const parsedData = JSON.parse(rawData);
    
    // Enrich with placeholder images since AI returns 'placeholder' string
    return parsedData.map((m: any, index: number) => ({
      ...m,
      posterUrl: `https://picsum.photos/300/450?random=${Date.now() + index}`,
      backdropUrl: `https://picsum.photos/800/400?random=${Date.now() + index}`,
    }));

  } catch (error) {
    console.error("Gemini AI Search Error:", error);
    return [];
  }
};