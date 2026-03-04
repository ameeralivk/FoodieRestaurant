import { BaseRepository } from "../../IBaseRepository";
import { ITableRepository } from "../interface/ITableRepository";
import Table from "../../../models/table";
import { ITable, PaginatedTableResult } from "../../../types/table";
import mongoose, { Types } from "mongoose";
import { FilterQuery } from "mongoose";
export class TableRepository extends BaseRepository<ITable> implements ITableRepository{
    constructor(){
      super(Table)
    }

    async findByTableNo(
    restaurantId: mongoose.Types.ObjectId,
    tableNo: number
  ): Promise<ITable | null> {
    return this.getByFilter({ restaurantId, tableNo });
  }

  async createTable(data: Partial<ITable>): Promise<ITable> {
    return this.create(data);
  }

  async editTable(
    tableId: string,
    updateData: Partial<ITable>
  ): Promise<ITable | null> {
    return this.findByIdAndUpdate(tableId, updateData);
  }


   async getAllTables(
    restaurantId: string,
    search: string | undefined,
    page: number,
    limit: number
  ):Promise<PaginatedTableResult<ITable>> {
    const filter: FilterQuery<ITable> = {
      restaurantId,
    };

    if (search) {
      filter.$or = [
        { tableNo: Number(search) || -1 },
        { seatingCapacity: Number(search) || -1 },
      ];
    }

    return this.getAll(filter, { page, limit });
  }


  async updateAvailability(
    tableId: string,
    isAvailable: boolean
  ): Promise<ITable | null> {
    return this.findByIdAndUpdate(tableId, { isAvailable });
  }

  async deleteTable(tableId: string): Promise<ITable | null> {
    return this.findByIdAndDel(tableId);
  }
  

   async checkTable(restaurantId: string, tableId: string): Promise<ITable | null> {
     return this.model.findOne({restaurantId:new Types.ObjectId(restaurantId),tableNo:tableId})
  }

}