import * as React from "react";

import {
  Show,
  SimpleShowLayout,
  ShowProps,
  ReferenceField,
  TextField,
  DateField,
  BooleanField,
  ReferenceManyField,
  Datagrid,
} from "react-admin";

import { REVIEW_TITLE_FIELD } from "../review/ReviewTitle";
import { TOOL_TITLE_FIELD } from "./ToolTitle";
import { USER_TITLE_FIELD } from "../user/UserTitle";
import { CATEGORY_TITLE_FIELD } from "../category/CategoryTitle";
import { SUBCATEGORY_TITLE_FIELD } from "../subcategory/SubcategoryTitle";

export const ToolShow = (props: ShowProps): React.ReactElement => {
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
        <ReferenceManyField reference="Rating" target="toolId" label="Ratings">
          <Datagrid rowClick="show" bulkActionButtons={false}>
            <DateField source="createdAt" label="Created At" />
            <TextField label="ID" source="id" />
            <ReferenceField
              label="Review"
              source="review.id"
              reference="Review"
            >
              <TextField source={REVIEW_TITLE_FIELD} />
            </ReferenceField>
            <TextField label="score" source="score" />
            <ReferenceField label="Tool" source="tool.id" reference="Tool">
              <TextField source={TOOL_TITLE_FIELD} />
            </ReferenceField>
            <DateField source="updatedAt" label="Updated At" />
            <ReferenceField label="User" source="user.id" reference="User">
              <TextField source={USER_TITLE_FIELD} />
            </ReferenceField>
          </Datagrid>
        </ReferenceManyField>
        <ReferenceManyField reference="Review" target="toolId" label="Reviews">
          <Datagrid rowClick="show" bulkActionButtons={false}>
            <TextField label="body" source="body" />
            <DateField source="createdAt" label="Created At" />
            <TextField label="ID" source="id" />
            <BooleanField label="published" source="published" />
            <TextField label="reviewDate" source="reviewDate" />
            <TextField label="title" source="title" />
            <ReferenceField label="Tool" source="tool.id" reference="Tool">
              <TextField source={TOOL_TITLE_FIELD} />
            </ReferenceField>
            <DateField source="updatedAt" label="Updated At" />
            <ReferenceField label="User" source="user.id" reference="User">
              <TextField source={USER_TITLE_FIELD} />
            </ReferenceField>
          </Datagrid>
        </ReferenceManyField>
      </SimpleShowLayout>
    </Show>
  );
};
