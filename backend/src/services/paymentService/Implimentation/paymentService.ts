import { IPaymentService } from "../Interface/IPaymentService";
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
        let res = await this._orderRepository.addOrder(
          cart,
          metadata.orderId as string,
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
}
