import { ReviewWhereUniqueInput } from "../review/ReviewWhereUniqueInput";
import { ToolWhereUniqueInput } from "../tool/ToolWhereUniqueInput";
import { UserWhereUniqueInput } from "../user/UserWhereUniqueInput";

export type RatingUpdateInput = {
  review?: ReviewWhereUniqueInput | null;
  score?: number | null;
  tool?: ToolWhereUniqueInput | null;
  user?: UserWhereUniqueInput | null;
};
