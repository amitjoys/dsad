import { StringFilter } from "../../util/StringFilter";
import { ReviewWhereUniqueInput } from "../review/ReviewWhereUniqueInput";
import { IntNullableFilter } from "../../util/IntNullableFilter";
import { ToolWhereUniqueInput } from "../tool/ToolWhereUniqueInput";
import { UserWhereUniqueInput } from "../user/UserWhereUniqueInput";

export type RatingWhereInput = {
  id?: StringFilter;
  review?: ReviewWhereUniqueInput;
  score?: IntNullableFilter;
  tool?: ToolWhereUniqueInput;
  user?: UserWhereUniqueInput;
};
