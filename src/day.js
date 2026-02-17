import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const dayParser = (dateString) => {
  const formats = [
    "YYYY-MM-DD",
    "MM/DD/YYYY",
    "DD/MM/YYYY",
    "M/D/YYYY",
    "D/M/YYYY",
    "MM-DD-YYYY",
    "DD-MM-YYYY",
    "M-D-YYYY",
    "D-M-YYYY",
    "YYYY/MM/DD",
    "DD.MM.YYYY",
    "MMM D, YYYY",
    "MMMM D, YYYY",
    "D MMM YYYY",
    "D MMMM YYYY",
    "YYYY年M月D日",
    "YYYYMMDD",
  ];

  for (let format of formats) {
    const parsed = dayjs(dateString, format, true);
    if (parsed.isValid()) {
      return parsed.toDate();
    }
  }

  const fallback = dayjs(dateString);
  return fallback.isValid() ? fallback.toDate() : null;
};
