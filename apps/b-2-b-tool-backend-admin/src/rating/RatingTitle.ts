import { Rating as TRating } from "../api/rating/Rating";

export const RATING_TITLE_FIELD = "id";

export const RatingTitle = (record: TRating): string => {
  return record.id?.toString() || String(record.id);
};
