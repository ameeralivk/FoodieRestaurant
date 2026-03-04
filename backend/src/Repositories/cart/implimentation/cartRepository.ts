
import { ICartRepository } from "../interface/ICartRepository";
import { BaseRepository } from "../../IBaseRepository";
import { CartDocument } from "../../../models/cart";
import Cart from "../../../models/cart";
import { Types } from "mongoose";
import { ICart, ICartItem } from "../../../types/cart";
import mongoose, { FilterQuery } from "mongoose";
export class CartRepository
  extends BaseRepository<ICart>
  implements ICartRepository
{
  constructor() {
    super(Cart);
  }

  async findByUserAndRestaurant(
    userId: string,
    restaurantId: string,
  ): Promise<ICart | null> {
    return this.getByFilter({
      userId,
      restaurantId,
    } as FilterQuery<ICart>);
  }

  async createCart(
    userId: string,
    restaurantId: string,
    tableId: string,
    items: ICartItem[],
  ): Promise<ICart | null> {
    const objuserId = new mongoose.Types.ObjectId(userId);
    const objrestaurantId = new mongoose.Types.ObjectId(restaurantId);
    return super.create({
      userId: objuserId,
      restaurantId: objrestaurantId,
      tableId,
      items,
    });
  }

  async addCart(cartData: Partial<ICart>): Promise<ICart | null> {
    if (!cartData._id) {
      throw new Error("Cart ID is required");
    }
    const cart = await this.model.findById(cartData._id);
    if (!cart) throw new Error("Cart not found");
    if (cartData.items) {
      cart.items = cartData.items;
    }
    return await cart.save();
  }

  async findCart(
    userId: string,
    restaurantId: string,
  ): Promise<CartDocument | null> {
    return this.model.findOne({
      userId: userId,
      restaurantId,
      isDeleted: false,
    });
  }

  async saveCart(cart: CartDocument): Promise<ICart | null> {
    let cartId = cart._id.toString();
    return await this.findByIdAndUpdate(cartId, { ...cart });
  }

  async deleteCart(cartId: string): Promise<ICart | null> {
    return this.findByIdAndDel(cartId);
  }
    async deleteByUserId(userId: string): Promise<ICart | null> {
    return this.model.findOneAndDelete({ userId:new mongoose.Types.ObjectId(userId) });
  }

  findCartById(cartId: string, restaurantId: string): Promise<ICart | null> {
    return this.model.findOne({
      _id: cartId,
      restaurantId,
      isDeleted: false,
    });
  }

  findAndUpdate(cartId: string, cart: ICart): Promise<ICart | null> {
    return this.findByIdAndUpdate(cartId, { ...cart });
  }


  async updateInstruction(
  cartId: string,
  cartItemId: string,
  instraction: string,
  variant?: { category: string; option: string; price: number }
): Promise<ICart | null> {

  const updatePath = variant
    ? "items.$[item].instraction"
    : "items.$[item].instraction";
  const arrayFilter: any = { "item.itemId": new Types.ObjectId(cartItemId) };

  if (variant) {
    arrayFilter["item.variant.category"] = variant.category;
    arrayFilter["item.variant.option"] = variant.option;
  }

  const result = await this.model.collection.findOneAndUpdate(
    { _id: new Types.ObjectId(cartId) },
    { $set: { [updatePath]: instraction } },
    {
      arrayFilters: [arrayFilter],
      returnDocument: "after"
    }
  );

  return result?.value as ICart | null;
}


  getByCartId(cartId: string): Promise<ICart | null> {
    return this.getById(cartId);
  }
}
