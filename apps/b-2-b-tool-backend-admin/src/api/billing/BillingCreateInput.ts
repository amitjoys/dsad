import { TeamWhereUniqueInput } from "../team/TeamWhereUniqueInput";

export type BillingCreateInput = {
  amount?: number | null;
  endDate?: Date | null;
  paymentMethod?: string | null;
  plan?: string | null;
  startDate?: Date | null;
  status?: "Option1" | null;
  team?: TeamWhereUniqueInput | null;
  transactionId?: string | null;
};
