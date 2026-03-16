import { BaseRepository } from "../../BaseRepository";
import { IGroup, IVariant } from "../../../types/varient";
import { IVarientRepository } from "../interface/IVarientRepository";
import { Types } from "mongoose";
import VarientSchema from "../../../models/varient";
export class VarientRepository
  extends BaseRepository<IGroup>
  implements IVarientRepository
{
  constructor() {
    super(VarientSchema);
  }

  async getVarient(name: string): Promise<IGroup | null> {
    return await this.getByFilter({
      name: { $regex: name, $options: "i" },
      isDeleted: false,
    });
  }

  async getVarientById(varientId: string): Promise<IGroup | null> {
    return await this.getById(varientId);
  }

  async addVarient(
    name: string,
    Varient: IVariant[],
    restaurantId: string,
  ): Promise<IGroup | null> {
    return await this.create({
      name: name,
      Varients: Varient,
      restaurantId: new Types.ObjectId(restaurantId),
    });
  }

  async editVarient(
    varientId: string,
    name: string,
    Varients: IVariant[],
    restaurantId: string,
  ): Promise<IGroup | null> {
    return await this.findByIdAndUpdate(varientId, {
      name: name,
      Varients: Varients,
      restaurantId: new Types.ObjectId(restaurantId),
    });
  }

  async deleteVarient(varientId: string): Promise<IGroup | null> {
    return await this.findByIdAndUpdate(varientId, { isDeleted: true });
  }

  async findAllVarients(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: IGroup[]; total: number } | null> {
    const filter: any = { isDeleted: false };

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    return this.getAll(filter, { page, limit });
  }
}
