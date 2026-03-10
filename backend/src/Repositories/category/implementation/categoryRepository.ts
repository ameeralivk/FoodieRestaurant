import { ICategory, ICategoryAdd } from "../../../types/category";
import { BaseRepository } from "../../IBaseRepository";
import { ICategoryRepository } from "../interface/ICategoryRepository";
import Category, { categoryDocument } from "../../../models/category";
import { UpdateQuery } from "mongoose";
import { Types } from "mongoose";

export class CategoryRepository
  extends BaseRepository<categoryDocument>
  implements ICategoryRepository
{
  constructor() {
    super(Category);
  }
  async add(
    data: ICategoryAdd,
    restaurantId: Types.ObjectId
  ): Promise<ICategory | null> {
    const addData = {
      ...data,
      restaurantId: restaurantId,
    };
    return this.create(addData);
  }

  async find(
    categoryName: string,
    restaurantId: Types.ObjectId
  ): Promise<ICategory | null> {
    return this.getByFilter({
      name: { $regex: `^${categoryName}$`, $options: "i" },
      restaurantId,
      isDeleted: false,
    });
  }

   async findByCategoryId(
    categoryId: Types.ObjectId,
    restaurantId: Types.ObjectId
  ): Promise<ICategory | null> {
    return this.getByFilter({
      _id: categoryId,
      restaurantId,
      isDeleted: false,
    });
  }

  async findAndUpdate(
    id: string,
    update: UpdateQuery<categoryDocument>
  ): Promise<ICategory | null> {
    return this.findByIdAndUpdate(id, update);
  }

  async softDelete(id: string): Promise<ICategory | null> {
    return this.findByIdAndDel(id, "isDeleted", true);
  }


  async findAll(
    filter: any,
    page?: number,
    limit?: number
  ): Promise<{ data: ICategory[]; total: number }> {
    return this.getAll(filter, { page, limit });
  }
  
}
