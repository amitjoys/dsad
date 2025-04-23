import { CategoryWhereUniqueInput } from "../category/CategoryWhereUniqueInput";
import { ToolUpdateManyWithoutSubcategoriesInput } from "./ToolUpdateManyWithoutSubcategoriesInput";

export type SubcategoryUpdateInput = {
  category?: CategoryWhereUniqueInput | null;
  description?: string | null;
  name?: string | null;
  tools?: ToolUpdateManyWithoutSubcategoriesInput;
};
