import { IItemInterface } from "../../../types/items";
import { FilterQuery } from "mongoose";
export interface IItemsRepository {
  findByName(
    name: string,
    restaurantId: string,
  ): Promise<IItemInterface | null>;
  createItem(data: IItemInterface): Promise<IItemInterface>;
  editItem(
    id: string,
    data: Partial<IItemInterface>,
    images: string[],
  ): Promise<IItemInterface | null>;
  deleteItem(id: string): Promise<IItemInterface | null>;
  changeStatus(id: string, isActive: boolean): Promise<IItemInterface | null>;
  find(id: string): Promise<IItemInterface | null>;
  getAllByRestaurant(
    restaurantId: string,
    filter: FilterQuery<IItemInterface>,
    page: number,
    limit: number,
    role: string,
  ): Promise<{ data: IItemInterface[]; total: number }>;
  findByItemName(name: string, restaurantId: string): Promise<IItemInterface[]>;
  getAllItems(restaurantId:string):Promise<IItemInterface[]>
}
