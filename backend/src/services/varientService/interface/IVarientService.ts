import { IVariant } from "../../../types/varient";
import { IVarientResponseDto } from "../../../utils/dto/types/varient.dto.types";
export interface IVarientService {
  addVarient(
    name: string,
    Varients: IVariant[],
    restaurantId:string
  ): Promise<{ success: boolean; message: string }>;
  editVarient(
    varientId: string,
    name: string,
    Varients: IVariant[],
    restaurantId:string,
  ): Promise<{ success: boolean; message: string }>;
  deleteVarient(
    varientId: string,
  ): Promise<{ success: boolean; message: string }>;
  getAllVarient(page: number, limit: number,search?:string,restaurantId?:string):Promise<{success:boolean,data:IVarientResponseDto[],total:number}>
}
