import { Tool as TTool } from "../api/tool/Tool";

export const TOOL_TITLE_FIELD = "name";

export const ToolTitle = (record: TTool): string => {
  return record.name?.toString() || String(record.id);
};
