// import { IAIService } from "../interface/IAiService";
// import openai from "../../../config/opneAi";

// export class AIService implements IAIService {
//   async getReply(prompt: string): Promise<string> {
//     const response = await openai.responses.create({
//       model: "gpt-4.1-mini",
//       input: prompt,
//     });

//     return response.output_text ?? "No response generated";
//   }
// }
import { injectable } from "inversify";
import { IAIService } from "../interface/IAiService";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppError } from "../../../utils/Error";

@injectable()
export class AIService implements IAIService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Ensure your GEMINI_API_KEY is in your .env file
    const apiKey = process.env.GEMINI_API_KEY || "";
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async getReply(prompt: string): Promise<string> {
    try {
      // 1. Initialize the model (Gemini 2.0 Flash is the 2026 standard for free tier)
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      console.log("hi", prompt);

      // 2. Generate content (Logic remains the same as your OpenAI call)
      const result = await model.generateContent(prompt);
      console.log(result, "resuls is hera mere");
      const response = result.response;

      // 3. Extract text (Equivalent to response.output_text)
      const text = response.text();

      return text || "No response generated";
    } catch (error: any) {
      // Handle the 15 requests-per-minute limit of the free tier
      if (error.status === 429) {
        throw new AppError(
          "Rate limit exceeded. Please wait a moment before trying again.",
        );
      }

      throw new AppError(`AI Service Error: ${error.message}`);
    }
  }
}
