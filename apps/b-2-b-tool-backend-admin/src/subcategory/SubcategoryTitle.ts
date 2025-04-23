import { Subcategory as TSubcategory } from "../api/subcategory/Subcategory";

export const SUBCATEGORY_TITLE_FIELD = "name";

export const SubcategoryTitle = (record: TSubcategory): string => {
  return record.name?.toString() || String(record.id);
};
