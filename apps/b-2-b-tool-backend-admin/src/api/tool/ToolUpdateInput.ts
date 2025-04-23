import { CategoryWhereUniqueInput } from "../category/CategoryWhereUniqueInput";
import { InputJsonValue } from "../../types";
import { RatingUpdateManyWithoutToolsInput } from "./RatingUpdateManyWithoutToolsInput";
import { ReviewUpdateManyWithoutToolsInput } from "./ReviewUpdateManyWithoutToolsInput";
import { SubcategoryWhereUniqueInput } from "../subcategory/SubcategoryWhereUniqueInput";

export type ToolUpdateInput = {
  category?: CategoryWhereUniqueInput | null;
  createdBy?: string | null;
  csvUploadFile?: InputJsonValue;
  description?: string | null;
  features?: string | null;
  isFeatured?: boolean | null;
  logo?: InputJsonValue;
  name?: string | null;
  pricingDetails?: string | null;
  ratings?: RatingUpdateManyWithoutToolsInput;
  reviews?: ReviewUpdateManyWithoutToolsInput;
  status?: "Option1" | null;
  subcategory?: SubcategoryWhereUniqueInput | null;
  website?: string | null;
};
