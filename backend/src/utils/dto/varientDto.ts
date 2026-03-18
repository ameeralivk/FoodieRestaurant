
import { IGroup} from "../../types/varient";

export const VarientResponseDto = (group: IGroup) => {
  return {
    _id: group._id,
    name: group.name,
    Varient: group.Varients,
    createdAt: group.createdAt
  };
};