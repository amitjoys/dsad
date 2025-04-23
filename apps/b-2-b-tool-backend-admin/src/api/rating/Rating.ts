import { Review } from "../review/Review";
import { Tool } from "../tool/Tool";
import { User } from "../user/User";

export type Rating = {
  createdAt: Date;
  id: string;
  review?: Review | null;
  score: number | null;
  tool?: Tool | null;
  updatedAt: Date;
  user?: User | null;
};
