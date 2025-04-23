import { Category } from "../category/Category";
import { JsonValue } from "type-fest";
import { Rating } from "../rating/Rating";
import { Review } from "../review/Review";
import { Subcategory } from "../subcategory/Subcategory";

export type Tool = {
  category?: Category | null;
  createdAt: Date;
  createdBy: string | null;
  csvUploadFile: JsonValue;
  description: string | null;
  features: string | null;
  id: string;
  isFeatured: boolean | null;
  logo: JsonValue;
  name: string | null;
  pricingDetails: string | null;
  ratings?: Array<Rating>;
  reviews?: Array<Review>;
  status?: "Option1" | null;
  subcategory?: Subcategory | null;
  updatedAt: Date;
  website: string | null;
};
