import { injectable, inject } from "inversify";
import { ITableRepository } from "../../../Repositories/Table/interface/ITableRepository";
import { ITableService } from "../interface/ITableService";
import { TYPES } from "../../../DI/types";
import mongoose from "mongoose";
import { CreateTableInput, PaginatedTableResult } from "../../../types/table";
import { MESSAGES } from "../../../constants/messages";
import { ITable ,RequestEditTable } from "../../../types/table";
import { AppError } from "../../../utils/Error";
@injectable()
export class TableService implements ITableService {
  constructor(
    @inject(TYPES.tableRepository) private _tableRepo: ITableRepository
  ) {}

  async createTable(
    data: CreateTableInput
  ): Promise<{ success: boolean; message: string }> {
    const { restaurantId, tableNo, seatingCapacity, description } = data;

    if (!tableNo || !seatingCapacity) {
      throw new Error(MESSAGES.TABLE_ALREADY_EXIST);
    }
    const restaurantObjectId = new mongoose.Types.ObjectId(restaurantId);

    const existing = await this._tableRepo.findByTableNo(
      restaurantObjectId,
      tableNo
    );
    if (existing) {
      throw new Error("Table number already exists");
    }
    const qrCodeUrl = `${process.env.FRONTEND_BASE_URL}/user/restaurant/${restaurantId}?table=${tableNo}`;
     const res = await this._tableRepo.createTable({
      restaurantId: restaurantObjectId,
      tableNo,
      seatingCapacity,
      description,
      qrCodeUrl,
      isAvailable: true,
    });
    if(res){
       return {success:true,message:MESSAGES.TABLE_CREATED_SUCCESS}
    }else{
       return {success:true,message:MESSAGES.TABLE_CREATED_FAILED}
    }
  }


   async editTable(
    tableId: string,
    data: RequestEditTable
  ): Promise<ITable | null> {
    if(!data || !tableId){
      throw new AppError(MESSAGES.TABLE_NOT_FOUND)
    }
    return this._tableRepo.editTable(tableId, data);
  }


    async getAllTables(
    restaurantId: string,
    search: string | undefined,
    page: number,
    limit: number
  ):Promise<PaginatedTableResult<ITable>> {
    return await this._tableRepo.getAllTables(
      restaurantId,
      search,
      page,
      limit
    );
  }


  async updateTableAvailability(
    tableId: string,
    isAvailable: boolean
  ): Promise<ITable | null> {
    return this._tableRepo.updateAvailability(tableId, isAvailable);
  }


   async deleteTable(tableId: string):Promise<ITable | null> {
    return this._tableRepo.deleteTable(tableId);
  }

  checkTable(restaurantId: string, tableId: string): Promise<ITable | null> {
    return this._tableRepo.checkTable(restaurantId,tableId)
  }

}
