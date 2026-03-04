
import { ICategory } from "../../../types/category";
import { Types } from "mongoose";
import { ICategoryAdd } from "../../../types/category";
export interface ICategoryRepository {
  add(
    data: ICategoryAdd,
    restaurantId: Types.ObjectId
  ): Promise<ICategory | null>;
  find(
    categoryName: string,
    restaurantId: Types.ObjectId
  ): Promise<ICategory | null>;
   findByCategoryId(
      categoryId: Types.ObjectId,
      restaurantId: Types.ObjectId
    ): Promise<ICategory | null>
  findAndUpdate(
    id: string,
    data: Partial<ICategory>
  ): Promise<ICategory | null>;
  softDelete(id: string): Promise<ICategory | null>;
  findAll(
      filter: any,
      page?: number,
      limit?: number
    ): Promise<{ data: ICategory[]; total: number }>
}
