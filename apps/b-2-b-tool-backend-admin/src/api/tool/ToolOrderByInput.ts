import { SortOrder } from "../../util/SortOrder";

export type ToolOrderByInput = {
  categoryId?: SortOrder;
  createdAt?: SortOrder;
  createdBy?: SortOrder;
  csvUploadFile?: SortOrder;
  description?: SortOrder;
  features?: SortOrder;
  id?: SortOrder;
  isFeatured?: SortOrder;
  logo?: SortOrder;
  name?: SortOrder;
  pricingDetails?: SortOrder;
  status?: SortOrder;
  subcategoryId?: SortOrder;
  updatedAt?: SortOrder;
  website?: SortOrder;
};
