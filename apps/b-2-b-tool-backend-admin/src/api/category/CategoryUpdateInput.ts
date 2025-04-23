import { SubcategoryUpdateManyWithoutCategoriesInput } from "./SubcategoryUpdateManyWithoutCategoriesInput";
import { ToolUpdateManyWithoutCategoriesInput } from "./ToolUpdateManyWithoutCategoriesInput";

export type CategoryUpdateInput = {
  description?: string | null;
  name?: string | null;
  subcategories?: SubcategoryUpdateManyWithoutCategoriesInput;
  tools?: ToolUpdateManyWithoutCategoriesInput;
};
