import { inject, injectable } from "inversify";
import { ICartRepository } from "../../../Repositories/cart/interface/ICartRepository";
import { ICartService } from "../interface/ICartService";
import { TYPES } from "../../../DI/types";
import { IItemsRepository } from "../../../Repositories/items/interface/interface";
import { CartVariant, ICart, ICartItem } from "../../../types/cart";
import { AppError } from "../../../utils/Error";
import unwrapVariant from "../../../helpers/unwrapter";
import { MESSAGES } from "../../../constants/messages";

@injectable()
export class CartService implements ICartService {
  constructor(
    @inject(TYPES.cartRepository) private _cartRepo: ICartRepository,
    @inject(TYPES.itemsRepository) private _itemRepo: IItemsRepository,
  ) {}
  async addToCart(
    userId: string,
    itemId: string,
    restaurantId: string,
    tableId: string,
    quantity: string,
    variant?: CartVariant,
  ): Promise<ICart | null> {
    const item = await this._itemRepo.find(itemId);

    if (!item || item.isDeleted || !item.isActive) {
      throw new Error(MESSAGES.ITEM_NOT_FOUND);
    }
    if (item.stock && item.stock <= 0) {
      throw new AppError("Item stock is not available");
    }
    const basePrice = item.price;
    const variantPrice = variant?.price ?? 0;
    const finalPrice = basePrice + variantPrice;
    let cart = await this._cartRepo.findByUserAndRestaurant(
      userId,
      restaurantId,
    );
    let cartItem = cart?.items.find((i) => i.itemId.toString() == itemId);
    if (
      item.stock &&
      cartItem &&
      cartItem.quantity + Number(quantity) > item.stock
    ) {
      throw new AppError("Stock exceeded");
    }
    if (
      cartItem &&
      item.maxQuantityPerOrder &&
      cartItem.quantity + Number(quantity) > item.maxQuantityPerOrder
    ) {
      throw new AppError("maxQuantityPerOrder is exceeded");
    }

    const newCartItem = {
      itemId: item._id!,
      name: item.name,
      basePrice,
      price: finalPrice,
      quantity: Number(quantity),
      variant: variant ?? null,
      images: item.images,
      maxQuantityPerOrder: item.maxQuantityPerOrder,
      preparationTime: item.preparationTime,
    };

    if (!cart) {
      return await this._cartRepo.createCart(userId, restaurantId, tableId, [
        newCartItem,
      ]);
    }
    const existingItem = cart.items.find((i) => {
      const sameItem = i.itemId.toString() === itemId;

      const itemVariant = unwrapVariant(i.variant);

      if (variant == null) {
        return sameItem && itemVariant == null;
      }

      return (
        sameItem &&
        itemVariant != null &&
        itemVariant.category === variant.category &&
        itemVariant.option === variant.option &&
        itemVariant.price === variant.price
      );
    });

    console.log(existingItem, "items same");

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push(newCartItem);
    }

    return await this._cartRepo.addCart(cart);
  }

  async updateQuantity(
    cartId: string,
    restaurantId: string,
    itemId: string,
    action: "inc" | "dec",
    variant?: { category: string; option: string; price: number },
  ): Promise<{ success: boolean; message: string }> {
    const cart = await this._cartRepo.findCartById(cartId, restaurantId);
    const item = await this._itemRepo.find(itemId);
    if (!cart) throw new AppError(MESSAGES.CART_NOT_FOUND);
    const cartItem = cart.items.find((i: ICartItem) => {
      const sameItemId = i.itemId.toString() === itemId;

      const itemVariant = unwrapVariant(i.variant);
      const targetVariant = unwrapVariant(variant);

      // No variant case
      if (targetVariant == null) {
        return sameItemId && itemVariant == null;
      }

      // Variant case
      return (
        sameItemId &&
        itemVariant != null &&
        itemVariant.category === targetVariant.category &&
        itemVariant.option === targetVariant.option &&
        itemVariant.price === targetVariant.price
      );
    });

    if (!cartItem) throw new AppError(MESSAGES.ITEM_NOT_FOUND);
    // Update quantity
    if (action === "inc" && item?.stock) {
      if (item && cartItem.quantity + 1 > item.stock) {
        throw new AppError("Stock exceeded");
      }
      if (
        item &&
        item.maxQuantityPerOrder &&
        cartItem.quantity + 1 > item.maxQuantityPerOrder
      ) {
        throw new AppError("maxQuantityPerOrder exceeded");
      }
      cartItem.quantity += 1;
    } else if (action === "inc") {
      cartItem.quantity += 1;
    } else {
      cartItem.quantity -= 1;
      if (cartItem.quantity <= 0) {
        // Remove item from cart
        cart.items = cart.items.filter((i: ICartItem) => {
          const sameItemId = i.itemId.toString() === itemId;

          const sameVariant = variant
            ? i.variant &&
              i.variant.category === variant.category &&
              i.variant.option === variant.option &&
              i.variant.price === variant.price
            : !i.variant;

          return !(sameItemId && sameVariant);
        });
      }
    }

    console.log(cart, "cart is here");
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    const res = await this._cartRepo.saveCart(cart);

    if (res) {
      return { success: true, message: MESSAGES.CART_QUANTITY_UPDATED };
    } else {
      return { success: false, message: MESSAGES.CART_QUANTITY_UPDATED_FAILED };
    }
  }

  async getCart(userId: string, restaurantId: string): Promise<ICart | null> {
    const cart = await this._cartRepo.findCart(userId, restaurantId);
    return cart;
  }

  async deleteCart(
    cartId: string,
    restaurantId: string,
    itemId: string,
    variant?: { category: string; option: string; price: number },
  ): Promise<{ success: boolean; message: string }> {
    const cart = await this._cartRepo.findCartById(cartId, restaurantId);
    if (!cart) {
      throw new AppError(MESSAGES.CART_NOT_FOUND);
    }

    const itemIndex = cart.items.findIndex((i: ICartItem) => {
      const sameItemId = i.itemId.toString() === itemId;

      const itemVariant = unwrapVariant(i.variant);
      const targetVariant = unwrapVariant(variant);
      if (targetVariant == null) {
        return sameItemId && itemVariant == null;
      }
      return (
        sameItemId &&
        itemVariant != null &&
        itemVariant.category === targetVariant.category &&
        itemVariant.option === targetVariant.option &&
        itemVariant.price === targetVariant.price
      );
    });

    if (itemIndex === -1) {
      throw new AppError(MESSAGES.ITEM_NOT_FOUND);
    }

    cart.items.splice(itemIndex, 1);

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    if (cart.items.length === 0) {
      await this._cartRepo.deleteCart(cartId);
      return {
        success: true,
        message: MESSAGES.CART_EMPTY_OR_NOT_FOUND,
      };
    }

    await this._cartRepo.findAndUpdate(cart._id.toString(), cart);

    return {
      success: true,
      message: MESSAGES.CART_ITEM_REMOVED_SUCCES,
    };
  }

  async updateCartItemInstruction(
    cartId: string,
    cartItemId: string,
    instruction: string,
    varient?: { category: string; option: string; price: number },
  ): Promise<{ success: boolean; message: string }> {
    let cart = await this._cartRepo.getByCartId(cartId);
    if (!cart) {
      throw new AppError(MESSAGES.CART_NOT_FOUND);
    }
    const res = await this._cartRepo.updateInstruction(
      cartId,
      cartItemId,
      instruction,
      varient,
    );
    if (res) {
      return {
        success: true,
        message: "Instruction updated successfully",
      };
    } else {
      return {
        success: true,
        message: "Instruction updated Failed",
      };
    }
  }
}
