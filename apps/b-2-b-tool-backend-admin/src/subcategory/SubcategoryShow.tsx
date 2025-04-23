import * as React from "react";

import {
  Show,
  SimpleShowLayout,
  ShowProps,
  ReferenceField,
  TextField,
  DateField,
  ReferenceManyField,
  Datagrid,
  BooleanField,
} from "react-admin";

import { CATEGORY_TITLE_FIELD } from "../category/CategoryTitle";
import { SUBCATEGORY_TITLE_FIELD } from "./SubcategoryTitle";

export const SubcategoryShow = (props: ShowProps): React.ReactElement => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <ReferenceField
          label="Category"
          source="category.id"
          reference="Category"
        >
          <TextField source={CATEGORY_TITLE_FIELD} />
        </ReferenceField>
        <DateField source="createdAt" label="Created At" />
        <TextField label="description" source="description" />
        <TextField label="ID" source="id" />
        <TextField label="name" source="name" />
        <DateField source="updatedAt" label="Updated At" />
        <ReferenceManyField
          reference="Tool"
          target="subcategoryId"
          label="Tools"
        >
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
            <TextField label="website" source="website" />
          </Datagrid>
        </ReferenceManyField>
      </SimpleShowLayout>
    </Show>
  );
};
