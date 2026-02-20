import { parse } from "fecha";

export const fechaCustomParser = (dateString) => {
  const japaneseMatch = dateString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (japaneseMatch) {
    return new Date(
      parseInt(japaneseMatch[1]),
      parseInt(japaneseMatch[2]) - 1,
      parseInt(japaneseMatch[3]),
    );
  }

  const formats = [
    "YYYY-MM-DD",
    "MM/DD/YYYY",
    "DD/MM/YYYY",
    "M/D/YYYY",
    "D/M/YYYY",
    "MM-DD-YYYY",
    "DD-MM-YYYY",
    "YYYY/MM/DD",
    "DD.MM.YYYY",
    "MMM D, YYYY",
    "MMMM D, YYYY",
    "D MMM YYYY",
    "D MMMM YYYY",
    "YYYYMMDD",
  ];

  for (let format of formats) {
    const result = parse(dateString, format);
    if (result && !isNaN(result.getTime())) {
      return result;
    }
  }

  return null;
};
