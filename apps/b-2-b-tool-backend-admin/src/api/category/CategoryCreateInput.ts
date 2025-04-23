import { SubcategoryCreateNestedManyWithoutCategoriesInput } from "./SubcategoryCreateNestedManyWithoutCategoriesInput";
import { ToolCreateNestedManyWithoutCategoriesInput } from "./ToolCreateNestedManyWithoutCategoriesInput";

export type CategoryCreateInput = {
  description?: string | null;
  name?: string | null;
  subcategories?: SubcategoryCreateNestedManyWithoutCategoriesInput;
  tools?: ToolCreateNestedManyWithoutCategoriesInput;
};
