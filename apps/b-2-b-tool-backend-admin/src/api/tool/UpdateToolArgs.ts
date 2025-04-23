import { ToolWhereUniqueInput } from "./ToolWhereUniqueInput";
import { ToolUpdateInput } from "./ToolUpdateInput";

export type UpdateToolArgs = {
  where: ToolWhereUniqueInput;
  data: ToolUpdateInput;
};
