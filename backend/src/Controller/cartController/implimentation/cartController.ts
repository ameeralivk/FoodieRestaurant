import { injectable, inject } from "inversify";
import { ICartService } from "../../../services/cart/interface/ICartService";
import { TYPES } from "../../../DI/types";
import { ICartController } from "../interface/ICartController";
import { AppError } from "../../../utils/Error";
import HttpStatus from "../../../constants/htttpStatusCode";
import { MESSAGES } from "../../../constants/messages";
import { Request, Response } from "express";
import varient from "../../../models/varient";
import { CartVariant } from "../../../types/cart";

@injectable()
export class CartController implements ICartController {
  constructor(@inject(TYPES.CartService) private _cartService: ICartService) {}

  addToCart = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { itemId, restaurantId, userId, tableId, quantity, variant } =
        req.body;
      const cart = await this._cartService.addToCart(
        userId,
        itemId,
        restaurantId,
        tableId,
        quantity,
        variant,
      );

      if (cart) {
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: MESSAGES.CART_CREATION_SUCCESS });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.CART_CREATION_FAILED });
      }
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };

  updateQuantity = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { cartId, restaurantId, itemId, action, variant } = req.body;
      const cart = await this._cartService.updateQuantity(
        cartId,
        restaurantId,
        itemId,
        action,
        variant as any,
      );

      if (cart.success) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: MESSAGES.CART_QUANTITY_UPDATED,
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.CART_QUANTITY_UPDATED_FAILED,
        });
      }
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };

  getCart = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId, restaurantId } = req.params;

      const cart = await this._cartService.getCart(
        userId as string,
        restaurantId as string,
      );
      if (cart) {
        return res.status(200).json({
          success: true,
          cart,
        });
      } else {
        return res.status(200).json({
          success: true,
          cart: [],
        });
      }
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };

  deleteCart = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { cartId, restaurantId } = req.params;
      const { itemId, variant } = req.body;
      let result = await this._cartService.deleteCart(
        cartId as string,
        restaurantId as string,
        itemId as string,
        variant,
      );
      if (result.success) {
        return res.status(HttpStatus.OK).json({
          success: true,
          message: MESSAGES.CART_DELETED_SUCCESS,
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.CART_DELETED_FAILED,
        });
      }
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };

  addInstruction = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { cartId, userId, cartItemId, instruction, variant } = req.body;
      if (!cartId || !cartItemId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Invalid payload",
        });
      }

      const updatedCart = await this._cartService.updateCartItemInstruction(
        cartId,
        cartItemId,
        instruction,
        variant
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        data: updatedCart,
      });
    } catch (error: any) {
      throw new AppError(error.message);
    }
  };

}
