import * as React from "react";

import {
  Create,
  SimpleForm,
  CreateProps,
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

export const ReviewCreate = (props: CreateProps): React.ReactElement => {
  return (
    <Create {...props}>
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
    </Create>
  );
};
