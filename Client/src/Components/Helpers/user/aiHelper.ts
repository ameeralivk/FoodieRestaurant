import { sendToAi } from "../../../services/user";

export interface GeneratedItemData {
  description: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Simple in-memory cache to save your API quota
const aiCache = new Map<string, GeneratedItemData>();

export const fetchItemDetailsFromAi = async (itemName: string): Promise<GeneratedItemData> => {
  const nameKey = itemName.toLowerCase().trim();

  // 1. Check Cache first (No API call if we already have it!)
  if (aiCache.has(nameKey)) {
    return aiCache.get(nameKey)!;
  }

  try {
    // 2. Updated Prompt for strict JSON (prevents parsing errors)
    const prompt = `Return ONLY a JSON object for the food item: ${itemName}. 
      Do not include any conversational text.
      Format:
      {
        "description": "max 150 chars",
        "calories": 0,
        "protein": 0,
        "carbs": 0,
        "fat": 0
      }`;

    const res = await sendToAi(prompt);
    
    // 3. Extract JSON
    const jsonMatch = res.reply.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response format");

    const parsed = JSON.parse(jsonMatch[0]);

    const finalData = {
      description: parsed.description || "Freshly prepared delicious meal.",
      nutrition: {
        calories: Number(parsed.calories) || 0,
        protein: Number(parsed.protein) || 0,
        carbs: Number(parsed.carbs) || 0,
        fat: Number(parsed.fat) || 0,
      },
    };

    // 4. Save to cache
    aiCache.set(nameKey, finalData);

    return finalData;

  } catch (error: any) {
    console.error("AI Fetch Utility Error:", error);

    // 5. Special handling for the 429 error
    if (error.message?.includes("429")) {
       alert("AI Limit reached. Using default data for now.");
    }

    return {
      description: `${itemName} prepared with high-quality ingredients.`,
      nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    };
  }
};