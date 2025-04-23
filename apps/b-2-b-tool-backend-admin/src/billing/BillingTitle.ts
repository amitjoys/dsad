import { Billing as TBilling } from "../api/billing/Billing";

export const BILLING_TITLE_FIELD = "paymentMethod";

export const BillingTitle = (record: TBilling): string => {
  return record.paymentMethod?.toString() || String(record.id);
};
