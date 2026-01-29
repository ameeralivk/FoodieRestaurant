import { injectable, inject } from "inversify";
import { IItemsService } from "../../../services/itemService/interface/IItemsService";
import { IItemController } from "../interface/IItemController";
import { TYPES } from "../../../DI/types";
import { Request, Response } from "express";
import HttpStatus from "../../../constants/htttpStatusCode";
import { AppError } from "../../../utils/Error";
import Items from "../../../models/items";
import { MESSAGES } from "../../../constants/messages";
@injectable()
export class ItemController implements IItemController {
  constructor(
    @inject(TYPES.itemsService) private _itemsService: IItemsService,
  ) {}

  addItems = async (req: Request, res: Response): Promise<Response> => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "At least one image is required",
        });
      }
      const imageUrls = files.map((file: any) => file.location);
      const variantPricing = req.body.variantPricing
        ? JSON.parse(req.body.variantPricing)
        : undefined;
        const itemData = {
        name: req.body.name,
        price: Number(req.body.price),

        stock:
          req.body.stock && req.body.stock !== "" ? Number(req.body.stock) : null,

        preparationTime:
          req.body.preparationTime && req.body.preparationTime !== ""
            ? Number(req.body.preparationTime)
            : 0, 

        categoryId: req.body.categoryId,
        category: req.body.categoryId, 
        subCategoryId: req.body.subCategoryId,
        restaurantId: req.body.restaurantId,

        images: imageUrls,
        variant: variantPricing, 
        isActive: true, 
        isDeleted: false,
        isStock: true, 
        points: 0, 
      };
      const item = await this._itemsService.addItem(itemData);

      if (item) {
        return res.status(HttpStatus.CREATED).json({
          success: true,
          message: MESSAGES.ITEM_ADDED_SUCCESS,
        });
      }

      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.ITEM_ADDED_FAILED,
      });
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };


  editItem = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { itemId } = req.params;
    const files = req.files as Express.Multer.File[];

    const imageUrls = files.map((file: any) => file.location);

    // ✅ ADD ONLY THIS (variant parsing)
    if (req.body.variantPricing) {
      req.body.variant = JSON.parse(req.body.variantPricing);
    }

    const item = await this._itemsService.editItem(
      itemId as string,
      req.body, // 👈 now contains variant
      imageUrls ? imageUrls : req.body.existingImage
    );

    if (item) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.ITEM_EDITED_SUCCESS,
      });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: true,
        message: MESSAGES.ITEM_EDITED_SUCCESS,
      });
    }
  } catch (error: any) {
    throw new AppError(error.message);
  }
};


  deleteItem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { itemId } = req.params;
      const item = await this._itemsService.deleteItem(itemId as string);
      if (item) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: MESSAGES.ITEM_DEL_SUCCESS,
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ITEM_DEL_FAILED,
        });
      }
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };

  changeStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { itemId } = req.params;
      const { isActive } = req.body;

      const item = await this._itemsService.changeStatus(
        itemId as string,
        isActive,
      );
      if (item) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: MESSAGES.ITEM_STATUS_CHANGE_SUCCESS,
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.ITEM_STATUS_CHANGE_FAILED,
        });
      }
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };

  getAllItems = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { restaurantId } = req.params;
       const user = (req as any).user; 
       const role = user.role;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;
      const result = await this._itemsService.getAllItemsByRestaurant(
        restaurantId as string,
        page,
        limit,
        role,
        search
      );
      return res.status(HttpStatus.OK).json({
        success: true,
        message: MESSAGES.ITEM_FETCHED_SUCCESS,
        ...result,
        page,
        limit,
      });
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };

  getItem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { itemId } = req.params;
      const item = await this._itemsService.getItem(itemId as string);
      if (item) {
        return res.status(HttpStatus.OK).json({
          succss: true,
          message: MESSAGES.ITEM_EDITED_SUCCESS,
          data: item,
        });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ sucess: false, messaeg: MESSAGES.ITEM_FETCHED_FAILED });
      }
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };
}
