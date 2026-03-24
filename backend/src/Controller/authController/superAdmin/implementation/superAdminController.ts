import ISuperAdminService from "../../../../services/superAdmin/interface/ISuperAdminService";
import ISuperAdminController from "../interface/ISuperAdminController";
import { Request, Response } from "express";
import { TYPES } from "../../../../DI/types";
import { inject, injectable } from "inversify";
import { AppError } from "../../../../utils/Error";
import { error } from "console";
@injectable()
export class SuperAdminController implements ISuperAdminController {
  constructor(
    @inject(TYPES.SuperAdminService)
    private _superAdminService: ISuperAdminService,
  ) {}

  getAllRestaurent = async (req: Request, res: Response): Promise<Response> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = (req.query.searchTerm as string) || "";
      const approval =
        req.query.approval === "true" || req.query.approval === "1";
      const filter: any = { role: "admin", status: { $exists: true } };
      if (search) {
        filter.$or = [
          { restaurantName: { $regex: search, $options: "i" } },
          { ownerName: { $regex: search, $options: "i" } },
          { placeName: { $regex: search, $options: "i" } },
        ];
      }
      const result = await this._superAdminService.getAllRestaurants(
        approval,
        page,
        limit,
        filter,
      );
      return res.status(200).json({
        success: true,
        message: "Restaurants fetched successfully",
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch restaurants",
      });
    }
  };

  approveRestaurant = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const { id } = req.params;
      const updatedRestaurant = await this._superAdminService.approveRestaurant(
        id as string,
      );
      return res.status(200).json({
        success: true,
        message: "Restaurant approved successfully",
        data: updatedRestaurant,
      });
    } catch (err: any) {
      throw new AppError(err.message);
    }
  };

  rejectRestaurant = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const updatedRestaurant = await this._superAdminService.rejectRestaurant(
        id as string,
        reason as string,
      );
      return res.status(200).json({
        success: true,
        message: "Restaurant rejection successfully",
        data: updatedRestaurant,
      });
    } catch (err: any) {
      throw new AppError(err.message);
    }
  };

  changeStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { restaurantId, status } = req.params;

      const updatedRestaurant =
        await this._superAdminService.changeRestaurantStatus(
          restaurantId as string,
          status as string,
        );

      return res.status(200).json({
        success: true,
        message:
          status === "block"
            ? "Restaurant blocked successfully"
            : "Restaurant unblocked successfully",
        data: updatedRestaurant,
      });
    } catch (error) {
      throw new AppError(error);
    }
  };
}
