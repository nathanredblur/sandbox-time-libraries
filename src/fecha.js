import { parse } from "fecha";

export const fechaParser = (dateString) => {
  const formats = [
    "YYYY-MM-DD",
    "MM/DD/YYYY",
    "DD/MM/YYYY",
    "M/D/YYYY",
    "D/M/YYYY",
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

  const fallback = parse(dateString);
  return fallback && !isNaN(fallback.getTime()) ? fallback : null;
};
