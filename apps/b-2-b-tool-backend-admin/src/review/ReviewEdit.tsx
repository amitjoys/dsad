import * as React from "react";

import {
  Edit,
  SimpleForm,
  EditProps,
  TextInput,
  BooleanInput,
  ReferenceArrayInput,
  SelectArrayInput,
  DateTimeInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";

import { RatingTitle } from "../rating/RatingTitle";
import { ToolTitle } from "../tool/ToolTitle";
import { UserTitle } from "../user/UserTitle";

export const ReviewEdit = (props: EditProps): React.ReactElement => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput label="body" multiline source="body" />
        <BooleanInput label="published" source="published" />
        <ReferenceArrayInput source="ratings" reference="Rating">
          <SelectArrayInput
            optionText={RatingTitle}
            parse={(value: any) => value && value.map((v: any) => ({ id: v }))}
            format={(value: any) => value && value.map((v: any) => v.id)}
          />
        </ReferenceArrayInput>
        <DateTimeInput label="reviewDate" source="reviewDate" />
        <TextInput label="title" source="title" />
        <ReferenceInput source="tool.id" reference="Tool" label="Tool">
          <SelectInput optionText={ToolTitle} />
        </ReferenceInput>
        <ReferenceInput source="user.id" reference="User" label="User">
          <SelectInput optionText={UserTitle} />
        </ReferenceInput>
      </SimpleForm>
    </Edit>
  );
};
