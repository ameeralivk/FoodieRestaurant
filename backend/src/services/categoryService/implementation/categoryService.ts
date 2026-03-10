import { injectable, inject } from "inversify";
import { ICategoryRepository } from "../../../Repositories/category/interface/ICategoryRepository";
import { ICategoryService } from "../interface/ICategoryService";
import { ICategoryAdd, ICategory } from "../../../types/category";
import { TYPES } from "../../../DI/types";
import { ICategoryDTO } from "../../../types/category";
import { MESSAGES } from "../../../constants/messages";
import { Types } from "mongoose";
import { categoryDTO } from "../../../utils/dto/categroyDto";
import { AppError } from "../../../utils/Error";
@injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @inject(TYPES.categoryRepository)
    private _CategoryRepo: ICategoryRepository,
  ) {}

  async addCategory(
    data: ICategoryAdd,
    restaurantId: string,
  ): Promise<{ success: boolean; message: string }> {
    const restaurantObjectId = new Types.ObjectId(restaurantId);
    const exists = await this._CategoryRepo.find(
      data.name.trim(),
      restaurantObjectId,
    );
    if (exists) {
      return { success: false, message: MESSAGES.CATEGORY_ALREADY_EXISTS };
    }
    await this._CategoryRepo.add(data, restaurantObjectId);
    return { success: true, message: MESSAGES.CATEGORY_ADDED_SUCCESS };
  }

  async editCategory(id: string, categoryId: string, data: Partial<ICategory>) {
    const restaurantObjectId = new Types.ObjectId(id);
    const categoryObjectId = new Types.ObjectId(categoryId);
    const exists = await this._CategoryRepo.findByCategoryId(
      categoryObjectId,
      restaurantObjectId,
    );
    if (!exists) {
      throw new AppError(MESSAGES.CATEGORY_NOT_FOUND);
    }
    await this._CategoryRepo.findAndUpdate(categoryId, data);
    return { success: true, message: MESSAGES.CATEGORY_UPDATED_SUCCESS };
  }

  async deleteCategory(
    categoryId: string,
    restaurantId: string,
  ): Promise<{ success: boolean; message: string }> {
    const restaurantObjectId = new Types.ObjectId(restaurantId);
    const categoryObjectId = new Types.ObjectId(categoryId);
    const exists = await this._CategoryRepo.findByCategoryId(
      categoryObjectId,
      restaurantObjectId,
    );
    if (!exists) {
      throw new AppError(MESSAGES.CATEGORY_NOT_FOUND);
    }

    await this._CategoryRepo.softDelete(categoryId);
    return { success: true, message: MESSAGES.CATEGORY_DEL_SUCCESS };
  }

  async getAllCategory(
    restaurantId: string,
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{ success: boolean; data: ICategoryDTO[]; total: number }> {
    const filter: any = {
      restaurantId,
      isDeleted: false,
    };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const result = await this._CategoryRepo.findAll(filter, page, limit);
    return {
      success: true,
      data: result.data.map(categoryDTO),
      total: result.total,
    };
  }
}
