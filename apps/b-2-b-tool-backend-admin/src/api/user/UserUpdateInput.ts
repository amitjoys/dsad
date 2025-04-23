import { RatingUpdateManyWithoutUsersInput } from "./RatingUpdateManyWithoutUsersInput";
import { ReviewUpdateManyWithoutUsersInput } from "./ReviewUpdateManyWithoutUsersInput";
import { InputJsonValue } from "../../types";
import { TeamWhereUniqueInput } from "../team/TeamWhereUniqueInput";

export type UserUpdateInput = {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  password?: string;
  ratings?: RatingUpdateManyWithoutUsersInput;
  reviews?: ReviewUpdateManyWithoutUsersInput;
  roles?: InputJsonValue;
  team?: TeamWhereUniqueInput | null;
  username?: string;
};
