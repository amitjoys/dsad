import { StringNullableFilter } from "../../util/StringNullableFilter";
import { StringFilter } from "../../util/StringFilter";
import { BooleanNullableFilter } from "../../util/BooleanNullableFilter";
import { RatingListRelationFilter } from "../rating/RatingListRelationFilter";
import { DateTimeNullableFilter } from "../../util/DateTimeNullableFilter";
import { ToolWhereUniqueInput } from "../tool/ToolWhereUniqueInput";
import { UserWhereUniqueInput } from "../user/UserWhereUniqueInput";

export type ReviewWhereInput = {
  body?: StringNullableFilter;
  id?: StringFilter;
  published?: BooleanNullableFilter;
  ratings?: RatingListRelationFilter;
  reviewDate?: DateTimeNullableFilter;
  title?: StringNullableFilter;
  tool?: ToolWhereUniqueInput;
  user?: UserWhereUniqueInput;
};
