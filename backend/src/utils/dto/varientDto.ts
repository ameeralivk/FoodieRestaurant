
import { IGroup} from "../../types/varient";
import { IVarientResponseDto } from "./types/varient.dto.types";
// export const VarientResponseDto = (group: IGroup):IVarientResponseDtoType => {
//   return {
//     _id: group._id,
//     name: group.name,
//     Varient: group.Varients,
//     createdAt: group.createdAt
//   };
// };

export const VarientResponseDto = (group: IGroup): IVarientResponseDto => {
  return {
    _id: group._id,
    name: group.name,
    Varient: group.Varients,
    createdAt: group.createdAt
  };
};