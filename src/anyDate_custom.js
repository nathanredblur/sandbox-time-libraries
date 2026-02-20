import parser from "any-date-parser";

export const anyDateCustomParser = (dateString) => {
  // Handle XX/XX/YYYY and XX-XX-YYYY manually — the library's parsing
  // for these patterns is inconsistent across browsers (Node vs Chrome).
  const slashHyphenMatch = dateString.match(
    /^(\d{1,2})([-/])(\d{1,2})\2(\d{4})$/,
  );
  if (slashHyphenMatch) {
    const [, a, , b, yearStr] = slashHyphenMatch;
    const n1 = parseInt(a);
    const n2 = parseInt(b);
    const year = parseInt(yearStr);

    let month, day;
    if (n1 > 12 && n2 <= 12) {
      day = n1;
      month = n2;
    } else if (n2 > 12 && n1 <= 12) {
      month = n1;
      day = n2;
    } else {
      month = n1;
      day = n2;
    }

    return new Date(year, month - 1, day);
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
