export interface FormData {
  email: string;
  password: string;
}

export interface userType {
  name?: string;
  phone?: string;
  tableNo?: string;
  _id: string;
  role: string;
  email: string;
  restaurantId?: string;
  googleId?: string;
  restaurantName?:string;
  imageUrl?: string;
  status: string;
}
export interface IUserItem {
  success: boolean;
  user: IUser;
}
export interface IUser {
  id: string;
  email: string;
  name: string;
  allergies: string;
  dietaryRestriction: string;
  isBlocked: boolean;
}

export interface IPaginationData {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface GetUsersResponse {
  success: boolean;
  message: string;
  data: IPaginationData & {
    users: IUserItem[];
  };
}
