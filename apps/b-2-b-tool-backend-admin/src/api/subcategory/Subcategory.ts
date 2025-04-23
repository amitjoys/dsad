import { Category } from "../category/Category";
import { Tool } from "../tool/Tool";

export type Subcategory = {
  category?: Category | null;
  createdAt: Date;
  description: string | null;
  id: string;
  name: string | null;
  tools?: Array<Tool>;
  updatedAt: Date;
};
