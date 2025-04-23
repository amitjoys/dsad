import { Subcategory } from "../subcategory/Subcategory";
import { Tool } from "../tool/Tool";

export type Category = {
  createdAt: Date;
  description: string | null;
  id: string;
  name: string | null;
  subcategories?: Array<Subcategory>;
  tools?: Array<Tool>;
  updatedAt: Date;
};
