import { CreateTableInput } from "../../../types/table";
import { ITable } from "../../../types/table";
import { RequestEditTable } from "../../../types/table";
import { PaginatedTableResult } from "../../../types/table";

export interface ITableService {
    createTable(data:CreateTableInput):Promise<{success:boolean,message:string}>
    editTable(tableId: string,data: RequestEditTable): Promise<ITable | null>;
    getAllTables( restaurantId: string,search: string | undefined,page: number,limit: number):Promise<PaginatedTableResult<ITable>>
    updateTableAvailability(tableId: string,isAvailable: boolean): Promise<ITable | null> 
    deleteTable(tableId: string):Promise<ITable | null>
    checkTable(restaurantId:string,tableId:string):Promise<ITable|null>
}