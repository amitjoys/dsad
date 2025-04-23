import { CategoryWhereUniqueInput } from "../category/CategoryWhereUniqueInput";
import { ToolCreateNestedManyWithoutSubcategoriesInput } from "./ToolCreateNestedManyWithoutSubcategoriesInput";

export type SubcategoryCreateInput = {
  category?: CategoryWhereUniqueInput | null;
  description?: string | null;
  name?: string | null;
  tools?: ToolCreateNestedManyWithoutSubcategoriesInput;
};
