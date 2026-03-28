import { injectable, inject } from "inversify";
import { IStaffService } from "../../../services/staff/interface/IStaffService";
import { IStaffController } from "../interface/IStaffController";
import { Response, Request } from "express";
import { TYPES } from "../../../DI/types";
import { AppError } from "../../../utils/Error";
import { MESSAGES } from "../../../constants/messages";
import HttpStatus from "../../../constants/htttpStatusCode";
@injectable()
export class StaffController implements IStaffController {
  constructor(
    @inject(TYPES.staffService) private _staffService: IStaffService,
  ) {}

  addStaff = async (req: Request, res: Response): Promise<Response> => {
    try {
      const staff = await this._staffService.addStaff(req, req.body);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: MESSAGES.STAFF_ADDED_SUCCESS,
        data: staff,
      });
    } catch (err: any) {
      throw new AppError(err.message);
    }
  };

  editStaff = async (req: Request, res: Response): Promise<Response> => {
    try {
      const staffId = req.params.staffId;
      await this._staffService.editStaff({
        staffId,
        ...req.body,
      });
      return res.status(200).json({
        success: true,
        message: MESSAGES.STAFF_UPDATED_SUCCESS,
      });
    } catch (error) {
      throw new AppError(error);
    }
  };

  deleteStaff = async (req: Request, res: Response): Promise<Response> => {
    try {
      const staffId = req.params.staffId as string;

      await this._staffService.deleteStaff(staffId);

      return res.status(200).json({
        success: true,
        message: "Staff deleted successfully",
      });
    } catch (error) {
      throw new AppError(error);
    }
  };
  changeStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const staffId = req.params.staffId as string;
      const { status } = req.body;

      const staff = await this._staffService.changeStaffStatus(staffId, status);

      return res.status(200).json({
        success: true,
        message: "Staff status updated successfully",
        data: staff,
      });
    } catch (error) {
      throw new AppError(error);
    }
  };

  getAllStaff = async (req: Request, res: Response): Promise<Response> => {
    try {
      const restaurantId = req.params.restaurantId as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string;
      const staff = await this._staffService.getAllStaff(
        restaurantId,
        page,
        limit,
        search,
      );

      return res.status(200).json({
        success: true,
        message: "Staff fetched successfully",
        ...staff,
      });
    } catch (error) {
      throw new AppError(error);
    }
  };


  changePassword = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as any).user?.id; // use _id if that's your DB field
      const { oldPassword, newPassword } = req.body;

      if (!userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, message: "User not authenticated" });
      }

      const result = await this._staffService.changePassword(
        userId,
        oldPassword,
        newPassword,
      );

      console.log(result, "result is here");

      if (result.success) {
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: "Password Changed Successfully" });
      }

      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          success: false,
          message: result.message || "Password incorrect",
        });
    } catch (error) {
      console.error("Error in changePassword:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Password changing failed" });
    }
  };

  getStaff = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { staffId } = req.params;
      let result = await this._staffService.getStaff(staffId as string);
      if (result.success) {
        return res
          .status(HttpStatus.OK)
          .json({ success: true, data: result.data });
      } else {
        return res
          .status(HttpStatus.OK)
          .json({ success: false, data: [] });
      }
    } catch (error) {
      throw new AppError(error);
    }
  };
}
