import { apiRequest } from "../api/apiRequest";
import type { NotificationResponse } from "../types/notification";


export const getAllNotification = (recipientId: string):Promise<NotificationResponse> =>{
      return apiRequest("GET",`/notification/getnotification/${recipientId}`)
}
export const markAsRead = (notificationId?: string,isAll?:string):Promise<{success:boolean,message:string}> =>{
       console.log(isAll)
      return apiRequest("PATCH",`/notification/${notificationId}`,{isAll})
}