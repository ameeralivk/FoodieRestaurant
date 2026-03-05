import { ISubscriptionPlan } from "../../types/plan";
import { ISubscriptiontype } from "../../types/subscription";
import { PlanDto } from "../../types/subscription";
export interface ISubscriptionPlanDTO {
  _id?:string;
  planName: string;
  price: number;
  duration: string|number;
  noOfDishes: number;
  noOfStaff: number;
  features: string[];
}


export function subscriptionPlanDTO(plan:ISubscriptionPlan): ISubscriptionPlanDTO{
  return {
    _id:plan._id?.toString(),
    planName: plan.planName,
    price: plan.price,
    duration: plan.duration,
    noOfDishes: plan.noOfDishes,
    noOfStaff: plan.noOfStaff,
    features: plan.features || [],
  };
}



export const mapToPlanDto = (sub: ISubscriptiontype): PlanDto => {
  return {
    _id: sub._id.toString(),
    planName: sub.planName,
    planPrice: sub.planPrice,
    status: sub.status,
    startDate: sub.startDate.toISOString(),
    renewalDate: sub.renewalDate.toISOString(),
  };
};
