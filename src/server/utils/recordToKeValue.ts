import { keyValue } from "../constant";

export const recordToKeValue = (
  input: string | Record<string, unknown>
): keyValue[] => {
  const result: keyValue[] = [];
  if (typeof input == "object") {
    for (const [key, value] of Object.entries(input)) result[key] = value;
  }
  return result;
};
