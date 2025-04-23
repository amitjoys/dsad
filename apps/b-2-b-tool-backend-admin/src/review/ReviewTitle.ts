import { Review as TReview } from "../api/review/Review";

export const REVIEW_TITLE_FIELD = "title";

export const ReviewTitle = (record: TReview): string => {
  return record.title?.toString() || String(record.id);
};
