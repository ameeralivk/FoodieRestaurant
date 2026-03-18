import { injectable, inject } from "inversify";
import { IVarientService } from "../interface/IVarientService";
import { TYPES } from "../../../DI/types";
import { IVarientRepository } from "../../../Repositories/varient/interface/IVarientRepository";
import { IVariant } from "../../../types/varient";
import { MESSAGES } from "../../../constants/messages";
import { AppError } from "../../../utils/Error";
import { IVarientResponseDto } from "../../../utils/dto/types/varient.dto.types";
import {
  VarientResponseDto,
} from "../../../utils/dto/varientDto";
@injectable()
export class VarientService implements IVarientService {
  constructor(
    @inject(TYPES.VarientRepository) private _varientRepo: IVarientRepository,
  ) {}

  async addVarient(
    name: string,
    Varients: IVariant[],
    restaurantId:string
  ): Promise<{ success: boolean; message: string }> {
    let Varient = await this._varientRepo.getVarient(name);
    if (Varient) {
      return { success: false, message: MESSAGES.VARIENT_EXIST };
    } else {
      let res = await this._varientRepo.addVarient(name, Varients,restaurantId as string);
      if (res) {
        return { success: true, message: MESSAGES.VARIENT_ADDED_SUCCESS };
      } else {
        return { success: false, message: MESSAGES.VARIENT_ADDED_FAILED };
      }
    }
  }

  async editVarient(
    varientId: string,
    name: string,
    Varients: IVariant[],
    restaurantId:string
  ): Promise<{ success: boolean; message: string }> {
    let Varient = await this._varientRepo.getVarientById(varientId);
    if (!Varient) {
      return { success: false, message: MESSAGES.VARIENT_NOT_FOUND };
    }
    let edited = await this._varientRepo.editVarient(varientId, name, Varients,restaurantId as string);
    if (edited) {
      return { success: true, message: MESSAGES.VARIENT_EDITED_SUCCESS };
    } else {
      return { success: false, message: MESSAGES.VARIENT_EDITED_FAILED };
    }
  }

  async deleteVarient(
    varientId: string,
  ): Promise<{ success: boolean; message: string }> {
    let varientExist = this._varientRepo.getVarientById(varientId);
    if (!varientExist) {
      throw new AppError(MESSAGES.VARIENT_NOT_FOUND);
    }
    let delVarient = await this._varientRepo.deleteVarient(varientId);
    if (delVarient) {
      return { success: true, message: MESSAGES.VARIENT_DEL_SUCCESS };
    } else {
      return { success: false, message: MESSAGES.VARIENT_DEL_FAILED };
    }
  }

  async getAllVarient(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ success: boolean; data:IVarientResponseDto[],total:number}> {
    const result = await this._varientRepo.findAllVarients(page, limit, search);
    console.log(result,'result is here')
    if(result){
       return {
      success: true,
      data: result?.data?.map(VarientResponseDto),
      total:result.total
    };
    }else{
        return {
            success:false,
            data:[],
            total:0
        }
    }
  }
}
