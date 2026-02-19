import {
  EditIStaff,
  IStaff,
  RequestEditIStaff,
  RequestIStaff,
  StaffResponseDTO,
} from "../../../types/staff";
import { Request } from "express";
export interface IStaffService {
  addStaff(req:Request,data: RequestIStaff): Promise<{ success: boolean; message: string }>;
  editStaff(data: EditIStaff): Promise<{ success: boolean; message: string }>;
  deleteStaff(staffId: string): Promise<{ success: boolean; message: string }>;
  changeStaffStatus(
    staffId: string,
    status: boolean
  ): Promise<{ success: boolean; message: string }>;
  getAllStaff(
    restaurantId: string,
    page: number,
    limit: number,
    search:string,
  ): Promise<{ data: StaffResponseDTO[],total:number }>;
  changePassword(userId:string,oldPassword:string,newPassword:string):Promise<{success:boolean,message:string}>
  getStaff(staffId:string):Promise<{success:boolean,data:StaffResponseDTO|[]}>
}
