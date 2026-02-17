import parser from "any-date-parser";

export const anyDateParser = (dateString) => {
  const result = parser.attempt(dateString);

  if (!result) return null;

  return new Date(
    result.year,
    result.month - 1,
    result.day,
    result.hour || 0,
    result.minute || 0,
    result.second || 0
  );
};
