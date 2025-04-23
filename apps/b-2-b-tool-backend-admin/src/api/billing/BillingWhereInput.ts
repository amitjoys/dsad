import { FloatNullableFilter } from "../../util/FloatNullableFilter";
import { DateTimeNullableFilter } from "../../util/DateTimeNullableFilter";
import { StringFilter } from "../../util/StringFilter";
import { StringNullableFilter } from "../../util/StringNullableFilter";
import { TeamWhereUniqueInput } from "../team/TeamWhereUniqueInput";

export type BillingWhereInput = {
  amount?: FloatNullableFilter;
  endDate?: DateTimeNullableFilter;
  id?: StringFilter;
  paymentMethod?: StringNullableFilter;
  plan?: StringNullableFilter;
  startDate?: DateTimeNullableFilter;
  status?: "Option1";
  team?: TeamWhereUniqueInput;
  transactionId?: StringNullableFilter;
};
