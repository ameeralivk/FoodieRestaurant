import { IOrderItem, IUserOrderDocument } from "../../../types/order";
import { ICart } from "../../../types/cart";



export interface IOrderRepo{
    addOrder(data:ICart,orderId:string):Promise<IUserOrderDocument>
    getAllOrders(userId:string,page:number,limit:number,search:string):Promise<{data:IUserOrderDocument[]|null,total:number}>
    getOrder(orderId:string):Promise<IUserOrderDocument|null>
    getOrderById(orderId:string):Promise<IUserOrderDocument|null>
    changeStatus(orderId:string,status:string):Promise<IUserOrderDocument|null>
    getEntireOrdersByStatus(status:"PENDING"|"PREPARING"|"READY"):Promise<IUserOrderDocument[]|null>
}