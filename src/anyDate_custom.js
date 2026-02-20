import parser from "any-date-parser";

export const anyDateCustomParser = (dateString) => {
  // Detect DD/MM patterns where first number > 12 (must be day, not month).
  // Only for / and - separators — dots are already handled as DD.MM by the library.
  const ddmmMatch = dateString.match(/^(\d{1,2})([-/])(\d{1,2})\2(\d{4})$/);
  if (ddmmMatch) {
    const [, first, sep, second, year] = ddmmMatch;
    if (parseInt(first) > 12 && parseInt(second) <= 12) {
      const swapped = `${second}${sep}${first}${sep}${year}`;
      const result = parser.attempt(swapped);
      if (result && result.year) {
        return new Date(
          result.year,
          result.month - 1,
          result.day,
          result.hour || 0,
          result.minute || 0,
          result.second || 0,
        );
      }
    }
  }

  const result = parser.attempt(dateString);
  if (!result || !result.year) return null;

  return new Date(
    result.year,
    result.month - 1,
    result.day,
    result.hour || 0,
    result.minute || 0,
    result.second || 0,
  );
};
