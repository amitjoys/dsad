import * as React from "react";

import {
  List,
  Datagrid,
  ListProps,
  TextField,
  DateField,
  BooleanField,
  ReferenceField,
} from "react-admin";

import Pagination from "../Components/Pagination";
import { TOOL_TITLE_FIELD } from "../tool/ToolTitle";
import { USER_TITLE_FIELD } from "../user/UserTitle";

export const ReviewList = (props: ListProps): React.ReactElement => {
  return (
    <List {...props} title={"Reviews"} perPage={50} pagination={<Pagination />}>
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
        </ReferenceField>{" "}
      </Datagrid>
    </List>
  );
};
