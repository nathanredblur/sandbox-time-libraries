import * as chrono from "chrono-node";

export const chronoCustomParser = (dateString) => {
  const japaneseMatch = dateString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (japaneseMatch) {
    const [, y, m, d] = japaneseMatch;
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  }

  const compactMatch = dateString.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (compactMatch) {
    const [, y, m, d] = compactMatch;
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  }

  return chrono.parseDate(dateString);
};
