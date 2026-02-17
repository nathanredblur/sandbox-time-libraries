import { parse, isValid, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";

export const dateFnsParser = (dateString) => {
  // ISO format
  const isoDate = parseISO(dateString);
  if (isValid(isoDate)) return isoDate;

  // Formatos específicos
  const formats = [
    "yyyy-MM-dd",
    "MM/dd/yyyy",
    "dd/MM/yyyy",
    "M/d/yyyy",
    "d/M/yyyy",
    "MM-dd-yyyy",
    "dd-MM-yyyy",
    "M-d-yyyy",
    "d-M-yyyy",
    "yyyy/MM/dd",
    "yyyy/M/d",
    "dd.MM.yyyy",
    "d.M.yyyy",
    "MMM d, yyyy",
    "MMMM d, yyyy",
    "d MMM yyyy",
    "d MMMM yyyy",
    "yyyyMMdd",
  ];

  const referenceDate = new Date(2000, 0, 1);

  for (let format of formats) {
    const parsedDate = parse(dateString, format, referenceDate, {
      locale: enUS,
    });
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }

  // Formato japonés
  const japaneseMatch = dateString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (japaneseMatch) {
    const date = new Date(
      parseInt(japaneseMatch[1]),
      parseInt(japaneseMatch[2]) - 1,
      parseInt(japaneseMatch[3])
    );
    if (isValid(date)) return date;
  }

  return null;
};
