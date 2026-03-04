import { IUser, UpdateProfileResult } from "../../../types/usert";
import { IMappedUserData} from "../../../utils/dto/userDto";


export interface IUserService{
     getAllUsers(search:string,page:number,limit:number):Promise<{users:IMappedUserData[],total:number,page:number,limit:number,totalPages:number}>;
     updateUserStatus(userId: string, isBlocked: boolean):Promise<IUser>
     getUserDetails(userId:string):Promise<Partial<IUser>>;
     updateProfile(userId:string,name:string,phone:string,email:string):Promise<UpdateProfileResult>
     verifyEmailOtp(email:string,otp:string):Promise<{success:boolean,message:string}>
     updateProfilePhoto(image:string,userId:string):Promise<{success:boolean,message:string , image?:string}>
     changePassword(userId:string,currentPassword:string,newPassword:string):Promise<{success:boolean,message:string}>
}