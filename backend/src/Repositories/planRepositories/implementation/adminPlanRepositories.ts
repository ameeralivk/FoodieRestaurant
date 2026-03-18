import { PlanDocument } from "../../../models/plan";
import { BaseRepository } from "../../BaseRepository";
import SubscriptionPlan from "../../../models/plan";
import { IAdminPlanRepository } from "../interface/IAdminPlanRepositories";
import { ISubscriptionPlan, ISubscription } from "../../../types/plan";
import { UpdateQuery } from "mongoose";
import { AppError } from "../../../utils/Error";
export class AdminPlanRepository
  extends BaseRepository<PlanDocument>
  implements IAdminPlanRepository
{
  constructor() {
    super(SubscriptionPlan);
  }
  async add(data: ISubscriptionPlan): Promise<ISubscription | null> {
    try {
      if (Number(data.duration)) {
        data.duration = `${data.duration} days`;
      }
      return await this.create(data);
    } catch (error) {
      console.error("Error creating subscription plan:", error);
      return null;
    }
  }

  async findByName(name: string): Promise<ISubscription | null> {
    try {
      return await this.getByFilter({
        planName: { $regex: name, $options: "i" },
      });
    } catch (error) {
      console.error("Error checking plan by name:", error);
      return null;
    }
  }

  async findAll(
    page?: number,
    limit?: number,
  ): Promise<{ data: ISubscription[]; total: number }> {
    try {
      const finalFilter = {};

      if (page && limit) {
        return await this.getAll(finalFilter, { page, limit });
      }
      return await this.getAll(finalFilter);
    } catch (error) {
      console.error("Error fetching plans:", error);
      console.error("Error fetching plans:", error);
      throw error;
    }
  }
  async find(id: string): Promise<ISubscription | null> {
    try {
      const result = await this.getById(id);
      return result;
    } catch (error: any) {
      throw new AppError(error.message);
    }
  }
  async findAndUpdate(
    id: string,
    update: UpdateQuery<PlanDocument>,
  ): Promise<ISubscription | null> {
    try {
      if (Number(update.duration)) {
        update.duration = `${update.duration} days`;
      }
      const result = await this.findByIdAndUpdate(id, update);
      return result;
    } catch (error: any) {
      throw new AppError(error.message);
    }
  }

  async findByIdDel(id: string): Promise<ISubscription | null> {
    try {
      const result = await this.findByIdAndDel(id);
      return result;
    } catch (error: any) {
      throw new AppError(error.message);
    }
  }
}
