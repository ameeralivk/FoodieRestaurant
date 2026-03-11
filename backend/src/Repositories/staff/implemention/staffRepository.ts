import { BaseRepository } from "../../IBaseRepository";
import Staff from "../../../models/staff";
import { IStaff, RequestEditIStaff, RequestIStaff } from "../../../types/staff";
import { IStaffRepository } from "../interface/IStaffRepository";
export class StaffRepository
  extends BaseRepository<IStaff>
  implements IStaffRepository
{
  constructor() {
    super(Staff);
  }

  isExist(email: string): Promise<IStaff | null> {
    return this.findByEmail(email);
  }
  async addStaff(
    data: RequestIStaff,
  ): Promise<{ success: boolean; data: IStaff | null }> {
    let res = await this.create(data);
    return {
      success: true,
      data: res,
    };
  }

  async editStaff(
    staffId: string,
    updatedData: RequestEditIStaff,
  ): Promise<IStaff | null> {
    return await this.findByIdAndUpdate(staffId, updatedData);
  }

  async deleteStaff(staffId: string): Promise<IStaff | null> {
    return this.findByIdAndDel(staffId);
  }

  async changeStatus(staffId: string, status: boolean): Promise<IStaff | null> {
    return this.findByIdAndUpdate(staffId, { isBlocked: status });
  }

  getAllByRestaurantId(
    restaurantId: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<{ data: IStaff[]; total: number }> {
    const filter: any = {
      restaurantId,
      status: true,
    };
    if (search) {
      filter.$or = [
        { staffName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }
    return this.getAll(filter, { page, limit });
  }

  findById(userId: string): Promise<IStaff | null> {
    return this.model.findById(userId);
  }

  updatePassword(userId: string, newPassword: string): Promise<IStaff | null> {
    return this.findByIdAndUpdate(userId, { password: newPassword });
  }

  findByEmail(email: string): Promise<IStaff | null> {
    return this.model.findOne({ email: email });
  }

  async totalCount(restaurantId:string): Promise<number> {
    return await this.model.countDocuments({ restaurantId, role: { $in: ["staff", "chef"] }, status: true, isBlocked: false });
  }
}
