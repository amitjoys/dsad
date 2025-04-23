import { BillingWhereInput } from "./BillingWhereInput";
import { BillingOrderByInput } from "./BillingOrderByInput";

export type BillingFindManyArgs = {
  where?: BillingWhereInput;
  orderBy?: Array<BillingOrderByInput>;
  skip?: number;
  take?: number;
};
