import { injectable, inject } from "inversify";
import { ISubscriptionRepo } from "../../../Repositories/Subscription/Interface/ISubscriptionRepo";
import { ISubcriptionService } from "../interface/ISubscriptionServer";
import Stripe from "stripe";
import { TYPES } from "../../../DI/types";
import mongoose from "mongoose";
import { calculateRenewalDateFrom } from "../../../helpers/subscriptionHelpers/calaculateRenewalDateFrom";
import calculateRenewalDate from "../../../helpers/subscriptionHelpers/createRenavalDate";
import { IAdminPlanRepository } from "../../../Repositories/planRepositories/interface/IAdminPlanRepositories";
import { MESSAGES } from "../../../constants/messages";
import { mapToPlanDto } from "../../../utils/dto/subscriptionPlanDto";
import { PlanDto } from "../../../types/subscription";
const stripe = new Stripe(process.env.STRIP_SECRET_KEY as string, {
  apiVersion: "2024-06-20" as unknown as Stripe.LatestApiVersion,
});
@injectable()
export class SubcriptionServer implements ISubcriptionService {
  constructor(
    @inject(TYPES.SubcriptionRepo) private _subcriptionRepo: ISubscriptionRepo,
    @inject(TYPES.AdminPlanRepository)
    private _adminPlanRepo: IAdminPlanRepository
  ) {}
  async addSubcription(data: {
    restaurentId: mongoose.Types.ObjectId;
    planId: mongoose.Types.ObjectId;
    planName: string;
    planPrice: number;
    stripeSessionId: string;
    stripePaymentIntentId: string;
  }) {
    const Id = data.planId?.toString();
    const planDetail = await this._adminPlanRepo.find(Id);
    if (!planDetail) {
      return { success: false, message: MESSAGES.SUBCRIPTION_ADDED_FAILED };
    }
    const activeSub = await this._subcriptionRepo.findOne(
      data.restaurentId.toString()
    );
    const planSnapshot = {
      planName: planDetail.planName,
      planPrice: planDetail.price,
      duration: planDetail.duration,
      noOfDishes: planDetail.noOfDishes,
      noOfStaff: planDetail.noOfStaff,
      features: planDetail.features,
    };
    if (activeSub) {
      const startDate = activeSub.renewalDate;
      const renewalDate = calculateRenewalDateFrom(
        startDate,
        planDetail.duration
      );

      await this._subcriptionRepo.addSubcription({
        ...data,
        planSnapshot,
        startDate,
        renewalDate,
        status: "queued",
      });
      return { success: true, message: MESSAGES.SUBCRIPTION_ADDED_SUCCESS };
    }
    const startDate = new Date();
    const renewalDate = calculateRenewalDate(planDetail.duration);
    await this._subcriptionRepo.addSubcription({
      ...data,
      startDate,
      planSnapshot,
      renewalDate,
      status: "active",
    });

    return { success: true, message: MESSAGES.SUBCRIPTION_ADDED_SUCCESS };
  }
  async getPlan(id: string): Promise<{ success: boolean; plan: PlanDto }> {
    const plan = await this._subcriptionRepo.findActivePlan(id);

    if (!plan) {
      return {
        success: false,
        plan: {} as PlanDto,
      };
    }
    const mapedPlan = mapToPlanDto(plan);
    return {
      success: true,
      plan: mapedPlan,
    };
  }
}
