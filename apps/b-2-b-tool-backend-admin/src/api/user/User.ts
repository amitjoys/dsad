import { Rating } from "../rating/Rating";
import { Review } from "../review/Review";
import { JsonValue } from "type-fest";
import { Team } from "../team/Team";

export type User = {
  createdAt: Date;
  email: string | null;
  firstName: string | null;
  id: string;
  lastName: string | null;
  ratings?: Array<Rating>;
  reviews?: Array<Review>;
  roles: JsonValue;
  team?: Team | null;
  updatedAt: Date;
  username: string;
};
