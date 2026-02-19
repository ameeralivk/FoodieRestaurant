import { StaffResponseDTO } from "../../../types/staff";


export interface IStaffAuthService{
    login(email:string,password:String):Promise<{success:boolean,message:string,token:{token:string,refreshToken:string},data:StaffResponseDTO}>
}