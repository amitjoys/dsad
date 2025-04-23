import { RatingCreateNestedManyWithoutReviewsInput } from "./RatingCreateNestedManyWithoutReviewsInput";
import { ToolWhereUniqueInput } from "../tool/ToolWhereUniqueInput";
import { UserWhereUniqueInput } from "../user/UserWhereUniqueInput";

export type ReviewCreateInput = {
  body?: string | null;
  published?: boolean | null;
  ratings?: RatingCreateNestedManyWithoutReviewsInput;
  reviewDate?: Date | null;
  title?: string | null;
  tool?: ToolWhereUniqueInput | null;
  user?: UserWhereUniqueInput | null;
};
