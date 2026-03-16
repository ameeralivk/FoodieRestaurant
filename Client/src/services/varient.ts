import { apiRequest } from "../api/apiRequest";
import { API_ROUTES } from "../constants/ApiRoutes";
import { HTTP_METHOD } from "../constants/httpMethods";
import type { IGetVariantsResponse, IVarient } from "../types/varient";

export const AddVarient = async (
  name: string,
  varient: IVarient[],
  restaurantId: string,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.POST,API_ROUTES.VARIANT.ADD, {
    name,
    Varients: varient,
    restaurantId,
  });
};

export const getAllVarient = async (
  page: number,
  limit: number,
  search: string,
): Promise<IGetVariantsResponse> => {
  return apiRequest(
    HTTP_METHOD.GET,
    API_ROUTES.VARIANT.GET_ALL(page, limit, search),
  );
};

export const deleteVarient = async (
  variantId: string,
): Promise<{ success: boolean; message: string }> => {
  return apiRequest(HTTP_METHOD.DELETE, API_ROUTES.VARIANT.DELETE(variantId));
};

export const editVarient = async(variantId:string,name:string,varient:IVarient[],restaurantId:string):Promise<{success:boolean,message:string}>=>{
    return apiRequest(HTTP_METHOD.PUT,API_ROUTES.VARIANT.EDIT(variantId),{name:name,Varients:varient,restaurantId})
}