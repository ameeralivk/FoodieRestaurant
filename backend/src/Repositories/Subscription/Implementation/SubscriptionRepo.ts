import { IPlanSnapshot, ISubscriptiontype } from "../../../types/subscription";
import { BaseRepository } from "../../BaseRepository";
import { ISubscriptionRepo } from "../Interface/ISubscriptionRepo";
import subscription from "../../../models/subscription";
import { AppError } from "../../../utils/Error";
import mongoose from "mongoose";
export class SubscriptionRepo
  extends BaseRepository<ISubscriptiontype>
  implements ISubscriptionRepo
{
  constructor() {
    super(subscription);
  }

  async addSubcription(data: {
    restaurentId: mongoose.Types.ObjectId | undefined;
    planId: mongoose.Types.ObjectId | undefined;
    planSnapshot: IPlanSnapshot;
    planName: string;
    planPrice: number;
    stripeSessionId: string;
    stripePaymentIntentId: string;
  }): Promise<ISubscriptiontype> {
    return this.create(data);
  }

  async findOne(restaurentId: string): Promise<ISubscriptiontype | null> {
    return this.getByFilter({
      restaurentId,
      status: "active",
      renewalDate: { $gt: new Date() },
    });
  }

  async findActivePlan(id: string): Promise<ISubscriptiontype | null> {
    return this.getByFilter({
      restaurentId: id,
      status: "active",
      renewalDate: { $gt: new Date() },
    });
  }

  async findActivePlanByAdminId(
    adminId: string,
  ): Promise<ISubscriptiontype | null> {
    try {
      return await this.getByFilter({
        restaurentId: adminId,
        status: "active",
        renewalDate: { $gte: new Date() },
      });
    } catch (error) {
      throw new AppError(error);
    }
  }
}
