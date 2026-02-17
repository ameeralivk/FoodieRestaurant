import { BaseRepository } from "../../IBaseRepository";
import { IUserRepository } from "../interface/IUserRepository";
import { IUser } from "../../../types/usert";
import User from "../../../models/user";
import { FilterQuery } from "mongoose";
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(User);
  }

  async getAllUsers(
    search: string,
    page: number,
    limit: number
  ): Promise<{ data: IUser[]; total: number }> {
    const filter: any = {
      isDeleted: false,
    };

    if (search) {
      filter.$or = [
        { Name: { $regex: search, $options: "i" } },
        { Email: { $regex: search, $options: "i" } },
      ];
    }
    return this.getAll(filter, { page, limit });
  }

  async updateStatus(
    userId: string,
    isBlocked: boolean
  ): Promise<IUser | null> {
    return this.updateOne({ _id: userId } as FilterQuery<IUser>, { isBlocked });
  }

  async findById(id: string) {
    return await this.getById(id);
  }

  async updateUser(
    userId: string,
    data: { name: string; phone: string; email?: string }
  ): Promise<IUser | null> {
    let result;
    if (data.email) {
      result = {
        Name: data.name,
        phone: data.phone,
        Email: data.email,
      };
    } else {
      result = {
        Name: data.name,
        phone: data.phone,
      };
    }
    return await this.findByIdAndUpdate(userId, result);
  }

   async updateProfileImage(image: string, userId: string): Promise<IUser | null> {
    return await this.findByIdAndUpdate(userId,{imageUrl:image})
  }

  async updatePassword(userId: string, newPassword: string): Promise<IUser | null> {
     return await this.findByIdAndUpdate(userId,{password:newPassword})
  }
}
