import { inject, injectable } from "inversify";
import { ICategoryService } from "../../../services/categoryService/interface/ICategoryService";
import { ICategoryController } from "../interface/ICategoryController";
import { TYPES } from "../../../DI/types";
import { Request, Response } from "express";
import { AppError } from "../../../utils/Error";
import HttpStatus from "../../../constants/htttpStatusCode";
import { createCategorySchema } from "../../../helpers/zodvalidation";
import { MESSAGES } from "../../../constants/messages";
@injectable()
export class CategoryController implements ICategoryController {
  constructor(
    @inject(TYPES.categoryService) private _categoryService: ICategoryService,
  ) {}

  addCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = createCategorySchema.safeParse(req.body);
      const { restaurantId } = req.body;
      if (!restaurantId) {
        throw new AppError("RestaurantId is required");
      }
      if (!parsed.success) {
        const errorMessages = parsed.error.issues.map((e) => e.message);
        throw new AppError(errorMessages.join(","), HttpStatus.NOT_FOUND);
      }
      let result = await this._categoryService.addCategory(
        parsed.data,
        restaurantId as string,
      );
      if(!result.success){
          return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: result.message });
      }
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: MESSAGES.CATEGORY_ADDED_SUCCESS });
    } catch (error) {
      throw new AppError(error);
    }
  };

  editCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this._categoryService.editCategory(
        req.params.restaurantId as string,
        req.params.categoryId as string,
        req.body,
      );
      if (result) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: MESSAGES.CATEGORY_UPDATED_SUCCESS,
        });
      } else {
        return res.status(HttpStatus.OK).json({
          success: false,
          message: MESSAGES.CATEGORY_UPDATED_FAILED,
        });
      }
    } catch (error) {
      throw new AppError(error);
    }
  };

  deleteCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this._categoryService.deleteCategory(
        req.params.categoryId as string,
        req.params.restaurantId as string,
      );
      if (result) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: MESSAGES.CATEGORY_DEL_SUCCESS,
        });
      } else {
        return res.status(HttpStatus.OK).json({
          success: false,
          message: MESSAGES.CATEGORY_DEL_FAILED,
        });
      }
    } catch (error) {
      throw new AppError(error);
    }
  };

  getAllCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { restaurantId } = req.params;
      const { search, page, limit } = req.query;

      const result = await this._categoryService.getAllCategory(
        restaurantId as string,
        search as string,
        Number(page),
        Number(limit),
      );

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      throw new AppError(error);
    }
  };
}
