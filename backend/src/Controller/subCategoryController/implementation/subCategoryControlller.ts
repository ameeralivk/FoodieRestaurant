import { injectable, inject } from "inversify";
import { ISubCategoryService } from "../../../services/subCategoryService/interface/ISubCategoryService";
import { ISubCategoryController } from "../interface/ISubCategoryController";
import { TYPES } from "../../../DI/types";
import { createSubCategorySchema } from "../../../helpers/zodvalidation";
import { AppError } from "../../../utils/Error";
import HttpStatus from "../../../constants/htttpStatusCode";
import { Request, Response } from "express";
import { MESSAGES } from "../../../constants/messages";
@injectable()
export class SubCategoryController implements ISubCategoryController {
  constructor(
    @inject(TYPES.subCategoryService)
    private _subCategoryService: ISubCategoryService
  ) {}

  addSubCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const parsed = createSubCategorySchema.safeParse(req.body);
      const { restaurantId, categoryId } = req.body;
      if (!parsed.success) {
        const errorMessages = parsed.error.issues.map((e) => e.message);
        throw new AppError(errorMessages.join(","), HttpStatus.NOT_FOUND);
      }

      const data = await this._subCategoryService.addSubCategory(
        parsed.data,
        restaurantId,
        categoryId
      );
      if (data) {
        return res
          .status(HttpStatus.CREATED)
          .json({ success: true, message: MESSAGES.SUBCATEGORY_ADDED_SUCCESS });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: true, message: MESSAGES.SUBCRIPTION_ADDED_FAILED });
      }
    } catch (error) {
      throw new AppError(error);
    }
  };

  editSubCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      await this._subCategoryService.editSubCategory(
        req.params.categoryId as string,
        req.body
      );
      return res.json({
        success: true,
        message: MESSAGES.SUBCATEGORY_EDITED_SUCCESS,
      });
    } catch (error) {
      throw new AppError(error);
    }
  };

  deleteSubCategory = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      let result = await this._subCategoryService.deleteSubCategory(
        req.params.categoryId as string
      );
      if (result) {
        return res.json({
          success: true,
          message: MESSAGES.SUBCATEGORY_DEL_SUCCESS,
        });
      } else {
        return res.json({
          success: false,
          message: MESSAGES.SUBCATEGORY_DEL_FAILED,
        });
      }
    } catch (error) {
      throw new AppError(error);
    }
  };

  getAllSubCategories = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const result = await this._subCategoryService.getAllSubCategories(
        req.params.restaurantId as string,
        req.params.categoryId as string,
        req.query.search as string,
        Number(req.query.page) || 1,
        Number(req.query.limit) || 10
      );

      return res.json({
        success: true,
        data: result.data,
        total: result.total,
      });
    } catch (error) {
      throw new AppError(error);
    }
  };

  getAllByRestaurant = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { restaurantId } = req.params;
      const { search, page, limit } = req.query;
      const result = await this._subCategoryService.getAllByRestaurant(
        restaurantId as string,
        search as string,
        Number(page),
        Number(limit)
      );

      return res.status(200).json({
        success: true,
        message: "Subcategories fetched successfully",
        ...result,
      });
    } catch (error) {
      throw new AppError(error);
    }
  };
}
