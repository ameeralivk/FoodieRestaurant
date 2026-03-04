import { IAdminPlanService } from "../Interface/IAdminPlanService";
import { ISubscriptionPlan } from "../../../types/plan";
import { IAdminPlanRepository } from "../../../Repositories/planRepositories/interface/IAdminPlanRepositories";
import { MESSAGES } from "../../../constants/messages";
import { subscriptionPlanDTO } from "../../../utils/dto/subscriptionPlanDto";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
@injectable()
export class AdminPlanService implements IAdminPlanService {
  constructor(@inject(TYPES.AdminPlanRepository) private _adminPlanRepository: IAdminPlanRepository) {}
  async addPlan(
    PlanData: ISubscriptionPlan
  ): Promise<{ success: boolean; message: string }> {
    const existingPlan = await this._adminPlanRepository.findByName(
      PlanData.planName.trim()
    );
    if (existingPlan) {
      return { success: false, message: MESSAGES.PLAN_ALREADY_EXISTS };
    }
    const created = await this._adminPlanRepository.add(PlanData);

    if (!created) {
      return { success: false, message: MESSAGES.PLAN_ADDED_FAILED };
    }

    return { success: true, message: MESSAGES.PLAN_ADDED_SUCCESSFULL };
  }

  async getAllPlan(
    page: number,
    limit: number
  ): Promise<{
    success: boolean;
    data: ISubscriptionPlan[];
    total:number;
  }> {
   try {
    const result = await this._adminPlanRepository.findAll(page, limit);

    const mappedData = result.data.map((ele) => subscriptionPlanDTO(ele));

    return {
      success: true,
      data: mappedData,
      total: result.total,
    };
  } catch (error: any) {
    console.error(error)
    return { success: false, data: [], total: 0 };
  }
  }

  async editPlan(
    id: string,
    newData: ISubscriptionPlan
  ): Promise<{ success: boolean; message: string }> {
    const find = await this._adminPlanRepository.find(id);
    if (!find) {
      return { success: false, message: MESSAGES.PLAN_NOT_FOUND };
    }
    await this._adminPlanRepository.findAndUpdate(id, newData);
    return { success: true, message: MESSAGES.PLAN_UPDATED_SUCCESS };
  }

  async deletePlan(id: string): Promise<{ success: boolean; message: string }> {
    const find = await this._adminPlanRepository.find(id);
    if (!find) {
      return { success: false, message: MESSAGES.PLAN_DEL_FAILED };
    }
    await this._adminPlanRepository.findByIdDel(id);
    return { success: true, message: MESSAGES.PLAN_DEL_SUCCESS };
  }
}
