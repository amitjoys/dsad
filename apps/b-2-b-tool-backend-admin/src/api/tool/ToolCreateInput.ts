import { CategoryWhereUniqueInput } from "../category/CategoryWhereUniqueInput";
import { InputJsonValue } from "../../types";
import { RatingCreateNestedManyWithoutToolsInput } from "./RatingCreateNestedManyWithoutToolsInput";
import { ReviewCreateNestedManyWithoutToolsInput } from "./ReviewCreateNestedManyWithoutToolsInput";
import { SubcategoryWhereUniqueInput } from "../subcategory/SubcategoryWhereUniqueInput";

export type ToolCreateInput = {
  category?: CategoryWhereUniqueInput | null;
  createdBy?: string | null;
  csvUploadFile?: InputJsonValue;
  description?: string | null;
  features?: string | null;
  isFeatured?: boolean | null;
  logo?: InputJsonValue;
  name?: string | null;
  pricingDetails?: string | null;
  ratings?: RatingCreateNestedManyWithoutToolsInput;
  reviews?: ReviewCreateNestedManyWithoutToolsInput;
  status?: "Option1" | null;
  subcategory?: SubcategoryWhereUniqueInput | null;
  website?: string | null;
};
