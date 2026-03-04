import { injectable, inject } from "inversify";
import { IStaffRepository } from "../../../Repositories/staff/interface/IStaffRepository";
import { IStaffService } from "../interface/IStaffService";
import { TYPES } from "../../../DI/types";
import { StaffResponseDTO } from "../../../types/staff";
import { Request } from "express";
import bcrypt from "bcrypt";
import { EditIStaff, RequestIStaff } from "../../../types/staff";
import { MESSAGES } from "../../../constants/messages";
import { generateRandomPassword } from "../../../helpers/staff/generateRandonPass";
import { sendStaffAccountEmail } from "../../../helpers/sentOtp";
import { AppError } from "../../../utils/Error";
import { mapStaffToDTO } from "../../../utils/dto/staffDto";
import { StaffRequestSchema } from "../../../helpers/zodvalidation";
import HttpStatus from "../../../constants/htttpStatusCode";

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

@injectable()
export class StaffService implements IStaffService {
  constructor(
    @inject(TYPES.staffRepository) private _staffRepo: IStaffRepository,
  ) {}

  async addStaff(
    req: Request,
    data: RequestIStaff,
  ): Promise<{ success: boolean; message: string }> {
    const validate = StaffRequestSchema.safeParse(data);
    if (!validate.success) {
      const errorMessages = validate.error.issues.map((e) => e.message);
      throw new AppError(errorMessages.join(","), HttpStatus.NOT_FOUND);
    }
    const role = data.role.toLowerCase() as "chef" | "staff";
    const existing = await this._staffRepo.isExist(data.email);
    if (existing) {
      throw new Error(MESSAGES.STAFF_ALREADY_EXIST);
    }
    const password = generateRandomPassword();
    await sendStaffAccountEmail(
      data.email,
      data.staffName,
      password,
      "foodieRestaurent",
    );
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const restaurantId = req.activePlan.restaurentId;
    const limit = req.activePlan.planSnapshot.noOfStaff;
    const totalstaff = await this._staffRepo.getAllByRestaurantId(restaurantId);
    const totalStaffCount = totalstaff.data.length;
    if (totalStaffCount === limit) {
      delete req.activePlan;
      throw new AppError(
        "You have reached the maximum staff limit for your current plan.",
      );
    }
    delete req.activePlan;
    const res = await this._staffRepo.addStaff({
      restaurantId: data.restaurantId,
      staffName: data.staffName,
      email: data.email,
      role,
      password: hashedPassword,
    });
    if (res.success) {
      return { success: true, message: MESSAGES.STAFF_ADDED_SUCCESS };
    } else {
      return { success: false, message: MESSAGES.STAFF_ADDED_FAILED };
    }
  }
  async editStaff(
    data: EditIStaff,
  ): Promise<{ success: boolean; message: string }> {
    const { staffId, ...updateData } = data;
    const updatedStaff = await this._staffRepo.editStaff(staffId, updateData);
    if (!updatedStaff) {
      throw new AppError(MESSAGES.STAFF_NOT_FOUND, 404);
    }
    return { success: true, message: MESSAGES.STAFF_UPDATED_SUCCESS };
  }

  async deleteStaff(
    staffId: string,
  ): Promise<{ success: boolean; message: string }> {
    const deletedStaff = await this._staffRepo.deleteStaff(staffId);
    if (!deletedStaff) {
      throw new AppError(MESSAGES.STAFF_NOT_FOUND, 404);
    }
    return { success: true, message: MESSAGES.STAFF_DELETED_SUCCESS };
  }

  async changeStaffStatus(
    staffId: string,
    status: boolean,
  ): Promise<{ success: boolean; message: string }> {
    const staff = await this._staffRepo.changeStatus(staffId, status);

    if (!staff) {
      throw new AppError(MESSAGES.STAFF_NOT_FOUND, 404);
    }
    return { success: true, message: MESSAGES.STATUS_CHANGED_SUCCESS };
  }

  async getAllStaff(
    restaurantId: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<{ data: StaffResponseDTO[]; total: number }> {
    if (!restaurantId) {
      throw new AppError("Restaurant ID is required", 400);
    }
    let res = await this._staffRepo.getAllByRestaurantId(
      restaurantId,
      page,
      limit,
      search,
    );
    return {
      total: res.total,
      data: res.data.map(mapStaffToDTO),
    };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> {
   const user = await this._staffRepo.findById(userId);
       if (!user) {
         return { success: false, message: MESSAGES.USER_NOT_FOUND };
       }
       const isPasswordMatch = await bcrypt.compare(
         oldPassword,
         user.password
       );
       if (!isPasswordMatch) {
         return { success: false, message: MESSAGES.INVALID_CURRENT_PASSWORD };
       }
       const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
       console.log(hashedPassword,'hash')
       await this._staffRepo.updatePassword(userId, hashedPassword);
       return {
         success: true,
         message: MESSAGES.PASSWORD_CHANGED_SUCCESS,
       };
     }

     async getStaff(staffId: string): Promise<{ success: boolean; data: StaffResponseDTO | []; }> {
         if(!staffId){
          return {success:false,data:[]}
         }
         let result =await this._staffRepo.findById(staffId)
         if(!result) return {success:false,data:[]}
         const dtoData = mapStaffToDTO(result)
         if(result){
          return {success:true,data:dtoData}
         }else{
          return {success:false,data:[]}
         }
     }
  }

