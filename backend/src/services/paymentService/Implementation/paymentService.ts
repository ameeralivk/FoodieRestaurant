import { IPaymentService } from "../Interface/IPaymentService";
import dotenv from "dotenv";
import Stripe from "stripe";
import { inject, injectable } from "inversify";
import { IPaymentRepository } from "../../../Repositories/payment/Interface/interface";
import { TYPES } from "../../../DI/types";
import mongoose from "mongoose";
import { ISubcriptionService } from "../../subscription/interface/ISubscriptionServer";
import { ICartItem } from "../../../types/cart";
import { IOrderRepo } from "../../../Repositories/order/interface/interface";
import { ICartRepository } from "../../../Repositories/cart/interface/ICartRepository";
import { AppError } from "../../../utils/Error";
import { MESSAGES } from "../../../constants/messages";
import { getIO } from "../../../config/socket";
import { generateOrderId } from "../../../helpers/generateOrderId";
import { INotificationService } from "../../notificationService/interface/INotificationService";
import { ISubscriptionRepo } from "../../../Repositories/Subscription/Interface/ISubscriptionRepo";
import { IAdminPlanRepository } from "../../../Repositories/planRepositories/interface/IAdminPlanRepositories";
import { IOrderService } from "../../orderService/interface/IOrderService";
dotenv.config();
const stripe = new Stripe(process.env.STRIP_SECRET_KEY as string, {
  apiVersion: "2024-06-20" as unknown as Stripe.LatestApiVersion,
});

@injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @inject(TYPES.PaymentRepository)
    private _paymentRepository: IPaymentRepository,
    @inject(TYPES.SubcriptionService)
    private _subcriptionServer: ISubcriptionService,
    @inject(TYPES.orderRepository)
    private _orderRepository: IOrderRepo,
    @inject(TYPES.cartRepository)
    private _cartRepository: ICartRepository,
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService,
    @inject(TYPES.AdminPlanRepository)
    private _adminPlanRepo: IAdminPlanRepository,
    @inject(TYPES.SubcriptionRepo)
    private _subscriptionRepo: ISubscriptionRepo,
    @inject(TYPES.orderService)
    private _orderService: IOrderService,
  ) {}
  async paymentCreate(
    amount: number,
    restaurentId: string,
    planId: string,
    planName: string,
  ): Promise<{ success: boolean; message: string; url: string }> {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Subscription Plan" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      success_url: `${process.env.FRONTEND_BASE_URL}/admin/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_BASE_URL}/payment-failed`,

      metadata: {
        restaurentId,
        planId,
        amount,
        planName,
        paymentType: "subscription",
      },
    });

    return {
      success: true,
      message: "Checkout session created",
      url: session.url!,
    };
  }

  async createOneTimePayment(
    amount: number,
    restaurentId: string,
    userId: string,
    items: ICartItem[],
  ): Promise<{ success: boolean; url: string }> {
    const orderId = generateOrderId();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.FRONTEND_BASE_URL}/user/payment-success?orderId=${orderId}`,
      cancel_url: `${process.env.FRONTEND_BASE_URL}/payment-failed`,
      metadata: {
        paymentType: "orderpayment",
        restaurentId,
        orderId,
        userId,
        amount,
      },
    });

    return { success: true, url: session.url! };
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata ?? {};
      if (metadata.paymentType === "subscription") {
        await this._paymentRepository.addPayment(
          session.id,
          "paid",
          metadata.restaurentId || null,
          metadata.planId || null,
          (session.amount_total ?? 0) / 100,
          session.payment_intent as string,
        );
        const restaurentObjectId = new mongoose.Types.ObjectId(
          metadata.restaurentId,
        );
        const planObjectId = new mongoose.Types.ObjectId(metadata.planId);
        await this._subcriptionServer.addSubcription({
          restaurentId: restaurentObjectId,
          planId: planObjectId,
          planName: metadata.planName,
          planPrice: Number(metadata.amount),
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
        });
        return;
      } else if (metadata.paymentType === "orderpayment") {
        let cart = await this._cartRepository.findCart(
          metadata.userId as string,
          metadata.restaurentId as string,
        );
        if (!cart) {
          throw new AppError(MESSAGES.CART_NOT_FOUND);
        }
        await this._paymentRepository.addOrderPayment(
          session.id,
          "paid",
          metadata.restaurentId as string,
          (session.amount_total ?? 0) / 100,
          session.payment_intent as string,
        );
        let time = cart.items.reduce(
          (acc, val) => acc + (val.preparationTime ?? 0),
          0,
        );
        let estimate = await this._orderService.calculateEstimatedPrepTime(
          metadata.restaurentId as string,
          time
        );
        let res = await this._orderRepository.addOrder(
          cart,
          metadata.orderId as string,
          estimate.estimatedPrepTime,
          estimate.estimatedReadyAt,
        );
        if (res) {
          await this._cartRepository.deleteCart(cart._id.toString());
          const io = getIO();
          const restaurantId = metadata.restaurentId;
          console.log(restaurantId, "ameer restaurne id si here");
          if (!restaurantId) {
            throw new Error("Restaurant ID missing in metadata");
          }
          io.to(`${restaurantId}-chef`).emit("order:new", {
            orderId: res.orderId,
            restaurantId: metadata.restaurentId,
            tableId: res.tableId,
            items: res.items,
            total: res.totalAmount,
            status: res.orderStatus,
            createdAt: res.createdAt,
          });
          await this._notificationService.createNotification(
            restaurantId.toString(),
            "User",
            `New Order ${res.orderId} Recieved`,
          );
        }
      } else if (metadata.paymentType === "upgrade_subscription") {
        console.log("hi heelfldsalfjkdlsajfldsajfldksa");
        await this._paymentRepository.addPayment(
          session.id,
          "paid",
          metadata.restaurentId || null,
          metadata.planId || null,
          (session.amount_total ?? 0) / 100,
          session.payment_intent as string,
        );
        const restaurantId = metadata.restaurentId;
        const newPlanId = metadata.planId;
        if (restaurantId && newPlanId) {
          const activeSub =
            await this._subscriptionRepo.findActivePlan(restaurantId);
          const newPlan = await this._adminPlanRepo.find(newPlanId);
          if (activeSub && newPlan) {
            const now = new Date();
            let msInDuration = 0;
            const [amountStr, unit] = String(newPlan.duration).split(" ");
            const unitStr = unit ? unit.toLowerCase() : "";
            const numAmount = parseInt(amountStr || "0");
            if (unitStr.includes("month"))
              msInDuration = numAmount * 30 * 24 * 60 * 60 * 1000;
            else if (unitStr.includes("year"))
              msInDuration = numAmount * 365 * 24 * 60 * 60 * 1000;
            else if (unitStr.includes("day"))
              msInDuration = numAmount * 24 * 60 * 60 * 1000;

            activeSub.status = "expired";
            activeSub.endDate = now;
            await (activeSub as any).save();

            let renewalDate = now;
            if (msInDuration > 0) {
              renewalDate = new Date(now.getTime() + msInDuration);
            }

            await this._subscriptionRepo.addSubcription({
              restaurentId: new mongoose.Types.ObjectId(restaurantId),
              planId: new mongoose.Types.ObjectId(newPlanId),
              planName: newPlan.planName,
              planPrice: newPlan.price,
              planSnapshot: {
                planName: newPlan.planName,
                planPrice: newPlan.price,
                duration: newPlan.duration,
                noOfDishes: newPlan.noOfDishes,
                noOfStaff: newPlan.noOfStaff,
                features: newPlan.features,
              },
              startDate: now,
              renewalDate,
              stripeSessionId: session.id,
              stripePaymentIntentId: session.payment_intent as string,
              status: "active" as any,
            });
          }
        }
      }
    }
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const sessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntent.id,
        limit: 1,
      });

      const session = sessions.data[0];
      if (!session) {
        return;
      }

      const metadata = session.metadata ?? {};

      await this._paymentRepository.addPayment(
        session.id,
        "failed",
        metadata.restaurentId || null,
        metadata.planId || null,
        (paymentIntent.amount ?? 0) / 100,
        paymentIntent.id,
      );

      return;
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;

      const metadata = session.metadata ?? {};

      await this._paymentRepository.addPayment(
        session.id,
        "failed",
        metadata.restaurentId || null,
        metadata.planId || null,
        (session.amount_total ?? 0) / 100,
        null,
      );

      return;
    }
  }

  async upgradeSubscription(
    restaurantId: string,
    newPlanId: string,
  ): Promise<{ success: boolean; message: string; url?: string }> {
    try {
      const activeSub =
        await this._subscriptionRepo.findActivePlan(restaurantId);
      if (!activeSub) {
        throw new Error("No active subscription found");
      }

      const newPlan = await this._adminPlanRepo.find(newPlanId);
      if (!newPlan) throw new Error("New plan not found");

      const now = new Date();
      const startDate = activeSub.startDate || now;
      const renewalDate = activeSub.renewalDate || activeSub.endDate;

      let unusedValue = 0;
      if (renewalDate && renewalDate.getTime() > now.getTime()) {
        const totalTime = renewalDate.getTime() - startDate.getTime();
        const remainingTime = renewalDate.getTime() - now.getTime();
        if (totalTime > 0) {
          unusedValue = (activeSub.planPrice / totalTime) * remainingTime;
        }
      }

      const newPlanPrice = newPlan.price;
      let amountToCharge = newPlanPrice - unusedValue;
      amountToCharge = Math.max(0, amountToCharge);

      if (amountToCharge > 0 && amountToCharge < 50) {
        amountToCharge = 50;
      }

      if (amountToCharge > 0) {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "inr",
                product_data: { name: `Upgrade to ${newPlan.planName}` },
                unit_amount: Math.round(amountToCharge * 100),
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${process.env.FRONTEND_BASE_URL}/admin/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_BASE_URL}/payment-failed`,
          metadata: {
            restaurentId: restaurantId,
            planId: newPlanId,
            amount: amountToCharge,
            planName: newPlan.planName,
            paymentType: "upgrade_subscription",
          },
        });

        return {
          success: true,
          message: "Checkout session created for upgrade",
          url: session.url!,
        };
      } else {
        let msInDuration = 0;
        const [amountStr, unit] = String(newPlan.duration).split(" ");
        const unitStr = unit ? unit.toLowerCase() : "";
        const numAmount = parseInt(amountStr || "0");
        if (unitStr.includes("month"))
          msInDuration = numAmount * 30 * 24 * 60 * 60 * 1000;
        else if (unitStr.includes("year"))
          msInDuration = numAmount * 365 * 24 * 60 * 60 * 1000;
        else if (unitStr.includes("day"))
          msInDuration = numAmount * 24 * 60 * 60 * 1000;

        activeSub.status = "expired";
        activeSub.endDate = now;
        await (activeSub as any).save();

        let renewalDate = now;
        if (msInDuration > 0) {
          renewalDate = new Date(now.getTime() + msInDuration);
        }

        await this._subscriptionRepo.addSubcription({
          restaurentId: new mongoose.Types.ObjectId(restaurantId),
          planId: new mongoose.Types.ObjectId(newPlanId),
          planName: newPlan.planName,
          planPrice: newPlan.price,
          planSnapshot: {
            planName: newPlan.planName,
            planPrice: newPlan.price,
            duration: newPlan.duration,
            noOfDishes: newPlan.noOfDishes,
            noOfStaff: newPlan.noOfStaff,
            features: newPlan.features,
          },
          startDate: now,
          renewalDate,
          stripeSessionId: activeSub.stripeSessionId,
          stripePaymentIntentId: activeSub.stripePaymentIntentId,
          status: "active" as any,
        });

        return {
          success: true,
          message:
            "Subscription upgraded successfully without additional charge",
        };
      }
    } catch (error: any) {
      console.error("Upgrade error:", error);
      return { success: false, message: error.message };
    }
  }
}
