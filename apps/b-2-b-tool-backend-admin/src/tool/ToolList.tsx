import * as React from "react";

import {
  List,
  Datagrid,
  ListProps,
  ReferenceField,
  TextField,
  DateField,
  BooleanField,
} from "react-admin";

import Pagination from "../Components/Pagination";
import { CATEGORY_TITLE_FIELD } from "../category/CategoryTitle";
import { SUBCATEGORY_TITLE_FIELD } from "../subcategory/SubcategoryTitle";

export const ToolList = (props: ListProps): React.ReactElement => {
  return (
    <List {...props} title={"Tools"} perPage={50} pagination={<Pagination />}>
      <Datagrid rowClick="show" bulkActionButtons={false}>
        <ReferenceField
          label="Category"
          source="category.id"
          reference="Category"
        >
          <TextField source={CATEGORY_TITLE_FIELD} />
        </ReferenceField>
        <DateField source="createdAt" label="Created At" />
        <TextField label="createdBy" source="createdBy" />
        <TextField label="csvUploadFile" source="csvUploadFile" />
        <TextField label="description" source="description" />
        <TextField label="features" source="features" />
        <TextField label="ID" source="id" />
        <BooleanField label="isFeatured" source="isFeatured" />
        <TextField label="logo" source="logo" />
        <TextField label="name" source="name" />
        <TextField label="pricingDetails" source="pricingDetails" />
        <TextField label="status" source="status" />
        <ReferenceField
          label="Subcategory"
          source="subcategory.id"
          reference="Subcategory"
        >
          <TextField source={SUBCATEGORY_TITLE_FIELD} />
        </ReferenceField>
        <DateField source="updatedAt" label="Updated At" />
        <TextField label="website" source="website" />{" "}
      </Datagrid>
    </List>
  );
};
