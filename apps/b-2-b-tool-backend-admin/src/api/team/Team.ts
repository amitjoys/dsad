import { Billing } from "../billing/Billing";
import { User } from "../user/User";

export type Team = {
  billings?: Array<Billing>;
  createdAt: Date;
  description: string | null;
  id: string;
  name: string | null;
  updatedAt: Date;
  users?: Array<User>;
};
