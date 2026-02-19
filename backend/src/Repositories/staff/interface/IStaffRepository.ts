import { IStaff, RequestEditIStaff, RequestIStaff } from "../../../types/staff";

export interface IStaffRepository {
  isExist(email: string): Promise<IStaff | null>;
  addStaff(
    data: RequestIStaff
  ): Promise<{ success: boolean; data: IStaff | null }>;
  editStaff(
    staffId: string,
    updatedData: RequestEditIStaff
  ): Promise<IStaff | null>;
  deleteStaff(staffId: string): Promise<IStaff | null>;
  changeStatus(staffId: string, status: boolean): Promise<IStaff | null>;
  getAllByRestaurantId(
    restaurantId: string,
    page?: number,
    limit?: number,
    search?:string
  ): Promise<{ data: IStaff[],total:number}>;
  findById(userId:string):Promise<IStaff|null>
  updatePassword(userId:string,newPassword:string):Promise<IStaff|null>
}
