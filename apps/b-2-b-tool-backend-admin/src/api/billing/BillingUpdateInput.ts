import { TeamWhereUniqueInput } from "../team/TeamWhereUniqueInput";

export type BillingUpdateInput = {
  amount?: number | null;
  endDate?: Date | null;
  paymentMethod?: string | null;
  plan?: string | null;
  startDate?: Date | null;
  status?: "Option1" | null;
  team?: TeamWhereUniqueInput | null;
  transactionId?: string | null;
};
