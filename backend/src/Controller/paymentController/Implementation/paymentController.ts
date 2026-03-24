import HttpStatus from "../../../constants/htttpStatusCode";
import { IPaymentService } from "../../../services/paymentService/Interface/IPaymentService";
import { AppError } from "../../../utils/Error";
import { inject, injectable } from "inversify";
import { IPaymentController } from "../Interface/IPaymentController";
import { Request, Response } from "express";
import Stripe from "stripe";
import { TYPES } from "../../../DI/types";
injectable();
export class PaymentController implements IPaymentController {
  constructor(
    @inject(TYPES.PaymentService) private _paymentService: IPaymentService
  ) {}

  createPayment = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = req.body as any;

      if (
        !data?.amount ||
        !data.restaurentId ||
        !data.planId ||
        !data.planName
      ) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Missing required fields" });
      }
      const result = await this._paymentService.paymentCreate(
        data.amount,
        data.restaurentId,
        data.planId,
        data.planName
      );

      return res.status(200).json({
        success: true,
        data: { url: result.url },
      });
    } catch (error) {
      throw new AppError(error);
    }
  };

  createOrderPayment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { amount, restaurantId, userId, items } = req.body;
    const result = await this._paymentService.createOneTimePayment(
      amount,
      restaurantId,
      userId,
      items
    );

    return res.status(200).json({
      success: true,
      data: { url: result.url },
    });
  };

  webhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    try {
      const event = Stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
      await this._paymentService.handleWebhook(event);

      res.status(200).send("Webhook received");
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  };

  upgrade = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { restaurantId, newPlanId } = req.body;
      const result = await this._paymentService.upgradeSubscription(restaurantId, newPlanId);
      return res.status(200).json(result);
    } catch (error) {
      throw new AppError(error);
    }
  };
}
