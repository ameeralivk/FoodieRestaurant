import { TYPES } from "../../../DI/types";
import { IAIService } from "../../../services/aiService/interface/IAiService";
import { IAiController } from "../interface/IAiController";
import { inject, injectable } from "inversify";
import { Response,Request } from "express";
import { AppError } from "../../../utils/Error";
@injectable()
export class AiController implements IAiController {
  constructor(@inject(TYPES.aiService) private _AiService: IAIService) {}

  sendResponse = async(req: Request, res: Response): Promise<Response>=> {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const reply = await this._AiService.getReply(prompt);

     return res.status(200).json({ reply });
    } catch (error:any) {
       throw new  AppError(error.message)
    }
  }
}
