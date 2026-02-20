import { DateTime } from "luxon";

export const luxonCustomParser = (dateString) => {
  let dt = DateTime.fromISO(dateString);
  if (dt.isValid) return dt.toJSDate();

  dt = DateTime.fromRFC2822(dateString);
  if (dt.isValid) return dt.toJSDate();

  dt = DateTime.fromSQL(dateString);
  if (dt.isValid) return dt.toJSDate();

  const formats = [
    "M/d/yyyy",
    "d/M/yyyy",
    "M-d-yyyy",
    "d-M-yyyy",
    "yyyy/M/d",
    "d.M.yyyy",
    "MMM d, yyyy",
    "MMMM d, yyyy",
    "d MMM yyyy",
    "d MMMM yyyy",
    "yyyyMMdd",
  ];

  for (let format of formats) {
    dt = DateTime.fromFormat(dateString, format);
    if (dt.isValid) return dt.toJSDate();
  }

  const japaneseMatch = dateString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (japaneseMatch) {
    dt = DateTime.fromObject({
      year: parseInt(japaneseMatch[1]),
      month: parseInt(japaneseMatch[2]),
      day: parseInt(japaneseMatch[3]),
    });
    if (dt.isValid) return dt.toJSDate();
  }

  return null;
};
