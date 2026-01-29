
import { itemsDocument } from "../../../models/items"
import { ICart, ICartItem } from "../../../types/cart"
export interface ICartRepository{
    findByUserAndRestaurant( userId: string,restaurantId: string): Promise<ICart | null>
    createCart(
    userId: string,
    restaurantId: string,
    tableId: string,
    items: ICartItem[]
  ): Promise<ICart | null>;
    addCart(cartData:Partial<ICart>):Promise<ICart|null>;
    findCart(userId: string, restaurantId: string): Promise<ICart | null> ;
    saveCart(cart:ICart): Promise<ICart|null>
    deleteCart(cartId:string):Promise<ICart|null>
    findCartById(cartId:string,restaurantId:string):Promise<ICart|null>
    findAndUpdate(cartId:string,cart:ICart):Promise<ICart|null>
    getByCartId(cartId:string):Promise<ICart|null>
    updateInstruction(cartId:string,cartItemsId:string,instraction:string,variant?:{category:string,option:string,price:number}):Promise<ICart|null>

}