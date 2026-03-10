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
import axios from "axios";
import { AppError } from "../../../utils/Error";

@injectable()
export class AIService implements IAIService {
  async getReply(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );

      const text = response.data.choices[0].message.content;

      console.log(text, "Groq AI response");

      return text || "No response generated";
    } catch (error: any) {
      if (error.response?.status === 429) {
        throw new AppError(
          "Rate limit exceeded. Please wait before trying again.",
        );
      }

      throw new AppError(
        `AI Service Error: ${error.response?.data?.error?.message || error.message}`,
      );
    }
  }
}
