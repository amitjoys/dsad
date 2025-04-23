import { CategoryWhereUniqueInput } from "../category/CategoryWhereUniqueInput";
import { StringNullableFilter } from "../../util/StringNullableFilter";
import { JsonFilter } from "../../util/JsonFilter";
import { StringFilter } from "../../util/StringFilter";
import { BooleanNullableFilter } from "../../util/BooleanNullableFilter";
import { RatingListRelationFilter } from "../rating/RatingListRelationFilter";
import { ReviewListRelationFilter } from "../review/ReviewListRelationFilter";
import { SubcategoryWhereUniqueInput } from "../subcategory/SubcategoryWhereUniqueInput";

export type ToolWhereInput = {
  category?: CategoryWhereUniqueInput;
  createdBy?: StringNullableFilter;
  csvUploadFile?: JsonFilter;
  description?: StringNullableFilter;
  features?: StringNullableFilter;
  id?: StringFilter;
  isFeatured?: BooleanNullableFilter;
  logo?: JsonFilter;
  name?: StringNullableFilter;
  pricingDetails?: StringNullableFilter;
  ratings?: RatingListRelationFilter;
  reviews?: ReviewListRelationFilter;
  status?: "Option1";
  subcategory?: SubcategoryWhereUniqueInput;
  website?: StringNullableFilter;
};
