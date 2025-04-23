import { BillingUpdateManyWithoutTeamsInput } from "./BillingUpdateManyWithoutTeamsInput";
import { UserUpdateManyWithoutTeamsInput } from "./UserUpdateManyWithoutTeamsInput";

export type TeamUpdateInput = {
  billings?: BillingUpdateManyWithoutTeamsInput;
  description?: string | null;
  name?: string | null;
  users?: UserUpdateManyWithoutTeamsInput;
};
