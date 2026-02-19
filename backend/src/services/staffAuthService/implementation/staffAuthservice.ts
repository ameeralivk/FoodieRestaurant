import { inject, injectable } from "inversify";
import { IStaffRepository } from "../../../Repositories/staff/interface/IStaffRepository";
import { IStaffAuthService } from "../interface/IStaffAuthService";
import { TYPES } from "../../../DI/types";
import { AppError } from "../../../utils/Error";
import { MESSAGES } from "../../../constants/messages";
import bcrypt from "bcrypt"
import { StaffResponseDTO } from "../../../types/staff";
import { mapStaffToDTO } from "../../../utils/dto/staffDto";
import { generateRefreshToken, generateToken } from "../../../middleware/jwt";
@injectable()
export class StaffAuthService implements IStaffAuthService{
    constructor(@inject(TYPES.staffRepository) private _staffRepo:IStaffRepository){}

async login(
  email: string,
  password: string
): Promise<{ success: boolean; message: string ;token:{token:string,refreshToken:string}, data:StaffResponseDTO}> {

  const staff = await this._staffRepo.isExist(email); 
  if(staff?.isBlocked){
    throw new AppError(MESSAGES.STAFF_BLOCKED)
  }
  if (!staff) {
    throw new AppError(MESSAGES.STAFF_NOT_FOUND);
  }
   const isPasswordValid = await bcrypt.compare(password, staff.password);
  if (!isPasswordValid) {
    throw new AppError(MESSAGES.PASS_NOT_MATCH);
  }
   const token = generateToken(staff._id as string,staff.role);
   const refreshToken = generateRefreshToken(staff._id as string, staff.role);
  return {
    success: true,
    message: MESSAGES.LOGIN_SUCCESS,
    token:{token:token,refreshToken:refreshToken},
    data:mapStaffToDTO(staff)
  };
}

}