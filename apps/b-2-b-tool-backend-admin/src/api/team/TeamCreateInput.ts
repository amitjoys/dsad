import { BillingCreateNestedManyWithoutTeamsInput } from "./BillingCreateNestedManyWithoutTeamsInput";
import { UserCreateNestedManyWithoutTeamsInput } from "./UserCreateNestedManyWithoutTeamsInput";

export type TeamCreateInput = {
  billings?: BillingCreateNestedManyWithoutTeamsInput;
  description?: string | null;
  name?: string | null;
  users?: UserCreateNestedManyWithoutTeamsInput;
};
