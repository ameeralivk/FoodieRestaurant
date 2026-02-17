import { IOrderItem, IUserOrderDocument, IVariant } from "../../../types/order";
import { ICart } from "../../../types/cart";



export interface IOrderRepo{
    addOrder(data:ICart,orderId:string):Promise<IUserOrderDocument>
    getAllOrders(userId:string,page:number,limit:number,search:string):Promise<{data:IUserOrderDocument[]|null,total:number}>
    getOrder(orderId:string):Promise<IUserOrderDocument|null>
    getOrderById(orderId:string):Promise<IUserOrderDocument|null>
    changeStatus(orderId:string,status:string):Promise<IUserOrderDocument|null>
    getEntireOrdersByStatus(status:"PENDING"|"PREPARING"|"READY",restaurantId:string):Promise<IUserOrderDocument[]|null>
    updateItem( orderId:string,itemId:string,status:"PENDING"|"PREPARING"|"READY",variant:string):Promise<IUserOrderDocument[]|null>
    assignChefToItem(orderId:string,itemId:string,chefId:string,variant?:string):Promise<IUserOrderDocument|null>
    getAssignedItems(restaurantId:string):Promise<IUserOrderDocument[]|null>;
    assignOrder(orderId:string,staffId:string):Promise<IUserOrderDocument|null>
    updateOrder(orderId:string,status:string):Promise<IUserOrderDocument|null>
}