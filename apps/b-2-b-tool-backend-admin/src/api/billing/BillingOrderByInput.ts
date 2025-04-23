import { SortOrder } from "../../util/SortOrder";

export type BillingOrderByInput = {
  amount?: SortOrder;
  createdAt?: SortOrder;
  endDate?: SortOrder;
  id?: SortOrder;
  paymentMethod?: SortOrder;
  plan?: SortOrder;
  startDate?: SortOrder;
  status?: SortOrder;
  teamId?: SortOrder;
  transactionId?: SortOrder;
  updatedAt?: SortOrder;
};
