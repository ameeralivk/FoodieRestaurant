
import { Types } from "mongoose";
interface Varient {
  name: string;
  price?: number;
}

export interface IVarientResponseDto {
  _id: Types.ObjectId;
  name: string;
  Varient: Varient[];
  createdAt: Date;
}
