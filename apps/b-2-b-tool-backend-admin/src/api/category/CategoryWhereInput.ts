import { StringNullableFilter } from "../../util/StringNullableFilter";
import { StringFilter } from "../../util/StringFilter";
import { SubcategoryListRelationFilter } from "../subcategory/SubcategoryListRelationFilter";
import { ToolListRelationFilter } from "../tool/ToolListRelationFilter";

export type CategoryWhereInput = {
  description?: StringNullableFilter;
  id?: StringFilter;
  name?: StringNullableFilter;
  subcategories?: SubcategoryListRelationFilter;
  tools?: ToolListRelationFilter;
};
