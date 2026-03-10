import Stripe from "stripe"
import { ICartItem } from "../../../types/cart"
export interface IPaymentService{
    paymentCreate(amount:number,restaurentId:string,planId:string,planName:string):Promise<{success:boolean,message:string,url:string}>
    handleWebhook(event:Stripe.Event):Promise<void>
    createOneTimePayment(amount: number,restaurentId: string,userId: string,items:ICartItem[]):Promise<{success:boolean,url:string}>
    upgradeSubscription(restaurantId: string, newPlanId: string): Promise<{ success: boolean; message: string; url?: string }>
}