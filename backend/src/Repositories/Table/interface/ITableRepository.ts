import mongoose from "mongoose";
import { ITable, PaginatedTableResult } from "../../../types/table";
export interface ITableRepository {
  findByTableNo(
    restaurantId: mongoose.Types.ObjectId,
    tableNo: number
  ): Promise<ITable | null>;
  createTable(data: Partial<ITable>): Promise<ITable>;
  editTable(
    tableId: string,
    updateData: Partial<ITable>
  ): Promise<ITable | null>;
  getAllTables(
    restaurantId: string,
    search: string | undefined,
    page: number,
    limit: number
  ): Promise<PaginatedTableResult<ITable>>;
  updateAvailability(tableId: string,isAvailable: boolean): Promise<ITable | null>;
  deleteTable(tableId: string): Promise<ITable | null>
  checkTable(restaurantId:string,tableId:string):Promise<ITable|null>
}
