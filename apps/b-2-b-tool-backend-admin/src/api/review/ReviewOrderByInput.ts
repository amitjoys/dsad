import { SortOrder } from "../../util/SortOrder";

export type ReviewOrderByInput = {
  body?: SortOrder;
  createdAt?: SortOrder;
  id?: SortOrder;
  published?: SortOrder;
  reviewDate?: SortOrder;
  title?: SortOrder;
  toolId?: SortOrder;
  updatedAt?: SortOrder;
  userId?: SortOrder;
};
