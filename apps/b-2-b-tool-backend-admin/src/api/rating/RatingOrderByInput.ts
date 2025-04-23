import { SortOrder } from "../../util/SortOrder";

export type RatingOrderByInput = {
  createdAt?: SortOrder;
  id?: SortOrder;
  reviewId?: SortOrder;
  score?: SortOrder;
  toolId?: SortOrder;
  updatedAt?: SortOrder;
  userId?: SortOrder;
};
