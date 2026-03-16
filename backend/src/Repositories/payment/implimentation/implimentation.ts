import { PaymentDocument } from "../../../models/payment";
import { BaseRepository } from "../../BaseRepository";
import { IPaymentRepository } from "../Interface/interface";
import PaymentModal from "../../../models/payment";
import { IPayment } from "../../../types/payment";
export class PaymentRepository
  extends BaseRepository<PaymentDocument>
  implements IPaymentRepository
{
  constructor() {
    super(PaymentModal);
  }

  async addPayment(
    sessionId: string,
    status: "pending" | "paid" | "failed",
    restaurentId: string,
    planId: string,
    amount: number,
    paymentIntentId?: string,
  ): Promise<PaymentDocument> {
    return this.create({
      stripeSessionId: sessionId,
      status,
      restaurentId,
      planId,
      amount,
      stripePaymentIntentId: paymentIntentId,
    });
  }

  addOrderPayment(
    sessionId: string,
    status: "paid" | "failed" | "pending",
    restaurentId: string,
    amount: number,
    paymentIntentId?: string,
  ): Promise<IPayment> {
    console.log(
      sessionId,
      status,
      restaurentId,
      amount,
      paymentIntentId,
      "hi ahmeer alfjasdljfdklasfds",
    );
    return this.create({
      stripeSessionId: sessionId,
      status,
      restaurentId,
      amount,
      stripePaymentIntentId: paymentIntentId,
    });
  }
}
