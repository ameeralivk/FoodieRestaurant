import { Request, Response } from "express";
import { IAdminPlanService } from "../../../../services/planService/Interface/IAdminPlanService";
import { IPlanController } from "../Interface/IPlanController";
import { AppError } from "../../../../utils/Error";
import { MESSAGES } from "../../../../constants/messages";
import { subscriptionPlanSchema } from "../../../../helpers/zodvalidation";
import HttpStatus from "../../../../constants/htttpStatusCode";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../../DI/types";
@injectable()
export class PlanController implements IPlanController {
  constructor(
    @inject(TYPES.AdminPlanService) private _adminPlanService: IAdminPlanService
  ) {}

  addPlan = async (req: Request, res: Response): Promise<Response> => {
    try {
      const planData = req.body;
      const parsed = subscriptionPlanSchema.safeParse(planData);
      if (!parsed.success) {
        const errorMessages = parsed.error.issues.map((e) => e.message);
        throw new AppError(errorMessages.join(","), HttpStatus.NOT_FOUND);
      }
      const newPlan = await this._adminPlanService.addPlan(parsed.data);
      if (newPlan.success) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: MESSAGES.PLAN_ADDED_SUCCESSFULL,
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: newPlan.message || MESSAGES.PLAN_ADDED_FAILED,
        });
      }
    } catch (error: any) {
      throw new AppError(error, 404);
    }
  };

  getAllPlan = async (req: Request, res: Response): Promise<Response> => {
    try {
      const page = req.query.page ? Number(req.query.page) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      const result = await this._adminPlanService.getAllPlan(page, limit);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Failed to fetch plans",
        });
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        data: {
          data: result.data,
        },
        pagination: {
          currentPage: page || 1,
          totalPages: page && limit ? Math.ceil(result.total / limit) : 1,
          totalItems: result.total,
          limit: limit || result.total,
        },
      });
    } catch (error: any) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  };

  editPlan = async (req: Request, res: Response): Promise<Response> => {
    try {
      const planId = req.params.id as string;
      const newData = req.body;
      const result = await this._adminPlanService.editPlan(planId, newData);
      if (result.success) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: MESSAGES.PLAN_UPDATED_SUCCESS,
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: true,
          message: MESSAGES.PLAN_UPDATED_FAILED,
        });
      }
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };

  delPlan = async (req: Request, res: Response): Promise<Response> => {
    try {
      const planId = req.params.id as string;
      const result = await this._adminPlanService.deletePlan(planId);
      if (result.success) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: MESSAGES.PLAN_DEL_SUCCESS,
        });
      } else {
        return res.status(HttpStatus.OK).json({
          success: false,
          message: MESSAGES.PLAN_DEL_FAILED,
        });
      }
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };
}
