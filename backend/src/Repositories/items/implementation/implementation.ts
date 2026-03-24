import { BaseRepository } from "../../BaseRepository";
import { IItemsRepository } from "../interface/interface";
import Items, { itemsDocument } from "../../../models/items";
import { IItemInterface } from "../../../types/items";
import { AppError } from "../../../utils/Error";
import { FilterQuery } from "mongoose";
export class ItemsRepository
  extends BaseRepository<itemsDocument>
  implements IItemsRepository
{
  constructor() {
    super(Items);
  }

  async findByName(
    name: string,
    restaurantId: string,
  ): Promise<IItemInterface | null> {
    return this.getByFilter({
      name: { $regex: `^${name}$`, $options: "i" },
      isDeleted: false,
      restaurantId,
    });
  }

  async createItem(data: IItemInterface): Promise<IItemInterface> {
    console.log(data, "data is here service");
    return this.create({ ...data, preparationTime: data.preparationTime });
  }

  async editItem(
    id: string,
    data: Partial<IItemInterface>,
    images: string[],
  ): Promise<IItemInterface | null> {
    if (images.length) {
      return await this.findByIdAndUpdate(id, {
        ...data,
        images: images || data.existingImages,
        preparationTime: Number(data.preparationTime),
      });
    } else {
      return await this.findByIdAndUpdate(id, {
        ...data,
      });
    }
  }

  async deleteItem(id: string): Promise<IItemInterface | null> {
    try {
      return await this.findByIdAndDel(id, "isDeleted", true);
    } catch (error: any) {
      throw new AppError(error.message);
    }
  }

  async changeStatus(
    id: string,
    isActive: boolean,
  ): Promise<IItemInterface | null> {
    return await this.findByIdAndUpdate(id, { isActive });
  }

  async getAllByRestaurant(
    restaurantId: string,
    filter: FilterQuery<IItemInterface>,
    page: number,
    limit: number,
    role: string,
  ): Promise<{ data: IItemInterface[]; total: number }> {
    const skip = (page - 1) * limit;
    let queryFilter = {};
    if (role && role === "user") {
      queryFilter = {
        restaurantId,
        isActive: true,
        isDeleted: false,
        ...filter,
      };
    } else {
      queryFilter = {
        restaurantId,
        isDeleted: false,
        ...filter,
      };
    }

    const dataPromise = this.model
      .find(queryFilter)
      .populate("categoryId", "name")
      .populate("subCategoryId", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const totalPromise = this.model.countDocuments(queryFilter).exec();

    const [data, total] = await Promise.all([dataPromise, totalPromise]);

    return { data, total };
  }

  find(id: string): Promise<IItemInterface | null> {
    return this.getById(id);
  }

  async findByItemName(
  name: string,
  restaurantId: string,
): Promise<IItemInterface[]> {
  return this.model.find({
    name: { $regex: name, $options: "i" },
    isDeleted: false,
    restaurantId,
  });
}

async getAllItems(restaurantId: string): Promise<IItemInterface[]> {
   return this.model.find({restaurantId:restaurantId,isDeleted:false,isActive:true})
}
}
