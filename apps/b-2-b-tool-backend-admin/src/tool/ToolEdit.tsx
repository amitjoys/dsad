import * as React from "react";

import {
  Edit,
  SimpleForm,
  EditProps,
  ReferenceInput,
  SelectInput,
  TextInput,
  BooleanInput,
  ReferenceArrayInput,
  SelectArrayInput,
} from "react-admin";

import { CategoryTitle } from "../category/CategoryTitle";
import { RatingTitle } from "../rating/RatingTitle";
import { ReviewTitle } from "../review/ReviewTitle";
import { SubcategoryTitle } from "../subcategory/SubcategoryTitle";

export const ToolEdit = (props: EditProps): React.ReactElement => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <ReferenceInput
          source="category.id"
          reference="Category"
          label="Category"
        >
          <SelectInput optionText={CategoryTitle} />
        </ReferenceInput>
        <TextInput label="createdBy" source="createdBy" />
        <div />
        <TextInput label="description" multiline source="description" />
        <TextInput label="features" multiline source="features" />
        <BooleanInput label="isFeatured" source="isFeatured" />
        <div />
        <TextInput label="name" source="name" />
        <TextInput label="pricingDetails" multiline source="pricingDetails" />
        <ReferenceArrayInput source="ratings" reference="Rating">
          <SelectArrayInput
            optionText={RatingTitle}
            parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
            format={(value: any) => value && value.map((v: any) => v.id)}
          />
        </ReferenceArrayInput>
        <ReferenceArrayInput source="reviews" reference="Review">
          <SelectArrayInput
            optionText={ReviewTitle}
            parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
            format={(value: any) => value && value.map((v: any) => v.id)}
          />
        </ReferenceArrayInput>
        <SelectInput
          source="status"
          label="status"
          choices={[{ label: "Option 1", value: "Option1" }]}
          optionText="label"
          allowEmpty
          optionValue="value"
        />
        <ReferenceInput
          source="subcategory.id"
          reference="Subcategory"
          label="Subcategory"
        >
          <SelectInput optionText={SubcategoryTitle} />
        </ReferenceInput>
        <TextInput label="website" source="website" />
      </SimpleForm>
    </Edit>
  );
};
