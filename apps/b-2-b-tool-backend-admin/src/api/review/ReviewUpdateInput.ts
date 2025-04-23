import { RatingUpdateManyWithoutReviewsInput } from "./RatingUpdateManyWithoutReviewsInput";
import { ToolWhereUniqueInput } from "../tool/ToolWhereUniqueInput";
import { UserWhereUniqueInput } from "../user/UserWhereUniqueInput";

export type ReviewUpdateInput = {
  body?: string | null;
  published?: boolean | null;
  ratings?: RatingUpdateManyWithoutReviewsInput;
  reviewDate?: Date | null;
  title?: string | null;
  tool?: ToolWhereUniqueInput | null;
  user?: UserWhereUniqueInput | null;
};
