import { SubcategoryWhereInput } from "./SubcategoryWhereInput";
import { SubcategoryOrderByInput } from "./SubcategoryOrderByInput";

export type SubcategoryFindManyArgs = {
  where?: SubcategoryWhereInput;
  orderBy?: Array<SubcategoryOrderByInput>;
  skip?: number;
  take?: number;
};
