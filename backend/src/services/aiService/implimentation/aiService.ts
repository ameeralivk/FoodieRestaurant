import { inject, injectable } from "inversify";
import { IAIService } from "../interface/IAiService";
import axios from "axios";
import { AppError } from "../../../utils/Error";
import { TYPES } from "../../../DI/types";
import { IItemsRepository } from "../../../Repositories/items/interface/interface";

@injectable()
export class AIService implements IAIService {
  constructor(
    @inject(TYPES.itemsRepository) private _item: IItemsRepository
  ) {}

  // 🔥 MAIN METHOD
  async getReply(
    prompt: string,
    restaurantId?: string,
    mode: "chat" | "generate" = "chat"
  ): Promise<any> {
    try {
      // ✅ 🧠 MODE 1: ITEM GENERATION (FOR ADD ITEM)
      if (mode === "generate") {
        return await this.generateItemDetails(prompt);
      }

      // ✅ 🧠 MODE 2: CHAT SYSTEM
      const intent = this.detectIntent(prompt);

      let matchedItems: any[] = [];

      if (restaurantId) {
        const { data: allItems } = await this._item.getAllByRestaurant(
          restaurantId,
          { isDeleted: false, isActive: true },
          1,
          1000,
          "user"
        );

        matchedItems = this.findMatchingItems(prompt, allItems);
      }

      if (matchedItems.length > 0) {
        return this.buildResponse(matchedItems, intent);
      }

      return await this.callChatAI(prompt);
    } catch (error: any) {
      throw new AppError(
        error.response?.data?.error?.message || error.message
      );
    }
  }

  // 🔥 GENERATE ITEM DETAILS (FIXED)
  private async generateItemDetails(itemName: string) {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are a food data generator.

Return ONLY valid JSON in this format:

{
  "description": "string",
  "nutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  }
}

NO explanation. ONLY JSON.
`,
          },
          {
            role: "user",
            content: itemName,
          },
        ],
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    let text = response.data.choices[0].message.content;

    // 🔥 FIX: CLEAN JSON RESPONSE
    text = text.replace(/```json|```/g, "").trim();

    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Invalid AI JSON response");
    }
  }

  // 🧠 INTENT
  private detectIntent(
    prompt: string
  ): "price" | "stock" | "preparation" | "recommend" | "general" {
    const text = prompt.toLowerCase();

    if (text.includes("price") || text.includes("cost")) return "price";
    if (text.includes("available") || text.includes("stock")) return "stock";
    if (text.includes("time")) return "preparation";
    if (text.includes("recommend")) return "recommend";

    return "general";
  }

  // 🧠 KEYWORDS
  private extractKeywords(prompt: string): string[] {
    const stopWords = [
      "what",
      "is",
      "the",
      "price",
      "of",
      "for",
      "a",
      "an",
      "do",
      "you",
      "have",
      "available",
      "show",
      "me",
      "give",
      "cost",
      "how",
      "much",
    ];

    return prompt
      .toLowerCase()
      .split(" ")
      .filter((w) => w && !stopWords.includes(w));
  }

  // 🔥 MATCHING
  private findMatchingItems(prompt: string, items: any[]): any[] {
    const keywords = this.extractKeywords(prompt);

    return items
      .map((item) => {
        const name = item.name.toLowerCase();
        let score = 0;

        keywords.forEach((k) => {
          if (name.includes(k)) score++;
        });

        return { item, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.item);
  }

  // 🎯 RESPONSE
  private buildResponse(items: any[], intent: string): string {
    switch (intent) {
      case "price":
        return items
          .map((i) => `💰 ${i.name} costs ₹${i.price}`)
          .join("\n");

      case "stock":
        return items
          .map((i) =>
            i.isStock
              ? `✅ ${i.name} is available`
              : `❌ ${i.name} is out of stock`
          )
          .join("\n");

      case "preparation":
        return items
          .map(
            (i) => `⏱️ ${i.name} takes ${i.preparationTime} minutes`
          )
          .join("\n");

      case "recommend":
        return "🔥 Recommended:\n" + this.formatItems(items.slice(0, 3));

      default:
        return this.formatItems(items);
    }
  }

  private formatItems(items: any[]): string {
    return items
      .map(
        (i) =>
          `🍽️ ${i.name} - ₹${i.price} (Prep: ${i.preparationTime} min)`
      )
      .join("\n");
  }

  // 🤖 CHAT AI
  private async callChatAI(prompt: string): Promise<string> {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are a food assistant.
Only answer food-related queries.
`,
          },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  }
}