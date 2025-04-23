import { Rating } from "../rating/Rating";
import { Tool } from "../tool/Tool";
import { User } from "../user/User";

export type Review = {
  body: string | null;
  createdAt: Date;
  id: string;
  published: boolean | null;
  ratings?: Array<Rating>;
  reviewDate: Date | null;
  title: string | null;
  tool?: Tool | null;
  updatedAt: Date;
  user?: User | null;
};
