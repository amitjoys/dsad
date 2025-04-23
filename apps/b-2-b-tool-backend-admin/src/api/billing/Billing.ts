import { Team } from "../team/Team";

export type Billing = {
  amount: number | null;
  createdAt: Date;
  endDate: Date | null;
  id: string;
  paymentMethod: string | null;
  plan: string | null;
  startDate: Date | null;
  status?: "Option1" | null;
  team?: Team | null;
  transactionId: string | null;
  updatedAt: Date;
};
