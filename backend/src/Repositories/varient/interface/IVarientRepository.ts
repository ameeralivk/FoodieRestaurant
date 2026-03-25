import { IGroup, IVariant } from "../../../types/varient";

export interface IVarientRepository {
  getVarient(name: string): Promise<IGroup | null>;
  getVarientById(varientId: string): Promise<IGroup | null>;
  addVarient(name: string, Varient: IVariant[],restaurantId:string): Promise<IGroup | null>;
  editVarient(
    varientId: string,
    name: string,
    Varients: IVariant[],
    restaurantId:string
  ): Promise<IGroup | null>;
  deleteVarient(varientId: string): Promise<IGroup | null>;
  findAllVarients(page: number, limit: number,search?:string,restaurantId?:string):Promise<{data:IGroup[],total:number}|null>
}
