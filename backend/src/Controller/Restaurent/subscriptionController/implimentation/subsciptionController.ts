import { inject, injectable } from "inversify";
import { ISubcriptionService } from "../../../../services/subscription/interface/ISubscriptionServer";
import { ISubcriptionController } from "../interface/ISubcriptionController";
import { TYPES } from "../../../../DI/types";
import { Request, Response } from "express";
import HttpStatus from "../../../../constants/htttpStatusCode";
@injectable()
export class SubcriptionController implements ISubcriptionController {
  constructor(
    @inject(TYPES.SubcriptionService)
    private _subcriptionPlanService: ISubcriptionService
  ) {}

  getPlan = async (req: Request, res: Response): Promise<Response> => {
    const restaurantId = req.params.restaurantId as string;
    if (!restaurantId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: "Restaurant ID is required",
      });
    }
    const plan = await this._subcriptionPlanService.getPlan(restaurantId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "No active plan found for this restaurant",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Plan fetched successfully",
      data: plan,
    });
  };
}
