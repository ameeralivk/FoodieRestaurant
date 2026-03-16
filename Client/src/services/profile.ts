import { apiRequest } from "../api/apiRequest";
import { API_ROUTES } from "../constants/ApiRoutes";
import { HTTP_METHOD } from "../constants/httpMethods";

export const editProfile = async (
  userId: string,
  name: string,
  phone: string,
  email: string
): Promise<{ success: boolean; message: string; requiresOtp?: boolean }> => {
  return apiRequest("PUT",API_ROUTES.PROFILE.EDIT(userId), { name, phone, email });
};

export const verifyOtp = async (
  email: string,
  otp: string
): Promise<{ success: boolean; message: string }> => {
  return apiRequest("POST",API_ROUTES.PROFILE.VERIFY_EMAIL_OTP, { email, otp });
};


export const passwordChange = async(userId:string,currentPassword:string,newPassword:string):Promise<{success:boolean,message:string}>=>{
  return apiRequest("POST",API_ROUTES.PROFILE.CHANGE_PASSWORD(userId),{currentPassword,newPassword})
}


export const uploadProfileImage = async (
  userId: string,
  file: File
): Promise<{ success: boolean; message: string; imageUrl?: string }> => {
  const formData = new FormData();
  formData.append("profileImage", file); // MUST match multer field name

  return apiRequest(
    HTTP_METHOD.PUT,
    API_ROUTES.PROFILE.UPLOAD_IMAGE(userId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    }
  );
};

