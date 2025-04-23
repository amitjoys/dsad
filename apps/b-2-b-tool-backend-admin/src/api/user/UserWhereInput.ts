import { StringNullableFilter } from "../../util/StringNullableFilter";
import { StringFilter } from "../../util/StringFilter";
import { RatingListRelationFilter } from "../rating/RatingListRelationFilter";
import { ReviewListRelationFilter } from "../review/ReviewListRelationFilter";
import { TeamWhereUniqueInput } from "../team/TeamWhereUniqueInput";

export type UserWhereInput = {
  email?: StringNullableFilter;
  firstName?: StringNullableFilter;
  id?: StringFilter;
  lastName?: StringNullableFilter;
  ratings?: RatingListRelationFilter;
  reviews?: ReviewListRelationFilter;
  team?: TeamWhereUniqueInput;
  username?: StringFilter;
};
